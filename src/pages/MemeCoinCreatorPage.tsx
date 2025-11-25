import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { colors, typography } from '../styles/designSystem'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackButtonClick } from '../utils/analytics'

/**
 * SEO Landing Page: Meme Coin Creator
 * Targets keyword: "meme coin creator"
 * Provides value proposition before directing to /create
 */
export default function MemeCoinCreatorPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'meme_coin_creator')
  }, [analytics])
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Meme Coin Creator - Launch Your Meme Token in 5 Seconds",
    "description": "Create and launch your own meme coin on Base, Ethereum, Polygon & more. No coding required. Add liquidity and grow your community.",
    "url": "https://evmint.io/meme-coin-creator",
    "applicationCategory": "FinanceApplication"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      <SEO
        title="Meme Coin Creator - Launch Your Meme Token in 5 Seconds | EVMint"
        description="Create your own meme coin on Ethereum, Base, Arbitrum, Polygon & more. Deploy in 5 seconds. No coding. Ultra-low fees on L2. Add liquidity on Uniswap. Start your meme coin empire!"
        keywords="meme coin creator, create meme coin, meme token maker, launch meme coin, doge coin creator, shiba inu maker, pepe token creator, viral crypto"
        canonical="/meme-coin-creator"
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
            <div className="inline-block px-6 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <span className="text-green-400 text-sm font-semibold">Meme Coin Creator</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${typography.pageTitle} mb-6`}
          >
            Launch Your Viral Meme Coin
            <br />
            <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              To The Moon!
            </span>{' '}
            <span className="inline-block">🚀🌕</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${typography.subtitle} mb-12 max-w-3xl mx-auto`}
          >
            The ultimate meme coin launcher. Create your DOGE, SHIB, or PEPE successor in 5 seconds. Deploy on Base, Ethereum, or any EVM chain. Add liquidity, build your community, and go viral!
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_primary_meme_coin', 'hero_section')}>
              <button className="group relative px-12 py-5 bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 rounded-xl font-bold text-lg text-white shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-3">
                  🚀 Create Your Meme Coin Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <p className="text-gray-400 text-sm mt-4">Deploy in 5 seconds • No coding • Add liquidity instantly</p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-green-500/30 transition-all`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">5-Second Launch</h3>
              <p className="text-gray-300 leading-relaxed">
                Launch your meme coin faster than you can say "to the moon!" No technical skills needed. Just connect wallet and deploy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-yellow-500/30 transition-all`}>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra-Low Fees</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy on Layer 2 networks for pennies. Perfect for meme projects. $75-100 platform fee + minimal gas. No hidden costs.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-orange-500/30 transition-all`}>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🦄</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Add Liquidity on Uniswap</h3>
              <p className="text-gray-300 leading-relaxed">
                Make your meme coin tradeable instantly. Add liquidity on Uniswap directly from our platform. Get listed on DEX aggregators.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-red-500/30 transition-all`}>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Build Your Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Share on Twitter, Telegram, and Discord. Built-in social sharing tools. Track your token on DEXScreener and CoinGecko.
              </p>
            </div>
          </motion.div>

          {/* Meme Coin Success Guide */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How to Launch a Successful Meme Coin 📈
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Create a Catchy Name & Meme</h4>
                  <p className="text-gray-300">Think DOGE, SHIB, PEPE. Your name and visual identity are everything. Make it memorable, funny, and shareable.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Launch Your Token in 5 Seconds</h4>
                  <p className="text-gray-300">Use our platform to deploy your meme coin instantly. Choose Base for speed, Ethereum for credibility, or Polygon for low fees.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Add Liquidity on Uniswap</h4>
                  <p className="text-gray-300">Make your token tradeable. Add a liquidity pool (e.g., 1 ETH + tokens) so people can buy on DEXs. Lock liquidity for trust.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Build Community & Go Viral</h4>
                  <p className="text-gray-300">Share on Twitter, create Telegram/Discord groups, post memes. Engage with your holders. The best meme coins have the strongest communities.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Get Listed & Scale</h4>
                  <p className="text-gray-300">Submit to DEXScreener, CoinGecko, CoinMarketCap. Apply to CEXs. Keep your community engaged with contests, giveaways, and partnerships.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12 bg-gradient-to-br from-green-500/5 via-yellow-500/5 to-orange-500/5 border-green-500/20`}>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Why Create a Meme Coin? 🤔
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Build a Movement</h4>
                  <p className="text-gray-300">Meme coins aren't just tokens - they're communities. Rally people around a shared joke, cause, or vision.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">💸</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Viral Potential</h4>
                  <p className="text-gray-300">DOGE started as a joke. SHIB made millionaires. PEPE reached $1B market cap. Your meme coin could be next.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🌟</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Low Barrier to Entry</h4>
                  <p className="text-gray-300">No coding required. Deploy in 5 seconds. Ultra-low fees on L2. Anyone can launch a meme coin empire.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🔥</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Marketing Tools Built-In</h4>
                  <p className="text-gray-300">Share on Twitter with one click. Add liquidity on Uniswap. Track on DEXScreener. Everything you need to go viral.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pro Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-12"
          >
            <p className="text-yellow-200">
              💡 <strong>Pro Tip:</strong> Successful meme coins focus on community building, viral marketing, and transparent liquidity.
              Use our built-in tools to add liquidity and share your token on social media. Remember: diamond hands 💎🙌
            </p>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_secondary_meme_coin', 'bottom_section')}>
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Launch Your Meme Coin Empire →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
