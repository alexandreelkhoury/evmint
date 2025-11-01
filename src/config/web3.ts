import { http } from 'wagmi'
import { createConfig } from '@privy-io/wagmi'
import {
  ALL_CHAINS,
  baseConfig,
  getRpcUrl,
  type ChainConfig,
} from './chains'

/**
 * CRITICAL: Privy requires that wagmi chains EXACTLY match Privy's supportedChains
 * We use @privy-io/wagmi's createConfig to ensure proper integration
 */

/**
 * Build transports for all supported chains
 * Uses environment variables when available, falls back to public RPCs
 */
const buildTransports = () => {
  const transports: Record<number, ReturnType<typeof http>> = {}

  ALL_CHAINS.forEach((chain: ChainConfig) => {
    const rpcUrl = getRpcUrl(chain.id)
    transports[chain.id] = http(rpcUrl || undefined)
  })

  return transports
}

/**
 * Wagmi configuration using Privy's custom createConfig
 * This ensures Privy can drive wagmi's connector state and keep them in sync
 */
export const wagmiConfig = createConfig({
  chains: ALL_CHAINS as any, // Type assertion needed for Privy's createConfig
  transports: buildTransports(),
})

/**
 * Privy configuration
 * IMPORTANT: supportedChains must match wagmi chains array
 */
export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'cmeigbb8q00u5ky0bv70pell5',
  config: {
    appearance: {
      theme: 'dark',
      accentColor: '#3B82F6',
      showWalletLoginFirst: false,
    },
    embeddedWallets: {
      createOnLogin: 'off',
    },
    loginMethods: ['email', 'wallet', 'google'],
    // Default to Base mainnet as primary chain
    defaultChain: baseConfig,
    // CRITICAL: This must exactly match wagmi's chains array
    supportedChains: ALL_CHAINS,
    // Enable wallet modal features
    walletConnectCloudProjectId: 'your-project-id', // Optional for WalletConnect
  },
}

/**
 * Export chain list for components that need it
 */
export { ALL_CHAINS } from './chains'