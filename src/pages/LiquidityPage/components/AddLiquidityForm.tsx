import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useReadContract } from 'wagmi'
import WalletButton from '../../../components/WalletButton'
import { formatUnits } from 'viem'
import { FACTORY_ABI, LP_TOKEN_ABI } from '../../../features/liquidity/constants'
import { useLiquidityContracts } from '../../../features/liquidity/hooks/useLiquidityContracts'
import { ADD_LIQUIDITY_SLIPPAGE_PERCENT } from '../../../features/liquidity/hooks/useAddLiquidity'
import { getGeckoNetworkId } from '../../../services/geckoTerminal'

interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: string
  logoUri?: string
}

interface ValidationErrors {
  amountA?: string
  amountB?: string
  lpTokenAddress?: string
  lpTokenAmount?: string
}

interface AddLiquidityFormProps {
  tokenA: Token | null
  tokenB: Token | null
  amountA: string
  amountB: string
  balanceA: { value: bigint; decimals: number } | undefined
  balanceB: { value: bigint; decimals: number } | undefined
  validationErrors: ValidationErrors
  isFormValid: boolean
  authenticated: boolean
  isV2CorrectChain: boolean
  isV2Available: boolean
  isAddingLiquidity: boolean
  onAmountAChange: (value: string) => void
  onAmountBChange: (value: string) => void
  onTokenAClick: () => void
  onTokenBClick: () => void
  onSetPercentageAmount: (token: Token | null, percentage: number, setAmount: (amount: string) => void, isLpToken?: boolean) => void
  onSubmit: () => void
}

// Invisible 44px-tall hit area for the compact text controls in this form. The
// pill stays visually small while the tap target meets the mobile minimum; the
// overflow always lands inside the surrounding padding, never on a neighbour.
const hitArea44 = "relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']"

const formatBalance = (balance: string, decimals: number, symbol: string): string => {
  try {
    const balanceFormatted = formatUnits(BigInt(balance), decimals)
    const value = parseFloat(balanceFormatted)
    if (value > 0) {
      return `${Math.ceil(value * 1000000) / 1000000} ${symbol}`
    }
    return `0 ${symbol}`
  } catch {
    return `0 ${symbol}`
  }
}

