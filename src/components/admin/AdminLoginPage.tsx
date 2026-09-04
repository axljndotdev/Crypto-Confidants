import React, { useState } from 'react';
import { Lock, User, Key, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { getStoredAdminUsers, setActiveSession } from '../../lib/contentStore';
import { AdminUser } from '../../types';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredAdminUsers();
      const inputIdentifier = username.trim().toLowerCase();
      
      const matched = users.find(
        (u) => 
          (u.username?.toLowerCase() === inputIdentifier || u.email.toLowerCase() === inputIdentifier) && 
          u.active
      );

      if (matched) {
        if (matched.password && matched.password === password) {
          setActiveSession(matched);
          setIsLoading(false);
          onLoginSuccess(matched);
          return;
        } else if (!matched.password && password.length >= 4) {
          setActiveSession(matched);
          setIsLoading(false);
          onLoginSuccess(matched);
          return;
        } else {
          setError('Invalid password. Please check your credentials.');
          setIsLoading(false);
          return;
        }
      }

      setError('Username not found or account is inactive.');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4 selection:bg-[#8A5A1E]/30 selection:text-[#ECE6D6]">
      <button
        onClick={onBackHome}
        className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#8E8E8E] hover:text-[#C4AC76] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to CryptoConfidants.com</span>
      </button>

      <div className="w-full max-w-md bg-[#131210] border border-[#C4AC76]/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#8A5A1E]/20 via-[#C4AC76]/10 to-transparent p-6 border-b border-[#C4AC76]/15 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8A5A1E]/20 border border-[#C4AC76]/40 flex items-center justify-center text-[#C4AC76]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-[#ECE6D6] tracking-tight">Staff Portal</h3>
            <p className="text-xs text-[#8E8E8E]">Authorized personnel access only</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#C4AC76] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8E8E8E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-username-input"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadmin, owner, or editor"
                className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#ECE6D6] placeholder-[#6B6252] focus:outline-none focus:border-[#C4AC76] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#C4AC76] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#8E8E8E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1D1B17] border border-[#C4AC76]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#ECE6D6] placeholder-[#6B6252] focus:outline-none focus:border-[#C4AC76] transition-colors"
              />
            </div>
          </div>

          <button
            id="admin-login-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#8A5A1E] to-[#B27B36] text-[#131210] font-semibold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8A5A1E]/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-[11px] font-mono text-[#8E8E8E]/60 mt-6">
        Protected by hardware-grade non-custodial custody protocols.
      </p>
    </div>
  );
};
