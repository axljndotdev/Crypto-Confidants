import React from 'react';

export const WhyWeExistSection: React.FC = () => {
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
                  WHY WE EXIST
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-theme-main tracking-tight leading-[1.1]">
                We built this because we lived it.
              </h2>
            </div>

            {/* Paragraphs */}
            <div className="space-y-6 text-theme-muted text-base sm:text-lg leading-relaxed font-normal">
              <p>
                A five-year legal battle. Eight serious criminal charges, defended and dismissed — all of them. Then, when that wasn't enough, three more accusations and another attempt to bring in the police, built on claims that were never verified.
              </p>

              <p>
                By the time it was over, the only asset that couldn't be frozen, seized, or held hostage by a sudden policy change was the crypto already sitting in a cold wallet. Everything else — property, vehicles, and traditional bank accounts — remained at the mercy of institutions that had already shown how easily they could be turned against us, even in supposedly stable, developed societies where persecution is often assumed to be a distant problem.
              </p>

              <p>
                So the property was sold, the cars went, and what remained moved into crypto and left the jurisdiction entirely. That experience — plus a professional background supporting people through crisis — is what shaped Crypto Confidant: practical education on what's actually available in the crypto space, offering a confidential presence for people trying to think clearly under pressure.
              </p>
            </div>

          </div>

          {/* Quote & Asset Comparison Card (Right) */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 md:p-12 rounded-[28px] bg-theme-card border border-theme shadow-sm space-y-8">
              
              {/* Quote Block */}
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-[32px] text-theme-main italic leading-[1.3] tracking-tight font-normal">
                "If we hadn't already moved what we had into a cold wallet and left the country, we could have been left with nothing — at the whims of a weaponised legal system we no longer trusted."
              </blockquote>

              {/* Asset Class Vulnerability 3-Column Comparison */}
              <div className="pt-8 border-t border-theme-subtle grid grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <div className="font-serif text-xl sm:text-2xl text-theme-brass font-normal">
                    Property
                  </div>
                  <div className="text-xs sm:text-sm text-theme-muted leading-tight">
                    Sold under pressure
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif text-xl sm:text-2xl text-theme-brass font-normal">
                    Cash & assets
                  </div>
                  <div className="text-xs sm:text-sm text-theme-muted leading-tight">
                    At legal risk
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif text-xl sm:text-2xl text-theme-brass font-normal">
                    Cold wallet
                  </div>
                  <div className="text-xs sm:text-sm text-theme-muted leading-tight">
                    Untouchable
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

