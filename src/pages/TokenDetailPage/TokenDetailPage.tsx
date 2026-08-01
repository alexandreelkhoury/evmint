import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useChainId } from 'wagmi'
import { useTokenPool } from '../../hooks/useTokenPool'
import { useRecentTrades } from '../../hooks/useRecentTrades'
import { getGeckoNetworkId } from '../../services/geckoTerminal'
import { getChainById, getChainName } from '../../config/chains'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView } from '../../utils/analytics'
import { colors } from '../../styles/designSystem'
import Breadcrumb from '../../components/Breadcrumb'
import SEO from '../../components/SEO'
import TokenHeader from './components/TokenHeader'
import ChartEmbed from './components/ChartEmbed'
import SwapPanel from './components/SwapPanel'
import PoolStats from './components/PoolStats'
import ActivityTable from './components/ActivityTable'

// Chain ID can be passed as ?chain= query param, defaults to wallet chain
const CHAIN_ID_MAP: Record<string, number> = {
  eth: 1,
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  optimism: 10,
  polygon: 137,
  bsc: 56,
  avalanche: 43114,
  fantom: 250,
  gnosis: 100,
  moonbeam: 1284,
  blast: 81457,
  linea: 59144,
  scroll: 534352,
  zksync: 324,
  mantle: 5000,
  robinhood: 4663,
  monad: 143,
  megaeth: 4326,
}

