import React from 'react';
import { ShieldCheck, AlertTriangle, Building, Wallet, Landmark } from 'lucide-react';

export const WhyWeExistSection: React.FC = () => {
  return (
    <section id="why-we-exist" className="py-20 md:py-28 bg-theme-surface border-y border-theme relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-main text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            WHY WE EXIST
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            We built this because we lived it.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Narrative Text Column */}
          <div className="lg:col-span-7 space-y-6 text-theme-muted text-base sm:text-lg leading-relaxed">
            <p>
              A five-year legal battle. Eight serious criminal charges, defended and dismissed — all of them. Then, when that wasn't enough, three more accusations and another attempt to bring in the police, built on claims that were never verified.
            </p>

            <p>
              By the time it was over, the only asset that couldn't be frozen, seized, or held hostage by a change in policy was the crypto already sitting in a cold wallet. Everything else — property, vehicles, bank accounts in Australia — was at the mercy of a system that had already shown it could be turned against us.
            </p>

            <p>
              So the property was sold, the cars went, and what remained moved into crypto and left the jurisdiction entirely. That experience — plus a professional background supporting people through crisis — is what shaped Crypto Confidants: practical education on what's actually available in the crypto space, offering a confidential presence for people trying to think clearly under pressure.
            </p>
          </div>

          {/* Quote & Asset Comparison Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-theme-main border border-theme shadow-md space-y-6">
              
              {/* Quote Block */}
              <blockquote className="font-serif text-xl sm:text-2xl text-theme-main italic leading-snug">
                "If we hadn't already moved what we had into a cold wallet and left the country, we could have been left with nothing — at the whims of a legal system we no longer trusted."
              </blockquote>

              {/* Asset Class Vulnerability Grid */}
              <div className="pt-6 border-t border-theme-subtle grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-theme-surface border border-theme text-center space-y-1">
                  <Building className="w-5 h-5 text-red-500/80 mx-auto mb-1" />
                  <div className="font-serif font-bold text-sm text-theme-main">Property</div>
                  <div className="text-[11px] text-theme-muted leading-tight">Sold under pressure</div>
                </div>

                <div className="p-3 rounded-xl bg-theme-surface border border-theme text-center space-y-1">
                  <Landmark className="w-5 h-5 text-amber-500/80 mx-auto mb-1" />
                  <div className="font-serif font-bold text-sm text-theme-main">Cash & assets</div>
                  <div className="text-[11px] text-theme-muted leading-tight">At legal risk</div>
                </div>

                <div className="p-3 rounded-xl bg-theme-surface border border-theme-brass/40 bg-theme-surface-hover text-center space-y-1">
                  <Wallet className="w-5 h-5 text-theme-brass mx-auto mb-1" />
                  <div className="font-serif font-bold text-sm text-theme-brass">Cold wallet</div>
                  <div className="text-[11px] font-semibold text-theme-brass leading-tight">Untouchable</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
