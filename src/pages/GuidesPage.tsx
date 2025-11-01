import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
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
    transition: { duration: 0.5, ease: "easeOut" }
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
      title: "How to Create Base Token: No Code, 4 Steps [2025]",
      description: "Complete beginner's guide to creating your own ERC20 token on Base blockchain using our launcher - no coding required!",
      difficulty: "Beginner",
      time: "5 minutes",
      icon: SparklesIcon,
      path: "/guides/create-base-token",
      keywords: "create base token, ERC20 token, no code token creation"
    },
    {
      id: "add-liquidity",
      title: "How to Add Liquidity to Your Base Token [2025 Guide]",
      description: "Step-by-step tutorial on adding liquidity to Uniswap V2 pools using our built-in liquidity tools.",
      difficulty: "Intermediate", 
      time: "10 minutes",
      icon: CurrencyDollarIcon,
      path: "/guides/add-liquidity",
      keywords: "add liquidity, Uniswap, DEX, token trading"
    },
    {
      id: "token-security",
      title: "Token Security Best Practices for Base",
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

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Base Token Creation Guides",
    "description": "Comprehensive guides for creating, managing, and optimizing Base tokens",
    "url": "https://base-token-launcher.web.app/guides",
    "mainEntity": {
      "@type": "HowTo",
      "name": "How to Create Base Token",
      "description": "Step-by-step tutorial to create your own Base ERC20 token without coding",
      "totalTime": "PT5M"
    }
  }

  return (
    <>
      <SEO 
        title="Base Token Creation Guides & Tutorials [2025]"
        description="Learn how to create, manage, and optimize your Base tokens. Step-by-step tutorials for beginners to advanced users."
        keywords="base token creation, ERC20 token guide, how to create base token, token launcher tutorial, base blockchain"
        canonical="/guides"
        structuredData={schemaData}
      />
      <motion.div
        className="min-h-screen bg-gray-900 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
      {/* SEO Header */}
      <div className="text-center mb-16 px-4">
        <motion.h1 
          className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-violet-500 to-purple-600 text-transparent bg-clip-text mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Base Token Creation Guides
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Learn how to create, manage, and optimize your Base tokens with our Token Launcher. 
          Step-by-step tutorials for beginners to advanced users.
        </motion.p>
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={guide.path}>
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105 group h-full">
                    
                    {/* Icon and Difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-violet-500/30 transition-all duration-300">
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
                    <div className="flex items-center justify-between text-sm text-gray-500">
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
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Create Your Token?</h2>
            <p className="text-gray-300 mb-6">Use our Token Launcher to create your Base token in minutes - no coding required!</p>
            <Link 
              to="/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105"
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