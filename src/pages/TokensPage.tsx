import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { usePrivy } from '@privy-io/react-auth'
import { useChainId } from 'wagmi'
import { base } from 'viem/chains'
import { Link } from 'react-router-dom'
import WalletButton from '../components/WalletButton'
import { GlassCard } from '../components/GlassCard'
import SEO from '../components/SEO'
import { CardSkeleton } from '../components/LoadingSkeleton'
import { useOpenZeppelinTokenDeployment } from '../hooks/useOpenZeppelinTokenDeployment'
import { useTokenDetails } from '../hooks/useTokenDetails'
import { animations, typography, colors, layout } from '../styles/designSystem'
import { getChainById } from '../config/chains'
import ChainIcon from '../components/ChainIcon'
import StandardPageHeader from '../components/StandardPageHeader'

interface TokenCardProps {
  tokenData: {
    address: string
    name: string
    symbol: string
    decimals: number
    totalSupply: string
    imageUrl?: string
    cachedBalance?: string
  }
  index: number
  chainId: number
  onBalanceUpdate?: (address: string, chainId: number, balance: string) => void
}

function TokenCard({ tokenData, index, chainId, onBalanceUpdate }: TokenCardProps) {
  const walletChainId = useChainId()
  const isOnTokenChain = walletChainId === chainId
  const { tokenInfo, balance } = useTokenDetails(isOnTokenChain ? tokenData.address : '') // Only fetch if on same chain
  const [isCopied, setIsCopied] = useState(false)

  const displayTokenInfo = tokenInfo || {
    name: tokenData.name,
    symbol: tokenData.symbol,
    decimals: tokenData.decimals,
    totalSupply: tokenData.totalSupply,
    imageUrl: tokenData.imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${tokenData.address}&backgroundColor=3b82f6,8b5cf6,10b981&size=100`
  }

  const chainConfig = getChainById(chainId)
  const truncatedAddress = `${tokenData.address.slice(0, 6)}...${tokenData.address.slice(-4)}`
  // Use live balance if available (same chain), otherwise cached, otherwise '0'
  const liveBalance = isOnTokenChain && balance ? balance : null
  const displayBalance = liveBalance ?? tokenData.cachedBalance ?? '0'
  const parsedBalance = parseFloat(displayBalance) || 0

  // Cache balance to localStorage when we get a live one
  useEffect(() => {
    if (liveBalance && onBalanceUpdate) {
      onBalanceUpdate(tokenData.address, chainId, liveBalance)
    }
  }, [liveBalance, tokenData.address, chainId, onBalanceUpdate])
  const parsedSupply = parseFloat(displayTokenInfo.totalSupply) || 0

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(tokenData.address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Silently handle copy failure
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-gray-800/60 border border-white/[0.06] rounded-xl hover:border-white/[0.14] transition-[border-color] duration-200 group"
    >
      {/* Header: avatar + name/symbol + chain pill */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3.5">
          {/* Token avatar with chain icon overlay */}
          <div className="relative shrink-0">
            {displayTokenInfo.imageUrl ? (
              <img
                src={displayTokenInfo.imageUrl}
                alt={displayTokenInfo.name}
                className="w-10 h-10 rounded-full ring-1 ring-white/10 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center ring-1 ring-white/10">
                <span className="text-white font-semibold text-sm">
                  {displayTokenInfo.symbol.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-gray-900 ring-1 ring-gray-800 flex items-center justify-center overflow-hidden">
              <ChainIcon chainId={chainId} size={14} />
            </div>
          </div>

          {/* Name and symbol */}
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-display font-semibold text-white truncate leading-tight">
              {displayTokenInfo.name}
            </h3>
            <span className="text-xs text-gray-500 font-mono tracking-wide">
              {displayTokenInfo.symbol}
            </span>
          </div>

          {/* Chain name pill */}
          <div className="shrink-0">
            <span className="text-[10px] font-medium text-gray-500 bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-0.5 uppercase tracking-wider">
              {chainConfig?.name.split(' ')[0] || 'EVM'}
            </span>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-white tabular-nums leading-none">
            {parsedBalance > 0 ? parsedBalance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'}
          </span>
          <span className="text-xs text-gray-500">
            {displayTokenInfo.symbol}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1.5 tabular-nums">
          Supply: {parsedSupply > 1_000_000
            ? `${(parsedSupply / 1_000_000).toFixed(1)}M`
            : parsedSupply > 1_000
              ? `${(parsedSupply / 1_000).toFixed(1)}K`
              : parsedSupply.toLocaleString()}
          {' · '}{displayTokenInfo.decimals} decimals
        </p>
      </div>

      {/* Contract address -- clickable to copy */}
      <div className="mx-5 mb-4">
        <button
          onClick={handleCopyAddress}
          className="w-full flex items-center justify-between gap-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.10] rounded-lg px-3 py-2 transition-[background-color,border-color] duration-150 cursor-pointer group/addr"
          title={isCopied ? 'Copied!' : `Copy ${tokenData.address}`}
        >
          <span className="text-xs font-mono text-gray-400 group-hover/addr:text-gray-300 transition-colors">
            {truncatedAddress}
          </span>
          <span className={`shrink-0 transition-colors duration-200 ${isCopied ? 'text-green-400' : 'text-gray-600 group-hover/addr:text-gray-400'}`}>
            {isCopied ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <Link
          to={`/token/${tokenData.address}?chain=${chainId}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Trade
        </Link>
        <Link
          to={`/liquidity?token=${tokenData.address}&chain=${chainId}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 bg-white/[0.05] hover:bg-white/[0.10] text-gray-300 hover:text-white text-[13px] font-medium rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-[background-color,border-color,color] duration-150 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a8 8 0 0 0 8-8c0-3.5-2.5-6.5-5-9.5L12 0l-3 3.5C6.5 6.5 4 9.5 4 13a8 8 0 0 0 8 8z" />
          </svg>
          Liquidity
        </Link>
        <button
          onClick={() => {
            const explorerUrl = chainConfig?.explorer.url || 'https://basescan.org'
            window.open(`${explorerUrl}/token/${tokenData.address}`, '_blank')
          }}
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white/[0.03] hover:bg-white/[0.08] text-gray-500 hover:text-gray-300 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-[background-color,border-color,color] duration-150 cursor-pointer"
          title="View on explorer"
          aria-label="View on block explorer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default function TokensPage() {
  const analytics = useFirebaseAnalytics()
  const { ready, authenticated, user } = usePrivy()
  const chainId = useChainId()
  const { userTokens, allUserTokens, refetchUserTokens, updateCachedBalance, isCorrectChain, isRefreshing, isInitialLoading } = useOpenZeppelinTokenDeployment()
  const [chainFilter, setChainFilter] = useState<number | 'all'>('all')

  // Get unique chains from user's tokens
  const userChains = useMemo(() => {
    const chainIds = [...new Set(allUserTokens.map(t => t.chainId))]
    return chainIds.map(id => ({ id, config: getChainById(id) })).filter(c => c.config)
  }, [allUserTokens])

  // Filter tokens by selected chain
  const displayTokens = useMemo(() => {
    if (chainFilter === 'all') return allUserTokens
    return allUserTokens.filter(t => t.chainId === chainFilter)
  }, [allUserTokens, chainFilter])

  useEffect(() => {
    trackPageView(analytics, 'tokens')
  }, [analytics])


  if (!ready) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <SEO
          title="My ERC20 Tokens - Manage Multi-Chain Token Portfolio"
          description="View and manage all your created ERC20 tokens across 15+ EVM blockchains. Track token performance, manage liquidity, and monitor your crypto projects on Ethereum, Arbitrum, Polygon, and more."
          keywords="multi-chain tokens management, erc20 token dashboard, blockchain portfolio, token management interface, base ethereum arbitrum polygon"
          canonical="/tokens"
        />

        <div className={`relative z-10 ${layout.pageContainer} pb-12`}>
          {/* Modern Token Dashboard Header */}
          <StandardPageHeader
            badgeIcon=""
            badgeText="Token Portfolio"
            badgeColors="from-purple-500/10 to-blue-500/10 border-purple-500/20"
            titleGradient="Your Tokens"
            titleWhite="Dashboard"
            subtitle="Monitor and manage your tokens across multiple blockchains"
            stats={[
              { value: '...', label: 'Loading', color: 'purple' },
              { value: '...', label: 'Loading', color: 'blue' },
              { value: '...', label: 'Loading', color: 'cyan' }
            ]}
            chainId={chainId}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <SEO
          title="My ERC20 Tokens - Manage Multi-Chain Token Portfolio"
          description="View and manage all your created ERC20 tokens across 15+ EVM blockchains. Track token performance, manage liquidity, and monitor your crypto projects on Ethereum, Arbitrum, Polygon, and more."
          keywords="multi-chain tokens management, erc20 token dashboard, blockchain portfolio, token management interface, base ethereum arbitrum polygon"
          canonical="/tokens"
        />

        <div className={`relative z-10 ${layout.pageContainer} pb-12`}>
          {/* Modern Token Dashboard Header */}
          <StandardPageHeader
            badgeIcon=""
            badgeText="Token Portfolio"
            badgeColors="from-purple-500/10 to-blue-500/10 border-purple-500/20"
            titleGradient="Your Tokens"
            titleWhite="Dashboard"
            subtitle="Monitor and manage your tokens across multiple blockchains"
            stats={[
              { value: '0', label: 'Tokens', color: 'purple' },
              { value: 'Connect', label: 'Wallet', color: 'blue' },
              { value: 'Get Started', label: 'Now', color: 'cyan' }
            ]}
            chainId={chainId}
          />

          {/* Connect Wallet Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center mb-8`}
          >
            <div className="mb-8">
              <motion.div
                className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>
              <h3 className={`${typography.cardTitle} text-white mb-4`}>Connect Your Wallet</h3>
              <p className={`${typography.bodyText} text-blue-200 mb-6 max-w-2xl mx-auto`}>
                Connect your wallet to view and manage your created tokens across multiple EVM blockchains.
                Track their performance, manage liquidity, and monitor your crypto portfolio.
              </p>
              <div className="flex justify-center">
                <WalletButton />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-blue-400 mb-2"></div>
                <h4 className="text-white font-semibold mb-2">Token Overview</h4>
                <p className="text-gray-400 text-sm">View all your created tokens with real-time data</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 mb-2"></div>
                <h4 className="text-white font-semibold mb-2">Balance Tracking</h4>
                <p className="text-gray-400 text-sm">Monitor your token balances and holdings</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-400 mb-2"></div>
                <h4 className="text-white font-semibold mb-2">Quick Actions</h4>
                <p className="text-gray-400 text-sm">Copy addresses, view on explorer, manage liquidity</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Connected state - show tokens
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <SEO
        title="My Tokens - Manage Your ERC20 Tokens | EVMint"
        description="View and manage all your created ERC20 tokens across 15+ EVM chains. Track token performance, manage liquidity, and monitor your crypto projects."
        keywords="token management, my erc20 tokens, multi-chain token dashboard, blockchain portfolio, token management interface"
        canonical="/tokens"
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-12`}>
        {/* Modern Token Dashboard Header */}
        <StandardPageHeader
          badgeIcon=""
          badgeText="Token Portfolio"
          badgeColors="from-purple-500/10 to-blue-500/10 border-purple-500/20"
          titleGradient="Your Tokens"
          titleWhite="Dashboard"
          subtitle="Monitor and manage your tokens across multiple blockchains"
          stats={[
            { value: allUserTokens.length, label: allUserTokens.length === 1 ? 'Token' : 'Tokens', color: 'purple' },
            { value: userChains.length, label: userChains.length === 1 ? 'Chain' : 'Chains', color: 'blue' },
            { value: 'Live', label: 'Portfolio', color: 'cyan' }
          ]}
        />

      {isInitialLoading ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              Loading Your Tokens...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : allUserTokens.length === 0 ? (
        <GlassCard className="text-center">
          <div className="mb-6">
            <motion.div
              className="mx-auto w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </motion.div>
            <h3 className={typography.cardTitle}>No Tokens Found</h3>
            <p className="text-gray-400 mb-6">
              You haven't created any tokens yet. Ready to launch your first token?
            </p>
            <motion.div {...animations.buttonHover}>
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-[border-color,box-shadow] duration-200 cursor-pointer"
              >
                Create Your First Token
              </Link>
            </motion.div>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {/* Chain filter pills */}
          {userChains.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setChainFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-[background-color,color] duration-150 cursor-pointer ${
                  chainFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                All ({allUserTokens.length})
              </button>
              {userChains.map(({ id, config }) => (
                <button
                  key={id}
                  onClick={() => setChainFilter(id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-[background-color,color] duration-150 cursor-pointer ${
                    chainFilter === id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChainIcon chainId={id} size={14} />
                  {config?.name.split(' ')[0]} ({allUserTokens.filter(t => t.chainId === id).length})
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              Your Tokens ({displayTokens.length})
            </h2>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => {
                  if (!isRefreshing) {
                    refetchUserTokens();
                  }
                }}
                disabled={isRefreshing}
                whileHover={!isRefreshing ? { scale: 1.05 } : {}}
                whileTap={!isRefreshing ? { scale: 0.95 } : {}}
                className={`flex items-center space-x-2 px-4 min-h-[44px] text-white text-sm rounded-lg transition-colors ${
                  isRefreshing
                    ? 'bg-gray-600 cursor-not-allowed opacity-75'
                    : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                }`}
              >
                {isRefreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>

                    <span>Refresh</span>
                  </>
                )}
              </motion.button>
              <motion.div {...animations.buttonHover}>
                <Link
                  to="/create"
                  className="flex items-center px-4 min-h-[44px] bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-[border-color,box-shadow] duration-200 cursor-pointer"
                >
                  Create New Token
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTokens.map((token, index) => (
              <TokenCard
                key={`${token.chainId}-${token.address}`}
                tokenData={{
                  address: token.address,
                  name: token.name,
                  symbol: token.symbol,
                  decimals: token.decimals,
                  totalSupply: token.totalSupply,
                  imageUrl: token.imageUrl,
                  cachedBalance: token.cachedBalance
                }}
                index={index}
                chainId={token.chainId}
                onBalanceUpdate={updateCachedBalance}
              />
            ))}
          </div>

        </div>
      )}
      </div>

    </div>
  )
}
