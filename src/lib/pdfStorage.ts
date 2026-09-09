// PDF storage, Firebase Storage resolution, IndexedDB cache, and on-demand dynamic PDF generation
import { jsPDF } from 'jspdf';
import { Newsletter } from '../data/newsletters';
import { resolveFirebaseStorageUrl, listNewslettersFromFirebaseStorage, storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const DB_NAME = 'CryptoConfidantDB';
const DB_VERSION = 1;
const STORE_NAME = 'newsletter_pdfs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export interface StoredPdfRecord {
  id: string;
  fileName: string;
  fileSize: string;
  blob: Blob;
  updatedAt: number;
}

export async function savePdfToIndexedDb(
  newsletterId: string,
  file: File | Blob,
  fileName = `${newsletterId}.pdf`
): Promise<{ fileName: string; fileSize: string; blobUrl: string }> {
  const db = await openDB();
  const fileSize = formatFileSize(file.size);
  const record: StoredPdfRecord = {
    id: newsletterId,
    fileName,
    fileSize,
    blob: file,
    updatedAt: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const putRequest = store.put(record);

    putRequest.onsuccess = () => {
      const blobUrl = URL.createObjectURL(file);
      resolve({
        fileName,
        fileSize,
        blobUrl,
      });
    };

    putRequest.onerror = () => {
      reject(putRequest.error);
    };
  });
}

