import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getAddressUrl, getChainById } from '../../../config/chains'

interface SuccessModalProps {
  tokenAddress: string
  chainName: string
  tokenName?: string
  tokenSymbol?: string
  totalSupply?: string
  /** Live source-verification state. `null`/undefined hides the row entirely. */
  verificationStatus?: 'pending' | 'success' | 'failed' | null
  /** Used to build explorer links that are correct for every supported chain */
  chainId?: number
  onRetryVerification?: () => void
  /** Clears the form in place. Without it we fall back to a full page reload. */
  onCreateAnother?: () => void
}

/**
 * Human-readable supply. Uses Number, not parseInt: parseInt silently truncates
 * above 2^53 and this field routinely holds billions.
 */
function formatSupply(supply: string): string {
  const n = Number(supply)
  if (!Number.isFinite(n)) return supply
  if (n >= 1e12) return `${(n / 1e12).toFixed(n % 1e12 === 0 ? 0 : 1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M`
  return n.toLocaleString('en-US')
}

/** Cross-fades rather than hard-swapping — the exit is what signals the change. */
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

export default function SuccessModal({
  tokenAddress,
  chainName,
  tokenSymbol,
  totalSupply,
  verificationStatus = null,
  chainId,
  onRetryVerification,
  onCreateAnother
}: SuccessModalProps) {
  const [copied, setCopied] = useState<'address' | 'message' | null>(null)

  const copy = async (text: string, which: 'address' | 'message') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* clipboard blocked — say nothing rather than claim success */
    }
  }

  // Built from chain config, not a hardcoded name->domain map. The old map was
  // missing several chains and fell back to etherscan.io, so those users got a
  // dead link — and that dead link was embedded in the prefilled tweet.
  const explorerName = chainId ? getChainById(chainId)?.explorer?.name ?? 'the explorer' : 'the explorer'
  const addressUrl = chainId ? getAddressUrl(chainId, tokenAddress) : null
  const sourceCodeUrl = addressUrl ? `${addressUrl}#code` : null
  const liquidityUrl = `/liquidity?token=${tokenAddress}${chainId ? `&chain=${chainId}` : ''}`

  // Factual. The platform states what was deployed; it does not write hype in
  // the creator's voice or tell anyone to buy.
  const shareText = [
    `${tokenSymbol ? `$${tokenSymbol}` : 'My token'} is deployed on ${chainName}.`,
    ``,
    `Contract: ${tokenAddress}`,
    ...(addressUrl ? [addressUrl] : []),
  ].join('\n')
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  const tertiary =
    'inline-flex items-center gap-1.5 min-h-[44px] px-3 -mx-1 rounded-lg text-[13px] text-gray-400 hover:text-white transition-[color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 rounded-2xl bg-gray-900/80 p-5"
      style={{
        boxShadow:
          '0 0 0 1px rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* Status */}
      <div className="flex items-center gap-2 mb-1">
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center">
          <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <h3 className="text-[17px] font-semibold text-white tracking-tight text-balance">
          {tokenSymbol ? `$${tokenSymbol} deployed` : 'Token deployed'}
        </h3>
      </div>
      <p className="text-[13px] text-gray-400 leading-snug">
        Live on {chainName}
        {totalSupply ? ` · ${formatSupply(totalSupply)} supply` : ''}. It isn&apos;t tradable until you add liquidity.
      </p>

      {/* Contract address */}
      <button
        onClick={() => copy(tokenAddress, 'address')}
        className="mt-4 w-full flex items-center gap-2 min-h-[44px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] transition-[background-color,scale] duration-150 active:scale-[0.96] text-left focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label="Copy contract address"
      >
        <span className="text-[11px] uppercase tracking-wider text-gray-400 flex-shrink-0">Contract</span>
        <span className="flex-1 min-w-0 truncate font-mono text-[12px] text-gray-300">{tokenAddress}</span>
        <span className="flex-shrink-0 text-[12px]">
          <CopyLabel copied={copied === 'address'} />
        </span>
      </button>

      {/* Source verification. Never shows a check for a queued job — 'success'
          is only reached once the explorer itself confirms. */}
      {verificationStatus && (
        <div className="mt-2">
          {verificationStatus === 'success' && sourceCodeUrl && (
            <a
              href={sourceCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 min-h-[40px] px-4 rounded-xl bg-green-500/[0.08] border border-green-500/20 text-[13px] text-green-300 hover:bg-green-500/[0.14] transition-colors"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Source verified on {explorerName}
            </a>
          )}
          {verificationStatus === 'pending' && (
            <div role="status" className="flex items-center gap-2 min-h-[40px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[13px] text-gray-300">
              <span className="w-3.5 h-3.5 flex-shrink-0 rounded-full border-2 border-gray-500/40 border-t-gray-300 animate-spin" aria-hidden="true" />
              Verifying source — usually under two minutes
            </div>
          )}
          {verificationStatus === 'failed' && (
            <div className="flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[13px] text-gray-400">
              <span className="flex-1">Source not published yet. Your token itself is fine.</span>
              {onRetryVerification && (
                <button
                  type="button"
                  onClick={onRetryVerification}
                  className="flex-shrink-0 text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* One primary action, and it is the one the copy above just named. The
          old "Next Steps" cards listed this as step 1, then padded it out with
          two pieces of generic advice. */}
      <Link
        to={liquidityUrl}
        className="mt-4 w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-[background-color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Add liquidity
      </Link>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 w-full flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-white/[0.05] border border-white/[0.10] text-sm font-semibold text-gray-200 hover:bg-white/[0.09] transition-[background-color,scale] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>

      <div className="mt-1 flex items-center justify-between flex-wrap">
        <button onClick={() => copy(shareText, 'message')} className={tertiary}>
          <CopyLabel copied={copied === 'message'} idle="Copy message" done="Copied" />
        </button>
        {addressUrl && (
          <a href={addressUrl} target="_blank" rel="noopener noreferrer" className={tertiary}>
            Explorer
            <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        <Link to="/tokens" className={tertiary}>My tokens</Link>
        <button
          type="button"
          onClick={() => {
            if (onCreateAnother) {
              onCreateAnother()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              // A full reload also re-initialises Privy, which is slow and
              // jarring — the prop is the preferred path.
              window.location.reload()
            }
          }}
          className={tertiary}
        >
          Create another
        </button>
      </div>
    </motion.div>
  )
}
