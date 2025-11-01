import { motion } from 'framer-motion'
import { typography, colors } from '../../../styles/designSystem'

interface ErrorDisplayProps {
  error: {
    message?: string
  }
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 ${colors.errorBg} rounded-2xl p-6 text-center`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className={`${typography.cardTitle} text-white mb-3`}>Token Creation Failed</h3>
      <p className={`${typography.bodyText} text-red-200`}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
    </motion.div>
  )
}
