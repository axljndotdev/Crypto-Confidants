import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';

interface StartHereSectionProps {
  onOpenConsultation: () => void;
  onBackToTop: () => void;
}

export const StartHereSection: React.FC<StartHereSectionProps> = ({ onOpenConsultation, onBackToTop }) => {
  return (
    <section id="start-here" className="py-20 md:py-28 bg-theme-surface border-t border-theme relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-main text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
          START HERE
        </div>

        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-theme-main tracking-tight">
          Don't wait for the knock on the door.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed font-normal">
          Talk to someone who has actually been through it — not a call center, not a bot. A confidential first conversation to help you understand your options, no obligation.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenConsultation}
            className="flex items-center gap-2.5 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-md hover:brightness-105 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Mail className="w-4 h-4" />
            <span>Email us confidentially</span>
          </button>

          <button
            onClick={onBackToTop}
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-theme-main border border-theme rounded-xl bg-theme-main hover:bg-theme-surface transition-all cursor-pointer w-full sm:w-auto"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 text-theme-brass" />
          </button>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-6 rounded-2xl bg-theme-main border border-theme max-w-3xl mx-auto text-xs text-theme-muted leading-relaxed text-center space-y-2 mt-12">
          <p>
            Crypto Confidants provides general education and a confidential space to think through your situation. We are not a law firm, financial adviser, or custodian, and nothing here constitutes legal or financial advice. For anything requiring licensed advice, we refer you to independent qualified professionals in your jurisdiction.
          </p>
        </div>

      </div>
    </section>
  );
};
