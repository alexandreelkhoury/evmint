import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { abbreviateAddress } from '../../../services/geckoTerminal'
import { getChainName } from '../../../config/chains'
import { useFirebaseAnalytics } from '../../../components/FirebaseProvider'
import { trackButtonClick } from '../../../utils/analytics'
import ChainBadge from '../../../components/ChainBadge'
import type { GeckoPoolData, GeckoTokenInfo } from '../../../services/geckoTerminal'

interface TokenHeaderProps {
  tokenAddress: string
  tokenInfo: GeckoTokenInfo | null
  pool: GeckoPoolData | null
  isTokenBase: boolean
  chainId: number
  /** Absolute, chain-aware URL for this page — what the share affordances hand out */
  shareUrl: string
}

function buildFallbackIcon(address: string) {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=3b82f6,8b5cf6,10b981&size=100`
}

/**
 * Human-readable USD price across the full range a freshly launched token
 * can sit in. Shared with the page's meta tags so the headline price and the
 * unfurl never disagree.
 */
export function formatTokenPrice(value: number): string {
  if (value >= 0.01) {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (value >= 0.0001) return `$${value.toFixed(4)}`
  return `$${value.toExponential(2)}`
}

export default function TokenHeader({
  tokenAddress,
  tokenInfo,
  pool,
  isTokenBase,
  chainId,
  shareUrl,
}: TokenHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const analytics = useFirebaseAnalytics()

  const name = tokenInfo?.attributes.name || pool?.attributes.name?.split(' / ')[0] || 'Unknown Token'
  const symbol = tokenInfo?.attributes.symbol || ''
  const imageUrl = tokenInfo?.attributes.image_url || buildFallbackIcon(tokenAddress)
  const chainName = getChainName(chainId)

  const price = isTokenBase
    ? pool?.attributes.base_token_price_usd
    : pool?.attributes.quote_token_price_usd
  const priceChange = pool?.attributes.price_change_percentage?.h24

  const priceNum = price ? parseFloat(price) : null
  const changeNum = priceChange ? parseFloat(priceChange) : null
  const isPositive = changeNum !== null && changeNum >= 0

  // Ticker used in share copy — never render an empty $ sigil
  const shareSymbol = symbol || pool?.attributes.name?.split(' / ')[0] || 'TOKEN'

  // Only claim a price when we actually have one
  const priceLine =
    priceNum !== null && priceNum > 0
      ? `${formatTokenPrice(priceNum)}${changeNum !== null ? ` (${isPositive ? '+' : ''}${changeNum.toFixed(2)}% 24h)` : ''}`
      : null

  const tweetText = [
    `$${shareSymbol} is live on ${chainName}`,
    '',
    priceLine,
    'Live chart, real-time trades and one-click swap',
    '',
    shareUrl,
    '',
    'Launched with @EVMint_io',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — leave the button in its default state
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
      trackButtonClick(analytics, 'token_share_copy_link', 'token-detail')
    } catch {
      // Clipboard unavailable — leave the button in its default state
    }
  }

  const shareButtonBase =
    'inline-flex items-center gap-1.5 px-3.5 min-h-[44px] rounded-xl text-xs font-semibold font-sans border transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30'

  // Invisible 44x44 hit area so the icon-only copy button meets the tap-target
  // minimum without stretching the address row it sits in.
  const hitArea44 = "relative after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6"
    >
      {/* Token icon — fixed size to prevent layout shift */}
      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex-shrink-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${name} token icon`}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = buildFallbackIcon(tokenAddress)
          }}
        />
      </div>

      {/* Name + symbol + chain badge */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white truncate">
            {name}
          </h1>
          {symbol && (
            <span className="text-lg font-sans text-gray-400 font-medium">
              ${symbol}
            </span>
          )}
          {/* Issue #9: Chain badge */}
          <ChainBadge chainId={chainId} size="sm" />
        </div>

        {/* Address row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-400 font-mono">
            {abbreviateAddress(tokenAddress)}
          </span>
          <button
            onClick={handleCopy}
            className={`text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${hitArea44}`}
            aria-label="Copy token address"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Price + share cluster */}
      <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
        {priceNum !== null && (
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-display font-bold text-white">
              {formatTokenPrice(priceNum)}
            </div>
            {changeNum !== null && (
              <span
                className={`text-sm font-semibold ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}
                {changeNum.toFixed(2)}%
                <span className="text-gray-400 ml-1 font-normal">24h</span>
              </span>
            )}
          </div>
        )}

        {/* Share affordances — the chain-aware canonical URL, not window.location */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            aria-label="Copy shareable link to this token page"
            className={`${shareButtonBase} ${
              linkCopied
                ? 'bg-green-500/15 border-green-500/40 text-green-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
            }`}
          >
            {linkCopied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m4.5-4.5l1.5-1.5a4 4 0 015.656 5.656l-3 3a4 4 0 01-5.656 0" />
              </svg>
            )}
            <span aria-live="polite">{linkCopied ? 'Copied!' : 'Copy link'}</span>
          </button>

          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackButtonClick(analytics, 'token_share_twitter', 'token-detail')}
            aria-label={`Share $${shareSymbol} on X`}
            className={`${shareButtonBase} bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-gray-300 hover:text-white`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      </div>
    </motion.div>
  )
}
