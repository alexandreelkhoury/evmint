import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { colors, typography } from '../styles/designSystem'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackButtonClick } from '../utils/analytics'

/**
 * SEO Landing Page: ERC20 Token Generator
 * Targets keyword: "erc20 token generator"
 * Provides value proposition before directing to /create
 */
export default function ERC20TokenGeneratorPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'erc20_token_generator')
  }, [analytics])
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ERC20 Token Generator - Create Custom Tokens Instantly",
    "description": "Generate ERC20 tokens with custom name, symbol, supply, and decimals. Deploy on any EVM blockchain. No coding skills required.",
    "url": "https://evmint.io/erc20-token-generator",
    "applicationCategory": "FinanceApplication"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      <SEO
        title="ERC20 Token Generator - Create Custom ERC20 Tokens in 5 Seconds | EVMint"
        description="Generate ERC20 tokens with custom parameters. Deploy on Ethereum, Base, Arbitrum, Polygon & more. No coding needed. Automatic verification. Start creating your ERC20 token now!"
        keywords="erc20 token generator, create erc20 token, erc20 maker, ethereum token generator, custom erc20, token factory, erc20 deployment"
        canonical="/erc20-token-generator"
        structuredData={structuredData}
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-block px-6 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <span className="text-purple-400 text-sm font-semibold">ERC20 Token Generator</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${typography.pageTitle} mb-6`}
          >
            Generate Professional ERC20 Tokens
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              In Just 5 Seconds
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${typography.subtitle} mb-12 max-w-3xl mx-auto`}
          >
            The easiest ERC20 token generator. Create custom tokens with your own name, symbol, supply, and decimals. Built with OpenZeppelin security standards for production-ready deployment.
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_primary_erc20', 'hero_section')}>
              <button className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl font-bold text-lg text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  ⚡ Generate Your ERC20 Token Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <p className="text-gray-400 text-sm mt-4">No coding required • OpenZeppelin secured</p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-purple-500/30 transition-all`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fully Customizable</h3>
              <p className="text-gray-300 leading-relaxed">
                Set your token name, symbol, total supply, and decimals. Full control over your ERC20 token parameters - no limitations.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-pink-500/30 transition-all`}>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">OpenZeppelin Security</h3>
              <p className="text-gray-300 leading-relaxed">
                Built with audited OpenZeppelin ERC20 contracts - the industry standard trusted by top crypto projects worldwide.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-red-500/30 transition-all`}>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Any EVM Blockchain</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, or any EVM-compatible chain. You choose.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-orange-500/30 transition-all`}>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto-Verified</h3>
              <p className="text-gray-300 leading-relaxed">
                Automatic contract verification on block explorers. Your token is instantly visible and trustworthy on Etherscan, Basescan, etc.
              </p>
            </div>
          </motion.div>

          {/* ERC20 Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              What You Can Customize
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Token Name</h4>
                    <p className="text-gray-300 text-sm">Full name of your token (e.g., "My Awesome Token")</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Token Symbol</h4>
                    <p className="text-gray-300 text-sm">Ticker symbol (e.g., "MAT") - 3-5 characters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Total Supply</h4>
                    <p className="text-gray-300 text-sm">How many tokens to create (from 1 to unlimited)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Decimals</h4>
                    <p className="text-gray-300 text-sm">Precision level (default 18, like ETH)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Blockchain</h4>
                    <p className="text-gray-300 text-sm">Choose from 15+ EVM networks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Ownership</h4>
                    <p className="text-gray-300 text-sm">You own 100% of the supply - full control</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Why Use Our ERC20 Generator?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">🚀</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Launch in 5 Seconds</h4>
                  <p className="text-gray-300">No complex setup, no waiting. Connect your wallet, fill the form, and your ERC20 token is live.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">💼</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Production-Ready</h4>
                  <p className="text-gray-300">Built with audited OpenZeppelin contracts. Compatible with all wallets, exchanges, and DeFi protocols.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">No Coding Required</h4>
                  <p className="text-gray-300">Simple form interface. If you can fill out a web form, you can create an ERC20 token.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">💰</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Affordable & Transparent</h4>
                  <p className="text-gray-300">$75-100 platform fee + minimal gas costs. No hidden charges. Deploy on L2 networks to save 90% on gas.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_secondary_erc20', 'bottom_section')}>
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Start Generating Your ERC20 Token →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
