import { useState, useEffect, useRef, useCallback } from 'react'
import {
  fetchPoolTrades,
  getGeckoNetworkId,
  type GeckoTradeData,
} from '../services/geckoTerminal'

const POLL_INTERVAL = 15_000 // 15 seconds
const MAX_TRADES = 30

export interface RecentTradesState {
  trades: GeckoTradeData[]
  newTradeIds: Set<string>
  buyCount: number
  sellCount: number
  loading: boolean
  error: string | null
}

/**
 * Polls GeckoTerminal /trades every 15s. Deduplicates on tx_hash.
 * Tracks newly added trade IDs for entrance animations.
 */
export function useRecentTrades(
  poolAddress: string | undefined,
  chainId: number
): RecentTradesState {
  const [trades, setTrades] = useState<GeckoTradeData[]>([])
  const [newTradeIds, setNewTradeIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const knownTxHashes = useRef<Set<string>>(new Set())
  const isFirstFetch = useRef(true)

  const networkId = getGeckoNetworkId(chainId)

  const fetchTrades = useCallback(async () => {
    if (!poolAddress || !networkId) return

    try {
      const data = await fetchPoolTrades(networkId, poolAddress)

      // Deduplicate by tx_hash
      const seen = new Set<string>()
      const uniqueTrades: GeckoTradeData[] = []

      for (const trade of data) {
        const hash = trade.attributes.tx_hash
        if (!seen.has(hash)) {
          seen.add(hash)
          uniqueTrades.push(trade)
        }
      }

      // Find new trades (only after first fetch)
      const newIds = new Set<string>()
      if (!isFirstFetch.current) {
        for (const trade of uniqueTrades) {
          if (!knownTxHashes.current.has(trade.attributes.tx_hash)) {
            newIds.add(trade.id)
          }
        }
      }

      // Update known hashes
      for (const trade of uniqueTrades) {
        knownTxHashes.current.add(trade.attributes.tx_hash)
      }

      isFirstFetch.current = false
      setTrades(uniqueTrades.slice(0, MAX_TRADES))
      setNewTradeIds(newIds)
      setError(null)

      // Clear new trade highlights after animation
      if (newIds.size > 0) {
        setTimeout(() => setNewTradeIds(new Set()), 2000)
      }
    } catch (err) {
      // Don't overwrite existing trades on poll failure
      if (trades.length === 0) {
        setError(err instanceof Error ? err.message : 'Failed to load trades')
      }
    } finally {
      setLoading(false)
    }
  }, [poolAddress, networkId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!poolAddress || !networkId) {
      setLoading(false)
      return
    }

    // Initial fetch
    setLoading(true)
    isFirstFetch.current = true
    knownTxHashes.current.clear()
    fetchTrades()

    // Poll every 15s
    const interval = setInterval(fetchTrades, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [poolAddress, networkId, fetchTrades])

  const buyCount = trades.filter((t) => t.attributes.kind === 'buy').length
  const sellCount = trades.filter((t) => t.attributes.kind === 'sell').length

  return { trades, newTradeIds, buyCount, sellCount, loading, error }
}
