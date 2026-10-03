import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";
import { updateUserSubscriptionInFirestore } from "../firebaseAdmin.js";

export type PlanId = "starter" | "growth" | "scale";
export type BillingCycle = "monthly" | "annual";

export interface PlanConfig {
  name: string;
  monthlyAmountARS: number;
  annualAmountARS: number;
}

export const PLAN_PRICING_CATALOG: Record<PlanId, PlanConfig> = {
  starter: {
    name: "Starter",
    monthlyAmountARS: 29900,
    annualAmountARS: 23900,
  },
  growth: {
    name: "Growth",
    monthlyAmountARS: 59900,
    annualAmountARS: 47900,
  },
  scale: {
    name: "Scale Enterprise",
    monthlyAmountARS: 119900,
    annualAmountARS: 95900,
  },
};

export interface CreateSubscriptionOptions {
  userId: string;
  planId: PlanId | string;
  billingCycle: BillingCycle;
  payerEmail: string;
  appUrl?: string;
  backUrl?: string;
  notificationUrl?: string;
  cardTokenId?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId: string;
  initPoint: string;
  externalReference: string;
  checkoutUrl: string;
  planId: string;
  billingCycle: BillingCycle;
  status: string;
  preapprovalPlanId?: string | null;
}

/**
 * Resolves the official Mercado Pago Preapproval Plan ID from environment variables
 * Variable format: PLATFORM_MP_PLAN_ID_{PLAN}_{CYCLE}
 * e.g., PLATFORM_MP_PLAN_ID_STARTER_MONTHLY, PLATFORM_MP_PLAN_ID_GROWTH_ANNUAL
 */
export function getPreapprovalPlanId(planId: string, billingCycle: BillingCycle): string | null {
  const normalizedPlan = planId.toLowerCase().trim();
  const envKey = `PLATFORM_MP_PLAN_ID_${normalizedPlan.toUpperCase()}_${billingCycle.toUpperCase()}`;
  const planIdFromEnv = process.env[envKey]?.trim();
  return planIdFromEnv || null;
}

/**
 * Returns the effective Mercado Pago Access Token
 */
export function getMercadoPagoAccessToken(): string {
  const token =
    process.env.PLATFORM_MERCADOPAGO_ACCESS_TOKEN?.trim() ||
    process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "PLATFORM_MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno."
    );
  }
  return token;
}

/**
 * Creates a recurring preapproval subscription via the Mercado Pago API
 * using the configured PLATFORM_MP_PLAN_ID_* identifiers.
 */
