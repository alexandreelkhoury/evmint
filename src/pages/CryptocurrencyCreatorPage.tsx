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
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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
            transition={{ duration: 0.25, delay: 0.035 }}
            className="mb-8"
          >
            <div className="inline-block px-6 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <span className="text-cyan-400 text-sm font-semibold">Cryptocurrency Creator</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.052 }}
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
            transition={{ duration: 0.25, delay: 0.07 }}
            className={`${typography.subtitle} mb-12 max-w-3xl mx-auto`}
          >
            Launch your own cryptocurrency on 15+ EVM blockchains in just 5 seconds. Perfect for DeFi projects, gaming tokens, utility coins, and more. Built with OpenZeppelin security standards.
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.087 }}
            className="mb-16"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_primary_cryptocurrency', 'hero_section')}>
              <button className={`group relative px-12 py-5 ${colors.primaryButton} text-lg active:scale-[0.97]`}>
                <span className="relative z-10 flex items-center gap-3">
                  Create Your Cryptocurrency Now
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
            transition={{ duration: 0.25, delay: 0.104 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-cyan-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gaming Tokens</h3>
              <p className="text-gray-300 leading-relaxed">
                Create in-game currencies for your blockchain game. Use for purchases, rewards, staking, and building your gaming economy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-blue-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">DeFi Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Launch governance tokens, staking rewards, or liquidity mining tokens for your DeFi protocol. Full ERC20 compatibility.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-purple-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reward Programs</h3>
              <p className="text-gray-300 leading-relaxed">
                Create loyalty tokens for your business. Reward customers, incentivize engagement, and build a token-based economy.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-pink-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
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
            transition={{ duration: 0.25, delay: 0.122 }}
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
            transition={{ duration: 0.25, delay: 0.139 }}
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
                    <p className="text-gray-300 text-sm">~$80 total fee (deployment + gas + verification). Deploy on L2 networks to save 90% on transaction fees.</p>
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
            transition={{ duration: 0.25, delay: 0.157 }}
            className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-12"
          >
            <p className="text-cyan-200">
               <strong>Security First:</strong> All tokens are created using audited OpenZeppelin smart contracts,
              the industry standard trusted by Coinbase, Aave, Compound, and thousands of other projects. Your cryptocurrency is production-ready from day one.
            </p>
          </motion.div>

          {/* Understanding Cryptocurrency Creation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.165 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Understanding Cryptocurrency Creation in 2026
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Creating a cryptocurrency has evolved dramatically since the early days of blockchain. What once required deep technical expertise, custom blockchain development, and months of work can now be accomplished in seconds using standardized token contracts on existing networks.
              </p>
              <p>
                Modern cryptocurrency creation leverages the ERC20 standard and EVM-compatible blockchains, allowing anyone to launch a fully-functional digital currency that works with existing infrastructure. Your token can be stored in popular wallets like MetaMask, traded on decentralized exchanges like Uniswap, and integrated into DeFi protocols from day one.
              </p>
              <p>
                The key innovation is building on proven platforms rather than creating infrastructure from scratch. Ethereum and its Layer 2 networks provide the security, consensus mechanisms, and user base that would take years to build independently. This allows creators to focus on what matters: building utility, community, and value around their token.
              </p>
              <p>
                Whether you're launching a governance token for a DAO, a utility token for a platform, a reward currency for a loyalty program, or an in-game currency for a blockchain game, the technical barriers have been eliminated. Success now depends on vision, execution, and community building rather than coding expertise.
              </p>
            </div>
          </motion.div>

          {/* Token Economics Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.174 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Designing Your Token Economics
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Total Supply Strategy</h4>
                <p className="text-gray-300">Your total supply decision affects perception and usability. Small supplies (1M-100M) create scarcity narratives. Large supplies (1B-1T) allow psychological affordability. Consider your use case: governance tokens often use smaller supplies while gaming currencies benefit from larger numbers.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Distribution Planning</h4>
                <p className="text-gray-300">Plan how tokens will be distributed before launch. Common allocations include: liquidity pool (40-60%), team and advisors with vesting (10-20%), community rewards (15-25%), and development/marketing reserves (10-20%). Transparency in distribution builds trust.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Decimal Configuration</h4>
                <p className="text-gray-300">Standard ERC20 tokens use 18 decimals, matching ETH. This allows precise fractional transactions. Some projects use fewer decimals (6 for stablecoins, 8 for Bitcoin-like tokens) for simpler user experience. EVMint defaults to 18 but allows customization.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Naming and Branding</h4>
                <p className="text-gray-300">Your token name and symbol are permanent on-chain. Choose wisely: unique but memorable, easy to pronounce, and available across social platforms. Check existing token registries to avoid confusion with established projects.</p>
              </div>
            </div>
          </motion.div>

          {/* Comparison with Alternatives */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.183 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              EVMint vs Alternative Approaches
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400">Approach</th>
                    <th className="text-center py-3 px-4 text-gray-400">Cost</th>
                    <th className="text-center py-3 px-4 text-gray-400">Time</th>
                    <th className="text-center py-3 px-4 text-gray-400">Skills Needed</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5 bg-cyan-500/5">
                    <td className="py-3 px-4 font-semibold text-cyan-400">EVMint Generator</td>
                    <td className="text-center py-3 px-4">~$80</td>
                    <td className="text-center py-3 px-4">5 seconds</td>
                    <td className="text-center py-3 px-4">None</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Hire Solidity Developer</td>
                    <td className="text-center py-3 px-4">$5,000-50,000</td>
                    <td className="text-center py-3 px-4">2-8 weeks</td>
                    <td className="text-center py-3 px-4">None (outsourced)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">DIY with Remix</td>
                    <td className="text-center py-3 px-4">Gas only</td>
                    <td className="text-center py-3 px-4">Hours-days</td>
                    <td className="text-center py-3 px-4">Solidity, Web3</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Fork Existing Token</td>
                    <td className="text-center py-3 px-4">Gas only</td>
                    <td className="text-center py-3 px-4">Hours</td>
                    <td className="text-center py-3 px-4">Solidity basics</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Create New Blockchain</td>
                    <td className="text-center py-3 px-4">$100,000+</td>
                    <td className="text-center py-3 px-4">6-12 months</td>
                    <td className="text-center py-3 px-4">Expert team</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* After Deployment Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.191 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              What Happens After You Create Your Cryptocurrency
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Instant Contract Verification</h4>
                  <p className="text-gray-300">EVMint automatically verifies your smart contract on Etherscan, Basescan, Arbiscan, or the relevant block explorer. This displays your source code publicly, building trust with potential holders and enabling interaction with your contract's functions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Add to Wallets</h4>
                  <p className="text-gray-300">Share your contract address with users so they can add your token to MetaMask, Trust Wallet, Coinbase Wallet, or any ERC20-compatible wallet. Users will see their balance and can send/receive your cryptocurrency.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Create Trading Pair</h4>
                  <p className="text-gray-300">Add liquidity on Uniswap or another DEX to enable trading. You'll pair your token with ETH or a stablecoin, setting the initial price. Once live, anyone can buy and sell your cryptocurrency 24/7.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Track on DEXScreener</h4>
                  <p className="text-gray-300">After adding liquidity, your token automatically appears on DEXScreener and other aggregators. This provides real-time charts, holder counts, and trading volume - essential tools for growing your community.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Apply for CoinGecko/CoinMarketCap</h4>
                  <p className="text-gray-300">Submit your token for listing on major tracking sites. Requirements typically include: verified contract, active trading, website/social presence, and accurate project information. Listings increase visibility and credibility.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Cryptocurrency Creator FAQ
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Is it legal to create a cryptocurrency?</h4>
                <p className="text-gray-400">Creating a token is legal in most jurisdictions. However, how you market and use it matters. Avoid making investment promises, ensure you're not offering unregistered securities, and consult legal counsel for specific guidance in your jurisdiction.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Can I change my token's parameters after deployment?</h4>
                <p className="text-gray-400">No. Smart contracts are immutable once deployed. Token name, symbol, supply, and decimals cannot be changed. Plan carefully before deploying, and test on testnets first if unsure.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How do I distribute tokens to my team or community?</h4>
                <p className="text-gray-400">After creation, all tokens are in your wallet. You can transfer them directly, use a vesting contract for team allocations, or distribute through airdrops, staking rewards, or community initiatives.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">What's the difference between a token and a coin?</h4>
                <p className="text-gray-400">Technically, "coins" run on their own blockchain (Bitcoin, Ethereum) while "tokens" run on existing blockchains (ERC20 tokens on Ethereum). In practice, the terms are often used interchangeably. EVMint creates tokens that function identically to coins for most purposes.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How long until my token is tradeable?</h4>
                <p className="text-gray-400">Your token can be tradeable within minutes of creation. Deploy (5 seconds), then add liquidity to a DEX (2-3 minutes for setup), and your token is live for trading.</p>
              </div>
            </div>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.174 }}
            className="text-center"
          >
            <Link to="/create" onClick={() => trackButtonClick(analytics, 'cta_secondary_cryptocurrency', 'bottom_section')}>
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                Start Creating Your Cryptocurrency →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
