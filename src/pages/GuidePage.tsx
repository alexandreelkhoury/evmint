import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
import { 
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface GuideStep {
  number: string
  title: string
  description: string
  details: (string | { text: string; link: { text: string; url: string } })[]
  tip: string
}

interface GuideData {
  id: string
  title: string
  description: string
  difficulty: string
  time: string
  cost?: string
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

// Guide sequence for navigation
const guideSequence = [
  'create-base-token',
  'add-liquidity', 
  'token-security',
  'advanced-features'
]

const guidesData: Record<string, GuideData> = {
  'create-base-token': {
    id: 'create-base-token',
    title: 'How to Create ERC20 Token: No Code, 4 Steps [2025]',
    description: 'Complete beginner\'s guide to creating your own ERC20 token on any EVM blockchain using our launcher - no coding required!',
    difficulty: 'Beginner',
    time: '5 minutes',
    cost: '$75-100 + gas',
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
  'add-liquidity': {
    id: 'add-liquidity',
    title: 'How to Add Liquidity to Your Token [2025 Guide]',
    description: 'Step-by-step tutorial on adding liquidity to DEX pools using our built-in liquidity tools.',
    difficulty: 'Intermediate',
    time: '10 minutes',
    cost: 'Your tokens + native tokens for pair',
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
  'token-security': {
    id: 'token-security',
    title: 'Token Security Best Practices',
    description: 'Learn how to secure your token deployment, verify contracts, and protect against common vulnerabilities.',
    difficulty: 'Intermediate',
    time: '7 minutes',
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
  'advanced-features': {
    id: 'advanced-features',
    title: 'Advanced Token Features and Management',
    description: 'Explore advanced token features like fee collection, upgradeable contracts, and multi-signature security.',
    difficulty: 'Advanced',
    time: '12 minutes',
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
}

export default function GuidePage() {
  const { guideId } = useParams<{ guideId: string }>()
  const analytics = useFirebaseAnalytics()
  
  const guide = guideId ? guidesData[guideId] : null
  
  // Get next guide in sequence
  const getNextGuide = (currentGuideId: string) => {
    const currentIndex = guideSequence.indexOf(currentGuideId)
    if (currentIndex >= 0 && currentIndex < guideSequence.length - 1) {
      const nextGuideId = guideSequence[currentIndex + 1]
      return {
        id: nextGuideId,
        title: guidesData[nextGuideId]?.title || 'Next Guide'
      }
    }
    return null
  }
  
  const nextGuide = guide ? getNextGuide(guide.id) : null

  useEffect(() => {
    if (guide) {
      trackPageView(analytics, `guide_${guide.id}`)
    }
  }, [analytics, guide])

  // Build comprehensive HowTo structured data for each guide
  const guideStructuredData: object[] | undefined = guide ? [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": guide.title,
      "description": guide.description,
      "url": `https://evmint.io/guides/${guide.id}`,
      "totalTime": guide.id === 'create-base-token' ? "PT5M"
        : guide.id === 'add-liquidity' ? "PT10M"
        : guide.id === 'token-security' ? "PT7M"
        : "PT12M",
      ...(guide.cost ? {
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": guide.cost
        }
      } : {}),
      "tool": guide.id === 'create-base-token' ? [
        { "@type": "HowToTool", "name": "Web3 wallet (MetaMask, Rainbow, or WalletConnect-compatible)" },
        { "@type": "HowToTool", "name": "Web browser (Chrome, Firefox, Safari, or Brave)" }
      ] : guide.id === 'add-liquidity' ? [
        { "@type": "HowToTool", "name": "Web3 wallet with deployed ERC20 token" },
        { "@type": "HowToTool", "name": "EVMint Liquidity Management interface" }
      ] : guide.id === 'token-security' ? [
        { "@type": "HowToTool", "name": "Block explorer (Etherscan, Arbiscan, Polygonscan, etc.)" },
        { "@type": "HowToTool", "name": "Web3 wallet for contract interaction" }
      ] : [
        { "@type": "HowToTool", "name": "Web3 wallet (MetaMask or compatible)" },
        { "@type": "HowToTool", "name": "EVMint platform" }
      ],
      "supply": guide.id === 'create-base-token' ? [
        { "@type": "HowToSupply", "name": "Native tokens for gas fees (ETH, MATIC, BNB, AVAX, etc.)" },
        { "@type": "HowToSupply", "name": "Platform deployment fee ($75-100 USD equivalent)" }
      ] : guide.id === 'add-liquidity' ? [
        { "@type": "HowToSupply", "name": "Your deployed ERC20 tokens (10-20% of total supply recommended)" },
        { "@type": "HowToSupply", "name": "Native tokens for the trading pair (ETH, MATIC, BNB, etc.)" },
        { "@type": "HowToSupply", "name": "Gas fees for approval and liquidity transactions" }
      ] : [],
      "step": guide.steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": `${step.description}. ${step.details.map(d => typeof d === 'string' ? d : d.text).join('. ')}.`,
        "url": `https://evmint.io/guides/${guide.id}`
      })),
      "image": "https://evmint.io/og-image.png"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://evmint.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Guides",
          "item": "https://evmint.io/guides"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": guide.title,
          "item": `https://evmint.io/guides/${guide.id}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": guide.title,
      "description": guide.description,
      "url": `https://evmint.io/guides/${guide.id}`,
      "author": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io",
        "logo": {
          "@type": "ImageObject",
          "url": "https://evmint.io/og-image.png"
        }
      },
      "datePublished": "2025-01-01",
      "dateModified": "2026-02-01",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://evmint.io/guides/${guide.id}`
      },
      "articleSection": "Cryptocurrency Guides",
      "wordCount": guide.steps.reduce((total, step) =>
        total + step.details.reduce((stepTotal, d) =>
          stepTotal + (typeof d === 'string' ? d : d.text).split(' ').length, 0
        ), 0
      ) * 2
    }
  ] : undefined

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Guide Not Found
          </h1>
          <p className="text-gray-400 mb-8">The guide you're looking for doesn't exist.</p>
          <Link 
            to="/guides"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
          >
            Back to Guides
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <SEO
        title={`${guide.title} | Token Creation Guide`}
        description={guide.description}
        keywords={`erc20 token, ${guide.id}, tutorial, guide, blockchain, evm, how to, step by step`}
        canonical={`/guides/${guide.id}`}
        structuredData={guideStructuredData}
      />

      <div className="relative py-12">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          {/* Breadcrumb */}
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <nav className="text-sm text-gray-400">
              <Link to="/guides" className="hover:text-blue-400 transition-colors">Guides</Link>
              <span className="mx-2">→</span>
              <span className="text-white">{guide.title}</span>
            </nav>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                {guide.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {guide.description}
              </p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{guide.time} read</span>
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  <span>{guide.difficulty} level</span>
                </div>
                {guide.cost && (
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span>Cost: {guide.cost}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pool Types Comparison (if applicable) */}
          {guide.poolTypes && (
            <div className="max-w-4xl mx-auto px-4 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Pool Type Information</h2>
              <div className="grid md:grid-cols-1 gap-6">
                {guide.poolTypes.map((pool, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{pool.title}</h3>
                    <p className="text-gray-300 mb-4">{pool.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Pros:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {pool.pros.map((pro, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircleIcon className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Cons:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {pool.cons.map((con, i) => (
                            <li key={i} className="flex items-center">
                              <ExclamationTriangleIcon className="h-3 w-3 text-red-400 mr-2 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <span className="text-sm text-blue-400 font-medium">Best for: {pool.bestFor}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Important Warnings */}
          {guide.warnings && (
            <div className="max-w-4xl mx-auto px-4 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Important Considerations</h2>
              <div className="space-y-4">
                {guide.warnings.map((warning, index) => (
                  <motion.div
                    key={index}
                    className="bg-yellow-500/10 border-yellow-500/20 border rounded-xl p-6 backdrop-blur-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-6 w-6 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white mb-2">{warning.title}</h3>
                        <p className="text-gray-300">{warning.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Step-by-Step Guide</h2>
            {guide.steps.map((step, index) => (
              <motion.div
                key={index}
                className="mb-12"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-white/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                  {/* Step Header */}
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>

                  {/* Step Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Action items:</h3>
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-gray-300">
                              {typeof detail === 'string' ? (
                                <span>{detail}</span>
                              ) : (
                                <div>
                                  <span>{detail.text}</span>
                                  <br />
                                  <Link 
                                    to={detail.link.url}
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm mt-1 font-medium"
                                  >
                                    {detail.link.text}
                                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start">
                        <LightBulbIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">Pro Tip</h4>
                          <p className="text-gray-300 text-sm">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="max-w-4xl mx-auto px-4 mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
              <SparklesIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              {nextGuide ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-4">Continue Learning</h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Ready for the next step? Learn about {nextGuide.title.toLowerCase()}.
                  </p>
                  <Link 
                    to={`/guides/${nextGuide.id}`}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Next Guide
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    You've completed all our guides! Put your knowledge to work and create your token now.
                  </p>
                  <Link 
                    to="/create"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Create Your Token
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Guide Navigation */}
          <motion.div 
            className="max-w-4xl mx-auto px-4 mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <Link 
                  to="/guides"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-xl hover:border-white/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2 rotate-180" />
                  Back to All Guides
                </Link>
              </div>
              
              <div className="flex-1 flex justify-end">
                {nextGuide ? (
                  <Link 
                    to={`/guides/${nextGuide.id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    Next Guide
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                ) : (
                  <Link 
                    to="/create"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    Start Creating
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}