function TokenPanel({
  id,
  label,
  token,
  amount,
  balance,
  validationError,
  onAmountChange,
  onTokenClick,
  onSetPercentageAmount,
  position,
}: {
  id: string
  label: string
  token: Token | null
  amount: string
  balance: { value: bigint; decimals: number } | undefined
  validationError?: string
  onAmountChange: (value: string) => void
  onTokenClick: () => void
  onSetPercentageAmount: (token: Token | null, percentage: number, setAmount: (amount: string) => void, isLpToken?: boolean) => void
  position: 'top' | 'bottom'
}) {
  const roundedClass = position === 'top' ? 'rounded-t-2xl rounded-b-md' : 'rounded-b-2xl rounded-t-md'

  return (
    <div>
      <div className={`bg-white/[0.03] border border-white/[0.08] ${roundedClass} p-4 transition-colors duration-150 focus-within:border-blue-500/30 focus-within:bg-white/[0.04]`}>
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <label htmlFor={id} className="text-[13px] font-medium text-gray-400">
            {label}
          </label>
          {balance && token && (
            <button
              onClick={() => onSetPercentageAmount(token, 100, onAmountChange)}
              className={`text-[13px] text-gray-400 hover:text-gray-200 transition-colors duration-150 cursor-pointer ${hitArea44}`}
              aria-label={`Use max ${token.symbol} balance`}
            >
              Balance: <span className="text-gray-300 tabular-nums">{formatBalance(balance.value.toString(), balance.decimals, token.symbol)}</span>
            </button>
          )}
        </div>

        {/* Input + token selector */}
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="flex-1 min-w-0 text-[28px] font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 focus:outline-none focus:ring-0"
            style={{ boxShadow: 'none' }}
          />

          <button
            onClick={onTokenClick}
            aria-label={`Select ${label.toLowerCase()}`}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 min-h-[44px] rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0 ${
              token
                ? 'bg-white/[0.06] hover:bg-white/[0.1]'
                : 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-300'
            }`}
          >
            {token ? (
              <>
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-200 uppercase tracking-wide">
                  {token.symbol.slice(0, 2)}
                </span>
                <span className="font-semibold text-white text-sm">{token.symbol}</span>
              </>
            ) : (
              <>
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m-6-6h12" />
                  </svg>
                </span>
                <span className="text-sm font-medium">Select token</span>
              </>
            )}
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Percentage quick-fill */}
        {token && balance && (
          <div className="flex items-center gap-1 mt-3">
            {[25, 50, 75].map((pct) => (
              <button
                key={pct}
                onClick={() => onSetPercentageAmount(token, pct, onAmountChange)}
                aria-label={`Set ${pct} percent of ${token.symbol} balance`}
                className={`px-2 py-1.5 min-w-[44px] text-xs text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] rounded transition-colors duration-150 cursor-pointer ${hitArea44}`}
              >
                {pct}%
              </button>
            ))}
            <button
              onClick={() => onSetPercentageAmount(token, 100, onAmountChange)}
              aria-label={`Set maximum ${token.symbol} balance`}
              className={`px-2 py-1.5 min-w-[44px] text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors duration-150 cursor-pointer ${hitArea44}`}
            >
              MAX
            </button>
          </div>
        )}
      </div>

      {validationError && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5 px-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {validationError}
        </p>
      )}
    </div>
  )
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Only read we need that isn't already covered by the shared liquidity ABIs
const TOKEN_SUPPLY_ABI = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const toPositiveNumber = (value: string): number => {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

// Keeps very small prices readable — 0.00000042 must not collapse to 0.000000
const formatDecimal = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  if (value >= 1) return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
  const decimals = Math.min(18, Math.abs(Math.floor(Math.log10(value))) + 3)
  return value.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '')
}

const formatUsdValue = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return ''
  if (value >= 1) return `$${value.toLocaleString(undefined, { maximumFractionDigits: value >= 1000 ? 0 : 2 })}`
  return `$${formatDecimal(value)}`
}

const formatSharePercent = (share: number): string => {
  if (!Number.isFinite(share) || share <= 0) return '0%'
  if (share >= 99.995) return '100%'
  if (share < 0.01) return '<0.01%'
  return `${share.toFixed(share >= 10 ? 1 : 2)}%`
}

/**
 * Native-token USD price from GeckoTerminal — the same source the token detail
 * page uses for its swap estimates. Returns null whenever we can't get a real
 * quote, in which case the caller must show native-denominated figures only.
 */
function useNativeTokenPriceUsd(chainId: number, wethAddress: string | null): number | null {
  const [priceUsd, setPriceUsd] = useState<number | null>(null)

  useEffect(() => {
    const networkId = getGeckoNetworkId(chainId)
    if (!networkId || !wethAddress) {
      setPriceUsd(null)
      return
    }

    let cancelled = false
    fetch(`https://api.geckoterminal.com/api/v2/simple/networks/${networkId}/token_price/${wethAddress}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        const prices = data?.data?.attributes?.token_prices
        const raw = prices ? Object.values(prices)[0] : null
        const parsed = typeof raw === 'string' ? parseFloat(raw) : NaN
        setPriceUsd(Number.isFinite(parsed) && parsed > 0 ? parsed : null)
      })
      .catch(() => {
        if (!cancelled) setPriceUsd(null)
      })

    return () => {
      cancelled = true
    }
  }, [chainId, wethAddress])

  return priceUsd
}

/**
 * Live read-out of what these amounts actually mean: the price the pool will
 * open at, the market cap that implies, and what the user is signing up for.
 */
