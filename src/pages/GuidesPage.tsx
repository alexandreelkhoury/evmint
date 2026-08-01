import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
import StandardPageHeader from '../components/StandardPageHeader'
import { guides, guidesById, getGuidePath, buildGuideHowTo } from '../data/guidesData'
import {
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function GuidesPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'guides')
  }, [analytics])

  // The two guides that also carry their full HowTo markup on this index page
  const featuredHowToGuides = ['create-base-token', 'add-liquidity']
    .map(id => guidesById[id])
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide))

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
          "url": `https://evmint.io${getGuidePath(guide)}`
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
    // Full HowTo markup for the two step-by-step guides, generated from the
    // same data the guide pages render
    ...featuredHowToGuides.map(buildGuideHowTo)
  ]

  return (
    <>
      <SEO
        title="ERC20 Token Creation Guides & Tutorials [2026]"
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
                <Link to={getGuidePath(guide)} className="cursor-pointer">
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