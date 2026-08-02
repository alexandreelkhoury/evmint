import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { useFirebaseAnalytics } from '../../../components/FirebaseProvider'
import { trackPageView, trackLiquidityError } from '../../../utils/analytics'
import { useTokenSelection } from '../../../hooks/useTokenSelection'
import { useUniswapV2Liquidity } from '../../../features/liquidity'
import { useGlobalToasts } from '../../../App'
import { formatUnits } from 'viem'
import { validateAndFormatAddress, isSameAddress } from '../../../utils/validation'
import { loggers } from '../../../utils/logger'
import { getChainById, getChainName } from '../../../config/chains'

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
  tokenB?: string
  lpTokenAddress?: string
  lpTokenAmount?: string
}

// Validation utilities
const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && isFinite(num)
}

export function useLiquidityPageLogic() {
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

  // Get chain-specific native token info
  const chainConfig = getChainById(currentChainId)
  const nativeTokenSymbol = chainConfig?.nativeCurrency?.symbol || 'ETH'
  const nativeTokenName = chainConfig?.nativeCurrency?.name || 'Ethereum'
  const wrappedTokenAddress = chainConfig?.weth || '0x4200000000000000000000000000000000000006'

  // Token selection state - default to chain's native wrapped token
  const [tokenA, setTokenA] = useState<Token | null>(null)
  const [tokenB, setTokenB] = useState<Token | null>({
    address: wrappedTokenAddress,
    name: nativeTokenName,
    symbol: nativeTokenSymbol,
    decimals: 18
  })
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')

  // Input validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // Update tokenB when chain changes to use the correct native token
  useEffect(() => {
    setTokenB({
      address: wrappedTokenAddress,
      name: nativeTokenName,
      symbol: nativeTokenSymbol,
      decimals: 18
    })
  }, [currentChainId, wrappedTokenAddress, nativeTokenName, nativeTokenSymbol])

  // Token selection hook
  const {
    availableTokens,
    userCreatedTokens,
    userLPTokens,
    customTokens,
    userTokensLoaded,
    addCustomToken,
    isLoadingCustomToken,
    loadUserLPTokens
  } = useTokenSelection()

  // Pre-fill token from URL params (?token=0x...&chain=8453)
  const [searchParams] = useSearchParams()
  const prefillTokenAddress = searchParams.get('token')
  const prefillChainParam = searchParams.get('chain')
  const prefillChainId = prefillChainParam && /^\d+$/.test(prefillChainParam)
    ? Number(prefillChainParam)
    : null
  const prefillChainName = prefillChainId ? getChainName(prefillChainId) : ''

  // The deep link names a chain we are not connected to — the address will never
  // resolve here, so prompt for a switch instead of failing silently
  const needsChainSwitch = !!prefillTokenAddress && prefillChainId !== null && prefillChainId !== currentChainId

  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [prefillError, setPrefillError] = useState<string | null>(null)
  // Bumped only by the Retry button. It is part of the attempt key, so the one
  // thing that can re-open a settled attempt is an explicit user action.
  const [prefillRetryNonce, setPrefillRetryNonce] = useState(0)
  // Holds the `${nonce}:${chainId}:${address}` currently being resolved, or the
  // one we already settled. Never set on a "lists aren't ready yet" miss.
  const prefillAttemptRef = useRef<string | null>(null)

  useEffect(() => {
    const attemptKey = `${prefillRetryNonce}:${currentChainId}:${prefillTokenAddress?.toLowerCase() ?? ''}`

    // Abandon the previous attempt as soon as any of its inputs change. This
    // has to run *before* the readiness guards below: on a chain switch we
    // often bail out at `needsChainSwitch`, and without clearing the ref first
    // an in-flight resolve for the old chain would still see its own key and
    // set tokenA to a token that does not exist on the chain we are now on.
    if (prefillAttemptRef.current !== attemptKey) prefillAttemptRef.current = null

    if (!prefillTokenAddress) return
    // Token lists have not loaded yet — a miss right now means nothing
    if (!userTokensLoaded) return
    // Wrong network: wait for the user to switch before trying to resolve
    if (needsChainSwitch) return

    // Already resolved, or already failed, for exactly this key. Retrying needs
    // a new key (a new nonce), so no amount of re-rendering can loop here.
    if (prefillAttemptRef.current === attemptKey) return
    prefillAttemptRef.current = attemptKey

    const allTokens = [...userCreatedTokens, ...availableTokens, ...customTokens]
    const found = allTokens.find(t => t.address.toLowerCase() === prefillTokenAddress.toLowerCase())

    if (found) {
      setTokenA(found)
      setPrefillError(null)
      return
    }

    // Not in any list — resolve it on chain and use the token we get back
    // directly (re-scanning the arrays here would only see a stale closure)
    addCustomToken(prefillTokenAddress)
      .then(token => {
        // A chain switch, a new address or a retry happened while we were in
        // flight — this result is for a target the user has already left.
        if (prefillAttemptRef.current !== attemptKey) return
        setTokenA(token)
        setPrefillError(null)
      })
      .catch(error => {
        if (prefillAttemptRef.current !== attemptKey) return

        loggers.liquidity.error('Failed to prefill token from URL:', error)

        const shortAddress = `${prefillTokenAddress.slice(0, 6)}…${prefillTokenAddress.slice(-4)}`
        setPrefillError(
          `We couldn't load ${shortAddress} on ${getChainName(currentChainId)}. This is often a temporary network issue — retry, or check the address and pick a token manually.`
        )

        trackLiquidityError(analytics, error, {
          operationType: 'prefill_token_from_url',
          tokenAddress: prefillTokenAddress,
          network: currentChainId?.toString() || 'unknown'
        })
      })
  }, [prefillTokenAddress, needsChainSwitch, currentChainId, userTokensLoaded, prefillRetryNonce, userCreatedTokens, availableTokens, customTokens, addCustomToken, analytics])

  // A transient RPC failure must not kill the deep link for the rest of the
  // mount. Nothing else writes this state, so the effect above can only re-run
  // when the user asks it to.
  const retryPrefill = useCallback(() => {
    setPrefillRetryNonce(nonce => nonce + 1)
  }, [])

  const switchToPrefillChain = useCallback(() => {
    if (!prefillChainId) return

    switchChain({ chainId: prefillChainId }, {
      onError: (error: any) => {
        loggers.liquidity.error('Failed to switch network for prefill:', error)
        addToast({
          title: 'Network Switch Failed',
          message: error?.message || `Could not switch to ${prefillChainName}. Please switch in your wallet.`,
          type: 'error'
        })
      }
    })
  }, [prefillChainId, prefillChainName, switchChain, addToast])

  // Local state for token input handling in modals
  const [tokenAddressInput, setTokenAddressInput] = useState('')

  // Handle adding token from address — auto-selects if already in list
  const handleAddTokenFromAddress = useCallback(async () => {
    if (!tokenAddressInput) return

    try {
      const validatedAddress = validateAndFormatAddress(tokenAddressInput)

      // Check if token already exists in any list — if so, auto-select it
      const allTokens = [...availableTokens, ...userCreatedTokens, ...customTokens]
      const existingToken = allTokens.find(t => t.address.toLowerCase() === validatedAddress.toLowerCase())

      if (existingToken) {
        // Auto-select the token in whichever modal is open
        if (showTokenModalA) {
          setTokenA(existingToken)
          setShowTokenModalA(false)
        } else if (showTokenModalB) {
          setTokenB(existingToken)
          setShowTokenModalB(false)
        }
        setTokenAddressInput('')
        addToast({
          title: 'Token Selected',
          message: `${existingToken.symbol} was already in your list and has been selected.`,
          type: 'info'
        })
        return
      }

      // Token not in list — add it
      loggers.liquidity.info('Adding custom token:', validatedAddress)
      await addCustomToken(validatedAddress)
      setTokenAddressInput('')

      addToast({
        title: 'Token Added',
        message: 'Token has been imported successfully',
        type: 'success'
      })
    } catch (error: any) {
      loggers.liquidity.error('Failed to add token:', error)

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
  }, [tokenAddressInput, addCustomToken, addToast, analytics, currentChainId, availableTokens, userCreatedTokens, customTokens, showTokenModalA, showTokenModalB, setTokenA, setTokenB, setShowTokenModalA, setShowTokenModalB])

  // Validation functions
  const validateInputs = useCallback(() => {
    const errors: ValidationErrors = {}

    if (liquidityMode === 'add') {
      if (!amountA || !isValidAmount(amountA)) {
        errors.amountA = 'Please enter a valid amount'
      }
      if (!amountB || !isValidAmount(amountB)) {
        errors.amountB = 'Please enter a valid amount'
      }
      // Only native pairs are supported — we call addLiquidityETH, and
      // handleAddLiquidity treats whichever side is not the wrapped native
      // token as the ERC20 leg. Without this guard, selecting two ERC20s
      // sends the second amount as native currency instead of that token.
      const aIsNative = isSameAddress(tokenA?.address, wrappedTokenAddress)
      const bIsNative = isSameAddress(tokenB?.address, wrappedTokenAddress)
      if (tokenA && tokenB && !aIsNative && !bIsNative) {
        errors.tokenB = `One side of the pair must be ${nativeTokenSymbol}. Pools here are always paired against ${nativeTokenSymbol}.`
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
  const isFormValid = useMemo((): boolean => {
    if (liquidityMode === 'add') {
      return !!(tokenA && tokenB && amountA && amountB &&
             isValidAmount(amountA) && isValidAmount(amountB))
    } else {
      return !!(selectedLpToken && lpTokenAmount && isValidAmount(lpTokenAmount))
    }
  }, [liquidityMode, tokenA, tokenB, amountA, amountB, selectedLpToken, lpTokenAmount])

  // Optimized token balance fetching
  const { data: balanceA } = useBalance({
    address: userAddress,
    token: isSameAddress(tokenA?.address, wrappedTokenAddress) ? undefined : tokenA?.address as `0x${string}`,
    query: { enabled: !!userAddress && !!tokenA }
  })

  const { data: balanceB } = useBalance({
    address: userAddress,
    token: isSameAddress(tokenB?.address, wrappedTokenAddress) ? undefined : tokenB?.address as `0x${string}`,
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

    // Case-insensitive: tokenA.address may be checksummed (pasted, or returned
    // by viem) while wrappedTokenAddress comes from chain config. A strict ===
    // here disagreed with validateInputs and with AddLiquidityForm — both of
    // which already lowercase — so the guard could pass, the form could show
    // one leg as native, and this line could still send the ERC20 amount as
    // msg.value to addLiquidityETH.
    const isTokenAEth = isSameAddress(tokenA.address, wrappedTokenAddress)
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
      loggers.ui.error('❌ EVMint - Liquidity addition error:', error)

      // Track detailed liquidity error
      trackLiquidityError(analytics, error, {
        operationType: 'add_liquidity',
        tokenAddress: tokenA?.address,
        tokenAmount: amountA,
        ethAmount: amountB,
        network: currentChainId?.toString() || 'unknown'
      });
    }
  }, [tokenA, tokenB, amountA, amountB, validateInputs, resetLoadingStates, addLiquidity, analytics, currentChainId])

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
      loggers.ui.error('❌ EVMint - Liquidity removal error:', error)

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
  }, [removeLiquidity, selectedLpToken, lpTokenAmount, validateInputs, userPools, addToast, analytics, currentChainId])

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
          : `Added ${lastSuccessfulPool.tokenAmount} ${lastSuccessfulPool.tokenSymbol} and ${lastSuccessfulPool.ethAmount} ${nativeTokenSymbol} to pool`,
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
  }, [lastSuccessfulPool, addToast, loadUserLPTokens, nativeTokenSymbol])

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
  }, [showProgressModal, lastSuccessfulPool, isAddingLiquidity, currentStep, transactionHash])

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

  return {
    // State
    ready,
    authenticated,
    userAddress,
    currentChainId,
    liquidityMode,
    tokenA,
    tokenB,
    amountA,
    amountB,
    selectedLpToken,
    lpTokenAmount,
    validationErrors,
    isFormValid,
    showTokenModalA,
    showTokenModalB,
    showLpTokenModal,
    showProgressModal,
    tokenAddressInput,

    // Balances
    balanceA,
    balanceB,
    lpTokenBalance,

    // Token selection
    availableTokens,
    userCreatedTokens,
    userLPTokens,
    customTokens,
    isLoadingCustomToken,

    // Deep-link prefill (?token=...&chain=...)
    prefillChainId,
    prefillChainName,
    needsChainSwitch,
    isSwitchingChain,
    prefillError,
    isRetryingPrefill: isLoadingCustomToken,

    // Liquidity hook data
    isAddingLiquidity,
    isRemovingLiquidity,
    userPools,
    currentStep,
    liquidityError,
    isV2CorrectChain,
    isV2Available,
    lastSuccessfulPool,
    transactionHash,
    poolAddress,

    // Actions
    setLiquidityMode,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    setSelectedLpToken,
    setLpTokenAmount,
    setShowTokenModalA,
    setShowTokenModalB,
    setShowLpTokenModal,
    setShowProgressModal,
    setTokenAddressInput,
    setPercentageAmount,
    switchToPrefillChain,
    retryPrefill,
    handleAddTokenFromAddress,
    handleAddLiquidity,
    handleRemoveLiquidity,
    clearSuccessState,
    resetLoadingStates
  }
}
