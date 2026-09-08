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

// In-memory cache for dynamically generated PDF blobs to prevent regeneration
const generatedPdfCache = new Map<string, { url: string; fileName: string; fileSize: string; isGenerated?: boolean }>();

/**
 * Generates an official, beautifully styled PDF edition of a newsletter using jsPDF.
 */
export async function generateNewsletterPdf(newsletter: Newsletter): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top subtle bar
    doc.setFillColor(201, 154, 82); // Brass
    doc.rect(margin, 10, contentWidth, 1.2, 'F');

    // Header label
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 110, 60);
    doc.text('CRYPTOCONFIDANT.COM  |  CONFIDENTIAL INTELLIGENCE REPORT', margin, 15);
    doc.text(`${newsletter.issueNumber.toUpperCase()}`, pageWidth - margin, 15, { align: 'right' });

    // Bottom subtle line
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 115, 105);
    doc.text('CryptoConfidant Advisory · Educational & Security Disclosures Apply · Sovereign Custody Intelligence', margin, pageHeight - 8);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // Initial header on first page
  drawHeaderFooter();
  y = 24;

  // Header Banner Card
  doc.setFillColor(20, 18, 15); // Dark Charcoal
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  // Gold accent left line
  doc.setFillColor(201, 154, 82);
  doc.rect(margin, y, 3, 34, 'F');

  // Issue Number & Date Pill
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(201, 154, 82);
  doc.text(`${newsletter.issueNumber.toUpperCase()}  ·  ${newsletter.date.toUpperCase()}`, margin + 8, y + 10);

  // Category & Read Time
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 175, 165);
  doc.text(`${newsletter.category}  |  ${newsletter.readTime}`, pageWidth - margin - 8, y + 10, { align: 'right' });

  // Document Brand Headline
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(250, 248, 242);
  doc.text('CryptoConfidant Executive Advisory', margin + 8, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 195, 185);
  doc.text('Sovereign Security Intelligence & Threat Analysis for High-Assurance Custody', margin + 8, y + 27);

  y += 42;

  // Title
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 25, 20);
  const splitTitle = doc.splitTextToSize(newsletter.title, contentWidth);
  doc.text(splitTitle, margin, y);
  y += splitTitle.length * 6 + 4;

  if (newsletter.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 85, 75);
    const splitSub = doc.splitTextToSize(newsletter.subtitle, contentWidth);
    doc.text(splitSub, margin, y);
    y += splitSub.length * 4.5 + 4;
  }

  // Divider
  doc.setDrawColor(201, 154, 82);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  // Intro Paragraphs
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(45, 40, 35);

  for (const para of newsletter.introParagraphs) {
    const splitPara = doc.splitTextToSize(para, contentWidth);
    checkPageBreak(splitPara.length * 4.5 + 4);
    doc.text(splitPara, margin, y);
    y += splitPara.length * 4.5 + 4;
  }

  // Incident Summary Table
  if (newsletter.summaryTable) {
    checkPageBreak(38);
    y += 2;

    doc.setFillColor(248, 246, 240);
    doc.setDrawColor(220, 215, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

    doc.setFillColor(201, 154, 82);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(20, 18, 15);
    doc.text('INCIDENT BREAKDOWN MATRIX', margin + 4, y + 4.2);

    const cols = [
      { label: 'HOW', val: newsletter.summaryTable.how || 'N/A' },
      { label: 'WHEN', val: newsletter.summaryTable.when || 'N/A' },
      { label: 'WHERE', val: newsletter.summaryTable.where || 'N/A' },
      { label: 'WHY', val: newsletter.summaryTable.why || 'N/A' },
    ];

    const colW = contentWidth / 4;
    cols.forEach((col, idx) => {
      const cx = margin + idx * colW + 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(150, 115, 55);
      doc.text(col.label, cx, y + 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 35, 30);
      const splitVal = doc.splitTextToSize(col.val, colW - 5);
      doc.text(splitVal, cx, y + 16);
    });

    y += 40;
  }

  // Protection Steps
  if (newsletter.protectionSteps && newsletter.protectionSteps.length > 0) {
    for (const sec of newsletter.protectionSteps) {
      checkPageBreak(25);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 25, 20);
      doc.text(sec.sectionTitle, margin, y);
      y += 5;

      if (sec.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(80, 75, 65);
        const splitDesc = doc.splitTextToSize(sec.description, contentWidth);
        doc.text(splitDesc, margin, y);
        y += splitDesc.length * 4 + 3;
      }

      for (const item of sec.items) {
        checkPageBreak(16);
        doc.setFillColor(201, 154, 82);
        doc.circle(margin + 2, y - 1, 1.2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 25, 20);
        const itemHeading = item.title ? `${item.step ? `${item.step}: ` : ''}${item.title}` : (item.step || 'Action Point');
        doc.text(itemHeading, margin + 6, y);
        y += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(60, 55, 45);
        const splitAction = doc.splitTextToSize(item.action, contentWidth - 6);
        doc.text(splitAction, margin + 6, y);
        y += splitAction.length * 4 + 3;
      }
      y += 3;
    }
  }

  // Best Practices
  if (newsletter.bestPractices && newsletter.bestPractices.items.length > 0) {
    checkPageBreak(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 25, 20);
    doc.text(newsletter.bestPractices.title || 'Recommended Best Practices', margin, y);
    y += 5;

    for (const bp of newsletter.bestPractices.items) {
      checkPageBreak(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(35, 30, 25);
      const splitP = doc.splitTextToSize(`• ${bp.practice}`, contentWidth);
      doc.text(splitP, margin, y);
      y += splitP.length * 4;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(90, 80, 65);
      const splitW = doc.splitTextToSize(`  Why: ${bp.why}`, contentWidth - 4);
      doc.text(splitW, margin + 2, y);
      y += splitW.length * 3.8 + 3;
    }
  }

  // Sources
  if (newsletter.sources && newsletter.sources.length > 0) {
    checkPageBreak(25);
    y += 2;
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 110, 60);
    doc.text('DOCUMENTATION & PRIMARY SOURCES', margin, y);
    y += 4.5;

    for (const src of newsletter.sources) {
      checkPageBreak(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(70, 65, 55);
      const text = `${src.name}: ${src.details}`;
      const splitSrc = doc.splitTextToSize(text, contentWidth);
      doc.text(splitSrc, margin, y);
      y += splitSrc.length * 3.5 + 2;
    }
  }

  return doc.output('blob');
}

