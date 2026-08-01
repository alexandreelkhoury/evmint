import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAccount, useChainId, useSwitchChain, useBalance, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { parseEther, parseUnits, formatUnits, type Address } from 'viem'
import { getChainById, getDexContracts, getWethAddress, getChainName } from '../../../config/chains'
import {
  BPS_DENOMINATOR,
  applySlippagePercent,
  getTransactionErrorCopy,
  rawErrorMessage,
  UserFacingError
} from '../../../features/liquidity/constants'
import { colors } from '../../../styles/designSystem'

// Minimal ABIs for swap operations
const ROUTER_V2_ABI = [
  {
    name: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'getAmountsOut',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
] as const

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const

// Swap slippage is user-selectable, unlike the fixed tolerance used for
// liquidity. applySlippagePercent takes the rate as a parameter for exactly
// this reason — it is the same helper both surfaces use.
const SLIPPAGE_OPTIONS = [0.5, 1, 3] as const

// WETH (and every native currency on the supported EVM chains) uses 18 decimals
const NATIVE_DECIMALS = 18

// Issue #7: Resolve native symbol from chain config, not string matching
function getNativeSymbol(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency?.symbol || 'ETH'
}

function formatAmount(amount: bigint, decimals: number, maximumFractionDigits: number): string {
  return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, { maximumFractionDigits })
}

// Invisible 44x44 hit area centred on a visually compact control, so the MAX
// pill inside the amount field meets the mobile tap-target minimum without
// growing into a block that competes with the input itself.
const hitArea44 = "relative after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"

const QUOTE_UNAVAILABLE_MESSAGE =
  'No on-chain quote available for this pair (no pool, no liquidity, or no route). Swapping is disabled — without a quote we cannot protect you from slippage.'

interface SwapPanelProps {
  tokenAddress: string
  tokenSymbol: string
  tokenChainId: number
  priceUsd: string | null
  nativeTokenPriceUsd: number | null
}

