import React from 'react';
import { MessageSquare, Mail, MapPin } from 'lucide-react';

interface HowWeCommunicateProps {
  onOpenConsultation?: () => void;
}

export const HowWeCommunicateSection: React.FC<HowWeCommunicateProps> = () => {
  const steps = [
    {
      num: '01',
      title: 'Reach out',
      description: 'Send a short message through the contact form — just your name (or an alias) and a way to reach you back. No details about your situation until we\'re speaking privately, one to one.'
    },
    {
      num: '02',
      title: 'We respond, privately',
      description: 'Our replies come from a fully encrypted mailbox, not a general business inbox. If you use PGP, we\'ll correspond that way from the first message.'
    },
    {
      num: '03',
      title: 'Schedule your call',
      description: 'You\'ll receive a link to book a time directly — no calendar app asking to connect to your Google or Microsoft account.'
    },
    {
      num: '04',
      title: 'Talk, encrypted end to end',
      description: 'Your first conversation happens over an encrypted call link. Nothing is recorded, nothing sits on a server afterward.'
    }
  ];

  return (
    <section id="comms" className="py-20 md:py-28 bg-theme-main transition-colors duration-300 relative">
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
            Everything about how we operate — including how we talk to you — is built around one principle: your information should exist in as few places as possible, for as short a time as possible.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s) => {
            return (
              <div
                key={s.num}
                className="p-6 rounded-[22px] bg-theme-surface border border-theme space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-theme-brass font-normal">
                    {s.num}
                  </span>
                </div>

                <h3 className="font-sans text-lg sm:text-xl font-bold text-theme-main">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* What You'll Need Card */}
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
                  <span className="font-sans text-xl font-bold text-theme-main">Signal</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-[#734A17] dark:text-[#D4A359] bg-[#EFE7DA] dark:bg-[#282218] rounded-full">
                    REQUIRED FOR YOUR CALL
                  </span>
                </div>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
                  A free, end-to-end encrypted messaging and calling app. Download it to your phone or desktop to join your confidential conversation — no account details beyond a phone number, which stays private between us.
                </p>
              </div>
            </div>

            {/* Proton Mail */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EFE7DA] dark:bg-[#282218] flex items-center justify-center text-theme-brass shrink-0 mt-0.5">
                <Mail className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-sans text-xl font-bold text-theme-main">Proton Mail</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-sans font-semibold uppercase tracking-wider text-theme-muted bg-[#EFE7DA]/70 dark:bg-[#282218]/80 rounded-full">
                    OPTIONAL
                  </span>
                </div>
                <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
                  A free, private email provider. Not required to reach us — any email address works — but if you'd like to send fully PGP-encrypted messages from your side too, this is the easiest way.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-theme-subtle">
            <p className="text-sm sm:text-base text-theme-muted font-normal">
              Booking your call happens right on this site — no other software, browser extensions, or accounts required.
            </p>
          </div>
        </div>

        {/* Location / Meeting Note */}
        <div className="p-6 sm:p-8 rounded-[18px] bg-theme-surface border border-theme border-l-4 border-l-theme-brass flex items-start sm:items-center gap-4 sm:gap-6 mb-20">
          <div className="w-10 h-10 rounded-full bg-[#EFE7DA] dark:bg-[#282218] flex items-center justify-center text-theme-brass shrink-0 mt-0.5 sm:mt-0">
            <MapPin className="w-5 h-5 stroke-[1.8]" />
          </div>
          <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
            <strong className="font-bold text-theme-main">Most conversations happen entirely online.</strong> For more sensitive situations, we can also arrange a formal in-person meeting — just mention it when you first reach out and we'll work out a time and place together.
          </p>
        </div>

      </div>

      {/* Standalone Founder Quote Section */}
      <div className="py-20 md:py-28 bg-theme-surface border-t border-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <blockquote className="font-serif text-3xl sm:text-4xl md:text-[40px] text-theme-main font-normal leading-[1.22] tracking-tight">
            "It's very easy for a government to bend the law against someone who holds the wrong opinion, or whose ex-partner has friends in the right places. The only real protection is not being reachable when it happens."
          </blockquote>
          <p className="text-sm sm:text-base text-theme-muted font-normal">
            — Founder, Crypto Confidant
          </p>
        </div>
      </div>
    </section>
  );
};


