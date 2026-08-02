import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { getChainById, getExplorerUrl } from '../../config/chains'
import { getGeckoNetworkId, DEXSCREENER_SLUGS } from '../../services/geckoTerminal'
import { useScrollLock } from '../../hooks/useScrollLock'
import { useModalA11y } from '../../hooks/useModalA11y'
import CloseButton from '../CloseButton'

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
  isWithdrawal?: boolean
}

/**
 * Opening price, in native token per unit of the new token. This is the single
 * most consequential number of the whole flow — it is what the first buyer
 * trades against — and the old modal never showed it.
 */
function openingPrice(tokenAmount: string, ethAmount: string): string | null {
  const t = parseFloat(tokenAmount)
  const e = parseFloat(ethAmount)
  if (!Number.isFinite(t) || !Number.isFinite(e) || t <= 0 || e <= 0) return null
  const p = e / t
  if (p >= 0.001) return p.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
  return p.toExponential(3)
}

/**
 * Thousands separators for the deposited amounts. Falls back to the raw string
 * rather than mangling anything that isn't a plain number — these come from a
 * text input and have already been sent to the chain, so displaying them
 * differently from what was signed would be worse than displaying them plainly.
 */
function formatAmount(value: string): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  const [int, frac] = value.split('.')
  const grouped = Number(int).toLocaleString('en-US')
  return frac ? `${grouped}.${frac}` : grouped
}

/**
 * Copy-state label. Cross-fades instead of hard-swapping the text: the exit is
 * what tells you the state changed, and a plain swap loses it. `initial={false}`
 * so it doesn't animate on first paint.
 */
