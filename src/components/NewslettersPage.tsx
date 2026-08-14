import React, { useState, useEffect } from 'react';
import { NEWSLETTERS, Newsletter } from '../data/newsletters';
import { BrandMark } from './BrandMark';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Search,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface NewslettersPageProps {
  onBackHome: () => void;
  initialNewsletterId?: string;
  onOpenPricing?: () => void;
}

export const NewslettersPage: React.FC<NewslettersPageProps> = ({
  onBackHome,
  initialNewsletterId,
  onOpenPricing,
}) => {
  /*
   * Convert the newsletter date into ISO format.
   */
  const formatNewsletterDate = (date: string): string => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  /*
   * Extract the numeric portion of the newsletter issue number.
   */
  const getIssueNumber = (issueNumber: string): number => {
    const match = issueNumber.match(/\d+/);

    return match ? parseInt(match[0], 10) : 0;
  };

  /*
   * Sort newsletters:
   *
   * 1. Newest date → oldest date
   * 2. If multiple newsletters have the same date,
   *    larger newsletter number → smaller newsletter number
   */
  const sortedNewsletters = [...NEWSLETTERS].sort((a, b) => {
    const dateDifference =
      new Date(b.date).getTime() -
      new Date(a.date).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return (
      getIssueNumber(b.issueNumber) -
      getIssueNumber(a.issueNumber)
    );
  });

  const [selectedNewsletterId, setSelectedNewsletterId] =
    useState<string | null>(
      initialNewsletterId || sortedNewsletters[0]?.id || null
    );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All');

  /*
   * Mobile archive starts collapsed.
   *
   * The newest newsletter remains visible by default.
   */
  const [mobileArchiveOpen, setMobileArchiveOpen] =
    useState(false);

  /*
   * Scroll to top when selected newsletter changes.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [selectedNewsletterId]);

  /*
   * Categories are generated from the sorted newsletter list.
   */
  const categories = [
    'All',
    ...Array.from(
      new Set(
        sortedNewsletters.map(
          (newsletter) => newsletter.category
        )
      )
    ),
  ];

  /*
   * Filter the correctly sorted newsletter list.
   */
  const filteredNewsletters = sortedNewsletters.filter(
    (newsletter) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        newsletter.category === selectedCategory;

      const normalizedSearch =
        searchQuery.toLowerCase().trim();

      const matchesSearch =
        normalizedSearch === '' ||
        newsletter.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        newsletter.issueNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        newsletter.introParagraphs.some((paragraph) =>
          paragraph
            .toLowerCase()
            .includes(normalizedSearch)
        );

      return matchesCategory && matchesSearch;
    }
  );

  /*
   * Find the currently active newsletter.
   */
  const activeNewsletter =
    sortedNewsletters.find(
      (newsletter) =>
        newsletter.id === selectedNewsletterId
    ) || sortedNewsletters[0];

  /*
   * Navigation follows the same sorted order.
   */
  const activeIndex = sortedNewsletters.findIndex(
    (newsletter) =>
      newsletter.id === activeNewsletter?.id
  );

  const prevNewsletter =
    activeIndex >= 0 &&
    activeIndex < sortedNewsletters.length - 1
      ? sortedNewsletters[activeIndex + 1]
      : null;

  const nextNewsletter =
    activeIndex > 0
      ? sortedNewsletters[activeIndex - 1]
      : null;

  /*
   * Selecting a newsletter on mobile closes the archive.
   */
  const handleSelectNewsletter = (newsletterId: string) => {
    setSelectedNewsletterId(newsletterId);
    setMobileArchiveOpen(false);
  };

  const toggleMobileArchive = () => {
    setMobileArchiveOpen((current) => !current);
  };

  if (!activeNewsletter) {
    return (
      <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="text-center py-16 sm:py-20">
          <p className="text-base sm:text-lg text-theme-muted">
            No newsletters available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-3 sm:px-5 md:px-6 lg:px-8 max-w-[1600px] mx-auto">

      {/* =========================================================
          TOP HEADER / BREADCRUMBS
      ========================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-theme-subtle mb-4 sm:mb-8">

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
          <span>Return to Home</span>
        </button>

        <div className="flex items-center">
          <span className="text-xs sm:text-sm font-medium text-theme-muted uppercase tracking-wide">
            {sortedNewsletters.length} Issues Published
          </span>
        </div>

      </div>

      {/* =========================================================
          MOBILE ARCHIVE TOGGLE
      ========================================================= */}

      <div className="lg:hidden mb-4">

        <button
          type="button"
          onClick={toggleMobileArchive}
          aria-expanded={mobileArchiveOpen}
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

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-9 h-9 rounded-lg bg-theme-brass/10 border border-theme-brass/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-theme-brass" />
            </div>

            <div className="min-w-0">

              <div className="font-serif text-base sm:text-lg text-theme-main font-medium">
                Browse newsletters
              </div>

              <div className="text-xs sm:text-sm text-theme-muted mt-0.5 truncate">
                {activeNewsletter.issueNumber} · {activeNewsletter.title}
              </div>

            </div>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <span className="hidden sm:inline text-xs font-medium uppercase tracking-wide text-theme-muted">
              {mobileArchiveOpen ? 'Close' : 'Browse'}
            </span>

            <ChevronDown
              className={`w-5 h-5 text-theme-muted transition-transform ${
                mobileArchiveOpen
                  ? 'rotate-180'
                  : ''
              }`}
            />

          </div>

        </button>

      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-10 xl:gap-12 items-start">

        {/* =======================================================
            LEFT COLUMN — NEWSLETTER ARCHIVE
        ======================================================= */}

        <aside
          className={`
            lg:col-span-4
            xl:col-span-4
            min-w-0
            ${mobileArchiveOpen ? 'block' : 'hidden'}
            lg:block
          `}
        >

          <div className="bg-theme-surface border border-theme rounded-2xl p-4 sm:p-5 shadow-xs space-y-5 lg:sticky lg:top-24">

            {/* Archive Header */}

            <div className="flex items-center justify-between gap-3">

              <h2 className="font-serif text-lg sm:text-xl text-theme-main font-medium flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 text-theme-brass shrink-0" />

                <span className="truncate">
                  Newsletter Dispatch
                </span>
              </h2>

              <span className="shrink-0 text-xs font-medium px-2.5 py-1.5 rounded bg-theme-surface-hover text-theme-brass border border-theme">
                Archive
              </span>

            </div>

            {/* Search Input */}

            <div className="relative">

              <Search className="w-5 h-5 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                type="text"
                placeholder="Search newsletters..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
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

            {/* Category Filter Pills */}

            <div
              className="
                flex
                gap-2
                pt-0.5
                overflow-x-auto
                overscroll-x-contain
                pb-1
                -mx-0.5
                px-0.5
                scrollbar-none
                touch-pan-x
              "
            >

              {categories.map((category) => (

                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    min-h-[42px]
                    shrink-0
                    whitespace-nowrap
                    text-xs
                    sm:text-sm
                    font-medium
                    px-3.5
                    rounded-lg
                    transition-all
                    cursor-pointer
                    touch-manipulation
                    ${
                      selectedCategory === category
                        ? 'bg-theme-brass/20 text-theme-brass border border-theme-brass/40 font-semibold'
                        : 'bg-theme-surface-hover text-theme-muted hover:text-theme-main border border-theme'
                    }
                  `}
                >
                  {category}
                </button>

              ))}

            </div>

            {/* Newsletter List */}

            <div className="space-y-2.5 pt-1 max-h-[420px] sm:max-h-[500px] lg:max-h-[calc(100vh-320px)] overflow-y-auto overscroll-contain pr-0.5 scrollbar-thin">

              {filteredNewsletters.length === 0 ? (

                <div className="text-center py-10 px-4 text-sm sm:text-base text-theme-muted leading-relaxed">
                  No newsletters match your search criteria.
                </div>

              ) : (

                filteredNewsletters.map((newsletter) => {

                  const isSelected =
                    newsletter.id ===
                    activeNewsletter.id;

                  return (
                    <button
                      key={newsletter.id}
                      onClick={() =>
                        handleSelectNewsletter(
                          newsletter.id
                        )
                      }
                      className={`
                        w-full
                        min-h-[120px]
                        text-left
                        p-3.5
                        sm:p-4
                        rounded-xl
                        border
                        transition-all
                        cursor-pointer
                        touch-manipulation
                        flex
                        flex-col
                        gap-2
                        ${
                          isSelected
                            ? 'bg-theme-brass/10 border-theme-brass/50 text-theme-main shadow-xs'
                            : 'bg-theme-main/50 border-theme hover:border-theme-brass/30 text-theme-muted hover:text-theme-main'
                        }
                      `}
                    >

                      {/* Date / Newsletter Number */}

                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">

                        <span className="text-theme-brass font-semibold whitespace-nowrap">
                          {formatNewsletterDate(
                            newsletter.date
                          )}
                        </span>

                        <span className="text-theme-muted whitespace-nowrap">
                          {newsletter.issueNumber}
                        </span>

                      </div>

                      {/* Title */}

                      <h3
                        className={`
                          text-sm
                          sm:text-base
                          font-serif
                          leading-snug
                          line-clamp-2
                          ${
                            isSelected
                              ? 'font-semibold text-theme-main'
                              : 'font-normal'
                          }
                        `}
                      >
                        {newsletter.title}
                      </h3>

                      {/* Category + Read Time */}

                      <div className="flex items-center justify-between gap-2 pt-1 mt-auto">

                        <span className="max-w-[65%] truncate text-xs px-2.5 py-1.5 rounded bg-theme-surface border border-theme text-theme-muted">
                          {newsletter.category}
                        </span>

                        <span className="shrink-0 text-xs text-theme-muted flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {newsletter.readTime}
                        </span>

                      </div>

                    </button>
                  );
                })
              )}

            </div>

          </div>

        </aside>

        {/* =======================================================
            RIGHT COLUMN — ACTIVE NEWSLETTER
        ======================================================= */}

        <main className="lg:col-span-8 xl:col-span-8 min-w-0">

          <article className="bg-theme-surface border border-theme rounded-2xl overflow-hidden shadow-md">

            {/* ===================================================
                HEADER BANNER
            =================================================== */}

            <div className="bg-[#0D0C0A] text-[#E8E4D9] px-4 py-7 sm:px-8 sm:py-9 lg:p-10 border-b border-[#3A3326] relative text-center space-y-4">

              <div className="inline-flex items-center justify-center p-2.5 sm:p-3 rounded-xl bg-[#1A1814] border border-[#3A3326]">
                <BrandMark
                  size={34}
                  variant="brass"
                />
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF8F5] tracking-tight font-normal break-words">
                CryptoConfidant.com
              </h1>

              <p className="text-sm sm:text-base leading-relaxed font-sans text-[#C5C0B6] tracking-wide max-w-lg mx-auto">
                Confidential conversations and education on wealth sovereignty and crypto options.
              </p>

              {/* Date / Newsletter */}

              <div className="pt-4 mt-1 flex items-center justify-between gap-4 border-t border-[#2A261F] text-xs sm:text-sm font-medium text-[#D4C5A9]">

                <span className="font-bold tracking-wide">
                  {formatNewsletterDate(
                    activeNewsletter.date
                  )}
                </span>

                <span>
                  {activeNewsletter.issueNumber}
                </span>

              </div>

            </div>

            {/* ===================================================
                NEWSLETTER ARTICLE BODY
            =================================================== */}

            <div className="px-4 py-7 sm:px-7 sm:py-9 lg:p-10 space-y-8 sm:space-y-9">

              {/* Article Title */}

              <div className="space-y-4 pb-6 sm:pb-7 border-b border-theme-subtle">

                <div className="inline-flex max-w-full items-center gap-2 px-3.5 py-2 rounded-full bg-theme-brass/10 border border-theme-brass/30 text-theme-brass text-xs sm:text-sm font-medium">

                  <span className="truncate">
                    {activeNewsletter.category}
                  </span>

                  <span className="shrink-0">
                    •
                  </span>

                  <span className="shrink-0">
                    {activeNewsletter.readTime}
                  </span>

                </div>

                <h2 className="font-serif text-[1.8rem] leading-[1.2] sm:text-3xl lg:text-4xl font-normal text-theme-main break-words">
                  {activeNewsletter.title}
                </h2>

                {activeNewsletter.subtitle && (
                  <p className="text-base sm:text-lg text-theme-muted font-sans italic leading-relaxed">
                    {activeNewsletter.subtitle}
                  </p>
                )}

              </div>

              {/* =================================================
                  INTRO PARAGRAPHS
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
                  (paragraph, index) => (
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

                  <h3 className="font-serif text-xl sm:text-2xl text-theme-main font-semibold border-b border-theme pb-2.5">
                    Quick Summary
                  </h3>

                  {/* Desktop / tablet table */}

                  <div className="hidden sm:block overflow-x-auto border border-theme rounded-xl">

                    <table className="w-full text-left text-base border-collapse">

                      <thead>
                        <tr className="bg-theme-surface-hover border-b border-theme text-theme-muted uppercase font-medium text-xs sm:text-sm">

                          <th className="py-3.5 px-4 w-1/4 font-semibold">
                            Aspect
                          </th>

                          <th className="py-3.5 px-4 w-3/4 font-semibold">
                            Details
                          </th>

                        </tr>
                      </thead>

                      <tbody className="divide-y divide-theme-subtle text-theme-main">

                        {activeNewsletter.summaryTable.how && (
                          <tr>

                            <td className="py-4 px-4 font-semibold text-theme-brass align-top">
                              How
                            </td>

                            <td className="py-4 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.how}
                            </td>

                          </tr>
                        )}

                        {activeNewsletter.summaryTable.when && (
                          <tr>

                            <td className="py-4 px-4 font-semibold text-theme-brass align-top">
                              When
                            </td>

                            <td className="py-4 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.when}
                            </td>

                          </tr>
                        )}

                        {activeNewsletter.summaryTable.where && (
                          <tr>

                            <td className="py-4 px-4 font-semibold text-theme-brass align-top">
                              Where
                            </td>

                            <td className="py-4 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.where}
                            </td>

                          </tr>
                        )}

                        {activeNewsletter.summaryTable.why && (
                          <tr>

                            <td className="py-4 px-4 font-semibold text-theme-brass align-top">
                              Why
                            </td>

                            <td className="py-4 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.why}
                            </td>

                          </tr>
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* Mobile cards */}

                  <div className="sm:hidden space-y-3">

                    {activeNewsletter.summaryTable.how && (
                      <div className="rounded-xl border border-theme bg-theme-main/30 p-4">

                        <div className="text-xs font-medium uppercase tracking-wide text-theme-brass mb-2">
                          How
                        </div>

                        <div className="text-base leading-[1.7] text-theme-main">
                          {activeNewsletter.summaryTable.how}
                        </div>

                      </div>
                    )}

                    {activeNewsletter.summaryTable.when && (
                      <div className="rounded-xl border border-theme bg-theme-main/30 p-4">

                        <div className="text-xs font-medium uppercase tracking-wide text-theme-brass mb-2">
                          When
                        </div>

                        <div className="text-base leading-[1.7] text-theme-main">
                          {activeNewsletter.summaryTable.when}
                        </div>

                      </div>
                    )}

                    {activeNewsletter.summaryTable.where && (
                      <div className="rounded-xl border border-theme bg-theme-main/30 p-4">

                        <div className="text-xs font-medium uppercase tracking-wide text-theme-brass mb-2">
                          Where
                        </div>

                        <div className="text-base leading-[1.7] text-theme-main">
                          {activeNewsletter.summaryTable.where}
                        </div>

                      </div>
                    )}

                    {activeNewsletter.summaryTable.why && (
                      <div className="rounded-xl border border-theme bg-theme-main/30 p-4">

                        <div className="text-xs font-medium uppercase tracking-wide text-theme-brass mb-2">
                          Why
                        </div>

                        <div className="text-base leading-[1.7] text-theme-main">
                          {activeNewsletter.summaryTable.why}
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* =================================================
                  PROTECTION STEPS / RISK MANAGEMENT
              ================================================= */}

              {activeNewsletter.protectionSteps &&
                activeNewsletter.protectionSteps.length > 0 && (

                  <div className="space-y-7 pt-1">

                    {activeNewsletter.protectionSteps.map(
                      (section, index) => (

                        <div
                          key={index}
                          className="space-y-4"
                        >

                          <h3 className="font-serif text-xl sm:text-2xl text-theme-main font-semibold border-b border-theme pb-2.5">
                            {section.sectionTitle}
                          </h3>

                          {section.description && (
                            <p className="text-base sm:text-[17px] text-theme-muted leading-[1.75]">
                              {section.description}
                            </p>
                          )}

                          <div className="grid grid-cols-1 gap-3">

                            {section.items.map(
                              (item, itemIndex) => (

                                <div
                                  key={itemIndex}
                                  className="p-4 sm:p-5 rounded-xl bg-theme-main/40 border border-theme flex items-start gap-3.5"
                                >

                                  {item.step ? (

                                    <span className="w-8 h-8 rounded-full bg-theme-brass/20 text-theme-brass font-medium text-sm flex items-center justify-center shrink-0 mt-0.5">
                                      {item.step}
                                    </span>

                                  ) : (

                                    <CheckCircle2 className="w-5 h-5 text-theme-brass shrink-0 mt-1" />

                                  )}

                                  <div className="space-y-2 text-base min-w-0">

                                    {item.title && (
                                      <div className="font-semibold text-theme-main leading-snug">
                                        {item.title}
                                      </div>
                                    )}

                                    <div className="text-theme-muted leading-[1.75] break-words">
                                      {item.action}
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
                <div className="space-y-4 pt-1">

                  <h3 className="font-serif text-xl sm:text-2xl text-theme-main font-semibold border-b border-theme pb-2.5">
                    {activeNewsletter.bestPractices.title}
                  </h3>

                  {/* Desktop / tablet table */}

                  <div className="hidden sm:block overflow-x-auto border border-theme rounded-xl">

                    <table className="w-full text-left text-base border-collapse">

                      <thead>
                        <tr className="bg-theme-surface-hover border-b border-theme text-theme-muted uppercase font-medium text-xs sm:text-sm">

                          <th className="py-3.5 px-4 w-1/3 font-semibold">
                            Practice
                          </th>

                          <th className="py-3.5 px-4 w-2/3 font-semibold">
                            Why It Matters
                          </th>

                        </tr>
                      </thead>

                      <tbody className="divide-y divide-theme-subtle text-theme-main">

                        {activeNewsletter.bestPractices.items.map(
                          (item, index) => (

                            <tr key={index}>

                              <td className="py-4 px-4 font-semibold text-theme-main align-top">
                                {item.practice}
                              </td>

                              <td className="py-4 px-4 leading-relaxed text-theme-muted">
                                {item.why}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* Mobile cards */}

                  <div className="sm:hidden space-y-3">

                    {activeNewsletter.bestPractices.items.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="rounded-xl border border-theme bg-theme-main/30 p-4"
                        >

                          <div className="font-semibold text-base text-theme-main leading-snug mb-2.5">
                            {item.practice}
                          </div>

                          <div className="text-base text-theme-muted leading-[1.7]">
                            {item.why}
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
                <div className="space-y-4 pt-1">

                  <h3 className="font-serif text-xl sm:text-2xl text-theme-main font-semibold border-b border-theme pb-2.5">
                    {activeNewsletter.additionalPoints.title ||
                      'Additional Security Measures'}
                  </h3>

                  <ul className="space-y-4 text-base sm:text-[17px] text-theme-muted">

                    {activeNewsletter.additionalPoints.items.map(
                      (point, index) => (

                        <li
                          key={index}
                          className="flex items-start gap-3"
                        >

                          <span className="text-theme-brass font-bold shrink-0 mt-0.5">
                            •
                          </span>

                          <span className="leading-[1.75] min-w-0 break-words">
                            {point}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                </div>
              )}

              {/* =================================================
                  SOURCES FOOTER
              ================================================= */}

              {activeNewsletter.sources &&
                activeNewsletter.sources.length > 0 && (

                  <div className="bg-theme-surface-hover border border-theme rounded-xl p-4 sm:p-5 space-y-4">

                    <div className="text-xs sm:text-sm uppercase tracking-wide text-theme-brass font-semibold">
                      Sources & Documentation
                    </div>

                    <ul className="space-y-4 text-sm sm:text-base text-theme-muted">

                      {activeNewsletter.sources.map(
                        (source, index) => (

                          <li
                            key={index}
                            className="flex items-start gap-3"
                          >

                            <ExternalLink className="w-4 h-4 text-theme-brass shrink-0 mt-1" />

                            <div className="min-w-0 leading-[1.7] break-words">

                              <strong className="text-theme-main font-semibold">
                                {source.name}:{' '}
                              </strong>

                              <span>
                                {source.details}
                              </span>

                            </div>

                          </li>

                        )
                      )}

                    </ul>

                  </div>
                )}

              {/* =================================================
                  ARTICLE FOOTER
              ================================================= */}

              <div className="pt-7 sm:pt-9 border-t border-theme-subtle flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                {/* Brand */}

                <div className="flex items-center gap-3 min-w-0">

                  <BrandMark
                    size={28}
                    variant="brass"
                  />

                  <div className="text-sm sm:text-base font-serif text-theme-main">
                    CryptoConfidant.com Confidential Intelligence
                  </div>

                </div>

                {/* Previous / Next Navigation */}

                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">

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
                        transition-colors
                        cursor-pointer
                        touch-manipulation
                      "
                      title={`Older issue: ${prevNewsletter.title}`}
                      aria-label={`Older issue ${prevNewsletter.issueNumber}`}
                    >

                      <ArrowLeft className="w-4 h-4 shrink-0" />

                      <span>
                        {prevNewsletter.issueNumber}
                      </span>

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
                        transition-colors
                        cursor-pointer
                        touch-manipulation
                      "
                      title={`Newer issue: ${nextNewsletter.title}`}
                      aria-label={`Newer issue ${nextNewsletter.issueNumber}`}
                    >

                      <span>
                        {nextNewsletter.issueNumber}
                      </span>

                      <ArrowRight className="w-4 h-4 shrink-0" />

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