function LiquiditySummary({
  tokenA,
  tokenB,
  amountA,
  amountB,
}: {
  tokenA: Token | null
  tokenB: Token | null
  amountA: string
  amountB: string
}) {
  const { getContracts, chainId } = useLiquidityContracts()
  const { factory, weth } = getContracts()

  // Mirrors useLiquidityPageLogic: side A is the native leg only when it is the
  // wrapped native token, otherwise side B is treated as the native leg
  const nativeIsA = !!tokenA && !!weth && tokenA.address.toLowerCase() === weth.toLowerCase()
  const customToken = nativeIsA ? tokenB : tokenA
  const nativeToken = nativeIsA ? tokenA : tokenB
  const customAmountInput = nativeIsA ? amountB : amountA
  const nativeAmountInput = nativeIsA ? amountA : amountB

  const nativeSymbol = nativeToken?.symbol || 'ETH'
  const customDecimals = customToken?.decimals ?? 18
  const nativeDecimals = nativeToken?.decimals ?? 18

  const nativeUsdPrice = useNativeTokenPriceUsd(chainId, weth)

  const pairQueryEnabled = !!(customToken?.address && factory && weth)
  const { data: pairAddress, isLoading: isPairLoading } = useReadContract({
    address: factory as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'getPair',
    args: pairQueryEnabled ? [customToken!.address as `0x${string}`, weth as `0x${string}`] : undefined,
    query: { enabled: pairQueryEnabled }
  })

  const poolExists = !!pairAddress && pairAddress !== ZERO_ADDRESS

  const { data: reserves } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: LP_TOKEN_ABI,
    functionName: 'getReserves',
    query: { enabled: poolExists }
  })

  const { data: pairToken0 } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: LP_TOKEN_ABI,
    functionName: 'token0',
    query: { enabled: poolExists }
  })

  const { data: totalSupply } = useReadContract({
    address: customToken?.address as `0x${string}`,
    abi: TOKEN_SUPPLY_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!customToken?.address }
  })

  const summary = useMemo(() => {
    const customAmount = toPositiveNumber(customAmountInput)
    const nativeAmount = toPositiveNumber(nativeAmountInput)
    const hasBothAmounts = customAmount > 0 && nativeAmount > 0

    // Reserves of the live pool, if there is one
    let reserveCustom = 0
    let reserveNative = 0
    if (poolExists && reserves && pairToken0 && customToken) {
      const [reserve0, reserve1] = reserves as readonly [bigint, bigint, number]
      const customIsToken0 = (pairToken0 as string).toLowerCase() === customToken.address.toLowerCase()
      reserveCustom = parseFloat(formatUnits(customIsToken0 ? reserve0 : reserve1, customDecimals))
      reserveNative = parseFloat(formatUnits(customIsToken0 ? reserve1 : reserve0, nativeDecimals))
    }

    const hasReserves = reserveCustom > 0 && reserveNative > 0

    // An existing pool dictates the price; a new pool takes it from the inputs
    const price = hasReserves
      ? reserveNative / reserveCustom
      : hasBothAmounts
        ? nativeAmount / customAmount
        : null

    const priceUsd = price !== null && nativeUsdPrice !== null ? price * nativeUsdPrice : null

    const supply = totalSupply !== undefined
      ? parseFloat(formatUnits(totalSupply as bigint, customDecimals))
      : null
    const hasSupply = supply !== null && Number.isFinite(supply) && supply > 0

    let marketCapLabel: string | null = null
    if (hasSupply && price !== null) {
      const marketCapNative = price * supply!
      if (Number.isFinite(marketCapNative) && marketCapNative > 0) {
        marketCapLabel = nativeUsdPrice !== null
          ? formatUsdValue(marketCapNative * nativeUsdPrice)
          : `${formatDecimal(marketCapNative)} ${nativeSymbol}`
      }
    }

    // New pool → the whole pool is yours. Existing pool → whichever side the
    // router actually consumes decides the LP tokens you get
    let shareLabel: string | null = null
    if (!hasBothAmounts) {
      shareLabel = null
    } else if (!hasReserves) {
      shareLabel = '100%'
    } else {
      const shareFromCustom = customAmount / (reserveCustom + customAmount)
      const shareFromNative = nativeAmount / (reserveNative + nativeAmount)
      shareLabel = formatSharePercent(Math.min(shareFromCustom, shareFromNative) * 100)
    }

    return {
      price,
      priceUsd,
      marketCapLabel,
      shareLabel,
      showMarketCapRow: hasSupply,
      // A pair contract with no reserves still leaves the price up to this deposit
      isLivePool: hasReserves,
    }
  }, [customAmountInput, nativeAmountInput, poolExists, reserves, pairToken0, customToken, customDecimals, nativeDecimals, nativeUsdPrice, totalSupply, nativeSymbol])

  const isCheckingPool = pairQueryEnabled && isPairLoading

  // Nothing to price yet — but the two-transaction flow is still worth knowing
  if (!customToken) {
    return (
      <div className="mt-4 bg-blue-500/[0.06] border border-blue-500/20 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5">
        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[13px] text-blue-200/80">
          Requires <span className="text-blue-300 font-medium">2 transactions</span>: approve your token, then create the pool.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="mt-4 space-y-2"
    >
      {/* Live numbers */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl px-3.5 py-3">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-gray-400 flex-shrink-0">
              {summary.isLivePool ? 'Pool price' : 'Starting price'}
            </span>
            {summary.price !== null ? (
              <span className="text-[13px] font-medium text-white text-right tabular-nums break-all">
                1 {customToken.symbol} = {formatDecimal(summary.price)} {nativeSymbol}
                {summary.priceUsd !== null && (
                  <span className="font-normal text-gray-400"> ({formatUsdValue(summary.priceUsd)})</span>
                )}
              </span>
            ) : (
              <span className="text-[13px] text-gray-400">Enter both amounts</span>
            )}
          </div>

          {summary.showMarketCapRow && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px] text-gray-400 flex-shrink-0">Implied market cap</span>
              <span className="text-[13px] font-medium text-white text-right tabular-nums">
                {summary.marketCapLabel ?? <span className="font-normal text-gray-400">—</span>}
              </span>
            </div>
          )}

          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-gray-400 flex-shrink-0">Your pool share</span>
            <span className="text-[13px] font-medium text-white text-right tabular-nums">
              {summary.shareLabel ?? <span className="font-normal text-gray-400">—</span>}
            </span>
          </div>
        </div>

        {/* What it actually means */}
        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06]">
          {isCheckingPool ? (
            <p className="text-[12px] leading-snug text-gray-400">Checking for an existing pool…</p>
          ) : summary.isLivePool ? (
            <p className="text-[12px] leading-snug text-gray-400">
              This pool already exists, so <span className="text-gray-300">its reserves set the price</span> — your amounts don't.
              Anything above the pool's ratio is refunded. Your deposit is submitted with a{' '}
              <span className="text-gray-300">{ADD_LIQUIDITY_SLIPPAGE_PERCENT}% slippage tolerance</span>: if the ratio moves further
              than that before your transaction lands, it reverts instead of filling at a worse rate.
            </p>
          ) : (
            <p className="text-[12px] leading-snug text-gray-400">
              These amounts <span className="text-gray-300">set the opening price</span>. Once the pool is live anyone can trade
              against it — and it can be bought out. You can withdraw your liquidity at any time; buyers know this, so many projects
              lock or burn their LP tokens. No slippage risk on creation — the sniping risk starts the moment the pool goes live.
            </p>
          )}
        </div>
      </div>

      {/* Two-transaction flow — same notice the withdraw form shows */}
      <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5">
        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[13px] text-blue-200/80">
          Requires <span className="text-blue-300 font-medium">2 transactions</span>: approve {customToken.symbol}, then{' '}
          {summary.isLivePool ? 'add to the pool' : 'create the pool'}.
        </p>
      </div>
    </motion.div>
  )
}

