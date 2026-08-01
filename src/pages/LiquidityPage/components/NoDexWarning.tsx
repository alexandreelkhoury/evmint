import { motion } from 'framer-motion'

interface NoDexWarningProps {
  isV2Available: boolean
}

export default function NoDexWarning({ isV2Available }: NoDexWarningProps) {
  if (isV2Available) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-8 max-w-2xl mx-auto"
    >
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-yellow-300 font-semibold">Network Notice</div>
            <div className="text-yellow-200 text-sm">
              Uniswap V2 liquidity features require a supported mainnet. Please switch to a compatible network to continue.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
