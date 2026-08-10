import React, { useState, useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { ThemeMode } from '../types';
import { Sun, Moon, Shield, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenConsultation: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenConsultation,
  activeSection
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'why-we-exist', label: 'Why We Exist' },
    { id: 'who-we-help', label: 'Who We Help' },
    { id: 'what-we-offer', label: 'What We Offer' },
    { id: 'comms', label: 'How We Communicate' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-theme-surface/95 backdrop-blur-md border-b border-theme py-3.5 shadow-md'
          : 'bg-theme-main/80 backdrop-blur-xs py-5 border-b border-theme-subtle'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="p-1 rounded-xl bg-theme-surface border border-theme group-hover:border-theme-brass/60 transition-colors">
            <BrandMark size={32} variant="brass" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-normal tracking-tight text-theme-main group-hover:text-theme-brass transition-colors underline decoration-theme-brass/40 underline-offset-4 decoration-1">
              Crypto Confidant
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-xs lg:text-sm font-medium transition-all relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-theme-brass font-semibold'
                    : 'text-theme-muted hover:text-theme-main'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] brass-gradient rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions & Theme Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-theme-muted hover:text-theme-main border border-theme rounded-xl transition-all bg-theme-surface hover:bg-theme-surface-hover cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenConsultation}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onToggleTheme}
            className="p-2 text-theme-muted border border-theme rounded-xl bg-theme-surface"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-theme-main border border-theme rounded-xl bg-theme-surface"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-theme-surface border-b border-theme px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-left text-base font-medium py-2 border-b border-theme-subtle/50 transition-colors ${
                  activeSection === link.id ? 'text-theme-brass font-bold' : 'text-theme-main hover:text-theme-brass'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Start Confidential Conversation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
