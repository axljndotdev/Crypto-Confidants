import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Download, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  FileText, 
  Loader2, 
  AlertCircle,
  Columns,
  Layers
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure PDF.js worker is properly configured
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

interface PdfDocumentViewerProps {
  pdfBlob?: Blob | null;
  pdfUrl?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  title?: string;
  issueNumber?: string;
}

export const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({
  pdfBlob,
  pdfUrl,
  fileName,
  fileSize,
  title,
  issueNumber,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.15);
  const [viewMode, setViewMode] = useState<'scroll' | 'single' | 'native'>('scroll');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [fitWidth, setFitWidth] = useState<boolean>(true);

  // Active object URL for download and opening
  const [resolvedBlobUrl, setResolvedBlobUrl] = useState<string | null>(null);

  // Document references
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isRenderingRef = useRef<boolean>(false);

  // Setup resolved blob URL for download/external tab
  useEffect(() => {
    let activeUrl: string | null = null;
    if (pdfBlob) {
      activeUrl = URL.createObjectURL(pdfBlob);
      setResolvedBlobUrl(activeUrl);
    } else if (pdfUrl) {
      setResolvedBlobUrl(pdfUrl);
    }

    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [pdfBlob, pdfUrl]);

  // Load PDF document from blob or url
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      setIsLoading(true);
      setRenderError(null);

      try {
        let loadingTask: pdfjsLib.PDFDocumentLoadingTask;

        if (pdfBlob) {
          const arrayBuffer = await pdfBlob.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        } else if (pdfUrl) {
          // Check if valid URL
          try {
            const res = await fetch(pdfUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const arrayBuffer = await res.arrayBuffer();
            loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          } catch {
            // Try direct url load
            loadingTask = pdfjsLib.getDocument(pdfUrl);
          }
        } else {
          throw new Error('No PDF document source provided.');
        }

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error('PDF Document Viewer failed to load PDF:', err);
        if (!isCancelled) {
          setRenderError(err instanceof Error ? err.message : 'Unable to parse PDF document.');
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [pdfBlob, pdfUrl]);

  // Helper to render a specific page into a canvas element
  const renderPageToCanvas = useCallback(
    async (pageNumber: number, canvas: HTMLCanvasElement) => {
      const doc = pdfDocRef.current;
      if (!doc) return;

      try {
        const page = await doc.getPage(pageNumber);
        const containerWidth = containerRef.current?.clientWidth || 800;
        
        // Unscaled viewport
        const initialViewport = page.getViewport({ scale: 1.0 });
        
        // Calculate scale
        let scale = zoom;
        if (fitWidth && containerWidth > 100) {
          const padding = 48; // Account for container padding
          scale = ((containerWidth - padding) / initialViewport.width) * (zoom / 1.15);
        }

        const viewport = page.getViewport({ scale });
        const pixelRatio = Math.min(window.devicePixelRatio || 1.5, 2.5);

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        await page.render(renderContext).promise;
      } catch (err: unknown) {
        console.warn(`Error rendering page ${pageNumber}:`, err);
      }
    },
    [zoom, fitWidth]
  );

  // Render for Single Page mode
  useEffect(() => {
    if (viewMode !== 'single' || !pdfDocRef.current || !singleCanvasRef.current) return;
    renderPageToCanvas(currentPage, singleCanvasRef.current);
  }, [viewMode, currentPage, zoom, fitWidth, renderPageToCanvas]);

  // Render for Continuous Scroll mode
  useEffect(() => {
    if (viewMode !== 'scroll' || !pdfDocRef.current || !scrollContainerRef.current) return;
    if (isRenderingRef.current) return;

    isRenderingRef.current = true;
    const doc = pdfDocRef.current;
    const scrollContainer = scrollContainerRef.current;

    async function renderAllPages() {
      if (!doc || !scrollContainer) {
        isRenderingRef.current = false;
        return;
      }

      scrollContainer.innerHTML = '';

      for (let i = 1; i <= doc.numPages; i++) {
        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'flex flex-col items-center mb-6 relative group';
        pageWrapper.id = `pdf-page-wrapper-${i}`;

        // Page header badge
        const pageTag = document.createElement('div');
        pageTag.className = 'self-end mb-1 text-[11px] font-mono text-theme-muted/70 px-2 py-0.5 rounded bg-theme-surface/80 border border-theme/20';
        pageTag.innerText = `Page ${i} of ${doc.numPages}`;
        pageWrapper.appendChild(pageTag);

        // Canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'rounded-xl shadow-2xl bg-[#0E0D0B] border border-theme-brass/25 transition-shadow';
        pageWrapper.appendChild(canvas);

        scrollContainer.appendChild(pageWrapper);

        // Render page
        await renderPageToCanvas(i, canvas);
      }

      isRenderingRef.current = false;
    }

    renderAllPages();
  }, [viewMode, zoom, fitWidth, numPages, renderPageToCanvas]);

  const handleZoomIn = () => {
    setFitWidth(false);
    setZoom((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setFitWidth(false);
    setZoom((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleResetZoom = () => {
    setFitWidth(true);
    setZoom(1.15);
  };

  const displayFileName = fileName || `${(issueNumber || 'Newsletter').replace(/\s+/g, '_')}_Official.pdf`;

  return (
    <div 
      ref={containerRef}
      className="w-full rounded-2xl bg-theme-base border border-theme-brass/35 overflow-hidden shadow-2xl transition-all"
    >
      {/* Top Header Bar */}
      <div className="p-3.5 sm:p-4 bg-theme-surface/95 border-b border-theme flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Document Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-theme-brass/15 border border-theme-brass/35 flex items-center justify-center text-theme-brass shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-theme-main text-sm truncate flex items-center gap-2">
              <span>{title || displayFileName}</span>
              {numPages > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-theme-brass/20 text-theme-brass border border-theme-brass/30 shrink-0">
                  {numPages} {numPages === 1 ? 'Page' : 'Pages'}
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-theme-muted flex items-center gap-2 mt-0.5">
              <span>{displayFileName}</span>
              {fileSize && (
                <>
                  <span>•</span>
                  <span>{fileSize}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Primary Actions: Download & Open in Tab */}
        <div className="flex items-center gap-2 shrink-0">
          {resolvedBlobUrl && (
            <>
              <a
                href={resolvedBlobUrl}
                download={displayFileName}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-brass hover:bg-theme-brass-glow text-theme-base text-xs font-semibold transition-all shadow-sm cursor-pointer group"
                title="Download PDF to your computer"
              >
                <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
                <span>Download PDF</span>
              </a>

              <a
                href={resolvedBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme text-theme-muted hover:text-theme-main text-xs font-medium transition-colors cursor-pointer"
                title="Open document in a separate browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in Tab</span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="px-3 sm:px-4 py-2 bg-theme-surface-hover/80 border-b border-theme flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-theme-muted">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-theme-base/60 p-1 rounded-lg border border-theme/30">
          <button
            type="button"
            onClick={() => setViewMode('scroll')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'scroll' 
                ? 'bg-theme-brass text-theme-base font-semibold shadow-xs' 
                : 'text-theme-muted hover:text-theme-main'
            }`}
            title="Continuous Scroll View"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Continuous</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'single' 
                ? 'bg-theme-brass text-theme-base font-semibold shadow-xs' 
                : 'text-theme-muted hover:text-theme-main'
            }`}
            title="Single Page View"
          >
            <Columns className="w-3 h-3" />
            <span className="hidden sm:inline">Single Page</span>
          </button>
          {resolvedBlobUrl && (
            <button
              type="button"
              onClick={() => setViewMode('native')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'native' 
                  ? 'bg-theme-brass text-theme-base font-semibold shadow-xs' 
                  : 'text-theme-muted hover:text-theme-main'
              }`}
              title="Native Browser PDF Plugin Viewer"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Native</span>
            </button>
          )}
        </div>

        {/* Page Navigation for Single Page Mode */}
        {viewMode === 'single' && numPages > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg border border-theme/40 hover:bg-theme-surface text-theme-main disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-theme-main px-1 font-semibold">
              Page {currentPage} of {numPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))}
              disabled={currentPage >= numPages}
              className="p-1 rounded-lg border border-theme/40 hover:bg-theme-surface text-theme-main disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zoom Controls (for Canvas Modes) */}
        {viewMode !== 'native' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg border border-theme/40 hover:bg-theme-surface text-theme-main hover:text-theme-brass cursor-pointer transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] px-1.5 text-theme-main font-semibold min-w-[44px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg border border-theme/40 hover:bg-theme-surface text-theme-main hover:text-theme-brass cursor-pointer transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg border border-theme/40 hover:bg-theme-surface text-theme-main hover:text-theme-brass cursor-pointer transition-colors ml-1"
              title="Fit to Width / Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Viewer Main Display Area */}
      <div className="p-4 sm:p-6 bg-[#0E0D0B] min-h-[550px] max-h-[85vh] overflow-y-auto flex flex-col items-center justify-start relative">
        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-theme-brass animate-spin" />
            <span className="text-xs font-mono text-theme-brass">Rendering PDF document pages...</span>
            <span className="text-[11px] text-theme-muted font-sans">Sharpening high-assurance typography</span>
          </div>
        )}

        {/* Error State with Graceful Download Fallback */}
        {!isLoading && renderError && (
          <div className="py-16 px-6 max-w-md w-full text-center space-y-4 bg-theme-surface rounded-2xl border border-red-500/30">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-theme-main">Document Viewer Notice</div>
              <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                The embedded interactive canvas viewer encountered a display boundary ({renderError}).
              </p>
            </div>
            {resolvedBlobUrl && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={resolvedBlobUrl}
                  download={displayFileName}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-theme-brass text-theme-base text-xs font-semibold hover:bg-theme-brass-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
                <a
                  href={resolvedBlobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-theme-surface-hover border border-theme text-theme-main text-xs font-medium hover:text-theme-brass transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Browser</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Mode 1: Continuous Scroll Mode (All Pages Stacked) */}
        {!isLoading && !renderError && viewMode === 'scroll' && (
          <div 
            ref={scrollContainerRef}
            className="w-full flex flex-col items-center transition-all"
          />
        )}

        {/* Mode 2: Single Page Mode */}
        {!isLoading && !renderError && viewMode === 'single' && (
          <div className="flex flex-col items-center">
            <div className="mb-2 text-[11px] font-mono text-theme-muted px-2 py-0.5 rounded bg-theme-surface border border-theme/20">
              Page {currentPage} of {numPages}
            </div>
            <canvas
              ref={singleCanvasRef}
              className="rounded-xl shadow-2xl bg-[#0E0D0B] border border-theme-brass/25 transition-all"
            />
          </div>
        )}

        {/* Mode 3: Native Browser Plugin Viewer */}
        {!isLoading && !renderError && viewMode === 'native' && resolvedBlobUrl && (
          <div className="w-full h-[750px] sm:h-[880px] rounded-xl overflow-hidden border border-theme bg-[#131210]">
            <iframe
              src={`${resolvedBlobUrl}#toolbar=1&navpanes=0`}
              title={title || displayFileName}
              className="w-full h-full border-0 bg-[#131210]"
            />
          </div>
        )}
      </div>

      {/* Viewer Footer */}
      <div className="px-4 py-2.5 bg-theme-surface border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-theme-muted/70">
        <div>
          OFFICIAL INTELLIGENCE DISPATCH // SECURE ARCHIVE RECORD
        </div>
        <div className="flex items-center gap-2">
          <span>HIGH-RESOLUTION VECTOR RENDER</span>
          <span>•</span>
          <span>CRYPTO CONFIDANT</span>
        </div>
      </div>
    </div>
  );
};
