import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { SiteContent } from '../types';

const env = import.meta.env as any;

function initFirebaseApp(): { app: FirebaseApp | null; db: Firestore | null } {
  if (typeof window === 'undefined') return { app: null, db: null };
  if (!env.VITE_FIREBASE_PROJECT_ID) return { app: null, db: null };

  if (getApps().length === 0) {
    try {
      initializeApp({
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
      });
    } catch (err) {
      console.error('Firebase init error', err);
      return { app: null, db: null };
    }
  }

  try {
    const db = getFirestore();
    return { app: {} as FirebaseApp, db };
  } catch (err) {
    console.error('Firestore init error', err);
    return { app: null, db: null };
  }
}

export function isFirebaseConfigured(): boolean {
  return Boolean((import.meta.env as any).VITE_FIREBASE_PROJECT_ID);
}

export async function publishSiteContentToFirestore(content: SiteContent): Promise<{ ok: boolean; error?: string }> {
  const { db } = initFirebaseApp();
  if (!db) return { ok: false, error: 'Firebase not configured' };

  try {
    const ref = doc(db, 'site', 'content');
    await setDoc(ref, {
      content,
      updatedAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (err: any) {
    console.error('publishSiteContentToFirestore error', err);
    return { ok: false, error: err?.message || String(err) };
  }
}

export async function fetchSiteContentFromFirestore(): Promise<SiteContent | null> {
  const { db } = initFirebaseApp();
  if (!db) return null;

  try {
    const ref = doc(db, 'site', 'content');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as any;
    return data?.content || null;
  } catch (err) {
    console.error('fetchSiteContentFromFirestore error', err);
    return null;
  }
}
