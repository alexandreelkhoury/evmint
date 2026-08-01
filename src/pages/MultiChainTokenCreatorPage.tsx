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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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
              <button className={`group relative px-12 py-5 ${colors.primaryButton} text-lg active:scale-[0.97]`}>
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
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-blue-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">15+ EVM Blockchains</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, Fantom, Gnosis, Moonbeam, Blast, Worldchain, and all major testnets from one platform.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-cyan-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ultra-Low Fees</h3>
              <p className="text-gray-300 leading-relaxed">
                Save 90% on gas fees by deploying on Layer 2 networks. Fixed ~$80 total fee (deployment + gas + verification). No hidden charges.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-green-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Deployment</h3>
              <p className="text-gray-300 leading-relaxed">
                Your token goes live in 5 seconds. No waiting, no complex setup. Just connect your wallet, fill the form, and deploy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-purple-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto-Verified</h3>
              <p className="text-gray-300 leading-relaxed">
                Automatic contract verification on Etherscan, Basescan, Arbiscan, Polygonscan, and all major block explorers. No manual steps needed.
              </p>
            </div>
          </motion.div>

          {/* What is Multi-Chain Token Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              What is a Multi-Chain Token?
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                A multi-chain token is a cryptocurrency that exists across multiple blockchain networks simultaneously.
                Instead of being limited to a single blockchain like Ethereum, multi-chain tokens can be deployed on
                various EVM-compatible networks such as Base, Arbitrum, Polygon, and BSC, expanding their reach and
                utility significantly.
              </p>
              <p>
                The EVM (Ethereum Virtual Machine) compatibility ensures that tokens deployed through EVMint work
                seamlessly across all supported networks. This means your ERC20 token will function identically
                whether it's on Ethereum mainnet or a Layer 2 solution like Optimism - same smart contract code,
                same security standards, same functionality.
              </p>
              <p>
                Multi-chain deployment has become essential in 2026's fragmented blockchain landscape. Users are
                distributed across numerous networks, and projects that limit themselves to a single chain miss out
                on significant market opportunities. With EVMint, you can reach users wherever they are.
              </p>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How Multi-Chain Token Creation Works
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-300">Connect MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet. EVMint supports all major wallets and automatically detects your connected network.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Select Your Target Chain</h3>
                  <p className="text-gray-300">Choose from 15+ supported EVM blockchains. Consider factors like gas costs, target audience, and ecosystem requirements when selecting your chain.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Configure Token Parameters</h3>
                  <p className="text-gray-300">Enter your token name, symbol, total supply, and decimals. These parameters define your token's identity and economics across all chains.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Deploy in 5 Seconds</h3>
                  <p className="text-gray-300">Click deploy, confirm the transaction in your wallet, and your token is live. EVMint handles compilation, deployment, and automatic contract verification.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Multi-Chain Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Benefits of Multi-Chain Deployment
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">+</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Maximum Reach & Flexibility</h4>
                  <p className="text-gray-300">Deploy on the chain that best fits your project's needs - whether it's Ethereum for credibility, Base for speed, or Polygon for cost-efficiency.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">+</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Cost Optimization</h4>
                  <p className="text-gray-300">Layer 2 networks offer 90% lower gas fees than Ethereum mainnet. Deploy your meme coin or DeFi token without breaking the bank.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">+</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">No Coding Required</h4>
                  <p className="text-gray-300">Simple form-based interface. Just enter your token name, symbol, and supply. Our platform handles all the smart contract deployment complexity.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-400 text-xl">+</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Production-Ready Tokens</h4>
                  <p className="text-gray-300">Built with audited OpenZeppelin contracts. Your token is secure, verified, and ready for DEX listing, liquidity pools, and real-world use.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Use Cases Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Multi-Chain Token Use Cases
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">DeFi Protocols</h4>
                <p className="text-gray-400 text-sm">Deploy governance and utility tokens across multiple chains to maximize liquidity and user access.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Gaming Economies</h4>
                <p className="text-gray-400 text-sm">Create in-game currencies that work seamlessly across different blockchain gaming ecosystems.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Community Tokens</h4>
                <p className="text-gray-400 text-sm">Launch tokens for DAOs, social clubs, and communities with presence on multiple networks.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Meme Coins</h4>
                <p className="text-gray-400 text-sm">Maximize viral potential by launching on low-fee chains while maintaining Ethereum credibility.</p>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              EVMint vs Traditional Token Creation
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                    <th className="text-center py-3 px-4 text-green-400">EVMint</th>
                    <th className="text-center py-3 px-4 text-gray-400">Traditional Development</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Deployment Time</td>
                    <td className="text-center py-3 px-4 text-green-400">5 seconds</td>
                    <td className="text-center py-3 px-4">Days to weeks</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Coding Required</td>
                    <td className="text-center py-3 px-4 text-green-400">None</td>
                    <td className="text-center py-3 px-4">Solidity expertise</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Development Cost</td>
                    <td className="text-center py-3 px-4 text-green-400">~$80</td>
                    <td className="text-center py-3 px-4">$5,000-50,000</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Multi-Chain Support</td>
                    <td className="text-center py-3 px-4 text-green-400">15+ chains built-in</td>
                    <td className="text-center py-3 px-4">Manual per chain</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Contract Verification</td>
                    <td className="text-center py-3 px-4 text-green-400">Automatic</td>
                    <td className="text-center py-3 px-4">Manual process</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Security Audits</td>
                    <td className="text-center py-3 px-4 text-green-400">OpenZeppelin included</td>
                    <td className="text-center py-3 px-4">Extra $10,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Can I deploy the same token on multiple chains?</h4>
                <p className="text-gray-400">Yes! You can deploy tokens with the same parameters on as many chains as you want. Each deployment creates an independent token contract on that specific chain.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Which chain should I choose for my token?</h4>
                <p className="text-gray-400">It depends on your goals. Base and Arbitrum offer low fees for new projects. Ethereum provides maximum credibility. Polygon is great for gaming tokens. Consider your target audience and transaction volume.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Are multi-chain tokens compatible with all wallets?</h4>
                <p className="text-gray-400">Yes, all EVMint tokens are standard ERC20 tokens, compatible with MetaMask, Trust Wallet, Coinbase Wallet, and any wallet that supports the respective chain.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How do I add liquidity after creating my token?</h4>
                <p className="text-gray-400">EVMint includes built-in liquidity tools. After deployment, you can add liquidity directly to Uniswap, SushiSwap, or other DEXs from our platform.</p>
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
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                Get Started - It's Free to Try →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
