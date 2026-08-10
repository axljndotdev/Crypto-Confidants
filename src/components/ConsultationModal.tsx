import React, { useState } from 'react';
import { ConsultationRequest } from '../types';
import { ShieldCheck, Lock, X, Check, Send, AlertCircle, Shield } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledTopic?: string;
  auditScore?: number | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledTopic = '',
  auditScore = null
}) => {
  const [formData, setFormData] = useState<ConsultationRequest>({
    topic: prefilledTopic || 'Multi-Sig Self-Custody Architecture',
    custodyVolume: '$100k - $1M',
    jurisdiction: 'United States',
    preferredChannel: 'Signal Encrypted Messaging',
    encryptedHandle: '',
    notes: '',
    urgent: false
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-theme-surface border border-theme brass-border-glow p-8 space-y-6 relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg border border-theme bg-theme-main text-theme-muted hover:text-theme-main transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme bg-theme-main text-xs font-mono text-theme-brass">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Trace Confidential Referral Route</span>
              </div>
              <p className="text-xs text-theme-muted">
                Connect directly with independent, licensed crypto estate attorneys, CPAs, or self-custody security advisors.
              </p>

              {auditScore !== null && (
                <div className="p-3 rounded-lg bg-theme-main border border-theme-subtle text-xs text-theme-brass font-mono">
                  Include Security Audit Score ({auditScore}/100) in referral brief.
                </div>
              )}
            </div>

            {/* Topic Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase text-theme-muted">
                Primary Focus Area
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-theme-main border border-theme rounded-xl text-theme-main focus:outline-none focus:border-theme-brass"
              >
                <option value="Multi-Sig Self-Custody Architecture">Multi-Sig Self-Custody Architecture</option>
                <option value="Air-Gapped Cold Storage Setup">Air-Gapped Cold Storage & Seed Passphrase</option>
                <option value="Non-Custodial Estate & Inheritance Planning">Non-Custodial Estate & Inheritance Planning</option>
                <option value="Cross-Border Financial Portability">Cross-Border Financial Portability & Tax</option>
                <option value="Licensed Legal & CPA Referral">Licensed Legal & CPA Attorney Referral</option>
              </select>
            </div>

            {/* Scope & Jurisdiction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-theme-muted">
                  Asset Scale
                </label>
                <select
                  value={formData.custodyVolume}
                  onChange={(e) => setFormData({ ...formData, custodyVolume: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-theme-main border border-theme rounded-xl text-theme-main focus:outline-none focus:border-theme-brass"
                >
                  <option value="Under $100k">Under $100k</option>
                  <option value="$100k - $1M">$100k - $1M</option>
                  <option value="$1M - $10M">$1M - $10M</option>
                  <option value="$10M+ Institutional">$10M+ Institutional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-theme-muted">
                  Tax Residency Jurisdiction
                </label>
                <input
                  type="text"
                  placeholder="e.g. United States, Switzerland, UAE"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-theme-main border border-theme rounded-xl text-theme-main focus:outline-none focus:border-theme-brass placeholder:text-theme-muted"
                />
              </div>
            </div>

            {/* Preferred Channel & Encrypted Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-theme-muted">
                  Confidential Contact Channel
                </label>
                <select
                  value={formData.preferredChannel}
                  onChange={(e) => setFormData({ ...formData, preferredChannel: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-theme-main border border-theme rounded-xl text-theme-main focus:outline-none focus:border-theme-brass"
                >
                  <option value="Signal Encrypted Messaging">Signal Encrypted Messaging</option>
                  <option value="Encrypted Audio Session">Encrypted Audio Session (Voice)</option>
                  <option value="ProtonMail / PGP Email">ProtonMail / PGP Encrypted Email</option>
                  <option value="Telegram Private Handle">Telegram Private Handle</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-theme-muted">
                  Contact Handle / PGP Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signal # or @proton.me"
                  value={formData.encryptedHandle}
                  onChange={(e) => setFormData({ ...formData, encryptedHandle: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-theme-main border border-theme rounded-xl text-theme-main focus:outline-none focus:border-theme-brass placeholder:text-theme-muted"
                />
              </div>
            </div>

            {/* Additional Briefing Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase text-theme-muted">
                Confidential Briefing Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe your current hardware setup or specific legal objectives. Never share seed phrases or private keys."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-theme-main border border-theme rounded-xl text-theme-main focus:outline-none focus:border-theme-brass placeholder:text-theme-muted resize-none"
              />
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-lg bg-theme-main border border-theme-subtle flex items-start gap-2 text-[11px] text-theme-muted">
              <AlertCircle className="w-4 h-4 text-theme-brass flex-shrink-0 mt-0.5" />
              <span>
                CryptoConfidant does not retain customer IP logs or private credentials. Submissions route via end-to-end encrypted dispatch to independent licensed partner counselors.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Encrypted Request</span>
            </button>

          </form>
        ) : (
          /* Confirmation Screen */
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full brass-gradient flex items-center justify-center text-[#0D0C0A]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-bold text-theme-main">
                Confidential Intake Received
              </h3>
              <p className="text-xs text-theme-muted max-w-sm mx-auto">
                Your request has been dispatched via encrypted channel ({formData.preferredChannel}). An independent confidant or licensed advisor will contact you within 12 business hours.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-theme-main border border-theme text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-theme-muted font-mono text-[10px]">
                <span>DISPATCH REFERENCE</span>
                <span>CONFIDANT-8921-X</span>
              </div>
              <div className="text-theme-main font-medium">Topic: {formData.topic}</div>
              <div className="text-theme-brass">Channel: {formData.preferredChannel} ({formData.encryptedHandle})</div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl"
            >
              Return to Platform
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
