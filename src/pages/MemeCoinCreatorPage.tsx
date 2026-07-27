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
              <button className={`group relative px-12 py-5 ${colors.primaryButton} text-lg active:scale-[0.97]`}>
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
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-green-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">5-Second Launch</h3>
              <p className="text-gray-300 leading-relaxed">
                Launch your meme coin faster than you can say "to the moon!" No technical skills needed. Just connect wallet and deploy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-yellow-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra-Low Fees</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy on Layer 2 networks for pennies. Perfect for meme projects. $75-100 platform fee + minimal gas. No hidden costs.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-orange-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🦄</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Add Liquidity on Uniswap</h3>
              <p className="text-gray-300 leading-relaxed">
                Make your meme coin tradeable instantly. Add liquidity on Uniswap directly from our platform. Get listed on DEX aggregators.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-red-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
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

          {/* History of Meme Coins */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              The Rise of Meme Coins: From Joke to Billions
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Meme coins have transformed from internet jokes into a serious force in cryptocurrency. What started with Dogecoin in 2013 - created as a parody of Bitcoin featuring the popular Shiba Inu dog meme - has evolved into a multi-billion dollar market segment that has created fortunes for early believers.
              </p>
              <p>
                The meme coin phenomenon demonstrates a fundamental truth about value: it is driven by community belief, viral adoption, and cultural relevance. Unlike traditional cryptocurrencies that derive value from utility or technology, meme coins derive value from collective enthusiasm, social media presence, and the power of shared humor.
              </p>
              <p>
                Dogecoin reached a market cap of over $80 billion in 2021, propelled by tweets from Elon Musk and a devoted community. Shiba Inu followed, creating thousands of millionaires among early holders. PEPE, launched in 2023, reached a $1 billion market cap within weeks. These success stories have inspired a new generation of creators to launch their own meme tokens.
              </p>
              <p>
                Today, meme coins represent a legitimate path to building communities, launching viral projects, and participating in crypto culture. With platforms like EVMint making token creation accessible to everyone, the barrier to entry has never been lower for aspiring meme coin creators.
              </p>
            </div>
          </motion.div>

          {/* Best Chains for Meme Coins */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Best Blockchains for Meme Coins
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Base (Recommended)</h4>
                <p className="text-gray-300 text-sm mb-2">Backed by Coinbase with access to 100M+ users. Ultra-low fees under $0.01, fast 2-second blocks, and a growing meme coin ecosystem.</p>
                <span className="text-blue-400 text-xs">Best for: New meme coins, viral launches</span>
              </div>
              <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Arbitrum</h4>
                <p className="text-gray-300 text-sm mb-2">Largest Layer 2 by total value locked. Established DeFi ecosystem, serious trading community, and proven infrastructure.</p>
                <span className="text-blue-400 text-xs">Best for: DeFi integration, established communities</span>
              </div>
              <div className="p-5 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Ethereum</h4>
                <p className="text-gray-300 text-sm mb-2">Maximum credibility and deepest liquidity. Higher fees but unmatched visibility and integration with major platforms.</p>
                <span className="text-gray-400 text-xs">Best for: Established projects seeking legitimacy</span>
              </div>
              <div className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Polygon</h4>
                <p className="text-gray-300 text-sm mb-2">Sub-cent transaction fees with massive adoption. Strong gaming and NFT ecosystem that complements meme culture.</p>
                <span className="text-purple-400 text-xs">Best for: High-volume, gaming-adjacent memes</span>
              </div>
            </div>
          </motion.div>

          {/* Common Mistakes to Avoid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Common Meme Coin Mistakes to Avoid
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-400 text-xl">X</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Not Locking Liquidity</h4>
                  <p className="text-gray-300">Lock your LP tokens for at least 6 months. Unlocked liquidity signals potential rug pull and destroys community trust.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-400 text-xl">X</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Insufficient Initial Liquidity</h4>
                  <p className="text-gray-300">Starting with $500 liquidity creates massive price impact and poor trading experience. Aim for at least $5,000-10,000 to start.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-400 text-xl">X</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Abandoning After Launch</h4>
                  <p className="text-gray-300">Successful meme coins require consistent engagement, content creation, and community interaction. Launch is just the beginning.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-red-400 text-xl">X</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Complex or Confusing Tokenomics</h4>
                  <p className="text-gray-300">Keep it simple. Complicated tax mechanisms, reflections, and burns confuse users. Simple ERC20 with fixed supply works best for meme coins.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Meme Coin Creator FAQ
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">How much does it cost to create a meme coin?</h4>
                <p className="text-gray-400">With EVMint, the platform fee is $75-100 plus minimal gas costs. On Layer 2 networks like Base, total cost can be under $80. Compare this to $5,000-20,000 for custom development.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">What makes a meme coin successful?</h4>
                <p className="text-gray-400">Community engagement, viral marketing, authentic humor, transparency, and consistent effort. The best meme coins have passionate communities that create content and spread the word organically.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How do I get my meme coin listed on CoinGecko?</h4>
                <p className="text-gray-400">After launching and adding liquidity, submit your token to CoinGecko's listing form. You'll need: verified contract, active trading, social media presence, and accurate information.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Should I use a ridiculous supply like 1 trillion tokens?</h4>
                <p className="text-gray-400">Large supplies (billions or trillions) create psychological affordability - people like owning millions of tokens. Just ensure your marketing communicates value in terms of market cap, not individual token price.</p>
              </div>
            </div>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_secondary_meme_coin', 'bottom_section')}>
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                Launch Your Meme Coin Empire →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
