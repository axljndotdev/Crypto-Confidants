import React, { useState } from 'react';
import Cal from '@calcom/embed-react';
import {
  ArrowLeft,
  X,
  BadgeCheck,
  ShieldCheck,
} from 'lucide-react';

interface PricingPageProps {
  onOpenConsultation?: () => void;
  onBackHome: () => void;
}

type TierId = 'intro' | 'private' | 'engagement';

interface Tier {
  id: TierId;
  topLabel: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonLabel: string;
  accent: boolean;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBackHome,
}) => {
  const [selectedTier, setSelectedTier] =
    useState<TierId | null>(null);

  const tiers: Tier[] = [
    {
      id: 'intro',
      topLabel: '20 MINUTES',
      name: 'Introductory Session',
      price: 'US$75',
      description:
        'A focused introductory conversation to clarify your situation, explore relevant options, and determine whether further advisory work would be helpful.',
      features: [],
      buttonLabel: 'Book & Pay',
      accent: true,
    },
    {
      id: 'private',
      topLabel: '50 MINUTES',
      name: 'Single Session',
      price: 'US$450',
      description:
        'A more detailed, confidential exploration of your situation, priorities, strategy, and positioning will be scheduled after the introductory session.',
      features: [],
      buttonLabel: 'Introductory Session Required First',
      accent: false,
    },
    {
      id: 'engagement',
      topLabel: '10 × 50 MINUTES',
      name: 'Multiple Session',
      price: 'US$4,000',
      description:
        'An ongoing confidential conversation covering your situation, priorities, strategy, positioning, and execution.',
      features: [
        'Valid for 180 days from date of purchase.',
      ],
      buttonLabel: 'Introductory Session Required First',
      accent: false,
    },
  ];

  const activeTier = tiers.find(
    (tier) => tier.id === selectedTier
  );

  const openIntroModal = () => {
    setSelectedTier('intro');
  };

  const closeModal = () => {
    setSelectedTier(null);
  };

  return (
    <>
      {/* =========================================================
          PRICING PAGE
      ========================================================= */}

      <section className="relative pt-32 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* =====================================================
              BACK
          ===================================================== */}

          <div className="mb-8 flex justify-start">
            <button
              onClick={onBackHome}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-theme-muted hover:text-theme-brass transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>

          {/* =====================================================
              INTRO
          ===================================================== */}

          <div className="max-w-3xl space-y-5">

            <div className="flex items-center gap-3">
              <span className="w-8 sm:w-10 h-[1.5px] bg-theme-brass inline-block shrink-0" />

              <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
                PRIVATE ADVISORY
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-theme-main leading-[1.05]">
              Confidential Conversations
            </h1>

            <p className="text-base sm:text-m text-theme-muted leading-relaxed max-w-none">
              Every conversation is confidential and educational — a space to
              think clearly through your situation, priorities and options.

              <br />
              <br />

              Over decades, I have personally witnessed individuals and
              families be financially and politically devastated — losing their
              homes, incomes, and ability to provide for themselves. I have
              seen people left without the resources to defend their rights,
              protect those they love, or make meaningful choices about their
              future. And it is not getting better.

              <br />
              <br />

              You may be legally free to leave a hostile environment, but
              without access to portable money and assets you can move or
              protect, that freedom may be an illusion. Complacency quietly
              erodes the options you may one day depend on.

              <br />
              <br />

              If you are ready to get started, choose the appropriate
              conversation below.
            </p>

          </div>

          {/* =====================================================
              PRICING
          ===================================================== */}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">

            {tiers.map((tier, index) => (
              <div
                key={`${tier.name}-${index}`}
                className={`flex h-full flex-col rounded-[32px] border p-8 ${
                  tier.accent
                    ? 'bg-theme-surface border-theme-brass/40 shadow-lg'
                    : 'bg-theme-surface border-theme'
                }`}
              >

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="flex flex-1 flex-col">

                  <div className="space-y-4">

                    {/* TOP LABEL */}

                    <div className="flex min-h-[32px] flex-wrap items-center gap-3">

                      <span className="text-[16px] font-mono font-semibold uppercase tracking-[0.3em] text-theme-brass">
                        {tier.topLabel}
                      </span>

                      {tier.accent && (
                        <span className="inline-flex items-center rounded-full border border-theme-brass/30 bg-theme-brass/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-theme-brass">
                          Start Here
                        </span>
                      )}

                    </div>

                    {/* NAME */}

                    <div className="min-h-[28px] text-lg font-semibold text-theme-main">
                      {tier.name}
                    </div>

                    {/* PRICE */}

                    <div className="min-h-[72px] font-serif text-5xl md:text-6xl text-theme-brass tracking-tight">
                      {tier.price}
                    </div>

                    {/* DESCRIPTION */}

                    <div className="min-h-[128px]">
                      <p className="text-sm text-theme-muted leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                  </div>

                  {/* =================================================
                      VALIDITY / FEATURES
                  ================================================= */}

                  <div className="min-h-[36px] mt-1">

                    {tier.features.length > 0 && (
                      <ul className="space-y-2 text-sm text-theme-muted">

                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2"
                          >
                            <BadgeCheck className="w-4 h-4 mt-0.5 text-theme-brass flex-shrink-0" />

                            <span>
                              {feature}
                            </span>
                          </li>
                        ))}

                      </ul>
                    )}

                  </div>

                </div>

                {/* =================================================
                    BUTTON — ALWAYS ALIGNED
                ================================================= */}

                <div className="mt-2">

                  {tier.id === 'intro' ? (
                    <button
                      onClick={openIntroModal}
                      className="w-full rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all border border-theme-brass/30 bg-[#8A5A1E] text-theme-main shadow-lg hover:brightness-95"
                    >
                      {tier.buttonLabel}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] border border-theme-brass/30 bg-transparent text-theme-brass opacity-60 cursor-not-allowed"
                    >
                      {tier.buttonLabel}
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>

          {/* =====================================================
              DISCLAIMER
          ===================================================== */}

          <div className="mt-10 text-center">

            <p className="text-sm text-theme-muted max-w-3xl mx-auto">
              Our conversations are educational and confidential. They do not
              constitute legal, tax, investment, or financial advice.
            </p>

          </div>

        </div>
      </section>

      {/* =========================================================
          CAL.COM BOOK & PAY MODAL — US$75
      ========================================================= */}

      {activeTier?.id === 'intro' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="introductory-session-modal-title"
        >

          {/* =====================================================
              BACKDROP
          ===================================================== */}

          <button
            aria-label="Close"
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
          />

          {/* =====================================================
              MODAL
          ===================================================== */}

          <div className="relative flex h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] sm:rounded-[28px] border border-theme bg-theme-surface shadow-2xl">

            {/* ===================================================
                HEADER
            =================================================== */}

            <div className="relative z-20 flex shrink-0 items-start justify-between gap-5 border-b border-theme bg-theme-surface px-5 py-4 sm:px-7 sm:py-5">

              <div>

                <div className="mb-1.5 text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-theme-brass">
                  BOOK & PAY
                </div>

                <h2
                  id="introductory-session-modal-title"
                  className="font-serif text-2xl sm:text-3xl text-theme-main leading-tight"
                >
                  Introductory Session
                </h2>

                <p className="mt-1 text-sm text-theme-muted">
                  20 minutes · US$75
                </p>

              </div>

              {/* =================================================
                  CLOSE
              ================================================= */}

              <button
                onClick={closeModal}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-theme text-theme-muted transition-colors hover:border-theme-brass hover:text-theme-main"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* ===================================================
                SCROLLABLE CONTENT
            =================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto">

              <div className="px-3 py-3 sm:px-5 sm:py-5">

                {/* =================================================
                    CAL.COM BOOKING
                ================================================= */}

                <div className="overflow-hidden rounded-2xl border border-theme bg-theme-main">

                  <Cal
                    calLink="crypto-confidant/introductory-session"
                    style={{
                      width: '100%',
                      height: '700px',
                      overflow: 'auto',
                    }}
                    config={{
                      layout: 'month_view',
                      theme: 'dark',
                    }}
                  />

                </div>

                {/* =================================================
                    IMPORTANT NOTICE — BOTTOM
                ================================================= */}

                <div className="mt-4 rounded-2xl border border-theme-brass/20 bg-theme-brass/5 p-4 sm:p-5">

                  <div className="flex items-start gap-3">

                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-theme-brass" />

                    <div className="text-sm leading-relaxed text-theme-muted">

                      <p>
                        Please provide only the information necessary to
                        arrange your introductory session.
                      </p>

                      <p className="mt-3 font-semibold text-theme-main">
                        Your appointment is not confirmed automatically.
                      </p>

                      <p className="mt-1">
                        The requested time remains pending until it has been
                        reviewed and confirmed privately.
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    BOTTOM SPACING
                ================================================= */}

                <div className="h-2" />

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
};