import React, { useState } from 'react';
import { EDUCATIONAL_GUIDES } from '../data';
import { EducationalGuide } from '../types';
import { BookOpen, Search, Filter, Clock, ArrowRight, X, Shield, CheckCircle2 } from 'lucide-react';

export const EducationalHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeGuideModal, setActiveGuideModal] = useState<EducationalGuide | null>(null);

  const categories = ['All', 'Self-Custody', 'Cold Storage', 'Inheritance', 'Tax & Mobility'];

  const filteredGuides = EDUCATIONAL_GUIDES.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="guides" className="py-20 bg-theme-main relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-surface text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            Education Repository
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            Independent Sovereign Knowledge
          </h2>
          <p className="text-sm text-theme-muted leading-relaxed">
            Curated blueprints on multi-sig vault engineering, seed passphrase security, and cross-border digital asset portability.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 p-4 rounded-xl bg-theme-surface border border-theme">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, terms, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-theme-main border border-theme rounded-lg text-theme-main focus:outline-none focus:border-theme-brass placeholder:text-theme-muted"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'border-theme-brass bg-theme-main text-theme-brass'
                    : 'border-theme text-theme-muted hover:text-theme-main'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="p-8 rounded-2xl bg-theme-surface border border-theme hover:border-theme-brass/40 transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
              onClick={() => setActiveGuideModal(guide)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-theme-brass border border-theme rounded-md bg-theme-main">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-theme-muted">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-theme-main border border-theme-subtle text-[10px] font-semibold text-theme-main">
                      {guide.level}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-theme-main group-hover:text-theme-brass transition-colors leading-tight">
                  {guide.title}
                </h3>

                <p className="text-xs text-theme-muted leading-relaxed">
                  {guide.summary}
                </p>

                {/* Key takeaways */}
                <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
                  {guide.keyTakeaways.slice(0, 2).map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-theme-main">
                      <CheckCircle2 className="w-3.5 h-3.5 text-theme-brass flex-shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-theme-subtle flex items-center justify-between">
                <span className="text-xs font-mono text-theme-muted">FULL BLUEPRINT AVAILABLE</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-theme-brass group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Reader */}
        {activeGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-theme-surface border border-theme brass-border-glow p-8 space-y-6 relative">
              
              <button
                onClick={() => setActiveGuideModal(null)}
                className="absolute top-6 right-6 p-2 rounded-lg border border-theme bg-theme-main text-theme-muted hover:text-theme-main transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-theme-brass">
                  <Shield className="w-4 h-4" />
                  <span>{activeGuideModal.category.toUpperCase()} • {activeGuideModal.level.toUpperCase()} LEVEL</span>
                </div>

                <h2 className="font-serif text-3xl font-bold text-theme-main leading-tight">
                  {activeGuideModal.title}
                </h2>

                <div className="text-xs text-theme-muted font-mono">
                  Estimated Reading Duration: {activeGuideModal.readTime}
                </div>
              </div>

              {/* Takeaways Box */}
              <div className="p-4 rounded-xl bg-theme-main border border-theme space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-theme-brass">
                  CORE EXECUTIVE TAKEAWAYS
                </div>
                <ul className="space-y-1.5">
                  {activeGuideModal.keyTakeaways.map((k, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-theme-main">
                      <CheckCircle2 className="w-3.5 h-3.5 text-theme-brass flex-shrink-0" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Body */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-theme-main leading-relaxed space-y-4 whitespace-pre-line border-t border-theme-subtle pt-4">
                {activeGuideModal.content}
              </div>

              <div className="pt-4 border-t border-theme-subtle flex justify-end">
                <button
                  onClick={() => setActiveGuideModal(null)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl"
                >
                  Close Blueprint
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
