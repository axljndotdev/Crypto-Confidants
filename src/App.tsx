import React, { useState, useEffect } from 'react';
import { ThemeMode } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyWeExistSection } from './components/WhyWeExistSection';
import { WhoWeHelpSection } from './components/WhoWeHelpSection';
import { WhatWeOfferSection } from './components/WhatWeOfferSection';
import { HowWeCommunicateSection } from './components/HowWeCommunicateSection';
import { StartHereSection } from './components/StartHereSection';
import { PricingPage } from './components/PricingPage';
import { ConsultationModal } from './components/ConsultationModal';
import { Footer } from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [prefilledConsultationTopic, setPrefilledConsultationTopic] = useState('');
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'pricing'>('home');

  // Apply data-theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Section observer for scroll highlights
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['why-we-exist', 'who-we-help', 'what-we-offer', 'comms'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenConsultation = (topic: string = '') => {
    setPrefilledConsultationTopic(topic);
    setIsConsultationOpen(true);
  };

  const handleReadStory = () => {
    const el = document.getElementById('why-we-exist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPricing = () => {
    setCurrentPage('pricing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-theme-main text-theme-main selection:bg-[#8A5A1E]/30 selection:text-theme-main transition-colors duration-300">
      {currentPage !== 'pricing' && (
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenConsultation={() => handleOpenConsultation()}
          activeSection={activeSection}
          onOpenPricing={handleOpenPricing}
        />
      )}
      
      <main>
        {currentPage === 'pricing' ? (
          <PricingPage
            onBackHome={handleBackHome}
          />
        ) : (
          <>
            {/* Page 1: Hero & Metrics */}
            <Hero
          onOpenPricing={handleOpenPricing}
            />

            {/* Page 2: Why We Exist */}
            <WhyWeExistSection />

            {/* Page 3: Who We Help */}
            <WhoWeHelpSection
              onOpenConsultation={(topic) => handleOpenConsultation(topic)}
            />

            {/* Page 4: What We Offer */}
            <WhatWeOfferSection
              onOpenConsultation={(topic) => handleOpenConsultation(topic)}
            />

            {/* Pages 5 & 6: How We Communicate */}
            <HowWeCommunicateSection
              onOpenConsultation={() => handleOpenConsultation()}
            />

            {/* Page 7: Start Here & Legal Disclaimer */}
            <StartHereSection
              onOpenPricing={handleOpenPricing}
              onBackToTop={handleBackToTop}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenPricing={handleOpenPricing}
      />

      {/* Consultation Intake Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        prefilledTopic={prefilledConsultationTopic}
        auditScore={auditScore}
      />

    </div>
  );
}
