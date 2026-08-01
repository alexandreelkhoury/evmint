import { motion } from 'framer-motion'
import { useAccount, useSwitchChain } from 'wagmi'
import WalletButton from '../../../components/WalletButton'
import { formatUnits } from 'viem'
import { baseConfig } from '../../../config/chains'
import { loggers } from '../../../utils/logger'

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
  const { isConnected } = useAccount()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()

  // Base is the app's default recommended network, matching NetworkManager
  const handleSwitchChain = () => {
    switchChain({ chainId: baseConfig.id }, {
      onError: (error) => {
        loggers.network.error('Failed to switch network from withdraw form:', error)
      }
    })
  }

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
          Withdraw Liquidity
        </h2>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Remove your liquidity from Uniswap V2 pools
        </p>
      </div>

      {/* Process hint */}
      <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-200/80">
          Requires <span className="text-blue-300 font-medium">2 transactions</span>: approve LP tokens, then remove liquidity.
        </p>
      </div>

      {/* LP Token Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="lpTokenAmount" className="text-sm font-medium text-gray-400">
            LP Token
          </label>
          {lpTokenBalance && selectedLpToken && (
            <button
              onClick={() => onSetPercentageAmount(selectedLpToken, 100, onLpTokenAmountChange, true)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-150 cursor-pointer"
              aria-label={`Use max ${selectedLpToken.symbol} balance`}
            >
              Balance: <span className="text-gray-300 tabular-nums">{formatBalance(lpTokenBalance.value.toString(), lpTokenBalance.decimals, selectedLpToken.symbol)}</span>
            </button>
          )}
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 transition-colors duration-150 focus-within:border-red-500/30 focus-within:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <input
              id="lpTokenAmount"
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={lpTokenAmount}
              onChange={(e) => onLpTokenAmountChange(e.target.value)}
              className="flex-1 min-w-0 text-[28px] font-semibold bg-transparent border-none outline-none text-white placeholder-gray-700 focus:outline-none focus:ring-0"
              style={{ boxShadow: 'none' }}
            />

            <button
              onClick={onLpTokenClick}
              aria-label="Select LP token"
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0 ${
                selectedLpToken
                  ? 'bg-white/[0.06] hover:bg-white/[0.1]'
                  : 'bg-red-500/15 hover:bg-red-500/25 text-red-300'
              }`}
            >
              {selectedLpToken ? (
                <>
                  <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-bold text-red-300 uppercase tracking-wide">
                    LP
                  </span>
                  <span className="font-semibold text-white text-sm">{selectedLpToken.symbol}</span>
                </>
              ) : (
                <>
                  <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m-6-6h12" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">Select LP token</span>
                </>
              )}
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Percentage quick-fill */}
          {selectedLpToken && lpTokenBalance && (
            <div className="flex items-center gap-1 mt-3">
              {[25, 50, 75].map((pct) => (
                <button
                  key={pct}
                  onClick={() => onSetPercentageAmount(selectedLpToken, pct, onLpTokenAmountChange, true)}
                  aria-label={`Set ${pct} percent of LP token balance`}
                  className="px-2 py-0.5 text-xs text-gray-600 hover:text-gray-300 hover:bg-white/[0.04] rounded transition-colors duration-150 cursor-pointer"
                >
                  {pct}%
                </button>
              ))}
              <button
                onClick={() => onSetPercentageAmount(selectedLpToken, 100, onLpTokenAmountChange, true)}
                aria-label="Set maximum LP token balance"
                className="px-2 py-0.5 text-xs font-semibold text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors duration-150 cursor-pointer"
              >
                MAX
              </button>
            </div>
          )}
        </div>

        {/* Validation errors */}
        {(validationErrors.lpTokenAddress || validationErrors.lpTokenAmount) && (
          <div className="mt-1.5 space-y-1 px-1">
            {validationErrors.lpTokenAddress && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.lpTokenAddress}
              </p>
            )}
            {validationErrors.lpTokenAmount && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.lpTokenAmount}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="mt-5">
        {!authenticated ? (
          <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-xl p-4 flex justify-center">
            <WalletButton />
          </div>
        ) : !isV2CorrectChain ? (
          <motion.button
            onClick={handleSwitchChain}
            disabled={!isConnected || isSwitchingChain}
            whileHover={isConnected && !isSwitchingChain ? { scale: 1.01 } : undefined}
            whileTap={isConnected && !isSwitchingChain ? { scale: 0.99 } : undefined}
            className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-150 ${
              !isConnected || isSwitchingChain
                ? 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 active:bg-orange-700 cursor-pointer'
            }`}
          >
            {!isConnected ? (
              'Connect wallet to switch'
            ) : isSwitchingChain ? (
              <span className="flex items-center justify-center gap-2.5">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Switching network...
              </span>
            ) : (
              `Switch to ${baseConfig.name}`
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={onSubmit}
            disabled={!isFormValid || isRemovingLiquidity || !isV2Available}
            whileHover={isFormValid && !isRemovingLiquidity && isV2Available ? { scale: 1.01 } : undefined}
            whileTap={isFormValid && !isRemovingLiquidity && isV2Available ? { scale: 0.99 } : undefined}
            className={`w-full py-4 text-base font-semibold rounded-xl transition-all duration-150 ${
              !isFormValid || isRemovingLiquidity || !isV2Available
                ? 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 hover:shadow-red-500/30 active:bg-red-700'
            }`}
          >
            {isRemovingLiquidity ? (
              <span className="flex items-center justify-center gap-2.5">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Removing Liquidity...
              </span>
            ) : (
              'Remove Liquidity'
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
