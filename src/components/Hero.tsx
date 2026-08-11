import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';

interface HeroProps {
  onOpenPricing: () => void;
  onReadNewsletter: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPricing, onReadNewsletter }) => {
  return (
    <section data-theme="dark" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-[#0A0908] text-white border-b border-theme overflow-hidden">
      {/* Hero Vault Texture Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-referrer opacity-30 pointer-events-none transition-opacity duration-700"
        style={{ backgroundImage: `url('/vault-texture.jpg')` }}
      />
      
      {/* Vignette & Radial Glow Overlays for text legibility and rich atmosphere */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0A0908] via-[#0A0908]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A0908] via-transparent to-[#0A0908]/60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-8 text-left">
          
          {/* Eyebrow matching image: thin brass line + tracked uppercase text */}
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-10 h-[1.5px] bg-theme-brass inline-block shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              GLOBAL EDUCATION, A CONFIDENTIAL EAR
            </span>
          </div>

          {/* Headline matching exact font, size, line-height & line breaks */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[92px] font-normal tracking-tight text-theme-main leading-[1.02] max-w-xl">
            Your wealth shouldn't depend on staying in a government's good graces.
          </h1>

          {/* Sub-paragraph */}
          <p className="text-base sm:text-lg text-theme-muted max-w-2xl leading-relaxed font-normal pt-1">
            Crypto Confidants helps people around the world understand what's actually available in the crypto space — self-custody, cold storage, and true financial portability — and gives you a confidential space to think clearly through your own situation before you decide anything.
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onOpenPricing}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-semibold rounded-full bg-[#A6732E] hover:bg-[#C28938] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Start a confidential conversation</span>
            </button>

            <button
              onClick={onReadNewsletter}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-medium text-theme-main border border-theme rounded-full bg-theme-surface/50 hover:bg-theme-surface hover:border-theme-brass/40 transition-all cursor-pointer"
            >
              <span>Read Newsletter</span>
            </button>
          </div>

          {/* Metrics Row */}
          <div className="pt-8 border-t border-theme-subtle grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl">
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl text-theme-main font-normal">5 years</div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-theme-muted uppercase tracking-wider">
                IN THE COURTS
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl text-theme-brass font-normal">8</div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-theme-muted uppercase tracking-wider">
                CHARGES BROUGHT
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl text-theme-main font-normal">0</div>
              <div className="text-[11px] sm:text-xs font-mono font-medium text-theme-muted uppercase tracking-wider">
                CONVICTIONS
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

