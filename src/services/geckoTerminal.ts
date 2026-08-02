/**
 * GeckoTerminal API Service
 * Free public API for pool discovery, trade data, and token info.
 * Rate limit: 30 req/min. Uses stale-while-revalidate caching.
 */

const BASE_URL = 'https://api.geckoterminal.com/api/v2'

// Chain ID → GeckoTerminal network slug
export const GECKO_NETWORKS: Record<number, string> = {
  1: 'eth',
  42161: 'arbitrum',
  10: 'optimism',
  137: 'polygon_pos',
  56: 'bsc',
  43114: 'avalanche',
  8453: 'base',
  59144: 'linea',
  534352: 'scroll',
  324: 'zksync',
  81457: 'blast',
  5000: 'mantle',
  250: 'fantom',
  100: 'gnosis',
  1284: 'moonbeam',
  480: 'world-chain',
}

// GeckoTerminal network slug for chart embeds (slightly different format)
export const GECKO_CHART_NETWORKS: Record<number, string> = {
  1: 'eth',
  42161: 'arbitrum',
  10: 'optimism',
  137: 'polygon_pos',
  56: 'bsc',
  43114: 'avax',
  8453: 'base',
  59144: 'linea',
  534352: 'scroll',
  324: 'zksync',
  81457: 'blast',
  5000: 'mantle',
  250: 'ftm',
  100: 'xdai',
  1284: 'moonbeam',
  480: 'world-chain',
}

/**
 * Chain ID -> DEXScreener path slug. Separate from the GeckoTerminal maps
 * above: DEXScreener covers chains our own token page cannot render, which is
 * exactly why it is the fallback when getGeckoNetworkId() returns null.
 */
export const DEXSCREENER_SLUGS: Record<number, string> = {
  1: 'ethereum',
  8453: 'base',
  42161: 'arbitrum',
  10: 'optimism',
  137: 'polygon',
  56: 'bsc',
  43114: 'avalanche',
  250: 'fantom',
  100: 'gnosis',
  1284: 'moonbeam',
  81457: 'blast',
  480: 'worldchain',
  143: 'monad',
  4663: 'robinhoodchain',
}

/**
 * Where to send someone who wants to trade or chart a token.
 *
 *   internal -> our own /token page (chart + trades + swap)
 *   external -> DEXScreener, for chains GeckoTerminal does not index
 *   null     -> we have nowhere credible to send them; hide the affordance
 *
 * Callers must handle the null case rather than falling back to a default
 * chain: a link to the wrong network is worse than no link.
 */
export function getTokenMarketLink(
  chainId: number,
  tokenAddress: string
): { href: string; external: boolean } | null {
  if (getGeckoNetworkId(chainId)) {
    return { href: `/token/${tokenAddress.toLowerCase()}?chain=${chainId}`, external: false }
  }
  const slug = DEXSCREENER_SLUGS[chainId]
  if (slug) {
    return { href: `https://dexscreener.com/${slug}/${tokenAddress}`, external: true }
  }
  return null
}

export function getGeckoNetworkId(chainId: number): string | null {
  return GECKO_NETWORKS[chainId] ?? null
}

export function getGeckoChartNetworkId(chainId: number): string | null {
  return GECKO_CHART_NETWORKS[chainId] ?? null
}

// Simple in-memory cache with TTL
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 15_000 // 15 seconds

async function fetchWithCache<T>(url: string, ttl = CACHE_TTL): Promise<T> {
  const cached = cache.get(url)
  const now = Date.now()

  if (cached && now - cached.timestamp < ttl) {
    return cached.data as T
  }

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new GeckoNotFoundError('Token not yet indexed on GeckoTerminal')
    }
    if (response.status === 429) {
      // Rate limited — return stale data if available
      if (cached) return cached.data as T
      throw new GeckoRateLimitError('Rate limited. Please wait a moment.')
    }
    throw new Error(`GeckoTerminal API error: ${response.status}`)
  }

  const data = await response.json()
  cache.set(url, { data, timestamp: now })
  return data as T
}

export class GeckoNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeckoNotFoundError'
  }
}

export class GeckoRateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeckoRateLimitError'
  }
}

// ─── Types ───────────────────────────────────────────────────────

