import { motion } from 'framer-motion'
import WalletButton from '../../../components/WalletButton'
import { colors, typography } from '../../../styles/designSystem'
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}
    >
      <div className="text-center mb-8">
        <h2 className={`${typography.sectionTitle} text-2xl lg:text-3xl mb-4`}>
          Withdraw Liquidity
        </h2>
        <p className={`${typography.bodyText} text-gray-400 mb-4`}>
          Remove your liquidity from Uniswap V2 pools
        </p>

        {/* 2-Step Process Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-blue-300">2-Step Process</span>
          </div>
          <p className="text-sm text-blue-200">
            Withdrawing liquidity requires <strong>2 transactions</strong>:
            <br />
            <span className="text-blue-300">1) Approve LP tokens</span> → <span className="text-blue-300">2) Remove liquidity</span>
          </p>
        </div>
      </div>

      {/* LP Token Selection */}
      <div className="space-y-6 mb-8">
        <div>
          <label className={`block ${typography.label} mb-3`}>
            LP Token *
          </label>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 focus-within:border-red-400/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-red-500/20 focus-within:ring-1 focus-within:ring-red-400/20">
            {/* Top row: Input and Token selector */}
            <div className="flex items-center space-x-4 mb-3">
              {/* Input side (left) */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="0.0"
                  value={lpTokenAmount}
                  onChange={(e) => onLpTokenAmountChange(e.target.value)}
                  className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent transition-all duration-200"
                  style={{
                    boxShadow: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                />
              </div>

              {/* LP Token selector (right) */}
              <div className="flex-shrink-0">
                <button
                  onClick={onLpTokenClick}
                  className="flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all duration-200"
                >
                  {selectedLpToken ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">LP</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">{selectedLpToken.symbol}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-sm">Select LP Token</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom row: Balance and percentage buttons */}
            {(lpTokenBalance || validationErrors.lpTokenAmount || selectedLpToken) && (
              <div className="flex items-center justify-between">
                {/* Balance display (left) */}
                <div className="flex flex-col space-y-1">
                  {lpTokenBalance && selectedLpToken && (
                    <div className="text-sm text-gray-400">
                      Balance: <span className="font-medium text-gray-300">
                        {formatBalance(lpTokenBalance.value.toString(), lpTokenBalance.decimals, selectedLpToken.symbol)}
                      </span>
                    </div>
                  )}
                  {/* Validation errors */}
                  {validationErrors.lpTokenAddress && (
                    <p className="text-red-400 text-sm">{validationErrors.lpTokenAddress}</p>
                  )}
                  {validationErrors.lpTokenAmount && (
                    <p className="text-red-400 text-sm">{validationErrors.lpTokenAmount}</p>
                  )}
                </div>

                {/* Percentage buttons (right) */}
                {selectedLpToken && lpTokenBalance && (
                  <div className="flex items-center space-x-2">
                    {[25, 50, 75].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() => onSetPercentageAmount(selectedLpToken, percentage, onLpTokenAmountChange, true)}
                        className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                      >
                        {percentage}%
                      </button>
                    ))}
                    <button
                      onClick={() => onSetPercentageAmount(selectedLpToken, 100, onLpTokenAmountChange, true)}
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-300 hover:text-red-200 border border-red-500/30 rounded-lg transition-all duration-200"
                    >
                      MAX
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        {!authenticated ? (
          <div className={`${colors.infoBg} rounded-2xl p-6 text-center`}>
            <WalletButton />
          </div>
        ) : !isV2CorrectChain ? (
          <div className={`${colors.warningBg} rounded-2xl p-6 text-center`}>
            <p className="text-orange-200">Please switch to a supported mainnet</p>
          </div>
        ) : (
          <motion.button
            onClick={onSubmit}
            disabled={!isFormValid || isRemovingLiquidity || !isV2Available}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-300 ${
              !isFormValid || isRemovingLiquidity || !isV2Available
                ? colors.primaryButtonDisabled
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-red-500/25'
            }`}
          >
            {isRemovingLiquidity ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Removing Liquidity...</span>
              </div>
            ) : (
              'Remove Liquidity'
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
