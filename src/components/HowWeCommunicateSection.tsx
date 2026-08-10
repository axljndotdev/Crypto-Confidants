import React from 'react';
import { Send, ShieldCheck, Calendar, PhoneCall, MessageCircle, Mail, MapPin, Lock } from 'lucide-react';

interface HowWeCommunicateProps {
  onOpenConsultation: () => void;
}

export const HowWeCommunicateSection: React.FC<HowWeCommunicateProps> = ({ onOpenConsultation }) => {
  const steps = [
    {
      num: '01',
      icon: Send,
      title: 'Reach out',
      description: 'Send a short message through the contact form — just your name (or an alias) and a way to reach you back. No details about your situation until we\'re speaking privately, one to one.'
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'We respond, privately',
      description: 'Our replies come from a fully encrypted mailbox, not a general business inbox. If you use PGP, we\'ll correspond that way from the first message.'
    },
    {
      num: '03',
      icon: Calendar,
      title: 'Schedule your call',
      description: 'You\'ll receive a link to book a time directly — no calendar app asking to connect to your Google or Microsoft account.'
    },
    {
      num: '04',
      icon: PhoneCall,
      title: 'Talk, encrypted end to end',
      description: 'Your first conversation happens over an encrypted call link. Nothing is recorded, nothing sits on a server afterward.'
    }
  ];

  return (
    <section id="comms" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-surface text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            HOW WE COMMUNICATE
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
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="p-6 rounded-3xl bg-theme-surface border border-theme space-y-4 hover:border-theme-brass/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-theme-brass font-bold">
                    {s.num}
                  </span>
                  <div className="p-2 rounded-xl bg-theme-main border border-theme text-theme-brass">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-theme-main">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* What You'll Need Box */}
        <div className="p-8 md:p-10 rounded-3xl bg-theme-surface border border-theme space-y-8 mb-12">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-theme-main">
              What you'll need
            </h3>
            <p className="text-sm sm:text-base text-theme-muted">
              Nothing complicated — just two free tools, and only one of them is required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-theme-subtle">
            {/* Signal Box */}
            <div className="space-y-3 p-6 rounded-2xl bg-theme-main border border-theme">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-theme-brass" />
                  <span className="font-serif text-xl font-bold text-theme-main">Signal</span>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-theme-brass border border-theme rounded-md bg-theme-surface">
                  REQUIRED FOR YOUR CALL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                A free, end-to-end encrypted messaging and calling app. Download it to your phone or desktop to join your confidential conversation — no account details beyond a phone number, which stays private between us.
              </p>
            </div>

            {/* Proton Mail Box */}
            <div className="space-y-3 p-6 rounded-2xl bg-theme-main border border-theme">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-theme-brass" />
                  <span className="font-serif text-xl font-bold text-theme-main">Proton Mail</span>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider text-theme-muted border border-theme rounded-md bg-theme-surface">
                  OPTIONAL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                A free, private email provider. Not required to reach us — any email address works — but if you'd like to send fully PGP-encrypted messages from your side too, this is the easiest way.
              </p>
            </div>
          </div>

          <p className="text-xs text-theme-muted italic text-center pt-2">
            Booking your call happens right on this site — no other software, browser extensions, or accounts required.
          </p>
        </div>

        {/* In Person Note & Founder Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Location Badge */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-theme-surface border border-theme flex items-start gap-4">
            <div className="p-3 rounded-xl bg-theme-main border border-theme text-theme-brass flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
              <strong className="text-theme-main font-semibold">Most conversations happen entirely online.</strong> For more sensitive situations, we can also arrange a formal in-person meeting — just mention it when you first reach out and we'll work out a time and place together.
            </p>
          </div>

          {/* Founder Quote */}
          <div className="lg:col-span-7 p-8 rounded-2xl bg-theme-surface border border-theme space-y-4">
            <blockquote className="font-serif text-lg sm:text-xl text-theme-main italic leading-relaxed">
              "It's very easy for a government to bend the law against someone who holds the wrong opinion, or whose ex-partner has friends in the right places. The only real protection is not being reachable when it happens."
            </blockquote>
            <p className="text-xs font-mono font-medium text-theme-brass uppercase tracking-wider">
              — Founder, Crypto Confidant
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