export interface GeckoPoolData {
  id: string
  type: string
  attributes: {
    name: string
    address: string
    base_token_price_usd: string | null
    quote_token_price_usd: string | null
    base_token_price_native_currency: string | null
    fdv_usd: string | null
    market_cap_usd: string | null
    price_change_percentage: {
      h1: string | null
      h6: string | null
      h24: string | null
    }
    volume_usd: {
      h1: string | null
      h6: string | null
      h24: string | null
    }
    reserve_in_usd: string | null
    pool_created_at: string | null
  }
  relationships: {
    base_token: { data: { id: string } }
    quote_token: { data: { id: string } }
    dex: { data: { id: string } }
  }
}

export interface GeckoTradeData {
  id: string
  type: string
  attributes: {
    block_number: number
    block_timestamp: string
    tx_hash: string
    tx_from_address: string
    from_token_amount: string
    to_token_amount: string
    price_from_in_currency_token: string | null
    price_to_in_currency_token: string | null
    price_from_in_usd: string | null
    price_to_in_usd: string | null
    volume_in_usd: string
    kind: 'buy' | 'sell'
  }
}

export interface GeckoTokenInfo {
  id: string
  type: string
  attributes: {
    name: string
    symbol: string
    address: string
    decimals: number
    image_url: string | null
    coingecko_coin_id: string | null
    description: string | null
    websites: string[]
    discord_url: string | null
    telegram_handle: string | null
    twitter_handle: string | null
  }
}

// ─── API Functions ───────────────────────────────────────────────

/**
 * Discover the best pool for a token (highest volume)
 */
export async function fetchTokenPools(
  networkId: string,
  tokenAddress: string
): Promise<GeckoPoolData[]> {
  const url = `${BASE_URL}/networks/${networkId}/tokens/${tokenAddress}/pools?page=1`
  const response = await fetchWithCache<{ data: GeckoPoolData[] }>(url)
  return response.data ?? []
}

/**
 * Fetch recent trades for a pool
 */
export async function fetchPoolTrades(
  networkId: string,
  poolAddress: string
): Promise<GeckoTradeData[]> {
  const url = `${BASE_URL}/networks/${networkId}/pools/${poolAddress}/trades?trade_volume_in_usd_greater_than=0`
  const response = await fetchWithCache<{ data: GeckoTradeData[] }>(url, 10_000) // 10s cache for trades
  return response.data ?? []
}

/**
 * Fetch token metadata (name, symbol, image, socials)
 */
export async function fetchTokenInfo(
  networkId: string,
  tokenAddress: string
): Promise<GeckoTokenInfo | null> {
  try {
    const url = `${BASE_URL}/networks/${networkId}/tokens/${tokenAddress}/info`
    const response = await fetchWithCache<{ data: GeckoTokenInfo }>(url, 60_000) // 60s cache for info
    return response.data ?? null
  } catch {
    return null
  }
}

/**
 * Build the GeckoTerminal chart embed URL.
 * Always includes &token_address= so the chart shows price from
 * the correct token's perspective (crucial when our token is the
 * quote token in the pool, e.g. USDC in WETH/USDC).
 */
export function buildChartEmbedUrl(
  chainId: number,
  poolAddress: string,
  tokenAddress: string
): string | null {
  const network = getGeckoChartNetworkId(chainId)
  if (!network) return null
  return `https://www.geckoterminal.com/${network}/pools/${poolAddress}?embed=1&info=0&swaps=0&light_chart=0&token_address=${tokenAddress.toLowerCase()}`
}

// ─── Formatting Helpers ──────────────────────────────────────────

export function formatTokenAmount(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  if (num >= 1) return num.toFixed(2)
  if (num >= 0.0001) return num.toFixed(4)
  return num.toExponential(2)
}

export function formatUsd(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '$0.00'

  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
  if (num >= 0.01) return `$${num.toFixed(2)}`
  if (num >= 0.0001) return `$${num.toFixed(4)}`
  if (num > 0) return `$${num.toExponential(2)}`
  return '$0.00'
}

export function timeAgo(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diff = Math.max(0, Math.floor((now - then) / 1000))

  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export function abbreviateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}..${addr.slice(-4)}`
}
