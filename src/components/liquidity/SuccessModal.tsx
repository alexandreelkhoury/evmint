import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { colors, typography } from '../../styles/designSystem'
import { getChainById, getExplorerUrl } from '../../config/chains'
import { useScrollLock } from '../../hooks/useScrollLock'
import { useModalA11y } from '../../hooks/useModalA11y'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  pool: {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    tokenAmount: string
    ethAmount: string
    txHash: string
    lpTokenAddress?: string
  }
  chainId: number
  isWithdrawal?: boolean // New prop to detect withdrawal operations
}

export default function SuccessModal({ isOpen, onClose, pool, chainId, isWithdrawal = false }: SuccessModalProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [shareMessageCopied, setShareMessageCopied] = useState(false)

  useScrollLock(isOpen)
  const modalRef = useModalA11y(isOpen, onClose)

  if (!isOpen) return null

  // Get chain-specific info
  const chainConfig = getChainById(chainId)
  const nativeTokenSymbol = chainConfig?.nativeCurrency?.symbol || 'ETH'
  const chainName = chainConfig?.name || 'Base'
  const explorerUrl = getExplorerUrl(chainId)

  // Get DEXScreener chain slug (lowercase chain name, handle special cases)
  const getDexScreenerChain = (id: number): string => {
    const chainSlugs: Record<number, string> = {
      1: 'ethereum',
      8453: 'base',
      84532: 'base', // Base Sepolia - may not be on DEXScreener
      42161: 'arbitrum',
      10: 'optimism',
      137: 'polygon',
      56: 'bsc',
      43114: 'avalanche',
      250: 'fantom',
      100: 'gnosis',
      1284: 'moonbeam',
      81457: 'blast',
      143: 'monad',
      4663: 'robinhoodchain',
    }
    return chainSlugs[id] || 'ethereum'
  }

  const dexScreenerChain = getDexScreenerChain(chainId)
  const dexscreenerUrl = `https://dexscreener.com/${dexScreenerChain}/${pool.tokenAddress}`
  const uniswapUrl = `https://app.uniswap.org/swap?outputCurrency=${pool.tokenAddress}&chain=${dexScreenerChain}`

  const handleCopyAddress = async () => {
    if (!pool.lpTokenAddress) return

    try {
      await navigator.clipboard.writeText(pool.lpTokenAddress)
      setIsCopied(true)

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  // MAIN VIRAL SHARE - After liquidity (token is NOW tradable!)
  const tweetText = `$${pool.tokenSymbol} is NOW LIVE on ${chainName}!

Liquidity added on Uniswap V2
${pool.tokenAmount} ${pool.tokenSymbol} + ${pool.ethAmount} ${nativeTokenSymbol}

🔥 BUY NOW:
${uniswapUrl}

Chart: ${dexscreenerUrl}

#${pool.tokenSymbol} #${chainName.replace(/\s+/g, '')} #DeFi #crypto`

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  const handleCopyShareMessage = async () => {
    const shareMessage = `$${pool.tokenSymbol} is NOW LIVE on ${chainName}!

Liquidity added on Uniswap V2
${pool.tokenAmount} ${pool.tokenSymbol} + ${pool.ethAmount} ${nativeTokenSymbol}

BUY NOW: ${uniswapUrl}
Chart: ${dexscreenerUrl}
Contract: ${pool.tokenAddress}`

    try {
      await navigator.clipboard.writeText(shareMessage)
      setShareMessageCopied(true)
      setTimeout(() => setShareMessageCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const trackShare = (platform: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'liquidity_added',
        item_id: pool.tokenAddress
      })
    }
  }
  
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-label={isWithdrawal ? 'Liquidity Removed' : 'Liquidity Added'} ref={modalRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`relative ${colors.glassCard} rounded-2xl p-5 sm:p-8 w-full max-w-lg max-h-full overflow-y-auto overscroll-contain`}
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {isWithdrawal ? 'Liquidity Removed Successfully!' : 'Liquidity Added Successfully!'}
          </h2>
          <p className="text-green-200 text-lg">
            {isWithdrawal
              ? `Your liquidity has been removed from the ${pool.tokenSymbol}/${nativeTokenSymbol} pool on Uniswap V2.`
              : `Your liquidity has been added to the ${pool.tokenSymbol}/${nativeTokenSymbol} pool on Uniswap V2.`
            }
          </p>
        </div>

        {/* Pool Details - Only show for liquidity additions, not withdrawals */}
        {!isWithdrawal && (
          <div className="space-y-6 mb-8">
            {/* Pool Composition */}
            <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
              <h3 className={`${typography.cardTitle} text-lg mb-4 text-center`}>Pool Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400 break-all">{pool.tokenAmount}</div>
                  <div className="text-sm text-gray-400 break-all">{pool.tokenSymbol}</div>
                </div>
                <div className="text-center min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400 break-all">{pool.ethAmount}</div>
                  <div className="text-sm text-gray-400 break-all">{nativeTokenSymbol}</div>
                </div>
              </div>
            </div>

            {/* LP Token Address - only show if valid address */}
            {pool.lpTokenAddress && 
             pool.lpTokenAddress !== '0x0000000000000000000000000000000000000000' && 
             pool.lpTokenAddress.length === 42 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-300">LP Token Address:</span>
                </div>
                <div className="bg-black/20 rounded-lg p-3 mb-3">
                  <p className="text-xs font-mono break-all text-gray-300">
                    {pool.lpTokenAddress}
                  </p>
                </div>
                <motion.button
                  onClick={handleCopyAddress}
                  aria-label="Copy LP token address"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 min-h-[44px] rounded-lg font-medium text-sm transition-[background-color,color,border-color,box-shadow,opacity] duration-200 flex items-center space-x-2 cursor-pointer ${
                    isCopied
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30'
                  }`}
                  disabled={!pool.lpTokenAddress}
                >
                  <motion.div
                    initial={false}
                    animate={{ 
                      rotate: isCopied ? 360 : 0,
                      scale: isCopied ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      duration: isCopied ? 0.25 : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {isCopied ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </motion.div>
                  <motion.span
                    key={isCopied ? 'copied' : 'copy'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCopied ? 'Copied!' : 'Copy Address'}
                  </motion.span>
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* MAIN VIRAL SHARE SECTION - Only after adding liquidity */}
        {!isWithdrawal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mb-6 bg-gradient-to-br from-green-500/20 via-cyan-500/20 to-blue-500/20 border-2 border-green-500/40 rounded-2xl p-4 sm:p-6"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-balance">
                Your Token is NOW Tradable!
              </h3>
              <p className="text-sm text-gray-300">
                Share with your community so they can buy ${ pool.tokenSymbol}!
              </p>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              {/* Twitter Share - PRIMARY CTA */}
              <motion.a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackShare('twitter')}
                aria-label="Share liquidity addition on Twitter"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/40 transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
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

              {/* Copy Share Message - SECONDARY */}
              <motion.button
                onClick={() => {
                  handleCopyShareMessage()
                  trackShare('copy_message')
                }}
                aria-label="Copy share message for Telegram or Discord"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
                  shareMessageCopied
                    ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
                    : 'bg-gray-800/50 border-2 border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:bg-gray-800'
                }`}
              >
                {shareMessageCopied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied! Paste in Telegram/Discord</span>
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

            {/* Share Benefit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <p className="text-xs text-gray-300 text-center">
                <strong className="text-green-300">More buyers = More volume = Higher price!</strong> Share now!
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Only show DEXScreener button for liquidity additions, not withdrawals */}
          {!isWithdrawal && (
            <motion.a
              href={dexscreenerUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 text-base sm:text-lg font-semibold rounded-xl transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${colors.primaryButton} flex items-center justify-center space-x-2`}
            >
              <span>View Chart on DEXScreener</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          )}
          
          <motion.a
            href={`${explorerUrl}/tx/${pool.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 min-h-[44px] text-base font-medium rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 flex items-center justify-center space-x-2"
          >
            <span>View Transaction</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
          
          <motion.button
            onClick={onClose}
            aria-label="Close success modal"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 min-h-[44px] text-base font-medium rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}