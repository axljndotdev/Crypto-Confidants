import React from 'react';
import { SiteContent } from '../types';

interface WhyWeExistProps {
  content?: SiteContent['whyWeExist'];
}

export const WhyWeExistSection: React.FC<WhyWeExistProps> = ({ content }) => {
  const eyebrow = content?.eyebrow || 'WHY WE EXIST';
  const heading = content?.heading || 'We built this because we lived it.';
  const paragraph1 = content?.paragraph1 || "A five-year legal battle. Eight serious criminal charges, defended and dismissed — all of them. Then, when that wasn't enough, three more accusations and another attempt to bring in the police, built on claims that were never verified.";
  const paragraph2 = content?.paragraph2 || "By the time it was over, the only asset that couldn't be frozen, seized, or held hostage by a sudden policy change was the crypto already sitting in a cold wallet. Everything else — property, vehicles, and traditional bank accounts — remained at the mercy of institutions that had already shown how easily they could be turned against us, even in supposedly stable, developed societies where persecution is often assumed to be a distant problem.";
  const paragraph3 = content?.paragraph3 || "So the property was sold, the cars went, and what remained moved into crypto and left the jurisdiction entirely. That experience — plus a professional background supporting people through crisis — is what shaped Crypto Confidant: practical education on what's actually available in the crypto space, offering a confidential presence for people trying to think clearly under pressure.";
  const quote = content?.quote || '"If we hadn\'t already moved what we had into a cold wallet and left the country, we could have been left with nothing — at the whims of a weaponised legal system we no longer trusted."';
  const item1Title = content?.comparisonItem1Title || 'Property';
  const item1Sub = content?.comparisonItem1Subtitle || 'Sold under pressure';
  const item2Title = content?.comparisonItem2Title || 'Cash & assets';
  const item2Sub = content?.comparisonItem2Subtitle || 'At legal risk';
  const item3Title = content?.comparisonItem3Title || 'Cold wallet';
  const item3Sub = content?.comparisonItem3Subtitle || 'Untouchable';

  return (
    <section id="why-we-exist" className="py-20 md:py-28 bg-theme-main1 border-y border-theme relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Narrative Text Column (Left) */} 
          <div className="lg:col-span-6 space-y-8">
            
            {/* Header inside left column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
                  {eyebrow}
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-theme-main tracking-tight leading-[1.1]">
                {heading}
              </h2>
            </div>

            {/* Paragraphs */}
            <div className="space-y-6 text-theme-muted text-base sm:text-lg leading-relaxed font-normal">
              <p>{paragraph1}</p>
              <p>{paragraph2}</p>
              <p>{paragraph3}</p>
            </div>

          </div>

          {/* Quote & Asset Comparison Card (Right) */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 md:p-12 rounded-[28px] bg-theme-card border border-theme shadow-sm space-y-8">
              
              {/* Quote Block */}
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-[32px] text-theme-main italic leading-[1.3] tracking-tight font-normal">
                {quote}
              </blockquote>

              {/* Asset Class Vulnerability 3-Column Comparison */}
              <div className="pt-8 border-t border-theme-subtle grid grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <div className="font-serif text-xl sm:text-2xl text-theme-brass font-normal">
                    {item1Title}
                  </div>
                  <div className="text-xs sm:text-sm text-theme-muted leading-tight">
                    {item1Sub}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif text-xl sm:text-2xl text-theme-brass font-normal">
                    {item2Title}
                  </div>
                  <div className="text-xs sm:text-sm text-theme-muted leading-tight">
                    {item2Sub}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif text-xl sm:text-2xl text-theme-brass font-normal">
                    {item3Title}
                  </div>
                  <div className="text-xs sm:text-sm text-theme-muted leading-tight">
                    {item3Sub}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

