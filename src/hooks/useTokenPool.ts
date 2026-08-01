import { useState, useEffect, useCallback } from 'react'
import {
  fetchTokenPools,
  fetchTokenInfo,
  buildChartEmbedUrl,
  getGeckoNetworkId,
  type GeckoPoolData,
  type GeckoTokenInfo,
  GeckoNotFoundError,
} from '../services/geckoTerminal'

export interface TokenPoolState {
  pool: GeckoPoolData | null
  tokenInfo: GeckoTokenInfo | null
  chartEmbedUrl: string | null
  isTokenBase: boolean
  loading: boolean
  error: string | null
  notIndexed: boolean
  retry: () => void
}

/**
 * Hook to discover the best pool for a token and load token metadata.
 * Auto-selects the highest-volume pool where the token is base or quote.
 */
export function useTokenPool(
  tokenAddress: string | undefined,
  chainId: number
): TokenPoolState {
  const [pool, setPool] = useState<GeckoPoolData | null>(null)
  const [tokenInfo, setTokenInfo] = useState<GeckoTokenInfo | null>(null)
  const [chartEmbedUrl, setChartEmbedUrl] = useState<string | null>(null)
  const [isTokenBase, setIsTokenBase] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notIndexed, setNotIndexed] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const networkId = getGeckoNetworkId(chainId)

  const fetchData = useCallback(async () => {
    if (!tokenAddress || !networkId) {
      setLoading(false)
      setError(networkId ? 'No token address provided' : 'Unsupported network')
      return
    }

    setLoading(true)
    setError(null)
    setNotIndexed(false)

    try {
      // Fetch pools and token info in parallel
      const [pools, info] = await Promise.all([
        fetchTokenPools(networkId, tokenAddress.toLowerCase()),
        fetchTokenInfo(networkId, tokenAddress.toLowerCase()),
      ])

      if (pools.length === 0) {
        setNotIndexed(true)
        setLoading(false)
        return
      }

      // Pick the best pool (first one — already sorted by volume by GeckoTerminal)
      const bestPool = pools[0]
      setPool(bestPool)
      setTokenInfo(info)

      // Determine if our token is the base or quote token
      const baseTokenId = bestPool.relationships.base_token.data.id
      const tokenAddr = tokenAddress.toLowerCase()
      const baseIsOurs = baseTokenId.toLowerCase().includes(tokenAddr)
      setIsTokenBase(baseIsOurs)

      // Build chart embed URL (pass tokenAddress so chart always shows our token's perspective)
      const embedUrl = buildChartEmbedUrl(chainId, bestPool.attributes.address, tokenAddress)
      setChartEmbedUrl(embedUrl)
    } catch (err) {
      if (err instanceof GeckoNotFoundError) {
        setNotIndexed(true)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load token data')
      }
    } finally {
      setLoading(false)
    }
  }, [tokenAddress, networkId, chainId, retryCount])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1)
  }, [])

  return {
    pool,
    tokenInfo,
    chartEmbedUrl,
    isTokenBase,
    loading,
    error,
    notIndexed,
    retry,
  }
}
