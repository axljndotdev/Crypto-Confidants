import React from 'react';
import { ShieldAlert, Compass, Globe2, ArrowUpRight } from 'lucide-react';

interface WhoWeHelpProps {
  onOpenConsultation: (topic?: string) => void;
}

export const WhoWeHelpSection: React.FC<WhoWeHelpProps> = ({ onOpenConsultation }) => {
  const personas = [
    {
      id: 'wrongful-prosecution',
      icon: ShieldAlert,
      title: 'Facing wrongful prosecution',
      description: 'People targeted by false or unverified accusations, who want a clear picture of what\'s actually possible for their financial situation and someone steady to talk it through with.'
    },
    {
      id: 'views-out-of-favor',
      icon: Compass,
      title: 'Holding views out of favor',
      description: 'Anyone whose political, religious, or personal opinions put them at odds with the prevailing sentiment of the government currently in power — anywhere in the world.'
    },
    {
      id: 'planning-real-exit',
      icon: Globe2,
      title: 'Planning a real exit',
      description: 'Business owners and individuals who want to understand genuine portability of wealth — not insurance on paper, but a clear picture of what\'s actually available to them, globally.'
    }
  ];

  return (
    <section id="who-we-help" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-surface text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            WHO WE HELP
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight max-w-3xl">
            People whose wealth is one accusation away from disappearing.
          </h2>
        </div>

        {/* 3 Personas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="p-8 rounded-3xl bg-theme-surface border border-theme hover:border-theme-brass/50 transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-theme-main border border-theme flex items-center justify-center text-theme-brass group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-theme-main group-hover:text-theme-brass transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-theme-subtle">
                  <button
                    onClick={() => onOpenConsultation(p.title)}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-theme-brass hover:underline group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Talk Through Your Situation</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
