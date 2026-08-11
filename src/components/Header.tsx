import React, { useState, useEffect } from 'react';
import { BrandMark } from './BrandMark';
import { ThemeMode } from '../types';
import { Sun, Moon, Shield, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenConsultation: () => void;
  activeSection: string;
  onOpenPricing: () => void;
  onOpenNewsletters?: () => void;
  onBackHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenConsultation,
  activeSection,
  onOpenPricing,
  onOpenNewsletters,
  onBackHome
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
    { id: 'start-here', label: 'Contact' },
  ];

  const handlePricingClick = () => {
    setMobileMenuOpen(false);
    onOpenPricing();
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (onBackHome) {
      onBackHome();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      data-theme={theme}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-theme-main bg-theme-main border-b border-theme ${
        scrolled ? 'py-3.5 shadow-md' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            if (onBackHome) onBackHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="text-theme-brass flex items-center justify-center">
            <BrandMark size={28} variant="brass" />
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-theme-main underline decoration-theme-brass/60 underline-offset-4 decoration-1 group-hover:text-theme-brass transition-colors">
            Crypto Confidant
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-theme-brass font-semibold'
                    : 'text-theme-main/80 hover:text-theme-main'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {onOpenNewsletters && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNewsletters();
              }}
              className="text-sm font-medium transition-colors py-1 cursor-pointer text-theme-main/80 hover:text-theme-main"
            >
              Newsletters
            </button>
          )}
        </nav>

        {/* Desktop Actions & Theme Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 flex items-center justify-center text-theme-main hover:text-theme-brass border border-theme-brass/40 rounded-full transition-all bg-theme-surface/60 hover:bg-theme-surface cursor-pointer shrink-0"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onOpenPricing}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full border border-theme-brass/50 bg-theme-surface/70 hover:bg-theme-surface text-theme-main hover:border-theme-brass shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Book a Conversation</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={onToggleTheme}
            className="p-2 text-theme-muted border border-theme rounded-full bg-theme-surface"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-theme-main border border-theme rounded-full bg-theme-surface"
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
            {onOpenNewsletters && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNewsletters();
                }}
                className="text-left text-base font-medium py-2 border-b border-theme-subtle/50 text-theme-main hover:text-theme-brass transition-colors"
              >
                Newsletters
              </button>
            )}
          </nav>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPricing();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-full shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>View Pricing & Next Steps</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
