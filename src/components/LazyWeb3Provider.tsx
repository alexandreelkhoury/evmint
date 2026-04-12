/**
 * LazyWeb3Provider
 *
 * Lazy loads Web3 providers (Privy, Wagmi, React Query) only when needed.
 * This dramatically reduces initial bundle size by deferring the ~2.5MB Web3 bundle.
 *
 * The provider is loaded when:
 * 1. User clicks "Connect Wallet" button
 * 2. User navigates to a page requiring Web3 (e.g., /create, /liquidity)
 *
 * Expected performance improvement:
 * - FCP: 2.5-3.5s -> 1.0-1.5s
 * - Bundle reduction: ~1.8MB+ on initial load
 */

import { ReactNode, Suspense, lazy, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Lazy load the actual Privy/Wagmi provider
const PrivyProviderLazy = lazy(() =>
  import('./PrivyProvider').then((module) => ({
    default: module.default,
  }))
)

// Routes that require Web3 to be loaded immediately
// Note: '/' uses exact match; others use prefix match
const WEB3_EXACT_ROUTES = ['/']
const WEB3_PREFIX_ROUTES = ['/create', '/tokens', '/liquidity', '/token/']

interface LazyWeb3ProviderProps {
  children: ReactNode
}

// Non-blocking loading indicator — shown as a small top bar, not a fullscreen blocker
function Web3LoadingBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[9999] h-0.5"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

// Minimal stub provider for when Web3 is not loaded
function StubWeb3Provider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Context for triggering Web3 load
import { createContext, useContext } from 'react'

interface Web3LoadContextValue {
  isWeb3Loaded: boolean
  isWeb3Loading: boolean
  triggerWeb3Load: () => void
}

const Web3LoadContext = createContext<Web3LoadContextValue>({
  isWeb3Loaded: false,
  isWeb3Loading: false,
  triggerWeb3Load: () => {},
})

export function useWeb3Load() {
  return useContext(Web3LoadContext)
}

export default function LazyWeb3Provider({ children }: LazyWeb3ProviderProps) {
  const [isWeb3Loaded, setIsWeb3Loaded] = useState(false)
  const [isWeb3Loading, setIsWeb3Loading] = useState(false)
  const [shouldLoadWeb3, setShouldLoadWeb3] = useState(false)
  const location = useLocation()

  // Check if current route requires Web3 (exact match for '/', prefix for others)
  const routeRequiresWeb3 =
    WEB3_EXACT_ROUTES.includes(location.pathname) ||
    WEB3_PREFIX_ROUTES.some((route) => location.pathname.startsWith(route))

  // Trigger Web3 load when:
  // 1. Route requires it
  // 2. User explicitly requests it (via triggerWeb3Load)
  useEffect(() => {
    if (routeRequiresWeb3 && !isWeb3Loaded && !isWeb3Loading) {
      setShouldLoadWeb3(true)
      setIsWeb3Loading(true)
    }
  }, [routeRequiresWeb3, isWeb3Loaded, isWeb3Loading])

  // Handle loading completion
  const handleLoadComplete = useCallback(() => {
    setIsWeb3Loaded(true)
    setIsWeb3Loading(false)
  }, [])

  // Function to trigger Web3 load (called by WalletButton)
  const triggerWeb3Load = useCallback(() => {
    if (!isWeb3Loaded && !isWeb3Loading) {
      setShouldLoadWeb3(true)
      setIsWeb3Loading(true)
    }
  }, [isWeb3Loaded, isWeb3Loading])

  const contextValue: Web3LoadContextValue = {
    isWeb3Loaded,
    isWeb3Loading,
    triggerWeb3Load,
  }

  // If Web3 should be loaded, render the lazy provider with non-blocking loading
  if (shouldLoadWeb3) {
    return (
      <Web3LoadContext.Provider value={contextValue}>
        <Suspense
          fallback={
            <>
              <Web3LoadingBar />
              {children}
            </>
          }
        >
          <PrivyProviderWrapper onLoad={handleLoadComplete}>
            {children}
          </PrivyProviderWrapper>
        </Suspense>
      </Web3LoadContext.Provider>
    )
  }

  // Otherwise, render stub provider (no Web3 functionality)
  return (
    <Web3LoadContext.Provider value={contextValue}>
      <StubWeb3Provider>
        {children}
      </StubWeb3Provider>
    </Web3LoadContext.Provider>
  )
}

// Wrapper to detect when Privy is loaded
function PrivyProviderWrapper({
  children,
  onLoad,
}: {
  children: ReactNode
  onLoad: () => void
}) {
  useEffect(() => {
    // Call onLoad once the component mounts (meaning the lazy load completed)
    onLoad()
  }, [onLoad])

  return <PrivyProviderLazy>{children}</PrivyProviderLazy>
}
