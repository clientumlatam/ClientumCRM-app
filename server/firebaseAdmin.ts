import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth, type DecodedIdToken } from "firebase-admin/auth";

type FirebaseServiceAccount = {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
};

type FirebaseAdminState = {
  auth: Auth | null;
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
      error: "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.",
    };
    return cachedState;
  }

  const { projectId, clientEmail, privateKey } = serviceAccount;
  if (!projectId || !clientEmail || !privateKey) {
    cachedState = {
      auth: null,
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
    cachedState = { auth: getAuth(app), error: null };
  } catch (error) {
    cachedState = {
      auth: null,
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

export async function verifyFirebaseIdToken(token: string): Promise<DecodedIdToken | null> {
  const state = getFirebaseAdminState();
  if (!state.auth) return null;

  try {
    return await state.auth.verifyIdToken(token);
  } catch {
    return null;
  }
}