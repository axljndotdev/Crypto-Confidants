import { SiteContent, AdminUser } from '../types';
import { NEWSLETTERS, Newsletter } from '../data/newsletters';

const SITE_CONTENT_KEY = 'cc_site_content_v2';
const NEWSLETTERS_KEY = 'cc_newsletters_v1';
const ADMIN_USERS_KEY = 'cc_admin_users_v1';
const CURRENT_SESSION_KEY = 'cc_active_session_v1';

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: 'GLOBAL EDUCATION, A CONFIDENTIAL EAR',
    headline: "Your wealth shouldn't depend on staying in a government's good graces.",
    subparagraph: "Crypto Confidants helps people around the world understand what's actually available in the crypto space — self-custody, cold storage, and true financial portability — and gives you a confidential space to think clearly through your own situation before you decide anything.",
    primaryCta: 'Start a conversation',
    secondaryCta: 'Read Newsletter',
    pillar1: 'Access',
    pillar2: 'Flexibility',
    pillar3: 'Sovereignty',
  },
  whyWeExist: {
    eyebrow: 'WHY WE EXIST',
    heading: 'We built this because we lived it.',
    paragraph1: "A five-year legal battle. Eight serious criminal charges, defended and dismissed — all of them. Then, when that wasn't enough, three more accusations and another attempt to bring in the police, built on claims that were never verified.",
    paragraph2: "By the time it was over, the only asset that couldn't be frozen, seized, or held hostage by a sudden policy change was the crypto already sitting in a cold wallet. Everything else — property, vehicles, and traditional bank accounts — remained at the mercy of institutions that had already shown how easily they could be turned against us, even in supposedly stable, developed societies where persecution is often assumed to be a distant problem.",
    paragraph3: "So the property was sold, the cars went, and what remained moved into crypto and left the jurisdiction entirely. That experience — plus a professional background supporting people through crisis — is what shaped Crypto Confidant: practical education on what's actually available in the crypto space, offering a confidential presence for people trying to think clearly under pressure.",
    quote: '"If we hadn\'t already moved what we had into a cold wallet and left the country, we could have been left with nothing — at the whims of a weaponised legal system we no longer trusted."',
    comparisonItem1Title: 'Property',
    comparisonItem1Subtitle: 'Sold under pressure',
    comparisonItem2Title: 'Cash & assets',
    comparisonItem2Subtitle: 'At legal risk',
    comparisonItem3Title: 'Cold wallet',
    comparisonItem3Subtitle: 'Untouchable',
  },
  whoWeHelp: {
    eyebrow: 'WHO WE HELP',
    heading: 'People whose wealth is one accusation away from disappearing.',
    persona1Title: 'Facing wrongful prosecution',
    persona1Description: "People targeted by false or unverified accusations, who want a clear picture of what's actually possible for their financial situation and someone steady to talk it through with.",
    persona2Title: 'Holding views out of favor',
    persona2Description: 'Anyone whose political, religious, or personal opinions put them at odds with the prevailing sentiment of the government currently in power — anywhere in the world.',
    persona3Title: 'Planning a real exit',
    persona3Description: "Business owners and individuals who want to understand genuine portability of wealth — not insurance on paper, but a clear picture of what's actually available to them, globally.",
  },
  whatWeOffer: {
    eyebrow: 'WHAT WE OFFER',
    heading: "A clear picture of what's out there, and someone to think it through with.",
    description: "This isn’t a script for one specific move. It’s global awareness of what can be available to you for asset protection and portability, paired with a confidential space to process your own situation before you decide anything.",
    offering1Title: 'The global crypto landscape, explained',
    offering1Description: 'What self-custody actually means, how cold storage and hardware wallets work, and what non-custodial options exist around the world — explained plainly, without jargon or sales pressure.',
    offering2Title: 'A confidential conversation',
    offering2Description: 'Time with someone who has actually lived through a legal crisis, to help you think clearly about your own situation — not to tell you what to do, but to help you see your options without panic.',
    offering3Title: 'Referrals to independent specialists',
    offering3Description: "When something needs a license — legal advice, tax structuring, licensed financial guidance — if necessary we connect you with independent professionals in the relevant jurisdiction. We don't provide that advice ourselves.",
    offering4Title: "A community that's been through it",
    offering4Description: 'Direct access to people who understand what this actually feels like—including those who have faced persecution, unjust asset loss, coercive government action, or legal systems weaponized to exhaust, intimidate, and silence them.',
  },
  comms: {
    eyebrow: 'HOW WE COMMUNICATE',
    heading: 'A confidant, not a form submission.',
    description: 'Everything about how we operate — including how we communicate — is built around one principle: privacy. Your information should exist in as few places as possible, for as short a time as possible.',
    step1Title: 'Begin with a short enquiry',
    step1Description: 'You can introduce yourself and indicate the type of conversation or engagement you are interested in. Via Signal - our username @cryptoconfidant.01 or book your Initial Introduction Session. There is no need to send sensitive personal, financial or identifying information in your enquiry. Relevant details can be discussed confidentialy during the Initial Introduction Session.',
    step2Title: 'Set up Signal',
    step2Description: 'Signal is CryptoConfidant’s required communication channel for client conversations. Before your enquiry or Initial Introduction Session, please install the Signal app and create a Signal account. Signal requires a telephone number when registering an account. However, Signal’s username and phone-number privacy settings can allow you to contact CryptoConfidant.com without disclosing that number to us.',
    step3Title: 'Initial Introduction Session',
    step3Description: 'The 20-minute Initial Introduction Session is the first substantive point of communication with CryptoConfidant.com. It provides a private, focused opportunity to describe your circumstances at a high level, explain what you are seeking, and consider whether an ongoing conversation or engagement may be appropriate.',
    step4Title: 'Continue privately',
    step4Description: 'Further sessions are agreed mutually and, where appropriate, take place through Signal. Signal supports encrypted messaging and voice or video calls and can allow you to communicate via your Signal username without disclosing your name or telephone number to CryptoConfidant.com.',
    step5Title: 'Agreeing next steps',
    step5Description: 'The Initial Introduction Session is not a commitment to a further engagement. If we both decide to proceed, we will agree the appropriate format, scope, timing, and next steps directly and privately through Signal.',
    signalUsername: '@cryptoconfidant.01',
    channelEmail: 'contact@cryptoconfidants.com',
  },
  startHere: {
    eyebrow: 'START HERE',
    heading: "Don't wait for the knock on the door.",
    subparagraph: 'Talk to somebody with experience who has actually been through it. A confidential first conversation to help you understand your options.',
    ctaButtonText: 'Book a conversation',
    disclaimerText: 'Crypto Confidant provides general education and a confidential space to think through your situation. We are not a law firm, financial adviser, or custodian, and nothing here constitutes legal or financial advice. For anything requiring licensed advice, we refer you to independent qualified professionals in your jurisdiction.',
  },
  pricing: {
    headline: 'Advisory & Conversation Tiers',
    subheadline: 'Clear, fixed fees with zero asset-based commissions or hidden percentages.',
    tier1TopLabel: '20 MINUTES',
    tier1Name: 'Introductory Session',
    tier1Price: 'US$75',
    tier1Description: 'A focused introductory conversation to clarify your situation, explore relevant options, and determine whether further advisory work would be helpful.',
    tier1ButtonLabel: 'Book & Pay',
    tier2TopLabel: '50 MINUTES',
    tier2Name: 'Single Session',
    tier2Price: 'US$450',
    tier2Description: 'A more detailed, confidential exploration of your situation, priorities, strategy, and positioning will be scheduled after the introductory session.',
    tier2ButtonLabel: 'Introductory Session Required First',
    tier3TopLabel: '10 × 50 MINUTES',
    tier3Name: 'Multiple Session',
    tier3Price: 'US$4,000',
    tier3Description: 'An ongoing confidential conversation covering your situation, priorities, strategy, positioning, and execution.',
    tier3Feature: 'Valid for 180 days from date of purchase.',
    tier3ButtonLabel: 'Introductory Session Required First',
  },
};

