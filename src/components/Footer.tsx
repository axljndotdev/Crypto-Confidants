import React from 'react';
import { BrandMark } from './BrandMark';
import logoMain from '../assets/images/main-logo.svg';
import { ThemeMode } from '../types';

interface FooterProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenConsultation?: () => void;
  onOpenPricing?: () => void;
  onOpenNewsletters?: () => void;
  onBackHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPricing,
  onBackHome
}) => {
  const scrollToSection = (id: string) => {
    if (onBackHome) {
      onBackHome();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-theme-main1 transition-colors duration-300 border-t border-theme py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Brand Logo & Name */}
          <div className="md:col-span-5 flex items-center gap-3">
            <BrandMark size={32} variant="brass" src={logoMain} alt="Crypto Confidant" />
            <span className="font-serif text-2xl sm:text-3xl font-normal text-theme-main underline decoration-theme-brass/50 underline-offset-4 decoration-1">
              Crypto Confidant
            </span>
          </div>

          {/* SITE Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              SITE
            </h4>
            <ul className="space-y-3 text-sm sm:text-base text-theme-muted font-normal">
              <li>
                <button
                  onClick={() => scrollToSection('why-we-exist')}
                  className="hover:text-theme-main transition-colors text-left cursor-pointer"
                >
                  Why We Exist
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('who-we-help')}
                  className="hover:text-theme-main transition-colors text-left cursor-pointer"
                >
                  Who We Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('what-we-offer')}
                  className="hover:text-theme-main transition-colors text-left cursor-pointer"
                >
                  What We Offer
                </button>
              </li>
              {onOpenPricing && (
                <li>
                  <button
                    onClick={onOpenPricing}
                    className="hover:text-theme-main transition-colors text-left cursor-pointer"
                  >
                    Pricing
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              CONTACT
            </h4>
            <a
              href="mailto:hello@cryptoconfidant.com"
              className="block text-sm sm:text-base text-theme-muted hover:text-theme-main transition-colors font-normal"
            >
              hello@cryptoconfidant.com
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-theme-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs sm:text-sm text-theme-muted font-normal">
          <p>
            © 2026 Crypto Confidant. Educational content and confidential conversations only — not legal, tax, or financial advice.
          </p>
          <p className="shrink-0">
            Built by people who've been through it.
          </p>
        </div>

      </div>
    </footer>
  );
};

