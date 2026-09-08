import React from 'react';
import { BrandMark } from './BrandMark';
import logoMain from '../assets/images/main-logo.svg';
import { ThemeMode, SiteContent } from '../types';

interface FooterProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenConsultation?: () => void;
  onOpenPricing?: () => void;
  onOpenNewsletters?: () => void;
  onOpenTerms?: () => void;
  onBackHome?: () => void;
  content?: SiteContent['footer'];
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPricing,
  onOpenTerms,
  onBackHome,
  content,
}) => {
  const brandName = content?.brandName || 'Crypto Confidant';
  const siteColumnTitle = content?.siteColumnTitle || 'SITE';
  const contactColumnTitle = content?.contactColumnTitle || 'CONTACT';
  const contactEmail = content?.contactEmail || 'hello@cryptoconfidant.com';
  const copyrightText = content?.copyrightText || '© 2026 Crypto Confidant. Educational content and confidential conversations only — not legal, tax, or financial advice.';
  const builtByText = content?.builtByText || "Built by people who've been through it.";
  const contactButtonLabel = content?.contactButtonLabel || 'Book a Conversation';
  const whyWeExistLink = content?.whyWeExistLink || 'Why We Exist';
  const whoWeHelpLink = content?.whoWeHelpLink || 'Who We Help';
  const whatWeOfferLink = content?.whatWeOfferLink || 'What We Offer';
  const pricingLink = content?.pricingLink || 'Advisory Fees';
  const termsLink = content?.termsLink || 'Terms & Privacy Policy';

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
            <BrandMark size={32} variant="brass" src={logoMain} alt={brandName} />
            <span className="font-serif text-2xl sm:text-3xl font-normal text-theme-main underline decoration-theme-brass/50 underline-offset-4 decoration-1">
              {brandName}
            </span>
          </div>

          {/* SITE Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              {siteColumnTitle}
            </h4>
            <ul className="space-y-3 text-sm sm:text-base text-theme-muted font-normal">
              <li>
                <button
                  onClick={() => scrollToSection('why-we-exist')}
                  className="hover:text-theme-main transition-colors text-left cursor-pointer"
                >
                  {whyWeExistLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('who-we-help')}
                  className="hover:text-theme-main transition-colors text-left cursor-pointer"
                >
                  {whoWeHelpLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('what-we-offer')}
                  className="hover:text-theme-main transition-colors text-left cursor-pointer"
                >
                  {whatWeOfferLink}
                </button>
              </li>
              {onOpenPricing && (
                <li>
                  <button
                    onClick={onOpenPricing}
                    className="hover:text-theme-main transition-colors text-left cursor-pointer"
                  >
                    {pricingLink}
                  </button>
                </li>
              )}
              {onOpenTerms && (
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="hover:text-theme-brass transition-colors text-left cursor-pointer"
                  >
                    {termsLink}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              {contactColumnTitle}
            </h4>
            <div>
              {onOpenPricing ? (
                <button
                  id="footer-book-conversation-btn"
                  type="button"
                  onClick={onOpenPricing}
                  className="text-sm sm:text-base font-medium text-white hover:underline cursor-pointer transition-colors text-left"
                >
                  {contactButtonLabel}
                </button>
              ) : (
                <a
                  id="footer-book-conversation-btn"
                  href="#pricing"
                  className="text-sm sm:text-base font-medium text-white hover:underline cursor-pointer transition-colors text-left inline-block"
                >
                  {contactButtonLabel}
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-theme-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs sm:text-sm text-theme-muted font-normal">
          <p>
            {copyrightText}
          </p>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {onOpenTerms && (
              <button
                onClick={onOpenTerms}
                className="hover:text-theme-brass underline decoration-theme-brass/40 underline-offset-4 transition-colors cursor-pointer text-theme-muted"
              >
                {termsLink}
              </button>
            )}
            <p className="shrink-0">
              {builtByText}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

