import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { Newsletter } from '../data/newsletters';

import {
  getStoredNewsletters,
  formatNewsletterDate,
  sortNewslettersLatestFirst,
  syncNewslettersWithFirebaseStorage,
  saveSingleNewsletter,
} from '../lib/contentStore';

import {
  getNewsletterPdf,
  downloadNewsletterPdfFile,
  savePdfToIndexedDb,
  formatFileSize,
  generateNewsletterPdf,
} from '../lib/pdfStorage';

import { uploadPdfToFirebaseStorage } from '../lib/firebase';

import { BrandMark } from './BrandMark';

import {
  Document,
  Page,
  pdfjs,
} from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Search,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  FileText,
  Download,
  Maximize2,
  Loader2,
  RotateCcw,
  Upload,
  RefreshCw,
} from 'lucide-react';

/*
 * PDF.js worker: bundle the worker with Vite so it always matches the
 * installed pdfjs-dist version and does not depend on a CDN/CSP.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PDF_DOCUMENT_OPTIONS = {
  disableAutoFetch: false,
  disableStream: false,
};


/*
 * ============================================================
 * TYPES
 * ============================================================
 */

interface NewslettersPageProps {
  onBackHome: () => void;
  initialNewsletterId?: string;
  onOpenPricing?: () => void;
}


/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export const NewslettersPage: React.FC<
  NewslettersPageProps
