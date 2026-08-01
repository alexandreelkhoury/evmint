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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}
    >
      <div className="text-center mb-8">
        <h2 className={`${typography.sectionTitle} text-2xl lg:text-3xl mb-4`}>
          Add Liquidity
        </h2>
        <p className={`${typography.bodyText} text-gray-400`}>
          Provide liquidity to earn trading fees on Uniswap V2
        </p>
      </div>

      {/* Token Selection */}
      <div className="space-y-6 mb-8">
        {/* Token A */}
        <div>
          <label htmlFor="tokenAAmount" className={`block ${typography.label} mb-3`}>
            First Token *
          </label>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 focus-within:border-blue-400/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-blue-500/20 focus-within:ring-1 focus-within:ring-blue-400/20">
            {/* Top row: Input and Token selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-3">
              {/* Input side (left) */}
              <div className="flex-1">
                <input
                  id="tokenAAmount"
                  type="text"
                  placeholder="0.0"
                  value={amountA}
                  onChange={(e) => onAmountAChange(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                  style={{
                    boxShadow: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                />
              </div>

              {/* Token selector (right) */}
              <div className="flex-shrink-0">
                <button
                  onClick={onTokenAClick}
                  aria-label="Select first token"
                  className="flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                >
                  {tokenA ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{tokenA.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">{tokenA.symbol}</div>
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
                      <span className="text-gray-400 text-sm">Select Token</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom row: Balance and percentage buttons */}
            {(balanceA || validationErrors.amountA || tokenA) && (
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                {/* Balance display (left) */}
                <div className="flex flex-col space-y-1">
                  {balanceA && tokenA && (
                    <div className="text-sm text-gray-400">
                      Balance: <span className="font-medium text-gray-300">
                        {formatBalance(balanceA.value.toString(), balanceA.decimals, tokenA.symbol)}
                      </span>
                    </div>
                  )}
                  {/* Validation error */}
                  {validationErrors.amountA && (
                    <p className="text-red-400 text-sm">{validationErrors.amountA}</p>
                  )}
                </div>

                {/* Percentage buttons (right) */}
                {tokenA && balanceA && (
                  <div className="flex items-center space-x-2">
                    {[25, 50, 75].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() => onSetPercentageAmount(tokenA, percentage, onAmountAChange)}
                        aria-label={`Set ${percentage} percent of first token balance`}
                        className="px-3 py-2 min-h-[36px] sm:py-1 sm:min-h-auto text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer"
                      >
                        {percentage}%
                      </button>
                    ))}
                    <button
                      onClick={() => onSetPercentageAmount(tokenA, 100, onAmountAChange)}
                      aria-label="Set maximum first token balance"
                      className="px-3 py-2 min-h-[36px] sm:py-1 sm:min-h-auto text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-lg transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Token B */}
        <div>
          <label htmlFor="tokenBAmount" className={`block ${typography.label} mb-3`}>
            Second Token *
          </label>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 focus-within:border-blue-400/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-blue-500/20 focus-within:ring-1 focus-within:ring-blue-400/20">
            {/* Top row: Input and Token selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-3">
              {/* Input side (left) */}
              <div className="flex-1">
                <input
                  id="tokenBAmount"
                  type="text"
                  placeholder="0.0"
                  value={amountB}
                  onChange={(e) => onAmountBChange(e.target.value)}
                  className="w-full text-xl sm:text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                  style={{
                    boxShadow: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                />
              </div>

              {/* Token selector (right) */}
              <div className="flex-shrink-0">
                <button
                  onClick={onTokenBClick}
                  aria-label="Select second token"
                  className="flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                >
                  {tokenB ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{tokenB.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">{tokenB.symbol}</div>
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
                      <span className="text-gray-400 text-sm">Select Token</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom row: Balance and percentage buttons */}
            {(balanceB || validationErrors.amountB || tokenB) && (
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                {/* Balance display (left) */}
                <div className="flex flex-col space-y-1">
                  {balanceB && tokenB && (
                    <div className="text-sm text-gray-400">
                      Balance: <span className="font-medium text-gray-300">
                        {formatBalance(balanceB.value.toString(), balanceB.decimals, tokenB.symbol)}
                      </span>
                    </div>
                  )}
                  {/* Validation error */}
                  {validationErrors.amountB && (
                    <p className="text-red-400 text-sm">{validationErrors.amountB}</p>
                  )}
                </div>

                {/* Percentage buttons (right) */}
                {tokenB && balanceB && (
                  <div className="flex items-center space-x-2">
                    {[25, 50, 75].map((percentage) => (
                      <button
                        key={percentage}
                        onClick={() => onSetPercentageAmount(tokenB, percentage, onAmountBChange)}
                        aria-label={`Set ${percentage} percent of second token balance`}
                        className="px-3 py-2 min-h-[36px] sm:py-1 sm:min-h-auto text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer"
                      >
                        {percentage}%
                      </button>
                    ))}
                    <button
                      onClick={() => onSetPercentageAmount(tokenB, 100, onAmountBChange)}
                      aria-label="Set maximum second token balance"
                      className="px-3 py-2 min-h-[36px] sm:py-1 sm:min-h-auto text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-lg transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer"
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
          <div className={`${colors.infoBg} rounded-2xl p-6 flex justify-center`}>
            <WalletButton />
          </div>
        ) : !isV2CorrectChain ? (
          <div className={`${colors.warningBg} rounded-2xl p-6 text-center`}>
            <p className="text-orange-200">Please switch to a supported mainnet</p>
          </div>
        ) : (
          <motion.button
            onClick={onSubmit}
            disabled={!isFormValid || isAddingLiquidity || !isV2Available}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-6 text-xl font-semibold rounded-2xl transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
              !isFormValid || isAddingLiquidity || !isV2Available
                ? colors.primaryButtonDisabled
                : colors.primaryButton
            }`}
          >
            {isAddingLiquidity ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Adding Liquidity...</span>
              </div>
            ) : (
              'Add Liquidity'
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
