/**
 * useSafeOpenZeppelinTokenDeployment
 *
 * A safe wrapper around useOpenZeppelinTokenDeployment that provides default values
 * when Web3 providers aren't loaded yet. This enables graceful degradation
 * for pages that optionally use Web3 functionality.
 */

import { useWeb3Load } from '../components/LazyWeb3Provider'
import type { TokenData } from './useOpenZeppelinTokenDeployment'

export interface SafeTokenDeploymentResult {
  createToken: (tokenData: TokenData) => Promise<void>
  isCreating: boolean
  isSuccess: boolean
  createdTokenAddress: string | null
  userTokens: any[]
  refetchUserTokens: () => void
  isRefreshing: boolean
  isInitialLoading: boolean
  error: Error | null
  isConnected: boolean
  chainId: number | undefined
  isCorrectChain: boolean
  transactionHash: string | undefined
  isVerifying: boolean
  verificationStatus: 'pending' | 'success' | 'failed' | null
  verificationMethod: 'etherscan' | null
  feeAmount: string
  feeRecipient: string
}

export function useSafeOpenZeppelinTokenDeployment(): SafeTokenDeploymentResult {
  const { isWeb3Loaded, triggerWeb3Load } = useWeb3Load()

  // If Web3 isn't loaded, return safe defaults
  if (!isWeb3Loaded) {
    return {
      createToken: async () => {
        // Trigger Web3 load when user tries to create a token
        triggerWeb3Load()
        throw new Error('Please connect your wallet first')
      },
      isCreating: false,
      isSuccess: false,
      createdTokenAddress: null,
      userTokens: [],
      refetchUserTokens: () => {},
      isRefreshing: false,
      isInitialLoading: false,
      error: null,
      isConnected: false,
      chainId: undefined,
      isCorrectChain: false,
      transactionHash: undefined,
      isVerifying: false,
      verificationStatus: null,
      verificationMethod: null,
      feeAmount: '0.02', // Default fee display
      feeRecipient: '0x0000000000000000000000000000000000000000',
    }
  }

  // Web3 is loaded, use the real hook
  try {
    const { useOpenZeppelinTokenDeployment } = require('./useOpenZeppelinTokenDeployment')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useOpenZeppelinTokenDeployment()
  } catch (e) {
    // Fallback if something goes wrong
    return {
      createToken: async () => {
        throw new Error('Web3 connection error. Please refresh the page.')
      },
      isCreating: false,
      isSuccess: false,
      createdTokenAddress: null,
      userTokens: [],
      refetchUserTokens: () => {},
      isRefreshing: false,
      isInitialLoading: false,
      error: new Error('Failed to load Web3 libraries'),
      isConnected: false,
      chainId: undefined,
      isCorrectChain: false,
      transactionHash: undefined,
      isVerifying: false,
      verificationStatus: null,
      verificationMethod: null,
      feeAmount: '0.02',
      feeRecipient: '0x0000000000000000000000000000000000000000',
    }
  }
}
