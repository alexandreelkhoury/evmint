import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { colors, typography } from '../styles/designSystem'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackButtonClick } from '../utils/analytics'

/**
 * SEO Landing Page: Multi-Chain Token Creator
 * Targets keyword: "multi-chain token creator"
 * Provides value proposition before directing to /create
 */
export default function MultiChainTokenCreatorPage() {
  const analytics = useFirebaseAnalytics()

  // Track page view on mount
  useEffect(() => {
    trackPageView(analytics, 'multi_chain_token_creator')
  }, [analytics])

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Multi-Chain Token Creator - Deploy ERC20 on 15+ Blockchains",
    "description": "Create and deploy ERC20 tokens on Ethereum, Base, Arbitrum, Polygon, BSC, Avalanche, and 10+ more EVM chains. No coding required.",
    "url": "https://evmint.io/multi-chain-token-creator",
    "applicationCategory": "FinanceApplication"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      <SEO
        title="Multi-Chain Token Creator - Deploy ERC20 on 15+ EVM Blockchains | EVMint"
        description="Create ERC20 tokens on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche & more. Multi-chain token deployment in 5 seconds. No coding required. Ultra-low fees."
        keywords="multi-chain token creator, multi chain token, erc20 multi-chain, deploy multiple blockchains, cross-chain token, ethereum base arbitrum polygon, multi network token"
        canonical="/multi-chain-token-creator"
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
            <div className="inline-block px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="text-blue-400 text-sm font-semibold">Multi-Chain Token Creator</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${typography.pageTitle} mb-6`}
          >
            Deploy on 15+ Blockchains
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              With One Click
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${typography.subtitle} mb-12 max-w-3xl mx-auto`}
          >
            The ultimate multi-chain token launcher. Deploy your ERC20 token on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, and 10+ more chains in just 5 seconds.
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_primary_multi_chain', 'hero_section')}>
              <button className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-xl font-bold text-lg text-white shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  🚀 Create Your Multi-Chain Token Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <p className="text-gray-400 text-sm mt-4">No credit card required • Deploy in 5 seconds</p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-blue-500/30 transition-all`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">15+ EVM Blockchains</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, Fantom, Gnosis, Moonbeam, Blast, Worldchain, and all major testnets from one platform.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-cyan-500/30 transition-all`}>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra-Low Fees</h3>
              <p className="text-gray-300 leading-relaxed">
                Save 90% on gas fees by deploying on Layer 2 networks. Fixed $75-100 platform fee + minimal gas costs. No hidden charges.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-green-500/30 transition-all`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Deployment</h3>
              <p className="text-gray-300 leading-relaxed">
                Your token goes live in 5 seconds. No waiting, no complex setup. Just connect your wallet, fill the form, and deploy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-purple-500/30 transition-all`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto-Verified</h3>
              <p className="text-gray-300 leading-relaxed">
                Automatic contract verification on Etherscan, Basescan, Arbiscan, Polygonscan, and all major block explorers. No manual steps needed.
              </p>
            </div>
          </motion.div>

          {/* Why Choose Multi-Chain Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Why Choose Multi-Chain Deployment?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Maximum Reach & Flexibility</h4>
                  <p className="text-gray-300">Deploy on the chain that best fits your project's needs - whether it's Ethereum for credibility, Base for speed, or Polygon for cost-efficiency.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Cost Optimization</h4>
                  <p className="text-gray-300">Layer 2 networks offer 90% lower gas fees than Ethereum mainnet. Deploy your meme coin or DeFi token without breaking the bank.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">No Coding Required</h4>
                  <p className="text-gray-300">Simple form-based interface. Just enter your token name, symbol, and supply. Our platform handles all the smart contract deployment complexity.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Production-Ready Tokens</h4>
                  <p className="text-gray-300">Built with audited OpenZeppelin contracts. Your token is secure, verified, and ready for DEX listing, liquidity pools, and real-world use.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_secondary_multi_chain', 'bottom_section')}>
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Get Started - It's Free to Try →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
