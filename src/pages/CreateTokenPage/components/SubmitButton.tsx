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
      <div className="space-y-4 pt-2">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-5 text-center">
          <p className="text-sm text-gray-300 mb-4">
            Connect your wallet to deploy tokens on any EVM blockchain.
          </p>
          <div className="flex justify-center">
            <WalletButton />
          </div>
        </div>
      </div>
    )
  }

  if (!isCorrectChain) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-5 py-4 text-center">
        <p className="text-sm font-medium text-yellow-300 mb-1">Switch Network</p>
        <p className="text-xs text-gray-400">
          Please switch to a supported EVM network to create tokens.
        </p>
      </div>
    )
  }

  const hasFormErrors = Object.keys(formErrors).some(key => formErrors[key])
  const isDisabled = isCreating || hasFormErrors

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full py-3.5 text-sm font-semibold rounded-xl transition-colors ${
        isDisabled
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30'
      }`}
    >
      {isCreating ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          {isVerifying ? 'Verifying contract...' : `Deploying on ${chainName}...`}
        </span>
      ) : (
        <span>Create Token</span>
      )}
    </button>
  )
}
