import { motion, useReducedMotion } from 'framer-motion'
import { formatUsd } from '../../../services/geckoTerminal'
import { colors } from '../../../styles/designSystem'
import type { GeckoPoolData, GeckoTokenInfo } from '../../../services/geckoTerminal'

interface PoolStatsProps {
  pool: GeckoPoolData | null
  tokenInfo: GeckoTokenInfo | null
  isTokenBase: boolean
  loading: boolean
}

export default function PoolStats({ pool, tokenInfo, isTokenBase, loading }: PoolStatsProps) {
  const prefersReducedMotion = useReducedMotion()

  if (loading) {
    return (
      <div className={colors.glassCard + ' p-5'}>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!pool) return null

  const attrs = pool.attributes
  const price = isTokenBase ? attrs.base_token_price_usd : attrs.quote_token_price_usd
  const change24h = attrs.price_change_percentage.h24
  const change1h = attrs.price_change_percentage.h1
  const vol24h = attrs.volume_usd.h24
  const vol1h = attrs.volume_usd.h1
  const liquidity = attrs.reserve_in_usd
  const fdv = attrs.fdv_usd
  const marketCap = attrs.market_cap_usd

  const stats: { label: string; value: string; color?: string }[] = [
    { label: 'Price', value: price ? formatUsd(price) : '\u2014' },
    {
      label: '24h Change',
      value: change24h ? `${parseFloat(change24h) >= 0 ? '+' : ''}${parseFloat(change24h).toFixed(2)}%` : '\u2014',
      color: change24h ? (parseFloat(change24h) >= 0 ? 'text-green-400' : 'text-red-400') : undefined,
    },
    {
      label: '1h Change',
      value: change1h ? `${parseFloat(change1h) >= 0 ? '+' : ''}${parseFloat(change1h).toFixed(2)}%` : '\u2014',
      color: change1h ? (parseFloat(change1h) >= 0 ? 'text-green-400' : 'text-red-400') : undefined,
    },
    { label: '24h Volume', value: vol24h ? formatUsd(vol24h) : '\u2014' },
    { label: '1h Volume', value: vol1h ? formatUsd(vol1h) : '\u2014' },
    { label: 'Liquidity', value: liquidity ? formatUsd(liquidity) : '\u2014' },
    { label: 'FDV', value: fdv ? formatUsd(fdv) : '\u2014' },
    ...(marketCap ? [{ label: 'Market Cap', value: formatUsd(marketCap) }] : []),
  ]

  // Social links — sourced from GeckoTerminal token info, so they are frequently
  // absent for a brand new token. Drop empty entries so we never render a blank slot.
  const socials = tokenInfo?.attributes
  const websites = socials?.websites?.filter((url) => Boolean(url && url.trim())) ?? []
  const hasSocials = Boolean(
    websites.length || socials?.twitter_handle || socials?.telegram_handle || socials?.discord_url
  )

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={colors.glassCard + ' p-5'}
    >
      <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider mb-4">
        Pool Stats
      </h3>

      <div className="space-y-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-sans">{stat.label}</span>
            <span className={`text-sm font-semibold font-sans ${stat.color || 'text-white'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Pool info */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-sans">Pool</span>
          <span className="text-xs text-gray-500 font-mono">{attrs.name}</span>
        </div>
        {attrs.pool_created_at && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400 font-sans">Created</span>
            <span className="text-xs text-gray-500 font-sans">
              {new Date(attrs.pool_created_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Issue #15: Social links with brand-colored SVG icons */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <h4 className="text-xs text-gray-400 font-sans mb-2">Links</h4>
        {!hasSocials ? (
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            No official links listed yet. Token socials are sourced from GeckoTerminal.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {websites.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors duration-200 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
            ))}
            {socials?.twitter_handle && (
              <a
                href={`https://twitter.com/${socials.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#1DA1F2] hover:text-[#1a8cd8] transition-colors duration-200 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 px-2.5 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/50"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </a>
            )}
            {socials?.telegram_handle && (
              <a
                href={`https://t.me/${socials.telegram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#26A5E4] hover:text-[#229ED9] transition-colors duration-200 bg-[#26A5E4]/10 hover:bg-[#26A5E4]/20 px-2.5 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#26A5E4]/50"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </a>
            )}
            {socials?.discord_url && (
              <a
                href={socials.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#5865F2] hover:text-[#4752C4] transition-colors duration-200 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 px-2.5 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
                Discord
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
