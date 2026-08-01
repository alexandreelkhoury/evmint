import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  formatTokenAmount,
  formatUsd,
  timeAgo,
  abbreviateAddress,
  type GeckoTradeData,
} from '../../../services/geckoTerminal'
import { getTxUrl, getAddressUrl } from '../../../config/chains'
import { colors } from '../../../styles/designSystem'

interface ActivityTableProps {
  trades: GeckoTradeData[]
  newTradeIds: Set<string>
  buyCount: number
  sellCount: number
  loading: boolean
  error: string | null
  chainId: number
}

// Invisible hit areas for the compact row actions. The row stays visually dense
// while the maker link and the explorer icon both reach the 44px tap minimum.
const hitAreaRow = "relative inline-block after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']"
const hitAreaIcon = "relative after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"

/** Fields both the table row and the mobile card render — derived once, in one place. */
function readTrade(trade: GeckoTradeData) {
  const isBuy = trade.attributes.kind === 'buy'
  return {
    isBuy,
    usdVol: trade.attributes.volume_in_usd,
    maker: trade.attributes.tx_from_address,
    txHash: trade.attributes.tx_hash,
    time: trade.attributes.block_timestamp,
    amount: isBuy ? trade.attributes.to_token_amount : trade.attributes.from_token_amount,
  }
}

export default function ActivityTable({
  trades,
  newTradeIds,
  buyCount,
  sellCount,
  loading,
  error,
  chainId,
}: ActivityTableProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className={colors.glassCard + ' overflow-hidden'}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            Recent Activity
          </h3>
          <div className="flex items-center gap-3 text-xs font-sans">
            <span className="text-green-400">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1" />
              {buyCount} buys
            </span>
            <span className="text-red-400">
              <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1" />
              {sellCount} sells
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-xs text-gray-400 font-sans">Auto-refresh 15s</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Loading state */}
      {loading && trades.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400 font-sans">Loading trades...</p>
        </div>
      )}

      {/* Error state — Issue #13: contextual illustration */}
      {error && trades.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-sans">{error}</p>
        </div>
      )}

      {/* Empty state — Issue #13: more detailed illustration */}
      {!loading && !error && trades.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-sans font-medium mb-1">No trades yet</p>
          <p className="text-xs text-gray-400 font-sans">
            Buys, sells, and liquidity changes will appear here.
          </p>
        </div>
      )}

      {/* Stacked cards below sm — no horizontal scroll nested in the page scroll */}
      {trades.length > 0 && (
        <ul className="sm:hidden divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {trades.map((trade) => {
              const { isBuy, usdVol, maker, txHash, time, amount } = readTrade(trade)
              const isNew = newTradeIds.has(trade.id)

              return (
                <motion.li
                  key={trade.id}
                  initial={isNew && !prefersReducedMotion ? { opacity: 0, y: -8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`px-5 py-3.5 ${
                    isNew ? (isBuy ? 'bg-green-500/[0.06]' : 'bg-red-500/[0.06]') : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                        isBuy
                          ? 'bg-green-600/20 text-green-400 border-green-600/30'
                          : 'bg-red-600/20 text-red-400 border-red-600/30'
                      }`}
                    >
                      {isBuy ? 'BUY' : 'SELL'}
                    </span>
                    <span className="text-base text-white font-sans font-semibold">
                      {formatUsd(usdVol)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-2">
                    <div className="flex items-center gap-2 min-w-0 text-xs font-sans text-gray-400">
                      <span className="truncate">{amount ? formatTokenAmount(amount) : '—'}</span>
                      {time && (
                        <>
                          <span aria-hidden="true" className="text-gray-500">·</span>
                          <span className="flex-shrink-0">{timeAgo(time)}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {maker && (
                        <a
                          href={getAddressUrl(chainId, maker)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs text-gray-400 hover:text-blue-400 transition-colors duration-200 font-mono cursor-pointer focus:outline-none focus:text-blue-400 ${hitAreaRow}`}
                        >
                          {abbreviateAddress(maker)}
                        </a>
                      )}
                      {txHash && (
                        <a
                          href={getTxUrl(chainId, txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-gray-400 hover:text-blue-400 transition-colors duration-200 cursor-pointer inline-flex focus:outline-none focus:text-blue-400 ${hitAreaIcon}`}
                          aria-label="View transaction on block explorer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}

      {/* Table — sm and up. Issue #8: fade scroll hint kept for the narrow sm–md band */}
      {trades.length > 0 && (
        <div className="relative hidden sm:block">
          {/* Fade edge scroll hint while the table can still overflow */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none z-10 md:hidden" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider font-sans border-b border-white/5">
                  <th className="text-left px-5 py-3 font-medium">Type</th>
                  <th className="text-right px-4 py-3 font-medium">USD</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Maker</th>
                  <th className="text-right px-4 py-3 font-medium">Age</th>
                  <th className="text-right px-5 py-3 font-medium">Tx</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {trades.map((trade) => {
                    const { isBuy, usdVol, maker, txHash, time, amount } = readTrade(trade)
                    const isNew = newTradeIds.has(trade.id)

                    return (
                      <motion.tr
                        key={trade.id}
                        // Issue #12: Use opacity + translateY only (no backgroundColor animation)
                        initial={isNew && !prefersReducedMotion ? { opacity: 0, y: -8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors duration-150 ${
                          isNew ? (isBuy ? 'bg-green-500/[0.06]' : 'bg-red-500/[0.06]') : ''
                        }`}
                      >
                        {/* Type — Issue #11: Use design system badge tokens */}
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                              isBuy
                                ? 'bg-green-600/20 text-green-400 border-green-600/30'
                                : 'bg-red-600/20 text-red-400 border-red-600/30'
                            }`}
                          >
                            {isBuy ? 'BUY' : 'SELL'}
                          </span>
                        </td>

                        {/* USD */}
                        <td className="text-right px-4 py-3 text-sm text-white font-sans font-medium">
                          {formatUsd(usdVol)}
                        </td>

                        {/* Token amount */}
                        <td className="text-right px-4 py-3 text-sm text-gray-400 font-sans">
                          {amount ? formatTokenAmount(amount) : '\u2014'}
                        </td>

                        {/* Maker */}
                        <td className="text-right px-4 py-3 hidden md:table-cell">
                          {maker ? (
                            <a
                              href={getAddressUrl(chainId, maker)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 font-mono cursor-pointer focus:outline-none focus:text-blue-400 ${hitAreaRow}`}
                            >
                              {abbreviateAddress(maker)}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">{'\u2014'}</span>
                          )}
                        </td>

                        {/* Age */}
                        <td className="text-right px-4 py-3 text-sm text-gray-400 font-sans">
                          {time ? timeAgo(time) : '\u2014'}
                        </td>

                        {/* Tx link */}
                        <td className="text-right px-5 py-3">
                          {txHash ? (
                            <a
                              href={getTxUrl(chainId, txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-gray-400 hover:text-blue-400 transition-colors duration-200 cursor-pointer inline-flex focus:outline-none focus:text-blue-400 ${hitAreaIcon}`}
                              aria-label="View transaction on block explorer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <span className="text-gray-400">{'\u2014'}</span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      {trades.length > 0 && (
        <div className="px-5 py-2.5 text-xs text-gray-400 font-sans border-t border-white/5">
          Showing last {trades.length} transactions
        </div>
      )}
    </motion.div>
  )
}
