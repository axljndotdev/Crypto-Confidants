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
  onOpenConsultation,
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
        
        {/* Main Grid — simplified */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex items-center gap-3">
            <BrandMark size={28} variant="brass" src={logoMain} alt={brandName} />
            <span className="font-serif text-xl sm:text-2xl font-normal text-theme-main">
              {brandName}
            </span>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass mb-2">
              {siteColumnTitle}
            </h4>
            <ul className="flex flex-col items-start gap-2 text-sm text-theme-muted">
              <li>
                <button
                  onClick={() => scrollToSection('why-we-exist')}
                  className="hover:text-theme-main transition-colors"
                >
                  {whyWeExistLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('who-we-help')}
                  className="hover:text-theme-main transition-colors"
                >
                  {whoWeHelpLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('what-we-offer')}
                  className="hover:text-theme-main transition-colors"
                >
                  {whatWeOfferLink}
                </button>
              </li>
              {onOpenPricing && (
                <li>
                  <button
                    onClick={onOpenPricing}
                    className="hover:text-theme-main transition-colors"
                  >
                    {pricingLink}
                  </button>
                </li>
              )}
              {onOpenTerms && (
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="hover:text-theme-main transition-colors"
                  >
                    {termsLink}
                  </button>
                </li>
              )}
            </ul>
          
          </div>
          <div className="md:col-span-4">
            <h4 className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass mb-2 text-right md:text-right">
              {contactColumnTitle}
            </h4>
            <div className="flex flex-col items-end gap-2">
             

              <button
                onClick={() => {
                  if (onOpenConsultation) {
                    onOpenConsultation();
                  } else {
                    window.location.href = `mailto:${contactEmail}`;
                  }
                }}
                className="inline-flex items-center text-xs sm:text-sm font-medium text-theme-accent hover:underline gap-1"
              >
                {contactButtonLabel}
              </button>
            </div>
          </div>
        </div>
        

        {/* Bottom Bar — minimal */}
        <div className="pt-6 border-t border-theme-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs sm:text-sm text-theme-muted">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4">
            <p className="shrink-0">{builtByText}</p>
            <p className="shrink-0 text-xs text-theme-muted">Payments processed by{' '}
              <a href="https://jsekmarketing.com" target="_blank" rel="noopener noreferrer" className="underline text-theme-brass">JSEK Marketing LLC</a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

