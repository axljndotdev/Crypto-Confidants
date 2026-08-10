import { EducationalGuide, HardwareWalletDevice, AuditQuestion } from './types';

export const EDUCATIONAL_GUIDES: EducationalGuide[] = [
  {
    id: 'guide-multisig-architecture',
    title: 'Architecting Multi-Signature Cold Storage for Sovereign Wealth',
    category: 'Self-Custody',
    readTime: '8 min read',
    level: 'Institutional',
    summary: 'Why single-key hardware wallets present single points of failure, and how a 2-of-3 quorum across physically segregated locations eliminates physical coercion and hardware fault risks.',
    keyTakeaways: [
      'Eliminate single point of failure with 2-of-3 threshold quorum',
      'Distribute hardware keys across geographically separated vaults',
      'Maintain un-encrypted descriptors for deterministic wallet restoration'
    ],
    content: `Single-signature cold storage offers a significant upgrade over exchange custody, yet it preserves a single physical point of failure: a single compromised hardware device or stolen seed phrase phrase compromises the entire balance.

A multi-signature (multisig) architecture requires $M$-of-$N$ distinct private keys to sign any transaction. A standard 2-of-3 vault ensures that:
1. Loss or hardware destruction of any 1 device causes zero loss of funds.
2. Physical coercion at a single physical location cannot force a transfer.
3. Supply-chain attack vectors on a single vendor are mitigated by using heterogeneous hardware manufacturers (e.g. Coldcard + Trezor + BitBox02).`
  },
  {
    id: 'guide-passphrase-hygiene',
    title: 'The Master Guide to BIP39 Passphrases ("25th Word")',
    category: 'Cold Storage',
    readTime: '6 min read',
    level: 'Intermediate',
    summary: 'How adding an unwritten, highly memorable passphrase creates unlimited hidden wallet accounts under a single 24-word seed phrase.',
    keyTakeaways: [
      'Passphrases act as an extension of the private seed key generation',
      'Enables plausible deniability under duress',
      'Requires strict backup retention since passphrases are never stored on device'
    ],
    content: `The BIP39 passphrase, commonly called the "25th word", is not merely a password—it is mathematically combined with your 24 words to derive entirely different cryptographic private keys.

If a seed phrase is exposed, an attacker sees only a dummy wallet with nominal funds or zero balance. The true wealth resides behind the secret passphrase.

Key Rules for Passphrase Security:
- Never store the passphrase in the same physical safe as the 24 words.
- Do not rely solely on human memory for multi-generational asset inheritance.
- Use steel or titanium plates for physical fireproofing.`
  },
  {
    id: 'guide-inheritance-legacy',
    title: 'Decentralized Inheritance Protocols Without Third-Party Custody',
    category: 'Inheritance',
    readTime: '10 min read',
    level: 'Advanced',
    summary: 'Structuring non-custodial digital asset estate transfer protocols that empower heirs without granting premature access to attorneys or trustees.',
    keyTakeaways: [
      'Time-locked smart contracts and dead-man switches',
      'Sharded seed backups using Shamir Secret Sharing (SLIP-0039)',
      'Legal trust coordination with licensed fiduciary confidants'
    ],
    content: `Traditional estate planning relies on probate courts and financial executors holding direct access to bank accounts. For self-custodied digital assets, sharing raw seed phrases with legal counsel creates catastrophic counterparty risk.

Instead, sophisticated asset holders implement dead-man timelocks, Shamir's Secret Sharing (3-of-5 threshold shards), and confidential escrow protocols that automatically unlock recovery instructions only upon validated proof of death.`
  },
  {
    id: 'guide-jurisdiction-portability',
    title: 'Financial Portability: Cross-Border Capital Preservation',
    category: 'Tax & Mobility',
    readTime: '7 min read',
    level: 'Institutional',
    summary: 'Leveraging zero-footprint cold storage and non-custodial mobility to maintain financial sovereignty across shifting legal jurisdictions.',
    keyTakeaways: [
      'Zero-footprint brainwallet & seedless stateless signing options',
      'Compliance & tax reporting for cross-border digital assets',
      'Confidential referral paths to tier-1 crypto tax attorneys'
    ],
    content: `Financial portability is the ultimate hedge against sovereign overreach, capital controls, and geopolitical volatility. Unlike physical gold, real estate, or legacy banking rails, self-custodied cryptographic assets can cross borders digitally without reliance on physical transport.`
  }
];

export const HARDWARE_DEVICES: HardwareWalletDevice[] = [
  {
    id: 'coldcard-mk4',
    name: 'Coldcard Q / Mk4',
    maker: 'Coinkite',
    airgap: true,
    openSource: true,
    securityElement: 'Dual Secure Elements (Microchip + NXP)',
    display: 'Full QWERTY / OLED Display',
    multisigSupport: true,
    bestFor: 'Bitcoin Maximum Security & Air-gapped Multisig',
    rating: 9.8,
    highlight: 'MicroSD / NFC air-gap, brick-me pin, dual secure element protection.'
  },
  {
    id: 'bitbox02',
    name: 'BitBox02 Bitcoin-Only',
    maker: 'Shift Crypto',
    airgap: false,
    openSource: true,
    securityElement: 'ATECC608B Secure Chip',
    display: 'Invisibly integrated OLED + Touch sensors',
    multisigSupport: true,
    bestFor: 'Sleek, Swiss-engineered open source cold storage',
    rating: 9.5,
    highlight: 'MicroSD instant seed backup, source-viewable firmware, Swiss sovereignty.'
  },
  {
    id: 'trezor-safe-5',
    name: 'Trezor Safe 5',
    maker: 'SatoshiLabs',
    airgap: false,
    openSource: true,
    securityElement: 'OPTIGA™ Trust M (EAL6+)',
    display: 'Color Touchscreen with haptic feedback',
    multisigSupport: true,
    bestFor: 'User-friendly open source multi-chain & Shamir Backup',
    rating: 9.3,
    highlight: 'Shamir Secret Sharing natively supported, EAL6+ secure element, open code.'
  },
  {
    id: 'ledger-flex',
    name: 'Ledger Flex / Stax',
    maker: 'Ledger',
    airgap: false,
    openSource: false,
    securityElement: 'ST33K1M50 (EAL6+)',
    display: 'E-Ink Touchscreen',
    multisigSupport: true,
    bestFor: 'Multi-asset ecosystem integration & smooth tactile UI',
    rating: 8.8,
    highlight: 'Customizable E-ink screen, Bluetooth LE, wide token support.'
  }
];

