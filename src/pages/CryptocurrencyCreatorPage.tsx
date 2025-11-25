import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { colors, typography } from '../styles/designSystem'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackButtonClick } from '../utils/analytics'

/**
 * SEO Landing Page: Cryptocurrency Creator
 * Targets keyword: "cryptocurrency creator"
 * Provides value proposition before directing to /create
 */
export default function CryptocurrencyCreatorPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'cryptocurrency_creator')
  }, [analytics])
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cryptocurrency Creator - Launch Your Own Crypto Token",
    "description": "Create your own cryptocurrency on Ethereum, Base, Arbitrum, Polygon & more. Deploy ERC20 tokens in 5 seconds. No coding required.",
    "url": "https://evmint.io/cryptocurrency-creator",
    "applicationCategory": "FinanceApplication"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      <SEO
        title="Cryptocurrency Creator - Launch Your Own Crypto Token in 5 Seconds | EVMint"
        description="Create your own cryptocurrency token instantly! Deploy on Ethereum, Base, Arbitrum, Polygon, BSC & more. No coding required. Ultra-low fees on L2. Add liquidity on Uniswap. Start your crypto project today!"
        keywords="cryptocurrency creator, create cryptocurrency, crypto token maker, launch crypto token, make your own cryptocurrency, crypto coin creator, digital currency maker, blockchain token generator, defi token creator"
        canonical="/cryptocurrency-creator"
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
            <div className="inline-block px-6 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <span className="text-cyan-400 text-sm font-semibold">Cryptocurrency Creator</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${typography.pageTitle} mb-6`}
          >
            Create Your Own Cryptocurrency
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              No Coding Required
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${typography.subtitle} mb-12 max-w-3xl mx-auto`}
          >
            Launch your own cryptocurrency on 15+ EVM blockchains in just 5 seconds. Perfect for DeFi projects, gaming tokens, utility coins, and more. Built with OpenZeppelin security standards.
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_primary_cryptocurrency', 'hero_section')}>
              <button className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl font-bold text-lg text-white shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  🚀 Create Your Cryptocurrency Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <p className="text-gray-400 text-sm mt-4">Production-ready • OpenZeppelin secured • Deploy in 5 seconds</p>
          </motion.div>

          {/* Use Cases Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-cyan-500/30 transition-all`}>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gaming Tokens</h3>
              <p className="text-gray-300 leading-relaxed">
                Create in-game currencies for your blockchain game. Use for purchases, rewards, staking, and building your gaming economy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-blue-500/30 transition-all`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏦</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">DeFi Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Launch governance tokens, staking rewards, or liquidity mining tokens for your DeFi protocol. Full ERC20 compatibility.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-purple-500/30 transition-all`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reward Programs</h3>
              <p className="text-gray-300 leading-relaxed">
                Create loyalty tokens for your business. Reward customers, incentivize engagement, and build a token-based economy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-pink-500/30 transition-all`}>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">DAO Governance</h3>
              <p className="text-gray-300 leading-relaxed">
                Issue governance tokens for your DAO. Enable decentralized voting, proposal creation, and community-driven decision making.
              </p>
            </div>
          </motion.div>

          {/* How to Create Your Cryptocurrency */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How to Create Your Own Cryptocurrency
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Choose Your Blockchain</h4>
                  <p className="text-gray-300">Select from 15+ EVM-compatible chains. Ethereum for credibility, Base for speed, Polygon for low fees. Each chain has its own benefits.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Set Token Parameters</h4>
                  <p className="text-gray-300">Define your token name, symbol, total supply, and decimals. Simple form interface - no blockchain knowledge needed.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Deploy in 5 Seconds</h4>
                  <p className="text-gray-300">Connect your wallet and click deploy. Your cryptocurrency is instantly live on-chain, verified on block explorers, and ready to use.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Add Liquidity (Optional)</h4>
                  <p className="text-gray-300">Make your token tradeable by adding liquidity on Uniswap or other DEXs. Our platform makes this easy with built-in liquidity tools.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Build Your Community</h4>
                  <p className="text-gray-300">Share your token on social media, create Telegram/Discord communities, and grow your project. Track on DEXScreener and CoinGecko.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Why Choose Our Cryptocurrency Creator?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">OpenZeppelin Security</h4>
                    <p className="text-gray-300 text-sm">Built with audited OpenZeppelin contracts - the gold standard for token security trusted by major projects.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">No Coding Required</h4>
                    <p className="text-gray-300 text-sm">Simple web interface. If you can fill out a form, you can create a cryptocurrency. No Solidity knowledge needed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">15+ EVM Blockchains</h4>
                    <p className="text-gray-300 text-sm">Deploy on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, Fantom, Gnosis, and more.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Instant Verification</h4>
                    <p className="text-gray-300 text-sm">Automatic contract verification on all block explorers. Your token is instantly visible and trustworthy.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Ultra-Low Fees</h4>
                    <p className="text-gray-300 text-sm">$75-100 platform fee + minimal gas costs. Deploy on L2 networks to save 90% on transaction fees.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Production-Ready</h4>
                    <p className="text-gray-300 text-sm">Compatible with all wallets, exchanges, and DeFi protocols. Ready for real-world use from day one.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Full Ownership</h4>
                    <p className="text-gray-300 text-sm">You own 100% of your token supply. No lock-ups, no hidden fees, complete control over your cryptocurrency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Built-in Liquidity Tools</h4>
                    <p className="text-gray-300 text-sm">Add liquidity on Uniswap directly from our platform. Make your token tradeable in minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-12"
          >
            <p className="text-cyan-200">
              🔒 <strong>Security First:</strong> All tokens are created using audited OpenZeppelin smart contracts,
              the industry standard trusted by Coinbase, Aave, Compound, and thousands of other projects. Your cryptocurrency is production-ready from day one.
            </p>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_secondary_cryptocurrency', 'bottom_section')}>
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Start Creating Your Cryptocurrency →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
