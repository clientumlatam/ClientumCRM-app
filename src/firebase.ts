import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

// Firebase client configuration comes only from the platform environment.
// VITE_* values are public client configuration, not server secrets.
const metaEnv = (import.meta as any)?.env || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || appletConfig.apiKey || "",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain || "",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || "",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || "",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId || "",
  appId: metaEnv.VITE_FIREBASE_APP_ID || appletConfig.appId || "",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId || "",
};

export const isLiveFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

export const isDemoAuthFallbackEnabled = Boolean(metaEnv.DEV);

// Never initialize Firebase with an empty configuration. Firebase validates
// the API key during initialization, so doing so can crash the entire app
// before the local demo fallback has a chance to render.
let app: FirebaseApp | null = null;
if (isLiveFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { app };
export const isLiveFirebaseReady = Boolean(isLiveFirebaseConfigured && app);
export const auth: Auth = isLiveFirebaseReady
  ? getAuth(app as FirebaseApp)
  : (null as unknown as Auth);

export const db: Firestore = isLiveFirebaseReady
  ? (() => {
      try {
        const firestoreSettings = {
          experimentalForceLongPolling: true,
        };
        return appletConfig.firestoreDatabaseId
          ? initializeFirestore(app as FirebaseApp, firestoreSettings, appletConfig.firestoreDatabaseId)
          : initializeFirestore(app as FirebaseApp, firestoreSettings);
      } catch (err) {
        return appletConfig.firestoreDatabaseId
          ? getFirestore(app as FirebaseApp, appletConfig.firestoreDatabaseId)
          : getFirestore(app as FirebaseApp);
      }
    })()
  : (null as unknown as Firestore);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate connection to Firestore on initial boot without throwing unhandled rejection.
 */
export async function testFirestoreConnection(): Promise<boolean> {
  if (!isLiveFirebaseReady || !db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration.");
    }
    return false;
  }
}
testFirestoreConnection().catch(() => {});

/**
 * Subscribe to the real Firebase session when Firebase is configured.
 * The no-op branch keeps the local demo build renderable without pretending
 * that a demo session is a verified Firebase identity.
 */
export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  if (!isLiveFirebaseReady) {
    return () => {};
  }

  return onAuthStateChanged(
    auth,
    callback,
    (error) => {
      console.warn('Firebase auth state listener failed:', error);
      callback(null);
    },
  );
}

// Safe Analytics initialization
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && isLiveFirebaseReady && app && (import.meta as any)?.env?.MODE === 'production') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app as FirebaseApp);
      } catch (e) {
        console.warn('Analytics init note:', e);
      }
    }
  }).catch(() => {});
}

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
// Add standard user info scopes only by default to avoid "Google hasn't verified this app" warning
googleProvider.addScope('email');
googleProvider.addScope('profile');

/**
 * Helper to sync user profile into Firestore
 */
export async function syncUserProfileToFirestore(user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null; providerId?: string }): Promise<void> {
  if (!isLiveFirebaseReady || !db || !user?.uid) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      providerId: user.providerId || 'google.com',
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }
}

/**
 * Helper to sync CRM workspace snapshot to Firestore
 */
