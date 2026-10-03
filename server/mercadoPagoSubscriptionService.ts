import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import type express from "express";
import { updateUserSubscriptionInFirestore } from "./firebaseAdmin.js";
import { Pool } from "pg";
export { createSubscription } from "./services/mercadopago.js";

export type PlatformPlanId = "starter" | "growth" | "scale";
export type BillingCycle = "monthly" | "annual";
export type SubscriptionStatus = "pending" | "approved" | "rejected" | "cancelled" | "paused";

export const PLATFORM_PLAN_PRICES: Record<PlatformPlanId, { name: string; monthlyARS: number; annualARS: number }> = {
  starter: { name: "Starter", monthlyARS: 29900, annualARS: 23900 },
  growth: { name: "Growth", monthlyARS: 59900, annualARS: 47900 },
  scale: { name: "Scale Enterprise", monthlyARS: 119900, annualARS: 95900 },
};

export function getPlatformMercadoPagoToken(): string | null {
  return (
    process.env.PLATFORM_MERCADOPAGO_ACCESS_TOKEN?.trim() ||
    process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() ||
    null
  );
}

export function getPlatformWebhookSecret(): string | null {
  return process.env.PLATFORM_MERCADOPAGO_WEBHOOK_SECRET?.trim() || null;
}

export function getMercadoPagoPreapprovalPlanId(
  planId: PlatformPlanId,
  cycle: BillingCycle
): string | null {
  const envVarName = `PLATFORM_MP_PLAN_ID_${planId.toUpperCase()}_${cycle.toUpperCase()}`;
  const envValue = process.env[envVarName]?.trim();
  return envValue || null;
}

/**
 * Validates the HMAC-SHA256 signature sent by Mercado Pago Webhooks in the headers
 */
