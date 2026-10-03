import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth, type DecodedIdToken } from "firebase-admin/auth";
import { getFirestore, type Firestore, FieldValue } from "firebase-admin/firestore";

type FirebaseServiceAccount = {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
};

type FirebaseAdminState = {
  auth: Auth | null;
  firestore: Firestore | null;
  error: string | null;
};

let cachedState: FirebaseAdminState | undefined;

function readServiceAccount(): FirebaseServiceAccount | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    try {
      const parsed = JSON.parse(json) as FirebaseServiceAccount;
      return {
        projectId: parsed.projectId?.trim(),
        clientEmail: parsed.clientEmail?.trim(),
        privateKey: parsed.privateKey?.replace(/\\n/g, "\n").trim(),
      };
    } catch {
      return null;
    }
  }

  return {
    projectId: (process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID)?.trim(),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim(),
  };
}

function getFirebaseAdminState(): FirebaseAdminState {
  if (cachedState) return cachedState;

  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    cachedState = {
      auth: null,
      firestore: null,
      error: "FIREBASE_SERVICE_ACCOUNT_JSON is not configured.",
    };
    return cachedState;
  }

  const { projectId, clientEmail, privateKey } = serviceAccount;
  if (!projectId || !clientEmail || !privateKey) {
    cachedState = {
      auth: null,
      firestore: null,
      error:
        "Firebase Admin authentication requires FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    };
    return cachedState;
  }

  try {
    const app: App =
      getApps()[0] ||
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    cachedState = {
      auth: getAuth(app),
      firestore: getFirestore(app),
      error: null,
    };
  } catch (error) {
    cachedState = {
      auth: null,
      firestore: null,
      error: error instanceof Error ? error.message : "Firebase Admin initialization failed.",
    };
  }

  return cachedState;
}

export function getFirebaseAdminAuthStatus(): { configured: boolean; error?: string } {
  const state = getFirebaseAdminState();
  return state.auth
    ? { configured: true }
    : { configured: false, error: state.error || "Firebase Admin is not configured." };
}

export function getFirestoreAdmin(): Firestore | null {
  const state = getFirebaseAdminState();
  return state.firestore;
}

export async function verifyFirebaseIdToken(token: string): Promise<DecodedIdToken | null> {
  const state = getFirebaseAdminState();
  if (!state.auth) return null;

  try {
    return await state.auth.verifyIdToken(token);
  } catch {
    return null;
  }
}

export interface FirestoreSubscriptionUpdateParams {
  userId?: string;
  email?: string;
  externalReference?: string;
  status: "approved" | "pending" | "cancelled" | "rejected" | "paused";
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
 * Updates user subscription and profile atomically in Firestore using atomic Batch writes and Transactions
 */
export async function updateUserSubscriptionInFirestore(
  params: FirestoreSubscriptionUpdateParams
): Promise<boolean> {
  const db = getFirestoreAdmin();
  if (!db) {
    console.warn("Firestore Admin not initialized; skipping subscription sync in Firestore.");
    return false;
  }

  try {
    const now = new Date().toISOString();
    let targetUserId = params.userId;

    // 1. If userId not given, attempt lookup by external reference (clientum_platform_{userId}_...)
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

    const subscriptionData = {
      status: params.status,
      plan: params.planId || "starter",
      billingCycle: params.billingCycle || "monthly",
      active: params.status === "approved",
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

    // 3. Perform Atomic Batch Write across all related Firestore collections
    const batch = db.batch();

    if (targetUserId) {
      const userRef = db.collection("users").doc(targetUserId);
      const subRef = db.collection("subscriptions").doc(targetUserId);

      batch.set(
        subRef,
        {
          userId: targetUserId,
          ...subscriptionData,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      batch.set(
        userRef,
        {
          subscription: subscriptionData,
          plan: params.planId || "starter",
          subscriptionActive: params.status === "approved",
          updatedAt: now,
        },
        { merge: true }
      );

      // Record idempotent audit event in webhook_events
      if (params.eventId || params.subscriptionId || params.paymentId) {
        const auditDocId = params.eventId || `${params.subscriptionId || params.paymentId}_${Date.now()}`;
        const auditRef = db.collection("webhook_audit_logs").doc(auditDocId);
        batch.set(
          auditRef,
          {
            userId: targetUserId,
            provider: "mercadopago",
            status: params.status,
            externalReference: params.externalReference || null,
            processedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      await batch.commit();
      console.log(`[Firestore Atomic] Subscription updated for user ${targetUserId} -> status: ${params.status}`);
      return true;
    } else if (params.externalReference) {
      // Store in billing_checkouts document atomically
      const checkoutRef = db.collection("billing_checkouts").doc(params.externalReference);
      batch.set(
        checkoutRef,
        {
          ...subscriptionData,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      await batch.commit();
      console.log(`[Firestore Atomic] Checkout recorded for external reference ${params.externalReference}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error executing atomic subscription update in Firestore:", error);
    return false;
  }
}
