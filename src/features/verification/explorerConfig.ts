import { getChainById, isChainSupported } from '../../config/chains'

/**
 * Etherscan V2 Unified API
 * All chains use the same endpoint with chainid parameter
 * See: https://api.etherscan.io/v2/chainlist for supported chains
 */
const ETHERSCAN_V2_API = 'https://api.etherscan.io/v2/api'

/**
 * Check if a chain uses Blockscout as its explorer
 */
export function isBlockscoutChain(chainId: number): boolean {
  const chain = getChainById(chainId)
  return chain?.explorer.type === 'blockscout'
}

/**
 * Get block explorer API key for a specific chain
 * Blockscout chains don't require an API key
 * All Etherscan chains use the same Etherscan API key with V2 API
 */
export function getApiKey(chainId: number): string | null {
  // Blockscout chains don't need an API key
  if (isBlockscoutChain(chainId)) return ''

  // Etherscan V2 uses a single API key for all chains
  const etherscanKey = import.meta.env.VITE_ETHERSCAN_API_KEY
  if (etherscanKey) return etherscanKey

  // Fallback to Basescan key (works with Etherscan V2 unified API)
  const basescanKey = import.meta.env.VITE_BASESCAN_API_KEY
  if (basescanKey) return basescanKey

  // Fallback to chain-specific key if configured
  const chain = getChainById(chainId)
  if (!chain || !chain.explorer.apiKeyEnvVar) return null

  return import.meta.env[chain.explorer.apiKeyEnvVar] || null
}

/**
 * Check if a chain is supported for verification
 */
export function isVerificationSupported(chainId: number): boolean {
  return isChainSupported(chainId)
}

/**
 * Get chain name for error messages
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.name || 'this network'
}

/**
 * Build verification API URL
 * Routes to Blockscout's Etherscan-compatible API for Blockscout chains,
 * or Etherscan V2 unified API for all others
 */
export function buildVerificationUrl(chainId: number, apiKey: string | null): string {
  if (isBlockscoutChain(chainId)) {
    const chain = getChainById(chainId)!
    return `${chain.explorer.apiUrl}?module=contract&action=verifysourcecode`
  }
  return `${ETHERSCAN_V2_API}?chainid=${chainId}&module=contract&action=verifysourcecode&apikey=${apiKey}`
}

/**
 * Build status check API URL
 * Routes to Blockscout or Etherscan V2 based on chain type
 */
export function buildStatusCheckUrl(chainId: number, guid: string, apiKey: string | null): string {
  if (isBlockscoutChain(chainId)) {
    const chain = getChainById(chainId)!
    return `${chain.explorer.apiUrl}?module=contract&action=checkverifystatus&guid=${guid}`
  }
  return `${ETHERSCAN_V2_API}?chainid=${chainId}&module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}`
}
