import React from 'react';
import { Shield, HardDrive, Compass, Users, ArrowUpRight, Check } from 'lucide-react';

interface PillarsSectionProps {
  onSelectPillar: (topic: string) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({ onSelectPillar }) => {
  const pillars = [
    {
      id: 'self-custody',
      icon: Shield,
      title: 'Self-Custody Architecture',
      tagline: 'Eliminate Single Points of Failure',
      description: 'Design robust 2-of-3 and 3-of-5 multi-signature threshold quorums. Distribute signing keys across distinct hardware vendors and physical geographical vaults.',
      benefits: [
        'Multi-vendor hardware diversification',
        'Duress-resistant passphrase strategies',
        'Deterministic wallet recovery descriptors'
      ]
    },
    {
      id: 'cold-storage',
      icon: HardDrive,
      title: 'Cold Storage Vaults',
      tagline: 'True Air-Gapped Physical Isolation',
      description: 'Isolate private keys completely from internet-connected memory spaces using QR-code and MicroSD air-gap hardware, combined with fireproof titanium seed backups.',
      benefits: [
        '2,000°F fire & flood resistant steel plates',
        'Air-gapped transaction signing protocols',
        'Passphrase entropy management'
      ]
    },
    {
      id: 'portability',
      icon: Compass,
      title: 'Financial Portability',
      tagline: 'Borderless Sovereign Wealth Mobility',
      description: 'Preserve capital across shifting legal jurisdictions with zero-footprint stateless key derivation, sovereign estate protocols, and privacy-preserving tools.',
      benefits: [
        'Cross-border digital asset portability',
        'Shamir Secret Sharing (SLIP-0039) backups',
        'Inheritance timelock contingency plans'
      ]
    },
    {
      id: 'advisory',
      icon: Users,
      title: 'Vetted Professional Network',
      tagline: 'Confidential Legal & Tax Advisors',
      description: 'Direct referral routing to independent, licensed attorneys, CPAs, and fiduciary counselors specialized in digital asset estates and cross-border compliance.',
      benefits: [
        '100% confidential intake & routing',
        'Digital asset trust & estate attorneys',
        'International tax & compliance experts'
      ]
    }
  ];

  return (
    <section id="pillars" className="py-20 bg-theme-surface border-y border-theme relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-main text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            Core Foundations
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            The Four Pillars of Sovereign Wealth
          </h2>
          <p className="text-sm sm:text-base text-theme-muted leading-relaxed">
            Every recommendation at CryptoConfidant is built on absolute non-custodial principles. We empower you to hold your own keys with zero third-party reliance.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="p-8 rounded-2xl bg-theme-main border border-theme hover:border-theme-brass/50 transition-all duration-300 flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-theme-surface border border-theme group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-theme-brass" />
                    </div>
                    <span className="text-xs font-mono text-theme-muted uppercase tracking-wider">
                      Pillar {pillars.indexOf(p) + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-theme-main group-hover:text-theme-brass transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs font-medium text-theme-brass mt-0.5">
                      {p.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-theme-muted leading-relaxed">
                    {p.description}
                  </p>

                  {/* Bullet Benefits */}
                  <ul className="space-y-2 pt-2 border-t border-theme-subtle">
                    {p.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-theme-main">
                        <Check className="w-3.5 h-3.5 text-theme-brass flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-theme-subtle flex items-center justify-between">
                  <span className="text-xs text-theme-muted">Need guidance on this?</span>
                  <button
                    onClick={() => onSelectPillar(p.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-theme-brass hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    <span>Request Strategy</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
