import React, { useState, useEffect } from 'react';
import { ThemeMode, AdminUser, SiteContent } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyWeExistSection } from './components/WhyWeExistSection';
import { WhoWeHelpSection } from './components/WhoWeHelpSection';
import { WhatWeOfferSection } from './components/WhatWeOfferSection';
import { HowWeCommunicateSection } from './components/HowWeCommunicateSection';
import { StartHereSection } from './components/StartHereSection';
import { PricingPage } from './components/PricingPage';
import { NewslettersPage } from './components/NewslettersPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';
import { ConsultationModal } from './components/ConsultationModal';
import { Footer } from './components/Footer';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getActiveSession, setActiveSession, getStoredSiteContent, initGlobalFirestoreSync } from './lib/contentStore';

type AppRoute = 'home' | 'pricing' | 'newsletters' | 'terms' | 'admin' | 'admin-login';

function getInitialPage(): AppRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  
  const isAdmin = path.includes('admin') || hash.includes('admin') || search.includes('admin');
  if (isAdmin) {
    const session = getActiveSession();
    return session ? 'admin' : 'admin-login';
  }
  if (path.includes('terms') || hash.includes('terms') || search.includes('terms') || path.includes('privacy') || hash.includes('privacy')) {
    return 'terms';
  }
  if (path.includes('pricing') || hash.includes('pricing') || search.includes('pricing')) {
    return 'pricing';
  }
  if (path.includes('newsletter') || hash.includes('newsletter') || search.includes('newsletter')) {
    return 'newsletters';
  }
  return 'home';
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getActiveSession());
  const [siteContent, setSiteContent] = useState<SiteContent>(getStoredSiteContent());
  const [prefilledConsultationTopic, setPrefilledConsultationTopic] = useState('');
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState<AppRoute>(getInitialPage);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Start global cloud Firestore real-time synchronization
  useEffect(() => {
    const unsubscribe = initGlobalFirestoreSync();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Synchronize site content updates from admin dashboard or cloud Firestore
  useEffect(() => {
    const handleContentUpdated = () => {
      setSiteContent(getStoredSiteContent());
    };
    window.addEventListener('site-content-updated', handleContentUpdated);
    return () => {
      window.removeEventListener('site-content-updated', handleContentUpdated);
    };
  }, []);

  // Global route checker for path, hash, and query changes
  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const isAdmin = path.includes('admin') || hash.includes('admin') || search.includes('admin');

      if (isAdmin) {
        const session = getActiveSession();
        if (session) {
          setCurrentUser(session);
          setCurrentPage('admin');
        } else {
          setCurrentUser(null);
          setCurrentPage('admin-login');
        }
        return;
      }

      if (path.includes('terms') || hash.includes('terms') || search.includes('terms') || path.includes('privacy') || hash.includes('privacy')) {
        setCurrentPage('terms');
        return;
      }

      if (path.includes('pricing') || hash.includes('pricing') || search.includes('pricing')) {
        setCurrentPage('pricing');
        return;
      }

      if (path.includes('newsletter') || hash.includes('newsletter') || search.includes('newsletter')) {
        setCurrentPage('newsletters');
        return;
      }

      setCurrentPage('home');
    };

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

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

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPricing = () => {
    try {
      window.history.pushState({}, '', '/pricing');
    } catch {
      // Fallback
    }
    setCurrentPage('pricing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewsletters = () => {
    try {
      window.history.pushState({}, '', '/newsletters');
    } catch {
      // Fallback
    }
    setCurrentPage('newsletters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTerms = () => {
    try {
      window.history.pushState({}, '', '/terms-and-conditions');
    } catch {
      // Fallback
    }
    setCurrentPage('terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // Fallback
    }
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // Fallback
    }
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      // Fallback
    }
    setCurrentPage('admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin Login Page
  if (currentPage === 'admin-login') {
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLoginSuccess}
        onBackHome={handleBackHome}
      />
    );
  }

  // Render Admin Dashboard
  if (currentPage === 'admin') {
    if (currentUser) {
      return (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleAdminLogout}
          onViewLiveSite={handleBackHome}
        />
      );
    }
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLoginSuccess}
        onBackHome={handleBackHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-theme-main text-theme-main selection:bg-[#8A5A1E]/30 selection:text-theme-main transition-colors duration-300">
      {currentPage !== 'pricing' && (
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenConsultation={() => handleOpenConsultation()}
          activeSection={activeSection}
          onOpenPricing={handleOpenPricing}
          onOpenNewsletters={handleOpenNewsletters}
          onBackHome={currentPage !== 'home' ? handleBackHome : undefined}
        />
      )}
      
      <main>
        {currentPage === 'pricing' ? (
          <PricingPage
            onBackHome={handleBackHome}
            onOpenTerms={handleOpenTerms}
            content={siteContent.pricing}
          />
        ) : currentPage === 'newsletters' ? (
          <NewslettersPage
            onBackHome={handleBackHome}
            onOpenPricing={handleOpenPricing}
          />
        ) : currentPage === 'terms' ? (
          <TermsAndConditionsPage
            onBackHome={handleBackHome}
            onOpenPricing={handleOpenPricing}
            onOpenConsultation={() => handleOpenConsultation()}
          />
        ) : (
          <>
            {/* Page 1: Hero & Metrics */}
            <Hero
              onOpenPricing={handleOpenPricing}
              onReadNewsletter={handleOpenNewsletters}
              content={siteContent.hero}
            />

            {/* Page 2: Why We Exist */}
            <WhyWeExistSection content={siteContent.whyWeExist} />

            {/* Page 3: Who We Help */}
            <WhoWeHelpSection
              onOpenConsultation={(topic) => handleOpenConsultation(topic)}
              content={siteContent.whoWeHelp}
            />

            {/* Page 4: What We Offer */}
            <WhatWeOfferSection
              onOpenConsultation={(topic) => handleOpenConsultation(topic)}
              content={siteContent.whatWeOffer}
            />

            {/* Pages 5 & 6: How We Communicate */}
            <HowWeCommunicateSection
              onOpenConsultation={() => handleOpenConsultation()}
              content={siteContent.comms}
            />

            {/* Page 7: Start Here & Legal Disclaimer */}
            <StartHereSection
              onOpenConsultation={() => handleOpenConsultation()}
              onOpenPricing={handleOpenPricing}
              onOpenTerms={handleOpenTerms}
              onBackToTop={handleBackToTop}
              content={siteContent.startHere}
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
        onOpenNewsletters={handleOpenNewsletters}
        onOpenTerms={handleOpenTerms}
        onBackHome={currentPage !== 'home' ? handleBackHome : undefined}
        content={siteContent.footer}
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