function CopyLabel({ copied, idle = 'Copy', done = 'Copied' }: { copied: boolean; idle?: string; done?: string }) {
  return (
    <span className="relative inline-flex items-center justify-end min-w-[3.5rem]">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={copied ? 'done' : 'idle'}
          initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
          className={copied ? 'text-green-400' : 'text-gray-400'}
        >
          {copied ? done : idle}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const isRealAddress = (a?: string) =>
  !!a && a.length === 42 && a.startsWith('0x') && a !== '0x0000000000000000000000000000000000000000'

export default function SuccessModal({ isOpen, onClose, pool, chainId, isWithdrawal = false }: SuccessModalProps) {
  const [copied, setCopied] = useState<'lp' | 'message' | null>(null)

  useScrollLock(isOpen)
  const modalRef = useModalA11y(isOpen, onClose)

  if (!isOpen) return null

  const chainConfig = getChainById(chainId)
  const nativeSymbol = chainConfig?.nativeCurrency?.symbol || 'ETH'
  const chainName = chainConfig?.name || 'this network'
  const explorerUrl = getExplorerUrl(chainId)

  const slug = DEXSCREENER_SLUGS[chainId] ?? null
  const dexscreenerUrl = slug ? `https://dexscreener.com/${slug}/${pool.tokenAddress}` : null
  const tradeUrl = slug
    ? `https://app.uniswap.org/swap?outputCurrency=${pool.tokenAddress}&chain=${slug}`
    : null
  const price = openingPrice(pool.tokenAmount, pool.ethAmount)

  // TokenDetailPage renders chart, trades and a swap widget from GeckoTerminal.
  // Chains outside its coverage (Monad, MegaETH, Robinhood Chain...) hit an
  // "Unsupported Network" wall there, so only offer the link where it works.
  const tokenPageUrl =
    !isWithdrawal && getGeckoNetworkId(chainId)
      ? `/token/${pool.tokenAddress.toLowerCase()}?chain=${chainId}`
      : null

  const copy = async (text: string, which: 'lp' | 'message') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* clipboard blocked — leave the button unchanged rather than lying */
    }
  }

  // Factual, not promotional. The platform states what exists and links to it;
  // it does not tell anyone to buy, and does not write hype in the user's voice.
  const shareLines = [
    `$${pool.tokenSymbol} is live on ${chainName}.`,
    ``,
    `${pool.tokenAmount} ${pool.tokenSymbol} / ${pool.ethAmount} ${nativeSymbol} liquidity on Uniswap V2`,
    ...(tokenPageUrl ? [``, `Chart and swap: https://evmint.io${tokenPageUrl}`] : []),
    ...(tradeUrl && !tokenPageUrl ? [``, `Trade: ${tradeUrl}`] : []),
    ...(dexscreenerUrl && !tokenPageUrl ? [`Chart: ${dexscreenerUrl}`] : []),
    ``,
    `Contract: ${pool.tokenAddress}`,
  ]
  const shareText = shareLines.join('\n')
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  const secondaryLink =
    'inline-flex items-center gap-1.5 min-h-[44px] px-3 -mx-1 rounded-lg text-[13px] text-gray-400 hover:text-white transition-[color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400'

  const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isWithdrawal ? 'Liquidity removed' : 'Liquidity added'}
      ref={modalRef}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[420px] bg-gray-900 rounded-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain"
        style={{
          // Layered transparent shadows read as real depth; a single hard border
          // plus one wide blur is the flat "ghost card" look.
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.45), 0 24px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div className="absolute top-3 right-3">
          <CloseButton onClick={onClose} ariaLabel="Close" />
        </div>

        <div className="px-5 pt-5 pb-4">
          {/* Status. A 16px check next to the title says the same thing an 80px
              gradient circle did, in a tenth of the vertical space. */}
          <div className="flex items-center gap-2 mb-1">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h2 className="text-[17px] font-semibold text-white tracking-tight text-balance">
              {isWithdrawal ? 'Liquidity removed' : 'Liquidity added'}
            </h2>
          </div>
          <p className="text-[13px] text-gray-400 leading-snug">
            {isWithdrawal
              ? `Withdrawn from the ${pool.tokenSymbol}/${nativeSymbol} pool on ${chainName}.`
              : `${pool.tokenSymbol}/${nativeSymbol} is live on ${chainName}. Anyone can trade it now.`}
          </p>

          {!isWithdrawal && (
            <>
              {/* The receipt: what went in, and the price it set. One block, no nesting. */}
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 py-3.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wider text-gray-400">Deposited</dt>
                  <dd className="text-sm text-white tabular-nums truncate" title={`${pool.tokenAmount} ${pool.tokenSymbol}`}>
                    {formatAmount(pool.tokenAmount)} <span className="text-gray-400">{pool.tokenSymbol}</span>
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wider text-gray-400">Paired with</dt>
                  <dd className="text-sm text-white tabular-nums truncate" title={`${pool.ethAmount} ${nativeSymbol}`}>
                    {formatAmount(pool.ethAmount)} <span className="text-gray-400">{nativeSymbol}</span>
                  </dd>
                </div>
                {price && (
                  <div className="col-span-2 min-w-0 pt-3 border-t border-white/[0.07]">
                    <dt className="text-[11px] uppercase tracking-wider text-gray-400">Opening price</dt>
                    <dd className="text-sm text-white tabular-nums truncate">
                      1 {pool.tokenSymbol} = {price} {nativeSymbol}
                    </dd>
                  </div>
                )}
              </dl>

              {isRealAddress(pool.lpTokenAddress) && (
                <button
                  onClick={() => copy(pool.lpTokenAddress!, 'lp')}
                  className="mt-2 w-full flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] transition-[background-color,scale] duration-150 active:scale-[0.96] text-left focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label="Copy LP token address"
                >
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 flex-shrink-0">LP token</span>
                  <span className="flex-1 min-w-0 truncate font-mono text-[12px] text-gray-300">
                    {pool.lpTokenAddress}
                  </span>
                  <span className="flex-shrink-0 text-[12px]">
                    <CopyLabel copied={copied === 'lp'} />
                  </span>
                </button>
              )}

              {/* Primary is the token page when we can actually render one: it is
                  the thing to look at next, and it is the link worth sharing.
                  Gated on GeckoTerminal coverage — the same check TokenDetailPage
                  uses — so we never send anyone to its "Unsupported Network" wall. */}
              {tokenPageUrl && (
                <a
                  href={tokenPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-[background-color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Open token page
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl text-sm font-semibold transition-[background-color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  tokenPageUrl
                    ? 'mt-2 bg-white/[0.05] border border-white/[0.10] text-gray-200 hover:bg-white/[0.09]'
                    : 'mt-4 bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </a>

              <div className="mt-1 flex items-center justify-between">
                <button onClick={() => copy(shareText, 'message')} className={secondaryLink}>
                  <CopyLabel copied={copied === 'message'} idle="Copy message" done="Copied" />
                </button>
                {dexscreenerUrl && (
                  <a href={dexscreenerUrl} target="_blank" rel="noopener noreferrer" className={secondaryLink}>
                    Chart <ArrowIcon />
                  </a>
                )}
                <a href={`${explorerUrl}/tx/${pool.txHash}`} target="_blank" rel="noopener noreferrer" className={secondaryLink}>
                  Transaction <ArrowIcon />
                </a>
              </div>
            </>
          )}

          {isWithdrawal && (
            <a
              href={`${explorerUrl}/tx/${pool.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-white/[0.05] border border-white/[0.10] text-sm font-medium text-gray-200 hover:bg-white/[0.08] transition-[background-color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              View transaction <ArrowIcon />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
