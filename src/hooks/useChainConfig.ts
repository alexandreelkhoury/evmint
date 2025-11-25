import { useChainId } from 'wagmi'
import {
  getChainById,
  getChainName,
  getDexContracts,
  getWethAddress,
  getExplorerUrl,
  getTxUrl,
  getAddressUrl,
  getTokenUrl,
  hasUniswapV2,
  hasDexSupport,
  isChainSupported,
  getRpcUrl,
  type ChainConfig,
  type DexConfig,
} from '../config/chains'

/**
 * Hook for accessing chain configuration and helper functions
 * Provides a centralized way to get chain-specific information
 */
export function useChainConfig() {
  const chainId = useChainId()

  /**
   * Get the full chain configuration for current chain
   */
  const getConfig = (): ChainConfig | undefined => {
    return getChainById(chainId)
  }

  /**
   * Get chain name
   */
  const name = getChainName(chainId)

  /**
   * Get chain configuration
   */
  const config = getConfig()

  /**
   * Check if current chain is supported
   */
  const isSupported = isChainSupported(chainId)

  /**
   * Get DEX contract addresses
   */
  const dexContracts = getDexContracts(chainId)

  /**
   * Get WETH address
   */
  const wethAddress = getWethAddress(chainId)

  /**
   * Get explorer base URL
   */
  const explorerUrl = getExplorerUrl(chainId)

  /**
   * Check if chain has Uniswap V2
   */
  const hasV2 = hasUniswapV2(chainId)

  /**
   * Check if chain has any DEX support
   */
  const hasDex = hasDexSupport(chainId)

  /**
   * Get RPC URL (respects environment variables)
   */
  const rpcUrl = getRpcUrl(chainId)

  /**
   * Check if current chain is a testnet
   */
  const isTestnet = config?.category === 'testnet'

  /**
   * Check if current chain is a mainnet
   */
  const isMainnet = config?.category === 'mainnet'

  /**
   * Get chain layer (L1, L2, or sidechain)
   */
  const layer = config?.layer

  /**
   * Get chain icon
   */
  const icon = config?.icon || '⛓️'

  /**
   * Get chain color
   */
  const color = config?.color || '#627EEA'

  /**
   * Get chain gradient
   */
  const gradient = config?.gradient || 'from-blue-500 to-purple-600'

  /**
   * Get transaction URL
   */
  const getTransactionUrl = (txHash: string): string => {
    return getTxUrl(chainId, txHash)
  }

  /**
   * Get address page URL
   */
  const getAddressPageUrl = (address: string): string => {
    return getAddressUrl(chainId, address)
  }

  /**
   * Get token page URL
   */
  const getTokenPageUrl = (tokenAddress: string): string => {
    return getTokenUrl(chainId, tokenAddress)
  }

  /**
   * Get DEXScreener URL for a token
   */
  const getDexScreenerUrl = (tokenAddress: string): string => {
    // DEXScreener format: https://dexscreener.com/{blockchain}/{tokenAddress}
    const blockchainSlug = getDexScreenerSlug(chainId)
    if (!blockchainSlug) return ''
    return `https://dexscreener.com/${blockchainSlug}/${tokenAddress}`
  }

  /**
   * Get Uniswap interface URL for adding liquidity
   */
  const getUniswapUrl = (tokenAddress: string): string => {
    // Uniswap V2 interface URL format
    if (!wethAddress || !hasV2) return ''

    // Different Uniswap deployments for different chains
    if (chainId === 1) {
      // Ethereum mainnet
      return `https://app.uniswap.org/#/add/v2/${wethAddress}/${tokenAddress}`
    } else if (chainId === 8453) {
      // Base
      return `https://app.uniswap.org/#/add/v2/${wethAddress}/${tokenAddress}?chain=base`
    } else if (chainId === 42161) {
      // Arbitrum
      return `https://app.uniswap.org/#/add/v2/${wethAddress}/${tokenAddress}?chain=arbitrum`
    }

    return ''
  }

  /**
   * Get recommended DEX name for this chain
   */
  const getRecommendedDex = (): string | null => {
    if (!dexContracts) return null

    if (dexContracts.uniswapV2Factory) return 'Uniswap V2'
    if (dexContracts.uniswapV3Factory) return 'Uniswap V3'
    if (dexContracts.pancakeswapFactory) return 'PancakeSwap'
    if (dexContracts.quickswapFactory) return 'QuickSwap'
    if (dexContracts.traderJoeFactory) return 'Trader Joe'
    if (dexContracts.spookyswapFactory) return 'SpookySwap'
    if (dexContracts.sushiswapFactory) return 'SushiSwap'

    return null
  }

  /**
   * Get feature support message
   */
  const getFeatureMessage = (): {
    tokenDeployment: string
    liquidity: string
  } => {
    return {
      tokenDeployment: config?.features.tokenDeployment
        ? `✅ Token deployment supported on ${name}`
        : `⚠️ Token deployment not available on ${name}`,
      liquidity: hasDex
        ? `✅ Liquidity available via ${getRecommendedDex()}`
        : `⚠️ No DEX support on ${name} - tokens can be created but liquidity cannot be added`,
    }
  }

  /**
   * Get native token name (ETH, BNB, AVAX, etc.)
   */
  const getNativeTokenName = (): string => {
    // Use chain config's native currency symbol if available
    if (config?.nativeCurrency?.symbol) {
      return config.nativeCurrency.symbol
    }

    // Fallback to hardcoded values
    switch (chainId) {
      case 1: // Ethereum
      case 11155111: // Sepolia
      case 8453: // Base
      case 84532: // Base Sepolia
      case 42161: // Arbitrum
      case 421614: // Arbitrum Sepolia
      case 10: // Optimism
      case 11155420: // Optimism Sepolia
      case 480: // World Chain
      case 81457: // Blast
      case 168587773: // Blast Sepolia
        return 'ETH'
      case 137: // Polygon
      case 80002: // Polygon Amoy
        return 'MATIC'
      case 56: // BSC
      case 97: // BSC Testnet
        return 'BNB'
      case 43114: // Avalanche
      case 43113: // Avalanche Fuji
        return 'AVAX'
      case 250: // Fantom
      case 4002: // Fantom Testnet
        return 'FTM'
      case 100: // Gnosis
        return 'xDAI'
      case 1284: // Moonbeam
      case 1287: // Moonbase Alpha
        return 'GLMR'
      case 143: // Monad
        return 'MON'
      default:
        return 'ETH'
    }
  }

  /**
   * Get wrapped native token name (WETH, WBNB, WAVAX, etc.)
   */
  const getWrappedTokenName = (): string => {
    const native = getNativeTokenName()
    return `W${native}`
  }

  return {
    // Current chain info
    chainId,
    name,
    config,
    isSupported,
    isTestnet,
    isMainnet,
    layer,

    // Visual
    icon,
    color,
    gradient,

    // Contracts
    dexContracts,
    wethAddress,
    rpcUrl,

    // Features
    hasV2,
    hasDex,

    // Explorer
    explorerUrl,
    getTransactionUrl,
    getAddressPageUrl,
    getTokenPageUrl,

    // DEX info
    getDexScreenerUrl,
    getUniswapUrl,
    getRecommendedDex,

    // Tokens
    getNativeTokenName,
    getWrappedTokenName,

    // Helpers
    getFeatureMessage,
  }
}

