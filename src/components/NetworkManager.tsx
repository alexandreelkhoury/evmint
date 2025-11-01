import { useEffect, useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { motion } from 'framer-motion'
import { useGlobalToasts } from '../App'
import { isChainSupported, baseConfig, MAINNET_CHAINS } from '../config/chains'
import { useChainConfig } from '../hooks/useChainConfig'

export default function NetworkManager() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const { addToast } = useGlobalToasts()
  const { name: currentChainName } = useChainConfig()
  const [showModal, setShowModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)

  const isCorrectChain = isChainSupported(chainId)

  useEffect(() => {
    // Only show modal if user is connected but on wrong network
    if (isConnected && !isCorrectChain && !hasShownModal) {
      setShowModal(true)
      setHasShownModal(true)
    }
    
    // If user switches to correct network, hide modal
    if (isCorrectChain && showModal) {
      setShowModal(false)
    }
  }, [isConnected, isCorrectChain, hasShownModal, showModal])

  const handleSwitchToBase = async () => {
    try {
      // Default to Base mainnet as recommended chain
      await switchChain({ chainId: baseConfig.id })
      setShowModal(false)
      addToast({
        title: 'Network Switched',
        message: `Successfully switched to ${baseConfig.name}`,
        type: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error('Failed to switch network:', error)
      addToast({
        title: 'Network Switch Failed',
        message: 'Please manually switch to a supported network in your wallet',
        type: 'error',
        duration: 5000
      })
    }
  }

  const handleDismiss = () => {
    setShowModal(false)
    addToast({
      title: 'Network Notice',
      message: 'You can switch networks anytime using the chain selector in the header',
      type: 'info',
      duration: 4000
    })
  }

  // Reset hasShownModal when user disconnects
  useEffect(() => {
    if (!isConnected) {
      setHasShownModal(false)
      setShowModal(false)
    }
  }, [isConnected])

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-w-md mx-4 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-blue-500/20 shadow-2xl"
      >
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3">
            Unsupported Network
          </h3>

          <p className="text-gray-300 mb-4 text-sm leading-relaxed">
            You're currently on <span className="text-red-400 font-semibold">{currentChainName}</span>, which is not supported by this app.
          </p>

          <p className="text-gray-400 mb-6 text-xs">
            We recommend <span className="text-blue-400 font-semibold">{baseConfig.name}</span> for the best experience, or choose from any supported chain.
          </p>

          {/* Supported Networks Preview */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-6">
            <div className="text-xs text-gray-400 mb-2">Supported Networks:</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {MAINNET_CHAINS.slice(0, 6).map((chain) => (
                <span key={chain.id} className="text-xs px-2 py-1 bg-gray-700 rounded">{chain.icon}</span>
              ))}
              {MAINNET_CHAINS.length > 6 && (
                <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-400">+{MAINNET_CHAINS.length - 6} more</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwitchToBase}
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Switching...
                </div>
              ) : (
                `Switch to ${baseConfig.name}`
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDismiss}
              className="flex-1 py-3 px-4 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/15 transition-all duration-300"
            >
              Later
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}