export const AUDIT_QUESTIONS: AuditQuestion[] = [
  {
    id: 1,
    question: 'Where are your primary digital assets currently held?',
    description: 'Custody venue determines counterparty and bankruptcy risk.',
    options: [
      { label: 'Centralized Exchange (Binance, Coinbase, Kraken, etc.)', score: 0, tip: 'High risk! Exchange holdings are unsecured liabilities subject to freeze or insolvency.' },
      { label: 'Software/Mobile Wallet (Metamask, Phantom, Trust Wallet)', score: 10, tip: 'Moderate risk. Private keys exist on internet-connected memory spaces.' },
      { label: 'Single Hardware Wallet (Ledger, Trezor, Coldcard)', score: 20, tip: 'Good baseline! Private keys are air-gapped from network malware.' },
      { label: 'Multi-Signature Vault / Heterogeneous Hardware Quorum', score: 25, tip: 'Institutional gold standard. Zero single points of failure.' }
    ]
  },
  {
    id: 2,
    question: 'How is your 12 or 24-word recovery seed backed up?',
    description: 'Physical durability protects against fire, flood, and decay.',
    options: [
      { label: 'Saved on computer, cloud storage, or smartphone photo', score: 0, tip: 'CRITICAL WARNING! Digital seed exposure guarantees eventual theft.' },
      { label: 'Written on paper stored in a drawer or standard safe', score: 10, tip: 'Vulnerable to fire, humidity, water damage, and physical wear.' },
      { label: 'Stamped on Solid Stainless Steel or Titanium Plates', score: 20, tip: 'Excellent physical fireproofing (resists up to 2,000°F) and water damage.' },
      { label: 'Steel plates split across multiple physical vault locations', score: 25, tip: 'Maximum resiliency against geographic disaster and physical theft.' }
    ]
  },
  {
    id: 3,
    question: 'Do you utilize a BIP39 Passphrase ("25th Word")?',
    description: 'Passphrases create hidden wallets and physical duress protection.',
    options: [
      { label: 'No passphrase used', score: 5, tip: 'Anyone with your 24 words instantly gains full control of all funds.' },
      { label: 'Simple passphrase stored in a password manager', score: 15, tip: 'Better, but digital password managers introduce digital attack surfaces.' },
      { label: 'High-entropy custom passphrase backed up air-gapped', score: 25, tip: 'Superior operational security with plausible deniability.' }
    ]
  },
  {
    id: 4,
    question: 'Do you have a tested Non-Custodial Estate & Inheritance Plan?',
    description: 'Protects family and heirs from permanent asset loss upon unforeseen events.',
    options: [
      { label: 'No plan—nobody else knows how to access the funds', score: 0, tip: 'Without documentation, self-custodied funds become permanently unrecoverable.' },
      { label: 'Informal instructions written in a sealed envelope', score: 10, tip: 'Vulnerable to tampering, loss, or premature unauthorized viewing.' },
      { label: 'Structured legal trust with encrypted step-by-step recovery guide', score: 25, tip: 'Fully sovereign inheritance with zero counterparty custodial power.' }
    ]
  }
];

export const BRAND_SYSTEM_SPEC = {
  brandName: 'CryptoConfidant.com',
  tagline: 'Developer Handoff & Sovereign Brand System',
  fonts: [
    { name: 'Instrument Serif', role: 'Display / Headings', source: 'Google Fonts (regular, italic)' },
    { name: 'Switzer', role: 'Body / UI text', source: 'Fontshare (400, 500, 600, 700)' }
  ],
  colorsLight: [
    { role: 'Background', hex: '#F5F2EA', usage: 'Page background' },
    { role: 'Surface', hex: '#FAF8F2', usage: 'Cards, containers' },
    { role: 'Text', hex: '#1C1912', usage: 'Primary body text' },
    { role: 'Text Muted', hex: '#6B6252', usage: 'Secondary text' },
    { role: 'Primary (brass)', hex: '#8A5A1E', usage: 'Links, CTAs, accents' },
    { role: 'Border', hex: '#CFC4A7', usage: 'Dividers, card borders' }
  ],
  colorsDark: [
    { role: 'Background', hex: '#0D0C0A', usage: 'Page background' },
    { role: 'Surface', hex: '#131210', usage: 'Cards, containers' },
    { role: 'Text', hex: '#ECE6D9', usage: 'Primary body text' },
    { role: 'Text Muted', hex: '#A89D89', usage: 'Secondary text' },
    { role: 'Primary (brass)', hex: '#C99A52', usage: 'Links, CTAs, accents' },
    { role: 'Border', hex: '#37332A', usage: 'Dividers, card borders' }
  ],
  brassGradient: 'linear-gradient(135deg, #E2B876 0%, #C99A52 50%, #A97C3C 100%)'
};