> = ({
  onBackHome,
  initialNewsletterId,
  onOpenPricing,
}) => {

  /*
   * ==========================================================
   * NEWSLETTER DATA
   * ==========================================================
   */

  const [allNewsletters, setAllNewsletters] =
    useState<Newsletter[]>(() =>
      getStoredNewsletters()
    );

  useEffect(() => {
    syncNewslettersWithFirebaseStorage().then((synced) => {
      if (synced && synced.length > 0) {
        setAllNewsletters(synced);
      }
    }).catch((err) => {
      console.warn('Storage sync notice on mount:', err);
    });

    const handleNewslettersUpdated = () => {
      setAllNewsletters(
        getStoredNewsletters()
      );
    };

    window.addEventListener(
      'newsletters-updated',
      handleNewslettersUpdated
    );

    return () => {
      window.removeEventListener(
        'newsletters-updated',
        handleNewslettersUpdated
      );
    };
  }, []);


  /*
   * ==========================================================
   * SORT
   * ==========================================================
   */

  const sortedNewsletters = useMemo(() => {
    return sortNewslettersLatestFirst(
      allNewsletters
    );
  }, [allNewsletters]);


  /*
   * ==========================================================
   * SELECTION
   * ==========================================================
   */

  const [selectedNewsletterId, setSelectedNewsletterId] =
    useState<string | null>(
      initialNewsletterId ||
        sortedNewsletters[0]?.id ||
        null
    );

  /*
   * Keep selection valid if newsletter data changes.
   */

  useEffect(() => {
    if (
      selectedNewsletterId &&
      sortedNewsletters.some(
        (newsletter) =>
          newsletter.id ===
          selectedNewsletterId
      )
    ) {
      return;
    }

    if (sortedNewsletters[0]) {
      setSelectedNewsletterId(
        sortedNewsletters[0].id
      );
    }
  }, [
    sortedNewsletters,
    selectedNewsletterId,
  ]);


  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [mobileArchiveOpen, setMobileArchiveOpen] =
    useState(false);


  /*
   * ==========================================================
   * ACTIVE NEWSLETTER
   * ==========================================================
   */

  const activeNewsletter =
    sortedNewsletters.find(
      (newsletter) =>
        newsletter.id ===
        selectedNewsletterId
    ) ||
    sortedNewsletters[0];


  /*
   * ==========================================================
   * PDF STATE
   * ==========================================================
   */

  const [activePdfUrl, setActivePdfUrl] =
    useState<string | null>(null);

  const [activePdfFileName, setActivePdfFileName] =
    useState<string | null>(null);

  const [activePdfFileSize, setActivePdfFileSize] =
    useState<string | null>(null);

  const [pdfLoading, setPdfLoading] =
    useState(false);

  const [pdfLoadError, setPdfLoadError] =
    useState(false);

  const [pdfViewerFallback, setPdfViewerFallback] =
    useState(false);

  const [pdfErrorMessage, setPdfErrorMessage] =
    useState<string | null>(null);

  const [pdfSourceKind, setPdfSourceKind] =
    useState<'stored' | 'local' | null>(null);

  const localPdfUrlRef =
    useRef<string | null>(null);

  const [numPages, setNumPages] =
    useState<number | null>(null);

  const [pdfPage, setPdfPage] =
    useState(1);

  const [pdfScale, setPdfScale] =
    useState(1);

  const memoizedPdfFile = useMemo(() => {
    return activePdfUrl ? { url: activePdfUrl } : null;
  }, [activePdfUrl]);

  useEffect(() => {
    return () => {
      if (localPdfUrlRef.current) {
        URL.revokeObjectURL(localPdfUrlRef.current);
        localPdfUrlRef.current = null;
      }
    };
  }, []);

  const pdfFileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [isSyncingStorage, setIsSyncingStorage] =
    useState(false);

  const [uploadStatusMsg, setUploadStatusMsg] =
    useState<string | null>(null);


  /*
   * ==========================================================
   * VIEWER REF
   * ==========================================================
   */

  const pdfViewerRef =
    useRef<HTMLDivElement | null>(null);

  const [viewerWidth, setViewerWidth] =
    useState(0);


  /*
   * ==========================================================
   * RESPONSIVE VIEWER WIDTH
   * ==========================================================
   */

  useEffect(() => {
    const element =
      pdfViewerRef.current;

    if (!element) return;

    const updateWidth = () => {
      setViewerWidth(
        element.clientWidth
      );
    };

    updateWidth();

    const observer =
      new ResizeObserver(updateWidth);

    observer.observe(element);

    window.addEventListener(
      'resize',
      updateWidth
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        'resize',
        updateWidth
      );
    };
  }, [activePdfUrl]);


  /*
   * ==========================================================
   * RESET PDF WHEN NEWSLETTER CHANGES
   * ==========================================================
   */

  useEffect(() => {
    setPdfPage(1);
    setNumPages(null);
    setPdfScale(1);
    setPdfLoadError(false);
    setPdfViewerFallback(false);
    setPdfErrorMessage(null);
    setPdfSourceKind(null);
  }, [activeNewsletter?.id]);


  /*
   * ==========================================================
   * LOAD PDF
   * ==========================================================
   */

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      setPdfLoading(true);
      setPdfLoadError(false);
      setPdfViewerFallback(false);
      setPdfErrorMessage(null);
      setPdfSourceKind(null);
      if (localPdfUrlRef.current) {
        URL.revokeObjectURL(localPdfUrlRef.current);
        localPdfUrlRef.current = null;
      }
      setActivePdfUrl(null);
      setActivePdfFileName(null);
      setActivePdfFileSize(null);
      setNumPages(null);
      setPdfPage(1);
      setPdfScale(1);

      if (!activeNewsletter) {
        setPdfLoading(false);
        return;
      }

      try {
        const result = await getNewsletterPdf(activeNewsletter);
        if (cancelled) return;

        if (result?.url) {
          setActivePdfUrl(result.url);
          setActivePdfFileName(result.fileName ?? null);
          setActivePdfFileSize(result.fileSize ?? null);
          setPdfSourceKind(
            result.url.startsWith('blob:') ? 'local' : 'stored'
          );
          // Keep the loading overlay until PDF.js fires onLoadSuccess.
          setPdfLoading(true);
        } else {
          setPdfLoading(false);
        }
      } catch (error) {
        if (cancelled) return;
        console.warn('Failed to retrieve newsletter PDF:', error);
        setPdfLoading(false);
        setPdfLoadError(true);
        setPdfViewerFallback(false);
        setPdfErrorMessage(
          error instanceof Error
            ? error.message
            : 'The PDF file could not be retrieved.'
        );
      }
    };

    void loadPdf();

    return () => {
      cancelled = true;
    };
  }, [
    activeNewsletter?.id,
    activeNewsletter?.pdfUrl,
    activeNewsletter?.date,
    activeNewsletter?.title,
  ]);

  /*
   * ==========================================================
   * PDF LOAD SUCCESS
   * ==========================================================
   */

  const handlePdfLoadSuccess = ({
    numPages: loadedPages,
  }: {
    numPages: number;
  }) => {

    console.log(
      'PDF loaded successfully:',
      loadedPages,
      'pages'
    );

    setNumPages(
      loadedPages
    );

    setPdfPage(1);
    setPdfLoading(false);
    setPdfLoadError(false);
    setPdfViewerFallback(false);
    setPdfErrorMessage(null);
  };


  /*
   * ==========================================================
   * PDF LOAD ERROR
   * ==========================================================
   */

  const handlePdfLoadError = async (error: Error) => {
    console.warn(
      'PDF.js render error:',
      error?.message || error
    );

    setPdfLoading(false);
    setPdfLoadError(true);
    setPdfViewerFallback(false);
    setPdfErrorMessage(
      'Preview is not available at the moment. Please click Open to view the official PDF.'
    );
  };

  /*
   * ==========================================================
   * PAGE CONTROLS
   * ==========================================================
   */

  const handlePreviousPage = () => {
    setPdfPage((page) =>
      Math.max(1, page - 1)
    );
  };

  const handleNextPage = () => {

    if (!numPages) return;

    setPdfPage((page) =>
      Math.min(
        numPages,
        page + 1
      )
    );
  };


  /*
   * ==========================================================
   * ZOOM
   * ==========================================================
   */

  const handleZoomOut = () => {
    setPdfScale((scale) =>
      Math.max(
        0.7,
        Number(
          (scale - 0.1).toFixed(1)
        )
      )
    );
  };

  const handleZoomIn = () => {
    setPdfScale((scale) =>
      Math.min(
        2,
        Number(
          (scale + 0.1).toFixed(1)
        )
      )
    );
  };


  /*
   * ==========================================================
   * OPEN PDF
   * ==========================================================
   */

  const handleOpenPdf = () => {

    if (!activePdfUrl) return;

    window.open(
      activePdfUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /*
   * ==========================================================
   * DOWNLOAD PDF
   * ==========================================================
   */

  const handleDownloadPdf = async () => {
    if (!activePdfUrl || !activeNewsletter) return;

    setIsDownloadingPdf(true);
    try {
      const fileName =
        activePdfFileName ||
        `${activeNewsletter.issueNumber.replace(/\s+/g, '_')}_Official_Edition.pdf`;
      await downloadNewsletterPdfFile(activePdfUrl, fileName);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      // Direct anchor click fallback
      const link = document.createElement('a');
      link.href = activePdfUrl;
      link.download =
        activePdfFileName ||
        `${activeNewsletter.issueNumber.replace(/\s+/g, '_')}_Official_Edition.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloadingPdf(false);
    }
  };


  /*
   * ==========================================================
   * RETRY
   * ==========================================================
   */

  const handleRetryPdf = async () => {
    if (!activeNewsletter) return;

    setPdfLoadError(false);
    setPdfViewerFallback(false);
    setPdfErrorMessage(null);
    setPdfLoading(true);
    setNumPages(null);
    setPdfPage(1);

    try {
      const result = await getNewsletterPdf(activeNewsletter);

      if (result?.url) {
        setActivePdfUrl(result.url);
        setActivePdfFileName(result.fileName ?? null);
        setActivePdfFileSize(result.fileSize ?? null);
        setPdfSourceKind(
          result.url.startsWith('blob:') ? 'local' : 'stored'
        );
      } else {
        setPdfLoading(false);
        setPdfLoadError(true);
        setPdfViewerFallback(false);
        setPdfErrorMessage('The PDF file could not be retrieved.');
      }
    } catch (error) {
      console.error('PDF retry failed:', error);
      setPdfLoading(false);
      setPdfLoadError(true);
      setPdfViewerFallback(false);
      setPdfErrorMessage(
        error instanceof Error
          ? error.message
          : 'The PDF could not be loaded.'
      );
    }
  };

  /*
   * ==========================================================
   * MANUAL STORAGE SYNC
   * ==========================================================
   */

  const handleSyncStorageNow = async () => {
    setIsSyncingStorage(true);
    try {
      const synced = await syncNewslettersWithFirebaseStorage();
      if (synced && synced.length > 0) {
        setAllNewsletters(synced);
        setUploadStatusMsg(`Synced ${synced.length} newsletter(s) from Firebase Storage.`);
      } else {
        setUploadStatusMsg('Storage checked: No new PDF files found.');
      }
      setTimeout(() => setUploadStatusMsg(null), 4000);
    } catch (err) {
      console.warn('Storage sync error:', err);
    } finally {
      setIsSyncingStorage(false);
    }
  };

  /*
   * ==========================================================
   * DIRECT PDF FILE UPLOAD / ATTACH
   * ==========================================================
   */

  const handleDirectPdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeNewsletter) return;

    try {
      const localBlobUrl = URL.createObjectURL(file);
      if (localPdfUrlRef.current) {
        URL.revokeObjectURL(localPdfUrlRef.current);
      }
      localPdfUrlRef.current = localBlobUrl;
      setActivePdfUrl(localBlobUrl);
      setPdfSourceKind('local');
      setActivePdfFileName(file.name);
      setActivePdfFileSize(formatFileSize(file.size));
      setPdfLoading(true);
      setPdfLoadError(false);
      setPdfViewerFallback(false);

      await savePdfToIndexedDb(activeNewsletter.id, file);

      try {
        const uploadResult = await uploadPdfToFirebaseStorage(activeNewsletter.id, file);
        const updated: Newsletter = {
          ...activeNewsletter,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '),
          pdfUrl: uploadResult.downloadUrl,
          pdfFileName: file.name,
          pdfFileSize: formatFileSize(file.size),
        };
        await saveSingleNewsletter(updated);
        setAllNewsletters(getStoredNewsletters());
        setUploadStatusMsg('✓ PDF uploaded to Firebase Storage and loaded into reader.');
      } catch (uploadErr) {
        console.warn('Firebase Storage direct upload notice:', uploadErr);
        const updated: Newsletter = {
          ...activeNewsletter,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '),
          pdfUrl: localBlobUrl,
          pdfFileName: file.name,
          pdfFileSize: formatFileSize(file.size),
        };
        await saveSingleNewsletter(updated);
        setAllNewsletters(getStoredNewsletters());
        setUploadStatusMsg('✓ PDF loaded into reader and saved locally.');
      }
      setTimeout(() => setUploadStatusMsg(null), 4500);
      e.target.value = '';
    } catch (err) {
      console.error('Failed to load PDF file:', err);
    }
  };


  /*
   * ==========================================================
   * PDF WIDTH
   * ==========================================================
   */

  const basePdfWidth =
    viewerWidth > 0
      ? Math.min(
          Math.max(
            viewerWidth - 32,
            280
          ),
          900
        )
      : 700;

  const pdfPageWidth =
    Math.round(
      basePdfWidth *
        pdfScale
    );


  /*
   * ==========================================================
   * NAVIGATION
   * ==========================================================
   */

  const activeIndex =
    sortedNewsletters.findIndex(
      (newsletter) =>
        newsletter.id ===
        activeNewsletter?.id
    );

  const prevNewsletter =
    activeIndex >= 0 &&
    activeIndex <
      sortedNewsletters.length - 1
      ? sortedNewsletters[
          activeIndex + 1
        ]
      : null;

  const nextNewsletter =
    activeIndex > 0
      ? sortedNewsletters[
          activeIndex - 1
        ]
      : null;


  /*
   * ==========================================================
   * CATEGORIES
   * ==========================================================
   */

  const categories = [
    'All',
    ...Array.from(
      new Set(
        sortedNewsletters.map(
          (newsletter) =>
            newsletter.category
        )
      )
    ),
  ];


  /*
   * ==========================================================
   * FILTER
   * ==========================================================
   */

  const filteredNewsletters =
    sortedNewsletters.filter(
      (newsletter) => {

        const matchesCategory =
          selectedCategory ===
            'All' ||
          newsletter.category ===
            selectedCategory;

        const normalizedSearch =
          searchQuery
            .toLowerCase()
            .trim();

        const matchesSearch =
          normalizedSearch === '' ||
          newsletter.title
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          newsletter.issueNumber
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          newsletter.introParagraphs.some(
            (paragraph) =>
              paragraph
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
          );

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );


  /*
   * ==========================================================
   * SELECT NEWSLETTER
   * ==========================================================
   */

  const handleSelectNewsletter = (
    newsletterId: string
  ) => {
    const selectedNewsletter = sortedNewsletters.find(
      (newsletter) => newsletter.id === newsletterId
    );

    setSelectedNewsletterId(
      newsletterId
    );

    setMobileArchiveOpen(false);

    if (selectedNewsletter?.pdfUrl) {
      window.setTimeout(() => {
        try {
          const opened = window.open(
            selectedNewsletter.pdfUrl,
            '_blank',
            'noopener,noreferrer'
          );
          if (!opened) {
            console.warn('Newsletter PDF popup was blocked.');
          }
        } catch (openErr) {
          console.warn('Failed to auto-open newsletter PDF:', openErr);
        }
      }, 150);
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  /*
   * ==========================================================
   * EMPTY STATE
   * ==========================================================
   */

  if (!activeNewsletter) {

    return (
      <div className="
        min-h-screen
        pt-24
        sm:pt-28
        pb-16
        sm:pb-20
        px-4
        sm:px-6
        lg:px-8
        max-w-[1600px]
        mx-auto
      ">

        <div className="
          text-center
          py-16
          sm:py-20
        ">

          <p className="
            text-base
            sm:text-lg
            text-theme-muted
          ">
            No newsletters available.
          </p>

        </div>

      </div>
    );
  }


  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (
    <div className="
      min-h-screen
      w-full
      overflow-x-hidden
      pt-24
      sm:pt-28
      lg:pt-32
      pb-12
      sm:pb-16
      lg:pb-20
      px-3
      sm:px-5
      md:px-6
      lg:px-8
      max-w-[1600px]
      mx-auto
    ">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-3
        sm:gap-4
        pb-5
        sm:pb-6
        border-b
        border-theme-subtle
        mb-4
        sm:mb-8
      ">

        <button
          onClick={onBackHome}
          className="
            min-h-[48px]
            inline-flex
            items-center
            gap-2
            self-start
            px-1
            text-sm
            sm:text-base
            font-medium
            uppercase
            tracking-wide
            text-theme-muted
            hover:text-theme-brass
            transition-colors
            cursor-pointer
            touch-manipulation
          "
        >

          <ArrowLeft className="w-4 h-4 shrink-0" />

          <span>
            Return to Home
          </span>

        </button>

        <div className="
          flex
          items-center
        ">

          <span className="
            text-xs
            sm:text-sm
            font-medium
            text-theme-muted
            uppercase
            tracking-wide
          ">
            {sortedNewsletters.length}{' '}
            Issues Published
          </span>

        </div>

      </div>


      {/* ======================================================
          MOBILE ARCHIVE
      ====================================================== */}

      <div className="lg:hidden mb-4">

        <button
          type="button"
          onClick={() =>
            setMobileArchiveOpen(
              (current) =>
                !current
            )
          }
          aria-expanded={
            mobileArchiveOpen
          }
          className="
            w-full
            min-h-[58px]
            px-4
            rounded-xl
            border
            border-theme
            bg-theme-surface
            hover:bg-theme-surface-hover
            transition-colors
            flex
            items-center
            justify-between
            gap-3
            text-left
            cursor-pointer
            touch-manipulation
          "
        >

          <div className="
            flex
            items-center
            gap-3
            min-w-0
          ">

            <div className="
              w-9
              h-9
              rounded-lg
              bg-theme-brass/10
              border
              border-theme-brass/20
              flex
              items-center
              justify-center
              shrink-0
            ">

              <BookOpen className="
                w-5
                h-5
                text-theme-brass
              " />

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-theme-brass tracking-wider">
                  {formatNewsletterDate(activeNewsletter.date)}
                </span>
                <span className="text-xs text-theme-muted">
                  · {activeNewsletter.issueNumber}
                </span>
              </div>

              <div className="
                font-sans
                text-sm
                sm:text-base
                text-theme-main
                font-bold
                mt-0.5
                truncate
              ">
                {activeNewsletter.title}
              </div>

            </div>

          </div>

          <ChevronDown
            className={`
              w-5
              h-5
              text-theme-muted
              transition-transform
              shrink-0
              ${
                mobileArchiveOpen
                  ? 'rotate-180'
                  : ''
              }
            `}
          />

        </button>

      </div>


      {/* ======================================================
          MAIN GRID
      ====================================================== */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-5
        sm:gap-7
        lg:gap-10
        xl:gap-12
        items-start
      ">


        {/* ====================================================
            ARCHIVE
        ==================================================== */}

        <aside
          className={`
            lg:col-span-4
            xl:col-span-4
            min-w-0
            ${
              mobileArchiveOpen
                ? 'block'
                : 'hidden'
            }
            lg:block
          `}
        >

          <div className="
            bg-theme-surface
            border
            border-theme
            rounded-2xl
            p-4
            sm:p-5
            shadow-xs
            space-y-5
            lg:sticky
            lg:top-24
          ">

            <div className="
              flex
              items-center
              justify-between
              gap-3
            ">

              <h2 className="
                font-serif
                text-lg
                sm:text-xl
                text-theme-main
                font-medium
                flex
                items-center
                gap-2
                min-w-0
              ">

                <BookOpen className="
                  w-5
                  h-5
                  text-theme-brass
                  shrink-0
                " />

                <span className="truncate">
                  Newsletter Dispatch
                </span>

              </h2>

              <span className="
                shrink-0
                text-xs
                font-medium
                px-2.5
                py-1.5
                rounded
                bg-theme-surface-hover
                text-theme-brass
                border
                border-theme
              ">
                Archive
              </span>

            </div>


            {/* SEARCH */}

            <div className="relative">

              <Search className="
                w-5
                h-5
                text-theme-muted
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                pointer-events-none
              " />

              <input
                type="text"
                placeholder="Search newsletters..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                aria-label="Search newsletters"
                className="
                  w-full
                  min-h-[50px]
                  bg-theme-main
                  border
                  border-theme
                  rounded-xl
                  pl-11
                  pr-3
                  text-base
                  text-theme-main
                  placeholder:text-theme-muted
                  focus:outline-none
                  focus:border-theme-brass
                  transition-colors
                "
              />

            </div>


            {/* LIST */}

            <div className="
              divide-y
              divide-theme-subtle
              max-h-[500px]
              sm:max-h-[600px]
              lg:max-h-[calc(100vh-280px)]
              overflow-y-auto
              overscroll-contain
              pr-1
              scrollbar-thin
            ">

              {filteredNewsletters.length === 0 ? (

                <div className="
                  text-center
                  py-10
                  px-4
                  text-sm
                  sm:text-base
                  text-theme-muted
                  leading-relaxed
                ">
                  No newsletters match your
                  search criteria.
                </div>

              ) : (

                filteredNewsletters.map(
                  (newsletter, index) => {

                    const isSelected =
                      newsletter.id ===
                      activeNewsletter.id;

                    const description =
                      newsletter.introParagraphs?.[0] ||
                      'Official published edition with security analysis and protection protocols.';

                    return (

                      <button
                        key={newsletter.id}
                        type="button"
                        onClick={() => {
                          handleSelectNewsletter(
                            newsletter.id
                          );
                          setMobileArchiveOpen(false);
                        }}
                        className={`
                          w-full
                          text-left
                          py-5
                          sm:py-6
                          first:pt-2
                          last:pb-2
                          flex
                          items-start
                          gap-4
                          sm:gap-5
                          transition-all
                          cursor-pointer
                          touch-manipulation
                          group
                          -mx-2.5
                          px-2.5
                          rounded-xl
                          ${
                            isSelected
                              ? 'bg-theme-brass/[0.06]'
                              : 'hover:bg-theme-surface-hover/50'
                          }
                        `}
                      >

                        <div className="
                          shrink-0
                          w-[92px]
                          sm:w-[108px]
                          pt-0.5
                          select-none
                        ">
                          <span className="
                            block
                            text-xs
                            sm:text-sm
                            font-semibold
                            text-theme-brass
                            tracking-wider
                            leading-snug
                          ">
                            {formatNewsletterDate(
                              newsletter.date
                            )}
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">

                          <h3 className={`
                            font-sans
                            text-base
                            sm:text-lg
                            font-bold
                            leading-snug
                            transition-colors
                            ${
                              isSelected
                                ? 'text-theme-main'
                                : 'text-theme-main group-hover:text-theme-brass'
                            }
                          `}>
                            {newsletter.title}
                          </h3>

                          <p className="
                            text-xs
                            sm:text-sm
                            text-theme-muted
                            leading-relaxed
                            font-normal
                            line-clamp-3
                          ">
                            {description}
                          </p>

                        </div>

                      </button>

                    );
                  }
                )

              )}

            </div>

          </div>

        </aside>


        {/* ====================================================
            MAIN ARTICLE
        ==================================================== */}

        <main className="
          lg:col-span-8
          xl:col-span-8
          min-w-0
        ">

          <article className="
            bg-theme-surface
            border
            border-theme
            rounded-2xl
            overflow-hidden
            shadow-md
          ">


            {/* =================================================
                ARTICLE BODY
            ================================================= */}

            <div className="
              px-4
              py-7
              sm:px-7
              sm:py-9
              lg:p-10
              space-y-8
              sm:space-y-9
            ">


              {/* TITLE */}

              <div className="
                space-y-4
                pb-6
                sm:pb-7
                border-b
                border-theme-subtle
              ">

                <div className="
                  inline-flex
                  max-w-full
                  items-center
                  gap-2
                  px-3.5
                  py-1.5
                  rounded-full
                  bg-theme-brass/10
                  border
                  border-theme-brass/30
                  text-theme-brass
                  text-xs
                  sm:text-sm
                  font-semibold
                  tracking-wide
                ">

                  <span>
                    {formatNewsletterDate(activeNewsletter.date)}
                  </span>

                  <span className="shrink-0">
                    •
                  </span>

                  <span>
                    {activeNewsletter.issueNumber}
                  </span>

                </div>

                <h2 className="
                  font-serif
                  text-[1.8rem]
                  leading-[1.2]
                  sm:text-3xl
                  lg:text-4xl
                  font-normal
                  text-theme-main
                  break-words
                ">
                  {activeNewsletter.title}
                </h2>

                {activeNewsletter.subtitle && (

                  <p className="
                    text-base
                    sm:text-lg
                    text-theme-muted
                    font-sans
                    italic
                    leading-relaxed
                  ">
                    {activeNewsletter.subtitle}
                  </p>

                )}

              </div>


              {/* =================================================
                  PDF VIEWER
              ================================================= */}

              {activePdfUrl && (

                <section
                  aria-label="Official PDF edition"
                  className="
                    rounded-2xl
                    overflow-hidden
                    border
                    border-theme
                    bg-[#0D0C0A]
                    shadow-sm
                  "
                >

                  {/* PDF HEADER */}

                  <div className="
                    px-3
                    sm:px-4
                    py-3
                    bg-[#171512]
                    border-b
                    border-[#332E25]
                  ">

                    <div className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-3
                    ">

                      <div className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                      ">

                        <div className="
                          w-9
                          h-9
                          sm:w-10
                          sm:h-10
                          rounded-lg
                          bg-theme-brass/10
                          border
                          border-theme-brass/25
                          flex
                          items-center
                          justify-center
                          shrink-0
                        ">

                          <FileText className="
                            w-4
                            h-4
                            sm:w-5
                            sm:h-5
                            text-theme-brass
                          " />

                        </div>

                        <div className="min-w-0">

                          <div className="
                            text-xs
                            sm:text-sm
                            font-semibold
                            text-[#F4F0E8]
                          ">
                            Official Edition
                          </div>

                          <div className="
                            text-[11px]
                            sm:text-xs
                            text-[#A9A39A]
                            truncate
                          ">

                            {activePdfFileName ||
                              `${activeNewsletter.issueNumber}_Official_Edition.pdf`}

                            {activePdfFileSize
                              ? ` · ${activePdfFileSize}`
                              : ''}

                          </div>

                        </div>

                      </div>


                      <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        w-full
                        sm:w-auto
                      ">

                        {/* Hidden native PDF file input */}
                        <input
                          ref={pdfFileInputRef}
                          type="file"
                          accept="application/pdf"
                          onChange={handleDirectPdfFileChange}
                          className="hidden"
                          aria-label="Upload PDF file"
                        />


                        <button
                          type="button"
                          onClick={
                            handleOpenPdf
                          }
                          className="
                            min-h-[42px]
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3.5
                            rounded-lg
                            border
                            border-[#4A4439]
                            bg-[#211E19]
                            hover:bg-[#2A261F]
                            text-[#E8E4D9]
                            text-xs
                            sm:text-sm
                            font-medium
                            transition-colors
                            cursor-pointer
                          "
                        >

                          <Maximize2 className="w-4 h-4" />

                          Open

                        </button>


                        <button
                          type="button"
                          disabled={isDownloadingPdf}
                          onClick={handleDownloadPdf}
                          className="
                            min-h-[42px]
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-3.5
                            rounded-lg
                            bg-theme-brass
                            hover:opacity-90
                            text-[#17130C]
                            text-xs
                            sm:text-sm
                            font-semibold
                            transition-opacity
                            cursor-pointer
                            disabled:opacity-60
                          "
                        >
                          {isDownloadingPdf ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}

                          <span>{isDownloadingPdf ? 'Downloading…' : 'Download'}</span>

                        </button>

                      </div>

                    </div>

                    {uploadStatusMsg && (
                      <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#2A2418] border border-theme-brass/30 text-xs text-theme-brass flex items-center justify-between">
                        <span>{uploadStatusMsg}</span>
                        <button onClick={() => setUploadStatusMsg(null)} className="text-xs text-[#8E8E8E] hover:text-white ml-2">✕</button>
                      </div>
                    )}

                  </div>


                  {/* =================================================
                      PDF CONTROLS
                  ================================================= */}

                  <div className="
                    px-3
                    sm:px-4
                    py-2.5
                    bg-[#211E19]
                    border-b
                    border-[#332E25]
                    flex
                    items-center
                    justify-between
                    gap-3
                  ">

                    <div className="
                      flex
                      items-center
                      gap-1
                    ">

                      <button
                        type="button"
                        disabled={
                          pdfPage <= 1 ||
                          !numPages
                        }
                        onClick={
                          handlePreviousPage
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-[#4A4439]
                          text-[#D8D2C7]
                          hover:bg-[#302C25]
                          disabled:opacity-30
                          flex
                          items-center
                          justify-center
                          cursor-pointer
                        "
                        aria-label="Previous page"
                      >

                        <ArrowLeft className="w-4 h-4" />

                      </button>


                      <div className="
                        min-w-[90px]
                        h-9
                        px-3
                        rounded-lg
                        border
                        border-[#4A4439]
                        bg-[#171512]
                        flex
                        items-center
                        justify-center
                        text-xs
                        text-[#D8D2C7]
                        font-medium
                      ">

                        {numPages
                          ? `Page ${pdfPage} / ${numPages}`
                          : 'Loading…'}

                      </div>


                      <button
                        type="button"
                        disabled={
                          !numPages ||
                          pdfPage >=
                            numPages
                        }
                        onClick={
                          handleNextPage
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-[#4A4439]
                          text-[#D8D2C7]
                          hover:bg-[#302C25]
                          disabled:opacity-30
                          flex
                          items-center
                          justify-center
                          cursor-pointer
                        "
                        aria-label="Next page"
                      >

                        <ArrowRight className="w-4 h-4" />

                      </button>

                    </div>


                    <div className="
                      flex
                      items-center
                      gap-1
                    ">

                      <button
                        type="button"
                        disabled={
                          pdfScale <= 0.7
                        }
                        onClick={
                          handleZoomOut
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-[#4A4439]
                          text-[#D8D2C7]
                          hover:bg-[#302C25]
                          disabled:opacity-30
                          flex
                          items-center
                          justify-center
                          text-lg
                          cursor-pointer
                        "
                        aria-label="Zoom out"
                      >
                        −
                      </button>


                      <div className="
                        hidden
                        sm:flex
                        min-w-[54px]
                        h-9
                        items-center
                        justify-center
                        text-xs
                        text-[#A9A39A]
                        font-medium
                      ">
                        {Math.round(
                          pdfScale * 100
                        )}
                        %
                      </div>


                      <button
                        type="button"
                        disabled={
                          pdfScale >= 2
                        }
                        onClick={
                          handleZoomIn
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          border
                          border-[#4A4439]
                          text-[#D8D2C7]
                          hover:bg-[#302C25]
                          disabled:opacity-30
                          flex
                          items-center
                          justify-center
                          text-lg
                          cursor-pointer
                        "
                        aria-label="Zoom in"
                      >
                        +
                      </button>

                    </div>

                  </div>


                  {/* =================================================
                      PDF DOCUMENT
                  ================================================= */}

                  <div
                    ref={pdfViewerRef}
                    className="
                      relative
                      bg-[#525252]
                      overflow-auto
                      flex
                      justify-center
                      py-6
                      sm:py-8
                      px-2
                    "
                    style={{
                      minHeight:
                        '520px',
                      maxHeight:
                        '820px',
                    }}
                  >

                    {/* PREVIEW UNAVAILABLE */}

                    {pdfLoading && (

                      <div className="
                        absolute
                        inset-0
                        z-20
                        flex
                        items-center
                        justify-center
                        bg-[#24211C]
                        p-6
                        text-center
                      ">

                        <div className="max-w-sm">

                          <div className="
                            mx-auto
                            w-12
                            h-12
                            rounded-full
                            bg-theme-brass/10
                            border
                            border-theme-brass/25
                            flex
                            items-center
                            justify-center
                          ">

                            <FileText className="
                              w-6
                              h-6
                              text-theme-brass
                            " />

                          </div>

                          <h3 className="
                            mt-4
                            text-base
                            sm:text-lg
                            font-semibold
                            text-[#F4F0E8]
                          ">
                            Preview is not available at the moment
                          </h3>

                          <p className="
                            mt-2
                            text-sm
                            leading-relaxed
                            text-[#B7B1A7]
                          ">
                            Please click Open to view the official PDF.
                          </p>

                        </div>

                      </div>

                    )}


                    {/* ERROR */}

                    {pdfLoadError && (

                      <div className="
                        absolute
                        inset-0
                        z-30
                        flex
                        items-center
                        justify-center
                        bg-[#24211C]
                        p-6
                        text-center
                      ">

                        <div className="max-w-sm">

                          <div className="
                            mx-auto
                            w-12
                            h-12
                            rounded-full
                            bg-theme-brass/10
                            border
                            border-theme-brass/25
                            flex
                            items-center
                            justify-center
                          ">

                            <FileText className="
                              w-6
                              h-6
                              text-theme-brass
                            " />

                          </div>


                          <h3 className="
                            mt-4
                            text-base
                            sm:text-lg
                            font-semibold
                            text-[#F4F0E8]
                          ">
                            Preview is not available at the moment
                          </h3>


                          <p className="
                            mt-2
                            text-sm
                            leading-relaxed
                            text-[#B7B1A7]
                          ">
                            Please click Open to view the official PDF.
                          </p>


                          {pdfErrorMessage && (

                            <p className="
                              mt-2
                              text-[11px]
                              leading-relaxed
                              text-[#8F8980]
                              break-words
                            ">
                              {pdfErrorMessage}
                            </p>

                          )}


                          <div className="
                            mt-5
                            flex
                            flex-col
                            sm:flex-row
                            items-stretch
                            justify-center
                            gap-2
                          ">

                            <button
                              type="button"
                              onClick={
                                handleRetryPdf
                              }
                              className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2
                                px-4
                                rounded-lg
                                border
                                border-[#4A4439]
                                bg-[#211E19]
                                text-[#E8E4D9]
                                text-sm
                                font-medium
                                cursor-pointer
                              "
                            >

                              <RotateCcw className="w-4 h-4" />

                              Retry

                            </button>


                            <button
                              type="button"
                              onClick={
                                handleOpenPdf
                              }
                              className="
                                inline-flex
                                min-h-[44px]
                                items-center
                                justify-center
                                gap-2
                                px-4
                                rounded-lg
                                bg-theme-brass
                                text-[#17130C]
                                text-sm
                                font-semibold
                                cursor-pointer
                              "
                            >

                              <ExternalLink className="w-4 h-4" />

                              Open PDF

                            </button>

                          </div>

                        </div>

                      </div>

                    )}


                    {/* =================================================
                        PDF.JS
                    ================================================= */}

                    

                    {activePdfUrl &&
                      pdfViewerFallback && (
                        <div className="flex justify-center bg-white p-2 sm:p-4">
                          <object
                            data={activePdfUrl}
                            type="application/pdf"
                            className="w-full max-w-4xl border-0"
                            style={{
                              height: '760px',
                              minHeight: '520px',
                              background: '#ffffff',
                            }}
                          >
                            <div className="flex min-h-[520px] items-center justify-center bg-white p-6 text-center text-sm text-slate-600">
                              This browser cannot preview the PDF inline. Use the Open PDF button to view it in a new tab.
                            </div>
                          </object>
                        </div>
                      )}

                  </div>


                  {/* FOOTER */}

                  <div className="
                    px-3.5
                    sm:px-4
                    py-3
                    bg-[#171512]
                    border-t
                    border-[#332E25]
                    flex
                    items-center
                    justify-between
                    gap-3
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2
                      text-[11px]
                      sm:text-xs
                      text-[#A9A39A]
                      min-w-0
                    ">

                      <FileText className="
                        w-3.5
                        h-3.5
                        text-theme-brass
                        shrink-0
                      " />

                      <span className="truncate">
                        Official CryptoConfidant
                        edition
                      </span>

                    </div>


                    {numPages && (

                      <span className="
                        shrink-0
                        text-[11px]
                        sm:text-xs
                        text-[#A9A39A]
                      ">
                        {numPages}{' '}
                        {numPages === 1
                          ? 'page'
                          : 'pages'}
                      </span>

                    )}

                  </div>

                </section>

              )}


              {/* =================================================
                  NO PDF
              ================================================= */}

              {!activePdfUrl &&
                !pdfLoading &&
                !pdfLoadError && (

                  <div className="
                    rounded-xl
                    border
                    border-theme
                    bg-theme-main/30
                    p-4
                    sm:p-5
                  ">

                    <div className="
                      flex
                      items-start
                      gap-3
                    ">

                      <FileText className="
                        w-5
                        h-5
                        text-theme-muted
                        shrink-0
                        mt-0.5
                      " />

                      <div>

                        <div className="
                          font-semibold
                          text-theme-main
                          text-sm
                          sm:text-base
                        ">
                          Official PDF edition
                          unavailable
                        </div>

                        <p className="
                          mt-1
                          text-sm
                          text-theme-muted
                          leading-relaxed
                        ">
                          This newsletter does
                          not currently have an
                          official PDF edition
                          available.
                        </p>

                      </div>

                    </div>

                  </div>

                )}


              {/* =================================================
                  INTRO
              ================================================= */}

              <div className="
                space-y-5
                text-base
                sm:text-[17px]
                text-theme-main
                leading-[1.8]
                font-sans
                break-words
              ">

                {activeNewsletter.introParagraphs.map(
                  (
                    paragraph,
                    index
                  ) => (

                    <p key={index}>
                      {paragraph}
                    </p>

                  )
                )}

              </div>


              {/* =================================================
                  QUICK SUMMARY
              ================================================= */}

              {activeNewsletter.summaryTable && (

                <div className="space-y-4 pt-1">

                  <h3 className="
                    font-serif
                    text-xl
                    sm:text-2xl
                    text-theme-main
                    font-semibold
                    border-b
                    border-theme
                    pb-2.5
                  ">
                    Quick Summary
                  </h3>


                  <div className="
                    hidden
                    sm:block
                    overflow-x-auto
                    border
                    border-theme
                    rounded-xl
                  ">

                    <table className="
                      w-full
                      text-left
                      text-base
                      border-collapse
                    ">

                      <thead>

                        <tr className="
                          bg-theme-surface-hover
                          border-b
                          border-theme
                          text-theme-muted
                          uppercase
                          font-medium
                          text-xs
                          sm:text-sm
                        ">

                          <th className="
                            py-3.5
                            px-4
                            w-1/4
                            font-semibold
                          ">
                            Aspect
                          </th>

                          <th className="
                            py-3.5
                            px-4
                            w-3/4
                            font-semibold
                          ">
                            Details
                          </th>

                        </tr>

                      </thead>


                      <tbody className="
                        divide-y
                        divide-theme-subtle
                        text-theme-main
                      ">

                        {(
                          [
                            ['How', activeNewsletter.summaryTable.how],
                            ['When', activeNewsletter.summaryTable.when],
                            ['Where', activeNewsletter.summaryTable.where],
                            ['Why', activeNewsletter.summaryTable.why],
                          ] as const
                        ).map(
                          ([label, value]) =>
                            value ? (

                              <tr key={label}>

                                <td className="
                                  py-4
                                  px-4
                                  font-semibold
                                  text-theme-brass
                                  align-top
                                ">
                                  {label}
                                </td>

                                <td className="
                                  py-4
                                  px-4
                                  leading-relaxed
                                ">
                                  {value}
                                </td>

                              </tr>

                            ) : null
                        )}

                      </tbody>

                    </table>

                  </div>


                  <div className="
                    sm:hidden
                    space-y-3
                  ">

                    {(
                      [
                        ['How', activeNewsletter.summaryTable.how],
                        ['When', activeNewsletter.summaryTable.when],
                        ['Where', activeNewsletter.summaryTable.where],
                        ['Why', activeNewsletter.summaryTable.why],
                      ] as const
                    ).map(
                      ([label, value]) =>
                        value ? (

                          <div
                            key={label}
                            className="
                              rounded-xl
                              border
                              border-theme
                              bg-theme-main/30
                              p-4
                            "
                          >

                            <div className="
                              text-xs
                              font-medium
                              uppercase
                              tracking-wide
                              text-theme-brass
                              mb-2
                            ">
                              {label}
                            </div>

                            <div className="
                              text-base
                              leading-[1.7]
                              text-theme-main
                            ">
                              {value}
                            </div>

                          </div>

                        ) : null
                    )}

                  </div>

                </div>

              )}


              {/* =================================================
                  PROTECTION STEPS
              ================================================= */}

              {activeNewsletter.protectionSteps &&
                activeNewsletter.protectionSteps.length >
                  0 && (

                  <div className="
                    space-y-7
                    pt-1
                  ">

                    {activeNewsletter.protectionSteps.map(
                      (
                        section,
                        index
                      ) => (

                        <div
                          key={index}
                          className="space-y-4"
                        >

                          <h3 className="
                            font-serif
                            text-xl
                            sm:text-2xl
                            text-theme-main
                            font-semibold
                            border-b
                            border-theme
                            pb-2.5
                          ">
                            {
                              section.sectionTitle
                            }
                          </h3>


                          {section.description && (

                            <p className="
                              text-base
                              sm:text-[17px]
                              text-theme-muted
                              leading-[1.75]
                            ">
                              {
                                section.description
                              }
                            </p>

                          )}


                          <div className="
                            grid
                            grid-cols-1
                            gap-3
                          ">

                            {section.items.map(
                              (
                                item,
                                itemIndex
                              ) => (

                                <div
                                  key={
                                    itemIndex
                                  }
                                  className="
                                    p-4
                                    sm:p-5
                                    rounded-xl
                                    bg-theme-main/40
                                    border
                                    border-theme
                                    flex
                                    items-start
                                    gap-3.5
                                  "
                                >

                                  {item.step ? (

                                    <span className="
                                      w-8
                                      h-8
                                      rounded-full
                                      bg-theme-brass/20
                                      text-theme-brass
                                      font-medium
                                      text-sm
                                      flex
                                      items-center
                                      justify-center
                                      shrink-0
                                    ">
                                      {
                                        item.step
                                      }
                                    </span>

                                  ) : (

                                    <CheckCircle2 className="
                                      w-5
                                      h-5
                                      text-theme-brass
                                      shrink-0
                                      mt-1
                                    " />

                                  )}


                                  <div className="
                                    space-y-2
                                    text-base
                                    min-w-0
                                  ">

                                    {item.title && (

                                      <div className="
                                        font-semibold
                                        text-theme-main
                                        leading-snug
                                      ">
                                        {
                                          item.title
                                        }
                                      </div>

                                    )}

                                    <div className="
                                      text-theme-muted
                                      leading-[1.75]
                                      break-words
                                    ">
                                      {
                                        item.action
                                      }
                                    </div>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}


              {/* =================================================
                  BEST PRACTICES
              ================================================= */}

              {activeNewsletter.bestPractices && (

                <div className="
                  space-y-4
                  pt-1
                ">

                  <h3 className="
                    font-serif
                    text-xl
                    sm:text-2xl
                    text-theme-main
                    font-semibold
                    border-b
                    border-theme
                    pb-2.5
                  ">
                    {
                      activeNewsletter
                        .bestPractices
                        .title
                    }
                  </h3>


                  <div className="
                    hidden
                    sm:block
                    overflow-x-auto
                    border
                    border-theme
                    rounded-xl
                  ">

                    <table className="
                      w-full
                      text-left
                      text-base
                      border-collapse
                    ">

                      <thead>

                        <tr className="
                          bg-theme-surface-hover
                          border-b
                          border-theme
                          text-theme-muted
                          uppercase
                          font-medium
                          text-xs
                          sm:text-sm
                        ">

                          <th className="
                            py-3.5
                            px-4
                            w-1/3
                            font-semibold
                          ">
                            Practice
                          </th>

                          <th className="
                            py-3.5
                            px-4
                            w-2/3
                            font-semibold
                          ">
                            Why It Matters
                          </th>

                        </tr>

                      </thead>


                      <tbody className="
                        divide-y
                        divide-theme-subtle
                        text-theme-main
                      ">

                        {activeNewsletter.bestPractices.items.map(
                          (
                            item,
                            index
                          ) => (

                            <tr
                              key={index}
                            >

                              <td className="
                                py-4
                                px-4
                                font-semibold
                                text-theme-main
                                align-top
                              ">
                                {
                                  item.practice
                                }
                              </td>

                              <td className="
                                py-4
                                px-4
                                leading-relaxed
                                text-theme-muted
                              ">
                                {
                                  item.why
                                }
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>


                  <div className="
                    sm:hidden
                    space-y-3
                  ">

                    {activeNewsletter.bestPractices.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="
                            rounded-xl
                            border
                            border-theme
                            bg-theme-main/30
                            p-4
                          "
                        >

                          <div className="
                            font-semibold
                            text-base
                            text-theme-main
                            leading-snug
                            mb-2.5
                          ">
                            {
                              item.practice
                            }
                          </div>

                          <div className="
                            text-base
                            text-theme-muted
                            leading-[1.7]
                          ">
                            {
                              item.why
                            }
                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* =================================================
                  ADDITIONAL POINTS
              ================================================= */}

              {activeNewsletter.additionalPoints && (

                <div className="
                  space-y-4
                  pt-1
                ">

                  <h3 className="
                    font-serif
                    text-xl
                    sm:text-2xl
                    text-theme-main
                    font-semibold
                    border-b
                    border-theme
                    pb-2.5
                  ">
                    {
                      activeNewsletter
                        .additionalPoints
                        .title ||
                      'Additional Security Measures'
                    }
                  </h3>


                  <ul className="
                    space-y-4
                    text-base
                    sm:text-[17px]
                    text-theme-muted
                  ">

                    {activeNewsletter.additionalPoints.items.map(
                      (
                        point,
                        index
                      ) => (

                        <li
                          key={index}
                          className="
                            flex
                            items-start
                            gap-3
                          "
                        >

                          <span className="
                            text-theme-brass
                            font-bold
                            shrink-0
                            mt-0.5
                          ">
                            •
                          </span>

                          <span className="
                            leading-[1.75]
                            min-w-0
                            break-words
                          ">
                            {point}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                </div>

              )}


              {/* =================================================
                  SOURCES
              ================================================= */}



              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="
                pt-7
                sm:pt-9
                border-t
                border-theme-subtle
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                ">

                  <BrandMark
                    size={28}
                    variant="brass"
                  />

                  <div className="
                    text-sm
                    sm:text-base
                    font-serif
                    text-theme-main
                  ">
                    CryptoConfidant.com
                    Confidential
                    Intelligence
                  </div>

                </div>


                <div className="
                  flex
                  items-center
                  justify-between
                  sm:justify-end
                  gap-2
                  w-full
                  sm:w-auto
                ">

                  {prevNewsletter ? (

                    <button
                      onClick={() =>
                        handleSelectNewsletter(
                          prevNewsletter.id
                        )
                      }
                      className="
                        min-h-[48px]
                        flex-1
                        sm:flex-none
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-theme-muted
                        hover:text-theme-main
                        border
                        border-theme
                        rounded-xl
                        bg-theme-surface
                        hover:bg-theme-surface-hover
                        cursor-pointer
                      "
                    >

                      <ArrowLeft className="w-4 h-4" />

                      {
                        prevNewsletter
                          .issueNumber
                      }

                    </button>

                  ) : (

                    <div className="hidden sm:block" />

                  )}


                  {nextNewsletter ? (

                    <button
                      onClick={() =>
                        handleSelectNewsletter(
                          nextNewsletter.id
                        )
                      }
                      className="
                        min-h-[48px]
                        flex-1
                        sm:flex-none
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-theme-muted
                        hover:text-theme-main
                        border
                        border-theme
                        rounded-xl
                        bg-theme-surface
                        hover:bg-theme-surface-hover
                        cursor-pointer
                      "
                    >

                      {
                        nextNewsletter
                          .issueNumber
                      }

                      <ArrowRight className="w-4 h-4" />

                    </button>

                  ) : (

                    <div className="hidden sm:block" />

                  )}

                </div>

              </div>

            </div>

          </article>

        </main>

      </div>

    </div>
  );
};