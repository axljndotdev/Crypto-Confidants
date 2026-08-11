import React, { useState, useEffect } from 'react';
import { NEWSLETTERS, Newsletter } from '../data/newsletters';
import { BrandMark } from './BrandMark';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  BookOpen, 
  Search, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2
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
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(
    initialNewsletterId || NEWSLETTERS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Scroll to top when selected newsletter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedNewsletterId]);

  const categories = ['All', ...Array.from(new Set(NEWSLETTERS.map((n) => n.category)))];

  const filteredNewsletters = NEWSLETTERS.filter((n) => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.issueNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.introParagraphs.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeNewsletter = NEWSLETTERS.find((n) => n.id === selectedNewsletterId) || NEWSLETTERS[0];
  const activeIndex = NEWSLETTERS.findIndex((n) => n.id === activeNewsletter.id);
  const prevNewsletter = activeIndex > 0 ? NEWSLETTERS[activeIndex - 1] : null;
  const nextNewsletter = activeIndex < NEWSLETTERS.length - 1 ? NEWSLETTERS[activeIndex + 1] : null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header / Breadcrumbs */}
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
            {NEWSLETTERS.length} Issues Published
          </span>
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-full shadow-xs hover:brightness-105 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Get Confidential Guidance</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Newsletter Archive Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-theme-surface border border-theme rounded-2xl p-5 shadow-xs space-y-4">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-theme-main border border-theme rounded-xl pl-9 pr-3 py-2 text-xs text-theme-main placeholder:text-theme-muted focus:outline-none focus:border-theme-brass transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-theme-brass/20 text-theme-brass border border-theme-brass/40 font-semibold'
                      : 'bg-theme-surface-hover text-theme-muted hover:text-theme-main border border-theme'
                  }`}
                >
                  {cat}
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
                  const isSelected = newsletter.id === activeNewsletter.id;
                  return (
                    <button
                      key={newsletter.id}
                      onClick={() => setSelectedNewsletterId(newsletter.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-theme-brass/10 border-theme-brass/50 text-theme-main shadow-xs'
                          : 'bg-theme-main/50 border-theme hover:border-theme-brass/30 text-theme-muted hover:text-theme-main'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-theme-brass font-semibold">{newsletter.issueNumber}</span>
                        <span className="text-theme-muted">{newsletter.date}</span>
                      </div>
                      <h3 className={`text-xs font-serif leading-snug line-clamp-2 ${isSelected ? 'font-semibold text-theme-main' : 'font-normal'}`}>
                        {newsletter.title}
                      </h3>
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

        {/* Right Column: Active Newsletter Reader */}
        <div className="lg:col-span-8">
          <article className="bg-theme-surface border border-theme rounded-2xl overflow-hidden shadow-md">
            
            {/* Header Banner - Recreating the authentic PDF masthead */}
            <div className="bg-[#0D0C0A] text-[#E8E4D9] p-6 sm:p-10 border-b border-[#3A3326] relative text-center space-y-3">
              <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#1A1814] border border-[#3A3326]">
                <BrandMark size={36} variant="brass" />
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] tracking-tight font-normal">
                CryptoConfidant.com
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#A39E93] tracking-wide max-w-md mx-auto">
                Confidential conversations and education on wealth sovereignty and crypto options.
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-[#2A261F] text-xs font-mono text-[#D4C5A9]">
                <span className="font-bold tracking-wider">{activeNewsletter.issueNumber}</span>
                <span>{activeNewsletter.date}</span>
              </div>
            </div>

            {/* Newsletter Article Body */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Article Title */}
              <div className="space-y-3 pb-6 border-b border-theme-subtle">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-brass/10 border border-theme-brass/30 text-theme-brass text-xs font-mono">
                  <span>{activeNewsletter.category}</span>
                  <span>•</span>
                  <span>{activeNewsletter.readTime}</span>
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

              {/* Intro Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-theme-main/90 leading-relaxed font-sans">
                {activeNewsletter.introParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Quick Summary Table */}
              {activeNewsletter.summaryTable && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                    Quick Summary
                  </h3>

                  <div className="overflow-x-auto border border-theme rounded-xl">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-theme-surface-hover border-b border-theme text-theme-muted uppercase font-mono text-[11px]">
                          <th className="py-3 px-4 w-1/4 font-semibold">Aspect</th>
                          <th className="py-3 px-4 w-3/4 font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-subtle text-theme-main">
                        {activeNewsletter.summaryTable.how && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">How</td>
                            <td className="py-3 px-4 leading-relaxed">{activeNewsletter.summaryTable.how}</td>
                          </tr>
                        )}
                        {activeNewsletter.summaryTable.when && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">When</td>
                            <td className="py-3 px-4 leading-relaxed">{activeNewsletter.summaryTable.when}</td>
                          </tr>
                        )}
                        {activeNewsletter.summaryTable.where && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">Where</td>
                            <td className="py-3 px-4 leading-relaxed">{activeNewsletter.summaryTable.where}</td>
                          </tr>
                        )}
                        {activeNewsletter.summaryTable.why && (
                          <tr>
                            <td className="py-3 px-4 font-semibold text-theme-brass align-top font-mono">Why</td>
                            <td className="py-3 px-4 leading-relaxed">{activeNewsletter.summaryTable.why}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Protection Steps / Risk Management */}
              {activeNewsletter.protectionSteps && activeNewsletter.protectionSteps.length > 0 && (
                <div className="space-y-6 pt-2">
                  {activeNewsletter.protectionSteps.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                        {section.sectionTitle}
                      </h3>

                      {section.description && (
                        <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                          {section.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        {section.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
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
                                <div className="font-semibold text-theme-main">{item.title}</div>
                              )}
                              <div className="text-theme-muted leading-relaxed">{item.action}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Best Practices */}
              {activeNewsletter.bestPractices && (
                <div className="space-y-4 pt-2">
                  <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                    {activeNewsletter.bestPractices.title}
                  </h3>

                  <div className="overflow-x-auto border border-theme rounded-xl">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-theme-surface-hover border-b border-theme text-theme-muted uppercase font-mono text-[11px]">
                          <th className="py-3 px-4 w-1/3 font-semibold">Practice</th>
                          <th className="py-3 px-4 w-2/3 font-semibold">Why It Matters</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-subtle text-theme-main">
                        {activeNewsletter.bestPractices.items.map((item, bpIdx) => (
                          <tr key={bpIdx}>
                            <td className="py-3 px-4 font-semibold text-theme-main align-top font-sans">{item.practice}</td>
                            <td className="py-3 px-4 leading-relaxed text-theme-muted">{item.why}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Additional Points */}
              {activeNewsletter.additionalPoints && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif text-xl text-theme-main font-medium border-b border-theme pb-2">
                    {activeNewsletter.additionalPoints.title || 'Additional Security Measures'}
                  </h3>

                  <ul className="space-y-2 text-xs sm:text-sm text-theme-muted">
                    {activeNewsletter.additionalPoints.items.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-theme-brass font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources Footer */}
              {activeNewsletter.sources && activeNewsletter.sources.length > 0 && (
                <div className="bg-theme-surface-hover border border-theme rounded-xl p-5 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-theme-brass font-semibold">
                    Sources & Documentation
                  </div>
                  <ul className="space-y-2 text-xs text-theme-muted">
                    {activeNewsletter.sources.map((src, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-theme-brass shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-theme-main font-medium">{src.name}: </strong>
                          <span>{src.details}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article Footer Masthead */}
              <div className="pt-8 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BrandMark size={28} variant="brass" />
                  <div className="text-xs font-serif text-theme-main">
                    CryptoConfidant.com Confidential Intelligence
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {prevNewsletter && (
                    <button
                      onClick={() => setSelectedNewsletterId(prevNewsletter.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-theme-muted hover:text-theme-main border border-theme rounded-xl bg-theme-surface hover:bg-theme-surface-hover transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{prevNewsletter.issueNumber}</span>
                    </button>
                  )}

                  {nextNewsletter && (
                    <button
                      onClick={() => setSelectedNewsletterId(nextNewsletter.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-theme-muted hover:text-theme-main border border-theme rounded-xl bg-theme-surface hover:bg-theme-surface-hover transition-colors cursor-pointer"
                    >
                      <span>{nextNewsletter.issueNumber}</span>
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
