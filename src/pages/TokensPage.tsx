import { useState, useEffect } from 'react'
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
import { animations, typography, colors } from '../styles/designSystem'
import { getChainById } from '../config/chains'
import StandardPageHeader from '../components/StandardPageHeader'
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
  index: number
  chainId: number
}

function TokenCard({ tokenData, index, chainId }: TokenCardProps) {
  const { tokenInfo, balance } = useTokenDetails(tokenData.address)
  const [isCopied, setIsCopied] = useState(false)

  // Use stored data as primary source, live contract data as fallback
  const displayTokenInfo = tokenInfo || {
    name: tokenData.name,
    symbol: tokenData.symbol,
    decimals: tokenData.decimals,
    totalSupply: tokenData.totalSupply,
    imageUrl: tokenData.imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${tokenData.address}&backgroundColor=3b82f6,8b5cf6,10b981&size=100`
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(tokenData.address)
      setIsCopied(true)
      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      loggers.ui.error('Failed to copy address:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${colors.glassCard} p-6 hover:border-white/40 transition-all duration-300 group`}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {displayTokenInfo.imageUrl ? (
              <img
                src={displayTokenInfo.imageUrl}
                alt={displayTokenInfo.name}
                className="w-14 h-14 rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition-colors"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center border-2 border-gray-600 group-hover:border-blue-400 transition-colors">
                <span className="text-white font-bold text-lg">
                  {displayTokenInfo.symbol.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
          </div>
          <div>
            <h3 className={`${typography.cardTitleSmall} mb-1`}>{displayTokenInfo.name}</h3>
            <div className={`${colors.badgeInfo} px-2 py-1 rounded-md text-xs font-mono inline-block`}>
              ${displayTokenInfo.symbol}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`${typography.metadata} mb-1`}>Your Balance</p>
          <p className={`${typography.success} text-lg font-bold`}>
            {parseFloat(balance || '0').toLocaleString()} {displayTokenInfo.symbol}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-3">
          <p className={typography.metadata}>Total Supply</p>
          <p className="text-white font-semibold">
            {parseFloat(displayTokenInfo.totalSupply).toLocaleString()}
          </p>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <p className={typography.metadata}>Decimals</p>
          <p className="text-white font-semibold">{displayTokenInfo.decimals}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className={typography.metadata}>Contract Address</p>
        <div className={`${colors.infoBg} p-2 rounded flex items-center justify-between`}>
          <span className="text-blue-300 font-mono text-sm truncate">
            {tokenData.address}
          </span>
          <motion.button
            onClick={handleCopyAddress}
            className={`ml-2 px-3 py-1 rounded transition-all duration-300 flex items-center space-x-1 ${
              isCopied 
                ? 'bg-green-600/20 text-green-400' 
                : 'hover:bg-blue-600/20 text-blue-400'
            }`}
            title={isCopied ? "Copied!" : "Copy address"}
            whileHover={{ scale: isCopied ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              key={isCopied ? 'copied' : 'copy'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCopied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </motion.div>
            <motion.span 
              className="text-xs font-medium"
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: isCopied ? 'auto' : 0, 
                opacity: isCopied ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {isCopied && 'Copied!'}
            </motion.span>
          </motion.button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Link
          to="/liquidity"
          className={`flex-1 px-4 py-2 ${colors.tertiaryButton} hover:bg-gradient-to-r hover:from-green-600/20 hover:to-blue-600/20 text-sm rounded-lg flex items-center justify-center space-x-2 transition-all duration-300`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span>Add Liquidity</span>
        </Link>
        <button
          onClick={() => {
            const chainConfig = getChainById(chainId)
            const explorerUrl = chainConfig?.explorer.url || 'https://basescan.org'
            window.open(`${explorerUrl}/token/${tokenData.address}`, '_blank')
          }}
          className={`flex-1 px-4 py-2 ${colors.primaryButton} text-sm rounded-lg flex items-center justify-center space-x-2`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View</span>
        </button>
      </div>
    </motion.div>
  )
}

export default function TokensPage() {
  const analytics = useFirebaseAnalytics()
  const { ready, authenticated, user } = usePrivy()
  const chainId = useChainId()
  const { userTokens, refetchUserTokens, isCorrectChain, isRefreshing, isInitialLoading } = useOpenZeppelinTokenDeployment()
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  useEffect(() => {
    trackPageView(analytics, 'tokens')
  }, [analytics])


  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <SEO
          title="My ERC20 Tokens - Manage Multi-Chain Token Portfolio"
          description="View and manage all your created ERC20 tokens across multiple EVM blockchains. Track token performance, manage liquidity, and monitor your crypto projects on Base, Ethereum, Arbitrum, and more."
          keywords="multi-chain tokens management, erc20 token dashboard, blockchain portfolio, token management interface, base ethereum arbitrum polygon"
          canonical="/tokens"
        />
        
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-20`}>
          {/* Modern Token Dashboard Header */}
          <StandardPageHeader
            badgeIcon="💎"
            badgeText="Token Portfolio"
            badgeColors="from-purple-500/10 to-blue-500/10 border-purple-500/20"
            titleGradient="Your Tokens"
            titleWhite="Dashboard"
            subtitle="Monitor and manage your ERC20 tokens across multiple EVM blockchains"
            stats={[
              { value: '...', label: 'Loading', color: 'purple' },
              { value: '...', label: 'Loading', color: 'blue' },
              { value: '...', label: 'Loading', color: 'cyan' }
            ]}
            chainId={chainId}
            onNetworkClick={() => setIsNetworkModalOpen(true)}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <SEO
          title="My ERC20 Tokens - Manage Multi-Chain Token Portfolio"
          description="View and manage all your created ERC20 tokens across multiple EVM blockchains. Track token performance, manage liquidity, and monitor your crypto projects on Base, Ethereum, Arbitrum, and more."
          keywords="multi-chain tokens management, erc20 token dashboard, blockchain portfolio, token management interface, base ethereum arbitrum polygon"
          canonical="/tokens"
        />
        
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-20`}>
          {/* Modern Token Dashboard Header */}
          <StandardPageHeader
            badgeIcon="💎"
            badgeText="Token Portfolio"
            badgeColors="from-purple-500/10 to-blue-500/10 border-purple-500/20"
            titleGradient="Your Tokens"
            titleWhite="Dashboard"
            subtitle="Monitor and manage your ERC20 tokens across multiple EVM blockchains"
            stats={[
              { value: '0', label: 'Tokens', color: 'purple' },
              { value: 'Connect', label: 'Wallet', color: 'blue' },
              { value: 'Get Started', label: 'Now', color: 'cyan' }
            ]}
            chainId={chainId}
            onNetworkClick={() => setIsNetworkModalOpen(true)}
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
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-6"
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
              <WalletButton />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-blue-400 mb-2">💎</div>
                <h4 className="text-white font-semibold mb-2">Token Overview</h4>
                <p className="text-gray-400 text-sm">View all your created tokens with real-time data</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-green-400 mb-2">📊</div>
                <h4 className="text-white font-semibold mb-2">Balance Tracking</h4>
                <p className="text-gray-400 text-sm">Monitor your token balances and holdings</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-400 mb-2">🔗</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <SEO
        title="My Base Tokens - Manage Your ERC20 Tokens | Base Token Creator"
        description="View and manage all your created ERC20 tokens on Base blockchain. Track token performance, manage liquidity, and monitor your crypto projects."
        keywords="base tokens management, my base tokens, erc20 token dashboard, base blockchain portfolio, token management interface"
        canonical="/tokens"
      />
      
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-20`}>
        {/* Modern Token Dashboard Header */}
        <StandardPageHeader
          badgeIcon="💎"
          badgeText="Token Portfolio"
          badgeColors="from-purple-500/10 to-blue-500/10 border-purple-500/20"
          titleGradient="Your Tokens"
          titleWhite="Dashboard"
          subtitle="Monitor and manage your ERC20 tokens across multiple EVM blockchains"
          stats={[
            { value: userTokens.length, label: userTokens.length === 1 ? 'Token' : 'Tokens', color: 'purple' },
            { value: getChainById(chainId)?.name.split(' ')[0] || 'EVM', label: 'Network', color: 'blue' },
            { value: 'Live', label: 'Portfolio', color: 'cyan' }
          ]}
          chainId={chainId}
          onNetworkClick={() => setIsNetworkModalOpen(true)}
          warningContent={!isCorrectChain ? (
            <div className="bg-orange-900/20 rounded-lg border border-orange-500/20 p-4">
              <p className="text-sm text-orange-200 text-center">
                ⚠️ Please switch to a supported EVM network to view your tokens.
              </p>
            </div>
          ) : undefined}
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
      ) : userTokens.length === 0 ? (
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
              You haven't created any tokens yet. Ready to launch your first token on {getChainById(chainId)?.name || 'this network'}?
            </p>
            <motion.div {...animations.buttonHover}>
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
              >
                🚀 Create Your First Token
              </Link>
            </motion.div>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              Your Tokens ({userTokens.length})
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
                className={`flex items-center space-x-2 px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                  isRefreshing 
                    ? 'bg-gray-600 cursor-not-allowed opacity-75' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isRefreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Refresh</span>
                  </>
                )}
              </motion.button>
              <motion.div {...animations.buttonHover}>
                <Link
                  to="/create"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                >
                  ➕ Create New Token
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTokens.map((token, index) => (
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
                index={index}
                chainId={chainId}
              />
            ))}
          </div>

        </div>
      )}
      </div>

      {/* Network Selector Modal */}
      <NetworkSelectorModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  )
}