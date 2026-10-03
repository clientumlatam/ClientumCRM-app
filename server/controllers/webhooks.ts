import type { Request, Response } from "express";
import { verifySignature, extractResourceId, normalizeSubscriptionStatus } from "../utils/mercadopago.js";
import { updateUserSubscriptionStatusAtomically } from "../services/firestore.js";

/**
 * Controller principal para recibir notificaciones Webhook de Mercado Pago
 */
export async function handleMercadoPagoWebhook(req: Request, res: Response): Promise<void> {
  // 1. Respuesta 200 OK inmediata a Mercado Pago para confirmar recepción
  res.sendStatus(200);

  try {
    // 2. Extraer el resourceId de la notificación
    const resourceId = extractResourceId(req);

    if (!resourceId) {
      console.warn("[MercadoPago Webhook Controller] No se encontró resourceId en la petición.");
      return;
    }

    // 3. Validar firma criptográfica usando PLATFORM_MERCADOPAGO_WEBHOOK_SECRET
    const isValidSignature = verifySignature(req, resourceId);
    if (!isValidSignature && (process.env.NODE_ENV === "production" || process.env.PLATFORM_MERCADOPAGO_WEBHOOK_SECRET)) {
      console.warn(`[MercadoPago Webhook Controller] Firma inválida rechazada para el recurso: ${resourceId}`);
      return;
    }

    const accessToken = process.env.PLATFORM_MERCADOPAGO_ACCESS_TOKEN?.trim();
    if (!accessToken) {
      console.error("[MercadoPago Webhook Controller] PLATFORM_MERCADOPAGO_ACCESS_TOKEN no configurado.");
      return;
    }

    // 4. Determinar tipo de evento (Suscripción recurrente vs Pago puntual)
    const notificationType = String(
      req.query.type || req.query.topic || req.body?.type || req.body?.action || ""
    ).toLowerCase();

    const isSubscription =
      notificationType.includes("preapproval") ||
      notificationType.includes("subscription") ||
      req.body?.action === "preapproval_created";

    const url = isSubscription
      ? `https://api.mercadopago.com/preapproval/${encodeURIComponent(resourceId)}`
      : `https://api.mercadopago.com/v1/payments/${encodeURIComponent(resourceId)}`;

    console.log(`[MercadoPago Webhook Controller] Consultando recurso en API: ${url}`);

    // 5. Consultar a Mercado Pago para obtener el estado oficial
    const mpRes = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!mpRes.ok) {
      console.error(`[MercadoPago Webhook Controller] Error al consultar recurso ${resourceId}: HTTP ${mpRes.status}`);
      return;
    }

    const resource = (await mpRes.json()) as {
      id?: string;
      status?: string;
      external_reference?: string;
      payer_email?: string;
      init_point?: string;
      transaction_amount?: number;
      preapproval_plan_id?: string;
      payer?: { email?: string };
    };

    const status = normalizeSubscriptionStatus(resource.status);
    const payerEmail = resource.payer_email || resource.payer?.email;

    // 6. Ejecutar la actualización atómica del campo subscriptionStatus en Firestore
    await updateUserSubscriptionStatusAtomically({
      email: payerEmail,
      externalReference: resource.external_reference,
      status,
      subscriptionId: isSubscription ? String(resource.id || resourceId) : undefined,
      paymentId: !isSubscription ? String(resource.id || resourceId) : undefined,
      initPoint: resource.init_point,
      amount: resource.transaction_amount,
      eventId: `${resourceId}_${Date.now()}`,
    });
  } catch (error: any) {
    console.error("[MercadoPago Webhook Controller] Error inesperado procesando webhook:", error?.message || error);
  }
}
