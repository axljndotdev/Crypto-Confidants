import React, { useState } from 'react';
import { HARDWARE_DEVICES } from '../data';
import { ShieldCheck, Cpu, WifiOff, Code2, Award, Check, X, ExternalLink } from 'lucide-react';

export const HardwareComparison: React.FC = () => {
  const [filterAirgapOnly, setFilterAirgapOnly] = useState(false);
  const [filterOpenSourceOnly, setFilterOpenSourceOnly] = useState(false);

  const filteredDevices = HARDWARE_DEVICES.filter((d) => {
    if (filterAirgapOnly && !d.airgap) return false;
    if (filterOpenSourceOnly && !d.openSource) return false;
    return true;
  });

  return (
    <section id="hardware" className="py-20 bg-theme-surface border-y border-theme relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-main text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            Hardware Vault Evaluation
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-theme-main tracking-tight">
            Institutional Cold Storage Matrix
          </h2>
          <p className="text-sm text-theme-muted leading-relaxed">
            Not all hardware wallets are created equal. We independently evaluate physical security elements, air-gap transmission interfaces, and firmware transparency.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-theme-main border border-theme">
          <div className="text-xs font-mono font-semibold uppercase text-theme-muted tracking-wider">
            FILTER COLD STORAGE FEATURES:
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilterAirgapOnly(!filterAirgapOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                filterAirgapOnly
                  ? 'border-theme-brass bg-theme-surface text-theme-brass'
                  : 'border-theme text-theme-muted hover:text-theme-main'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Air-Gapped Only</span>
            </button>

            <button
              onClick={() => setFilterOpenSourceOnly(!filterOpenSourceOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                filterOpenSourceOnly
                  ? 'border-theme-brass bg-theme-surface text-theme-brass'
                  : 'border-theme text-theme-muted hover:text-theme-main'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>100% Open Source Firmware</span>
            </button>
          </div>
        </div>

        {/* Devices Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="p-6 rounded-2xl bg-theme-main border border-theme hover:border-theme-brass/40 transition-all flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                {/* Device Header */}
                <div className="flex items-start justify-between gap-2 border-b border-theme-subtle pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-theme-muted uppercase tracking-widest">{dev.maker}</span>
                    <h3 className="font-serif text-xl font-bold text-theme-main group-hover:text-theme-brass transition-colors">
                      {dev.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    <Award className="w-3.5 h-3.5" />
                    <span>{dev.rating}</span>
                  </div>
                </div>

                {/* Highlight Badge */}
                <p className="text-xs text-theme-muted italic bg-theme-surface p-3 rounded-lg border border-theme-subtle">
                  "{dev.highlight}"
                </p>

                {/* Feature Metrics */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-theme-muted">Air-Gap Protection</span>
                    <span className={`font-semibold flex items-center gap-1 ${dev.airgap ? 'text-emerald-500' : 'text-theme-muted'}`}>
                      {dev.airgap ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
                      <span>{dev.airgap ? 'Yes (MicroSD/QR)' : 'USB Only'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-theme-muted">Open Source</span>
                    <span className={`font-semibold flex items-center gap-1 ${dev.openSource ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {dev.openSource ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{dev.openSource ? 'Verified Code' : 'Proprietary'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-theme-muted">Multi-Sig Native</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Full Support</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-theme-subtle">
                    <span className="text-theme-muted block text-[10px] uppercase font-mono tracking-wider mb-1">
                      Secure Element Architecture
                    </span>
                    <span className="font-medium text-theme-main text-xs block leading-tight">
                      {dev.securityElement}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-theme-subtle space-y-2">
                <div className="text-[11px] font-medium text-theme-brass">
                  Best For: <span className="text-theme-main font-normal">{dev.bestFor}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
