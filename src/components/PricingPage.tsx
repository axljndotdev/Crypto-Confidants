import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  BadgeCheck,
  ShieldCheck,
  ArrowUpRight,
  CalendarDays,
  Clock3,
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

interface BookingData {
  name: string;
  email: string;
  date: string;
  time: string;
}

const INITIAL_BOOKING: BookingData = {
  name: '',
  email: '',
  date: '',
  time: '',
};

export const PricingPage: React.FC<PricingPageProps> = ({
  onBackHome,
}) => {
  const [selectedTier, setSelectedTier] = useState<TierId | null>(null);

  const [bookingData, setBookingData] =
    useState<BookingData>(INITIAL_BOOKING);

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

  /*
   * --------------------------------------------------------------
   * ACTIVE MODAL
   * --------------------------------------------------------------
   */

  const activeTier = tiers.find(
    (tier) => tier.id === selectedTier
  );

  const openIntroModal = () => {
    setBookingData(INITIAL_BOOKING);
    setSelectedTier('intro');
  };

  const closeModal = () => {
    setSelectedTier(null);
  };

  /*
   * --------------------------------------------------------------
   * BOOKING FORM
   * --------------------------------------------------------------
   */

  const updateBookingField = (
    field: keyof BookingData,
    value: string
  ) => {
    setBookingData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const isBookingValid = () => {
    return (
      !!bookingData.name.trim() &&
      !!bookingData.email.trim() &&
      !!bookingData.date &&
      !!bookingData.time
    );
  };

  /*
   * --------------------------------------------------------------
   * STRIPE
   * --------------------------------------------------------------
   *
   * Replace this with your actual Stripe Checkout endpoint.
   *
   * IMPORTANT:
   * Do not put a Stripe secret key in this React component.
   *
   * Your backend should:
   *
   * 1. Receive the booking details.
   * 2. Create the Stripe Checkout Session.
   * 3. Attach the booking information to the Stripe customer/session.
   * 4. Return the Stripe Checkout URL.
   * 5. Stripe confirms payment to your backend through webhook.
   * 6. Booking remains PENDING until you manually confirm it.
   *
   * Example:
   *
   * POST /api/create-intro-booking
   *
   * --------------------------------------------------------------
   */

  const handleBookAndPay = async () => {
    if (!isBookingValid()) return;

    try {
      /*
       * TEMPORARY PLACEHOLDER
       *
       * Replace this with your real backend endpoint.
       */

      const response = await fetch(
        '/api/create-intro-booking',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: bookingData.name.trim(),
            email: bookingData.email.trim(),
            date: bookingData.date,
            time: bookingData.time,
            service: 'Introductory Session',
            amount: 75,
            currency: 'USD',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to create booking.'
        );
      }

      const data = await response.json();

      /*
       * Your backend should return:
       *
       * {
       *   checkoutUrl: "https://checkout.stripe.com/..."
       * }
       */

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }

    } catch (error) {
      console.error(
        'Booking/payment error:',
        error
      );

      alert(
        'We were unable to start the booking process. Please try again.'
      );
    }
  };

  /*
   * --------------------------------------------------------------
   * AVAILABLE TIMES
   * --------------------------------------------------------------
   *
   * These are example times for now.
   *
   * Eventually these should come from your actual
   * booking/calendar availability system.
   * --------------------------------------------------------------
   */

  const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ];

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
                PRIVATE ADVISORY
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-theme-main leading-[1.05]">
              Confidential Conversations
            </h1>

            <p className="text-base sm:text-m text-theme-muted leading-relaxed max-w-none">
              Every conversation is confidential and educational — a space to
              think clearly through your situation, priorities and options.

              <br /><br />

              Over decades, I have personally witnessed individuals and
              families be financially and politically devastated — losing their
              homes, incomes, and ability to provide for themselves. I have
              seen people left without the resources to defend their rights,
              protect those they love, or make meaningful choices about their
              future. And it is not getting better.

              <br /><br />

              You may be legally free to leave a hostile environment, but
              without access to portable money and assets you can move or
              protect, that freedom may be an illusion. Complacency quietly
              erodes the options you may one day depend on.

              <br /><br />

              If you are ready to get started, choose the appropriate
              conversation below.
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
                        Start Here
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

                {/* =================================================
                    ONLY $75 HAS AN ACTIVE BUTTON
                    ================================================= */}

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

                {tier.features.length > 0 && (
                  <ul className="space-y-3 text-sm text-theme-muted">
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

              </div>
            ))}

          </div>

          {/* Disclaimer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-theme-muted max-w-3xl mx-auto">
              Our conversations are educational and confidential. They do not
              constitute legal, tax, investment, or financial advice.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          BOOK & PAY MODAL — US$75
      ========================================================= */}

      {activeTier?.id === 'intro' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="introductory-session-modal-title"
        >

          {/* Backdrop */}
          <button
            aria-label="Close"
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-theme bg-theme-surface shadow-2xl">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-theme bg-theme-surface px-6 py-5 sm:px-8">

              <div>

                <div className="mb-2 text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-theme-brass">
                  BOOK & PAY
                </div>

                <h2
                  id="introductory-session-modal-title"
                  className="font-serif text-3xl sm:text-4xl text-theme-main leading-tight"
                >
                  Introductory Session
                </h2>

                <p className="mt-2 text-sm text-theme-muted">
                  20 minutes · US$75
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

            {/* Content */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-6">

              {/* Important notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-theme-brass/20 bg-theme-brass/5 p-4">

                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-theme-brass" />

                <p className="text-sm leading-relaxed text-theme-muted">
                  Select a preferred time and complete payment below.
                  <span className="font-semibold text-theme-main">
                    {' '}Payment does not by itself confirm the appointment.
                  </span>
                  {' '}Your requested time will remain subject to confirmation
                  by us.
                </p>

              </div>

              {/* Name */}
              <div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-theme-main">
                  Name or alias
                </label>

                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) =>
                    updateBookingField(
                      'name',
                      e.target.value
                    )
                  }
                  placeholder="Your name or preferred alias"
                  autoComplete="name"
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
                  value={bookingData.email}
                  onChange={(e) =>
                    updateBookingField(
                      'email',
                      e.target.value
                    )
                  }
                  placeholder="Where we can send your booking status"
                  autoComplete="email"
                  className="w-full min-h-[50px] rounded-xl border border-theme bg-theme-main px-4 text-theme-main outline-none transition focus:border-theme-brass"
                />

              </div>

              {/* Date */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-theme-main">
                  <CalendarDays className="h-4 w-4 text-theme-brass" />
                  Preferred date
                </label>

                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) =>
                    updateBookingField(
                      'date',
                      e.target.value
                    )
                  }
                  min={new Date()
                    .toISOString()
                    .split('T')[0]}
                  className="w-full min-h-[50px] rounded-xl border border-theme bg-theme-main px-4 text-theme-main outline-none transition focus:border-theme-brass"
                />

              </div>

              {/* Time */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-theme-main">
                  <Clock3 className="h-4 w-4 text-theme-brass" />
                  Preferred time
                </label>

                <select
                  value={bookingData.time}
                  onChange={(e) =>
                    updateBookingField(
                      'time',
                      e.target.value
                    )
                  }
                  className="w-full min-h-[50px] rounded-xl border border-theme bg-theme-main px-4 text-theme-main outline-none transition focus:border-theme-brass"
                >

                  <option value="">
                    Select a time
                  </option>

                  {availableTimes.map((time) => (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  ))}

                </select>

              </div>

              {/* Booking status explanation */}
              <div className="rounded-2xl border border-theme p-5">

                <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-theme-brass">
                  How this works
                </div>

                <div className="mt-4 space-y-3">

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-theme-brass text-[10px] font-semibold text-theme-brass">
                      1
                    </div>

                    <p className="text-sm text-theme-muted">
                      Choose your preferred date and time.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-theme-brass text-[10px] font-semibold text-theme-brass">
                      2
                    </div>

                    <p className="text-sm text-theme-muted">
                      Pay the US$75 introductory session fee securely.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-theme-brass text-[10px] font-semibold text-theme-brass">
                      3
                    </div>

                    <p className="text-sm text-theme-muted">
                      We verify the payment and review the requested
                      appointment.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-theme-brass text-[10px] font-semibold text-theme-brass">
                      4
                    </div>

                    <p className="text-sm text-theme-muted">
                      We confirm the appointment privately by email.
                    </p>
                  </div>

                </div>

              </div>

              {/* Action */}
              <div className="pt-1">

                <button
                  onClick={handleBookAndPay}
                  disabled={!isBookingValid()}
                  className="w-full min-h-[54px] rounded-full border border-theme-brass/30 bg-[#8A5A1E] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-theme-main shadow-lg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <span className="inline-flex items-center justify-center gap-2">
                    Book & Pay US$75
                    <ArrowUpRight className="h-4 w-4" />
                  </span>

                </button>

                <p className="mt-3 text-center text-xs leading-relaxed text-theme-muted">
                  You will be taken to secure payment. Your appointment is
                  considered requested until we confirm it.
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
   PROCESS STEP
================================================================ */

interface ProcessStepProps {
  number: string;
  title: string;
  text: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  text,
}) => {
  return (
    <div className="rounded-[24px] border border-theme bg-theme-surface p-6">

      <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-theme-brass">
        {number}
      </div>

      <div className="mt-3 text-lg font-semibold text-theme-main">
        {title}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-theme-muted">
        {text}
      </p>

    </div>
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
  maxLength?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
  maxLength,
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
        maxLength={maxLength}
        className="w-full resize-y rounded-xl border border-theme bg-theme-main px-4 py-3 text-theme-main outline-none transition focus:border-theme-brass"
      />

      {maxLength && (
        <div className="mt-1 text-right text-[10px] text-theme-muted">
          {value.length}/{maxLength}
        </div>
      )}

    </div>
  );
};