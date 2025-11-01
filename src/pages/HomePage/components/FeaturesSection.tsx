import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { colors, typography } from '../../../styles/designSystem'

/**
 * Features section component
 * Displays key features with animated cards and icons
 */
export default function FeaturesSection() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={featuresRef}
      id="features"
      className="mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}>
        <div className="text-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={featuresInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6"
          >
            <span className="text-sm font-medium text-purple-400">🛠️ Features</span>
          </motion.div>

          <h2 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">No-Code</span> Token Creation
          </h2>
          <p className={`${typography.subtitle} text-xl max-w-3xl mx-auto`}>
            Professional-grade tools for ERC20 deployment, liquidity management, and DeFi integration across 8+ EVM chains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:bg-blue-500/15 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className={`${typography.cardTitle} text-xl mb-4`}>Token Creation</h3>
            <p className={typography.bodyText}>Deploy fully functional ERC20 tokens with customizable parameters in 5 seconds.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 hover:bg-green-500/15 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <h3 className={`${typography.cardTitle} text-xl mb-4`}>Liquidity Management</h3>
            <p className={typography.bodyText}>Add and remove liquidity on Uniswap V3 directly from our interface.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:bg-purple-500/15 transition-all duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className={`${typography.cardTitle} text-xl mb-4`}>Secure & Reliable</h3>
            <p className={typography.bodyText}>Built on Base blockchain with audited smart contracts and proven security.</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
