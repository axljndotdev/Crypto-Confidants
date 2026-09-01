import React from 'react';
import { MessageSquare, Mail, MapPin } from 'lucide-react';

interface HowWeCommunicateProps {
  onOpenConsultation?: () => void;
}

export const HowWeCommunicateSection: React.FC<HowWeCommunicateProps> = () => {
  const steps = [
    {
      num: '01',
      title: 'Begin with a short enquiry',
      description:
        'You can simply introduce yourself and indicate the type of conversation or engagement you are interested in via our signal username @cryptoconfidant.01 or book your Initial Introduction Session. There is no need to send sensitive personal, financial, identifying, or cryptocurrency-related information in your initial enquiry. Relevant details can be discussed during the Initial Introduction Session.',
    },
    {
      num: '02',
      title: 'Set up Signal',
      description: [
        `Signal is CryptoConfidant’s required communication channel for client conversations. Before your enquiry or Initial Introduction Session, please install the Signal app and create a Signal account.`,
        `Signal requires a telephone number when registering an account. However, Signal’s username and phone-number privacy settings can allow you to contact CryptoConfidant.com without disclosing that number to us. You will receive CryptoConfidant.com’s private Signal username or invitation link once your Introduction session has been confirmed.`,
      ],
    },
    {
      num: '03',
      title: 'Initial Introduction Session',
      description: [
        'The 20-minute Initial Introduction Session is the first substantive point of communication with CryptoConfidant.com. It provides a private, focused opportunity to describe your circumstances at a high level, explain what you are seeking, and consider whether an ongoing conversation or engagement may be appropriate.',
        'Once your 20-minute Introduction Session has been confirmed, you will receive the relevant booking details and Signal communication instructions.',
      ],
    },
    {
      num: '04',
      title: 'Continue privately',
      description: [
        'Further sessions are agreed mutually and, where appropriate, take place through Signal. Signal supports encrypted messaging and voice or video calls and can allow you to communicate without disclosing your telephone number to CryptoConfidant.com.',
        'Please review Signal’s privacy and security settings and ensure they meet your own requirements before using this communication method.',
      ],
    },
    {
      num: '05',
      title: 'Agreeing next steps',
      description:
        'The Initial Introduction Session is not a commitment to a further engagement. If we both decide to proceed, we will agree the appropriate format, scope, timing, and next steps directly and privately through Signal.',
    },
  ];

  return (
    <section
      id="comms"
      className="py-20 md:py-28 bg-theme-main transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mb-16">
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-10 h-[1.5px] bg-theme-brass inline-block shrink-0" />

            <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              HOW WE COMMUNICATE
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            A confidant, not a form submission.
          </h2>

          <p className="text-base sm:text-lg text-theme-muted leading-relaxed font-normal">
            Everything about how we operate — including how we communicate — is built around one principle: privacy. Your information should exist in as few places as possible, for as short a time as possible.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s) => {
            return (
              <div
                key={s.num}
                className="p-4 sm:p-6 rounded-[22px] bg-theme-card border border-theme space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-theme-brass font-normal">
                    {s.num}
                  </span>
                </div>

                <h3 className="font-sans text-lg sm:text-xl font-bold text-theme-main">
                  {s.title}
                </h3>

                {Array.isArray(s.description) ? (
                  s.description.map((para, idx) => (
                    <p key={idx} className="text-xs sm:text-sm text-theme-muted leading-relaxed font-normal">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-xs sm:text-sm text-theme-muted leading-relaxed font-normal">
                    {s.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* What You'll Need Card */}
        {/* ORIGINAL AREA RESTORED */}
        <div className="p-8 sm:p-10 md:p-12 rounded-[24px] bg-theme-surface border border-theme space-y-8 mb-8">
          <div className="space-y-2">
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-theme-main">
              What you'll need
            </h3>

            <p className="text-sm sm:text-base text-theme-muted font-normal">
              Nothing complicated — just two free tools, and only one of them is required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">

            {/* Signal */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EFE7DA] dark:bg-[#282218] flex items-center justify-center text-theme-brass shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5 stroke-[1.8]" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-sans text-xl font-bold text-theme-main">
                    Signal
                  </span>

                  <span className="px-2.5 py-0.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-[#734A17] dark:text-[#D4A359] bg-[#EFE7DA] dark:bg-[#282218] rounded-full">
                    REQUIRED FOR YOUR CALL
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
                    A free, end-to-end encrypted messaging and calling app.
                    Download it to your phone or desktop to join your
                    confidential conversation — no account details beyond a
                    confidential user name, which stays private between us.
                  </p>

                  <div>
                    <a
                      href="https://signal.org/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs sm:text-sm font-medium text-theme-accent hover:underline gap-1"
                    >
                      <span>Download Signal</span>

                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Proton Mail */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EFE7DA] dark:bg-[#282218] flex items-center justify-center text-theme-brass shrink-0 mt-0.5">
                <Mail className="w-5 h-5 stroke-[1.8]" />
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-sans text-xl font-bold text-theme-main">
                      Proton Mail
                    </span>

                    <span className="px-2.5 py-0.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-[#734A17] dark:text-[#D4A359] bg-[#EFE7DA] dark:bg-[#282218] rounded-full">
                      OPTIONAL
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
                    A free, private email provider. Not required to reach us —
                    any email address works — but if you'd like to send fully
                    PGP-encrypted messages from your side too, this is the
                    easiest way.
                  </p>
                </div>

                <div>
                  <a
                    href="https://proton.me/mail"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs sm:text-sm font-medium text-theme-accent hover:underline gap-1"
                  >
                    <span>Get Proton Mail</span>

                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 00-2-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-theme-subtle">
            <p className="text-sm sm:text-base text-theme-muted font-normal">
              Booking your call happens right on this site — no other software,
              browser extensions, or accounts required.
            </p>
          </div>
        </div>

        

        {/* Location / Meeting Note */}
        <div className="p-6 sm:p-8 rounded-[18px] bg-theme-main1 border border-theme border-l-4 border-l-theme-brass flex items-start sm:items-center gap-4 sm:gap-6 mb-20">
          <div className="w-10 h-10 rounded-full bg-[#EFE7DA] dark:bg-[#282218] flex items-center justify-center text-theme-brass shrink-0 mt-0.5 sm:mt-0">
            <MapPin className="w-5 h-5 stroke-[1.8]" />
          </div>

          <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
            <strong className="font-bold text-theme-main">
              Most conversations happen entirely online.
            </strong>{' '}
            For more sensitive situations, we can also arrange a formal
            in-person meeting.
          </p>
        </div>
      </div>

      {/* Standalone Founder Quote Section */}
      <div className="py-20 md:py-28 bg-[#1c1912] border-t border-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <blockquote className="font-serif text-3xl sm:text-4xl md:text-[40px] text-[#f5f2ea] font-normal leading-[1.22] tracking-tight">
            "It's very easy for a government to bend the law against someone
            who holds the wrong opinion, or whose ex-partner has friends in the
            right places. The only real protection is not being reachable when
            it happens."
          </blockquote>

          <p className="text-sm sm:text-base text-[#f7f3e9] font-normal">
            — Founder, Crypto Confidant
          </p>
        </div>
      </div>
    </section>
  );
};