/**
 * Helper function to get DEXScreener blockchain slug
 */
function getDexScreenerSlug(chainId: number): string | null {
  switch (chainId) {
    case 1:
      return 'ethereum'
    case 8453:
      return 'base'
    case 42161:
      return 'arbitrum'
    case 10:
      return 'optimism'
    case 137:
      return 'polygon'
    case 56:
      return 'bsc'
    case 43114:
      return 'avalanche'
    case 250:
      return 'fantom'
    default:
      return null
  }
}

/**
 * Hook for getting chain config by specific chain ID (not current chain)
 */
export function useSpecificChainConfig(specificChainId: number) {
  const config = getChainById(specificChainId)
  const name = getChainName(specificChainId)
  const isSupported = isChainSupported(specificChainId)
  const dexContracts = getDexContracts(specificChainId)
  const hasV2 = hasUniswapV2(specificChainId)
  const hasDex = hasDexSupport(specificChainId)

  return {
    chainId: specificChainId,
    name,
    config,
    isSupported,
    hasV2,
    hasDex,
    dexContracts,
    icon: config?.icon || '⛓️',
    color: config?.color || '#627EEA',
    gradient: config?.gradient || 'from-blue-500 to-purple-600',
    isTestnet: config?.category === 'testnet',
    isMainnet: config?.category === 'mainnet',
  }
}
