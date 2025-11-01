import { motion } from 'framer-motion'
import { typography } from '../../../styles/designSystem'

export default function PageHeader() {
  return (
    <motion.div
      className="text-center mb-20"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
      >
        <span className="text-sm font-medium text-blue-400">🚀 Token Creator</span>
      </motion.div>

      <motion.h1
        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Create Your Token
        </span>
        <br />
        <span className={typography.pageTitleWhite}>on Any EVM Chain</span>
      </motion.h1>

      <motion.p
        className={`${typography.subtitle} max-w-4xl mx-auto text-xl sm:text-2xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Deploy your own ERC20 token on any EVM blockchain in seconds. No coding experience required! Ultra-low gas fees on Layer 2 networks.
      </motion.p>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center items-center space-x-8 mt-12"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">15+ Chains</div>
          <div className="text-sm text-gray-400">Supported</div>
        </div>
        <div className="w-px h-8 bg-gray-700"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">Instant</div>
          <div className="text-sm text-gray-400">Deployment</div>
        </div>
        <div className="w-px h-8 bg-gray-700"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">No Code</div>
          <div className="text-sm text-gray-400">Required</div>
        </div>
      </motion.div>
    </motion.div>
  )
}
