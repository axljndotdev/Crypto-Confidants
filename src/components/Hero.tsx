import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenPricing: () => void;
  onReadStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPricing, onReadStory }) => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full pointer-events-none opacity-80 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(196,172,118,0.24) 0%, rgba(196,172,118,0.14) 24%, rgba(196,172,118,0.08) 42%, rgba(196,172,118,0.02) 62%, rgba(196,172,118,0) 78%)',
          filter: 'blur(80px)',
          boxShadow: '0 0 100px rgba(196, 172, 118, 0.12)',
          animation: 'pulse 8s ease-in-out infinite, floatGlow 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[23%] left-[53%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none opacity-50 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0) 78%)',
          filter: 'blur(60px)',
          animation: 'pulse 10s ease-in-out infinite reverse, floatGlow 12s ease-in-out infinite alternate',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & PDF Hero Text */}
          <div className="lg:col-span-12 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-theme bg-theme-surface shadow-xs">
              <span className="w-2 h-2 rounded-full bg-theme-brass animate-pulse" />
              <span className="text-xs font-mono font-medium uppercase tracking-widest text-theme-brass">
                GLOBAL EDUCATION, A CONFIDENTIAL EAR
              </span>
            </div>

            {/* Main Headline from PDF */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-theme-main leading-[1.08]">
              Your wealth shouldn't depend on staying in a government's good graces.
            </h1>

            {/* Sub-paragraph from PDF */}
            <p className="text-base sm:text-lg text-theme-muted max-w-2xl leading-relaxed font-normal">
              Crypto Confidant helps people around the world understand what's actually available in the crypto space — self-custody, cold storage, and true financial portability — and gives you a confidential space to think clearly through your own situation before you decide anything.
            </p>

            {/* CTAs matching PDF Page 1 */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenPricing}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-md hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Start a confidential conversation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onReadStory}
                className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-theme-main border border-theme rounded-xl bg-theme-surface hover:bg-theme-surface-hover transition-all cursor-pointer"
              >
                <span>Read Newsletter</span>
              </button>
            </div>

            {/* Metrics Banner from PDF Page 1 */}
            <div className="pt-8 border-t border-theme-subtle grid grid-cols-3 gap-4">
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
      </div>
    </section>
  );
};
