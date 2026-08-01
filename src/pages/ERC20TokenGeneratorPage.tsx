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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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
              <button className={`group relative px-12 py-5 ${colors.primaryButton} text-lg active:scale-[0.97]`}>
                <span className="relative z-10 flex items-center gap-3">
                  Generate Your ERC20 Token Now
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
            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-purple-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fully Customizable</h3>
              <p className="text-gray-300 leading-relaxed">
                Set your token name, symbol, total supply, and decimals. Full control over your ERC20 token parameters - no limitations.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-pink-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">OpenZeppelin Security</h3>
              <p className="text-gray-300 leading-relaxed">
                Built with audited OpenZeppelin ERC20 contracts - the industry standard trusted by top crypto projects worldwide.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-red-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Any EVM Blockchain</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, or any EVM-compatible chain. You choose.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8 text-left hover:border-orange-500/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200`}>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
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
                <div className="text-2xl"></div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Launch in 5 Seconds</h4>
                  <p className="text-gray-300">No complex setup, no waiting. Connect your wallet, fill the form, and your ERC20 token is live.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl"></div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Production-Ready</h4>
                  <p className="text-gray-300">Built with audited OpenZeppelin contracts. Compatible with all wallets, exchanges, and DeFi protocols.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl"></div>
                <div>
                  <h4 className="text-white font-semibold mb-1">No Coding Required</h4>
                  <p className="text-gray-300">Simple form interface. If you can fill out a web form, you can create an ERC20 token.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl"></div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Affordable & Transparent</h4>
                  <p className="text-gray-300">~$80 total fee (deployment + gas + verification). No hidden charges. Deploy on L2 networks to save 90% on gas.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What is ERC20 Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              What is an ERC20 Token?
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                ERC20 is the most widely adopted token standard in the cryptocurrency ecosystem, originally developed for the Ethereum blockchain. The acronym stands for "Ethereum Request for Comments 20," referring to the proposal number that established this groundbreaking standard in 2015.
              </p>
              <p>
                An ERC20 token is a smart contract that follows a specific set of rules and interfaces, enabling seamless interaction with wallets, exchanges, and decentralized applications (dApps). This standardization is what makes ERC20 tokens so powerful - any wallet or platform that supports ERC20 can automatically work with your token without custom integration.
              </p>
              <p>
                Every ERC20 token implements six mandatory functions: totalSupply (returns total tokens), balanceOf (returns balance for an address), transfer (moves tokens between addresses), transferFrom (allows approved transfers), approve (authorizes spending), and allowance (checks remaining approval). These functions ensure interoperability across the entire Ethereum ecosystem and all EVM-compatible chains.
              </p>
              <p>
                Today, ERC20 tokens power everything from DeFi protocols and governance systems to gaming economies and loyalty programs. Major cryptocurrencies like USDC, USDT, LINK, and UNI are all ERC20 tokens, demonstrating the standard's reliability and versatility for projects of all sizes.
              </p>
            </div>
          </motion.div>

          {/* How It Works Step by Step */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How Our ERC20 Generator Works
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-300">Link your MetaMask, Coinbase Wallet, Trust Wallet, or any WalletConnect-compatible wallet. This will be the owner address that receives all minted tokens and owns the smart contract.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Select Your Blockchain Network</h3>
                  <p className="text-gray-300">Choose from Ethereum mainnet for maximum credibility, or Layer 2 networks like Base, Arbitrum, and Polygon for 90% lower gas fees. All networks use the same ERC20 standard.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Configure Your Token</h3>
                  <p className="text-gray-300">Enter your token name, symbol (ticker), total supply, and decimals. The name should be memorable, the symbol should be unique and 3-5 characters, and consider your supply carefully for your tokenomics model.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Deploy in 5 Seconds</h3>
                  <p className="text-gray-300">Click deploy and confirm the transaction in your wallet. Our platform compiles the OpenZeppelin-based smart contract, deploys it to your chosen network, and automatically verifies the source code on the block explorer.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Add Liquidity (Optional)</h3>
                  <p className="text-gray-300">Make your token tradeable by adding liquidity on Uniswap, SushiSwap, or other DEXs. Create a trading pair with ETH or stablecoins, set your initial price, and enable instant trading for your community.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.92 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Popular ERC20 Token Use Cases
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Governance Tokens</h4>
                <p className="text-gray-400 text-sm">Enable decentralized voting and decision-making in your DAO or protocol. Token holders vote on proposals, parameter changes, and treasury allocations.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Utility Tokens</h4>
                <p className="text-gray-400 text-sm">Provide access to products, services, or premium features within your ecosystem. Users stake or spend tokens to unlock functionality.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Reward & Loyalty Programs</h4>
                <p className="text-gray-400 text-sm">Incentivize customer behavior with blockchain-based rewards. Tokens can be earned, traded, and redeemed across your platform.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Gaming Currencies</h4>
                <p className="text-gray-400 text-sm">Create in-game economies for play-to-earn games. Players earn tokens through gameplay and trade them on decentralized exchanges.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Community Tokens</h4>
                <p className="text-gray-400 text-sm">Build and engage communities with token-gated access, exclusive content, and community-driven initiatives.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-2">Staking & DeFi</h4>
                <p className="text-gray-400 text-sm">Create tokens for liquidity mining, yield farming, and staking rewards within DeFi protocols.</p>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.94 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              EVMint vs Hiring a Developer
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400">Criteria</th>
                    <th className="text-center py-3 px-4 text-green-400">EVMint ERC20 Generator</th>
                    <th className="text-center py-3 px-4 text-gray-400">Custom Development</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Time to Deploy</td>
                    <td className="text-center py-3 px-4 text-green-400">5 seconds</td>
                    <td className="text-center py-3 px-4">2-8 weeks</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Cost</td>
                    <td className="text-center py-3 px-4 text-green-400">~$80 total</td>
                    <td className="text-center py-3 px-4">$5,000-50,000+</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Security Audits</td>
                    <td className="text-center py-3 px-4 text-green-400">OpenZeppelin (included)</td>
                    <td className="text-center py-3 px-4">$10,000-100,000 extra</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Contract Verification</td>
                    <td className="text-center py-3 px-4 text-green-400">Automatic</td>
                    <td className="text-center py-3 px-4">Manual process</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Technical Knowledge</td>
                    <td className="text-center py-3 px-4 text-green-400">None required</td>
                    <td className="text-center py-3 px-4">Solidity expertise</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Multi-Chain Support</td>
                    <td className="text-center py-3 px-4 text-green-400">15+ chains built-in</td>
                    <td className="text-center py-3 px-4">Extra cost per chain</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.96 }}
            className={`${colors.glassCard} rounded-2xl p-10 text-left mb-12`}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Do I need programming skills to create an ERC20 token?</h4>
                <p className="text-gray-400">No coding skills are required. Our platform handles all the technical complexity - you just fill out a simple form with your token details.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Which blockchain should I choose for my token?</h4>
                <p className="text-gray-400">Ethereum provides maximum credibility but higher fees. Layer 2 networks like Base, Arbitrum, and Polygon offer 90% lower fees with similar security. Consider your target audience and use case.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Can I add my token to MetaMask?</h4>
                <p className="text-gray-400">Yes! All tokens created with EVMint are standard ERC20 tokens. Simply add the token contract address to MetaMask or any ERC20-compatible wallet.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">How do I make my token tradeable?</h4>
                <p className="text-gray-400">After creating your token, add liquidity on a decentralized exchange like Uniswap. Our platform includes built-in liquidity tools to make this process simple.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Is the smart contract secure?</h4>
                <p className="text-gray-400">Yes. We use OpenZeppelin's audited smart contract libraries, the industry standard trusted by Coinbase, Aave, Compound, and thousands of other projects.</p>
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
              <button className="px-10 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                Start Generating Your ERC20 Token →
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