export async function syncWorkspaceToFirestore(userId: string, data: {
  opportunities?: any[];
  companies?: any[];
  people?: any[];
  tasks?: any[];
  activities?: any[];
  theme?: string;
  [key: string]: any;
}): Promise<void> {
  if (!isLiveFirebaseReady || !db || !userId) return;
  try {
    const workspaceRef = doc(db, 'users', userId, 'workspace', 'crm');
    await setDoc(workspaceRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync workspace snapshot to Firestore:', err);
  }
}

/**
 * Helper to fetch CRM workspace snapshot from Firestore
 */
export async function fetchWorkspaceFromFirestore(userId: string): Promise<{
  opportunities?: any[];
  companies?: any[];
  people?: any[];
  tasks?: any[];
  activities?: any[];
} | null> {
  if (!isLiveFirebaseReady || !db || !userId) return null;
  try {
    const workspaceRef = doc(db, 'users', userId, 'workspace', 'crm');
    const snap = await getDoc(workspaceRef);
    if (snap.exists()) {
      return snap.data() as any;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch workspace snapshot from Firestore:', err);
    return null;
  }
}

export type CRMSubcollectionName = 'opportunities' | 'companies' | 'people' | 'tasks' | 'activities';

/**
 * Real-time listener for user CRM subcollections (opportunities, companies, people, tasks, activities)
 */
export function subscribeToUserSubcollection<T = any>(
  userId: string,
  subcollectionName: CRMSubcollectionName,
  onData: (items: T[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!isLiveFirebaseReady || !db || !userId) {
    return () => {};
  }
  try {
    const colRef = collection(db, 'users', userId, subcollectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as T[];
        onData(items);
      },
      (err) => {
        console.warn(`Realtime subscription error on ${subcollectionName}:`, err);
        onError?.(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn(`Failed to attach listener for ${subcollectionName}:`, err);
    return () => {};
  }
}

/**
 * Save or update a single record in a user subcollection in real-time
 */
export async function saveUserSubcollectionRecord(
  userId: string,
  subcollectionName: CRMSubcollectionName,
  id: string,
  data: any
): Promise<void> {
  if (!isLiveFirebaseReady || !db || !userId || !id) return;
  try {
    const docRef = doc(db, 'users', userId, subcollectionName, id);
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, { ...cleanData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn(`Failed to save record to ${subcollectionName}/${id}:`, err);
  }
}

/**
 * Delete a single record from a user subcollection in real-time
 */
export async function deleteUserSubcollectionRecord(
  userId: string,
  subcollectionName: CRMSubcollectionName,
  id: string
): Promise<void> {
  if (!isLiveFirebaseReady || !db || !userId || !id) return;
  try {
    const docRef = doc(db, 'users', userId, subcollectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`Failed to delete record from ${subcollectionName}/${id}:`, err);
  }
}

/**
 * Seeds initial CRM data into user subcollections if they are empty
 */
export async function seedUserSubcollectionsIfEmpty(
  userId: string,
  initialData: {
    opportunities?: any[];
    companies?: any[];
    people?: any[];
    tasks?: any[];
    activities?: any[];
  }
): Promise<boolean> {
  if (!isLiveFirebaseReady || !db || !userId) return false;
  try {
    const subcollections: CRMSubcollectionName[] = [
      'opportunities',
      'companies',
      'people',
      'tasks',
      'activities',
    ];

    let seededAny = false;
    for (const sub of subcollections) {
      const items = initialData[sub];
      if (!items || items.length === 0) continue;

      const colRef = collection(db, 'users', userId, sub);
      const snap = await getDocs(colRef);
      if (snap.empty) {
        // Write batch in chunks of 450 (Firestore limit is 500)
        const batch = writeBatch(db);
        items.slice(0, 400).forEach((item) => {
          if (item?.id) {
            const itemDocRef = doc(db, 'users', userId, sub, item.id);
            const cleanItem = JSON.parse(JSON.stringify(item));
            batch.set(itemDocRef, cleanItem);
          }
        });
        await batch.commit();
        seededAny = true;
      }
    }
    return seededAny;
  } catch (err) {
    console.warn('Could not seed subcollections:', err);
    return false;
  }
}

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export const linkedinProvider = new OAuthProvider('linkedin.com');
linkedinProvider.addScope('r_liteprofile');
linkedinProvider.addScope('r_emailaddress');

// Authentication Helper Functions

export interface AuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    providerId: string;
  };
  token?: string;
  error?: string;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    if (isLiveFirebaseReady) {
      const cred = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(cred);
      const token = credential?.accessToken;
      return {
        success: true,
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || 'Google User',
          photoURL: cred.user.photoURL,
          providerId: 'google.com',
        },
        token: token || undefined,
      };
    }
  } catch (err: any) {
    console.warn('Live Google Sign-in error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Inicio de sesión cancelado por el usuario.' };
    }
    if (err.code === 'auth/popup-blocked') {
      return { success: false, error: 'El navegador bloqueó la ventana emergente de inicio de sesión. Permite las ventanas emergentes (popups) para continuar.' };
    }
    if (err.code === 'auth/operation-not-allowed') {
      return { success: false, error: 'Google Sign-in no está habilitado. Ve a Firebase Console > Authentication > Método de acceso y habilita Google.' };
    }
    if (err.code === 'auth/unauthorized-domain') {
      return { success: false, error: 'Este dominio no está autorizado en tu consola de Firebase.' };
    }
    if (isLiveFirebaseReady) {
      return { success: false, error: err.message || 'No se pudo iniciar sesión con Google.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Graceful fallback simulation for local demo/preview only.
  return {
    success: true,
    user: {
      uid: 'google-usr-' + Date.now(),
      email: 'clientum.google.user@gmail.com',
      displayName: 'Google Workspace Client',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      providerId: 'google.com',
    },
  };
}

/**
 * Sign in with Facebook / Meta
 */
export async function signInWithFacebook(): Promise<AuthResult> {
  try {
    if (isLiveFirebaseReady) {
      const cred = await signInWithPopup(auth, facebookProvider);
      return {
        success: true,
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || 'Meta Business User',
          photoURL: cred.user.photoURL,
          providerId: 'facebook.com',
        },
      };
    }
  } catch (err: any) {
    console.warn('Live Facebook Sign-in note:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Acceso con Facebook cancelado.' };
    }
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'No se pudo iniciar sesión con Facebook.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Graceful fallback for local demo only.
  return {
    success: true,
    user: {
      uid: 'meta-usr-' + Date.now(),
      email: 'alex.meta@clientum.dev',
      displayName: 'Alex Morgan (Meta Latam)',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      providerId: 'facebook.com',
    },
  };
}

/**
 * Sign in with LinkedIn
 */
export async function signInWithLinkedIn(): Promise<AuthResult> {
  try {
    if (isLiveFirebaseReady) {
      const cred = await signInWithPopup(auth, linkedinProvider);
      return {
        success: true,
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || 'LinkedIn Executive',
          photoURL: cred.user.photoURL,
          providerId: 'linkedin.com',
        },
      };
    }
  } catch (err: any) {
    console.warn('Live LinkedIn Sign-in note:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Acceso con LinkedIn cancelado.' };
    }
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'No se pudo iniciar sesión con LinkedIn.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Graceful fallback for local demo only.
  return {
    success: true,
    user: {
      uid: 'linkedin-usr-' + Date.now(),
      email: 'alex.morgan.b2b@linkedin-clientum.com',
      displayName: 'Alex Morgan | B2B Director',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      providerId: 'linkedin.com',
    },
  };
}

/**
 * Email and password sign-in
 */
export async function signInWithEmail(email: string, pass: string): Promise<AuthResult> {
  try {
    if (isLiveFirebaseReady) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return {
        success: true,
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || email.split('@')[0],
          photoURL: cred.user.photoURL,
          providerId: 'password',
        },
      };
    }
  } catch (err: any) {
    console.warn('Email sign-in with live Firebase resulted in error:', err);
    // If invalid credential or not found, return message
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
      return { success: false, error: 'Credenciales incorrectas o usuario no encontrado.' };
    }
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'No se pudo iniciar sesión.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Fallback demo for local development only.
  return {
    success: true,
    user: {
      uid: 'email-usr-' + Date.now(),
      email,
      displayName: email.split('@')[0].replace('.', ' ').replace(/^./, (c) => c.toUpperCase()),
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      providerId: 'password',
    },
  };
}

