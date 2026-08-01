import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { typography } from '../../../styles/designSystem'
import ChainIcon from '../../../components/ChainIcon'
import { MAINNET_CHAINS, CHAIN_FEES } from '../../../config/chains'

/**
 * PricingSection - Simple, unified pricing
 * One price across all chains (~$80 equivalent in native token)
 *
 * The per-network fee grid is derived from CHAIN_FEES in src/config/chains.ts —
 * the same source the deployment flow charges from — so it cannot drift.
 */

// Derived once at module scope: name, icon and fee for every supported mainnet.
const NETWORK_FEES = MAINNET_CHAINS
  .filter(chain => CHAIN_FEES[chain.id] !== undefined)
  .map(chain => ({
    name: chain.name,
    chainId: chain.id,
    fee: `${CHAIN_FEES[chain.id]} ${chain.nativeCurrency.symbol}`,
  }))

export default function PricingSection() {
  const features = [
    'ERC-20 token deployed to any chain',
    'Auto-verified on block explorer',
    'Ready for DEX liquidity',
    'OpenZeppelin audited contracts',
    'No monthly fees, no hidden charges',
    '100% non-custodial — you own everything',
  ]

  return (
    <section className="py-20 relative" aria-labelledby="pricing-heading">
      {/* Static depth — same restrained radial treatment as the hero */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.05)_0%,_transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="text-center mb-16"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold">
              Transparent Pricing
            </span>
          </motion.div>

          <h2 id="pricing-heading" className={`${typography.sectionTitle} text-4xl sm:text-5xl mb-6`}>
            One Simple{' '}
            <span className="text-white">
              Price
            </span>
          </h2>

          {/* Value Anchor */}
          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap justify-center items-center gap-4 text-lg">
              <span className="text-red-400 line-through">Traditional Developer: $5,000 - $50,000 + weeks of waiting</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              ~$80 on any chain • 60 seconds
            </div>
          </div>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Same price everywhere. We adjust the native token amount so you pay{' '}
            <span className="text-white font-semibold">~$80 equivalent</span> regardless of which chain you deploy on.
            <br />
            <span className="text-gray-500">
              One fee covers everything — deployment, gas, and verification. No subscriptions.
            </span>
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="group relative mb-12"
        >
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 group-hover:border-blue-500/30 rounded-2xl shadow-2xl transition-[border-color] duration-300">
            <div className="relative p-8 md:p-10">
              {/* Price Display */}
              <div className="text-center mb-10">
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-6xl md:text-7xl font-black text-white">
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
                    transition={{ duration: 0.25, delay: i * 0.03 }}
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
                  {NETWORK_FEES.map((network) => (
                    <div
                      key={network.chainId}
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
          transition={{ delay: 0.1, duration: 0.25 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-start gap-3 px-6 py-4 bg-blue-500/[0.06] border border-blue-500/20 rounded-xl">
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
          transition={{ delay: 0.15, duration: 0.25 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/create"
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 transition-[background-color,box-shadow] duration-200 cursor-pointer group focus-visible:ring-4 focus-visible:ring-blue-400/50 focus-visible:outline-none"
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
