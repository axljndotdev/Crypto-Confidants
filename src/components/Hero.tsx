import React from 'react';
import { BrandMark } from './BrandMark';
import heroVaultTexture from '../assets/images/hero-vault-texture.png';
import logoMain from '../assets/images/main-logo.svg';

interface HeroProps {
  onOpenPricing: () => void;
  onReadNewsletter: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPricing, onReadNewsletter }) => {
  return (
    <section
      data-theme="dark"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-[#0A0908] text-white border-b border-theme overflow-hidden"
    >
      {/* Hero Vault Texture Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-95 pointer-events-none transition-opacity duration-700"
        style={{ backgroundImage: `url(${heroVaultTexture})` }}
      />

      {/* Brass radial accents for depth */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(400px 300px at 50% 35%, rgba(196,172,118,0.08), transparent 20%), radial-gradient(300px 200px at 25% 70%, rgba(229,211,165,0.04), transparent 15%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Vignette & Radial Glow Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/75 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/85 via-transparent to-black/65 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-start">
        <div className="max-w-2xl w-full text-left space-y-6 lg:ml-12 xl:ml-20">

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span/>

            <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              GLOBAL EDUCATION, A CONFIDENTIAL EAR
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-5xl md:text-6xl lg:text-[70px] font-normal tracking-tight text-theme-main leading-[1.02]">
            Your wealth shouldn't depend on staying in a government's good graces.
          </h1>

          {/* Sub-paragraph */}
          <p className="text-base sm:text-lg text-theme-muted leading-relaxed font-normal">
            Crypto Confidants helps people around the world understand what's actually
            available in the crypto space — self-custody, cold storage, and true
            financial portability — and gives you a confidential space to think clearly
            through your own situation before you decide anything.
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onOpenPricing}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-semibold rounded-full bg-[#A6732E] hover:bg-[#C28938] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Start a conversation</span>
            </button>

            <button
              onClick={onReadNewsletter}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-medium text-theme-main border border-theme rounded-full bg-theme-surface/50 hover:bg-theme-surface hover:border-theme-brass/40 transition-all cursor-pointer"
            >
              <span>Read Newsletter</span>
            </button>
          </div>

          {/* Trust / Principles Row */}
          <div className="pt-8 border-t border-theme-subtle flex flex-row flex-wrap justify-between gap-10 sm:gap-10">

            {/* Access */}
              <div className="flex flex-col items-center space-y-2">
              <BrandMark size={40} src={logoMain} alt="Security" className="h-12 w-12" />

              <div className="text-xs sm:text-sm font-sans font-semibold text-theme-main uppercase tracking-[0.12em] pt-1">
                Access
              </div>
            </div>

            {/* Flexibility */}
              <div className="flex flex-col items-center space-y-2">
              <BrandMark size={40} src={logoMain} alt="Flexibility" className="h-12 w-12" />

              <div className="text-xs sm:text-sm font-sans font-semibold text-theme-main uppercase tracking-[0.12em] pt-1">
                Flexibility
              </div>
            </div>

            {/* Sovereignty */}
              <div className="flex flex-col items-center space-y-2">
              <BrandMark size={40} src={logoMain} alt="Sovereignty" className="h-12 w-12" />

              <div className="text-xs sm:text-sm font-sans font-semibold text-theme-main uppercase tracking-[0.12em] pt-1">
                Sovereignty
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};