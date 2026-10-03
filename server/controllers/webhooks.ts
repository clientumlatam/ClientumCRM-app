import type { Request, Response } from "express";
import { verifySignature, extractResourceId, normalizeSubscriptionStatus } from "../utils/mercadopago.js";
import { updateUserSubscriptionStatusAtomically } from "../services/firestore.js";

/**
 * Controller principal Express para recibir y validar notificaciones Webhook de Mercado Pago.
 *
 * Características clave:
 * 1. Firma HMAC-SHA256 con PLATFORM_MERCADOPAGO_WEBHOOK_SECRET.
 * 2. Soporte nativo para eventos 'preapproval_created' y 'payment.created'.
 * 3. Consulta de estado oficial directo a la API REST de Mercado Pago.
 * 4. Actualización atómica del estado de suscripción en Firestore (users & subscriptions).
 */
export async function handleMercadoPagoWebhook(req: Request, res: Response): Promise<void> {
  // 1. Responder inmediatamente 200 OK a Mercado Pago para confirmar recepción del webhook
  res.status(200).send("OK");

  try {
    // 2. Extraer el ID del recurso (data.id o id) desde query params o body
    const resourceId = extractResourceId(req);

    if (!resourceId) {
      console.warn("[MercadoPago Webhook Controller] Petición descartada: No se encontró resourceId.");
      return;
    }

    // 3. Validar la firma criptográfica usando PLATFORM_MERCADOPAGO_WEBHOOK_SECRET
    const isValidSignature = verifySignature(req, resourceId);
    const secretConfigured = Boolean(process.env.PLATFORM_MERCADOPAGO_WEBHOOK_SECRET?.trim());

    if (!isValidSignature && (process.env.NODE_ENV === "production" || secretConfigured)) {
      console.warn(`[MercadoPago Webhook Controller] Firma inválida rechazada para el recurso: ${resourceId}`);
      return;
    }

    const accessToken = process.env.PLATFORM_MERCADOPAGO_ACCESS_TOKEN?.trim();
    if (!accessToken) {
      console.error("[MercadoPago Webhook Controller] Error: PLATFORM_MERCADOPAGO_ACCESS_TOKEN no está configurado.");
      return;
    }

    // 4. Identificar el tipo de evento (preapproval_created, payment.created, etc.)
    const eventType = String(
      req.body?.action || req.body?.type || req.query.type || req.query.topic || ""
    ).trim().toLowerCase();

    const isSubscriptionEvent =
      eventType === "preapproval_created" ||
      eventType.includes("preapproval") ||
      eventType.includes("subscription");

    const isPaymentEvent =
      eventType === "payment.created" ||
      eventType.includes("payment");

    console.log(`[MercadoPago Webhook Controller] Evento recibido: '${eventType || "notificación"}' para recurso ${resourceId}`);

    // 5. Consultar a la API oficial de Mercado Pago para verificar el recurso (evita spoofing)
    const resourceUrl = isSubscriptionEvent
      ? `https://api.mercadopago.com/preapproval/${encodeURIComponent(resourceId)}`
      : `https://api.mercadopago.com/v1/payments/${encodeURIComponent(resourceId)}`;

    const mpResponse = await fetch(resourceUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!mpResponse.ok) {
      console.error(`[MercadoPago Webhook Controller] Error al consultar recurso ${resourceId}: HTTP ${mpResponse.status}`);
      return;
    }

    const resourceData = (await mpResponse.json()) as {
      id?: string;
      status?: string;
      external_reference?: string;
      payer_email?: string;
      init_point?: string;
      transaction_amount?: number;
      preapproval_plan_id?: string;
      payer?: { email?: string };
    };

    const normalizedStatus = normalizeSubscriptionStatus(resourceData.status);
    const payerEmail = resourceData.payer_email || resourceData.payer?.email;

    console.log(
      `[MercadoPago Webhook Controller] Recurso verificado en MP: ID ${resourceData.id || resourceId} -> Estado: '${resourceData.status}' (Normalizado: '${normalizedStatus}')`
    );

    // 6. Ejecutar la actualización atómica del estado de suscripción en Firestore
    const updateResult = await updateUserSubscriptionStatusAtomically({
      email: payerEmail,
      externalReference: resourceData.external_reference,
      status: normalizedStatus,
      subscriptionId: isSubscriptionEvent ? String(resourceData.id || resourceId) : undefined,
      paymentId: isPaymentEvent || !isSubscriptionEvent ? String(resourceData.id || resourceId) : undefined,
      initPoint: resourceData.init_point,
      amount: resourceData.transaction_amount,
      eventId: `${resourceId}_${Date.now()}`,
    });

    if (updateResult.success) {
      console.log(
        `[MercadoPago Webhook Controller] Sincronización atómica exitosa en Firestore para usuario ${updateResult.userId || "checkout"} -> subscriptionStatus: '${normalizedStatus}'`
      );
    } else {
      console.warn(`[MercadoPago Webhook Controller] La actualización en Firestore no afectó ningún usuario para ref: ${resourceData.external_reference}`);
    }
  } catch (error: any) {
    console.error("[MercadoPago Webhook Controller] Error inesperado procesando webhook:", error?.message || error);
  }
}
