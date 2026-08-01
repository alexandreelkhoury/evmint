/**
 * useSafePrivy
 *
 * A safe wrapper that provides Web3-related state without breaking
 * when Web3 providers aren't loaded. When Web3 is loaded, it delegates
 * to the real hooks. When not loaded, it returns safe defaults.
 *
 * PATTERN: This uses a "deferred hook" pattern where the hook behavior
 * changes based on whether Web3 is in the React tree.
 */

import { useWeb3Load } from '../components/LazyWeb3Provider'

// Define the shape of what we return
export interface SafePrivyResult {
  ready: boolean
  authenticated: boolean
  user: any
  login: () => void
  logout: () => void
}

/**
 * useSafePrivy - Returns safe defaults when Web3 isn't loaded
 *
 * When Web3 IS loaded, the component using this hook should be
 * inside the PrivyProvider tree, so it can access the real hook.
 * The recommended pattern is to use Web3Required wrapper.
 */
export function useSafePrivy(): SafePrivyResult {
  const { isWeb3Loaded, triggerWeb3Load } = useWeb3Load()

  // When Web3 isn't loaded, return defaults that trigger loading on interaction
  if (!isWeb3Loaded) {
    return {
      ready: false,
      authenticated: false,
      user: null,
      login: triggerWeb3Load, // Clicking login triggers Web3 load
      logout: () => {},
    }
  }

  // When Web3 IS loaded, we're inside the PrivyProvider tree
  // We can safely use require because the module is already loaded
  // Note: The component will re-render when Web3 loads, and by then
  // it's inside the PrivyProvider context
  try {
    const { usePrivy } = require('@privy-io/react-auth')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const privyResult = usePrivy()
    return {
      ready: privyResult.ready,
      authenticated: privyResult.authenticated,
      user: privyResult.user,
      login: privyResult.login,
      logout: privyResult.logout,
    }
  } catch {
    // Fallback if hook call fails
    return {
      ready: false,
      authenticated: false,
      user: null,
      login: triggerWeb3Load,
      logout: () => {},
    }
  }
}

/**
 * Safe wrapper for useWallets
 */
export interface SafeWalletsResult {
  wallets: any[]
}

export function useSafeWallets(): SafeWalletsResult {
  const { isWeb3Loaded } = useWeb3Load()

  if (!isWeb3Loaded) {
    return { wallets: [] }
  }

  try {
    const { useWallets } = require('@privy-io/react-auth')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useWallets()
  } catch {
    return { wallets: [] }
  }
}

/**
 * Safe wrapper for useAccount from wagmi
 */
export interface SafeAccountResult {
  address: string | undefined
  isConnected: boolean
  chain: any | undefined
}

export function useSafeAccount(): SafeAccountResult {
  const { isWeb3Loaded } = useWeb3Load()

  if (!isWeb3Loaded) {
    return {
      address: undefined,
      isConnected: false,
      chain: undefined,
    }
  }

  try {
    const { useAccount } = require('wagmi')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAccount()
  } catch {
    return {
      address: undefined,
      isConnected: false,
      chain: undefined,
    }
  }
}

/**
 * Safe wrapper for useChainId from wagmi
 */
export function useSafeChainId(): number | undefined {
  const { isWeb3Loaded } = useWeb3Load()

  if (!isWeb3Loaded) {
    return undefined
  }

  try {
    const { useChainId } = require('wagmi')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useChainId()
  } catch {
    return undefined
  }
}
