export type ThemeMode = 'dark' | 'light';

export interface EducationalGuide {
  id: string;
  title: string;
  category: 'Self-Custody' | 'Cold Storage' | 'Inheritance' | 'Tax & Mobility' | 'Privacy';
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Institutional';
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

export interface AuditQuestion {
  id: number;
  question: string;
  description: string;
  options: {
    label: string;
    score: number; // 0 to 25
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
