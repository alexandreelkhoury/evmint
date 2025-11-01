import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { typography, colors } from '../../../styles/designSystem'

interface SuccessModalProps {
  tokenAddress: string
  chainName: string
}

export default function SuccessModal({ tokenAddress, chainName }: SuccessModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 ${colors.successBg} rounded-2xl p-6`}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className={`${typography.cardTitle} text-white mb-3`}>Token Created Successfully!</h3>
        <p className={`${typography.bodyText} text-green-200 mb-4`}>
          Your token has been deployed to {chainName}.
        </p>
        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <p className="text-xs font-mono break-all text-gray-300">
            Contract: {tokenAddress}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/tokens"
            className={`inline-flex items-center justify-center px-6 py-3 ${colors.primaryButton} rounded-xl font-medium`}
          >
            <span>💎</span>
            <span className="ml-2">View My Tokens</span>
          </Link>
          <Link
            to="/liquidity"
            className={`inline-flex items-center justify-center px-6 py-3 ${colors.secondaryButton} rounded-xl font-medium`}
          >
            <span>💧</span>
            <span className="ml-2">Add Liquidity</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