/**
 * Resolves the official PDF for a given newsletter issue.
 * 1. Checks configured pdfUrl (Firebase Storage or direct URL) and converts to reliable local Blob.
 * 2. Checks Firebase Storage bucket path gs://crypto-confidant-2026.firebasestorage.app/newsletters/{id}.pdf.
 * 3. Checks IndexedDB cache from /admin uploads.
 * 4. Automatically falls back to high-fidelity dynamic PDF generation so rendering never fails.
 */
export async function getNewsletterPdf(
  newsletter: Newsletter
): Promise<{ url: string; fileName: string; fileSize: string; isGenerated?: boolean }> {
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

  // 6. Fallback: Dynamically generate official PDF edition on demand
  const cacheKey = `${newsletter.id}_${newsletter.date}_${newsletter.title}`;
  if (generatedPdfCache.has(cacheKey)) {
    return generatedPdfCache.get(cacheKey)!;
  }

  const generatedBlob = await generateNewsletterPdf(newsletter);
  const generatedBlobUrl = URL.createObjectURL(generatedBlob);
  const result = {
    url: generatedBlobUrl,
    fileName: `${newsletter.issueNumber.replace(/\s+/g, '_')}_Official_Edition.pdf`,
    fileSize: formatFileSize(generatedBlob.size),
    isGenerated: true,
  };
  generatedPdfCache.set(cacheKey, result);

  return result;
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
