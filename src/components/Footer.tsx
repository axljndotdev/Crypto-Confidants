import React from 'react';
import { BrandMark } from './BrandMark';
import { ThemeMode } from '../types';
import { Sun, Moon, ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  onToggleTheme,
  onOpenConsultation
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-theme-surface border-t border-theme pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Logo & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <BrandMark size={36} variant="brass" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-normal tracking-tight text-theme-main underline decoration-theme-brass/40 underline-offset-4 decoration-1">
                  Crypto Confidants
                </span>
                <span className="text-[10px] tracking-widest uppercase text-theme-muted font-medium mt-0.5">
                  Global Education & Confidential Ear
                </span>
              </div>
            </div>

            <p className="text-sm font-serif italic text-theme-brass">
              Built by people who've been through it.
            </p>

            <p className="text-xs text-theme-muted max-w-sm leading-relaxed">
              Crypto Confidants provides general education and a confidential space to think through your situation.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-theme bg-theme-main text-xs font-medium text-theme-main hover:border-theme-brass transition-all cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>

          {/* SITE Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-theme-brass tracking-wider">
              SITE
            </div>
            <ul className="space-y-2 text-xs text-theme-muted">
              <li>
                <button onClick={() => scrollToSection('why-we-exist')} className="hover:text-theme-main transition-colors text-left cursor-pointer">
                  Why We Exist
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('who-we-help')} className="hover:text-theme-main transition-colors text-left cursor-pointer">
                  Who We Help
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('what-we-offer')} className="hover:text-theme-main transition-colors text-left cursor-pointer">
                  What We Offer
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('comms')} className="hover:text-theme-main transition-colors text-left cursor-pointer">
                  How We Communicate
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-theme-brass tracking-wider">
              CONTACT
            </div>
            <a
              href="mailto:hello@cryptoconfidants.com"
              className="inline-flex items-center gap-2 text-sm font-mono text-theme-main hover:text-theme-brass transition-colors"
            >
              <Mail className="w-4 h-4 text-theme-brass" />
              <span>hello@cryptoconfidants.com</span>
            </a>
            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-lg shadow-xs hover:brightness-105 cursor-pointer"
              >
                <span>Email Us Confidentially</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-muted">
          <div>
            © 2026 Crypto Confidants. Educational content and confidential conversations only — not legal, tax, or financial advice.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-theme-brass transition-colors font-mono cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
