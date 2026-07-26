import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { colors } from '../../styles/designSystem'
import { useScrollLock } from '../../hooks/useScrollLock'
import { getChainName } from '../../config/chains'

interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: string
  logoUri?: string
}

interface TransactionProgressModalProps {
  isOpen: boolean
  onClose: () => void
  currentStep: 'approve' | 'add' | 'remove_approve' | 'remove_liquidity' | null
  isProcessing: boolean
  tokenA: Token | null
  tokenB: Token | null
  amountA: string
  amountB: string
  error: Error | null
  transactionHash?: string
  poolAddress?: string
  chainId?: number
  resetLoadingStates: () => void
}

export default function TransactionProgressModal({ 
  isOpen, 
  onClose, 
  currentStep, 
  isProcessing, 
  tokenA, 
  tokenB, 
  amountA, 
  amountB, 
  error,
  transactionHash,
  poolAddress,
  chainId,
  resetLoadingStates
}: TransactionProgressModalProps) {
  // Lock body scroll when modal is open
  useScrollLock(isOpen)

  if (!isOpen) return null

  const getStepStatus = (step: 'approve' | 'add') => {
    if (error) return 'error'
    
    // CORRECT: Only consider completed if we have a transaction hash (proof of completion)
    // Without transactionHash, it means nothing has been submitted yet
    const hasCompletedAllSteps = !isProcessing && !currentStep && !!transactionHash
    
    
    if (hasCompletedAllSteps) {
      return 'completed'
    }
    
    // Active step (only consider add liquidity steps, ignore remove steps)
    if (currentStep === step) return 'active'
    
    // Step 1 (approve) is completed if we're on step 2 (add)
    if (step === 'approve' && currentStep === 'add') return 'completed'
    
    // If we're in remove mode, don't show any progress (this modal is for add only)
    if (currentStep === 'remove_approve' || currentStep === 'remove_liquidity') {
      return 'pending' // Keep all steps pending if we're in remove mode
    }
    
    return 'pending'
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (isProcessing || currentStep) {
            resetLoadingStates()
          }
          onClose()
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative ${colors.glassCard} rounded-2xl p-8 w-full max-w-lg`}
      >
        {error ? (
          // Error State
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Transaction Failed</h2>
            <p className="text-red-300 mb-6 text-sm leading-relaxed">
              {error.message || 'An unexpected error occurred'}
            </p>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-6 ${colors.primaryButton} rounded-xl font-semibold`}
            >
              Close
            </motion.button>
          </div>
        ) : (
          // Progress State
          <div className="text-center">
            {/* Header */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Adding Liquidity</h2>
            <p className="text-gray-300 mb-8">
              {!isProcessing 
                ? "You'll need to sign 2 transactions to complete this process"
                : "Please check your wallet and sign the pending transaction"
              }
            </p>

            {/* Transaction Details */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{amountA}</div>
                  <div className="text-sm text-gray-400">{tokenA?.symbol || 'Token A'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{amountB}</div>
                  <div className="text-sm text-gray-400">{tokenB?.symbol || 'Token B'}</div>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              {/* Step 1: Approve */}
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  getStepStatus('approve') === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : getStepStatus('approve') === 'active'
                    ? 'bg-blue-500 text-white'
                    : getStepStatus('approve') === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {getStepStatus('approve') === 'completed' ? '✓' : 
                   getStepStatus('approve') === 'active' ? '○' :
                   getStepStatus('approve') === 'error' ? '✗' : '1'}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">Approve Token</div>
                  <div className="text-sm text-gray-400">Allow Uniswap to use your {tokenA?.symbol || 'tokens'}</div>
                </div>
                {getStepStatus('approve') === 'active' && (
                  <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                )}
              </div>

              {/* Step 2: Add Liquidity */}
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  getStepStatus('add') === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : getStepStatus('add') === 'active'
                    ? 'bg-blue-500 text-white'
                    : getStepStatus('add') === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {getStepStatus('add') === 'completed' ? '✓' : 
                   getStepStatus('add') === 'active' ? '○' :
                   getStepStatus('add') === 'error' ? '✗' : '2'}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">Add Liquidity</div>
                  <div className="text-sm text-gray-400">Deposit tokens into the liquidity pool</div>
                </div>
                {getStepStatus('add') === 'active' && (
                  <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {/* Transaction Hash */}
            {transactionHash && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <div className="text-sm text-blue-300 mb-2">Transaction Hash:</div>
                <div className="font-mono text-xs break-all text-gray-300">{transactionHash}</div>
              </div>
            )}

            {/* Pool Information */}
            {poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                <div className="text-sm text-green-300 mb-2">Pool Address:</div>
                <div className="font-mono text-xs break-all text-gray-300">{poolAddress}</div>
                <div className="text-xs text-gray-400 mt-2">Protocol: Uniswap V2</div>
                <div className="text-xs text-gray-400">Network: {chainId ? getChainName(chainId) : 'Unknown'}</div>
              </div>
            )}

            {/* Action Button - BULLETPROOF: Always show appropriate button */}
            {!error && (
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    const isCompleted = !isProcessing && !!transactionHash
                    if (!isCompleted) {
                      // Cancel: Reset all states before closing modal
                      resetLoadingStates()
                    }
                    onClose()
                  }}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  className={`w-full py-3 px-6 ${
                    (!isProcessing && !!transactionHash)
                      ? colors.primaryButton + ' font-semibold' 
                      : colors.secondaryButton + ' font-medium'
                  } rounded-xl`}
                  disabled={isProcessing}
                >
                  {(!isProcessing && !currentStep && !!transactionHash) ? 'Continue to Success' : 
                   isProcessing ? 'Processing...' : 
                   (!isProcessing && transactionHash) ? 'Continue to Success' : 'Cancel'}
                </motion.button>

              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}