/**
 * Email and password registration
 */
export async function registerWithEmail(
  name: string,
  email: string,
  pass: string,
  company?: string
): Promise<AuthResult> {
  try {
    if (isLiveFirebaseReady) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      return {
        success: true,
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: name,
          photoURL: null,
          providerId: 'password',
        },
      };
    }
  } catch (err: any) {
    console.warn('Email registration with live Firebase resulted in error:', err);
    if (err.code === 'auth/email-already-in-use') {
      return { success: false, error: 'El correo electrónico ya está registrado en el sistema.' };
    }
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'No se pudo crear la cuenta.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Fallback for local development only.
  return {
    success: true,
    user: {
      uid: 'reg-usr-' + Date.now(),
      email,
      displayName: name,
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      providerId: 'password',
    },
  };
}

/**
 * Send password reset email
 */
export async function sendFirebasePasswordReset(email: string): Promise<{ success: boolean; error?: string; demoToken?: string }> {
  try {
    if (isLiveFirebaseReady) {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    }
  } catch (err: any) {
    console.warn('Password reset live Firebase error:', err);
    if (err.code === 'auth/user-not-found') {
      return { success: false, error: 'No existe una cuenta registrada con este correo electrónico.' };
    }
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'No se pudo iniciar el proceso de recuperación.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Store in memory / local mock tokens for simulation
  const mockToken = 'CLM-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  try {
    const existing = JSON.parse(localStorage.getItem('clientum_pending_resets') || '{}');
    existing[email.toLowerCase()] = {
      token: mockToken,
      timestamp: Date.now(),
    };
    localStorage.setItem('clientum_pending_resets', JSON.stringify(existing));
  } catch (e) {
    // ignore
  }

  return { success: true, demoToken: mockToken };
}

