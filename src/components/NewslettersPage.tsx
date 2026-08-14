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
} from 'lucide-react';

interface NewslettersPageProps {
  onBackHome: () => void;
  initialNewsletterId?: string;
  onOpenPricing?: () => void;
}

export const NewslettersPage: React.FC<NewslettersPageProps> = ({
  onBackHome,
  initialNewsletterId,
  onOpenPricing
}) => {

  /*
   * Convert the newsletter date into ISO format:
   *
   * August 4, 2026
   *        ↓
   * 2026-08-04
   *
   * This keeps the existing newsletter data unchanged
   * while displaying dates consistently as YYYY-MM-DD.
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
   *
   * Supports values such as:
   *
   * Newsletter 01
   * Newsletter 04
   * Newsletter 12
   * 01
   * 04
   *
   * This is used only for sorting.
   */
  const getIssueNumber = (issueNumber: string): number => {
    const match = issueNumber.match(/\d+/);

    return match ? parseInt(match[0], 10) : 0;
  };

  /*
   * Sort newsletters:
   *
   * 1. Newest date → oldest date
   * 2. If multiple newsletters have the SAME date,
   *    larger newsletter number → smaller newsletter number
   *
   * Example:
   *
   * 2026-08-05 — Newsletter 06
   * 2026-08-05 — Newsletter 05
   * 2026-08-05 — Newsletter 04
   * 2026-08-04 — Newsletter 03
   * 2026-08-04 — Newsletter 02
   * 2026-08-03 — Newsletter 01
   */
  const sortedNewsletters = [...NEWSLETTERS].sort((a, b) => {
    const dateDifference =
      new Date(b.date).getTime() -
      new Date(a.date).getTime();

    // If dates are different, newest date comes first.
    if (dateDifference !== 0) {
      return dateDifference;
    }

    // If dates are identical, larger newsletter number comes first.
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
   * Scroll to top when selected newsletter changes.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
   * Filter the already correctly sorted newsletter list.
   *
   * Search results therefore retain:
   *
   * newest date → oldest date
   * and
   * largest issue number → smallest issue number
   * within the same date.
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
   * Navigation follows the same sorted order:
   *
   * [Newest]
   * 2026-08-05 — Newsletter 06
   * 2026-08-05 — Newsletter 05
   * 2026-08-05 — Newsletter 04
   * 2026-08-04 — Newsletter 03
   *
   * Previous = next item in the list = older
   * Next     = previous item in the list = newer
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

  if (!activeNewsletter) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-theme-muted">
            No newsletters available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* =========================================================
          TOP HEADER / BREADCRUMBS
      ========================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-theme-subtle mb-8">

        <button
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-theme-muted hover:text-theme-brass transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-theme-muted uppercase tracking-widest">
            {sortedNewsletters.length} Issues Published
          </span>
        </div>

      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* =======================================================
            LEFT COLUMN — NEWSLETTER ARCHIVE
        ======================================================= */}

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-theme-surface border border-theme rounded-2xl p-5 shadow-xs space-y-4">

            {/* Archive Header */}

            <div className="flex items-center justify-between">

              <h2 className="font-serif text-lg text-theme-main font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-theme-brass" />
                <span>Newsletter Dispatch</span>
              </h2>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface-hover text-theme-brass border border-theme">
                Archive
              </span>

            </div>

            {/* Search Input */}

            <div className="relative">

              <Search className="w-4 h-4 text-theme-muted absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="Search issues, topics, rules..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full bg-theme-main border border-theme rounded-xl pl-9 pr-3 py-2 text-xs text-theme-main placeholder:text-theme-muted focus:outline-none focus:border-theme-brass transition-colors"
              />

            </div>

            {/* Category Filter Pills */}

            <div className="flex flex-wrap gap-1.5 pt-1">

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-theme-brass/20 text-theme-brass border border-theme-brass/40 font-semibold'
                      : 'bg-theme-surface-hover text-theme-muted hover:text-theme-main border border-theme'
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

            {/* Newsletter List */}

            <div className="space-y-2 pt-2 max-h-[600px] overflow-y-auto pr-1">

              {filteredNewsletters.length === 0 ? (

                <div className="text-center py-8 text-xs text-theme-muted">
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
                        setSelectedNewsletterId(
                          newsletter.id
                        )
                      }
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-theme-brass/10 border-theme-brass/50 text-theme-main shadow-xs'
                          : 'bg-theme-main/50 border-theme hover:border-theme-brass/30 text-theme-muted hover:text-theme-main'
                      }`}
                    >

                      {/* Date LEFT / Newsletter Number RIGHT */}

                      <div className="flex items-center justify-between text-[11px] font-mono">

                        <span className="text-theme-brass font-semibold">
                          {formatNewsletterDate(
                            newsletter.date
                          )}
                        </span>

                        <span className="text-theme-muted">
                          {newsletter.issueNumber}
                        </span>

                      </div>

                      {/* Title */}

                      <h3
                        className={`text-xs font-serif leading-snug line-clamp-2 ${
                          isSelected
                            ? 'font-semibold text-theme-main'
                            : 'font-normal'
                        }`}
                      >
                        {newsletter.title}
                      </h3>

                      {/* Category + Read Time */}

                      <div className="flex items-center justify-between pt-1">

                        <span className="text-[10px] px-2 py-0.5 rounded bg-theme-surface border border-theme text-theme-muted">
                          {newsletter.category}
                        </span>

                        <span className="text-[10px] text-theme-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {newsletter.readTime}
                        </span>

                      </div>

                    </button>
                  );
                })
              )}

            </div>

          </div>

        </div>

        {/* =======================================================
            RIGHT COLUMN — ACTIVE NEWSLETTER
        ======================================================= */}

        <div className="lg:col-span-8">

          <article className="bg-theme-surface border border-theme rounded-2xl overflow-hidden shadow-md">

            {/* ===================================================
                HEADER BANNER
            =================================================== */}

            <div className="bg-[#0D0C0A] text-[#E8E4D9] p-6 sm:p-10 border-b border-[#3A3326] relative text-center space-y-3">

              <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#1A1814] border border-[#3A3326]">
                <BrandMark
                  size={36}
                  variant="brass"
                />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] tracking-tight font-normal">
                CryptoConfidant.com
              </h1>

              <p className="text-xs sm:text-sm font-sans text-[#A39E93] tracking-wide max-w-md mx-auto">
                Confidential conversations and education on wealth sovereignty and crypto options.
              </p>

              {/* Date LEFT / Newsletter RIGHT */}

              <div className="pt-4 flex items-center justify-between border-t border-[#2A261F] text-xs font-mono text-[#D4C5A9]">

                <span className="font-bold tracking-wider">
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

            <div className="p-6 sm:p-10 space-y-8">

              {/* Article Title */}

              <div className="space-y-3 pb-6 border-b border-theme-subtle">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-brass/10 border border-theme-brass/30 text-theme-brass text-xs font-mono">

                  <span>
                    {activeNewsletter.category}
                  </span>

                  <span>•</span>

                  <span>
                    {activeNewsletter.readTime}
                  </span>

                </div>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-theme-main leading-snug">
                  {activeNewsletter.title}
                </h2>

                {activeNewsletter.subtitle && (
                  <p className="text-sm sm:text-base text-theme-muted font-sans italic">
                    {activeNewsletter.subtitle}
                  </p>
                )}

              </div>

              {/* =================================================
                  INTRO PARAGRAPHS
              ================================================= */}

              <div className="space-y-4 text-sm sm:text-base text-theme-main/90 leading-relaxed font-sans">

                {activeNewsletter.introParagraphs.map(
                  (paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                )}

              </div>

              {/* =================================================
                  QUICK SUMMARY TABLE
              ================================================= */}

              {activeNewsletter.summaryTable && (
                <div className="space-y-3 pt-2">

                  <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                    Quick Summary
                  </h3>

                  <div className="overflow-x-auto border border-theme rounded-xl">

                    <table className="w-full text-left text-xs sm:text-sm border-collapse">

                      <thead>

                        <tr className="bg-theme-surface-hover border-b border-theme text-theme-muted uppercase font-mono text-[11px]">

                          <th className="py-3 px-4 w-1/4 font-semibold">
                            Aspect
                          </th>

                          <th className="py-3 px-4 w-3/4 font-semibold">
                            Details
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-theme-subtle text-theme-main">

                        {activeNewsletter.summaryTable.how && (
                          <tr>

                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">
                              How
                            </td>

                            <td className="py-3 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.how}
                            </td>

                          </tr>
                        )}

                        {activeNewsletter.summaryTable.when && (
                          <tr>

                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">
                              When
                            </td>

                            <td className="py-3 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.when}
                            </td>

                          </tr>
                        )}

                        {activeNewsletter.summaryTable.where && (
                          <tr>

                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">
                              Where
                            </td>

                            <td className="py-3 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.where}
                            </td>

                          </tr>
                        )}

                        {activeNewsletter.summaryTable.why && (
                          <tr>

                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">
                              Why
                            </td>

                            <td className="py-3 px-4 leading-relaxed">
                              {activeNewsletter.summaryTable.why}
                            </td>

                          </tr>
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

              {/* =================================================
                  PROTECTION STEPS / RISK MANAGEMENT
              ================================================= */}

              {activeNewsletter.protectionSteps &&
                activeNewsletter.protectionSteps.length > 0 && (

                  <div className="space-y-6 pt-2">

                    {activeNewsletter.protectionSteps.map(
                      (section, index) => (

                        <div
                          key={index}
                          className="space-y-4"
                        >

                          <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                            {section.sectionTitle}
                          </h3>

                          {section.description && (
                            <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                              {section.description}
                            </p>
                          )}

                          <div className="grid grid-cols-1 gap-3">

                            {section.items.map(
                              (item, itemIndex) => (

                                <div
                                  key={itemIndex}
                                  className="p-4 rounded-xl bg-theme-main/40 border border-theme flex items-start gap-3.5"
                                >

                                  {item.step ? (

                                    <span className="w-6 h-6 rounded-full bg-theme-brass/20 text-theme-brass font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {item.step}
                                    </span>

                                  ) : (

                                    <CheckCircle2 className="w-5 h-5 text-theme-brass shrink-0 mt-0.5" />

                                  )}

                                  <div className="space-y-1 text-xs sm:text-sm">

                                    {item.title && (
                                      <div className="font-semibold text-theme-main">
                                        {item.title}
                                      </div>
                                    )}

                                    <div className="text-theme-muted leading-relaxed">
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
                <div className="space-y-4 pt-2">

                  <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                    {activeNewsletter.bestPractices.title}
                  </h3>

                  <div className="overflow-x-auto border border-theme rounded-xl">

                    <table className="w-full text-left text-xs sm:text-sm border-collapse">

                      <thead>

                        <tr className="bg-theme-surface-hover border-b border-theme text-theme-muted uppercase font-mono text-[11px]">

                          <th className="py-3 px-4 w-1/3 font-semibold">
                            Practice
                          </th>

                          <th className="py-3 px-4 w-2/3 font-semibold">
                            Why It Matters
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-theme-subtle text-theme-main">

                        {activeNewsletter.bestPractices.items.map(
                          (item, index) => (

                            <tr key={index}>

                              <td className="py-3 px-4 font-semibold text-theme-main align-top font-sans">
                                {item.practice}
                              </td>

                              <td className="py-3 px-4 leading-relaxed text-theme-muted">
                                {item.why}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>
              )}

              {/* =================================================
                  ADDITIONAL POINTS
              ================================================= */}

              {activeNewsletter.additionalPoints && (
                <div className="space-y-3 pt-2">

                  <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                    {activeNewsletter.additionalPoints.title ||
                      'Additional Security Measures'}
                  </h3>

                  <ul className="space-y-2 text-xs sm:text-sm text-theme-muted">

                    {activeNewsletter.additionalPoints.items.map(
                      (point, index) => (

                        <li
                          key={index}
                          className="flex items-start gap-2"
                        >

                          <span className="text-theme-brass font-bold">
                            •
                          </span>

                          <span>
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

                  <div className="bg-theme-surface-hover border border-theme rounded-xl p-5 space-y-3">

                    <div className="text-xs font-mono uppercase tracking-wider text-theme-brass font-semibold">
                      Sources & Documentation
                    </div>

                    <ul className="space-y-2 text-xs text-theme-muted">

                      {activeNewsletter.sources.map(
                        (source, index) => (

                          <li
                            key={index}
                            className="flex items-start gap-2"
                          >

                            <ExternalLink className="w-3.5 h-3.5 text-theme-brass shrink-0 mt-0.5" />

                            <div>

                              <strong className="text-theme-main font-medium">
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

              <div className="pt-8 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <BrandMark
                    size={28}
                    variant="brass"
                  />

                  <div className="text-xs font-serif text-theme-main">
                    CryptoConfidant.com Confidential Intelligence
                  </div>

                </div>

                {/* Previous / Next Navigation */}

                <div className="flex items-center gap-2">

                  {prevNewsletter && (
                    <button
                      onClick={() =>
                        setSelectedNewsletterId(
                          prevNewsletter.id
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-theme-muted hover:text-theme-main border border-theme rounded-xl bg-theme-surface hover:bg-theme-surface-hover transition-colors cursor-pointer"
                      title={`Older issue: ${prevNewsletter.title}`}
                    >

                      <ArrowLeft className="w-3.5 h-3.5" />

                      <span>
                        {prevNewsletter.issueNumber}
                      </span>

                    </button>
                  )}

                  {nextNewsletter && (
                    <button
                      onClick={() =>
                        setSelectedNewsletterId(
                          nextNewsletter.id
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-theme-muted hover:text-theme-main border border-theme rounded-xl bg-theme-surface hover:bg-theme-surface-hover transition-colors cursor-pointer"
                      title={`Newer issue: ${nextNewsletter.title}`}
                    >

                      <span>
                        {nextNewsletter.issueNumber}
                      </span>

                      <ArrowRight className="w-3.5 h-3.5" />

                    </button>
                  )}

                </div>

              </div>

            </div>

          </article>

        </div>

      </div>

    </div>
  );
};