export default function TokenDetailPage() {
  const { address: tokenAddress } = useParams<{ address: string }>()
  const [searchParams] = useSearchParams()
  const walletChainId = useChainId()
  const analytics = useFirebaseAnalytics()
  const prefersReducedMotion = useReducedMotion()

  // Issue #7: Track native token price for accurate swap estimates
  const [nativeTokenPriceUsd, setNativeTokenPriceUsd] = useState<number | null>(null)

  // Resolve chain ID from ?chain= param or wallet
  const chainId = useMemo(() => {
    const chainParam = searchParams.get('chain')
    if (chainParam) {
      const num = parseInt(chainParam, 10)
      if (!isNaN(num) && getGeckoNetworkId(num)) return num
      const mapped = CHAIN_ID_MAP[chainParam.toLowerCase()]
      if (mapped) return mapped
    }
    return walletChainId
  }, [searchParams, walletChainId])

  const networkId = getGeckoNetworkId(chainId)
  const chainName = getChainName(chainId)

  // Data hooks
  const {
    pool,
    tokenInfo,
    chartEmbedUrl,
    isTokenBase,
    loading: poolLoading,
    error: poolError,
    notIndexed,
    retry,
  } = useTokenPool(tokenAddress, chainId)

  const {
    trades,
    newTradeIds,
    buyCount,
    sellCount,
    loading: tradesLoading,
    error: tradesError,
  } = useRecentTrades(pool?.attributes.address, chainId)

  // Analytics
  useEffect(() => {
    trackPageView(analytics, 'token-detail')
  }, [analytics])

  // Issue #7: Fetch native token price for accurate swap quotes
  useEffect(() => {
    if (!networkId) return
    const chainConfig = getChainById(chainId)
    const wethAddress = chainConfig?.weth
    if (!wethAddress) return

    fetch(`https://api.geckoterminal.com/api/v2/simple/networks/${networkId}/token_price/${wethAddress}`)
      .then(r => r.json())
      .then(data => {
        const prices = data?.data?.attributes?.token_prices
        if (prices) {
          const priceStr = Object.values(prices)[0] as string
          if (priceStr) setNativeTokenPriceUsd(parseFloat(priceStr))
        }
      })
      .catch(() => {})
  }, [networkId, chainId])

  // Derived data
  const tokenSymbol = tokenInfo?.attributes.symbol || pool?.attributes.name?.split(' / ')[0] || 'TOKEN'
  const priceUsd = isTokenBase
    ? pool?.attributes.base_token_price_usd ?? null
    : pool?.attributes.quote_token_price_usd ?? null

  // Unsupported network
  if (!networkId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Unsupported Network</h1>
            <p className="text-gray-400 font-sans">
              {chainName} is not supported for token analytics. Please switch to a supported EVM chain.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Not indexed state
  if (notIndexed && !poolLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        <BackgroundBlobs />
        <SEO
          title={`Token ${tokenAddress?.slice(0, 8)}... | EVMint`}
          description="View live token data, chart, and trade activity."
          canonical={`/token/${tokenAddress}`}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Tokens', href: '/tokens' },
            { label: tokenAddress?.slice(0, 10) + '...' || 'Token' },
          ]} />
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Token Not Yet Indexed</h1>
            <p className="text-gray-400 font-sans max-w-md mx-auto mb-6">
              This token hasn't been indexed on GeckoTerminal yet. Activity will appear after the first trade is detected.
            </p>
            <button
              onClick={retry}
              className={`px-6 py-3 ${colors.primaryButton} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (poolError && !poolLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        <BackgroundBlobs />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Error Loading Token</h1>
            <p className="text-gray-400 font-sans mb-6">{poolError}</p>
            <button
              onClick={retry}
              className={`px-6 py-3 ${colors.primaryButton} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Issue #5: Full-page loading skeleton
  if (poolLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        <BackgroundBlobs />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8 pt-4">
            <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-3 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-3 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Header skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
            <div className="flex-1">
              <div className="h-7 w-48 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="text-right">
              <div className="h-7 w-24 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-16 bg-white/5 rounded animate-pulse ml-auto" />
            </div>
          </div>

          {/* Chart + Sidebar skeleton */}
          <div className="flex flex-col lg:flex-row gap-5 mb-5">
            <div className="flex-1 min-w-0">
              <div className="w-full aspect-[16/9] min-h-[400px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            </div>
            <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-5">
              <div className={colors.glassCard + ' p-5'}>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 h-10 bg-white/10 rounded-xl animate-pulse" />
                  <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="h-10 bg-white/5 rounded-xl animate-pulse mb-3" />
                <div className="h-10 bg-white/5 rounded-xl animate-pulse mb-4" />
                <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
              </div>
              <div className={colors.glassCard + ' p-5'}>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity skeleton */}
          <div className={colors.glassCard + ' overflow-hidden'}>
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-4">
              <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="px-5 py-3 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-6 w-12 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse ml-auto" />
                  <div className="h-4 w-14 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      <BackgroundBlobs />

      <SEO
        title={`${tokenSymbol} ${priceUsd ? `$${parseFloat(priceUsd).toFixed(4)}` : ''} | EVMint`}
        description={`View ${tokenSymbol} live chart, trade activity, and pool stats on ${chainName}.`}
        canonical={`/token/${tokenAddress}`}
      />

      {/* Issue #10: Use stagger container for orchestrated entrance */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={prefersReducedMotion ? {} : {
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
      >
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Tokens', href: '/tokens' },
          { label: `$${tokenSymbol}` },
        ]} />

        {/* Token header */}
        <TokenHeader
          tokenAddress={tokenAddress || ''}
          tokenInfo={tokenInfo}
          pool={pool}
          isTokenBase={isTokenBase}
          chainId={chainId}
        />

        {/* Main grid: Chart + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-5 mb-5">
          {/* Chart */}
          <div className="flex-1 min-w-0">
            <ChartEmbed embedUrl={chartEmbedUrl} loading={false} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-5">
            <SwapPanel
              tokenAddress={tokenAddress || ''}
              tokenSymbol={tokenSymbol}
              tokenChainId={chainId}
              priceUsd={priceUsd}
              nativeTokenPriceUsd={nativeTokenPriceUsd}
            />
            <PoolStats
              pool={pool}
              tokenInfo={tokenInfo}
              isTokenBase={isTokenBase}
              loading={false}
            />
          </div>
        </div>

        {/* Activity table — full width */}
        <ActivityTable
          trades={trades}
          newTradeIds={newTradeIds}
          buyCount={buyCount}
          sellCount={sellCount}
          loading={tradesLoading}
          error={tradesError}
          chainId={chainId}
        />
      </motion.div>
    </div>
  )
}

/** Subtle animated background blobs matching site design */
function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
    </div>
  )
}