/**
 * Verify recovery token
 */
export async function verifyResetToken(tokenOrCode: string): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    if (isLiveFirebaseReady) {
      const email = await verifyPasswordResetCode(auth, tokenOrCode);
      return { success: true, email };
    }
  } catch (err: any) {
    console.warn('Live reset code verification error:', err);
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'El código de recuperación es inválido o ha expirado.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Check mock tokens
  try {
    const existing = JSON.parse(localStorage.getItem('clientum_pending_resets') || '{}');
    for (const [em, data] of Object.entries(existing as Record<string, { token: string }>)) {
      if (data.token.toUpperCase() === tokenOrCode.trim().toUpperCase()) {
        return { success: true, email: em };
      }
    }
  } catch (e) {
    // ignore
  }

  return { success: false, error: 'El código de seguridad es inválido o ha expirado.' };
}

/**
 * Confirm password reset with new password
 */
export async function confirmPasswordResetWithToken(
  tokenOrCode: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (isLiveFirebaseReady) {
      await confirmPasswordReset(auth, tokenOrCode, newPassword);
      return { success: true };
    }
  } catch (err: any) {
    console.warn('Live confirm password reset error:', err);
    if (err.code === 'auth/expired-action-code') {
      return { success: false, error: 'El código de recuperación ha expirado. Solicita uno nuevo.' };
    }
    if (err.code === 'auth/invalid-action-code') {
      return { success: false, error: 'Código de recuperación inválido.' };
    }
    if (isLiveFirebaseReady || !isDemoAuthFallbackEnabled) {
      return { success: false, error: 'No se pudo actualizar la contraseña.' };
    }
  }

  if (!isDemoAuthFallbackEnabled) {
    return { success: false, error: 'La autenticación de Firebase no está configurada.' };
  }

  // Clear mock
  let cleared = false;
  try {
    const existing = JSON.parse(localStorage.getItem('clientum_pending_resets') || '{}');
    for (const [em, data] of Object.entries(existing as Record<string, { token: string }>)) {
      if (data.token.toUpperCase() === tokenOrCode.trim().toUpperCase()) {
        delete existing[em];
        localStorage.setItem('clientum_pending_resets', JSON.stringify(existing));
        cleared = true;
        break;
      }
    }
  } catch (e) {
    // ignore
  }

  return cleared
    ? { success: true }
    : { success: false, error: 'Código de recuperación inválido o expirado.' };
}

/**
 * Sign out
 */
export async function firebaseSignOut(): Promise<void> {
  try {
    if (isLiveFirebaseReady) await signOut(auth);
  } catch (e) {
    console.warn('Signout note:', e);
  }
}
