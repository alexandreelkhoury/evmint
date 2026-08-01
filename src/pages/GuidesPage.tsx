import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
import StandardPageHeader from '../components/StandardPageHeader'
import {
  BookOpenIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

// Modern animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  hover: { 
    y: -8, 
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

export default function GuidesPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'guides')
  }, [analytics])

  const guides = [
    {
      id: "create-base-token",
      title: "How to Create ERC20 Token: No Code, 4 Steps [2025]",
      description: "Complete beginner's guide to creating your own ERC20 token on any EVM blockchain using our launcher - no coding required!",
      difficulty: "Beginner",
      time: "5 minutes",
      icon: SparklesIcon,
      path: "/guides/create-base-token",
      keywords: "create erc20 token, ERC20 token, no code token creation, evm"
    },
    {
      id: "add-liquidity",
      title: "How to Add Liquidity to Your Token [2025 Guide]",
      description: "Step-by-step tutorial on adding liquidity to DEX pools using our built-in liquidity tools.",
      difficulty: "Intermediate",
      time: "10 minutes",
      icon: CurrencyDollarIcon,
      path: "/guides/add-liquidity",
      keywords: "add liquidity, DEX, token trading, uniswap"
    },
    {
      id: "token-security",
      title: "Token Security Best Practices",
      description: "Learn how to secure your token deployment, verify contracts, and protect against common vulnerabilities.",
      difficulty: "Intermediate",
      time: "7 minutes",
      icon: ShieldCheckIcon,
      path: "/guides/token-security",
      keywords: "token security, contract verification, best practices"
    },
    {
      id: "advanced-features",
      title: "Advanced Token Features and Management",
      description: "Explore advanced token features like fee collection, upgradeable contracts, and multi-signature security.",
      difficulty: "Advanced",
      time: "12 minutes",
      icon: BoltIcon,
      path: "/guides/advanced-features",
      keywords: "advanced tokens, upgradeable contracts, multi-sig"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'Advanced': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const schemaData: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "ERC20 Token Creation Guides & Tutorials",
      "description": "Comprehensive guides for creating, managing, and optimizing ERC20 tokens on 15+ EVM blockchains. From beginner to advanced tutorials.",
      "url": "https://evmint.io/guides",
      "publisher": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": guides.length,
        "itemListElement": guides.map((guide, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": guide.title,
          "url": `https://evmint.io${guide.path}`
        }))
      }
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
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Create an ERC20 Token Without Coding",
      "description": "Complete beginner's guide to creating your own ERC20 token on any EVM blockchain using EVMint's no-code token launcher. Deploy in under 5 minutes.",
      "totalTime": "PT5M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "75-100"
      },
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Web3 wallet (MetaMask, Rainbow, or WalletConnect-compatible)"
        },
        {
          "@type": "HowToTool",
          "name": "Web browser with wallet extension"
        }
      ],
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Native tokens for gas fees (ETH, MATIC, BNB, AVAX, etc.)"
        },
        {
          "@type": "HowToSupply",
          "name": "Platform deployment fee ($75-100 USD equivalent in native tokens)"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Connect Your Wallet",
          "text": "Click 'Connect Wallet' in the navigation, choose your preferred wallet provider (MetaMask, Rainbow, WalletConnect), select your blockchain network, and ensure you have native tokens for gas fees.",
          "url": "https://evmint.io/guides/create-base-token"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Enter Token Details",
          "text": "Enter your token name, set the token symbol (keep it short), choose total supply (default 1 billion), and set decimals (18 is standard).",
          "url": "https://evmint.io/guides/create-base-token"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Review and Deploy",
          "text": "Review all token parameters, check the deployment fee ($75-100 USD), click 'Create Token' to start deployment, and approve the transaction in your wallet.",
          "url": "https://evmint.io/guides/create-base-token"
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Verify and Manage",
          "text": "Your contract is automatically verified on the block explorer. Your token appears in 'My Tokens' section. Share your token address and consider adding liquidity to make it tradeable.",
          "url": "https://evmint.io/guides/create-base-token"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Add Liquidity to Your ERC20 Token on DEX",
      "description": "Step-by-step tutorial on adding liquidity to decentralized exchange pools using EVMint's built-in liquidity tools. Make your token tradeable on Uniswap, SushiSwap, and more.",
      "totalTime": "PT10M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "Varies"
      },
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Web3 wallet with your deployed token"
        },
        {
          "@type": "HowToTool",
          "name": "EVMint Liquidity Management interface"
        }
      ],
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Your ERC20 tokens (recommended 10-20% of supply)"
        },
        {
          "@type": "HowToSupply",
          "name": "Native tokens for the trading pair (ETH, MATIC, BNB, etc.)"
        },
        {
          "@type": "HowToSupply",
          "name": "Gas fees for approval and liquidity transactions"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Navigate to Liquidity Section",
          "text": "Go to the 'Liquidity' page, connect your wallet, ensure you have both your token and native tokens, and select your token from the dropdown.",
          "url": "https://evmint.io/guides/add-liquidity"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Set Token Amounts",
          "text": "Enter the amount of tokens to add (e.g., 100,000), enter corresponding native token amount which determines initial price, and review the calculated price per token.",
          "url": "https://evmint.io/guides/add-liquidity"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Approve and Add Liquidity",
          "text": "Click 'Approve Token' to allow the DEX contract to access your tokens, wait for confirmation, then click 'Add Liquidity' and confirm in your wallet.",
          "url": "https://evmint.io/guides/add-liquidity"
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Manage Your Liquidity Position",
          "text": "Your LP tokens represent your pool share. Monitor your position, add more liquidity or remove it anytime, and use LP tokens for farming opportunities.",
          "url": "https://evmint.io/guides/add-liquidity"
        }
      ]
    }
  ]

  return (
    <>
      <SEO
        title="ERC20 Token Creation Guides & Tutorials [2025]"
        description="Learn how to create, manage, and optimize your ERC20 tokens on any EVM blockchain. Step-by-step tutorials for beginners to advanced users."
        keywords="erc20 token creation, ERC20 token guide, how to create token, token launcher tutorial, evm blockchain"
        canonical="/guides"
        structuredData={schemaData}
      />
      <motion.div
        className="bg-gray-900 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
      {/* SEO Header */}
      <div className="px-4">
        <StandardPageHeader
          badgeIcon=""
          badgeText="Learning Center"
          badgeColors="from-cyan-500/10 to-purple-500/10 border-cyan-500/20"
          titleGradient="Token Creation"
          titleWhite="Guides"
          subtitle="Learn how to create, manage, and optimize your ERC20 tokens on any EVM blockchain with our Token Launcher. Step-by-step tutorials for beginners to advanced users."
          stats={[
            { value: guides.length, label: 'Guides', color: 'blue' },
            { value: 'Step by Step', label: 'Tutorials', color: 'purple' },
            { value: 'Free', label: 'Access', color: 'cyan' }
          ]}
        />
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => {
            const IconComponent = guide.icon;
            return (
              <motion.div
                key={guide.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
              >
                <Link to={guide.path} className="cursor-pointer">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 hover:transform hover:scale-105 group h-full">
                    
                    {/* Icon and Difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-violet-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                        <IconComponent className="h-6 w-6 text-cyan-400" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                      {guide.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {guide.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {guide.time}
                      </span>
                      <span className="text-cyan-400 group-hover:text-cyan-300 font-medium">
                        Read Guide →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Create Your Token?</h2>
            <p className="text-gray-300 mb-6">Use our Token Launcher to create your ERC20 token on any EVM chain in minutes - no coding required!</p>
            <Link 
              to="/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Start Creating Now
            </Link>
          </div>
        </motion.div>
      </div>
      </motion.div>
    </>
  )
}