export async function getPdfBlobUrl(
  newsletterId: string
): Promise<{ blobUrl: string; fileName: string; fileSize: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(newsletterId);

      getRequest.onsuccess = () => {
        const record = getRequest.result as StoredPdfRecord | undefined;
        if (record && record.blob) {
          const blobUrl = URL.createObjectURL(record.blob);
          resolve({
            blobUrl,
            fileName: record.fileName,
            fileSize: record.fileSize,
          });
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function deletePdfFromIndexedDb(newsletterId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(newsletterId);

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  } catch (err) {
    console.warn('Error deleting PDF from IndexedDB:', err);
  }
}

/**
 * Resolves the actual PDF for a newsletter from the configured Firebase Storage URL,
 * direct upload cache, or a directly served public file.
 *
 * This intentionally does not generate synthetic PDFs. The newsletter page should
 * show the same content that is stored in Firebase Storage.
 */
export async function getNewsletterPdf(
  newsletter: Newsletter
): Promise<{ url: string; fileName: string; fileSize: string } | null> {
  const defaultFileName = `${newsletter.issueNumber.replace(/\s+/g, '_')}_Official_Edition.pdf`;

  // 1. If configured with an already-resolved local blob or data URL, return immediately
  if (newsletter.pdfUrl) {
    if (newsletter.pdfUrl.startsWith('blob:') || newsletter.pdfUrl.startsWith('data:')) {
      return {
        url: newsletter.pdfUrl,
        fileName: newsletter.pdfFileName || defaultFileName,
        fileSize: newsletter.pdfFileSize || 'PDF Document',
      };
    }
  }

  // 2. Check local bundled files in public directory (fastest, 100% CORS-safe)
  const localCandidates = [
    newsletter.pdfUrl?.startsWith('/') ? newsletter.pdfUrl : null,
    newsletter.pdfFileName ? `/newsletters/${newsletter.pdfFileName}` : null,
    newsletter.pdfFileName ? `/${newsletter.pdfFileName}` : null,
    `/newsletters/${newsletter.id}.pdf`,
    `/${newsletter.id}.pdf`,
  ].filter((p): p is string => Boolean(p));

  for (const candidate of localCandidates) {
    try {
      const res = await fetch(candidate);
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('pdf') || ct.includes('octet-stream')) {
          const blob = await res.blob();
          if (blob.size > 100) {
            const blobUrl = URL.createObjectURL(blob);
            return {
              url: blobUrl,
              fileName: newsletter.pdfFileName || defaultFileName,
              fileSize: formatFileSize(blob.size),
            };
          }
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 3. If explicit remote or Firebase Storage URL is provided, try to fetch into a clean local Blob
  if (newsletter.pdfUrl && !newsletter.pdfUrl.startsWith('/')) {
    try {
      const resolved = await resolveFirebaseStorageUrl(newsletter.pdfUrl);
      if (resolved) {
        if (resolved.startsWith('blob:') || resolved.startsWith('data:')) {
          return {
            url: resolved,
            fileName: newsletter.pdfFileName || defaultFileName,
            fileSize: newsletter.pdfFileSize || 'PDF Document',
          };
        }

        try {
          const response = await fetch(resolved);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            return {
              url: blobUrl,
              fileName: newsletter.pdfFileName || defaultFileName,
              fileSize: formatFileSize(blob.size) || newsletter.pdfFileSize || 'PDF Document',
            };
          }
        } catch (fetchErr) {
          console.warn('Could not fetch remote PDF URL directly (CORS/network), trying local/fallback options:', fetchErr);
        }
      }
    } catch (resolveErr) {
      console.warn('Error resolving PDF URL:', resolveErr);
    }
  }

  // 4. Direct lookup in Firebase Storage bucket under gs://crypto-confidant-2026.firebasestorage.app/newsletters/
  try {
    const storageRef = ref(storage, `newsletters/${newsletter.id}.pdf`);
    const downloadUrl = await getDownloadURL(storageRef);
    if (downloadUrl) {
      try {
        const response = await fetch(downloadUrl);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          return {
            url: blobUrl,
            fileName: newsletter.pdfFileName || defaultFileName,
            fileSize: formatFileSize(blob.size),
          };
        }
      } catch (storageFetchErr) {
        console.warn('Direct Firebase Storage fetch blocked by CORS, proceeding to cache/fallback:', storageFetchErr);
      }
    }
  } catch {
    // Not found in default exact bucket path, check dynamic list
  }

  // 4b. Dynamic search across all files in Firebase Storage bucket
  try {
    const storageFiles = await listNewslettersFromFirebaseStorage();
    if (storageFiles && storageFiles.length > 0) {
      const matchingFile = storageFiles.find(
        (f) =>
          f.newsletterId === newsletter.id ||
          f.name.startsWith(`${newsletter.id}_`) ||
          f.name.startsWith(`${newsletter.id}.`) ||
          f.name.toLowerCase().includes(newsletter.id.toLowerCase())
      ) || (storageFiles.length === 1 ? storageFiles[0] : undefined);

      if (matchingFile && matchingFile.downloadUrl) {
        try {
          const response = await fetch(matchingFile.downloadUrl);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            return {
              url: blobUrl,
              fileName: matchingFile.originalName || matchingFile.name || newsletter.pdfFileName || defaultFileName,
              fileSize: matchingFile.size ? formatFileSize(matchingFile.size) : formatFileSize(blob.size),
            };
          }
        } catch (dynFetchErr) {
          console.warn('Dynamic Firebase Storage fetch blocked by CORS, proceeding to cache/fallback:', dynFetchErr);
        }
      }
    }
  } catch {
    // Dynamic storage search fallback
  }

  // 5. Local IndexedDB Cache (e.g. uploaded via /admin)
  const local = await getPdfBlobUrl(newsletter.id);
  if (local) {
    return {
      url: local.blobUrl,
      fileName: local.fileName || defaultFileName,
      fileSize: local.fileSize || 'Local Upload',
    };
  }

  // No synthetic fallback: if no real PDF exists, the page should show an error
  // instead of inventing a PDF from newsletter metadata.
  return null;
}

/**
 * Triggers a clean browser download for a PDF URL or Blob.
 */
export async function downloadNewsletterPdfFile(rawUrl: string, fileName: string): Promise<void> {
  try {
    const url = (rawUrl.startsWith('gs://') || (!rawUrl.startsWith('http') && !rawUrl.startsWith('blob:') && !rawUrl.startsWith('data:')))
      ? (await resolveFirebaseStorageUrl(rawUrl)) || rawUrl
      : rawUrl;

    if (url.startsWith('blob:') || url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Fetch cross-origin Firebase Storage URL to trigger native filename download
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  } catch {
    // Fallback direct anchor click
    const resolvedUrl = (rawUrl.startsWith('gs://') || (!rawUrl.startsWith('http') && !rawUrl.startsWith('blob:') && !rawUrl.startsWith('data:')))
      ? (await resolveFirebaseStorageUrl(rawUrl)) || rawUrl
      : rawUrl;
    const link = document.createElement('a');
    link.href = resolvedUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
