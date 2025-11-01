import { getChainById, isChainSupported } from '../../config/chains'

/**
 * Get block explorer API key for a specific chain
 */
export function getApiKey(chainId: number): string | null {
  const chain = getChainById(chainId)
  if (!chain || !chain.explorer.apiKeyEnvVar) return null

  return import.meta.env[chain.explorer.apiKeyEnvVar] || null
}

/**
 * Get block explorer API URL for a specific chain
 */
export function getApiUrl(chainId: number): string | null {
  const chain = getChainById(chainId)
  return chain?.explorer.apiUrl || null
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
 * Build verification API URL based on explorer type
 * Different explorers use different URL patterns (Etherscan V2, Basescan V2, etc.)
 */
export function buildVerificationUrl(chainId: number, apiKey: string): string | null {
  const apiUrl = getApiUrl(chainId)
  if (!apiUrl) return null

  // Etherscan V2 supports multiple chains with chainid parameter
  if (apiUrl.includes('etherscan.io')) {
    return `https://api.etherscan.io/v2/api?chainid=${chainId}&module=contract&action=verifysourcecode&apikey=${apiKey}`
  }

  // Basescan also uses V2 API
  if (apiUrl.includes('basescan.org')) {
    return `https://api.basescan.org/v2/api?chainid=${chainId}&module=contract&action=verifysourcecode&apikey=${apiKey}`
  }

  // Other explorers use their own API endpoints
  return `${apiUrl}?module=contract&action=verifysourcecode&apikey=${apiKey}`
}

/**
 * Build status check API URL based on explorer type
 */
export function buildStatusCheckUrl(chainId: number, guid: string, apiKey: string): string | null {
  const apiUrl = getApiUrl(chainId)
  if (!apiUrl) return null

  // Etherscan V2 API
  if (apiUrl.includes('etherscan.io')) {
    return `https://api.etherscan.io/v2/api?chainid=${chainId}&module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}`
  }

  // Basescan V2 API
  if (apiUrl.includes('basescan.org')) {
    return `https://api.basescan.org/v2/api?chainid=${chainId}&module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}`
  }

  // Other explorers
  return `${apiUrl}?module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}`
}
