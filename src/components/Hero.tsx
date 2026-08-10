import React from 'react';
import { BrandMark } from './BrandMark';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

interface HeroProps {
  onOpenConsultation: () => void;
  onReadStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation, onReadStory }) => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & PDF Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
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
              Crypto Confidants helps people around the world understand what's actually available in the crypto space — self-custody, cold storage, and true financial portability — and gives you a confidential space to think clearly through your own situation before you decide anything.
            </p>

            {/* CTAs matching PDF Page 1 */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenConsultation}
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
                <span>Read the story</span>
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
                <div className="font-serif text-3xl sm:text-4xl text-theme-brass font-normal">11</div>
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

          {/* Right Column: Visual Shield Card with Brand Identity */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md p-8 rounded-3xl card-gradient border border-theme brass-border-glow relative space-y-6">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-theme-subtle">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-theme-main border border-theme">
                    <Lock className="w-4 h-4 text-theme-brass" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-theme-main">Non-Custodial Architecture</div>
                    <div className="text-[11px] text-theme-muted">Absolute Sovereign Security</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-theme-brass border border-theme rounded-md bg-theme-main">
                  VERIFIED
                </span>
              </div>

              {/* Logo Emblem */}
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative p-6 rounded-full bg-theme-main border border-theme shadow-inner">
                  <BrandMark size={84} variant="brass" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-normal text-theme-main">Built By People Who Lived It</h3>
                  <p className="text-xs text-theme-muted max-w-xs mx-auto leading-relaxed">
                    Cold storage self-custody is the only asset class immune to asset freezes, seizure, or sudden jurisdictional shifts.
                  </p>
                </div>
              </div>

              {/* Guarantee Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-theme-subtle text-center">
                <div className="p-2.5 rounded-lg bg-theme-main border border-theme-subtle">
                  <div className="text-sm font-bold font-serif text-theme-main">Cold Wallet</div>
                  <div className="text-[10px] text-theme-muted">Untouchable</div>
                </div>
                <div className="p-2.5 rounded-lg bg-theme-main border border-theme-subtle">
                  <div className="text-sm font-bold font-serif text-theme-brass">Encrypted</div>
                  <div className="text-[10px] text-theme-muted">Communication</div>
                </div>
                <div className="p-2.5 rounded-lg bg-theme-main border border-theme-subtle">
                  <div className="text-sm font-bold font-serif text-theme-main">100%</div>
                  <div className="text-[10px] text-theme-muted">Confidential</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
