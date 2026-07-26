import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAccount, useChainId, useSwitchChain, useBalance, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, parseUnits, formatUnits, type Address } from 'viem'
import { getChainById, getDexContracts, getWethAddress, getChainName } from '../../../config/chains'
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

const SLIPPAGE_OPTIONS = [0.5, 1, 3] as const

// Issue #7: Resolve native symbol from chain config, not string matching
function getNativeSymbol(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency?.symbol || 'ETH'
}

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
  const [estimatedOutput, setEstimatedOutput] = useState<string | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'approving' | 'swapping' | 'success' | 'error'>('idle')
  const [txError, setTxError] = useState<string | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const isWrongChain = currentChainId !== tokenChainId
  const dex = getDexContracts(tokenChainId)
  const weth = getWethAddress(tokenChainId)
  const routerAddress = (dex?.uniswapV2Router || dex?.pancakeswapRouter || dex?.sushiswapRouter) as Address | undefined
  const nativeSymbol = getNativeSymbol(tokenChainId)

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

  // Issue #7: Estimate using actual native token price when available
  const getQuote = useCallback(async () => {
    if (!inputAmount || !routerAddress || !weth || parseFloat(inputAmount) <= 0) {
      setEstimatedOutput(null)
      return
    }

    setQuoteLoading(true)
    try {
      if (priceUsd && parseFloat(priceUsd) > 0 && nativeTokenPriceUsd && nativeTokenPriceUsd > 0) {
        const inputValue = parseFloat(inputAmount)
        const tokenPrice = parseFloat(priceUsd)

        if (isBuy) {
          const estimated = (inputValue * nativeTokenPriceUsd) / tokenPrice
          setEstimatedOutput(estimated > 0 ? estimated.toFixed(2) : null)
        } else {
          const estimated = (inputValue * tokenPrice) / nativeTokenPriceUsd
          setEstimatedOutput(estimated > 0 ? estimated.toFixed(6) : null)
        }
      } else {
        setEstimatedOutput(null)
      }
    } catch {
      setEstimatedOutput(null)
    } finally {
      setQuoteLoading(false)
    }
  }, [inputAmount, routerAddress, weth, isBuy, priceUsd, nativeTokenPriceUsd])

  // Debounce quote
  useEffect(() => {
    const timer = setTimeout(getQuote, 500)
    return () => clearTimeout(timer)
  }, [getQuote])

  // Issue #17: Auto-clear success after 4s
  useEffect(() => {
    if (txStatus === 'success') {
      successTimerRef.current = setTimeout(() => setTxStatus('idle'), 4000)
    }
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
    }
  }, [txStatus])

  const handleSwap = async () => {
    if (!address || !routerAddress || !weth || !inputAmount) return

    setTxError(null)
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800) // 30 min

    try {
      if (isBuy) {
        setTxStatus('swapping')
        const amountIn = parseEther(inputAmount)

        await writeContractAsync({
          address: routerAddress,
          abi: ROUTER_V2_ABI,
          functionName: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
          args: [0n, [weth as Address, tokenAddress as Address], address, deadline],
          value: amountIn,
          chainId: tokenChainId,
        })

        setTxStatus('success')
        setInputAmount('')
      } else {
        const amountIn = parseUnits(inputAmount, decimals)

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

        setTxStatus('swapping')
        await writeContractAsync({
          address: routerAddress,
          abi: ROUTER_V2_ABI,
          functionName: 'swapExactTokensForETHSupportingFeeOnTransferTokens',
          args: [amountIn, 0n, [tokenAddress as Address, weth as Address], address, deadline],
          chainId: tokenChainId,
        })

        setTxStatus('success')
        setInputAmount('')
      }
    } catch (err: any) {
      setTxStatus('error')
      if (err?.message?.includes('User rejected') || err?.message?.includes('user rejected')) {
        setTxError('Transaction cancelled')
      } else {
        setTxError(err?.shortMessage || err?.message || 'Swap failed')
      }
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
  const focusRing = 'focus:outline-none focus:ring-2 focus:ring-amber-400/50'

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={colors.glassCard + ' p-5'}
    >
      {/* Buy / Sell tabs — Issue #2: focus rings, Issue #3: proper labels */}
      <div className="flex gap-2 mb-4" role="tablist" aria-label="Swap direction">
        <button
          role="tab"
          aria-selected={isBuy}
          onClick={() => { setIsBuy(true); setInputAmount(''); setTxStatus('idle'); setTxError(null) }}
          className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm transition-colors duration-200 cursor-pointer ${focusRing} ${
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
          onClick={() => { setIsBuy(false); setInputAmount(''); setTxStatus('idle'); setTxError(null) }}
          className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm transition-colors duration-200 cursor-pointer ${focusRing} ${
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
          className={`w-full mb-4 py-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400 font-semibold text-sm cursor-pointer hover:bg-amber-500/30 transition-colors duration-200 ${focusRing}`}
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
            className={`w-full px-4 py-3 pr-24 bg-white/5 border border-white/15 rounded-xl text-white text-lg font-sans placeholder-gray-600 transition-colors duration-200 ${focusRing} focus:border-amber-400/50`}
            min="0"
            step="any"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              onClick={handleMax}
              className={`text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer px-1.5 py-0.5 rounded bg-amber-500/10 transition-colors duration-200 ${focusRing}`}
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
            <span className="text-gray-500 animate-pulse">Estimating...</span>
          ) : estimatedOutput ? (
            <span>
              ~{parseFloat(estimatedOutput).toLocaleString(undefined, { maximumFractionDigits: 4 })}{' '}
              <span className="text-sm text-gray-500">{isBuy ? tokenSymbol : nativeSymbol}</span>
            </span>
          ) : (
            <span className="text-gray-600">&mdash;</span>
          )}
        </div>
      </div>

      {/* Slippage — Issue #3: label association */}
      <fieldset className="mb-4">
        <legend className="text-xs text-gray-500 mb-1.5 block font-sans">Slippage Tolerance</legend>
        <div className="flex gap-1.5">
          {SLIPPAGE_OPTIONS.map((val) => (
            <button
              key={val}
              onClick={() => setSlippage(val)}
              aria-pressed={slippage === val}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer ${focusRing} ${
                slippage === val
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
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
        <div className="text-center text-sm text-gray-500 py-3 font-sans">
          No DEX router available for this chain
        </div>
      ) : (
        <button
          onClick={handleSwap}
          disabled={
            !inputAmount ||
            parseFloat(inputAmount) <= 0 ||
            isWrongChain ||
            txStatus === 'swapping' ||
            txStatus === 'approving' ||
            isTxPending
          }
          className={`w-full py-3.5 rounded-xl font-display font-bold text-sm transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer ${focusRing} ${
            txStatus === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/40'
              : !inputAmount || parseFloat(inputAmount) <= 0 || isWrongChain
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
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
          className={`w-full mt-3 py-2 text-sm text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/15 rounded-lg cursor-pointer transition-colors duration-200 font-sans ${focusRing}`}
        >
          New swap
        </button>
      )}
    </motion.div>
  )
}
