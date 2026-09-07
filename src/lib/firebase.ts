import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  getDownloadURL, 
  uploadBytes, 
  deleteObject, 
  listAll,
  getMetadata,
  FirebaseStorage 
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: 'crypto-confidant-2026.firebasestorage.app',
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
} else {
  app = getApp();
}

// Initialize Firestore with fallback to default database if named database is unavailable
export let db: Firestore;
try {
  db = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
} catch (error) {
  console.warn('Named Firestore initialization fallback to default:', error);
  db = getFirestore(app);
}

// Initialize Firebase Storage for newsletters (gs://crypto-confidant-2026.firebasestorage.app/newsletters)
export const STORAGE_BUCKET_NAME = 'crypto-confidant-2026.firebasestorage.app';

export const storage: FirebaseStorage = getStorage(
  app,
  `gs://${STORAGE_BUCKET_NAME}`
);

/**
 * Resolves a Firebase Storage path or gs:// URL to an HTTPS download URL.
 * If already an HTTP/HTTPS URL or Blob URL, returns it directly.
 */
export async function resolveFirebaseStorageUrl(urlOrPath: string): Promise<string | null> {
  if (!urlOrPath) return null;
  const trimmed = urlOrPath.trim();

  // If already a direct HTTP/HTTPS or local Blob URL, return directly
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  try {
    let storageRef;
    if (trimmed.startsWith('gs://')) {
      storageRef = ref(storage, trimmed);
    } else {
      // Relative path inside bucket, e.g. "newsletters/issue_01.pdf"
      const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
      storageRef = ref(storage, normalizedPath);
    }

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.warn('Could not resolve Firebase Storage download URL for:', trimmed, error);
    return null;
  }
}

/**
 * Uploads a newsletter PDF file to Firebase Storage under the newsletters/ folder.
 */
export async function uploadPdfToFirebaseStorage(
  newsletterId: string,
  file: File
): Promise<{ downloadUrl: string; gsUrl: string; storagePath: string; fileName: string; fileSize: number }> {
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `newsletters/${newsletterId}_${Date.now()}_${sanitizedFileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: 'application/pdf',
    customMetadata: {
      newsletterId,
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  const downloadUrl = await getDownloadURL(storageRef);
  const gsUrl = `gs://${STORAGE_BUCKET_NAME}/${storagePath}`;

  return {
    downloadUrl,
    gsUrl,
    storagePath,
    fileName: file.name,
    fileSize: file.size,
  };
}

/**
 * Deletes a PDF from Firebase Storage given its path or gs:// URL.
 */
export async function deletePdfFromFirebaseStorage(pathOrGsUrl: string): Promise<void> {
  if (!pathOrGsUrl) return;
  try {
    let storageRef;
    if (pathOrGsUrl.startsWith('gs://') || pathOrGsUrl.startsWith('http')) {
      storageRef = ref(storage, pathOrGsUrl);
    } else {
      const normalized = pathOrGsUrl.startsWith('/') ? pathOrGsUrl.slice(1) : pathOrGsUrl;
      storageRef = ref(storage, normalized);
    }
    await deleteObject(storageRef);
  } catch (error) {
    console.warn('Failed to delete file from Firebase Storage:', pathOrGsUrl, error);
  }
}

/**
 * Lists all PDF files located across Firebase Storage (newsletters/ folder, root, and subfolders).
 */
export async function listNewslettersFromFirebaseStorage(): Promise<
  {
    name: string;
    fullPath: string;
    downloadUrl: string;
    gsUrl: string;
    size?: number;
    updated?: string;
    originalName?: string;
    newsletterId?: string;
  }[]
> {
  const allFoundItems: any[] = [];
  const processedPaths = new Set<string>();

  const scanFolder = async (folderPath: string) => {
    try {
      const folderRef = ref(storage, folderPath);
      const result = await listAll(folderRef);

      // Process files in folder
      const items = await Promise.all(
        result.items.map(async (itemRef) => {
          if (processedPaths.has(itemRef.fullPath)) return null;
          processedPaths.add(itemRef.fullPath);

          try {
            const downloadUrl = await getDownloadURL(itemRef);
            let metadata = null;
            try {
              metadata = await getMetadata(itemRef);
            } catch {
              // Metadata read may be unpermitted or restricted
            }
            const originalName = metadata?.customMetadata?.originalName || itemRef.name;
            const newsletterId = metadata?.customMetadata?.newsletterId || itemRef.name.replace(/\.[^/.]+$/, '').split('_')[0];
            return {
              name: itemRef.name,
              fullPath: itemRef.fullPath,
              downloadUrl,
              gsUrl: `gs://${STORAGE_BUCKET_NAME}/${itemRef.fullPath}`,
              size: metadata?.size,
              updated: metadata?.updated,
              originalName,
              newsletterId,
            };
          } catch {
            return null;
          }
        })
      );

      for (const it of items) {
        if (it) allFoundItems.push(it);
      }

      // Recursively scan subfolders
      for (const prefixRef of result.prefixes) {
        await scanFolder(prefixRef.fullPath);
      }
    } catch (err) {
      console.warn(`Could not list folder "${folderPath}" in Firebase Storage:`, err);
    }
  };

  try {
    // Check both standard 'newsletters' folder and bucket root
    await scanFolder('newsletters');
    await scanFolder('');
  } catch (err) {
    console.warn('Could not scan Firebase Storage bucket:', err);
  }

  return allFoundItems;
}

export { app };

