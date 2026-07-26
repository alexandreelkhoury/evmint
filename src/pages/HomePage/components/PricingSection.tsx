import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { typography } from '../../../styles/designSystem'
import ChainIcon from '../../../components/ChainIcon'

/**
 * PricingSection - Simple, unified pricing
 * One price across all chains (~$80 equivalent in native token)
 */
export default function PricingSection() {
  const networks = [
    { name: 'Ethereum', chainId: 1, fee: '0.02 ETH' },
    { name: 'Base', chainId: 8453, fee: '0.02 ETH' },
    { name: 'Arbitrum', chainId: 42161, fee: '0.02 ETH' },
    { name: 'Optimism', chainId: 10, fee: '0.02 ETH' },
    { name: 'Robinhood Chain', chainId: 4663, fee: '0.02 ETH' },
    { name: 'MegaETH', chainId: 4326, fee: '0.02 ETH' },
    { name: 'World Chain', chainId: 480, fee: '0.02 ETH' },
    { name: 'Blast', chainId: 81457, fee: '0.02 ETH' },
    { name: 'BSC', chainId: 56, fee: '0.075 BNB' },
    { name: 'Polygon', chainId: 137, fee: '400 POL' },
    { name: 'Avalanche', chainId: 43114, fee: '4 AVAX' },
    { name: 'Monad', chainId: 143, fee: '0.1 MON' },
    { name: 'Fantom', chainId: 250, fee: '500 FTM' },
    { name: 'Gnosis', chainId: 100, fee: '80 xDAI' },
    { name: 'Moonbeam', chainId: 1284, fee: '450 GLMR' },
  ]

  const features = [
    'ERC-20 token deployed to any chain',
    'Auto-verified on block explorer',
    'Ready for DEX liquidity',
    'OpenZeppelin audited contracts',
    'No monthly fees, no hidden charges',
    '100% non-custodial — you own everything',
  ]

  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="pricing-heading">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold">
              <span className="text-lg">💰</span>
              Transparent Pricing
            </span>
          </motion.div>

          <h2 id="pricing-heading" className={`${typography.sectionTitle} text-4xl sm:text-5xl mb-6`}>
            One Simple{' '}
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Price
            </span>
          </h2>

          {/* Value Anchor */}
          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap justify-center items-center gap-4 text-lg">
              <span className="text-red-400 line-through">Traditional Developer: $5,000 - $50,000 + weeks of waiting</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              ~$80 on any chain • 60 seconds
            </div>
          </div>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Same price everywhere. We adjust the native token amount so you pay{' '}
            <span className="text-white font-semibold">~$80 equivalent</span> regardless of which chain you deploy on.
            <br />
            <span className="text-gray-500">
              Includes deployment + gas fees. No platform fee, no hidden charges.
            </span>
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative mb-12"
        >
          {/* Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-600/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-[background-color,color,border-color,box-shadow,opacity] duration-300"></div>

          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-green-500/30 group-hover:border-green-400/60 rounded-2xl shadow-2xl transition-[background-color,color,border-color,box-shadow,opacity] duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-2xl opacity-50"></div>

            <div className="relative p-8 md:p-10">
              {/* Price Display */}
              <div className="text-center mb-10">
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-6xl md:text-7xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                    ~$80
                  </span>
                  <span className="text-xl text-gray-400 font-medium">per token</span>
                </div>
                <p className="text-gray-400">
                  Paid in native token of your chosen chain (+ minor gas)
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Network Fees Table */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
                  Fee by Network
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {networks.map((network) => (
                    <div
                      key={network.name}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                    >
                      <ChainIcon chainId={network.chainId} size={20} />
                      <div className="min-w-0">
                        <div className="text-gray-300 font-medium truncate">{network.name}</div>
                        <div className="text-gray-500 text-xs">{network.fee}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-start gap-3 px-6 py-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl backdrop-blur-sm">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <p className="text-gray-400 text-sm leading-relaxed text-left">
              <span className="text-blue-400 font-semibold">How it works:</span> You pay a single fee in the chain's native token. We set amounts so every chain costs roughly the same in USD.
              <br />
              Exact cost shown before every deployment. Testnet deployments are near-free.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/create"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 text-white font-black text-lg rounded-xl shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer group focus-visible:ring-4 focus-visible:ring-green-400/70 focus-visible:outline-none"
              aria-label="Start deploying your token now"
            >
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Deploying Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
