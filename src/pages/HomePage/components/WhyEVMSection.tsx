import { motion } from 'framer-motion'
import { colors, typography } from '../../../styles/designSystem'

/**
 * Why EVM Section component
 * Explains benefits of EVM chains vs Solana with comparison grid
 */
export default function WhyEVMSection() {
  return (
    <motion.div
      id="why-base"
      className="mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}>
        <div className="text-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-6"
          >
            <span className="text-sm font-medium text-green-400">⚡ Multi-Chain EVM</span>
          </motion.div>

          <h2 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}>
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">EVM</span> Chains?
          </h2>
          <p className={`${typography.subtitle} text-xl max-w-3xl mx-auto`}>
            Deploy on 8+ EVM blockchains including Base, Arbitrum, Polygon, BNB Chain & more. Lower fees, instant confirmation, and <span className="text-blue-400 font-semibold">maximum flexibility</span> for your project
          </p>
        </div>

        {/* Comparison: EVM L2s vs Solana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* EVM L2s - Winner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/40 rounded-2xl p-6"
          >
            <div className="absolute -top-3 -right-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                ✓ RECOMMENDED
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">EVM Layer 2s</h3>
              <p className="text-green-200 text-sm">Base • Arbitrum • Optimism • Polygon</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">High Visibility</p>
                  <p className="text-gray-400 text-sm">Stand out with lower token volume</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Mature DeFi Ecosystem</p>
                  <p className="text-gray-400 text-sm">Uniswap, DEXes, bridges & more</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Ultra Low Fees</p>
                  <p className="text-gray-400 text-sm">$0.01 - $3 per transaction</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">EVM Compatible</p>
                  <p className="text-gray-400 text-sm">Works with MetaMask, Ethereum tools</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solana - Not Recommended */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Solana</h3>
              <p className="text-orange-200 text-sm">Alternative Platform</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p className="text-white font-medium">Heavily Oversaturated</p>
                  <p className="text-gray-400 text-sm">10,000+ new tokens daily</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p className="text-white font-medium">Very Low Visibility</p>
                  <p className="text-gray-400 text-sm">Hard to stand out from the crowd</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3l-7.732-12a2 2 0 00-3.464 0L2.268 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Scam-Heavy Reputation</p>
                  <p className="text-gray-400 text-sm">Many rug pulls hurt trust</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">Different Tech Stack</p>
                  <p className="text-gray-400 text-sm">Not EVM - needs custom tools</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-200">
                ⚠️ Unless you have a very specific reason for Solana, EVM L2s offer better visibility and success rates for new projects
              </p>
            </div>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">Ultra Low Fees</h4>
            <p className="text-gray-400 text-sm">95% cheaper than Ethereum L1</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">Choose Your Chain</h4>
            <p className="text-gray-400 text-sm">Deploy on 8+ different EVM networks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">Lightning Fast</h4>
            <p className="text-gray-400 text-sm">1-2 second confirmations on L2s</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
