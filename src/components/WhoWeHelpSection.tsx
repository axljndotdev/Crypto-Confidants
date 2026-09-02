import React from 'react';
import { Shield, Sun, Activity } from 'lucide-react';

interface WhoWeHelpProps {
  onOpenConsultation?: (topic?: string) => void;
}

export const WhoWeHelpSection: React.FC<WhoWeHelpProps> = () => {
  const personas = [
    {
      id: 'wrongful-prosecution',
      Icon: Shield,
      title: 'Facing wrongful prosecution',
      description: 'People targeted by false or unverified accusations, who want a clear picture of what\'s actually possible for their financial situation and someone steady to talk it through with.'
    },
    {
      id: 'views-out-of-favor',
      Icon: Sun,
      title: 'Holding views out of favor',
      description: 'Anyone whose political, religious, or personal opinions put them at odds with the prevailing sentiment of the government currently in power — anywhere in the world.'
    },
    {
      id: 'planning-real-exit',
      Icon: Activity,
      title: 'Planning a real exit',
      description: 'Business owners and individuals who want to understand genuine portability of wealth — not insurance on paper, but a clear picture of what\'s actually available to them, globally.'
    }
  ];

  return (
    <section id="who-we-help" className="py-20 md:py-28 bg-theme-main transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-4 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span className="w-8 sm:w-10 h-[1.5px] bg-theme-brass inline-block shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-theme-brass">
              WHO WE HELP
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-theme-main tracking-tight leading-[1.12] max-w-3xl">
            People whose wealth is one accusation away from disappearing.
          </h2>
        </div>

        {/* 3 Personas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {personas.map((p) => {
            const IconComponent = p.Icon;
            return (
              <div
                key={p.id}
                className="p-8 sm:p-9 rounded-[22px] bg-theme-card border border-theme flex flex-col justify-between space-y-6 transition-all duration-300"
              >
                <div className="space-y-5">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-theme-icon dark:bg-[#e5d3a5] flex items-center justify-center text-theme-brass shrink-0">
                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  {/* Card Title */}
                  <h3 className="font-sans text-xl sm:text-2xl font-semi-bold text-theme-main leading-snug">
                    {p.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm sm:text-base text-theme-muted leading-relaxed font-normal">
                    {p.description}
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


