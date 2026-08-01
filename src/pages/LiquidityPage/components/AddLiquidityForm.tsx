import { motion } from 'framer-motion'
import WalletButton from '../../../components/WalletButton'
import { formatUnits } from 'viem'

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
          <label htmlFor={id} className="text-[13px] font-medium text-gray-500">
            {label}
          </label>
          {balance && token && (
            <button
              onClick={() => onSetPercentageAmount(token, 100, onAmountChange)}
              className="text-[13px] text-gray-500 hover:text-gray-300 transition-colors duration-150 cursor-pointer"
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
            className="flex-1 min-w-0 text-[28px] font-semibold bg-transparent border-none outline-none text-white placeholder-gray-700 focus:outline-none focus:ring-0"
            style={{ boxShadow: 'none' }}
          />

          <button
            onClick={onTokenClick}
            aria-label={`Select ${label.toLowerCase()}`}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0 ${
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
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="px-2 py-0.5 text-xs text-gray-600 hover:text-gray-300 hover:bg-white/[0.04] rounded transition-colors duration-150 cursor-pointer"
              >
                {pct}%
              </button>
            ))}
            <button
              onClick={() => onSetPercentageAmount(token, 100, onAmountChange)}
              aria-label={`Set maximum ${token.symbol} balance`}
              className="px-2 py-0.5 text-xs font-semibold text-blue-400/80 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors duration-150 cursor-pointer"
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
        <p className="text-[13px] text-gray-500 mt-0.5">
          Make your token tradeable
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
                ? 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
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
