import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, MessageCircle, BadgeCheck } from 'lucide-react';

interface PricingPageProps {
  onBackHome: () => void;
  onPayment?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBackHome, onPayment }) => {
  const tiers = [
    {
      name: 'Introductory conversation',
      price: 'US$75',
      description: 'A initial confidential introductory conversation to help clarify your situation, explore some relevant options, and decide what next steps feel right for you.',
      features: ['20 minutes', 'Confidential introductory discussion', 'Clarify next steps'],
      accent: true,
    },
    {
      name: 'Subsequent confidential conversations',
      price: 'US$450',
      description: 'A more detailed, confidential exploration of your situation, priorities, strategy, and positioning. Where appropriate, this may include independent background research and preparation to make a later conversation more focused and useful.',
      features: ['50 minutes', 'Detailed confidential exploration', 'Can include background research'],
      accent: false,
    },
    {
      name: 'Subsequent conversations + research',
      price: 'US$3500',
      description: 'Subsequent confidential conversations and relevant authorised background research, bulk billed and valid for 180 days from purchase date.',
      features: ['10 x 50 minutes', 'Valid for 180 days', 'Authorised background research'],
      accent: false,
    },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-start">
          <button
            onClick={onBackHome}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-theme-main border border-theme rounded-xl bg-theme-surface hover:bg-theme-surface-hover transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-theme-brass" />
            <span>Back to landing page</span>
          </button>
        </div>

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-theme bg-theme-surface shadow-xs">
            <Sparkles className="w-4 h-4 text-theme-brass" />
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-theme-brass">
              PRICING
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-theme-main leading-[1.05]">
            Clear guidance, priced for clarity.
          </h1>

          <p className="text-base sm:text-lg text-theme-muted leading-relaxed max-w-2xl">
            Our conversations are educational and confidential. They do not constitute legal, tax, investment, or financial advice.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl border p-8 space-y-6 ${
                tier.accent
                  ? 'bg-theme-surface border-theme-brass/40 shadow-lg'
                  : 'bg-theme-main border-theme'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-theme-brass">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                    {tier.name}
                  </span>
                </div>
                <div className="font-serif text-4xl text-theme-main">{tier.price}</div>
                <p className="text-sm text-theme-muted leading-relaxed">{tier.description}</p>
              </div>

              <ul className="space-y-3 text-sm text-theme-muted">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 mt-0.5 text-theme-brass flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPayment}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Agree and Continue with payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
