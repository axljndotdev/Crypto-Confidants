// IndexedDB storage for Newsletter PDFs to prevent localStorage quota exhaustion

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
  file: File
): Promise<{ fileName: string; fileSize: string; blobUrl: string }> {
  const db = await openDB();
  const fileSize = formatFileSize(file.size);
  const record: StoredPdfRecord = {
    id: newsletterId,
    fileName: file.name,
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
        fileName: file.name,
        fileSize,
        blobUrl,
      });
    };

    putRequest.onerror = () => {
      reject(putRequest.error);
    };
  });
}

export async function getPdfBlobUrl(newsletterId: string): Promise<{ blobUrl: string; fileName: string; fileSize: string; blob: Blob } | null> {
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
            blob: record.blob,
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

export async function deletePdfFromIndexedDb(newsletterId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(newsletterId);

      deleteRequest.onsuccess = () => {
        resolve(true);
      };
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    });
  } catch (err) {
    console.error('Hard deletion of PDF from IndexedDB failed:', err);
    return false;
  }
}

export async function hardDeletePdfFromStorage(newsletterId: string): Promise<boolean> {
  return await deletePdfFromIndexedDb(newsletterId);
}

export async function hasStoredPdf(newsletterId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.count(newsletterId);
      req.onsuccess = () => resolve(req.result > 0);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function getAllStoredPdfIds(): Promise<string[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve((req.result as string[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

