import React from 'react';
import { SiteContent } from '../types';

interface StartHereSectionProps {
  onOpenConsultation?: () => void;
  onOpenPricing?: () => void;
  onBackToTop: () => void;
  content?: SiteContent['startHere'];
}

export const StartHereSection: React.FC<StartHereSectionProps> = ({
  onOpenPricing,
  onBackToTop,
  content,
}) => {
  const eyebrow = content?.eyebrow || 'START HERE';
  const heading = content?.heading || "Don't wait for the knock on the door.";
  const subparagraph = content?.subparagraph || 'Talk to somebody with experience who has actually been through it. A confidential first conversation to help you understand your options.';
  const ctaButtonText = content?.ctaButtonText || 'Book a conversation';
  const disclaimerText = content?.disclaimerText || 'Crypto Confidant provides general education and a confidential space to think through your situation. We are not a law firm, financial adviser, or custodian, and nothing here constitutes legal or financial advice. For anything requiring licensed advice, we refer you to independent qualified professionals in your jurisdiction.';

  return (
    <section id="start-here" className="pt-8 sm:pt-12 pb-20 md:pb-28 bg-theme-main transition-colors duration-300 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <span/>
          <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
            {eyebrow}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-theme-main tracking-tight leading-[1.12]">
          {heading}
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed font-normal">
          {subparagraph}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenPricing}
            className="px-7 py-3.5 text-sm sm:text-base font-semibold bg-[#8C5A1E] dark:bg-[#C89B4C] text-white dark:text-[#181611] rounded-full hover:opacity-90 transition-opacity cursor-pointer w-full sm:w-auto"
          >
            {ctaButtonText}
          </button>

          <button
            onClick={onBackToTop}
            className="px-7 py-3.5 text-sm sm:text-base font-medium text-theme-main border border-theme bg-transparent hover:bg-theme-surface rounded-full transition-colors cursor-pointer w-full sm:w-auto"
          >
            Back to top
          </button>
        </div>

        {/* Disclaimer Text */}
        <p className="text-xs sm:text-sm text-theme-muted/80 max-w-2xl mx-auto leading-relaxed font-normal pt-6">
          {disclaimerText}
        </p>

      </div>
    </section>
  );
};

