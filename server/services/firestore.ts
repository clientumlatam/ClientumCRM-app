import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirestoreAdmin } from "../firebaseAdmin.js";

export type SubscriptionStatus = "approved" | "pending" | "cancelled" | "rejected" | "paused";

export interface UpdateSubscriptionStatusParams {
  userId?: string;
  email?: string;
  externalReference?: string;
  status: SubscriptionStatus;
  planId?: string;
  billingCycle?: "monthly" | "annual";
  subscriptionId?: string;
  paymentId?: string;
  initPoint?: string;
  amount?: number;
  currency?: string;
  eventId?: string;
}

/**
 * Atomically updates the 'subscriptionStatus' field and related subscription objects
 * on the user document and subscriptions collection in Firestore.
 */
export async function updateUserSubscriptionStatusAtomically(
  params: UpdateSubscriptionStatusParams
): Promise<{ success: boolean; userId?: string; status: SubscriptionStatus }> {
  const db = getFirestoreAdmin() || getFirestore();
  if (!db) {
    console.warn("[Firestore Service] Database instance not available.");
    return { success: false, status: params.status };
  }

  try {
    let targetUserId = params.userId;

    // 1. Resolve userId from externalReference if present (clientum_platform_{userId}_...)
    if (!targetUserId && params.externalReference) {
      const match = params.externalReference.match(/clientum_platform_([^_]+)_/);
      if (match && match[1]) {
        targetUserId = match[1];
      }
    }

    // 2. Fallback: Lookup by payer email in users collection
    if (!targetUserId && params.email) {
      const usersSnap = await db
        .collection("users")
        .where("email", "==", params.email)
        .limit(1)
        .get();
      if (!usersSnap.empty) {
        targetUserId = usersSnap.docs[0].id;
      }
    }

    const now = new Date().toISOString();
    const isActive = params.status === "approved";
    const plan = params.planId || "starter";
    const billingCycle = params.billingCycle || "monthly";

    const subscriptionMetadata = {
      subscriptionStatus: params.status,
      status: params.status,
      plan,
      billingCycle,
      active: isActive,
      paymentMethod: "mercadopago",
      provider: "mercadopago",
      providerSubscriptionId: params.subscriptionId || null,
      providerPaymentId: params.paymentId || null,
      payerEmail: params.email || null,
      initPoint: params.initPoint || null,
      externalReference: params.externalReference || null,
      amount: params.amount || null,
      currency: params.currency || "ARS",
      updatedAt: now,
    };

    // Atomic Batch Operation
    const batch = db.batch();

    if (targetUserId) {
      const userRef = db.collection("users").doc(targetUserId);
      const subRef = db.collection("subscriptions").doc(targetUserId);
      const auditDocId =
        params.eventId ||
        `${params.subscriptionId || params.paymentId || "event"}_${Date.now()}`;
      const auditRef = db.collection("webhook_audit_logs").doc(auditDocId);

      // Explicitly set the new subscriptionStatus field on user document
      batch.set(
        userRef,
        {
          subscriptionStatus: params.status,
          subscriptionActive: isActive,
          plan,
          subscription: subscriptionMetadata,
          updatedAt: now,
        },
        { merge: true }
      );

      // Update the subscriptions collection document
      batch.set(
        subRef,
        {
          userId: targetUserId,
          ...subscriptionMetadata,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Write idempotent audit log entry
      batch.set(
        auditRef,
        {
          userId: targetUserId,
          provider: "mercadopago",
          subscriptionStatus: params.status,
          status: params.status,
          resourceId: params.subscriptionId || params.paymentId || null,
          externalReference: params.externalReference || null,
          processedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();
      console.log(
        `[Firestore Service] Atomic update committed for user ${targetUserId} -> subscriptionStatus: ${params.status}`
      );
      return { success: true, userId: targetUserId, status: params.status };
    } else if (params.externalReference) {
      // Record checkout state by externalReference if user document cannot be immediately resolved
      const checkoutRef = db
        .collection("billing_checkouts")
        .doc(params.externalReference);
      batch.set(
        checkoutRef,
        {
          ...subscriptionMetadata,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      await batch.commit();
      console.log(
        `[Firestore Service] Recorded checkout for ref ${params.externalReference} -> subscriptionStatus: ${params.status}`
      );
      return { success: true, status: params.status };
    }

    return { success: false, status: params.status };
  } catch (error) {
    console.error(
      "[Firestore Service] Error executing atomic subscription update:",
      error
    );
    return { success: false, status: params.status };
  }
}