export const defaultAdminUsers: (AdminUser & { password?: string })[] = [
  {
    id: 'usr_superadmin',
    username: 'superadmin',
    password: 'ConfidantSuperAdmin2026!',
    email: 'axljn.dev@gmail.com',
    name: 'Lead Architect (Super Admin)',
    role: 'superadmin',
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'usr_owner',
    username: 'owner',
    password: 'ConfidantOwner2026!',
    email: 'owner@cryptoconfidants.com',
    name: 'Owner (Site Editor)',
    role: 'owner',
    active: true,
    createdAt: '2026-01-05',
  },
  {
    id: 'usr_editor',
    username: 'editor',
    password: 'ConfidantEditor2026!',
    email: 'editor@cryptoconfidants.com',
    name: 'Newsletter Editor',
    role: 'editor',
    active: true,
    createdAt: '2026-01-10',
  },
];

export function getStoredSiteContent(): SiteContent {
  if (typeof window === 'undefined') return defaultSiteContent;
  try {
    // Clear out old v1 storage that had fabricated copy if present
    if (localStorage.getItem('cc_site_content_v1')) {
      localStorage.removeItem('cc_site_content_v1');
    }
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (!raw) return defaultSiteContent;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...defaultSiteContent.hero, ...(parsed.hero || {}) },
      whyWeExist: { ...defaultSiteContent.whyWeExist, ...(parsed.whyWeExist || {}) },
      whoWeHelp: { ...defaultSiteContent.whoWeHelp, ...(parsed.whoWeHelp || {}) },
      whatWeOffer: { ...defaultSiteContent.whatWeOffer, ...(parsed.whatWeOffer || {}) },
      comms: { ...defaultSiteContent.comms, ...(parsed.comms || {}) },
      startHere: { ...defaultSiteContent.startHere, ...(parsed.startHere || {}) },
      pricing: { ...defaultSiteContent.pricing, ...(parsed.pricing || {}) },
    };
  } catch {
    return defaultSiteContent;
  }
}

