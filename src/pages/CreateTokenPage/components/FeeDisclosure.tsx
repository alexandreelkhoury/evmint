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
      className="mt-6"
    >
      <div className={`${colors.glassCard} rounded-xl p-4 border border-blue-500/20`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Token Creation Fee:</span>{' '}
              <span className="text-blue-400 font-semibold">{feeAmount} {nativeTokenName}</span>
              <span className="text-gray-400"> + gas fees</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Fee covers platform maintenance and development</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
