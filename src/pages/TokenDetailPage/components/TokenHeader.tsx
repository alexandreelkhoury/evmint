import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { abbreviateAddress } from '../../../services/geckoTerminal'
import ChainBadge from '../../../components/ChainBadge'
import type { GeckoPoolData, GeckoTokenInfo } from '../../../services/geckoTerminal'

interface TokenHeaderProps {
  tokenAddress: string
  tokenInfo: GeckoTokenInfo | null
  pool: GeckoPoolData | null
  isTokenBase: boolean
  chainId: number
}

function buildFallbackIcon(address: string) {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=3b82f6,8b5cf6,10b981&size=100`
}

export default function TokenHeader({
  tokenAddress,
  tokenInfo,
  pool,
  isTokenBase,
  chainId,
}: TokenHeaderProps) {
  const [copied, setCopied] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const name = tokenInfo?.attributes.name || pool?.attributes.name?.split(' / ')[0] || 'Unknown Token'
  const symbol = tokenInfo?.attributes.symbol || ''
  const imageUrl = tokenInfo?.attributes.image_url || buildFallbackIcon(tokenAddress)

  const price = isTokenBase
    ? pool?.attributes.base_token_price_usd
    : pool?.attributes.quote_token_price_usd
  const priceChange = pool?.attributes.price_change_percentage?.h24

  const priceNum = price ? parseFloat(price) : null
  const changeNum = priceChange ? parseFloat(priceChange) : null
  const isPositive = changeNum !== null && changeNum >= 0

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
          <span className="text-sm text-gray-500 font-mono">
            {abbreviateAddress(tokenAddress)}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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

      {/* Price + change */}
      {priceNum !== null && (
        <div className="text-right flex-shrink-0">
          <div className="text-2xl sm:text-3xl font-display font-bold text-white">
            {priceNum >= 0.01
              ? `$${priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : priceNum >= 0.0001
                ? `$${priceNum.toFixed(4)}`
                : `$${priceNum.toExponential(2)}`}
          </div>
          {changeNum !== null && (
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {changeNum.toFixed(2)}%
              <span className="text-gray-500 ml-1 font-normal">24h</span>
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
