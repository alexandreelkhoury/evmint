import { motion } from 'framer-motion'
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
      <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-xl p-5 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-400">Connect your wallet to deploy tokens</p>
        <WalletButton />
      </div>
    )
  }

  if (!isCorrectChain) {
    return (
      <div className="bg-orange-500/[0.06] border border-orange-500/20 rounded-xl p-4 text-center">
        <p className="text-sm text-orange-300/90">Switch to a supported EVM network to create tokens</p>
      </div>
    )
  }

  const hasFormErrors = Object.keys(formErrors).some(key => formErrors[key])
  const isDisabled = isCreating || hasFormErrors

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01 } : undefined}
      whileTap={!isDisabled ? { scale: 0.99 } : undefined}
      className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-150 ${
        isDisabled
          ? 'bg-white/[0.04] text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:bg-blue-700'
      }`}
    >
      {isCreating ? (
        <span className="flex items-center justify-center gap-2.5">
          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          {isVerifying ? 'Verifying Contract...' : `Creating Token on ${chainName}...`}
        </span>
      ) : (
        <span className="flex flex-col items-center gap-0.5">
          <span>Create Token</span>
          <span className="text-xs text-blue-200/70 font-normal">One transaction, auto-verified</span>
        </span>
      )}
    </motion.button>
  )
}