export function saveStoredSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event('site-content-updated'));
}

export const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
] as const;

export function formatNewsletterDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();

  // If already in YYYY-MMM-DD (e.g. 2026-SEP-04 or 2026-Sep-04)
  const mmmMatch = trimmed.match(/^(\d{4})-([A-Za-z]{3})-(\d{1,2})$/);
  if (mmmMatch) {
    const year = mmmMatch[1];
    const monUpper = mmmMatch[2].toUpperCase();
    const day = mmmMatch[3].padStart(2, '0');
    return `${year}-${monUpper}-${day}`;
  }

  // If in YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-09-04 or 2026-9-4)
  const numMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (numMatch) {
    const year = numMatch[1];
    const monthNum = parseInt(numMatch[2], 10);
    const day = numMatch[3].padStart(2, '0');
    if (monthNum >= 1 && monthNum <= 12) {
      return `${year}-${MONTHS_SHORT[monthNum - 1]}-${day}`;
    }
  }

  // Fallback to JS Date parsing for strings like "August 4, 2026" or "Sep 4, 2026"
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const mon = MONTHS_SHORT[parsed.getMonth()];
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${mon}-${day}`;
  }

  return trimmed;
}

export function parseNewsletterDate(dateStr: string): number {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  const trimmed = dateStr.trim();

  // Match YYYY-MMM-DD (e.g. 2026-SEP-04)
  const mmmMatch = trimmed.match(/^(\d{4})-([A-Za-z]{3})-(\d{1,2})$/);
  if (mmmMatch) {
    const year = parseInt(mmmMatch[1], 10);
    const monUpper = mmmMatch[2].toUpperCase();
    const day = parseInt(mmmMatch[3], 10);
    const monthIndex = MONTHS_SHORT.indexOf(monUpper as any);
    if (monthIndex !== -1) {
      return new Date(year, monthIndex, day).getTime();
    }
  }

  // Match YYYY-MM-DD
  const numMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (numMatch) {
    const year = parseInt(numMatch[1], 10);
    const monthIndex = parseInt(numMatch[2], 10) - 1;
    const day = parseInt(numMatch[3], 10);
    return new Date(year, monthIndex, day).getTime();
  }

  const parsed = new Date(trimmed).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getIssueNumberNumeric(issueNumber: string): number {
  if (!issueNumber) return 0;
  const match = issueNumber.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function sortNewslettersLatestFirst(items: Newsletter[]): Newsletter[] {
  return [...items].sort((a, b) => {
    const diff = parseNewsletterDate(b.date) - parseNewsletterDate(a.date);
    if (diff !== 0) return diff;
    return getIssueNumberNumeric(b.issueNumber) - getIssueNumberNumeric(a.issueNumber);
  });
}

export function getStoredNewsletters(): Newsletter[] {
  if (typeof window === 'undefined') return sortNewslettersLatestFirst(NEWSLETTERS);
  try {
    const raw = localStorage.getItem(NEWSLETTERS_KEY);
    if (!raw) {
      const sorted = sortNewslettersLatestFirst(NEWSLETTERS);
      localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(sorted));
      return sorted;
    }
    const parsed = JSON.parse(raw);
    return sortNewslettersLatestFirst(Array.isArray(parsed) ? parsed : NEWSLETTERS);
  } catch {
    return sortNewslettersLatestFirst(NEWSLETTERS);
  }
}

export function saveStoredNewsletters(newsletters: Newsletter[]): void {
  if (typeof window === 'undefined') return;
  const sorted = sortNewslettersLatestFirst(newsletters);
  localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(sorted));
  window.dispatchEvent(new Event('newsletters-updated'));
}

export function getStoredAdminUsers(): (AdminUser & { password?: string })[] {
  if (typeof window === 'undefined') return defaultAdminUsers;
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdminUsers));
      return defaultAdminUsers;
    }
    return JSON.parse(raw);
  } catch {
    return defaultAdminUsers;
  }
}

export function saveStoredAdminUsers(users: (AdminUser & { password?: string })[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('admin-users-updated'));
}

export function getActiveSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveSession(user: AdminUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }
  window.dispatchEvent(new Event('auth-state-changed'));
}
