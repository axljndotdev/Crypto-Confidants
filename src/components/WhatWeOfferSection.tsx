import React from 'react';
import { BookOpen, MessageSquare, ExternalLink, Users } from 'lucide-react';

interface WhatWeOfferProps {
  onOpenConsultation: (topic?: string) => void;
}

export const WhatWeOfferSection: React.FC<WhatWeOfferProps> = ({ onOpenConsultation }) => {
  const offerings = [
    {
      num: '01',
      icon: BookOpen,
      title: 'The global crypto landscape, explained',
      description: 'What self-custody actually means, how cold storage and hardware wallets work, and what non-custodial options exist around the world — explained plainly, without jargon or sales pressure.'
    },
    {
      num: '02',
      icon: MessageSquare,
      title: 'A confidential conversation',
      description: 'Time with someone who has actually lived through a legal crisis, to help you think clearly about your own situation — not to tell you what to do, but to help you see your options without panic.'
    },
    {
      num: '03',
      icon: ExternalLink,
      title: 'Referrals to independent specialists',
      description: 'When something needs a license — legal advice, tax structuring, licensed financial guidance — we connect you with independent professionals in the relevant jurisdiction. We don\'t provide that advice ourselves.'
    },
    {
      num: '04',
      icon: Users,
      title: 'A community that\'s been through it',
      description: 'Direct access to people who understand what this actually feels like — not just theorists, consultants, or people selling a course.'
    }
  ];

  return (
    <section id="what-we-offer" className="py-20 md:py-28 bg-theme-surface border-y border-theme relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-main text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            WHAT WE OFFER
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            A clear picture of what's out there, and someone to think it through with.
          </h2>
          <p className="text-base sm:text-lg text-theme-muted leading-relaxed font-normal">
            This isn't a script for one specific move. It's global education on the crypto landscape, paired with a confidential space to process your own situation before you decide anything.
          </p>
        </div>

        {/* Offerings Stack */}
        <div className="space-y-6">
          {offerings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="p-8 rounded-3xl bg-theme-main border border-theme hover:border-theme-brass/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6 group"
              >
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-serif text-3xl md:text-4xl text-theme-brass font-light w-12">
                    {item.num}
                  </span>
                  <div className="p-3 rounded-2xl bg-theme-surface border border-theme text-theme-brass">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-theme-main group-hover:text-theme-brass transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
