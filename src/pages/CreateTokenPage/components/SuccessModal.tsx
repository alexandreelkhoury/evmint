import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { colors } from '../../../styles/designSystem'
import { getAddressUrl, getChainById } from '../../../config/chains'

interface SuccessModalProps {
  tokenAddress: string
  chainName: string
  tokenName?: string
  tokenSymbol?: string
  totalSupply?: string
  /** Live source-verification state. `null`/undefined hides the badge entirely. */
  verificationStatus?: 'pending' | 'success' | 'failed' | null
  /** Used to build explorer links that are correct for every supported chain */
  chainId?: number
  onRetryVerification?: () => void
}

export default function SuccessModal({
  tokenAddress,
  chainName,
  tokenName,
  tokenSymbol,
  totalSupply,
  verificationStatus = null,
  chainId,
  onRetryVerification
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Format supply for display (e.g., 1000000 -> "1M")
  const formatSupply = (supply: string) => {
    const num = parseInt(supply)
    if (isNaN(num)) return supply

    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  // Get explorer URL based on chain - supports all chains including testnets
  const getExplorerUrl = () => {
    const explorers: Record<string, string> = {
      // Mainnets
      'Base': 'basescan.org',
      'Ethereum': 'etherscan.io',
      'Arbitrum One': 'arbiscan.io',
      'Arbitrum': 'arbiscan.io',
      'Optimism': 'optimistic.etherscan.io',
      'Polygon': 'polygonscan.com',
      'BNB Smart Chain': 'bscscan.com',
      'BSC': 'bscscan.com',
      'Avalanche': 'snowtrace.io',
      'Fantom': 'ftmscan.com',
      'Gnosis': 'gnosisscan.io',
      'Moonbeam': 'moonscan.io',
      'World Chain': 'worldscan.org',
      'Blast': 'blastscan.io',
      'Monad': 'monadscan.com',
      // Testnets
      'Sepolia': 'sepolia.etherscan.io',
      'Base Sepolia': 'sepolia.basescan.org',
      'Arbitrum Sepolia': 'sepolia.arbiscan.io',
      'Optimism Sepolia': 'sepolia-optimism.etherscan.io',
      'Polygon Amoy': 'amoy.polygonscan.com',
      'BSC Testnet': 'testnet.bscscan.com',
      'Avalanche Fuji': 'testnet.snowtrace.io',
      'Moonbase Alpha': 'moonbase.moonscan.io',
      'Blast Sepolia': 'sepolia.blastscan.io',
      'Monad Testnet': 'testnet.monadscan.com',
    }
    const domain = explorers[chainName] || 'etherscan.io'
    return `https://${domain}/address/${tokenAddress}`
  }

  // Prefer the chain registry (covers every supported chain) over the name map above
  const explorerName = (chainId !== undefined && getChainById(chainId)?.explorer.name) || 'the block explorer'
  const addressUrl = chainId !== undefined ? getAddressUrl(chainId, tokenAddress) : getExplorerUrl()
  const sourceCodeUrl = `${addressUrl}#code`

  // Get clean chain name for hashtag (remove "Sepolia", "Testnet", etc.)
  const getChainHashtag = () => {
    return chainName
      .replace(/\s*(Sepolia|Testnet|Amoy|Fuji|Alpha)\s*/gi, '')
      .replace(/\s+/g, '')
  }

  // VIRAL TWEET - Optimized for engagement and EVMint marketing
  const displayName = tokenName || 'My Token'
  const displaySymbol = tokenSymbol || 'TOKEN'
  const displaySupply = totalSupply ? formatSupply(totalSupply) : '???'

  const tweetText = `🚀 Just deployed $${displaySymbol} on ${chainName}!

💎 ${displayName}
📊 ${displaySupply} supply
💧 Liquidity coming soon...

Built with @EVMint_io - launch tokens on 15+ EVM chains in seconds ⚡

${getExplorerUrl()}

#${displaySymbol} #${getChainHashtag()} #DeFi #Web3 #Crypto`

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  const handleCopyLink = async () => {
    try {
      const shareMessage = `🚀 $${displaySymbol} just launched on ${chainName}!

💎 ${displayName}
📊 ${displaySupply} supply
💧 Liquidity coming soon...

📍 Contract: ${tokenAddress}
🔗 ${getExplorerUrl()}

Deployed with EVMint.io - launch tokens on 15+ EVM chains ⚡`

      await navigator.clipboard.writeText(shareMessage)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  // Track share button clicks in analytics
  const trackShare = (platform: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'token_creation',
        item_id: tokenAddress
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`mt-6 ${colors.successBg} rounded-2xl p-5 sm:p-8`}
    >
      {/* Success Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 22 }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Token Created Successfully!
        </h3>
        <p className="text-green-200 text-base sm:text-lg">
          Your token is now live on {chainName}
        </p>
      </div>

      {/* Contract Address */}
      <div className="bg-black/30 border border-green-500/20 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-400 mb-2">Contract Address:</p>
        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm font-mono break-all text-gray-200 flex-1">
            {tokenAddress}
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyAddress}
            aria-label="Copy contract address"
            className={`px-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
              copied
                ? 'bg-green-500/20 text-green-300'
                : 'bg-white/10 hover:bg-white/20 text-gray-300'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </motion.button>
        </div>
      </div>

      {/* Source verification badge.
          Deliberately never shows a green check for a queued job — the 'success'
          state is only reached once the explorer itself confirms the source. */}
      {verificationStatus && (
        <div className="mb-6">
          {verificationStatus === 'success' && (
            <a
              href={sourceCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-sm text-green-300 hover:bg-green-500/20 transition-colors"
            >
              <span aria-hidden="true">✓</span>
              <span>Source code verified on {explorerName}</span>
              <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {verificationStatus === 'pending' && (
            <div
              role="status"
              className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-yellow-200"
            >
              <span className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-yellow-300/40 border-t-yellow-300 animate-spin" aria-hidden="true" />
              <span>Verification in progress — usually done within 2 minutes.</span>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-gray-500/10 border border-gray-500/30 rounded-xl text-sm text-gray-300">
              <span className="flex-1">
                Not verified yet. Your token is deployed and fully functional — only the
                published source code is missing.
              </span>
              <div className="flex items-center gap-2">
                {onRetryVerification && (
                  <button
                    type="button"
                    onClick={onRetryVerification}
                    className="px-3 min-h-[44px] flex items-center justify-center rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
                  >
                    Retry verification
                  </button>
                )}
                <a
                  href={sourceCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 min-h-[44px] flex items-center justify-center rounded-lg text-xs font-medium border border-gray-600 hover:border-gray-500 text-gray-300 transition-colors"
                >
                  Verify on {explorerName}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIRAL SHARING SECTION - Most Prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.15 }}
        className="mb-6 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-500/30 rounded-2xl p-4 sm:p-6"
      >
        <div className="text-center mb-4">
          <h4 className="text-xl font-bold text-white mb-2 text-balance">
            Announce Your Launch!
          </h4>
          <p className="text-sm text-gray-300">
            Share your token creation! (Add liquidity next to make it tradable)
          </p>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          {/* Twitter Share - PRIMARY */}
          <motion.a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackShare('twitter')}
            aria-label="Share token launch on Twitter"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-6 min-h-[44px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/40 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 group"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Share on Twitter/X</span>
            <motion.span
              className="text-xs bg-white/20 px-2 py-1 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              Get buyers!
            </motion.span>
          </motion.a>

          {/* Copy Token Info - SECONDARY */}
          <motion.button
            type="button"
            onClick={() => {
              handleCopyLink()
              trackShare('copy_link')
            }}
            aria-label="Copy share message for Telegram or Discord"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-3 px-6 min-h-[44px] rounded-xl font-semibold transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
              linkCopied
                ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
                : 'bg-gray-800/50 border-2 border-gray-700/50 text-gray-300 hover:border-purple-500/50 hover:bg-gray-800'
            }`}
          >
            {linkCopied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied! Share in Telegram/Discord</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Message for Telegram/Discord</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Share Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl"
        >
          <p className="text-xs text-gray-300 text-center">
            <strong className="text-purple-300">Pro tip:</strong> Share your contract address so people can find and buy your token!
          </p>
        </motion.div>
      </motion.div>

      {/* Next Steps Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Next Steps
        </h4>
        <div className="space-y-3">
          {/* Step 1: Add Liquidity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">1️⃣</span>
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-white mb-1">Add Liquidity</h5>
              <p className="text-sm text-gray-300">
                Make your token tradeable by adding liquidity on a DEX
              </p>
            </div>
          </motion.div>

          {/* Step 2: Build Community */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="flex items-start gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4"
          >
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">2️⃣</span>
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-white mb-1">Build Your Community</h5>
              <p className="text-sm text-gray-300">
                Share on Twitter, create Telegram group, engage holders
              </p>
            </div>
          </motion.div>

          {/* Step 3: Get Listed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4"
          >
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">3️⃣</span>
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-white mb-1">Get Listed</h5>
              <p className="text-sm text-gray-300">
                Apply for CoinGecko, CoinMarketCap, and DEX aggregators
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={`/liquidity?token=${tokenAddress}`}
            className={`inline-flex items-center justify-center px-6 min-h-[44px] ${colors.primaryButton} rounded-xl font-medium transition-[background-color,color,border-color,box-shadow,opacity] duration-200 hover:shadow-lg`}
          >
            <span>Add Liquidity</span>
          </Link>
          <Link
            to="/tokens"
            className={`inline-flex items-center justify-center px-6 min-h-[44px] ${colors.secondaryButton} rounded-xl font-medium transition-[background-color,color,border-color,box-shadow,opacity] duration-200 hover:shadow-lg`}
          >
            <span>View My Tokens</span>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            to="/guides"
            className="flex-1 text-center px-4 min-h-[44px] flex items-center justify-center text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Read Guides
          </Link>
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              window.location.reload()
            }}
            className="flex-1 text-center px-4 min-h-[44px] flex items-center justify-center text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Create Another Token
          </button>
        </div>
      </div>
    </motion.div>
  )
}
