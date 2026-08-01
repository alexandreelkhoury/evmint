import { useState, useEffect } from 'react'
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { parseUnits } from 'viem'
import { baseSepolia } from 'viem/chains'
import { getChainById } from '../../../config/chains'
import { TIMEOUTS, RETRY_CONFIG } from '../../../config/constants'
import { loggers } from '../../../utils/logger'
import { LIQUIDITY_STORAGE_KEY, FACTORY_ABI } from '../constants'
import { useLiquidityContracts } from './useLiquidityContracts'
import { useLPTokenStorage } from './useLPTokenStorage'
import { usePoolQuery } from './usePoolQuery'
import { useAddLiquidity } from './useAddLiquidity'
import { useRemoveLiquidity } from './useRemoveLiquidity'
import type { LiquidityPool, TokenProcessInfo, TransactionStep } from '../types'

/**
 * Main hook for Uniswap V2 liquidity operations
 * Orchestrates add/remove liquidity flows with proper state management
 */
export function useUniswapV2Liquidity() {
  // ================================
  // CORE SETUP & STATE MANAGEMENT
  // ================================
  const { address: userAddress, isConnected } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { getContracts } = useLiquidityContracts()

  // Core state
  const [error, setError] = useState<Error | null>(null)
  const [lastSuccessfulPool, setLastSuccessfulPool] = useState<LiquidityPool | null>(null)

  // Transaction flow state
  const [currentStep, setCurrentStep] = useState<TransactionStep>(null)
  const [poolToRemove, setPoolToRemove] = useState<LiquidityPool | null>(null)
  const [tokenToProcess, setTokenToProcess] = useState<TokenProcessInfo | null>(null)

  // Immediate loading states for better UX
  const [isPreparingAddLiquidity, setIsPreparingAddLiquidity] = useState(false)
  const [isPreparingRemoveLiquidity, setIsPreparingRemoveLiquidity] = useState(false)

  // ================================
  // SUB-HOOKS
  // ================================
  const { userPools, setUserPools, saveLPTokenToStorage, refetchPools } = useLPTokenStorage()
  const { poolAddress, lpBalance, lpAllowance, refetchLpBalance, refetchLpAllowance, poolExists } = usePoolQuery(tokenToProcess, poolToRemove)

  // ================================
  // WAGMI CONTRACT INTERACTION HOOKS
  // ================================
  const {
    writeContractAsync,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite
  } = useWriteContract({
    mutation: {
      onError: (error, variables, context) => {
        loggers.liquidity.error('Transaction Error:', {
          error: error.message,
          code: (error as any)?.code,
          cause: (error as any)?.cause
        })

        const errorType = getErrorType(error)
        const errorMessage = getErrorMessage(error, errorType)

        // Don't show error for user rejections - they're intentional
        if (errorType !== 'USER_REJECTED') {
          setError(new Error(errorMessage))
        }

        // Reset states on error
        setCurrentStep(null)
        setTokenToProcess(null)
        setPoolToRemove(null)
        setIsPreparingAddLiquidity(false)
        setIsPreparingRemoveLiquidity(false)
      },
      onSuccess: (data, variables, context) => {
        loggers.liquidity.success(' Transaction submitted successfully:', {
          hash: data,
          variables,
          context,
          timestamp: new Date().toISOString()
        })
        // Transaction hash is set in individual functions
      },
      onSettled: (data, error) => {
        loggers.liquidity.info(' Transaction settled:', {
          success: !!data,
          hasError: !!error,
          hash: data,
          timestamp: new Date().toISOString()
        })
        // Always clear preparing states when transaction is submitted or fails
        if (error) {
          setIsPreparingAddLiquidity(false)
          setIsPreparingRemoveLiquidity(false)
        }
      }
    }
  })

  // We'll manage transaction hashes manually for better control
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>(undefined)

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
    data: receipt
  } = useWaitForTransactionReceipt({
    hash: currentTxHash,
    timeout: TIMEOUTS.TRANSACTION_WAIT, // 5 minutes timeout for testnet
    query: {
      retry: RETRY_CONFIG.MAX_RETRIES, // Increased retries
      retryDelay: TIMEOUTS.TRANSACTION_RETRY_DELAY, // Reduced delay
      enabled: !!currentTxHash // Only enable when we have a hash
    }
  })

  // ================================
  // ADD LIQUIDITY HOOK
  // ================================
  const {
    tokenDecimals,
    decimalsError,
    decimalsLoading,
    refetchDecimals,
    allowance,
    refetchAllowance,
    handleApproveToken,
    handleAddLiquidityStep
  } = useAddLiquidity(tokenToProcess, writeContractAsync, setCurrentTxHash)

  // ================================
  // REMOVE LIQUIDITY HOOK
  // ================================
  const {
    handleApproveLpToken,
    handleRemoveLiquidityStep
  } = useRemoveLiquidity(poolToRemove, writeContractAsync, setCurrentTxHash)

  // ================================
  // TRANSACTION MONITORING
  // ================================

  // Monitor transaction hash
  useEffect(() => {
    if (currentTxHash) {
      const isTestnet = chainId === baseSepolia.id
      const baseUrl = isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org'
      loggers.liquidity.info(`Transaction submitted! View on explorer: ${baseUrl}/tx/${currentTxHash}`)
      loggers.liquidity.info('Transaction hash received:', {
        hash: currentTxHash,
        currentStep,
        isTokenProcess: !!tokenToProcess,
        isPoolRemoval: !!poolToRemove,
        chainId,
        timestamp: new Date().toISOString()
      })
    }
  }, [currentTxHash, chainId, currentStep, tokenToProcess, poolToRemove])

  // Monitor transaction status with detailed logging
  useEffect(() => {
    if (currentTxHash) {
    }

    if (isConfirming && currentTxHash) {

      // Set a timeout to warn about slow confirmation
      const timeoutId = setTimeout(() => {
        if (isConfirming) {
        }
      }, 60000) // 1 minute warning

      return () => clearTimeout(timeoutId)
    }
  }, [isConfirming, isConfirmed, currentTxHash, receipt, confirmError, currentStep])

  // Debug LP allowance query (only log when there are issues)
  useEffect(() => {
    if (poolToRemove && lpAllowance === undefined) {
      const contracts = getContracts()
      loggers.liquidity.info('LP allowance query state:', {
        lpTokenAddress: poolToRemove.poolAddress,
        routerAddress: contracts.router,
        queryEnabled: !!(userAddress && poolToRemove?.poolAddress && contracts.router)
      })
    }
  }, [poolToRemove, lpAllowance, userAddress, chainId])

  // ================================
  // ERROR HANDLING UTILITIES
  // ================================

  // IMPROVED: Error detection utilities with better categorization
  const getErrorType = (error: any): 'USER_REJECTED' | 'NETWORK_ERROR' | 'CONTRACT_ERROR' | 'GAS_ERROR' | 'ALLOWANCE_ERROR' | 'UNKNOWN' => {
    if (!error) return 'UNKNOWN'

    // Check error code first (most reliable)
    const errorCode = error.code || (error.cause?.code)

    // User rejection codes
    if (errorCode === 4001 || errorCode === 'ACTION_REJECTED' || errorCode === 'TRANSACTION_REJECTED') {
      return 'USER_REJECTED'
    }

    // Check for specific error patterns in message
    const message = error.message?.toLowerCase() || ''
    const shortMessage = (error.shortMessage || '').toLowerCase()
    const combinedMessage = `${message} ${shortMessage}`

    // User rejection patterns
    if (combinedMessage.includes('user rejected') ||
        combinedMessage.includes('user denied') ||
        combinedMessage.includes('cancelled by user') ||
        combinedMessage.includes('transaction was rejected') ||
        combinedMessage.includes('user cancelled')) {
      return 'USER_REJECTED'
    }

    // Network/connection errors
    if (combinedMessage.includes('network') ||
        combinedMessage.includes('timeout') ||
        combinedMessage.includes('connection') ||
        combinedMessage.includes('fetch') ||
        combinedMessage.includes('rpc')) {
      return 'NETWORK_ERROR'
    }

    // Gas related errors
    if (combinedMessage.includes('gas') ||
        combinedMessage.includes('out of gas') ||
        combinedMessage.includes('gas estimate') ||
        combinedMessage.includes('gas limit')) {
      return 'GAS_ERROR'
    }

    // Allowance/approval errors
    if (combinedMessage.includes('allowance') ||
        combinedMessage.includes('insufficient allowance') ||
        combinedMessage.includes('erc20: transfer amount exceeds allowance')) {
      return 'ALLOWANCE_ERROR'
    }

    // Contract execution errors
    if (combinedMessage.includes('revert') ||
        combinedMessage.includes('execution reverted') ||
        combinedMessage.includes('insufficient') ||
        combinedMessage.includes('slippage') ||
        combinedMessage.includes('deadline') ||
        combinedMessage.includes('liquidity')) {
      return 'CONTRACT_ERROR'
    }

    return 'UNKNOWN'
  }

  const getErrorMessage = (error: any, errorType: string): string => {
    switch (errorType) {
      case 'USER_REJECTED':
        return 'Transaction cancelled by user'
      case 'NETWORK_ERROR':
        return 'Network error occurred. Please check your connection and try again.'
      case 'GAS_ERROR':
        return 'Gas estimation failed. The transaction may require more gas than expected or the contract interaction may fail.'
      case 'ALLOWANCE_ERROR':
        return 'Token allowance insufficient. Please try approving the token again.'
      case 'CONTRACT_ERROR':
        const message = error.message || error.shortMessage || ''
        if (message.includes('slippage')) {
          return 'Transaction failed due to slippage. Try adjusting the slippage tolerance.'
        } else if (message.includes('deadline')) {
          return 'Transaction deadline exceeded. Please try again.'
        } else if (message.includes('insufficient')) {
          return 'Insufficient token balance or liquidity for this transaction.'
        } else {
          return 'Smart contract interaction failed. Please check your transaction parameters and try again.'
        }
      default:
        return error.message || error.shortMessage || 'An unexpected error occurred'
    }
  }

  // Handle confirmation errors only (write errors handled by wagmi mutation callback)
  useEffect(() => {
    if (confirmError) {
      const errorType = getErrorType(confirmError)

      loggers.liquidity.error('🚨 Transaction Confirmation Error:', {
        error: confirmError.message,
        errorCode: (confirmError as any)?.code,
        errorType,
        currentStep,
        hash: currentTxHash,
        timestamp: new Date().toISOString()
      })

      setError(new Error(getErrorMessage(confirmError, errorType)))
      setCurrentStep(null)
      setTokenToProcess(null)
      setPoolToRemove(null)
      setIsPreparingAddLiquidity(false) // FIX: Clear loading states on confirmation error
      setIsPreparingRemoveLiquidity(false)
    }
  }, [confirmError, currentStep, currentTxHash, tokenToProcess, poolToRemove])

  // ================================
  // TRANSACTION SUCCESS HANDLING
  // ================================

  // Handle successful transactions
  useEffect(() => {

    // CRITICAL FIX: Only process receipt if it matches current transaction hash
    if (isConfirmed && receipt && receipt.transactionHash === currentTxHash) {
      loggers.liquidity.success(' Receipt matches current transaction hash - processing...')
    } else if (isConfirmed && receipt && receipt.transactionHash !== currentTxHash) {
      loggers.liquidity.warn(' MISMATCH: Receipt is from old transaction, ignoring...', {
        receiptHash: receipt.transactionHash,
        currentHash: currentTxHash,
        currentStep
      })
      return // Don't process this receipt
    }

    if (isConfirmed && receipt && receipt.transactionHash === currentTxHash) {
      loggers.liquidity.success(' Transaction confirmed with receipt!', {
        currentStep,
        hash: currentTxHash,
        receiptStatus: receipt.status,
        blockNumber: receipt.blockNumber,
        isTokenProcess: !!tokenToProcess,
        isPoolRemoval: !!poolToRemove,
        poolAddress,
        receiptLogs: receipt.logs?.length || 0,
        receiptDetails: {
          gasUsed: receipt.gasUsed?.toString(),
          effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
          transactionIndex: receipt.transactionIndex
        },
        timestamp: new Date().toISOString()
      })

      if (currentStep === 'approve' && tokenToProcess) {
        // Approval successful, now add liquidity
        loggers.liquidity.success(' Approval confirmed! Now adding liquidity...')

        // CRITICAL: Reset currentTxHash before moving to next step
        // This prevents the receipt handler from thinking add liquidity is done
        setCurrentTxHash(undefined)
        setCurrentStep('add')

        // Use async pattern to properly handle the second transaction
        setTimeout(async () => {
          try {
            loggers.liquidity.info(' Starting add liquidity step after approval...')

            // Refresh allowance and wait a moment for blockchain state to update
            await refetchAllowance()

            // Add a small additional delay to ensure the approval is fully processed
            await new Promise(resolve => setTimeout(resolve, 500))

            await handleAddLiquidityStep(tokenToProcess)
          } catch (error) {
            loggers.liquidity.error('❌ Failed to add liquidity after approval:', error)
            setError(error instanceof Error ? error : new Error('Failed to add liquidity'))
            setCurrentStep(null)
            setTokenToProcess(null)
          }
        }, 1500) // Increased delay to ensure approval is fully processed
      } else if (currentStep === 'add' && tokenToProcess) {
        loggers.liquidity.info('✅ Liquidity added successfully:', {
          tokenToProcess,
          poolAddress,
          hash: currentTxHash,
          userAddress,
          receiptLogs: receipt.logs?.length || 0
        })

        // Try to extract LP token address from transaction logs
        let actualLpTokenAddress = poolAddress

        // Parse transaction logs to find LP token mint events
        if (receipt.logs && receipt.logs.length > 0) {
          loggers.liquidity.info('📋 Parsing transaction receipt logs:', {
            totalLogs: receipt.logs.length,
            logs: receipt.logs.map((log, i) => ({
              index: i,
              address: log.address,
              topics: log.topics,
              data: log.data
            }))
          })

          // Look for Transfer events to address(0) which indicate LP token minting
          const lpMintEvents = receipt.logs.filter(log =>
            log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && // Transfer event signature
            log.topics[2] === '0x0000000000000000000000000000000000000000000000000000000000000000' // to address(0) = mint
          )

          if (lpMintEvents.length > 0) {
            actualLpTokenAddress = lpMintEvents[0].address
            loggers.liquidity.success(' Found LP token address from mint event:', actualLpTokenAddress)
          }
        }

        // Liquidity added successfully - SET RESULT IMMEDIATELY like token creation!
        const tokenInfo = {
          address: tokenToProcess.address,
          name: tokenToProcess.name,
          symbol: tokenToProcess.symbol,
          tokenAmount: tokenToProcess.tokenAmount,
          ethAmount: tokenToProcess.ethAmount
        }

        const newPool: LiquidityPool = {
          id: `${userAddress?.toLowerCase()}_${tokenInfo.address}_${Date.now()}`,
          tokenAddress: tokenInfo.address,
          tokenName: tokenInfo.name,
          tokenSymbol: tokenInfo.symbol,
          tokenAmount: tokenInfo.tokenAmount,
          ethAmount: tokenInfo.ethAmount,
          poolAddress: actualLpTokenAddress || '0x0000000000000000000000000000000000000000', // Use extracted LP address
          createdAt: Date.now(),
          txHash: currentTxHash || '', // Use empty string if no hash (shouldn't happen)
          liquidityTokens: '0', // Will be updated when we can fetch real LP balance
          imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenInfo.address}&backgroundColor=10b981,3b82f6`
        }

        loggers.liquidity.info(' Pool object created:', newPool)

        // Save to localStorage with error handling
        try {
          const stored = localStorage.getItem(LIQUIDITY_STORAGE_KEY)
          const allPools = stored ? JSON.parse(stored) : []

          // Validate existing data
          if (!Array.isArray(allPools)) {
            loggers.liquidity.warn('Corrupted pools data, resetting...')
            localStorage.setItem(LIQUIDITY_STORAGE_KEY, JSON.stringify([newPool]))
          } else {
            allPools.push(newPool)
            localStorage.setItem(LIQUIDITY_STORAGE_KEY, JSON.stringify(allPools))
          }
        } catch (storageError) {
          loggers.liquidity.error('Error saving pool to localStorage:', storageError)
          // Still continue with the operation even if storage fails
        }

        setUserPools(prev => [...prev, newPool])

        // Also save LP token to separate storage for token selection
        if (actualLpTokenAddress && actualLpTokenAddress !== '0x0000000000000000000000000000000000000000') {
          saveLPTokenToStorage({
            address: actualLpTokenAddress,
            name: `${tokenInfo.symbol}/ETH LP`,
            symbol: `${tokenInfo.symbol}-ETH-LP`,
            poolAddress: actualLpTokenAddress,
            tokenA: tokenInfo.address,
            tokenB: getContracts().weth,
            tokenASymbol: tokenInfo.symbol,
            tokenBSymbol: 'ETH',
            createdAt: Date.now(),
            chainId,
            userAddress: userAddress as string,
            txHash: currentTxHash || ''
          })
        }

        loggers.liquidity.info(' CRITICAL: Setting lastSuccessfulPool - this should trigger success modal!', {
          poolBeingSet: newPool,
          poolId: newPool.id,
          txHash: newPool.txHash,
          lpTokenAddress: newPool.poolAddress,
          timestamp: new Date().toISOString()
        })

        setLastSuccessfulPool(newPool) // Set result immediately for success detection

        loggers.liquidity.success(' SUCCESS STATE SET! Clearing processing states...', {
          clearingCurrentStep: currentStep,
          clearingTokenToProcess: !!tokenToProcess,
          timestamp: new Date().toISOString()
        })

        // Clear processing states immediately
        setCurrentStep(null)
        setTokenToProcess(null)
        setError(null)
        setCurrentTxHash(undefined)
        setIsPreparingAddLiquidity(false) // FIX: Clear immediate loading state
      } else if (currentStep === 'remove_approve' && poolToRemove) {
        // LP token approval successful, now remove liquidity
        loggers.liquidity.success(' LP token approval confirmed! Proceeding to remove liquidity...', {
          poolToRemove: poolToRemove.poolAddress,
          liquidityTokens: poolToRemove.liquidityTokens,
          hash: currentTxHash
        })

        // CRITICAL: Reset currentTxHash before moving to next step
        setCurrentTxHash(undefined)
        setCurrentStep('remove_liquidity')

        // Use async pattern for remove liquidity step
        setTimeout(async () => {
          try {
            // Use the same LP amount logic as in removeLiquidity function
            let finalLpBalance: bigint
            if (poolToRemove.liquidityTokens) {
              finalLpBalance = parseUnits(poolToRemove.liquidityTokens, 18)
              loggers.liquidity.success(' Using stored LP amount from pool:', finalLpBalance.toString())
            } else {
              finalLpBalance = lpBalance || 0n
              loggers.liquidity.success(' Using blockchain LP balance:', finalLpBalance.toString())
            }

            await handleRemoveLiquidityStep(finalLpBalance)
          } catch (error) {
            loggers.liquidity.error('❌ Failed to remove liquidity:', error)
            setError(error instanceof Error ? error : new Error('Failed to remove liquidity'))
            setCurrentStep(null)
            setPoolToRemove(null)
            setIsPreparingRemoveLiquidity(false)
          }
        }, 1000) // Small delay to ensure state updates
      } else if (currentStep === 'remove_liquidity' && poolToRemove) {
        // Liquidity removed successfully
        loggers.liquidity.success(' Liquidity removal confirmed!', {
          poolId: poolToRemove.id,
          lpTokens: poolToRemove.liquidityTokens,
          hash: currentTxHash
        })

        // Only update localStorage for legacy pools (not direct withdrawals)
        if (!poolToRemove.id.startsWith('direct-')) {
          const stored = localStorage.getItem(LIQUIDITY_STORAGE_KEY)
          if (stored) {
            const allPools = JSON.parse(stored)
            const filteredPools = allPools.filter((pool: LiquidityPool) => pool.id !== poolToRemove.id)
            localStorage.setItem(LIQUIDITY_STORAGE_KEY, JSON.stringify(filteredPools))
          }
          setUserPools(prev => prev.filter(pool => pool.id !== poolToRemove.id))
        }

        // Set success state for toast notification
        setLastSuccessfulPool({
          ...poolToRemove,
          txHash: currentTxHash || 'completed'
        })

        // Clear processing states immediately
        setCurrentStep(null)
        setPoolToRemove(null)
        setError(null)
        setCurrentTxHash(undefined)
        setIsPreparingRemoveLiquidity(false) // FIX: Clear immediate loading state
      }
      resetWrite()
    }
  }, [isConfirmed, currentStep, tokenToProcess, poolToRemove, poolAddress])

  // ================================
  // MAIN PUBLIC FUNCTIONS
  // ================================
  const addLiquidity = async (
    tokenAddress: string,
    tokenName: string,
    tokenSymbol: string,
    tokenAmount: string,
    ethAmount: string
  ) => {
    if (!isConnected || !userAddress) {
      throw new Error('Please connect your wallet first')
    }

    // Check if DEX is available on current network
    const contracts = getContracts()
    if (!contracts.factory || !contracts.router) {
      const chainConfig = getChainById(chainId)
      const chainName = chainConfig?.name || 'this network'
      throw new Error(`⚠️ No DEX support available on ${chainName}. Please switch to a network with liquidity support (Ethereum, Base, Arbitrum, Polygon, BSC, etc.) to add liquidity.`)
    }

    if (!tokenAddress || !tokenAmount || !ethAmount) {
      throw new Error('Please provide token address, token amount, and ETH amount')
    }

    const tokenAmountNum = parseFloat(tokenAmount)
    const ethAmountNum = parseFloat(ethAmount)

    if (tokenAmountNum <= 0 || ethAmountNum <= 0) {
      throw new Error('Token amount and ETH amount must be greater than 0')
    }

    // Clear any previous errors and states
    setError(null)
    setCurrentStep(null) // Reset any previous step
    setLastSuccessfulPool(null) // Reset completion state like token hook
    setCurrentTxHash(undefined)
    resetWrite() // Reset wagmi state

    // FIX: Set immediate loading state for better UX
    setIsPreparingAddLiquidity(true)

    const tokenProcessInfo = {
      address: tokenAddress,
      name: tokenName,
      symbol: tokenSymbol,
      tokenAmount,
      ethAmount
    }

    setTokenToProcess(tokenProcessInfo)

    try {
      loggers.liquidity.debug(' Starting liquidity addition process...', {
        tokenAddress: tokenProcessInfo.address,
        chainId,
        isTestnet: chainId === baseSepolia.id,
        contracts: getContracts()
      })

      // Wait for token decimals to load if still loading
      if (decimalsLoading) {
        loggers.liquidity.debug('Waiting for token decimals to load...')
        // Try manual refetch first
        await refetchDecimals()

        // Wait up to 10 seconds for decimals to load
        for (let i = 0; i < 100; i++) {
          await new Promise(resolve => setTimeout(resolve, 100))
          if (!decimalsLoading && (tokenDecimals !== undefined || decimalsError)) break
        }
      }

      loggers.liquidity.info('Token decimals query result:', {
        tokenDecimals,
        decimalsError: decimalsError?.message,
        decimalsLoading,
        tokenAddress: tokenProcessInfo.address
      })

      if (decimalsError) {
        loggers.liquidity.error('❌ Token decimals error:', decimalsError)
        // Try alternative approach - use publicClient directly
        try {
          const directDecimals = await publicClient?.readContract({
            address: tokenProcessInfo.address as `0x${string}`,
            abi: [{
              "inputs": [],
              "name": "decimals",
              "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
              "stateMutability": "view",
              "type": "function"
            }],
            functionName: 'decimals'
          })
          loggers.liquidity.success(' Direct decimals fetch successful:', directDecimals)
          if (directDecimals !== undefined) {
            // Use direct result instead of hook result
            const finalDecimals = Number(directDecimals)
            loggers.liquidity.success(' Using direct decimals result:', finalDecimals)

            const tokenAmountWei = parseUnits(tokenAmount, finalDecimals)

            // Check current allowance
            await refetchAllowance()
            const currentAllowance = (allowance as bigint) || 0n

            if (currentAllowance < tokenAmountWei) {
              loggers.liquidity.info('Insufficient allowance, requesting approval...', {
                current: currentAllowance.toString(),
                needed: tokenAmountWei.toString()
              })
              setCurrentStep('approve')
              await handleApproveToken(tokenProcessInfo)
            } else {
              loggers.liquidity.success(' Token already approved, adding liquidity directly...')
              setCurrentStep('add')
              await handleAddLiquidityStep(tokenProcessInfo)
            }
            return // Exit the function successfully
          } else {
            throw new Error(`Failed to read token contract: ${decimalsError.message || 'Invalid token address or network error'}`)
          }
        } catch (directError) {
          loggers.liquidity.error('❌ Direct fetch also failed:', directError)
          throw new Error(`Failed to read token contract: ${decimalsError.message || 'Invalid token address or network error'}`)
        }
      }

      const finalDecimals = tokenDecimals ?? 18 // Default to 18 if still undefined
      if (finalDecimals === undefined) {
        throw new Error('Could not fetch token decimals. Please verify the token address is correct and you are on the right network.')
      }

      loggers.liquidity.success(' Token decimals loaded:', finalDecimals)

      const tokenAmountWei = parseUnits(tokenAmount, finalDecimals)

      // Check current allowance
      await refetchAllowance()
      const currentAllowance = (allowance as bigint) || 0n

      if (currentAllowance < tokenAmountWei) {
        // Need approval first
        loggers.liquidity.info('Insufficient allowance, requesting approval...', {
          current: currentAllowance.toString(),
          needed: tokenAmountWei.toString()
        })
        setCurrentStep('approve')

        // SIMPLIFIED: Let wagmi handle errors, just await the transaction
        await handleApproveToken(tokenProcessInfo)
        loggers.liquidity.success(' Approval transaction initiated - waiting for confirmation...')
        // Transaction confirmation will be handled in useEffect
      } else {
        // Already approved, add liquidity directly
        loggers.liquidity.success(' Token already approved, adding liquidity directly...')
        setCurrentStep('add')

        // SIMPLIFIED: Let wagmi handle errors, just await the transaction
        await handleAddLiquidityStep(tokenProcessInfo)
        loggers.liquidity.success(' Add liquidity transaction initiated - waiting for confirmation...')
        // Transaction confirmation will be handled in useEffect
      }
    } catch (e) {
      // Only handle unexpected errors here, wagmi handles transaction errors
      if (!(e instanceof Error && (e.message.includes('User rejected') || e.message.includes('ACTION_REJECTED')))) {
        setError(e instanceof Error ? e : new Error('Unknown error occurred'))
      }
      setCurrentStep(null)
      setTokenToProcess(null)
      setCurrentTxHash(undefined)
      setIsPreparingAddLiquidity(false) // FIX: Clear loading state on error
      throw e
    }
  }

  const removeLiquidity = async (poolIdOrLpToken: string, lpAmount?: string) => {
    if (!isConnected || !userAddress) {
      throw new Error('Please connect your wallet first')
    }

    // Check if DEX is available on current network
    const contracts = getContracts()
    if (!contracts.factory || !contracts.router) {
      const chainConfig = getChainById(chainId)
      const chainName = chainConfig?.name || 'this network'
      throw new Error(`⚠️ No DEX support available on ${chainName}. Please switch to a network with liquidity support (Ethereum, Base, Arbitrum, Polygon, BSC, etc.) to add liquidity.`)
    }

    setError(null)
    setLastSuccessfulPool(null) // Reset completion state
    setCurrentTxHash(undefined)

    // FIX: Set immediate loading state for better UX
    setIsPreparingRemoveLiquidity(true)

    let pool: LiquidityPool | null | undefined = null
    let lpTokenAddress: string
    let lpTokenBalance: bigint = 0n

    if (lpAmount) {
      // New mode: LP token address and amount provided directly
      lpTokenAddress = poolIdOrLpToken
      loggers.liquidity.info(' Direct LP token withdrawal:', { lpTokenAddress, lpAmount })

      // Parse the LP amount first
      try {
        lpTokenBalance = parseUnits(lpAmount, 18) // LP tokens typically have 18 decimals
      } catch (error) {
        throw new Error('Invalid LP token amount')
      }

      // Fetch token addresses from LP token contract
      loggers.liquidity.debug(' Fetching token addresses from LP token contract...')
      let token0Address: string
      let token1Address: string

      try {
        const [token0, token1] = await Promise.all([
          publicClient?.readContract({
            address: lpTokenAddress as `0x${string}`,
            abi: [{
              "inputs": [],
              "name": "token0",
              "outputs": [{"internalType": "address", "name": "", "type": "address"}],
              "stateMutability": "view",
              "type": "function"
            }],
            functionName: 'token0'
          }),
          publicClient?.readContract({
            address: lpTokenAddress as `0x${string}`,
            abi: [{
              "inputs": [],
              "name": "token1",
              "outputs": [{"internalType": "address", "name": "", "type": "address"}],
              "stateMutability": "view",
              "type": "function"
            }],
            functionName: 'token1'
          })
        ])

        token0Address = token0 as string
        token1Address = token1 as string

        loggers.liquidity.success(' LP Token composition:', {
          token0: token0Address,
          token1: token1Address,
          wethAddress: getContracts().weth
        })
      } catch (error) {
        loggers.liquidity.error('❌ Failed to fetch token addresses from LP token:', error)
        throw new Error('Invalid LP token - unable to fetch token composition')
      }

      // Determine which token is the ERC20 token (not WETH)
      const wethAddress = getContracts().weth
      const actualTokenAddress = token0Address === wethAddress ? token1Address : token0Address

      loggers.liquidity.debug(' Fetching real token details for:', actualTokenAddress)

      // Fetch real token name and symbol
      let realTokenName = 'Unknown Token'
      let realTokenSymbol = 'UNKNOWN'

      try {
        const [tokenName, tokenSymbol] = await Promise.all([
          publicClient?.readContract({
            address: actualTokenAddress as `0x${string}`,
            abi: [
              {
                name: 'name',
                type: 'function',
                stateMutability: 'view',
                inputs: [],
                outputs: [{ name: '', type: 'string' }]
              }
            ],
            functionName: 'name'
          }),
          publicClient?.readContract({
            address: actualTokenAddress as `0x${string}`,
            abi: [
              {
                name: 'symbol',
                type: 'function',
                stateMutability: 'view',
                inputs: [],
                outputs: [{ name: '', type: 'string' }]
              }
            ],
            functionName: 'symbol'
          })
        ])

        realTokenName = (tokenName as string) || 'Unknown Token'
        realTokenSymbol = (tokenSymbol as string) || 'UNKNOWN'

        loggers.liquidity.success(' Fetched real token details:', {
          address: actualTokenAddress,
          name: realTokenName,
          symbol: realTokenSymbol
        })
      } catch (error) {
        loggers.liquidity.warn('⚠️ Could not fetch token details, using defaults:', error)
      }

      // Create a temporary pool object for the removal process
      pool = {
        id: `direct-${lpTokenAddress}`,
        tokenAddress: actualTokenAddress, // Now we have the real token address!
        tokenName: realTokenName, // Real token name from contract
        tokenSymbol: realTokenSymbol, // Real token symbol from contract
        tokenAmount: '0',
        ethAmount: '0',
        poolAddress: lpTokenAddress, // The LP token IS the pool address for removal
        createdAt: Date.now(),
        txHash: '',
        liquidityTokens: lpAmount
      }

      loggers.liquidity.success(' Temporary pool object created:', pool)
    } else {
      // Legacy mode: Find pool by ID
      pool = userPools.find(p => p.id === poolIdOrLpToken)
      if (!pool) {
        throw new Error('Pool not found')
      }

      // Check if this pool needs real LP address resolution
      if (pool.poolAddress.startsWith('MIGRATION_') || pool.poolAddress === pool.txHash) {
        loggers.liquidity.info(' Pool has temporary LP address, trying to resolve real LP address...')

        // Try to get the real LP token address from Uniswap V2 factory
        try {
          const realLpAddress = await publicClient?.readContract({
            address: getContracts().factory as `0x${string}`,
            abi: FACTORY_ABI,
            functionName: 'getPair',
            args: [pool.tokenAddress as `0x${string}`, getContracts().weth as `0x${string}`]
          })

          if (realLpAddress && realLpAddress !== '0x0000000000000000000000000000000000000000') {
            loggers.liquidity.success(' Found real LP address:', realLpAddress)
            lpTokenAddress = realLpAddress

            // Update the pool in storage with real LP address
            try {
              const stored = localStorage.getItem(LIQUIDITY_STORAGE_KEY)
              if (stored) {
                const allPools = JSON.parse(stored)
                const updatedPools = allPools.map((p: any) => {
                  if (p.id === pool?.id) {
                    return { ...p, poolAddress: realLpAddress }
                  }
                  return p
                })
                localStorage.setItem(LIQUIDITY_STORAGE_KEY, JSON.stringify(updatedPools))
                loggers.liquidity.success(' Updated pool with real LP address in storage')
              }
            } catch (updateError) {
              loggers.liquidity.error('Error updating pool in storage:', updateError)
            }
          } else {
            throw new Error('No liquidity pool exists for this token pair')
          }
        } catch (queryError) {
          loggers.liquidity.error('Failed to query real LP address:', queryError)
          throw new Error('Could not find the liquidity pool for this token. The pool may not exist or you may have already removed all liquidity.')
        }
      } else {
        lpTokenAddress = pool.poolAddress
      }
    }

    setPoolToRemove(pool)

    try {
      let finalLpBalance: bigint

      if (lpAmount) {
        // Use the provided LP amount directly
        finalLpBalance = lpTokenBalance
        loggers.liquidity.success(' Using provided LP amount:', finalLpBalance.toString())
      } else {
        // Wait for LP balance to load from blockchain
        await refetchLpBalance()

        if (!lpBalance || lpBalance === 0n) {
          throw new Error('No LP tokens found for this pool. You may have already removed all liquidity.')
        }

        finalLpBalance = lpBalance
        loggers.liquidity.success(' LP Balance loaded from blockchain:', finalLpBalance.toString())
      }

      // Check current LP allowance
      await refetchLpAllowance()
      const currentLpAllowance = (lpAllowance as bigint) || 0n

      if (currentLpAllowance < finalLpBalance) {
        // Need LP approval first
        loggers.liquidity.info('Insufficient LP allowance, requesting approval...', {
          current: currentLpAllowance.toString(),
          needed: finalLpBalance.toString()
        })
        setCurrentStep('remove_approve')

        // SIMPLIFIED: Let wagmi handle errors, just await the transaction
        await handleApproveLpToken(finalLpBalance, pool)
        loggers.liquidity.success(' LP approval transaction initiated - waiting for confirmation...')
        // Transaction confirmation will be handled in useEffect
      } else {
        // Already approved, remove liquidity directly
        loggers.liquidity.success(' LP tokens already approved, removing liquidity directly...')
        setCurrentStep('remove_liquidity')

        // SIMPLIFIED: Let wagmi handle errors, just await the transaction
        await handleRemoveLiquidityStep(finalLpBalance)
        loggers.liquidity.success(' Remove liquidity transaction initiated - waiting for confirmation...')
        // Transaction confirmation will be handled in useEffect
      }
    } catch (e) {
      // Only handle unexpected errors here, wagmi handles transaction errors
      if (!(e instanceof Error && (e.message.includes('User rejected') || e.message.includes('ACTION_REJECTED')))) {
        setError(e instanceof Error ? e : new Error('Unknown error occurred'))
      }
      setCurrentStep(null)
      setPoolToRemove(null)
      setCurrentTxHash(undefined)
      setIsPreparingRemoveLiquidity(false) // FIX: Clear loading state on error
      throw e
    }
  }

  const clearSuccessState = () => {
    setLastSuccessfulPool(null)
  }

  const contracts = getContracts()
  const isV2Available = contracts.hasV2Support || false
  const chainConfig = getChainById(chainId)

  // Manual reset function for emergency use
  const resetLoadingStates = () => {
    setCurrentStep(null)
    setTokenToProcess(null)
    setPoolToRemove(null)
    setError(null)
    setLastSuccessfulPool(null)
    setCurrentTxHash(undefined)
    setIsPreparingAddLiquidity(false) // FIX: Clear immediate loading states
    setIsPreparingRemoveLiquidity(false)
    resetWrite() // Clear wagmi state
  }

  return {
    addLiquidity,
    removeLiquidity,
    isAddingLiquidity: isPreparingAddLiquidity || isWritePending || isConfirming, // FIX: Include immediate loading state
    isRemovingLiquidity: isPreparingRemoveLiquidity || isWritePending || isConfirming, // FIX: Include immediate loading state
    isSuccess: !!lastSuccessfulPool, // SUCCESS DETECTION: Based on result like token creation
    userPools,
    refetchPools,
    error,
    isConnected,
    isCorrectChain: chainConfig?.features.tokenDeployment || false, // Use chain config to check if chain is supported
    isV2Available, // New: indicates if DEX contracts are available on current network
    chainId,
    transactionHash: currentTxHash,
    currentStep,
    contracts,
    poolExists,
    poolAddress: poolAddress || null,
    lastSuccessfulPool, // Pool info for success modal
    clearSuccessState, // Function to clear success state
    resetLoadingStates // Emergency reset function
  }
}
