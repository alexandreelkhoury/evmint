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

interface RemoveLiquidityFormProps {
  selectedLpToken: Token | null
  lpTokenAmount: string
  lpTokenBalance: { value: bigint; decimals: number } | undefined
  validationErrors: ValidationErrors
  isFormValid: boolean
  authenticated: boolean
  isV2CorrectChain: boolean
  isV2Available: boolean
  isRemovingLiquidity: boolean
  onLpTokenAmountChange: (value: string) => void
  onLpTokenClick: () => void
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

export default function RemoveLiquidityForm({
  selectedLpToken,
  lpTokenAmount,
  lpTokenBalance,
  validationErrors,
  isFormValid,
  authenticated,
  isV2CorrectChain,
  isV2Available,
  isRemovingLiquidity,
  onLpTokenAmountChange,
  onLpTokenClick,
  onSetPercentageAmount,
  onSubmit
}: RemoveLiquidityFormProps) {
  return (
    <div className="space-y-4">
      {/* 2-step notice */}
      <div className="flex items-start gap-2.5 p-3 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl">
        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-blue-300 leading-relaxed">
          Withdrawal requires 2 transactions: approve LP tokens, then remove liquidity.
        </p>
      </div>

      {/* LP Token input */}
      <div>
        <label htmlFor="lpTokenAmount" className="block text-xs font-medium text-gray-400 mb-1.5">
          LP Token
        </label>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 focus-within:border-blue-500/40 transition-colors duration-150">
          <div className="flex items-center gap-3">
            <input
              id="lpTokenAmount"
              type="text"
              placeholder="0.0"
              value={lpTokenAmount}
              onChange={(e) => onLpTokenAmountChange(e.target.value)}
              className="flex-1 min-w-0 text-lg font-medium bg-transparent border-none outline-none text-white placeholder-gray-600"
              style={{ boxShadow: 'none' }}
            />
            <button
              onClick={onLpTokenClick}
              aria-label="Select LP token"
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.1] rounded-xl transition-colors duration-150 cursor-pointer"
            >
              {selectedLpToken ? (
                <>
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    LP
                  </span>
                  <span className="text-sm font-medium text-white">{selectedLpToken.symbol}</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Select LP</span>
              )}
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Balance row */}
          {(lpTokenBalance || validationErrors.lpTokenAmount || validationErrors.lpTokenAddress || selectedLpToken) && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
              <div>
                {lpTokenBalance && selectedLpToken && (
                  <span className="text-xs text-gray-500">
                    Balance: {formatBalance(lpTokenBalance.value.toString(), lpTokenBalance.decimals, selectedLpToken.symbol)}
                  </span>
                )}
                {validationErrors.lpTokenAddress && (
                  <p className="text-xs text-red-400">{validationErrors.lpTokenAddress}</p>
                )}
                {validationErrors.lpTokenAmount && (
                  <p className="text-xs text-red-400">{validationErrors.lpTokenAmount}</p>
                )}
              </div>

              {selectedLpToken && lpTokenBalance && (
                <div className="flex items-center gap-1">
                  {[25, 50, 75].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => onSetPercentageAmount(selectedLpToken, pct, onLpTokenAmountChange, true)}
                      aria-label={`Set ${pct} percent`}
                      className="px-2 py-1 min-h-[28px] text-[11px] font-medium text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-colors duration-150 cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    onClick={() => onSetPercentageAmount(selectedLpToken, 100, onLpTokenAmountChange, true)}
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
            disabled={!isFormValid || isRemovingLiquidity || !isV2Available}
            className={`w-full py-3.5 text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer ${
              !isFormValid || isRemovingLiquidity || !isV2Available
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            }`}
          >
            {isRemovingLiquidity ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Removing Liquidity...
              </span>
            ) : (
              'Remove Liquidity'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
