/**
 * WalletButtonLazy
 *
 * A lazy-loaded wallet button that shows a "Connect Wallet" UI before Web3 is loaded,
 * and switches to the full WalletButton once Web3 providers are available.
 *
 * This component is the trigger for loading the Web3 bundle on user interaction.
 */

import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { useWeb3Load } from './LazyWeb3Provider'
import { colors } from '../styles/designSystem'

// Lazy load the full wallet button
const WalletButtonFull = lazy(() => import('./WalletButton'))

// Loading state for the button
function WalletButtonLoading() {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg cursor-not-allowed"
      disabled
    >
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
        <span>Loading...</span>
      </div>
    </motion.button>
  )
}

// Stub button shown before Web3 is loaded
function WalletButtonStub({ onConnect }: { onConnect: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onConnect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${colors.primaryButton} px-3 sm:px-4 py-2 text-sm sm:text-base relative overflow-hidden`}
    >
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="hidden xs:inline">Connect Wallet</span>
        <span className="xs:hidden">Connect</span>
      </div>

      {/* Subtle shimmer effect to indicate interactivity */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  )
}

export default function WalletButtonLazy() {
  const { isWeb3Loaded, isWeb3Loading, triggerWeb3Load } = useWeb3Load()

  // If Web3 is loading, show loading state
  if (isWeb3Loading && !isWeb3Loaded) {
    return <WalletButtonLoading />
  }

  // If Web3 is loaded, show the full wallet button
  if (isWeb3Loaded) {
    return (
      <Suspense fallback={<WalletButtonLoading />}>
        <WalletButtonFull />
      </Suspense>
    )
  }

  // Otherwise, show the stub button that triggers Web3 loading
  return <WalletButtonStub onConnect={triggerWeb3Load} />
}
