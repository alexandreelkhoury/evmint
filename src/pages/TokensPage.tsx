import { useState, useEffect } from 'react'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { usePrivy } from '@privy-io/react-auth'
import { useChainId } from 'wagmi'
import { Link } from 'react-router-dom'
import WalletButton from '../components/WalletButton'
import SEO from '../components/SEO'
import { useOpenZeppelinTokenDeployment } from '../hooks/useOpenZeppelinTokenDeployment'
import { useTokenDetails } from '../hooks/useTokenDetails'
import { layout } from '../styles/designSystem'
import { getChainById } from '../config/chains'
import NetworkSelectorModal from '../components/NetworkSelectorModal'

interface TokenCardProps {
  tokenData: {
    address: string
    name: string
    symbol: string
    decimals: number
    totalSupply: string
    imageUrl?: string
  }
  chainId: number
}

function TokenCard({ tokenData, chainId }: TokenCardProps) {
  const { tokenInfo, balance } = useTokenDetails(tokenData.address)
  const [isCopied, setIsCopied] = useState(false)

  const displayTokenInfo = tokenInfo || {
    name: tokenData.name,
    symbol: tokenData.symbol,
    decimals: tokenData.decimals,
    totalSupply: tokenData.totalSupply,
    imageUrl: tokenData.imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${tokenData.address}&backgroundColor=3b82f6&size=100`
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(tokenData.address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // silently fail
    }
  }

  const truncatedAddress = `${tokenData.address.slice(0, 6)}...${tokenData.address.slice(-4)}`
  const chainConfig = getChainById(chainId)
  const explorerUrl = chainConfig?.explorer.url || 'https://basescan.org'

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors duration-150">
      {/* Top row: icon + name/symbol + balance */}
      <div className="flex items-center gap-3 mb-4">
        {displayTokenInfo.imageUrl ? (
          <img
            src={displayTokenInfo.imageUrl}
            alt={displayTokenInfo.name}
            className="w-10 h-10 rounded-full border border-gray-600 flex-shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {displayTokenInfo.symbol.charAt(0)}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold text-sm truncate">{displayTokenInfo.name}</h3>
          <span className="text-gray-400 text-xs font-mono">${displayTokenInfo.symbol}</span>
        </div>
        {chainConfig && (
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded flex-shrink-0">
            {chainConfig.name.split(' ')[0]}
          </span>
        )}
      </div>

      {/* Data rows */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Address</span>
          <button
            onClick={handleCopyAddress}
            className="text-blue-400 hover:text-blue-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
            title={isCopied ? "Copied!" : "Click to copy"}
          >
            {truncatedAddress}
            {isCopied ? (
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Supply</span>
          <span className="text-white text-xs">{parseFloat(displayTokenInfo.totalSupply).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Balance</span>
          <span className="text-green-400 text-xs font-medium">
            {parseFloat(balance || '0').toLocaleString()} {displayTokenInfo.symbol}
          </span>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex gap-2">
        <Link
          to={`/token/${tokenData.address}?chain=${chainId}`}
          className="flex-1 h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Trade
        </Link>
        <Link
          to="/liquidity"
          className="flex-1 h-9 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Liquidity
        </Link>
        <button
          onClick={() => window.open(`${explorerUrl}/token/${tokenData.address}`, '_blank')}
          className="h-9 w-9 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          title="View on explorer"
          aria-label="View on block explorer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-24 mb-1.5" />
          <div className="h-3 bg-gray-700 rounded w-12" />
        </div>
      </div>
      <div className="space-y-2.5 mb-4">
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-gray-700 rounded-lg" />
        <div className="flex-1 h-9 bg-gray-700 rounded-lg" />
        <div className="w-9 h-9 bg-gray-700 rounded-lg" />
      </div>
    </div>
  )
}

export default function TokensPage() {
  const analytics = useFirebaseAnalytics()
  const { ready, authenticated } = usePrivy()
  const chainId = useChainId()
  const { userTokens, refetchUserTokens, isCorrectChain, isRefreshing, isInitialLoading } = useOpenZeppelinTokenDeployment()
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  useEffect(() => {
    trackPageView(analytics, 'tokens')
  }, [analytics])

  const chainConfig = getChainById(chainId)
  const networkName = chainConfig?.name.split(' ')[0] || 'EVM'

  const seoBlock = (
    <SEO
      title="My Tokens - Manage Your ERC20 Tokens | EVMint"
      description="View and manage all your created ERC20 tokens across 15+ EVM chains."
      keywords="token management, my erc20 tokens, multi-chain token dashboard"
      canonical="/tokens"
    />
  )

  // Page header shared across states
  const pageHeader = (count?: number) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          My Tokens
          {count !== undefined && (
            <span className="ml-2 text-base font-normal text-gray-400">({count})</span>
          )}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setIsNetworkModalOpen(true)}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {networkName}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {authenticated && count !== undefined && count > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (!isRefreshing) refetchUserTokens() }}
            disabled={isRefreshing}
            className={`h-9 px-3 text-sm rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRefreshing
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            {isRefreshing ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            to="/create"
            className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Token
          </Link>
        </div>
      )}
    </div>
  )

  // Loading state (Privy not ready)
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900">
        {seoBlock}
        <div className={layout.pageContainer}>
          {pageHeader()}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900">
        {seoBlock}
        <div className={layout.pageContainer}>
          {pageHeader()}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center max-w-lg mx-auto">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-white mb-2">Connect your wallet</h2>
            <p className="text-gray-400 text-sm mb-6">
              Connect a wallet to view and manage your created tokens.
            </p>
            <WalletButton />
          </div>
        </div>
      </div>
    )
  }

  // Connected state
  return (
    <div className="min-h-screen bg-gray-900">
      {seoBlock}
      <div className={layout.pageContainer}>
        {pageHeader(isInitialLoading ? undefined : userTokens.length)}

        {/* Network warning */}
        {!isCorrectChain && (
          <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-orange-300 text-center">
              Switch to a supported network to view your tokens.
            </p>
          </div>
        )}

        {isInitialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : userTokens.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center max-w-lg mx-auto">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h2 className="text-lg font-semibold text-white mb-2">No tokens yet</h2>
            <p className="text-gray-400 text-sm mb-6">
              You haven't created any tokens on {chainConfig?.name || 'this network'}.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Token
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTokens.map((token) => (
              <TokenCard
                key={token.address}
                tokenData={{
                  address: token.address,
                  name: token.name,
                  symbol: token.symbol,
                  decimals: token.decimals,
                  totalSupply: token.totalSupply,
                  imageUrl: token.imageUrl
                }}
                chainId={chainId}
              />
            ))}
          </div>
        )}
      </div>

      <NetworkSelectorModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  )
}
