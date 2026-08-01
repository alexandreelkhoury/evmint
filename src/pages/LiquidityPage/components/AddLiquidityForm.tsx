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

function TokenInput({
  id,
  label,
  token,
  amount,
  balance,
  error,
  onAmountChange,
  onTokenClick,
  onSetPercentageAmount,
}: {
  id: string
  label: string
  token: Token | null
  amount: string
  balance: { value: bigint; decimals: number } | undefined
  error?: string
  onAmountChange: (value: string) => void
  onTokenClick: () => void
  onSetPercentageAmount: (token: Token | null, percentage: number, setAmount: (amount: string) => void) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 focus-within:border-blue-500/40 transition-colors duration-150">
        <div className="flex items-center gap-3">
          <input
            id={id}
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="flex-1 min-w-0 text-lg font-medium bg-transparent border-none outline-none text-white placeholder-gray-600"
            style={{ boxShadow: 'none' }}
          />
          <button
            onClick={onTokenClick}
            aria-label={`Select token for ${label.toLowerCase()}`}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.1] rounded-xl transition-colors duration-150 cursor-pointer"
          >
            {token ? (
              <>
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {token.symbol.slice(0, 2)}
                </span>
                <span className="text-sm font-medium text-white">{token.symbol}</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Select</span>
            )}
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Balance row */}
        {(balance || error || token) && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
            <div>
              {balance && token && (
                <span className="text-xs text-gray-500">
                  Balance: {formatBalance(balance.value.toString(), balance.decimals, token.symbol)}
                </span>
              )}
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
            </div>

            {token && balance && (
              <div className="flex items-center gap-1">
                {[25, 50, 75].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => onSetPercentageAmount(token, pct, onAmountChange)}
                    aria-label={`Set ${pct} percent`}
                    className="px-2 py-1 min-h-[28px] text-[11px] font-medium text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-colors duration-150 cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  onClick={() => onSetPercentageAmount(token, 100, onAmountChange)}
                  aria-label="Set max"
                  className="px-2 py-1 min-h-[28px] text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
    <div className="space-y-4">
      <TokenInput
        id="tokenAAmount"
        label="First token"
        token={tokenA}
        amount={amountA}
        balance={balanceA}
        error={validationErrors.amountA}
        onAmountChange={onAmountAChange}
        onTokenClick={onTokenAClick}
        onSetPercentageAmount={onSetPercentageAmount}
      />

      {/* Plus divider */}
      <div className="flex justify-center -my-1">
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
          </svg>
        </div>
      </div>

      <TokenInput
        id="tokenBAmount"
        label="Second token"
        token={tokenB}
        amount={amountB}
        balance={balanceB}
        error={validationErrors.amountB}
        onAmountChange={onAmountBChange}
        onTokenClick={onTokenBClick}
        onSetPercentageAmount={onSetPercentageAmount}
      />

      {/* Submit */}
      <div className="pt-2">
        {!authenticated ? (
          <div className="bg-blue-900/15 border border-blue-500/20 rounded-xl p-4 flex justify-center">
            <WalletButton />
          </div>
        ) : !isV2CorrectChain ? (
          <div className="bg-yellow-900/15 border border-yellow-500/20 rounded-xl p-4 text-center">
            <p className="text-sm text-orange-300">Please switch to a supported mainnet</p>
          </div>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!isFormValid || isAddingLiquidity || !isV2Available}
            className={`w-full py-3.5 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
              !isFormValid || isAddingLiquidity || !isV2Available
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            }`}
          >
            {isAddingLiquidity ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Adding Liquidity...
              </span>
            ) : (
              'Add Liquidity'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
