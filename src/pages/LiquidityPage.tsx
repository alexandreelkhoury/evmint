import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackLiquidityError, trackWalletError } from '../utils/analytics'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useBalance, useChainId } from 'wagmi'
import WalletButton from '../components/WalletButton'
import SEO from '../components/SEO'
import TokenSelectModal from '../components/liquidity/TokenSelectModal'
import SuccessModal from '../components/liquidity/SuccessModal'
import TransactionProgressModal from '../components/liquidity/TransactionProgressModal'
import { layout, typography, colors } from '../styles/designSystem'
import { useTokenSelection } from '../hooks/useTokenSelection'
import { useUniswapV2Liquidity } from '../hooks/useUniswapV2Liquidity'
import { useGlobalToasts } from '../App'
import { formatUnits } from 'viem'
import { validateAndFormatAddress, isValidEthereumAddress } from '../utils/validation'
import { loggers } from '../utils/logger'
import { TOKEN_ADDRESSES, TIMEOUTS } from '../config/constants'

interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: string
  logoUri?: string
}

// Validation utilities
const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && isFinite(num)
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

export default function LiquidityPage() {
  const analytics = useFirebaseAnalytics()
  const { ready, authenticated } = usePrivy()
  const { address: userAddress } = useAccount()
  const currentChainId = useChainId()

  useEffect(() => {
    trackPageView(analytics, 'liquidity')
  }, [analytics])
  
  const {
    addLiquidity,
    removeLiquidity,
    isAddingLiquidity,
    isRemovingLiquidity,
    userPools,
    currentStep,
    error: liquidityError,
    isCorrectChain: isV2CorrectChain,
    isV2Available,
    lastSuccessfulPool,
    clearSuccessState,
    transactionHash,
    poolAddress,
    resetLoadingStates
  } = useUniswapV2Liquidity()

  const [showTokenModalA, setShowTokenModalA] = useState(false)
  const [showTokenModalB, setShowTokenModalB] = useState(false)
  const [showLpTokenModal, setShowLpTokenModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  
  // Mode selection state
  const [liquidityMode, setLiquidityMode] = useState<'add' | 'withdraw'>('add')
  const [lpTokenAmount, setLpTokenAmount] = useState('')
  
  // LP Token selection for withdraw mode
  const [selectedLpToken, setSelectedLpToken] = useState<Token | null>(null)
  
  // Prevent duplicate toasts
  const lastToastRef = useRef<{
    successPool?: string
    errorMessage?: string
    lastErrorTime?: number
  }>({})

  const { addToast } = useGlobalToasts()

  // Token selection state
  const [tokenA, setTokenA] = useState<Token | null>(null)
  const [tokenB, setTokenB] = useState<Token | null>({
    address: TOKEN_ADDRESSES.WETH,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  })
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')

  // Input validation state
  const [validationErrors, setValidationErrors] = useState<{
    amountA?: string
    amountB?: string
    lpTokenAddress?: string
    lpTokenAmount?: string
  }>({})

  // Token selection hook
  const {
    availableTokens,
    userCreatedTokens,
    userLPTokens,
    customTokens,
    addCustomToken,
    isLoadingCustomToken,
    loadUserLPTokens // Add this to reload LP tokens after adding liquidity
  } = useTokenSelection()

  // Local state for token input handling in modals
  const [tokenAddressInput, setTokenAddressInput] = useState('')

  // Handle adding token from address
  const handleAddTokenFromAddress = useCallback(async () => {
    if (!tokenAddressInput) return

    try {
      // ✅ VALIDATE ADDRESS FORMAT
      const validatedAddress = validateAndFormatAddress(tokenAddressInput)
      loggers.liquidity.info('Adding custom token:', validatedAddress)

      await addCustomToken(validatedAddress)
      setTokenAddressInput('')

      // Show success toast
      addToast({
        title: 'Token Added',
        message: 'Token has been imported successfully',
        type: 'success'
      })
    } catch (error: any) {
      loggers.liquidity.error('Failed to add token:', error)

      // Show user-friendly error message
      const isValidationError = error.message.includes('Invalid Ethereum') || error.message.includes('Address is required')

      addToast({
        title: 'Failed to Add Token',
        message: isValidationError
          ? error.message
          : 'Could not load token. Please check the address and try again.',
        type: 'error'
      })

      trackLiquidityError(analytics, error, {
        operationType: 'add_custom_token',
        tokenAddress: tokenAddressInput,
        network: currentChainId?.toString() || 'unknown'
      });
    }
  }, [tokenAddressInput, addCustomToken, addToast, analytics, currentChainId])


  // Validation functions
  const validateInputs = useCallback(() => {
    const errors: typeof validationErrors = {}
    
    if (liquidityMode === 'add') {
      if (!amountA || !isValidAmount(amountA)) {
        errors.amountA = 'Please enter a valid amount'
      }
      if (!amountB || !isValidAmount(amountB)) {
        errors.amountB = 'Please enter a valid amount'
      }
    } else {
      if (!selectedLpToken) {
        errors.lpTokenAddress = 'Please select an LP token'
      }
      if (!lpTokenAmount || !isValidAmount(lpTokenAmount)) {
        errors.lpTokenAmount = 'Please enter a valid LP token amount'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [liquidityMode, amountA, amountB, selectedLpToken, lpTokenAmount])

  // Memoized computed values
  const isFormValid = useMemo(() => {
    if (liquidityMode === 'add') {
      return tokenA && tokenB && amountA && amountB && 
             isValidAmount(amountA) && isValidAmount(amountB)
    } else {
      return selectedLpToken && lpTokenAmount && isValidAmount(lpTokenAmount)
    }
  }, [liquidityMode, tokenA, tokenB, amountA, amountB, selectedLpToken, lpTokenAmount])

  // Optimized token balance fetching
  const { data: balanceA } = useBalance({
    address: userAddress,
    token: tokenA?.address === TOKEN_ADDRESSES.WETH ? undefined : tokenA?.address as `0x${string}`,
    query: { enabled: !!userAddress && !!tokenA }
  })

  const { data: balanceB } = useBalance({
    address: userAddress,
    token: tokenB?.address === TOKEN_ADDRESSES.WETH ? undefined : tokenB?.address as `0x${string}`,
    query: { enabled: !!userAddress && !!tokenB }
  })

  // LP Token balance for withdraw mode
  const { data: lpTokenBalance } = useBalance({
    address: userAddress,
    token: selectedLpToken?.address as `0x${string}`,
    query: { enabled: !!userAddress && !!selectedLpToken && liquidityMode === 'withdraw' }
  })

  // Helper function to set percentage amounts (defined after balance hooks)
  const setPercentageAmount = useCallback((token: Token | null, percentage: number, setAmount: (amount: string) => void, isLpToken = false) => {
    if (!token) return
    
    // Determine which balance to use based on the token
    let balance
    if (isLpToken && token === selectedLpToken) {
      balance = lpTokenBalance
    } else if (token === tokenA) {
      balance = balanceA
    } else if (token === tokenB) {
      balance = balanceB
    } else {
      return // Token not found in current selection
    }
    
    if (!balance) return

    const percentageAmount = (balance.value * BigInt(percentage)) / BigInt(100)
    const formattedAmount = formatUnits(percentageAmount, balance.decimals)
    
    // Round to 6 decimals maximum
    const rounded = Math.ceil(parseFloat(formattedAmount) * 1000000) / 1000000
    setAmount(rounded.toString())
  }, [balanceA, balanceB, lpTokenBalance, tokenA, tokenB, selectedLpToken])

  // Handle form submission with validation
  const handleAddLiquidity = useCallback(async () => {
    if (!tokenA || !tokenB || !validateInputs()) return
    
    // Clear ALL previous states before starting new transaction
    resetLoadingStates()
    
    // Small delay to ensure state is cleared before showing progress modal
    setTimeout(() => {
      setShowProgressModal(true)
    }, 100)
    
    const isTokenAEth = tokenA.address === TOKEN_ADDRESSES.WETH
    const customToken = isTokenAEth ? tokenB : tokenA
    const ethAmount = isTokenAEth ? amountA : amountB
    const tokenAmount = isTokenAEth ? amountB : amountA

    try {
      await addLiquidity(
        customToken.address,
        customToken.name,
        customToken.symbol,
        tokenAmount,
        ethAmount
      )
    } catch (error: any) {
      loggers.ui.error('❌ BASE TOKEN LAUNCHER - Liquidity addition error:', error)
      
      // Track detailed liquidity error
      trackLiquidityError(analytics, error, {
        operationType: 'add_liquidity',
        tokenAddress: tokenA?.address,
        tokenAmount: amountA,
        ethAmount: amountB,
        network: currentChainId?.toString() || 'unknown'
      });
    }
  }, [tokenA, tokenB, amountA, amountB, validateInputs, resetLoadingStates, addLiquidity])

  const handleRemoveLiquidity = useCallback(async (poolIdOrMode: string) => {
    try {
      if (poolIdOrMode === 'withdraw') {
        if (!validateInputs() || !selectedLpToken) return

        loggers.liquidity.info('Removing liquidity (withdraw mode):', {
          lpTokenAddress: selectedLpToken.address,
          amount: lpTokenAmount
        })
        await removeLiquidity(selectedLpToken.address, lpTokenAmount)
      } else {
        // Legacy pool removal - find the pool first to check its LP address
        const pool = userPools.find(p => p.id === poolIdOrMode)
        if (!pool) {
          throw new Error('Pool not found')
        }

        loggers.liquidity.info('Removing liquidity (pool mode):', {
          poolId: poolIdOrMode,
          tokenSymbol: pool.tokenSymbol,
          storedLpAddress: pool.poolAddress,
          isValidLpAddress: pool.poolAddress && pool.poolAddress !== '0x0000000000000000000000000000000000000000' && !pool.poolAddress.startsWith('MIGRATION_')
        })
        
        await removeLiquidity(poolIdOrMode)
      }
      
      
      // FIX: Don't reset LP token selection immediately - wait for transaction completion
      // The reset will happen in the success handler instead
    } catch (error: any) {
      loggers.ui.error('❌ BASE TOKEN LAUNCHER - Liquidity removal error:', error)
      
      // Track detailed liquidity removal error
      trackLiquidityError(analytics, error, {
        operationType: 'remove_liquidity',
        tokenAddress: selectedLpToken?.address,
        lpTokenAmount: lpTokenAmount,
        network: currentChainId?.toString() || 'unknown'
      });
      
      addToast({
        title: 'Liquidity Removal Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      })
    }
  }, [removeLiquidity, selectedLpToken, lpTokenAmount, validateInputs, userPools, addToast])

  // Success toast effect
  useEffect(() => {
    if (lastSuccessfulPool) {
      const poolKey = `${lastSuccessfulPool.id}_${lastSuccessfulPool.txHash}`
      
      if (lastToastRef.current.successPool === poolKey) {
        return
      }
      lastToastRef.current.successPool = poolKey
      
      const isWithdrawal = lastSuccessfulPool.id?.startsWith('direct-')
      
      addToast({
        title: isWithdrawal ? 'Liquidity Withdrawn Successfully' : 'Liquidity Added Successfully',
        message: isWithdrawal 
          ? `Successfully removed ${lastSuccessfulPool.liquidityTokens} LP tokens from pool`
          : `Added ${lastSuccessfulPool.tokenAmount} ${lastSuccessfulPool.tokenSymbol} and ${lastSuccessfulPool.ethAmount} ETH to pool`,
        type: 'success'
      })
      
      // FIX: Reload LP tokens immediately after successful liquidity addition
      if (!isWithdrawal) {
        loadUserLPTokens()
      } else {
        // FIX: Reset LP token selection only AFTER successful withdrawal
        setSelectedLpToken(null)
        setLpTokenAmount('')
        loadUserLPTokens() // Also reload LP tokens to update balances
      }
    }
  }, [lastSuccessfulPool, addToast, loadUserLPTokens])

  // Progress modal state management - CLEAN: Only handle proper success detection
  useEffect(() => {
    loggers.liquidity.info('Progress modal state:', {
      showProgressModal,
      isAddingLiquidity,
      currentStep,
      hasSuccessfulPool: !!lastSuccessfulPool,
      transactionHash: !!transactionHash,
      timestamp: new Date().toISOString()
    })

    // Success detection - when we have successful pool, close progress modal immediately
    if (showProgressModal && lastSuccessfulPool) {
      loggers.liquidity.info('Closing progress modal on success:', {
        poolId: lastSuccessfulPool.id,
        txHash: lastSuccessfulPool.txHash
      })

      setShowProgressModal(false)
    }
  }, [showProgressModal, lastSuccessfulPool])

  // Error handling effect with proper error code detection
  useEffect(() => {
    if (liquidityError && showProgressModal) {
      // Close modal immediately for user rejection errors
      const message = liquidityError.message?.toLowerCase() || ''
      const isUserRejection = message.includes('cancelled by user') || 
                             message.includes('user denied') ||
                             message.includes('user rejected') ||
                             message.includes('transaction was rejected')
      
      if (isUserRejection) {
        setShowProgressModal(false)
      }
    }
  }, [liquidityError, showProgressModal])

  // Error toast effect
  useEffect(() => {
    if (liquidityError?.message && !showProgressModal) {
      const now = Date.now()
      if (lastToastRef.current.errorMessage === liquidityError.message && 
          lastToastRef.current.lastErrorTime && 
          now - lastToastRef.current.lastErrorTime < 3000) {
        return
      }
      
      lastToastRef.current.errorMessage = liquidityError.message
      lastToastRef.current.lastErrorTime = now
      
      addToast({
        title: 'Liquidity Error',
        message: liquidityError.message,
        type: 'error'
      })
    }
    
    if (!liquidityError) {
      lastToastRef.current.errorMessage = undefined
    }
  }, [liquidityError?.message, showProgressModal, addToast])

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
        <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-white/5 rounded-2xl"></div>
            <div className="h-96 bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <SEO
        title="Add Liquidity to Uniswap V2 - Earn Trading Fees on EVM Chains"
        description="Add liquidity to Uniswap V2 pools across multiple EVM blockchains and start earning trading fees. Provide liquidity for your tokens on Base, Ethereum, Arbitrum, and more."
        keywords="uniswap v2 liquidity, multi-chain liquidity, add liquidity evm, earn trading fees, liquidity provider, base arbitrum ethereum"
        canonical="/liquidity"
      />
      
      <div className={`relative z-10 ${layout.pageContainer}`}>
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
          >
            <span className="text-sm font-medium text-blue-400">💧 Liquidity Provider</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Liquidity Management
            </span>
            <br />
            <span className={typography.pageTitleWhite}>on Uniswap V2</span>
          </motion.h1>
          
          <motion.p 
            className={`${typography.subtitle} max-w-3xl mx-auto text-lg sm:text-xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Add liquidity to earn trading fees or withdraw your existing positions.
          </motion.p>

          {!isV2Available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-yellow-300 font-semibold">Network Notice</div>
                    <div className="text-yellow-200 text-sm">
                      Uniswap V2 liquidity features require a supported mainnet. Please switch to a compatible network to continue.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-24">
          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div className="flex bg-white/5 rounded-2xl p-2">
              <button
                onClick={() => setLiquidityMode('add')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  liquidityMode === 'add'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Add Liquidity
              </button>
              <button
                onClick={() => setLiquidityMode('withdraw')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  liquidityMode === 'withdraw'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Withdraw Liquidity
              </button>
            </div>
          </motion.div>

          {liquidityMode === 'add' ? (
            /* Add Liquidity Form */
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
                  <label className={`block ${typography.label} mb-3`}>
                    First Token *
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 focus-within:border-blue-400/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-blue-500/20 focus-within:ring-1 focus-within:ring-blue-400/20">
                    {/* Top row: Input and Token selector */}
                    <div className="flex items-center space-x-4 mb-3">
                      {/* Input side (left) */}
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="0.0"
                          value={amountA}
                          onChange={(e) => setAmountA(e.target.value)}
                          className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent transition-all duration-200"
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
                          onClick={() => setShowTokenModalA(true)}
                          className="flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all duration-200"
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
                      <div className="flex items-center justify-between">
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
                                onClick={() => setPercentageAmount(tokenA, percentage, setAmountA)}
                                className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                              >
                                {percentage}%
                              </button>
                            ))}
                            <button
                              onClick={() => setPercentageAmount(tokenA, 100, setAmountA)}
                              className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-lg transition-all duration-200"
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
                  <label className={`block ${typography.label} mb-3`}>
                    Second Token *
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all duration-300 focus-within:border-blue-400/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-blue-500/20 focus-within:ring-1 focus-within:ring-blue-400/20">
                    {/* Top row: Input and Token selector */}
                    <div className="flex items-center space-x-4 mb-3">
                      {/* Input side (left) */}
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="0.0"
                          value={amountB}
                          onChange={(e) => setAmountB(e.target.value)}
                          className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-white placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent transition-all duration-200"
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
                          onClick={() => setShowTokenModalB(true)}
                          className="flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all duration-200"
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
                      <div className="flex items-center justify-between">
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
                                onClick={() => setPercentageAmount(tokenB, percentage, setAmountB)}
                                className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                              >
                                {percentage}%
                              </button>
                            ))}
                            <button
                              onClick={() => setPercentageAmount(tokenB, 100, setAmountB)}
                              className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 rounded-lg transition-all duration-200"
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
                    onClick={handleAddLiquidity}
                    disabled={!isFormValid || isAddingLiquidity || !isV2Available}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-300 ${
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
          ) : (
            /* Withdraw Liquidity Form */
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
                          onChange={(e) => setLpTokenAmount(e.target.value)}
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
                          onClick={() => setShowLpTokenModal(true)}
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
                                onClick={() => setPercentageAmount(selectedLpToken, percentage, setLpTokenAmount, true)}
                                className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                              >
                                {percentage}%
                              </button>
                            ))}
                            <button
                              onClick={() => setPercentageAmount(selectedLpToken, 100, setLpTokenAmount, true)}
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
                    onClick={() => handleRemoveLiquidity('withdraw')}
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
          )}
        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {showTokenModalA && (
          <TokenSelectModal
            isOpen={showTokenModalA}
            onClose={() => setShowTokenModalA(false)}
            title="Select First Token"
            tokens={[...availableTokens, ...userCreatedTokens, ...customTokens]}
            selectedToken={tokenA || undefined}
            onSelectToken={(token) => {
              setTokenA(token)
              setShowTokenModalA(false)
            }}
            showTokenInput={true}
            tokenAddressInput={tokenAddressInput}
            onTokenAddressInputChange={setTokenAddressInput}
            onAddTokenFromAddress={handleAddTokenFromAddress}
            isLoadingToken={isLoadingCustomToken}
            userCreatedTokens={userCreatedTokens}
            userLPTokens={userLPTokens}
            mode="add"
          />
        )}

        {showTokenModalB && (
          <TokenSelectModal
            isOpen={showTokenModalB}
            onClose={() => setShowTokenModalB(false)}
            title="Select Second Token"
            tokens={[...availableTokens, ...userCreatedTokens, ...customTokens]}
            selectedToken={tokenB || undefined}
            onSelectToken={(token) => {
              setTokenB(token)
              setShowTokenModalB(false)
            }}
            showTokenInput={true}
            tokenAddressInput={tokenAddressInput}
            onTokenAddressInputChange={setTokenAddressInput}
            onAddTokenFromAddress={handleAddTokenFromAddress}
            isLoadingToken={isLoadingCustomToken}
            userCreatedTokens={userCreatedTokens}
            userLPTokens={userLPTokens}
            mode="add"
          />
        )}

        {showLpTokenModal && (
          <TokenSelectModal
            isOpen={showLpTokenModal}
            onClose={() => setShowLpTokenModal(false)}
            title="Select LP Token to Withdraw"
            tokens={[...customTokens]} // Allow custom LP token addresses
            selectedToken={selectedLpToken || undefined}
            onSelectToken={(token) => {
              setSelectedLpToken(token)
              setShowLpTokenModal(false)
            }}
            showTokenInput={true}
            tokenAddressInput={tokenAddressInput}
            onTokenAddressInputChange={setTokenAddressInput}
            onAddTokenFromAddress={handleAddTokenFromAddress}
            isLoadingToken={isLoadingCustomToken}
            userCreatedTokens={userCreatedTokens}
            userLPTokens={userLPTokens}
            mode="withdraw"
          />
        )}

        {showProgressModal && (
          <TransactionProgressModal
            isOpen={showProgressModal}
            onClose={() => setShowProgressModal(false)}
            currentStep={currentStep}
            isProcessing={isAddingLiquidity}
            tokenA={tokenA}
            tokenB={tokenB}
            amountA={amountA}
            amountB={amountB}
            error={liquidityError}
            transactionHash={transactionHash || undefined}
            poolAddress={poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000' ? poolAddress : undefined}
            chainId={currentChainId}
            resetLoadingStates={resetLoadingStates}
          />
        )}

        {lastSuccessfulPool && !showProgressModal && (
          <>
            {loggers.liquidity.info('Showing success modal:', {
              poolId: lastSuccessfulPool.id,
              txHash: lastSuccessfulPool.txHash,
              lpTokenAddress: lastSuccessfulPool.poolAddress,
              tokenSymbol: lastSuccessfulPool.tokenSymbol,
              chainId: currentChainId
            })}
            <SuccessModal
              isOpen={!!lastSuccessfulPool}
              onClose={clearSuccessState}
              pool={{
                tokenAddress: lastSuccessfulPool.tokenAddress,
                tokenName: lastSuccessfulPool.tokenName,
                tokenSymbol: lastSuccessfulPool.tokenSymbol,
                tokenAmount: lastSuccessfulPool.tokenAmount,
                ethAmount: lastSuccessfulPool.ethAmount,
                txHash: lastSuccessfulPool.txHash,
                lpTokenAddress: lastSuccessfulPool.poolAddress
              }}
              chainId={currentChainId}
              isWithdrawal={lastSuccessfulPool.id?.startsWith('direct-')} // Detect if it's a withdrawal
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}