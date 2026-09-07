export interface Newsletter {
  id: string;
  issueNumber: string;
  date: string;
  title: string;
  subtitle?: string;
  category: string;
  readTime: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  introParagraphs: string[];
  summaryTable?: {
    how?: string;
    when?: string;
    where?: string;
    why?: string;
  };
  protectionSteps?: {
    sectionTitle: string;
    description?: string;
    items: {
      step?: string;
      title?: string;
      action: string;
    }[];
  }[];
  bestPractices?: {
    title: string;
    items: {
      practice: string;
      why: string;
    }[];
  };
  additionalPoints?: {
    title?: string;
    items: string[];
  };
  sources: {
    name: string;
    details: string;
  }[];
}

export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'newsletter-01',
    issueNumber: 'Newsletter 01',
    date: 'August 4, 2026',
    title: 'Coldcard Seed-Generation Flaw Linked to Nearly $90M in Bitcoin Losses',
    category: 'Hardware Security',
    readTime: '6 min read',
    pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/crypto-confidant-2026.firebasestorage.app/o/newsletters%2FNo1_cryptoconfidant_Newsletter.pdf?alt=media&token=1a65c07e-5db4-46e5-b2a7-983a439a03ed',
    pdfFileName: 'No1_cryptoconfidant_Newsletter.pdf',
    pdfFileSize: 'Official PDF Edition',
    introParagraphs: [
      'A security flaw in certain Coldcard hardware wallets has been linked to a series of Bitcoin thefts that began on July 30, 2026. The first major attack drained approximately 1,082.65 BTC from 1,196 Bitcoin addresses in about 41 minutes, worth roughly $70 million at the time. Subsequent attack waves increased the reported losses to nearly $89 million, with a fourth suspected wave later moving another 448.7 BTC from 709 addresses.',
      'The incident was not a hack of the Bitcoin blockchain itself. Instead, investigators linked the thefts to a vulnerability in the way certain Coldcard devices generated wallet seeds. The flaw reduced the randomness available during seed generation, potentially allowing attackers to reproduce or predict vulnerable wallet seeds and then use the corresponding private keys to move Bitcoin without physical access to the devices. Coinkite, the company behind Coldcard, warned affected users that simply updating their firmware does not repair a seed that was already generated using the vulnerable process.'
    ],
    summaryTable: {
      how: "A flaw in Coldcard's seed-generation process reduced the randomness used to create some wallet seeds. This made certain seeds potentially predictable or reproducible, allowing attackers to derive the associated private keys and move the Bitcoin.",
      when: 'The first major theft wave occurred on July 30, 2026, when about 1,082.65 BTC was drained from 1,196 addresses in approximately 41 minutes. Additional waves followed, pushing reported losses toward $90 million.',
      where: 'The thefts occurred through transactions on the Bitcoin blockchain. There is no indication that attackers needed physical access to the Coldcard devices or that the Bitcoin network itself was compromised.',
      why: 'The underlying problem was a firmware-related weakness in the randomness used to generate wallet seeds. A hardware wallet can protect private keys from many online attacks, but a weakness in seed generation can undermine that security because the private keys originate from the seed.'
    },
    protectionSteps: [
      {
        sectionTitle: "Immediate Steps for Coldcard Users",
        description: "How to Protect Yourself (If You're Affected) and Prevent Future Incidents",
        items: [
          {
            step: '1',
            title: 'Check your Coldcard model and firmware',
            action: 'Review the official Coldcard security advisory and determine whether your device generated a seed while running affected firmware.'
          },
          {
            step: '2',
            title: 'Do not assume that updating firmware fixes an existing wallet',
            action: 'Installing the latest firmware does not change a seed that was already generated. If the seed may have been affected, it should be replaced.'
          },
          {
            step: '3',
            title: 'Create a completely new wallet seed',
            action: "Use a fully updated device and generate a new seed. Follow Coldcard's official instructions for generating and backing up the new seed securely."
          },
          {
            step: '4',
            title: 'Move your Bitcoin to the new wallet',
            action: 'Transfer funds from the potentially vulnerable wallet to addresses controlled by the new seed. Verify the receiving addresses on the hardware wallet before sending significant amounts.'
          },
          {
            step: '5',
            title: 'Keep the old seed only until the migration is confirmed',
            action: 'Do not destroy the old recovery information until you have confirmed that all funds have successfully moved to the new wallet.'
          },
          {
            step: '6',
            title: 'Consider using additional security measures',
            action: 'A strong, unique BIP-39 passphrase can provide another layer of protection when used correctly. For larger holdings, users can also consider multisignature custody or other diversified security arrangements.'
          }
        ]
      }
    ],
    bestPractices: {
      title: 'Long-Term Best Practices to Prevent Similar Incidents',
      items: [
        {
          practice: 'Use updated firmware',
          why: "Hardware-wallet security depends on both the device and its software. Users should regularly check the manufacturer's official security announcements and update firmware when appropriate."
        },
        {
          practice: 'Use strong, independent entropy',
          why: 'Seed generation depends on randomness. Where supported by the wallet, adding independently generated entropy, such as properly performed dice rolls, can provide an additional source of randomness.'
        },
        {
          practice: 'Never reuse a potentially compromised seed',
          why: "If a wallet's seed may have been exposed or generated through a vulnerable process, creating a new wallet is safer than simply updating the device and continuing to use the old seed."
        },
        {
          practice: 'Verify receiving addresses',
          why: "Before sending Bitcoin to a hardware wallet, verify the receiving address directly on the hardware-wallet display rather than relying only on a computer or phone screen. Coldcard specifically recommends using its address-verification features when receiving Bitcoin."
        },
        {
          practice: 'Consider multisignature custody',
          why: 'For larger Bitcoin holdings, multisignature arrangements can reduce reliance on a single device or manufacturer. A compromise of one signing device does not necessarily give an attacker control of the funds.'
        },
        {
          practice: 'Monitor security advisories',
          why: 'Hardware-wallet vulnerabilities can remain undiscovered for years. Following official manufacturer announcements and reputable security researchers can help users respond quickly when new vulnerabilities are identified.'
        }
      ]
    },
    additionalPoints: {
      title: 'Additional Ways to Secure Your Cold Wallet',
      items: [
        'Use Multisig: For larger holdings, consider a 2-of-3 multisignature wallet, requiring two of three keys to approve a transaction. This reduces the risk if one key is compromised.',
        'Separate Your Keys: Store signing devices and backups in different secure locations to reduce the impact of theft, fire, or other physical risks.',
        'Use Different Hardware Wallets: For multisig, consider using devices from different manufacturers to reduce single-vendor risk.',
        'Verify Transactions: Always confirm Bitcoin addresses and transaction details directly on your hardware wallet before approving.',
        'Keep Backups Offline: Store seed phrases and multisig recovery information offline and never in cloud storage or email.',
        'Test Recovery: Regularly verify that you can recover your wallet before holding significant amounts of Bitcoin.'
      ]
    },
    sources: [
      {
        name: 'Coinkite / Coldcard – Official Security Advisory',
        details: 'Details the affected firmware, weak seed generation, affected models, and recommended migration steps.'
      },
      {
        name: 'The Hacker News',
        details: 'Reports that 1,082.65 BTC (~$70.2M) was drained from 1,196 Bitcoin addresses in 41 minutes on July 30 and links the incident to the Coldcard firmware flaw.'
      },
      {
        name: 'CoinDesk',
        details: 'Covers the subsequent attack waves and reports losses approaching $89 million across thousands of addresses.'
      },
      {
        name: 'The Block',
        details: "Reports on Coinkite's warning to Coldcard users and the security issue affecting seeds generated on certain devices."
      }
    ]
  }
];

