import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  BadgeCheck,
  ShieldCheck,
  ArrowUpRight,
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

interface FormData {
  name: string;
  email: string;
  situation: string;
  additional: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  situation: '',
  additional: '',
};

export const PricingPage: React.FC<PricingPageProps> = ({
  onBackHome,
}) => {
  const [selectedTier, setSelectedTier] = useState<TierId | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  const tiers: Tier[] = [
    {
      id: 'intro',
      topLabel: '20 MINUTES',
      name: 'Introductory Consultation',
      price: 'US$75',
      description:
        'A confidential introductory conversation to help clarify your situation, explore some relevant options, and help you decide what next steps feel right for you.',
      features: [],
      buttonLabel: 'Start private enquiry',
      accent: false,
    },
    {
      id: 'private',
      topLabel: '50 MINUTES',
      name: 'Private Advisory Session',
      price: 'US$450',
      description:
        'A more detailed, confidential exploration of your situation, priorities, strategy, and positioning.',
      features: [],
      buttonLabel: 'Book this conversation',
      accent: true,
    },
    {
      id: 'engagement',
      topLabel: '10 × 50 MINUTES',
      name: '10-Session Advisory Engagement',
      price: 'US$4,000',
      description:
        'Typically following on from the single conversation. In-depth confidential conversations exploring your situation, priorities, strategy, positioning, and execution.',
      features: ['Valid for 180 days from date of purchase.'],
      buttonLabel: 'Enquire about this package',
      accent: false,
    },
  ];

  const activeTier = tiers.find(
    (tier) => tier.id === selectedTier
  );

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openModal = (tierId: TierId) => {
    setFormData(INITIAL_FORM);
    setSelectedTier(tierId);
  };

  const closeModal = () => {
    setSelectedTier(null);
  };

  const buildEmail = () => {
    if (!activeTier) return;

    const lines: string[] = [
      `Hello,`,
      ``,
      `I am writing regarding the ${activeTier.name} (${activeTier.price}).`,
      ``,
      `Name / alias: ${formData.name}`,
      `Email: ${formData.email}`,
      ``,
      `What I would like to discuss:`,
      formData.situation,
      ``,
      `Additional information:`,
      formData.additional || 'None provided.',
      ``,
      `I understand that this is an enquiry and that the next step will be discussed privately by email.`,
      ``,
      `Thank you.`,
    ];

    return lines.join('\n');
  };

  const handleSubmit = () => {
    if (!activeTier) return;

    const body = buildEmail();

    if (!body) return;

    const subject = `${activeTier.name} — Private Enquiry`;

    const protonAddress = 'axljndev@proton.me';

    const mailto = [
      `mailto:${protonAddress}`,
      `?subject=${encodeURIComponent(subject)}`,
      `&body=${encodeURIComponent(body)}`,
    ].join('');

    window.location.href = mailto;
  };

  const isValid = () => {
    return (
      !!formData.name.trim() &&
      !!formData.email.trim() &&
      !!formData.situation.trim()
    );
  };

  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={onBackHome}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-theme-muted hover:text-theme-brass transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Intro */}
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

            <p className="text-base sm:text-m text-theme-muted leading-relaxed max-w-none">
              Every conversation is confidential and educational – a space to think clearly through your situation, priorities and options.

              <br /><br />

              Over decades, I have personally witnessed individuals and families be financially and politically devastated—losing their homes, incomes, and ability to provide for themselves. I have seen people left without the resources to defend their rights, protect those they love, or make meaningful choices about their future. And it is not getting better.

              <br /><br />

              You may be legally free to leave a hostile environment, but without access to portable money and assets you can move or protect, that freedom may be an illusion. Complacency quietly erodes the options you may one day depend on.

              <br /><br />

              If you are ready to get started, begin with a private enquiry below.
            </p>
          </div>

          {/* Pricing */}
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

                  <div className="text-lg font-semibold text-theme-main">
                    {tier.name}
                  </div>

                  <div className="font-serif text-5xl md:text-6xl text-theme-brass tracking-tight">
                    {tier.price}
                  </div>

                  <p className="text-sm text-theme-muted leading-relaxed">
                    {tier.description}
                  </p>

                </div>

                {tier.features.length > 0 && (
                  <ul className="space-y-3 text-sm text-theme-muted font-bold">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2"
                      >
                        <BadgeCheck className="w-4 h-4 mt-0.5 text-theme-brass flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => openModal(tier.id)}
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

          {/* Disclaimer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-theme-muted max-w-3xl mx-auto">
              Our conversations are educational and confidential. They do not constitute legal, tax, investment, or financial advice.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          ENQUIRY MODAL
      ========================================================= */}
      {activeTier && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
        >

          {/* Backdrop */}
          <button
            aria-label="Close enquiry"
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-theme bg-theme-surface shadow-2xl">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-theme bg-theme-surface px-6 py-5 sm:px-8">

              <div>
                <div className="mb-2 text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-theme-brass">
                  {activeTier.buttonLabel}
                </div>

                <h2
                  id="enquiry-modal-title"
                  className="font-serif text-3xl sm:text-4xl text-theme-main leading-tight"
                >
                  {activeTier.name}
                </h2>

                <p className="mt-2 text-sm text-theme-muted">
                  {activeTier.price}
                </p>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-theme text-theme-muted hover:text-theme-main hover:border-theme-brass transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-6">

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-theme-brass/20 bg-theme-brass/5 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-theme-brass" />

                <p className="text-sm leading-relaxed text-theme-muted">
                  This is a private enquiry. Your answers will be placed into an email for you to review before sending. Nothing is submitted from this form.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-theme-main">
                  Name or alias
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    updateField('name', e.target.value)
                  }
                  placeholder="Your name or preferred alias"
                  className="w-full min-h-[50px] rounded-xl border border-theme bg-theme-main px-4 text-theme-main outline-none transition focus:border-theme-brass"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-theme-main">
                  Email address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    updateField('email', e.target.value)
                  }
                  placeholder="Where we can reply privately"
                  className="w-full min-h-[50px] rounded-xl border border-theme bg-theme-main px-4 text-theme-main outline-none transition focus:border-theme-brass"
                />
              </div>

              {/* What would you like to discuss? */}
              <Textarea
                label="What would you like to discuss?"
                value={formData.situation}
                onChange={(value) =>
                  updateField('situation', value)
                }
                placeholder="A short description is enough."
              />

              {/* Additional information */}
              <Textarea
                label="Anything else you'd like us to know?"
                optional
                value={formData.additional}
                onChange={(value) =>
                  updateField('additional', value)
                }
                placeholder="Optional"
              />

              {/* Action */}
              <div className="pt-2">

                <button
                  onClick={handleSubmit}
                  disabled={!isValid()}
                  className="w-full min-h-[54px] rounded-full border border-theme-brass/30 bg-[#8A5A1E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-theme-main shadow-lg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Continue to private email
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>

                <p className="mt-3 text-center text-xs leading-relaxed text-theme-muted">
                  Your email application will open with your enquiry already prepared.
                  You can review it before sending.
                </p>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};


/* ================================================================
   REUSABLE TEXTAREA
================================================================ */

interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-theme-main">

        {label}

        {optional && (
          <span className="ml-2 font-normal normal-case tracking-normal text-theme-muted">
            (optional)
          </span>
        )}

      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-xl border border-theme bg-theme-main px-4 py-3 text-theme-main outline-none transition focus:border-theme-brass"
      />
    </div>
  );
};