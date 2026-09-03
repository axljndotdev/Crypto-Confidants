import React from 'react';

interface WhatWeOfferProps {
  onOpenConsultation?: (topic?: string) => void;
}

export const WhatWeOfferSection: React.FC<WhatWeOfferProps> = () => {
  const offerings = [
    {
      num: '01',
      title: 'The global crypto landscape, explained',
      description: 'What self-custody actually means, how cold storage and hardware wallets work, and what non-custodial options exist around the world — explained plainly, without jargon or sales pressure.'
    },
    {
      num: '02',
      title: 'A confidential conversation',
      description: 'Time with someone who has actually lived through a legal crisis, to help you think clearly about your own situation — not to tell you what to do, but to help you see your options without panic.'
    },
    {
      num: '03',
      title: 'Referrals to independent specialists',
      description: 'When something needs a license — legal advice, tax structuring, licensed financial guidance — if necessary we connect you with independent professionals in the relevant jurisdiction. We don\'t provide that advice ourselves.'
    },
    {
      num: '04',
      title: 'A community that\'s been through it',
      description: 'Direct access to people who understand what this actually feels like—including those who have faced persecution, unjust asset loss, coercive government action, or legal systems weaponized to exhaust, intimidate, and silence them.'
    }
  ];

  return (
    <section id="what-we-offer" className="py-20 md:py-28 bg-theme-main2 transition-colors duration-300 relative border-y border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Context */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3">
              <span/>
              <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
                WHAT WE OFFER
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-theme-main tracking-tight leading-[1.12]">
              A clear picture of what's out there, and someone to think it through with.
            </h2>

            <p className="text-lg sm:text-xl text-theme-muted leading-relaxed font-normal">
              This isn’t a script for one specific move. It’s global awareness of what can be available to you for asset protection and portability, paired with a confidential space to process your own situation before you decide anything.
            </p>
          </div>

          {/* Right Column: Numbered Items List */}
          <div className="lg:col-span-7 divide-y divide-theme-subtle">
            {offerings.map((item) => (
              <div
                key={item.num}
                className="py-8 first:pt-0 last:pb-0 flex items-start gap-6 sm:gap-8"
              >
                <span className="font-serif text-2xl sm:text-3xl text-theme-brass font-normal shrink-0 mt-0.5 w-8">
                  {item.num}
                </span>

                <div className="space-y-2">
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-theme-main leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

