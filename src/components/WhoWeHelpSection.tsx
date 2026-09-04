import React from 'react';
import { Shield, Sun, Activity } from 'lucide-react';
import { SiteContent } from '../types';

interface WhoWeHelpProps {
  onOpenConsultation?: (topic?: string) => void;
  content?: SiteContent['whoWeHelp'];
}

export const WhoWeHelpSection: React.FC<WhoWeHelpProps> = ({ content }) => {
  const eyebrow = content?.eyebrow || 'WHO WE HELP';
  const heading = content?.heading || 'People whose wealth is one accusation away from disappearing.';
  const persona1Title = content?.persona1Title || 'Facing wrongful prosecution';
  const persona1Description = content?.persona1Description || "People targeted by false or unverified accusations, who want a clear picture of what's actually possible for their financial situation and someone steady to talk it through with.";
  const persona2Title = content?.persona2Title || 'Holding views out of favor';
  const persona2Description = content?.persona2Description || 'Anyone whose political, religious, or personal opinions put them at odds with the prevailing sentiment of the government currently in power — anywhere in the world.';
  const persona3Title = content?.persona3Title || 'Planning a real exit';
  const persona3Description = content?.persona3Description || "Business owners and individuals who want to understand genuine portability of wealth — not insurance on paper, but a clear picture of what's actually available to them, globally.";

  const personas = [
    {
      id: 'wrongful-prosecution',
      Icon: Shield,
      title: persona1Title,
      description: persona1Description,
    },
    {
      id: 'views-out-of-favor',
      Icon: Sun,
      title: persona2Title,
      description: persona2Description,
    },
    {
      id: 'planning-real-exit',
      Icon: Activity,
      title: persona3Title,
      description: persona3Description,
    },
  ];

  return (
    <section
      id="who-we-help"
      className="
        py-20 md:py-28
        bg-theme-main
        transition-colors duration-300
        relative
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="space-y-4 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <span
            />

            <span
              className="
                text-xs sm:text-sm
                font-sans
                font-semibold
                uppercase
                tracking-[0.2em]
                text-theme-brass
              "
            >
              {eyebrow}
            </span>
          </div>

          <h2
            className="
              font-serif
              text-4xl sm:text-5xl md:text-6xl
              font-normal
              text-theme-main
              tracking-tight
              leading-[1.12]
              max-w-3xl
            "
          >
            {heading}
          </h2>
        </div>

        {/* 3 Personas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {personas.map((p) => {
            const IconComponent = p.Icon;

            return (
              <div
                key={p.id}
                className="
                  p-8 sm:p-9
                  rounded-[22px]
                  bg-theme-card
                  border border-theme
                  flex flex-col
                  justify-between
                  space-y-6
                  transition-all duration-300
                "
              >
                <div className="space-y-5">

                  {/* Icon Button */}
                  <div
                    className="
                      w-12 h-12
                      rounded-[13px]
                      bg-[#E9DEC5]
                      flex items-center justify-center
                      text-[#8A5A1E]
                      shrink-0
                      mt-0.5

                      dark:w-10
                      dark:h-10
                      dark:rounded-xl
                      dark:bg-[#282218]
                      dark:text-theme-brass
                    "
                  >
                    <IconComponent
                      className="
                        w-5 h-5
                        stroke-[2.5]
                      "
                    />
                  </div>

                  {/* Card Title */}
                  <h3
                    className="
                      font-sans
                      text-xl sm:text-2xl
                      font-semibold
                      text-theme-main
                      leading-snug
                    "
                  >
                    {p.title}
                  </h3>

                  {/* Card Description */}
                  <p
                    className="
                      text-sm sm:text-base
                      text-theme-muted
                      leading-relaxed
                      font-normal
                    "
                  >
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