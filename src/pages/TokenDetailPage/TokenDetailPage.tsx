import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useChainId, useReadContract } from 'wagmi'
import { useTokenPool } from '../../hooks/useTokenPool'
import { useRecentTrades } from '../../hooks/useRecentTrades'
import { formatUsd, getGeckoNetworkId } from '../../services/geckoTerminal'
import { getChainById, getChainName, getDexContracts, getTokenUrl, getWethAddress } from '../../config/chains'
import { FACTORY_ABI } from '../../features/liquidity/constants'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView } from '../../utils/analytics'
import { colors } from '../../styles/designSystem'
import Breadcrumb from '../../components/Breadcrumb'
import SEO from '../../components/SEO'
import TokenHeader, { formatTokenPrice } from './components/TokenHeader'
import ChartEmbed from './components/ChartEmbed'
import SwapPanel from './components/SwapPanel'
import PoolStats from './components/PoolStats'
import ActivityTable from './components/ActivityTable'

const SITE_URL = 'https://evmint.io'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

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

  // The same contract address exists on many chains, so every URL this page
  // emits — canonical, share link, internal links — has to carry the chain.
  // Address is lower-cased so casing variants collapse to one canonical URL.
  const canonicalPath = `/token/${(tokenAddress || '').toLowerCase()}?chain=${chainId}`
  const shareUrl = `${SITE_URL}${canonicalPath}`
  const addLiquidityHref = `/liquidity?token=${tokenAddress}&chain=${chainId}`
  const explorerHref = tokenAddress ? getTokenUrl(chainId, tokenAddress) : null

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

  // GeckoTerminal returning nothing is ambiguous: either no pool has ever been
  // created, or one exists and the indexer hasn't caught up. Ask the chain's V2
  // factory directly so we can tell the creator which of the two they're in.
  const dexContracts = getDexContracts(chainId)
  const factoryAddress = (dexContracts?.uniswapV2Factory
    || dexContracts?.pancakeswapFactory
    || dexContracts?.sushiswapFactory
    || dexContracts?.quickswapFactory
    || dexContracts?.traderJoeFactory
    || dexContracts?.spookyswapFactory) as `0x${string}` | undefined
  const wethAddress = getWethAddress(chainId)
  const canProbePair = Boolean(
    tokenAddress && factoryAddress && wethAddress && wethAddress !== ZERO_ADDRESS
  )

  const {
    data: pairAddress,
    isLoading: pairProbeLoading,
    isError: pairProbeFailed,
  } = useReadContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'getPair',
    args: tokenAddress && wethAddress
      ? [tokenAddress as `0x${string}`, wethAddress as `0x${string}`]
      : undefined,
    chainId,
    query: { enabled: canProbePair && notIndexed && !poolLoading },
  })

  // Only trust a definitive answer. An RPC failure must not be read as "no pool".
  const pairProbeConclusive = canProbePair && !pairProbeLoading && !pairProbeFailed
  const onChainPairExists = Boolean(pairAddress && pairAddress !== ZERO_ADDRESS)

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
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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

  // No tradable pool yet — the state every freshly launched token sits in.
  // We diagnose it against the chain rather than telling the creator to "retry".
  if (notIndexed && !poolLoading) {
    const probing = canProbePair && pairProbeLoading
    const nativeSymbol = getChainById(chainId)?.nativeCurrency.symbol || 'the native token'

    let heading: string
    let body: string
    if (probing) {
      heading = 'Checking for a pool…'
      body = `Looking for a ${nativeSymbol} pair for this token on ${chainName}.`
    } else if (!pairProbeConclusive) {
      // No factory to query on this chain, or the RPC call failed — cover both
      // causes honestly rather than asserting something we can't verify.
      heading = 'Nothing to trade yet'
      body = `We can't find a market for this token on ${chainName}. Either liquidity hasn't been added yet, or the pool is too new for GeckoTerminal to have indexed it.`
    } else if (onChainPairExists) {
      heading = 'Pool found — waiting on market data'
      body = `A ${nativeSymbol} pool exists on-chain, but GeckoTerminal hasn't indexed it yet. The chart and trade feed appear shortly after the first swap.`
    } else {
      heading = 'No pool yet'
      body = 'Your token exists on-chain, but nobody can trade it until you add liquidity.'
    }

    const poolConfirmed = pairProbeConclusive && onChainPairExists
    const showAddLiquidity = !probing && !poolConfirmed

    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        <BackgroundBlobs />
        <SEO
          title={`Token ${tokenAddress?.slice(0, 8)}… on ${chainName} | EVMint`}
          description={
            poolConfirmed
              ? `This token has a live pool on ${chainName}. Market data is still being indexed — check back shortly for its chart and trade activity.`
              : `This token is deployed on ${chainName} but has no tradable pool yet. Add liquidity to open trading, then track its live chart and activity here.`
          }
          canonical={canonicalPath}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Tokens', href: '/tokens' },
            { label: tokenAddress ? `${tokenAddress.slice(0, 10)}…` : 'Token' },
          ]} />
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              {probing ? (
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
              ) : (
                <svg className="w-10 h-10 text-blue-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">{heading}</h1>
            <p className="text-gray-400 font-sans max-w-md mx-auto mb-6">{body}</p>

            {!probing && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
                {showAddLiquidity && (
                  <Link
                    to={addLiquidityHref}
                    className={`px-6 py-3 text-center ${colors.primaryButton} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                  >
                    Add liquidity
                  </Link>
                )}
                {poolConfirmed && (
                  <button
                    onClick={retry}
                    className={`px-6 py-3 ${colors.primaryButton} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                  >
                    Retry
                  </button>
                )}
                {explorerHref && (
                  <a
                    href={explorerHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 text-center font-semibold ${colors.secondaryButton} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                  >
                    View on explorer
                  </a>
                )}
              </div>
            )}

            {/* Genuine "already added liquidity, indexer is behind" escape hatch */}
            {!probing && !poolConfirmed && (
              <button
                onClick={retry}
                className="mt-5 text-sm text-gray-400 hover:text-white underline underline-offset-4 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded"
              >
                Already added liquidity? Check again
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (poolError && !poolLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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

          {/* Chart + Sidebar skeleton — mirrors the loaded grid ordering */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-5">
            <div className={`order-1 min-w-0 lg:col-start-2 lg:row-start-1 ${colors.glassCard} p-5`}>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 h-10 bg-white/10 rounded-xl animate-pulse" />
                <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
              </div>
              <div className="h-10 bg-white/5 rounded-xl animate-pulse mb-3" />
              <div className="h-10 bg-white/5 rounded-xl animate-pulse mb-4" />
              <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
            </div>
            <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
              <div className="w-full aspect-[16/9] min-h-[400px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            </div>
            <div className={`order-3 min-w-0 lg:col-start-2 lg:row-start-2 ${colors.glassCard} p-5`}>
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

  // Meta copy — every price-dependent fragment degrades to nothing when the
  // market data isn't there, so an unfurl never shows "$NaN" or a fake zero.
  const priceNum = priceUsd ? parseFloat(priceUsd) : null
  const priceLabel = priceNum !== null && isFinite(priceNum) && priceNum > 0
    ? formatTokenPrice(priceNum)
    : null
  const liquidityLabel = pool?.attributes.reserve_in_usd
    ? formatUsd(pool.attributes.reserve_in_usd)
    : null

  const seoTitle = priceLabel
    ? `$${tokenSymbol} ${priceLabel} — Live Chart & Trades on ${chainName} | EVMint`
    : `$${tokenSymbol} — Live Chart & Trades on ${chainName} | EVMint`
  const seoDescription = priceLabel
    ? `$${tokenSymbol} is trading at ${priceLabel} on ${chainName}${liquidityLabel ? ` with ${liquidityLabel} liquidity` : ''}. Live chart, real-time buys and sells, pool stats, and a one-click swap.`
    : `Live chart, real-time buys and sells, pool stats, and a one-click swap for $${tokenSymbol} on ${chainName}.`

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      <BackgroundBlobs />

      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalPath}
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
          shareUrl={shareUrl}
        />

        {/*
          Main grid: Chart + Sidebar.
          Below lg this is a single column ordered swap → chart → stats, so the
          buy widget is the first thing a phone visitor sees. At lg the chart
          takes column one and the sidebar stacks down column two. Pure CSS
          ordering — the markup is never duplicated.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 mb-5">
          {/* Swap panel — first on mobile, top of the sidebar column at lg */}
          <div className="order-1 min-w-0 lg:col-start-2 lg:row-start-1">
            <SwapPanel
              tokenAddress={tokenAddress || ''}
              tokenSymbol={tokenSymbol}
              tokenChainId={chainId}
              priceUsd={priceUsd}
              nativeTokenPriceUsd={nativeTokenPriceUsd}
            />
          </div>

          {/* Chart */}
          <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <ChartEmbed embedUrl={chartEmbedUrl} loading={false} />
          </div>

          {/* Pool stats */}
          <div className="order-3 min-w-0 lg:col-start-2 lg:row-start-2">
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
