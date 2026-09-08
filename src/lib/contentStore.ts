import { SiteContent, AdminUser } from '../types';
import { NEWSLETTERS, Newsletter } from '../data/newsletters';
import { db, listNewslettersFromFirebaseStorage } from './firebase';
import { formatFileSize } from './pdfStorage';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';

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
    pillar1: 'Flexibility',
    pillar2: 'Access',
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
  footer: {
    brandName: 'Crypto Confidant',
    siteColumnTitle: 'SITE',
    contactColumnTitle: 'CONTACT',
    contactEmail: 'hello@cryptoconfidant.com',
    contactButtonLabel: 'Book a Conversation',
    copyrightText: '© 2026 Crypto Confidant. Educational content and confidential conversations only — not legal, tax, or financial advice.',
    builtByText: "Built by people who've been through it.",
    whyWeExistLink: 'Why We Exist',
    whoWeHelpLink: 'Who We Help',
    whatWeOfferLink: 'What We Offer',
    pricingLink: 'Advisory Fees',
    termsLink: 'Terms & Privacy Policy',
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

export const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
] as const;

export function formatNewsletterDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();

  // If already in DD-MMM-YYYY or DD-MMMM-YYYY (e.g. 07-SEPT-2026, 07-SEP-2026, 7-Sep-2026)
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/]([A-Za-z]{3,4})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    let mon = dmyMatch[2].toUpperCase();
    if (mon === 'SEP') mon = 'SEPT';
    const year = dmyMatch[3];
    return `${day}-${mon}-${year}`;
  }

  // If in YYYY-MMM-DD (e.g. 2026-SEP-07, 2026-SEPT-07, 2026-Sep-04)
  const ymdMatch = trimmed.match(/^(\d{4})[-/]([A-Za-z]{3,4})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    let mon = ymdMatch[2].toUpperCase();
    if (mon === 'SEP') mon = 'SEPT';
    const day = ymdMatch[3].padStart(2, '0');
    return `${day}-${mon}-${year}`;
  }

  // If in YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-09-07 or 2026-9-7)
  const numMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (numMatch) {
    const year = numMatch[1];
    const monthNum = parseInt(numMatch[2], 10);
    const day = numMatch[3].padStart(2, '0');
    if (monthNum >= 1 && monthNum <= 12) {
      return `${day}-${MONTHS_SHORT[monthNum - 1]}-${year}`;
    }
  }

  // If in DD-MM-YYYY or DD/MM/YYYY
  const numMatch2 = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (numMatch2) {
    const day = numMatch2[1].padStart(2, '0');
    const monthNum = parseInt(numMatch2[2], 10);
    const year = numMatch2[3];
    if (monthNum >= 1 && monthNum <= 12) {
      return `${day}-${MONTHS_SHORT[monthNum - 1]}-${year}`;
    }
  }

  // Fallback to JS Date parsing for strings like "September 7, 2026" or "August 4, 2026"
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const mon = MONTHS_SHORT[parsed.getMonth()];
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${day}-${mon}-${year}`;
  }

  return trimmed;
}

export function parseNewsletterDate(dateStr: string): number {
  if (!dateStr || typeof dateStr !== 'string') return 0;
  const trimmed = dateStr.trim();

  // Match DD-MMM-YYYY (e.g. 07-SEPT-2026 or 07-SEP-2026)
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/]([A-Za-z]{3,4})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    let monUpper = dmyMatch[2].toUpperCase();
    if (monUpper === 'SEP') monUpper = 'SEPT';
    const year = parseInt(dmyMatch[3], 10);
    const monthIndex = MONTHS_SHORT.indexOf(monUpper as any);
    if (monthIndex !== -1) {
      return new Date(year, monthIndex, day).getTime();
    }
  }

  // Match YYYY-MMM-DD (e.g. 2026-SEP-04)
  const mmmMatch = trimmed.match(/^(\d{4})-([A-Za-z]{3,4})-(\d{1,2})$/);
  if (mmmMatch) {
    const year = parseInt(mmmMatch[1], 10);
    let monUpper = mmmMatch[2].toUpperCase();
    if (monUpper === 'SEP') monUpper = 'SEPT';
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

// -------------------------------------------------------------
// Synchronous Local Cache Access (Fast initial render)
// -------------------------------------------------------------

export function getStoredSiteContent(): SiteContent {
  if (typeof window === 'undefined') return defaultSiteContent;
  try {
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
      footer: { ...defaultSiteContent.footer, ...(parsed.footer || {}) },
    };
  } catch {
    return defaultSiteContent;
  }
}

const LEGACY_MOCK_IDS = new Set([
  'newsletter-02',
  'newsletter-03',
  'newsletter-04',
  'newsletter-05',
  'newsletter-06',
  'newsletter-07',
  'newsletter-08',
]);

export function getStoredNewsletters(): Newsletter[] {
  if (typeof window === 'undefined') return sortNewslettersLatestFirst(NEWSLETTERS);
  try {
    const raw = localStorage.getItem(NEWSLETTERS_KEY);
    if (!raw) {
      return sortNewslettersLatestFirst(NEWSLETTERS);
    }
    const parsed = JSON.parse(raw);
    const list: Newsletter[] = Array.isArray(parsed) ? parsed : NEWSLETTERS;
    const filtered = list.filter((item) => !LEGACY_MOCK_IDS.has(item.id));
    const sanitized = filtered.map((item) => {
      const isFirst = item.id === 'newsletter-01';
      return {
        ...item,
        date: isFirst ? '07-SEPT-2026' : item.date,
        // Strip dead session-scoped blob URLs from legacy local storage
        pdfUrl: isFirst ? '/newsletters/No1_cryptoconfidant_Newsletter.pdf' : (item.pdfUrl?.startsWith('blob:') ? undefined : item.pdfUrl),
      };
    });
    return sortNewslettersLatestFirst(sanitized.length > 0 ? sanitized : NEWSLETTERS);
  } catch {
    return sortNewslettersLatestFirst(NEWSLETTERS);
  }
}

export function getStoredAdminUsers(): (AdminUser & { password?: string })[] {
  if (typeof window === 'undefined') return defaultAdminUsers;
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    if (!raw) return defaultAdminUsers;
    return JSON.parse(raw);
  } catch {
    return defaultAdminUsers;
  }
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

// -------------------------------------------------------------
// Global Cloud Persistence (Firebase Firestore + Real-time Sync)
// -------------------------------------------------------------

/**
 * Strips all keys with `undefined` values from an object recursively
 * so Firestore setDoc / updateDoc / writeBatch will never throw invalid data errors.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

export async function saveStoredSiteContent(content: SiteContent): Promise<void> {
  // Update local cache and fire immediate event
  if (typeof window !== 'undefined') {
    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event('site-content-updated'));
  }

  // Push to Cloud Firestore for global persistence across all devices
  try {
    const contentRef = doc(db, 'siteContent', 'global');
    await setDoc(contentRef, sanitizeForFirestore(content), { merge: true });
  } catch (err) {
    console.error('Error saving site content to Firestore:', err);
  }
}

export async function saveSingleNewsletter(newsletter: Newsletter): Promise<void> {
  const current = getStoredNewsletters();
  const exists = current.some((n) => n.id === newsletter.id);
  const updated = exists
    ? current.map((n) => (n.id === newsletter.id ? newsletter : n))
    : [newsletter, ...current];
  const sorted = sortNewslettersLatestFirst(updated);

  if (typeof window !== 'undefined') {
    localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new Event('newsletters-updated'));
  }

  try {
    const newsRef = doc(db, 'newsletters', newsletter.id);
    await setDoc(newsRef, sanitizeForFirestore(newsletter), { merge: true });
  } catch (err) {
    console.error('Error saving newsletter to Firestore:', err);
  }
}

export async function saveStoredNewsletters(newsletters: Newsletter[]): Promise<void> {
  const sorted = sortNewslettersLatestFirst(newsletters);
  if (typeof window !== 'undefined') {
    localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new Event('newsletters-updated'));
  }

  try {
    const batch = writeBatch(db);
    for (const item of sorted) {
      const newsRef = doc(db, 'newsletters', item.id);
      batch.set(newsRef, sanitizeForFirestore(item), { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.error('Error batch-saving newsletters to Firestore:', err);
  }
}

export async function deleteNewsletterFromFirestore(id: string): Promise<void> {
  const current = getStoredNewsletters();
  const updated = current.filter((n) => n.id !== id);
  const sorted = sortNewslettersLatestFirst(updated);

  if (typeof window !== 'undefined') {
    localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new Event('newsletters-updated'));
  }

  try {
    await deleteDoc(doc(db, 'newsletters', id));
  } catch (err) {
    console.error('Error deleting newsletter from Firestore:', err);
  }
}

export async function saveStoredAdminUsers(users: (AdminUser & { password?: string })[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('admin-users-updated'));
  }

  try {
    const batch = writeBatch(db);
    for (const user of users) {
      const userRef = doc(db, 'adminUsers', user.id);
      batch.set(userRef, sanitizeForFirestore(user), { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.error('Error saving admin users to Firestore:', err);
  }
}

// -------------------------------------------------------------
// Real-time Cloud Subscriptions & Auto-Seeding
// -------------------------------------------------------------

let isSyncInitialized = false;

export function initGlobalFirestoreSync(): () => void {
  if (typeof window === 'undefined' || isSyncInitialized) return () => {};
  isSyncInitialized = true;

  const unsubscribers: (() => void)[] = [];

  // 1. Listen to Site Content
  try {
    const contentRef = doc(db, 'siteContent', 'global');
    const unsubContent = onSnapshot(contentRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteContent;
        localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(data));
        window.dispatchEvent(new Event('site-content-updated'));
      } else {
        // Seed initial site content to Firestore if not yet present
        const initial = getStoredSiteContent();
        await setDoc(contentRef, sanitizeForFirestore(initial), { merge: true });
      }
    }, (err) => {
      console.warn('Firestore siteContent sync notice:', err.message);
    });
    unsubscribers.push(unsubContent);
  } catch (e) {
    console.warn('Failed to attach siteContent listener:', e);
  }

  // 2. Listen to Newsletters Collection
  try {
    const newsCol = collection(db, 'newsletters');
    const unsubNews = onSnapshot(newsCol, async (snapshot) => {
      if (!snapshot.empty) {
        const items: Newsletter[] = [];
        const toDeleteIds: string[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Newsletter;
          if (LEGACY_MOCK_IDS.has(d.id)) {
            toDeleteIds.push(d.id);
          } else {
            items.push(data);
          }
        });

        // Clean up legacy mock documents from Firestore
        if (toDeleteIds.length > 0) {
          try {
            const deleteBatch = writeBatch(db);
            for (const delId of toDeleteIds) {
              deleteBatch.delete(doc(db, 'newsletters', delId));
            }
            await deleteBatch.commit();
          } catch (delErr) {
            console.warn('Legacy mock cleanup notice:', delErr);
          }
        }

        const sorted = sortNewslettersLatestFirst(items.length > 0 ? items : NEWSLETTERS);
        localStorage.setItem(NEWSLETTERS_KEY, JSON.stringify(sorted));
        window.dispatchEvent(new Event('newsletters-updated'));
      } else {
        // Seed default newsletters into Firestore
        const defaultItems = sortNewslettersLatestFirst(NEWSLETTERS);
        const batch = writeBatch(db);
        for (const item of defaultItems) {
          batch.set(doc(db, 'newsletters', item.id), sanitizeForFirestore(item), { merge: true });
        }
        await batch.commit();
      }
    }, (err) => {
      console.warn('Firestore newsletters sync notice:', err.message);
    });
    unsubscribers.push(unsubNews);
  } catch (e) {
    console.warn('Failed to attach newsletters listener:', e);
  }

  // 3. Listen to Admin Users
  try {
    const usersCol = collection(db, 'adminUsers');
    const unsubUsers = onSnapshot(usersCol, async (snapshot) => {
      if (!snapshot.empty) {
        const users: (AdminUser & { password?: string })[] = [];
        snapshot.forEach((d) => {
          users.push(d.data() as any);
        });
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
        window.dispatchEvent(new Event('admin-users-updated'));
      } else {
        // Seed default admin accounts
        const batch = writeBatch(db);
        for (const user of defaultAdminUsers) {
          batch.set(doc(db, 'adminUsers', user.id), sanitizeForFirestore(user), { merge: true });
        }
        await batch.commit();
      }
    }, (err) => {
      console.warn('Firestore adminUsers sync notice:', err.message);
    });
    unsubscribers.push(unsubUsers);
  } catch (e) {
    console.warn('Failed to attach adminUsers listener:', e);
  }

  // 4. Check and sync directly with Firebase Storage bucket files
  syncNewslettersWithFirebaseStorage().catch((err) => {
    console.warn('Initial storage auto-sync notice:', err);
  });

  return () => {
    unsubscribers.forEach((unsub) => unsub());
    isSyncInitialized = false;
  };
}

/**
 * Scans Firebase Storage and creates or syncs newsletter entries from any PDF files stored in the bucket.
 */
export async function syncNewslettersWithFirebaseStorage(): Promise<Newsletter[]> {
  try {
    const files = await listNewslettersFromFirebaseStorage();
    if (!files || files.length === 0) {
      return getStoredNewsletters();
    }

    const storageNewsletters: Newsletter[] = files.map((file, index) => {
      const rawName = file.originalName || file.name;
      const cleanName = rawName
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .trim();

      const title = cleanName
        ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
        : `Crypto Confidant Edition ${index + 1}`;

      const id = file.newsletterId && !file.newsletterId.includes('/')
        ? file.newsletterId
        : `storage-${index + 1}`;

      const formattedDate = file.updated
        ? new Date(file.updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Official Edition';

      return {
        id,
        issueNumber: `Newsletter ${String(index + 1).padStart(2, '0')}`,
        date: formattedDate,
        title,
        category: 'Official Publication',
        readTime: 'PDF Document',
        pdfUrl: file.downloadUrl,
        pdfFileName: rawName,
        pdfFileSize: file.size ? formatFileSize(file.size) : 'Firebase Storage',
        introParagraphs: [
          ``
        ],
        sources: [
          {
            name: 'Firebase Storage',
            details: `gs://crypto-confidant-2026.firebasestorage.app/${file.fullPath}`
          }
        ]
      };
    });

    if (storageNewsletters.length > 0) {
      await saveStoredNewsletters(storageNewsletters);
      return storageNewsletters;
    }
  } catch (err) {
    console.warn('Could not sync storage items to newsletter database:', err);
  }
  return getStoredNewsletters();
}