export function verifyMercadoPagoSignature(req: express.Request, resourceId: string): boolean {
  const secret = getPlatformWebhookSecret();
  if (!secret) {
    console.warn("[MercadoPago Webhook] PLATFORM_MERCADOPAGO_WEBHOOK_SECRET is not configured.");
    return false;
  }
  if (!resourceId) return false;

  const signature = String(req.header("x-signature") || "");
  const requestId = String(req.header("x-request-id") || "");
  const ts = signature.match(/(?:^|,)ts=([^,]+)/)?.[1];
  const v1 = signature.match(/(?:^|,)v1=([^,]+)/)?.[1];

  if (!ts || !v1 || !requestId) {
    console.warn("[MercadoPago Webhook] Missing required signature headers (ts, v1, or x-request-id).");
    return false;
  }

  const manifest = `id:${resourceId};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return expected.length === v1.length && timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

/**
 * Extracts the resource ID from request headers, query params or body
 */
export function extractResourceIdFromWebhook(req: express.Request): string | null {
  const dataId = req.body?.data?.id;
  if (dataId) return String(dataId).trim();

  const bodyId = req.body?.id;
  if (bodyId) return String(bodyId).trim();

  const queryId = req.query["data.id"] || req.query.id || req.query.resource_id;
  if (queryId) return String(queryId).trim();

  return null;
}

export function mapSubscriptionStatus(statusValue: unknown): SubscriptionStatus {
  const s = String(statusValue || "").toLowerCase().trim();
  if (s === "authorized" || s === "approved" || s === "active") return "approved";
  if (s === "paused") return "paused";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "rejected") return "rejected";
  return "pending";
}

export interface CreateSubscriptionParams {
  userId: string;
  planId: PlatformPlanId;
  billingCycle: BillingCycle;
  payerEmail: string;
  appUrl: string;
  dbPool?: Pool | null;
}

/**
 * Creates a recurring preapproval subscription via the Mercado Pago API
 * using official PLATFORM_MP_PLAN_ID_* identifiers or recurring terms.
 */
export async function createMercadoPagoSubscription(params: CreateSubscriptionParams) {
  const accessToken = getPlatformMercadoPagoToken();
  if (!accessToken) {
    throw new Error("PLATFORM_MERCADOPAGO_ACCESS_TOKEN must be configured to create subscriptions.");
  }

  const planMeta = PLATFORM_PLAN_PRICES[params.planId] || PLATFORM_PLAN_PRICES.starter;
  const unitPrice = params.billingCycle === "annual" ? planMeta.annualARS * 12 : planMeta.monthlyARS;
  const externalReference = `clientum_platform_${params.userId}_${Date.now()}_${randomBytes(4).toString("hex")}`;
  const preapprovalPlanId = getMercadoPagoPreapprovalPlanId(params.planId, params.billingCycle);

  const payload: Record<string, unknown> = {
    reason: `Suscripción ClientumCRM ${planMeta.name} (${params.billingCycle === "annual" ? "Anual" : "Mensual"})`,
    external_reference: externalReference,
    payer_email: params.payerEmail,
    back_url: `${params.appUrl}/app?billing=subscription`,
    notification_url: `${params.appUrl}/api/webhooks/mercadopago`,
  };

  // If preapproval plan ID is configured, attach it to use the official plan
  if (preapprovalPlanId) {
    payload.preapproval_plan_id = preapprovalPlanId;
    console.log(`[MercadoPago] Creating subscription with official plan ID: ${preapprovalPlanId}`);
  } else {
    // Otherwise configure auto_recurring parameters
    payload.auto_recurring = {
      frequency: params.billingCycle === "annual" ? 12 : 1,
      frequency_type: "months",
      transaction_amount: unitPrice,
      currency_id: "ARS",
    };
    console.log(`[MercadoPago] Creating subscription with auto_recurring amount: $${unitPrice} ARS`);
  }

  const response = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": externalReference,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json().catch(() => ({})) as {
    id?: string;
    init_point?: string;
    status?: string;
    message?: string;
    error?: string;
  };

  if (!response.ok || !resData.init_point) {
    console.error("[MercadoPago] Preapproval creation failed:", response.status, resData);
    throw new Error(resData.message || resData.error || "Mercado Pago rechazó la creación de la suscripción.");
  }

  const checkoutId = `mp_sub_${Date.now()}_${randomBytes(4).toString("hex")}`;

  // Store in Firestore
  await updateUserSubscriptionInFirestore({
    userId: params.userId,
    email: params.payerEmail,
    externalReference,
    status: "pending",
    planId: params.planId,
    billingCycle: params.billingCycle,
    subscriptionId: resData.id,
    initPoint: resData.init_point,
    amount: unitPrice,
    currency: "ARS",
  });

  // Also record in PostgreSQL if pool is available
  if (params.dbPool) {
    try {
      await params.dbPool.query(
        `INSERT INTO clientum_platform_billing_checkouts
          (id, clerk_user_id, plan_id, external_reference, preference_id, provider_subscription_id,
           amount, currency, payer_email, init_point, preapproval_plan_id, billing_cycle)
         VALUES ($1, $2, $3, $4, NULL, $5, $6, 'ARS', $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING`,
        [
          checkoutId,
          params.userId,
          params.planId,
          externalReference,
          resData.id || null,
          unitPrice,
          params.payerEmail,
          resData.init_point,
          preapprovalPlanId || null,
          params.billingCycle,
        ]
      );
    } catch (e: any) {
      console.warn("[PostgreSQL] Failed to persist checkout:", e.message);
    }
  }

  return {
    checkoutId,
    checkoutUrl: resData.init_point,
    subscriptionId: resData.id,
    externalReference,
    plan: planMeta.name,
    amount: unitPrice,
    currency: "ARS",
  };
}

/**
 * Processes incoming webhook notifications from Mercado Pago
 * Validates HMAC signature, inspects event, and updates Firestore state
 */
export async function handleIncomingMercadoPagoWebhook(
  req: express.Request,
  dbPool?: Pool | null
): Promise<{ success: boolean; eventType?: string; status?: string; message?: string }> {
  const resourceId = extractResourceIdFromWebhook(req);
  if (!resourceId) {
    return { success: false, message: "No resource ID found in webhook payload." };
  }

  // Validate webhook HMAC signature
  const isSignatureValid = verifyMercadoPagoSignature(req, resourceId);
  if (!isSignatureValid) {
    console.warn(`[MercadoPago Webhook] Invalid signature for resource: ${resourceId}`);
    // If webhook secret is not set, reject in production
    if (process.env.NODE_ENV === "production" || getPlatformWebhookSecret()) {
      return { success: false, message: "Invalid webhook signature." };
    }
  }

  const accessToken = getPlatformMercadoPagoToken();
  if (!accessToken) {
    return { success: false, message: "Mercado Pago Access Token not configured." };
  }

  const notificationType = String(
    req.query.type ||
    req.query.topic ||
    req.body?.type ||
    req.body?.action ||
    ""
  ).trim().toLowerCase();

  const isSubscription =
    notificationType.includes("preapproval") ||
    notificationType.includes("subscription") ||
    req.body?.action === "preapproval_created";

  const resourceUrl = isSubscription
    ? `https://api.mercadopago.com/preapproval/${encodeURIComponent(resourceId)}`
    : `https://api.mercadopago.com/v1/payments/${encodeURIComponent(resourceId)}`;

  console.log(`[MercadoPago Webhook] Fetching resource details from: ${resourceUrl}`);

  const res = await fetch(resourceUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    console.error(`[MercadoPago Webhook] Failed to fetch resource ${resourceId}: ${res.status}`);
    return { success: false, message: `Resource fetch failed with status ${res.status}` };
  }

  const resource = (await res.json()) as {
    id?: string;
    status?: string;
    external_reference?: string;
    payer_email?: string;
    init_point?: string;
    preapproval_plan_id?: string;
    transaction_amount?: number;
    payer?: { email?: string };
  };

  const payerEmail = resource.payer_email || resource.payer?.email;
  const status = mapSubscriptionStatus(resource.status);

  console.log(`[MercadoPago Webhook] Event '${notificationType}' processed. Resource status: ${resource.status} -> Mapped: ${status}`);

  // Update in Firestore
  await updateUserSubscriptionInFirestore({
    email: payerEmail,
    externalReference: resource.external_reference,
    status,
    subscriptionId: isSubscription ? String(resource.id || resourceId) : undefined,
    paymentId: !isSubscription ? String(resource.id || resourceId) : undefined,
    initPoint: resource.init_point,
    amount: resource.transaction_amount,
  });

  // Update in PostgreSQL if table exists
  if (dbPool && resource.external_reference) {
    try {
      if (isSubscription) {
        await dbPool.query(
          `UPDATE clientum_platform_billing_checkouts
           SET status = $1, provider_subscription_id = $2,
               payer_email = COALESCE($3, payer_email),
               init_point = COALESCE($4, init_point), updated_at = NOW()
           WHERE external_reference = $5`,
          [
            status,
            String(resource.id || resourceId),
            payerEmail || null,
            resource.init_point || null,
            resource.external_reference,
          ]
        );
      } else {
        await dbPool.query(
          `UPDATE clientum_platform_billing_checkouts
           SET status = $1, provider_payment_id = $2, updated_at = NOW()
           WHERE external_reference = $3`,
          [status, String(resource.id || resourceId), resource.external_reference]
        );
      }
    } catch (e: any) {
      console.warn("[PostgreSQL] Webhook database update error:", e.message);
    }
  }

  return {
    success: true,
    eventType: notificationType,
    status,
  };
}
