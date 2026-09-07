export type ThemeMode = 'light' | 'dark';

export interface AuditQuestion {
  id: number;
  question: string;
  description: string;
  options: {
    label: string;
    score: number;
    tip: string;
  }[];
}

export interface ConsultationRequest {
  topic: string;
  custodyVolume: string;
  jurisdiction: string;
  preferredChannel: string;
  encryptedHandle: string;
  notes: string;
  urgent: boolean;
}

export interface EducationalGuide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  level: string;
  summary: string;
  keyTakeaways: string[];
  content: string;
}

export interface HardwareWalletDevice {
  id: string;
  name: string;
  maker: string;
  airgap: boolean;
  openSource: boolean;
  securityElement: string;
  display: string;
  multisigSupport: boolean;
  bestFor: string;
  rating: number;
  highlight: string;
}

export interface ConsultationTier {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
}

export type UserRole = 'superadmin' | 'owner' | 'editor';

export interface AdminUser {
  id: string;
  username: string;
  passwordHash?: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    headline: string;
    subparagraph: string;
    primaryCta: string;
    secondaryCta: string;
    pillar1: string;
    pillar2: string;
    pillar3: string;
  };
  whyWeExist: {
    eyebrow: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    quote: string;
    comparisonItem1Title: string;
    comparisonItem1Subtitle: string;
    comparisonItem2Title: string;
    comparisonItem2Subtitle: string;
    comparisonItem3Title: string;
    comparisonItem3Subtitle: string;
  };
  whoWeHelp: {
    eyebrow: string;
    heading: string;
    persona1Title: string;
    persona1Description: string;
    persona2Title: string;
    persona2Description: string;
    persona3Title: string;
    persona3Description: string;
  };
  whatWeOffer: {
    eyebrow: string;
    heading: string;
    description: string;
    offering1Title: string;
    offering1Description: string;
    offering2Title: string;
    offering2Description: string;
    offering3Title: string;
    offering3Description: string;
    offering4Title: string;
    offering4Description: string;
  };
  comms: {
    eyebrow: string;
    heading: string;
    description: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    step4Title: string;
    step4Description: string;
    step5Title: string;
    step5Description: string;
    signalUsername: string;
    channelEmail: string;
  };
  startHere: {
    eyebrow: string;
    heading: string;
    subparagraph: string;
    ctaButtonText: string;
    disclaimerText: string;
  };
  pricing: {
    headline: string;
    subheadline: string;
    tier1TopLabel: string;
    tier1Name: string;
    tier1Price: string;
    tier1Description: string;
    tier1ButtonLabel: string;
    tier2TopLabel: string;
    tier2Name: string;
    tier2Price: string;
    tier2Description: string;
    tier2ButtonLabel: string;
    tier3TopLabel: string;
    tier3Name: string;
    tier3Price: string;
    tier3Description: string;
    tier3Feature: string;
    tier3ButtonLabel: string;
  };
}