export default function AddLiquidityForm({
  tokenA,
  tokenB,
  amountA,
  amountB,
  balanceA,
  balanceB,
  validationErrors,
  isFormValid,
  authenticated,
  isV2CorrectChain,
  isV2Available,
  isAddingLiquidity,
  onAmountAChange,
  onAmountBChange,
  onTokenAClick,
  onTokenBClick,
  onSetPercentageAmount,
  onSubmit
}: AddLiquidityFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 lg:p-6 shadow-xl shadow-black/20"
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-display font-bold text-white">
          Add Liquidity
        </h2>
        <p className="text-[13px] text-gray-400 mt-0.5">
          Make your token tradeable — these amounts set its opening price
        </p>
      </div>

      {/* Token panels with connector */}
      <div>
        <TokenPanel
          id="tokenAAmount"
          label="You deposit"
          token={tokenA}
          amount={amountA}
          balance={balanceA}
          validationError={validationErrors.amountA}
          onAmountChange={onAmountAChange}
          onTokenClick={onTokenAClick}
          onSetPercentageAmount={onSetPercentageAmount}
          position="top"
        />

        {/* Connector — in flow between panels */}
        <div className="flex items-center justify-center -my-[18px] relative z-10 pointer-events-none">
          <div className="w-10 h-10 rounded-xl border-4 border-gray-900 flex items-center justify-center">
            <div className="w-full h-full rounded-lg bg-gray-800/80 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
              </svg>
            </div>
          </div>
        </div>

        <TokenPanel
          id="tokenBAmount"
          label="Paired with"
          token={tokenB}
          amount={amountB}
          balance={balanceB}
          validationError={validationErrors.amountB}
          onAmountChange={onAmountBChange}
          onTokenClick={onTokenBClick}
          onSetPercentageAmount={onSetPercentageAmount}
          position="bottom"
        />
      </div>

      {/* What these amounts mean */}
      <LiquiditySummary
        tokenA={tokenA}
        tokenB={tokenB}
        amountA={amountA}
        amountB={amountB}
      />

      {/* Submit */}
      <div className="mt-4">
        {!authenticated ? (
          <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-xl p-4 flex justify-center">
            <WalletButton />
          </div>
        ) : !isV2CorrectChain ? (
          <div className="bg-orange-500/[0.06] border border-orange-500/20 rounded-xl p-3.5 text-center">
            <p className="text-sm text-orange-300/90">Switch to a supported mainnet to continue</p>
          </div>
        ) : (
          <motion.button
            onClick={onSubmit}
            disabled={!isFormValid || isAddingLiquidity || !isV2Available}
            whileHover={isFormValid && !isAddingLiquidity && isV2Available ? { scale: 1.01 } : undefined}
            whileTap={isFormValid && !isAddingLiquidity && isV2Available ? { scale: 0.99 } : undefined}
            className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-150 ${
              !isFormValid || isAddingLiquidity || !isV2Available
                ? 'bg-white/[0.04] text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 active:bg-blue-700'
            }`}
          >
            {isAddingLiquidity ? (
              <span className="flex items-center justify-center gap-2.5">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Adding Liquidity...
              </span>
            ) : (
              'Add Liquidity'
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
