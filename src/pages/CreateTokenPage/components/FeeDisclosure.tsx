import { motion } from 'framer-motion'
import { typography, colors } from '../../../styles/designSystem'

interface FeeDisclosureProps {
  feeAmount: string
  nativeTokenName: string
}

export default function FeeDisclosure({ feeAmount, nativeTokenName }: FeeDisclosureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.25 }}
      className="mt-8"
    >
      <div className={`${colors.glassCard} rounded-2xl p-4 sm:p-6 border border-blue-500/20`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`${typography.cardTitle} text-base sm:text-lg mb-2`}>Token Creation Fee</h3>
            <p className={`${typography.bodyText} text-gray-300 mb-3 text-sm sm:text-base`}>
              Creating a token requires a one-time fee of <span className="text-blue-400 font-semibold">{feeAmount} {nativeTokenName}</span> plus network gas fees.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">Fee covers platform maintenance and development costs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
