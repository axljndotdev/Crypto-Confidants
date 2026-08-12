import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, MessageCircle, BadgeCheck } from 'lucide-react';

interface PricingPageProps {
  onOpenConsultation: () => void;
  onBackHome: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenConsultation, onBackHome }) => {
  const tiers = [
    {
      topLabel: '20 MINUTES',
      name: 'Introductory Consultation',
      price: 'US$75',
      description: 'A confidential introductory conversation to help clarify your situation, explore some relevant options, and help you decide what next steps feel right for you.',
      features: [],
      buttonLabel: 'Book this conversation',
      accent: false,
    },
    {
      topLabel: '50 MINUTES',
      name: 'Private Advisory Session',
      price: 'US$450',
      description: 'A more detailed, confidential exploration of your situation, priorities, strategy, and positioning.',
      features: [],
      buttonLabel: 'Book this conversation',
      accent: true,
    },
    {
      topLabel: '10 × 50 MINUTES',
      name: '10-Session Advisory Engagement',
      price: 'US$4,000',
      description: 'Typically following on from the single conversation. In-depth confidential conversations exploring your situation, priorities, strategy, positioning, and execution.',
      features: ['Valid for 180 days from date of purchase.'],
      buttonLabel: 'Enquire about this package',
      accent: false,
    },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-start">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-theme-muted hover:text-theme-brass transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
        </div>

        <div className="max-w-3xl space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-10 h-[1.5px] bg-theme-brass inline-block shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              BOOKING & PRICING
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-theme-main leading-[1.05]">
            Confidential Conversations
          </h1>

          <p className="text-base sm:text-lg text-theme-muted leading-relaxed max-w-none">
            Every conversation is confidential and educational – a space to think clearly through your situation, priorities and options.

<br></br><br></br>Over decades, I have personally witnessed individuals and families be financially and politically devastated—losing their homes, incomes, and ability to provide for themselves. I have seen people left without the resources to defend their rights, protect those they love, or make meaningful choices about their future. And it is not getting better.

<br></br><br></br>You may be legally free to leave a hostile environment, but without access to portable money and assets you can move or protect, that freedom may be an illusion. Complacency quietly erodes the options you may one day depend on.

<br></br><br></br>If you are ready to get started book a conversation.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {tiers.map((tier, index) => (
            <div
              key={`${tier.name}-${index}`}
              className={`rounded-[32px] border p-8 space-y-6 ${
                tier.accent
                  ? 'bg-theme-surface border-theme-brass/40 shadow-lg'
                  : 'bg-theme-surface border-theme'
              }`}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[16px] font-mono font-semibold uppercase tracking-[0.3em] text-theme-brass">
                    {tier.topLabel}
                  </span>
                  {tier.accent && (
                    <span className="inline-flex items-center rounded-full border border-theme-brass/30 bg-theme-brass/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-theme-brass">
                      Most common
                    </span>
                  )}
                </div>
                <div className="text-lg font-semibold text-theme-main">{tier.name}</div>
                <div className="font-serif text-5xl md:text-6xl text-theme-brass tracking-tight">
                  {tier.price}
                </div>
                <p className="text-sm text-theme-muted leading-relaxed">{tier.description}</p>
              </div>

              {tier.features.length > 0 && (
                <ul className="space-y-3 text-sm text-theme-muted font-bold">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <BadgeCheck className="w-4 h-4 mt-0.5 text-theme-brass flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={onOpenConsultation}
                className={`w-full rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all ${
                  tier.accent
                    ? 'border border-theme-brass/30 bg-[#8A5A1E] text-theme-main shadow-lg hover:brightness-95'
                    : 'border border-theme-brass/30 bg-transparent text-theme-brass hover:bg-theme-brass/10'
                }`}
              >
                {tier.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-theme-muted max-w-3xl mx-auto">
            Our conversations are educational and confidential. They do not constitute legal, tax, investment, or financial advice.
          </p>
        </div>
      </div>
    </section>
  );
};
