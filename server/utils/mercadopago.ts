import { createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";

/**
 * Validates incoming Mercado Pago webhook payloads using the PLATFORM_MERCADOPAGO_WEBHOOK_SECRET
 * using HMAC-SHA256 and constant-time string comparison (timingSafeEqual).
 *
 * Header structure expected from Mercado Pago:
 * - x-signature: ts=...,v1=...
 * - x-request-id: ...
 */
export function verifySignature(req: Request | { header: (name: string) => string | undefined; headers?: Record<string, any> }, resourceId: string): boolean {
  const secret = process.env.PLATFORM_MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret || !resourceId) {
    console.warn("[MercadoPago Utils] Missing secret or resourceId for signature verification.");
    return false;
  }

  const getHeader = (name: string): string => {
    if (typeof (req as any).header === "function") {
      return String((req as any).header(name) || "");
    }
    const headers = (req as any).headers || {};
    return String(headers[name.toLowerCase()] || headers[name] || "");
  };

  const signature = getHeader("x-signature");
  const requestId = getHeader("x-request-id");

  const ts = signature.match(/(?:^|,)ts=([^,]+)/)?.[1];
  const v1 = signature.match(/(?:^|,)v1=([^,]+)/)?.[1];

  if (!ts || !v1 || !requestId) {
    console.warn("[MercadoPago Utils] Missing ts, v1 or x-request-id in headers.");
    return false;
  }

  // Official manifest format required by Mercado Pago: id:{id};request-id:{request-id};ts:{ts};
  const manifest = `id:${resourceId};request-id:${requestId};ts:${ts};`;
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

/**
 * Helper to extract resource ID from various Mercado Pago payload structures
 */
export function extractResourceId(req: Request | { body?: any; query?: any }): string | null {
  const body = req.body || {};
  const query = req.query || {};

  const resourceId =
    body?.data?.id ||
    body?.id ||
    query["data.id"] ||
    query.id ||
    query.resource_id;

  return resourceId ? String(resourceId).trim() : null;
}

/**
 * Normalizes Mercado Pago subscription and payment status strings
 */
export function normalizeSubscriptionStatus(
  statusValue?: string
): "approved" | "pending" | "cancelled" | "rejected" | "paused" {
  const s = String(statusValue || "").toLowerCase().trim();
  if (s === "authorized" || s === "approved" || s === "active") return "approved";
  if (s === "paused") return "paused";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "rejected") return "rejected";
  return "pending";
}
