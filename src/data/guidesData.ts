/**
 * Single source of truth for the four published guides.
 *
 * The IDs below are the live URLs (/guides/<id>), they are listed in
 * public/sitemap.xml and prerendered by scripts/prerender.js — do not rename
 * them without updating both. GuidesPage (index cards + collection schema) and
 * GuidePage (article + HowTo schema) both read from here; FAQ cross-links in
 * ./faqData reference these same IDs.
 */
import {
  BoltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const SITE_URL = 'https://evmint.io'

type HeroIcon = typeof SparklesIcon

export interface GuideStepLink {
  text: string
  link: { text: string; url: string }
}

export interface GuideStep {
  number: string
  title: string
  description: string
  details: (string | GuideStepLink)[]
  tip: string
}

export interface Guide {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  /** Human-readable reading time shown in the UI */
  time: string
  /** Same duration as an ISO 8601 duration, for schema.org */
  totalTime: string
  /** Human-readable cost shown in the UI (omitted when there is no fixed cost) */
  cost?: string
  /** Only set when the cost is an actual monetary amount schema.org can express */
  estimatedCost?: { currency: string; value: string }
  keywords: string
  icon: HeroIcon
  tools: string[]
  supplies: string[]
  steps: GuideStep[]
  warnings?: Array<{
    title: string
    description: string
    severity: 'warning' | 'info' | 'danger'
  }>
  poolTypes?: Array<{
    title: string
    description: string
    pros: string[]
    cons: string[]
    bestFor: string
  }>
}

export const guides: Guide[] = [
  {
    id: 'create-base-token',
    title: 'How to Create ERC20 Token: No Code, 4 Steps [2026]',
    description: 'Complete beginner\'s guide to creating your own ERC20 token on any EVM blockchain using our launcher - no coding required!',
    difficulty: 'Beginner',
    time: '5 minutes',
    totalTime: 'PT5M',
    cost: '$75-100 + gas',
    estimatedCost: { currency: 'USD', value: '75-100' },
    keywords: 'create erc20 token, ERC20 token, no code token creation, evm',
    icon: SparklesIcon,
    tools: [
      'Web3 wallet (MetaMask, Rainbow, or WalletConnect-compatible)',
      'Web browser (Chrome, Firefox, Safari, or Brave)'
    ],
    supplies: [
      'Native tokens for gas fees (ETH, MATIC, BNB, AVAX, etc.)',
      'Platform deployment fee ($75-100 USD equivalent)'
    ],
    steps: [
      {
        number: '01',
        title: 'Connect Your Wallet',
        description: 'Connect your wallet to get started',
        details: [
          'Click "Connect Wallet" in the top navigation',
          'Choose your preferred wallet (MetaMask, Rainbow, WalletConnect, etc.)',
          'Select your preferred blockchain network',
          'Ensure you have native tokens for gas fees (usually ~$1 worth)'
        ],
        tip: 'Need native tokens? Send directly from a CEX or bridge from Ethereum mainnet!'
      },
      {
        number: '02',
        title: 'Enter Token Details',
        description: 'Define your token\'s basic information and parameters',
        details: [
          'Enter your token name (e.g., "My Amazing Token")',
          'Set the token symbol (e.g., "MAT" - keep it short)',
          'Choose total supply (default: 1 billion tokens)',
          'Set decimals (18 is standard for most tokens)'
        ],
        tip: '⚖️ Memcoins usually have 1B supply! Higher supply = lower price per token.'
      },
      {
        number: '03',
        title: 'Review & Deploy',
        description: 'Final check and deployment to the blockchain',
        details: [
          'Review all token parameters carefully',
          'Check the deployment fee (varies by network, $75-100 USD)',
          'Click "Create Token" to start deployment',
          'Approve the transaction in your wallet'
        ],
        tip: 'Your token will be live on the blockchain within seconds!'
      },
      {
        number: '04',
        title: 'Verify & Manage',
        description: 'Contract verification and post-deployment steps',
        details: [
          'Contract is automatically verified on the block explorer',
          'Your token appears in the "My Tokens" section',
          'Share your token address with your community',
          {
            text: 'Consider adding liquidity to make it tradeable',
            link: {
              text: 'Learn how to add liquidity',
              url: '/guides/add-liquidity'
            }
          }
        ],
        tip: 'Congratulations! Your token is now live on the blockchain!'
      }
    ]
  },
  {
    id: 'add-liquidity',
    title: 'How to Add Liquidity to Your Token [2026 Guide]',
    description: 'Step-by-step tutorial on adding liquidity to DEX pools using our built-in liquidity tools.',
    difficulty: 'Intermediate',
    time: '10 minutes',
    totalTime: 'PT10M',
    cost: 'Your tokens + native tokens for pair',
    keywords: 'add liquidity, DEX, token trading, uniswap',
    icon: CurrencyDollarIcon,
    tools: [
      'Web3 wallet with deployed ERC20 token',
      'EVMint Liquidity Management interface'
    ],
    supplies: [
      'Your deployed ERC20 tokens (10-20% of total supply recommended)',
      'Native tokens for the trading pair (ETH, MATIC, BNB, etc.)',
      'Gas fees for approval and liquidity transactions'
    ],
    poolTypes: [
      {
        title: 'DEX Pool (Recommended)',
        description: 'Standard automated market maker pools on your chosen network',
        pros: ['Battle-tested protocols', 'High liquidity potential', 'Wide adoption', 'Easy integration'],
        cons: ['Impermanent loss risk', 'Gas costs for transactions'],
        bestFor: 'Most tokens - recommended choice for EVM chains'
      }
    ],
    warnings: [
      {
        title: 'Impermanent Loss Warning',
        description: 'Providing liquidity can result in impermanent loss if token prices diverge significantly. Understand the risks before proceeding.',
        severity: 'warning'
      }
    ],
    steps: [
      {
        number: '01',
        title: 'Navigate to Liquidity Section',
        description: 'Access the liquidity management interface',
        details: [
          'Go to the "Liquidity" page from the main navigation',
          'Connect your wallet if not already connected',
          'Ensure you have both your token and native tokens in your wallet',
          'Select your token from the dropdown list'
        ],
        tip: 'You need both your token and native tokens to create a trading pair!'
      },
      {
        number: '02',
        title: 'Set Token Amounts',
        description: 'Define how much liquidity to provide',
        details: [
          'Enter the amount of your tokens to add (e.g., 100,000 tokens)',
          'Enter corresponding native token amount (determines initial price)',
          'Review the calculated price per token',
          'Consider starting with 10-20% of your token supply'
        ],
        tip: '⚖️ Higher liquidity = less price volatility and better trading experience!'
      },
      {
        number: '03',
        title: 'Approve & Add Liquidity',
        description: 'Execute the liquidity addition',
        details: [
          'Click "Approve Token" to allow the contract to spend your tokens',
          'Wait for approval transaction to confirm',
          'Click "Add Liquidity" to create the pool',
          'Confirm the transaction in your wallet'
        ],
        tip: 'Your pool will be live on the DEX within minutes!'
      },
      {
        number: '04',
        title: 'Manage Your Position',
        description: 'Monitor and manage your liquidity position',
        details: [
          'Your LP tokens represent your share of the pool',
          'Monitor your position in the "My Liquidity" section',
          'You can add more liquidity or remove it anytime',
          'LP tokens can be used for farming opportunities'
        ],
        tip: 'Track your pool performance and adjust as needed!'
      }
    ]
  },
  {
    id: 'token-security',
    title: 'Token Security Best Practices',
    description: 'Learn how to secure your token deployment, verify contracts, and protect against common vulnerabilities.',
    difficulty: 'Intermediate',
    time: '7 minutes',
    totalTime: 'PT7M',
    keywords: 'token security, contract verification, best practices',
    icon: ShieldCheckIcon,
    tools: [
      'Block explorer (Etherscan, Arbiscan, Polygonscan, etc.)',
      'Web3 wallet for contract interaction'
    ],
    supplies: [],
    steps: [
      {
        number: '01',
        title: 'Contract Verification',
        description: 'Ensure your contract is verified and transparent',
        details: [
          'Our platform automatically verifies contracts on block explorers',
          'Verified contracts show their source code publicly',
          'Users can inspect the contract before interacting',
          'Verification builds trust with your community'
        ],
        tip: 'Verified contracts are essential for building trust!'
      },
      {
        number: '02',
        title: 'Safe Token Parameters',
        description: 'Choose secure token configuration',
        details: [
          'Use standard 18 decimals unless you have specific needs',
          'Set reasonable total supply (avoid extreme numbers)',
          'Don\'t include backdoors or admin functions',
          'Our contracts are immutable after deployment'
        ],
        tip: 'Immutable contracts provide the highest security!'
      },
      {
        number: '03',
        title: 'Community Safety',
        description: 'Protect your token holders',
        details: [
          'Be transparent about your project goals',
          'Provide clear tokenomics documentation',
          'Engage regularly with your community',
          'Never promise guaranteed returns'
        ],
        tip: 'Transparency builds lasting community trust!'
      }
    ]
  },
  {
    id: 'advanced-features',
    title: 'Advanced Token Features and Management',
    description: 'Explore advanced token features like fee collection, upgradeable contracts, and multi-signature security.',
    difficulty: 'Advanced',
    time: '12 minutes',
    totalTime: 'PT12M',
    keywords: 'advanced tokens, upgradeable contracts, multi-sig',
    icon: BoltIcon,
    tools: [
      'Web3 wallet (MetaMask or compatible)',
      'EVMint platform'
    ],
    supplies: [],
    steps: [
      {
        number: '01',
        title: 'Understanding Our Fee System',
        description: 'How our platform fee collection works',
        details: [
          'Token deployment fee varies by network ($75-100 USD equivalent)',
          'Fees support platform development and maintenance',
          'No ongoing fees after deployment',
          'Your token contract is completely independent'
        ],
        tip: 'One-time fee for lifetime token ownership!'
      },
      {
        number: '02',
        title: 'Contract Immutability',
        description: 'Benefits and considerations of immutable contracts',
        details: [
          'Our contracts cannot be upgraded or modified',
          'This provides maximum security for token holders',
          'No admin keys or backdoors exist',
          'Code is law - what you deploy is what you get'
        ],
        tip: 'Immutability = maximum security and trust!'
      },
      {
        number: '03',
        title: 'Integration Possibilities',
        description: 'How to integrate your token with other protocols',
        details: [
          'Standard ERC20 interface works with all DeFi protocols',
          'Compatible with DEXes like Uniswap, SushiSwap',
          'Can be used in lending protocols like Aave',
          'Works with bridges for cross-chain functionality'
        ],
        tip: 'Standard compliance = endless possibilities!'
      }
    ]
  }
]

/** Reading order used for "next guide" navigation */
export const guideSequence = guides.map(guide => guide.id)

export const guidesById: Record<string, Guide | undefined> = Object.fromEntries(
  guides.map(guide => [guide.id, guide])
)

export const getGuidePath = (guide: Guide) => `/guides/${guide.id}`

const detailText = (detail: string | GuideStepLink) =>
  typeof detail === 'string' ? detail : detail.text

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

/**
 * Word count of the prose the guide page actually renders — title, intro,
 * every step (heading, summary, action items, pro tip) plus the optional
 * warning and pool-type blocks. Measured, never estimated.
 */
export const countGuideWords = (guide: Guide) => {
  const blocks: string[] = [guide.title, guide.description]

  for (const step of guide.steps) {
    blocks.push(step.title, step.description, step.tip)
    for (const detail of step.details) blocks.push(detailText(detail))
  }

  for (const warning of guide.warnings ?? []) {
    blocks.push(warning.title, warning.description)
  }

  for (const pool of guide.poolTypes ?? []) {
    blocks.push(pool.title, pool.description, pool.bestFor, ...pool.pros, ...pool.cons)
  }

  return blocks.reduce((total, block) => total + countWords(block), 0)
}

/** schema.org HowTo for a guide, shared by the guide page and the guides index */
export const buildGuideHowTo = (guide: Guide) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": guide.title,
  "description": guide.description,
  "url": `${SITE_URL}/guides/${guide.id}`,
  "totalTime": guide.totalTime,
  ...(guide.estimatedCost ? {
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": guide.estimatedCost.currency,
      "value": guide.estimatedCost.value
    }
  } : {}),
  ...(guide.tools.length ? {
    "tool": guide.tools.map(name => ({ "@type": "HowToTool", "name": name }))
  } : {}),
  ...(guide.supplies.length ? {
    "supply": guide.supplies.map(name => ({ "@type": "HowToSupply", "name": name }))
  } : {}),
  "step": guide.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.title,
    "text": `${step.description}. ${step.details.map(detailText).join('. ')}.`,
    "url": `${SITE_URL}/guides/${guide.id}`
  })),
  "image": `${SITE_URL}/og-image.png`
})
