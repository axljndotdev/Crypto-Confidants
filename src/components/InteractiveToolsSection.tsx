import React, { useState } from 'react';
import { SecurityAuditTool } from './SecurityAuditTool';
import { HardwareComparison } from './HardwareComparison';
import { EducationalHub } from './EducationalHub';
import { ShieldCheck, HardDrive, BookOpen } from 'lucide-react';

interface InteractiveToolsSectionProps {
  onOpenConsultation: (topic?: string) => void;
}

export const InteractiveToolsSection: React.FC<InteractiveToolsSectionProps> = ({ onOpenConsultation }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'hardware' | 'guides'>('audit');

  return (
    <section id="tools" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-surface text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            INTERACTIVE TOOLS & BLUEPRINTS
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            Self-Custody Audit & Hardware Matrix
          </h2>
          <p className="text-base sm:text-lg text-theme-muted leading-relaxed font-normal">
            Evaluate your operational security, compare air-gapped hardware cold storage devices, and explore sovereign architecture blueprints.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-3 border-b border-theme pb-4">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'text-[#0D0C0A] brass-gradient shadow-xs'
                : 'text-theme-muted border border-theme bg-theme-surface hover:text-theme-main'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security Audit Tool</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'hardware'
                ? 'text-[#0D0C0A] brass-gradient shadow-xs'
                : 'text-theme-muted border border-theme bg-theme-surface hover:text-theme-main'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Hardware Cold Storage Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'guides'
                ? 'text-[#0D0C0A] brass-gradient shadow-xs'
                : 'text-theme-muted border border-theme bg-theme-surface hover:text-theme-main'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Educational Blueprints</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-4">
          {activeTab === 'audit' && (
            <div id="audit">
              <SecurityAuditTool onOpenConsultationWithScore={(score) => onOpenConsultation(`audit:${score}`)} />
            </div>
          )}

          {activeTab === 'hardware' && (
            <div id="hardware">
              <HardwareComparison onOpenConsultation={onOpenConsultation} />
            </div>
          )}

          {activeTab === 'guides' && (
            <div id="guides">
              <EducationalHub onOpenConsultation={onOpenConsultation} />
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
