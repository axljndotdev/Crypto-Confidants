import React, { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react';
import { BrandMark } from './BrandMark';
import logoMain from '../assets/images/main-logo.svg';

interface TermsAndConditionsPageProps {
  onBackHome: () => void;
  onOpenPricing?: () => void;
  onOpenConsultation?: () => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({
  onBackHome,
  onOpenPricing,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Terms & Conditions and Privacy Policy | CryptoConfidant';
    return () => {
      document.title = 'CryptoConfidant';
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'section-1', title: '1. Educational & Knowledge-Based Services' },
    { id: 'section-2', title: '2. Confidentiality and Privacy' },
    { id: 'section-3', title: '3. Multiple Session Packages & Expiration Policy' },
    { id: 'section-4', title: '4. Limitation of Liability' },
  ];

  return (
    <div className="min-h-screen bg-theme-main text-theme-main transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-28 md:pb-28">
        
        {/* Top Back Navigation */}
        <div className="mb-10 pb-6 border-b border-theme-subtle">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-theme-muted hover:text-theme-brass transition-colors cursor-pointer group"
            id="terms-back-button"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Home</span>
          </button>
        </div>

        {/* Header */}
        <header className="space-y-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1.5px] bg-theme-brass inline-block shrink-0" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-theme-brass">
              Legal Agreement
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-theme-main leading-[1.08]">
            TERMS AND CONDITIONS and Privacy Policy
          </h1>

          <p className="text-base sm:text-lg text-theme-muted leading-relaxed pt-1">
            Please read these terms and privacy guidelines carefully before scheduling a consultation
            or engaging our advisory services.
          </p>
        </header>

        {/* Table of Contents - Clean, single numbers, no duplicate badges */}
        <nav aria-label="Table of Contents" className="mb-12 p-6 rounded-2xl bg-theme-surface border border-theme">
          <div className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-3">
            Index
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-theme-main/60 transition-colors text-sm font-medium text-theme-main flex items-center justify-between group cursor-pointer"
              >
                <span>{section.title}</span>
                <span className="text-theme-brass opacity-60 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content Articles - Single, linear numbers without redundant duplicate badges */}
        <div className="space-y-10">

          {/* 1. Educational & Knowledge-Based Services */}
          <article
            id="section-1"
            className="p-7 sm:p-9 rounded-2xl bg-theme-surface border border-theme scroll-mt-28 space-y-6"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-theme-main font-normal tracking-tight">
              1. Educational & Knowledge-Based Services
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-theme-main font-normal">
              CryptoConfidant ("the Company", "we", "us") provides strictly educational and knowledge-based advisory services. Our offerings are designed to share contemporary information, strategies, and perspectives regarding personal, family, and financial security, including digital asset self-custody and financial portability.
            </p>

            <div className="space-y-4 pt-2 border-t border-theme-subtle">
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  No Professional Advice
                </h3>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                  Information shared on CryptoConfidant.com or during any advisory sessions does not constitute financial, investment, tax, legal, or other regulated professional advice.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  Client Responsibility
                </h3>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                  You retain full, independent responsibility for evaluating and making all decisions regarding your personal, legal, and financial matters.
                </p>
              </div>
            </div>
          </article>

          {/* 2. Confidentiality and Privacy */}
          <article
            id="section-2"
            className="p-7 sm:p-9 rounded-2xl bg-theme-surface border border-theme scroll-mt-28 space-y-6"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-theme-main font-normal tracking-tight">
              2. Confidentiality and Privacy
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-theme-main font-normal">
              Privacy and confidentiality form the core foundation of our service.
            </p>

            <div className="space-y-4 pt-2 border-t border-theme-subtle">
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  Private Communications
                </h3>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                  All sessions, inquiries, and discussions are conducted through secure, end-to-end encrypted communication channels (such as Signal) or in secure, private settings.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  Data Security
                </h3>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                  We maintain strict privacy practices and do not sell, share, or disclose client information to third parties unless explicitly required by operation of law.
                </p>
              </div>
            </div>
          </article>

          {/* 3. Multiple Session Packages & Expiration Policy */}
          <article
            id="section-3"
            className="p-7 sm:p-9 rounded-2xl bg-theme-surface border border-theme scroll-mt-28 space-y-6"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-theme-main font-normal tracking-tight">
              3. Multiple Session Packages & Expiration Policy
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  Session Package Terms
                </h3>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                  Multiple Session packages (typically arranged for block meetings or in-person sessions) are designed to provide structured, ongoing educational guidance.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  180-Day Validity Period
                </h3>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                  All Multiple Session packages are valid for exactly 180 days starting from the date of purchase. All sessions must be fully scheduled and utilized within this 180-day timeframe.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-theme-subtle">
                <h3 className="text-sm font-semibold text-theme-brass font-sans">
                  Forfeiture
                </h3>
                <p className="text-sm sm:text-base text-theme-main leading-relaxed font-normal">
                  Any unused sessions (including all 10 sessions if none are used) remaining after the 180-day period expires will be automatically forfeited without entitlement to a refund, extension, or credit.
                </p>
              </div>
            </div>
          </article>

          {/* 4. Limitation of Liability */}
          <article
            id="section-4"
            className="p-7 sm:p-9 rounded-2xl bg-theme-surface border border-theme scroll-mt-28 space-y-4"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-theme-main font-normal tracking-tight">
              4. Limitation of Liability
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-theme-muted">
              The Company, its founders, and representatives shall not be liable for any financial losses, legal outcomes, or damages arising from decisions made or actions taken based on educational discussions or information provided during any session.
            </p>
          </article>

        </div>

        {/* Contact Inquiry Section */}
        <section className="mt-14 p-7 sm:p-8 rounded-2xl bg-theme-surface border border-theme flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BrandMark size={20} variant="brass" src={logoMain} alt="Crypto Confidant" />
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-theme-brass">
                Questions
              </span>
            </div>
            <p className="text-sm text-theme-muted">
              Need clarification regarding these terms? Contact our advisory team directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:hello@cryptoconfidant.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium bg-theme-main border border-theme text-theme-main hover:text-theme-brass transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-theme-brass" />
              <span>hello@cryptoconfidant.com</span>
            </a>

            {onOpenPricing && (
              <button
                onClick={onOpenPricing}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium bg-theme-brass text-theme-main hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Advisory Fees</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Bottom Return Button */}
        <div className="mt-10 text-center">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-theme-muted hover:text-theme-brass transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};