export async function createSubscription(
  options: CreateSubscriptionOptions
): Promise<SubscriptionResult> {
  const accessToken = getMercadoPagoAccessToken();

  const normalizedPlan = (options.planId.toLowerCase() in PLAN_PRICING_CATALOG
    ? options.planId.toLowerCase()
    : "starter") as PlanId;

  const planMeta = PLAN_PRICING_CATALOG[normalizedPlan];
  const billingCycle = options.billingCycle === "annual" ? "annual" : "monthly";
  const unitPrice =
    billingCycle === "annual" ? planMeta.annualAmountARS * 12 : planMeta.monthlyAmountARS;

  const appUrl = (
    options.appUrl ||
    process.env.APP_URL ||
    "https://clientum.com"
  ).replace(/\/$/, "");

  // Unique external reference for idempotent tracking and Firestore linking
  const externalReference = `clientum_platform_${options.userId}_${Date.now()}_${randomBytes(4).toString("hex")}`;

  // Retrieve the preapproval plan ID from environment variables
  const preapprovalPlanId = getPreapprovalPlanId(normalizedPlan, billingCycle);

  const backUrl = options.backUrl || `${appUrl}/app?billing=subscription&ref=${encodeURIComponent(externalReference)}`;
  const notificationUrl = options.notificationUrl || `${appUrl}/api/webhooks/mercadopago`;

  const payload: Record<string, any> = {
    reason: `Suscripción ClientumCRM ${planMeta.name} (${billingCycle === "annual" ? "Anual" : "Mensual"})`,
    external_reference: externalReference,
    payer_email: options.payerEmail.trim().toLowerCase(),
    back_url: backUrl,
    notification_url: notificationUrl,
    status: "pending",
  };

  if (options.cardTokenId) {
    payload.card_token_id = options.cardTokenId;
  }

  // If the official preapproval plan ID is configured in .env, use it directly
  if (preapprovalPlanId) {
    payload.preapproval_plan_id = preapprovalPlanId;
    console.log(`[MercadoPago Service] Usando Preapproval Plan ID oficial: ${preapprovalPlanId}`);
  } else {
    // Fallback auto_recurring definition if plan ID is not set
    payload.auto_recurring = {
      frequency: billingCycle === "annual" ? 12 : 1,
      frequency_type: "months",
      transaction_amount: unitPrice,
      currency_id: "ARS",
    };
    console.log(`[MercadoPago Service] Creando suscripción con auto_recurring: $${unitPrice} ARS / ${billingCycle}`);
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

  const responseData = (await response.json().catch(() => ({}))) as {
    id?: string;
    init_point?: string;
    status?: string;
    message?: string;
    error?: string;
    cause?: any[];
  };

  if (!response.ok || !responseData.init_point) {
    const errorDetail = responseData.message || responseData.error || `HTTP ${response.status}`;
    console.error("[MercadoPago Service] Error al crear suscripción preapproval:", response.status, responseData);
    throw new Error(`Mercado Pago API error: ${errorDetail}`);
  }

  const subscriptionId = String(responseData.id);
  const initPoint = String(responseData.init_point);
  const initialStatus = String(responseData.status || "pending");

  // Save pending subscription in Firestore
  await updateUserSubscriptionInFirestore({
    userId: options.userId,
    email: options.payerEmail,
    externalReference,
    status: "pending",
    planId: normalizedPlan,
    billingCycle,
    subscriptionId,
    initPoint,
    amount: unitPrice,
    currency: "ARS",
  });

  return {
    success: true,
    subscriptionId,
    initPoint,
    checkoutUrl: initPoint,
    externalReference,
    planId: normalizedPlan,
    billingCycle,
    status: initialStatus,
    preapprovalPlanId,
  };
}

/**
 * Retrieves an existing preapproval subscription details from Mercado Pago
 */
export async function getSubscription(subscriptionId: string): Promise<Record<string, any>> {
  const accessToken = getMercadoPagoAccessToken();
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(subscriptionId)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve subscription ${subscriptionId}: HTTP ${response.status}`);
  }

  return await response.json();
}

/**
 * Cancels an active preapproval subscription via the Mercado Pago API
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const accessToken = getMercadoPagoAccessToken();
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(subscriptionId)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "cancelled" }),
  });

  return response.ok;
}

/**
 * Pauses an active preapproval subscription via the Mercado Pago API
 */
export async function pauseSubscription(subscriptionId: string): Promise<boolean> {
  const accessToken = getMercadoPagoAccessToken();
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(subscriptionId)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "paused" }),
  });

  return response.ok;
}

/**
 * Validates the HMAC-SHA256 signature from Mercado Pago Webhooks using PLATFORM_MERCADOPAGO_WEBHOOK_SECRET
 */
export function verifyWebhookSignature(
  xSignatureHeader: string,
  xRequestIdHeader: string,
  resourceId: string
): boolean {
  const secret = process.env.PLATFORM_MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret || !resourceId || !xSignatureHeader || !xRequestIdHeader) {
    return false;
  }

  const ts = xSignatureHeader.match(/(?:^|,)ts=([^,]+)/)?.[1];
  const v1 = xSignatureHeader.match(/(?:^|,)v1=([^,]+)/)?.[1];

  if (!ts || !v1) return false;

  const manifest = `id:${resourceId};request-id:${xRequestIdHeader};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return (
      expectedHash.length === v1.length &&
      timingSafeEqual(Buffer.from(expectedHash), Buffer.from(v1))
    );
  } catch {
    return false;
  }
}
