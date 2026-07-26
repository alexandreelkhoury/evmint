/**
 * Web3Required Component
 *
 * Wraps content that requires Web3 providers. Shows a placeholder until
 * Web3 is loaded, then renders the children.
 *
 * Usage:
 * <Web3Required fallback={<MyPlaceholder />}>
 *   <ComponentThatUsesWeb3Hooks />
 * </Web3Required>
 */

import { ReactNode, Suspense, lazy } from 'react'
import { useWeb3Load } from './LazyWeb3Provider'
import { motion } from 'framer-motion'
import { colors } from '../styles/designSystem'

interface Web3RequiredProps {
  children: ReactNode
  fallback?: ReactNode
  /**
   * If true, shows a "Connect Wallet" button that triggers Web3 loading
   * If false, shows just the fallback content
   */
  showConnectButton?: boolean
  /**
   * Custom message to show in the default fallback
   */
  message?: string
}

/**
 * Default fallback shown when Web3 isn't loaded
 */
function DefaultFallback({
  showConnectButton = true,
  message = 'Connect your wallet to access this feature',
  onConnect,
}: {
  showConnectButton?: boolean
  message?: string
  onConnect: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
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
      </div>
      <p className="text-gray-400 mb-4">{message}</p>
      {showConnectButton && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConnect}
            className={`${colors.primaryButton} px-6 py-2`}
          >
            Connect Wallet
          </motion.button>
        </div>
      )}
    </div>
  )
}

/**
 * Loading spinner shown while Web3 providers are loading
 */
function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      <span className="ml-3 text-gray-400">Loading wallet...</span>
    </div>
  )
}

export default function Web3Required({
  children,
  fallback,
  showConnectButton = true,
  message,
}: Web3RequiredProps) {
  const { isWeb3Loaded, isWeb3Loading, triggerWeb3Load } = useWeb3Load()

  // Web3 is loading - show loading state
  if (isWeb3Loading && !isWeb3Loaded) {
    return <LoadingState />
  }

  // Web3 is loaded - render children
  if (isWeb3Loaded) {
    return <>{children}</>
  }

  // Web3 not loaded - show fallback
  if (fallback) {
    return <>{fallback}</>
  }

  // Use default fallback
  return (
    <DefaultFallback
      showConnectButton={showConnectButton}
      message={message}
      onConnect={triggerWeb3Load}
    />
  )
}

/**
 * Higher-order component version for class components or when you
 * want to wrap an entire component
 */
export function withWeb3Required<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<Web3RequiredProps, 'children'>
) {
  return function Web3RequiredWrapper(props: P) {
    return (
      <Web3Required {...options}>
        <WrappedComponent {...props} />
      </Web3Required>
    )
  }
}
