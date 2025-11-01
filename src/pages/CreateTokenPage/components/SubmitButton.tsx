import { motion } from 'framer-motion'
import { typography, colors } from '../../../styles/designSystem'
import WalletButton from '../../../components/WalletButton'

interface SubmitButtonProps {
  authenticated: boolean
  isCorrectChain: boolean
  isCreating: boolean
  isVerifying: boolean
  formErrors: Record<string, string | undefined>
  chainName: string
}

export default function SubmitButton({
  authenticated,
  isCorrectChain,
  isCreating,
  isVerifying,
  formErrors,
  chainName
}: SubmitButtonProps) {
  if (!authenticated) {
    return (
      <div className="space-y-6">
        <div className={`${colors.infoBg} rounded-2xl p-6 text-center`}>
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className={`${typography.cardTitle} text-white mb-3`}>Connect Your Wallet</h3>
          <p className={`${typography.bodyText} text-blue-200 mb-6`}>
            Connect your wallet to deploy tokens on any EVM blockchain and start creating your own cryptocurrency.
          </p>
          <WalletButton />
        </div>
      </div>
    )
  }

  if (!isCorrectChain) {
    return (
      <div className={`${colors.warningBg} rounded-2xl p-6 text-center`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className={`${typography.cardTitle} text-white mb-3`}>Switch Network</h3>
        <p className={`${typography.bodyText} text-orange-200`}>
          Please switch to a supported EVM network to create tokens. Use the chain selector in the header to browse available networks.
        </p>
      </div>
    )
  }

  const hasFormErrors = Object.keys(formErrors).some(key => formErrors[key])
  const isDisabled = isCreating || hasFormErrors

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-300 ${
        isDisabled ? colors.primaryButtonDisabled : colors.primaryButton
      }`}
    >
      {isCreating ? (
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span>
            {isVerifying ? 'Verifying Contract...' : `Creating Token on ${chainName}...`}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center space-x-2">
            <span>🚀</span>
            <span>Create Token</span>
          </div>
          <span className="text-sm text-blue-200 opacity-80">
            One transaction • Auto-verified on block explorer
          </span>
        </div>
      )}
    </motion.button>
  )
}