export default function SwapPanel({
  tokenAddress,
  tokenSymbol,
  tokenChainId,
  priceUsd,
  nativeTokenPriceUsd,
}: SwapPanelProps) {
  const { address, isConnected } = useAccount()
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  const prefersReducedMotion = useReducedMotion()
  const [isBuy, setIsBuy] = useState(true)
  const [inputAmount, setInputAmount] = useState('')
  const [slippage, setSlippage] = useState<number>(1)
  // Raw router quote (wei of the output token) — the source of truth for both
  // the displayed estimate and the amountOutMin we send on-chain.
  const [quotedAmountOut, setQuotedAmountOut] = useState<bigint | null>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'approving' | 'swapping' | 'success' | 'error'>('idle')
  const [txError, setTxError] = useState<string | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>()
  // Guards against a slow in-flight quote overwriting a newer one
  const quoteRequestIdRef = useRef(0)

  const isWrongChain = currentChainId !== tokenChainId
  const dex = getDexContracts(tokenChainId)
  const weth = getWethAddress(tokenChainId)
  const routerAddress = (dex?.uniswapV2Router || dex?.pancakeswapRouter || dex?.sushiswapRouter) as Address | undefined
  const nativeSymbol = getNativeSymbol(tokenChainId)

  const publicClient = usePublicClient({ chainId: tokenChainId })

  // Native balance
  const { data: nativeBalance } = useBalance({
    address,
    chainId: tokenChainId,
  })

  // Token balance
  const { data: tokenBalance } = useReadContract({
    address: tokenAddress as Address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: tokenChainId,
  })

  // Token decimals
  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress as Address,
    abi: ERC20_ABI,
    functionName: 'decimals',
    chainId: tokenChainId,
  })

  const decimals = tokenDecimals ?? 18

  // Token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as Address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && routerAddress ? [address, routerAddress] : undefined,
    chainId: tokenChainId,
  })

  // Write contract hooks
  const { writeContractAsync, data: txHash } = useWriteContract()

  const { isLoading: isTxPending } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Swap path — WETH -> token on a buy, token -> WETH on a sell
  const swapPath = useMemo<readonly Address[] | null>(() => {
    if (!weth || !tokenAddress) return null
    return isBuy
      ? [weth as Address, tokenAddress as Address]
      : [tokenAddress as Address, weth as Address]
  }, [weth, tokenAddress, isBuy])

  const outputDecimals = isBuy ? decimals : NATIVE_DECIMALS
  const outputSymbol = isBuy ? tokenSymbol : nativeSymbol

  const parseAmountIn = useCallback((value: string): bigint | null => {
    if (!value) return null
    try {
      const parsed = isBuy ? parseEther(value) : parseUnits(value, decimals)
      return parsed > 0n ? parsed : null
    } catch {
      return null
    }
  }, [isBuy, decimals])

  /**
   * Ask the router what this trade actually returns at current pool state.
   * Throws if there is no pool / no liquidity / no route — callers must NOT
   * swallow that into a permissive default.
   */
  const fetchAmountOut = useCallback(async (amountIn: bigint): Promise<bigint> => {
    if (!publicClient || !routerAddress || !swapPath) {
      throw new Error('No DEX router available for this chain')
    }

    const amounts = await publicClient.readContract({
      address: routerAddress,
      abi: ROUTER_V2_ABI,
      functionName: 'getAmountsOut',
      args: [amountIn, swapPath],
    })

    const amountOut = amounts[amounts.length - 1]
    if (amountOut === undefined || amountOut <= 0n) {
      throw new Error('Router returned a zero quote')
    }
    return amountOut
  }, [publicClient, routerAddress, swapPath])

  // Quote from the pool itself, so the estimate includes price impact (a USD
  // cross-rate does not, and price impact dominates on a small new pool).
  const getQuote = useCallback(async () => {
    const requestId = ++quoteRequestIdRef.current
    const amountIn = parseAmountIn(inputAmount)

    if (!amountIn) {
      setQuotedAmountOut(null)
      setQuoteError(null)
      setPriceImpact(null)
      setQuoteLoading(false)
      return
    }

    setQuoteLoading(true)
    try {
      const amountOut = await fetchAmountOut(amountIn)
      if (requestId !== quoteRequestIdRef.current) return

      setQuotedAmountOut(amountOut)
      setQuoteError(null)

      // Price impact (display only, never blocks the swap): quote a 1/1000th
      // probe trade to approximate the marginal price, then compare it to the
      // price this trade actually realises. The DEX fee is present in both
      // quotes, so it cancels out and we don't need per-DEX fee constants.
      const probeIn = amountIn / 1000n
      if (probeIn > 0n) {
        try {
          const probeOut = await fetchAmountOut(probeIn)
          if (requestId !== quoteRequestIdRef.current) return

          const idealOut = (amountIn * probeOut) / probeIn
          setPriceImpact(
            idealOut > 0n && amountOut < idealOut
              ? Number(((idealOut - amountOut) * BPS_DENOMINATOR) / idealOut) / 100
              : 0
          )
        } catch {
          if (requestId !== quoteRequestIdRef.current) return
          setPriceImpact(null)
        }
      } else {
        setPriceImpact(null)
      }
    } catch {
      if (requestId !== quoteRequestIdRef.current) return
      setQuotedAmountOut(null)
      setPriceImpact(null)
      setQuoteError(QUOTE_UNAVAILABLE_MESSAGE)
    } finally {
      if (requestId === quoteRequestIdRef.current) setQuoteLoading(false)
    }
  }, [inputAmount, parseAmountIn, fetchAmountOut])

  // Debounce quote
  useEffect(() => {
    const timer = setTimeout(getQuote, 500)
    return () => clearTimeout(timer)
  }, [getQuote])

  const minimumReceived = quotedAmountOut !== null ? applySlippagePercent(quotedAmountOut, slippage) : null

  // Approximate USD value of the quoted output, for context only
  const estimatedUsdValue = useMemo(() => {
    if (quotedAmountOut === null) return null
    const outputAmount = parseFloat(formatUnits(quotedAmountOut, outputDecimals))
    const unitPriceUsd = isBuy ? (priceUsd ? parseFloat(priceUsd) : null) : nativeTokenPriceUsd
    if (!unitPriceUsd || !(unitPriceUsd > 0) || !(outputAmount > 0)) return null
    return outputAmount * unitPriceUsd
  }, [quotedAmountOut, outputDecimals, isBuy, priceUsd, nativeTokenPriceUsd])

  // Issue #17: Auto-clear success after 4s
  useEffect(() => {
    if (txStatus === 'success') {
      successTimerRef.current = setTimeout(() => setTxStatus('idle'), 4000)
    }
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [txStatus])

  /**
   * Resolve amountOutMin immediately before sending the swap.
   *
   * If the router cannot quote the trade we THROW rather than falling back to
   * 0n: a zero minimum lets a sandwich bot take the whole trade on a thin pool.
   */
  const resolveAmountOutMin = async (amountIn: bigint): Promise<bigint> => {
    let expectedOut: bigint
    try {
      expectedOut = await fetchAmountOut(amountIn)
    } catch {
      setQuotedAmountOut(null)
      setPriceImpact(null)
      setQuoteError(QUOTE_UNAVAILABLE_MESSAGE)
      throw new UserFacingError(QUOTE_UNAVAILABLE_MESSAGE)
    }

    setQuotedAmountOut(expectedOut)
    setQuoteError(null)

    const amountOutMin = applySlippagePercent(expectedOut, slippage)
    if (amountOutMin <= 0n) {
      throw new UserFacingError('This trade is too small to protect — the quoted output rounds to zero at the selected slippage.')
    }
    return amountOutMin
  }

  const handleSwap = async () => {
    if (!address || !routerAddress || !weth || !inputAmount) return

    setTxError(null)

    const amountIn = parseAmountIn(inputAmount)
    if (!amountIn) {
      setTxStatus('error')
      setTxError('Enter a valid amount')
      return
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800) // 30 min

    try {
      if (isBuy) {
        const amountOutMin = await resolveAmountOutMin(amountIn)

        setTxStatus('swapping')
        await writeContractAsync({
          address: routerAddress,
          abi: ROUTER_V2_ABI,
          functionName: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
          args: [amountOutMin, [weth as Address, tokenAddress as Address], address, deadline],
          value: amountIn,
          chainId: tokenChainId,
        })

        setTxStatus('success')
        setInputAmount('')
      } else {
        const currentAllowance = allowance ?? 0n
        if (currentAllowance < amountIn) {
          setTxStatus('approving')
          await writeContractAsync({
            address: tokenAddress as Address,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [routerAddress, amountIn],
            chainId: tokenChainId,
          })
          await refetchAllowance()
        }

        // Quote after the approval so the minimum reflects the pool state at
        // the moment we actually broadcast the swap.
        const amountOutMin = await resolveAmountOutMin(amountIn)

        setTxStatus('swapping')
        await writeContractAsync({
          address: routerAddress,
          abi: ROUTER_V2_ABI,
          functionName: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
          args: [amountIn, amountOutMin, [tokenAddress as Address, weth as Address], address, deadline],
          chainId: tokenChainId,
        })

        setTxStatus('success')
        setInputAmount('')
      }
    } catch (err: unknown) {
      setTxStatus('error')

      // Same classifier and copy table the liquidity modal uses. Errors we threw
      // ourselves (UserFacingError) already carry final copy and are passed
      // through untouched.
      const { type, body } = getTransactionErrorCopy(err, nativeSymbol)

      // This panel has no reference-code affordance, so an unrecognised error
      // still shows its own short message rather than a dead end (unchanged
      // from before: shortMessage preferred, then message, then a fallback).
      const shortMessage = (err as { shortMessage?: string } | null)?.shortMessage
      setTxError(type === 'UNKNOWN' ? (shortMessage || rawErrorMessage(err) || 'Swap failed') : body)
    }
  }

  const maxBalance = isBuy
    ? nativeBalance
      ? formatUnits(nativeBalance.value, nativeBalance.decimals)
      : '0'
    : tokenBalance
      ? formatUnits(tokenBalance as bigint, decimals)
      : '0'

  const handleMax = () => {
    if (isBuy && nativeBalance) {
      const max = Number(formatUnits(nativeBalance.value, nativeBalance.decimals))
      setInputAmount(Math.max(0, max - 0.005).toFixed(6))
    } else if (!isBuy && tokenBalance) {
      setInputAmount(formatUnits(tokenBalance as bigint, decimals))
    }
  }

  // Shared focus classes for issue #2
  const focusRing = 'focus:outline-none focus:ring-2 focus:ring-blue-500/30'

  const hasValidInput = !!inputAmount && parseFloat(inputAmount) > 0
  const isBusy = txStatus === 'approving' || txStatus === 'swapping' || isTxPending
  // A swap is only allowed once we hold a live router quote — without one we
  // cannot compute amountOutMin, and sending 0n would remove all protection.
  const hasQuote = quotedAmountOut !== null && !quoteError
  const isBlocked = !hasValidInput || isWrongChain || !hasQuote
  const canSwap = !isBlocked && !isBusy && !quoteLoading

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className={colors.glassCard + ' p-5'}
    >
      {/* Buy / Sell tabs — Issue #2: focus rings, Issue #3: proper labels */}
      <div className="flex gap-2 mb-4" role="tablist" aria-label="Swap direction">
        <button
          role="tab"
          aria-selected={isBuy}
          onClick={() => { setIsBuy(true); setInputAmount(''); setTxStatus('idle'); setTxError(null); setQuotedAmountOut(null); setQuoteError(null); setPriceImpact(null) }}
          className={`flex-1 py-2.5 min-h-[44px] rounded-xl font-display font-bold text-sm transition-colors duration-200 cursor-pointer ${focusRing} ${
            isBuy
              ? 'bg-green-500/20 text-green-400 border border-green-500/40'
              : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
          }`}
        >
          BUY
        </button>
        <button
          role="tab"
          aria-selected={!isBuy}
          onClick={() => { setIsBuy(false); setInputAmount(''); setTxStatus('idle'); setTxError(null); setQuotedAmountOut(null); setQuoteError(null); setPriceImpact(null) }}
          className={`flex-1 py-2.5 min-h-[44px] rounded-xl font-display font-bold text-sm transition-colors duration-200 cursor-pointer ${focusRing} ${
            !isBuy
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
          }`}
        >
          SELL
        </button>
      </div>

      {/* Wrong chain warning */}
      {isConnected && isWrongChain && (
        <button
          onClick={() => switchChain({ chainId: tokenChainId })}
          className={`w-full mb-4 py-3 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400 font-semibold text-sm cursor-pointer hover:bg-blue-500/30 transition-colors duration-200 ${focusRing}`}
        >
          Switch to {getChainName(tokenChainId)}
        </button>
      )}

      {/* Input — Issue #3: htmlFor/id association */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="swap-pay-input" className="text-sm text-gray-400 font-sans">
            Pay
          </label>
          <span className="text-xs text-gray-400 font-sans">
            Bal: {parseFloat(maxBalance).toFixed(4)} {isBuy ? nativeSymbol : tokenSymbol}
          </span>
        </div>
        <div className="relative">
          <input
            id="swap-pay-input"
            type="number"
            inputMode="decimal"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="0.0"
            className={`w-full px-4 py-3 pr-24 bg-white/5 border border-white/15 rounded-xl text-white text-lg font-sans placeholder-gray-400 transition-colors duration-200 ${focusRing} focus:border-blue-500/50`}
            min="0"
            step="any"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              onClick={handleMax}
              className={`text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer px-1.5 py-0.5 rounded bg-blue-500/10 transition-colors duration-200 ${focusRing} ${hitArea44}`}
              aria-label={`Set maximum ${isBuy ? nativeSymbol : tokenSymbol} balance`}
            >
              MAX
            </button>
            <span className="text-sm text-gray-400 font-sans">
              {isBuy ? nativeSymbol : tokenSymbol}
            </span>
          </div>
        </div>
      </div>

      {/* Estimated output — Issue #3: label association */}
      <div className="mb-4">
        <label htmlFor="swap-receive-output" className="text-sm text-gray-400 mb-1.5 block font-sans">
          Receive (est.)
        </label>
        <div
          id="swap-receive-output"
          role="status"
          aria-live="polite"
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-lg font-sans"
        >
          {quoteLoading ? (
            <span className="text-gray-400 animate-pulse">Estimating...</span>
          ) : quotedAmountOut !== null ? (
            <span>
              ~{formatAmount(quotedAmountOut, outputDecimals, isBuy ? 4 : 6)}{' '}
              <span className="text-sm text-gray-400">{outputSymbol}</span>
              {estimatedUsdValue !== null && (
                <span className="text-sm text-gray-400">
                  {' '}(~${estimatedUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                </span>
              )}
            </span>
          ) : (
            <span className="text-gray-400">&mdash;</span>
          )}
        </div>

        {/* Slippage protection details — the numbers the user is actually signing */}
        {minimumReceived !== null && !quoteLoading && (
          <dl className="mt-2 space-y-1 text-xs font-sans">
            <div className="flex items-center justify-between">
              <dt className="text-gray-400">Minimum received ({slippage}% slippage)</dt>
              <dd className="text-gray-300 font-semibold">
                {formatAmount(minimumReceived, outputDecimals, isBuy ? 4 : 6)} {outputSymbol}
              </dd>
            </div>
            {priceImpact !== null && (
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Price impact</dt>
                <dd className={priceImpact >= 5 ? 'text-red-400 font-semibold' : priceImpact >= 1 ? 'text-yellow-400 font-semibold' : 'text-gray-300 font-semibold'}>
                  {priceImpact < 0.01 ? '<0.01' : priceImpact.toFixed(2)}%
                </dd>
              </div>
            )}
          </dl>
        )}

        {quoteError && !quoteLoading && (
          <p className="mt-2 text-xs text-red-400 font-sans" role="alert">{quoteError}</p>
        )}
      </div>

      {/* Slippage — Issue #3: label association */}
      <fieldset className="mb-4">
        <legend className="text-xs text-gray-400 mb-1.5 block font-sans">Slippage Tolerance</legend>
        <div className="flex gap-1.5">
          {SLIPPAGE_OPTIONS.map((val) => (
            <button
              key={val}
              onClick={() => setSlippage(val)}
              aria-pressed={slippage === val}
              className={`flex-1 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer ${focusRing} ${
                slippage === val
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
              }`}
            >
              {val}%
            </button>
          ))}
        </div>
      </fieldset>

      {/* Swap button */}
      {!isConnected ? (
        <div className="text-center text-sm text-gray-400 py-3 font-sans">
          Connect wallet to swap
        </div>
      ) : !routerAddress ? (
        <div className="text-center text-sm text-gray-400 py-3 font-sans">
          No DEX router available for this chain
        </div>
      ) : (
        <button
          onClick={handleSwap}
          disabled={!canSwap}
          className={`w-full py-3.5 rounded-xl font-display font-bold text-sm transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer ${focusRing} ${
            txStatus === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/40'
              : isBlocked
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : isBuy
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/30'
          }`}
        >
          {txStatus === 'approving'
            ? 'Approving...'
            : txStatus === 'swapping' || isTxPending
              ? 'Swapping...'
              : txStatus === 'success'
                ? 'Swap Successful!'
                : isWrongChain
                  ? 'Wrong Network'
                  : quoteLoading
                    ? 'Fetching quote...'
                    : hasValidInput && quoteError
                      ? 'No liquidity'
                      : `${isBuy ? 'Buy' : 'Sell'} ${tokenSymbol}`}
        </button>
      )}

      {/* Error message */}
      {txError && (
        <p className="text-xs text-red-400 mt-2 text-center font-sans" role="alert">{txError}</p>
      )}

      {/* Issue #17: More visible reset with auto-clear countdown */}
      {txStatus === 'success' && (
        <button
          onClick={() => setTxStatus('idle')}
          className={`w-full mt-3 py-2 min-h-[44px] text-sm text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/15 rounded-lg cursor-pointer transition-colors duration-200 font-sans ${focusRing}`}
        >
          New swap
        </button>
      )}
    </motion.div>
  )
}
