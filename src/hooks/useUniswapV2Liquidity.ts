import { useState, useEffect } from 'react'
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from 'wagmi'
import { parseUnits, parseEther, formatUnits } from 'viem'
import { getDexContracts, getWethAddress, getChainById, hasUniswapV2 } from '../config/chains'
import { TIMEOUTS, RETRY_CONFIG, STORAGE_KEYS } from '../config/constants'
import { loggers } from '../utils/logger'

// Uniswap V2 Router ABI
const ROUTER_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "amountTokenDesired", "type": "uint256"},
      {"internalType": "uint256", "name": "amountTokenMin", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETHMin", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "addLiquidityETH",
    "outputs": [
      {"internalType": "uint256", "name": "amountToken", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETH", "type": "uint256"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"}
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"},
      {"internalType": "uint256", "name": "amountTokenMin", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETHMin", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "removeLiquidityETH",
    "outputs": [
      {"internalType": "uint256", "name": "amountToken", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETH", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Uniswap V2 Factory ABI
const FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"}
    ],
    "name": "getPair",
    "outputs": [
      {"internalType": "address", "name": "pair", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"}
    ],
    "name": "createPair",
    "outputs": [
      {"internalType": "address", "name": "pair", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// LP Token ABI for balance and approval checks
const LP_TOKEN_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token0",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ERC20 Token ABI for approvals
const ERC20_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {"internalType": "uint8", "name": "", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface LiquidityPool {
  id: string
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  tokenAmount: string
  ethAmount: string
  poolAddress: string
  createdAt: number
  txHash: string
  liquidityTokens?: string
  imageUrl?: string
}

const LIQUIDITY_STORAGE_KEY = 'baseTokenCreator_uniswapV2Pools'
const LP_TOKENS_STORAGE_KEY = 'baseTokenCreator_lpTokens'

export interface LPToken {
  address: string
  name: string
  symbol: string
  poolAddress: string
  tokenA: string
  tokenB: string
  tokenASymbol: string
  tokenBSymbol: string
  createdAt: number
  chainId: number
  userAddress: string
  txHash: string
}

export function useUniswapV2Liquidity() {
  // ================================
  // CORE SETUP & STATE MANAGEMENT
  // ================================
  const { address: userAddress, isConnected } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  
  // Core state
  const [userPools, setUserPools] = useState<LiquidityPool[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [lastSuccessfulPool, setLastSuccessfulPool] = useState<LiquidityPool | null>(null)
  
  // Transaction flow state
  const [currentStep, setCurrentStep] = useState<'approve' | 'add' | 'remove_approve' | 'remove_liquidity' | null>(null)
  const [poolToRemove, setPoolToRemove] = useState<LiquidityPool | null>(null)
  const [tokenToProcess, setTokenToProcess] = useState<{
    address: string
    name: string
    symbol: string
    tokenAmount: string
    ethAmount: string
  } | null>(null)
  
  // Immediate loading states for better UX
  const [isPreparingAddLiquidity, setIsPreparingAddLiquidity] = useState(false)
  const [isPreparingRemoveLiquidity, setIsPreparingRemoveLiquidity] = useState(false)

  // ================================
  // CONTRACT CONFIGURATION
  // ================================
  const getContracts = () => {
    const dexContracts = getDexContracts(chainId)
    const weth = getWethAddress(chainId)
    const chainConfig = getChainById(chainId)

    // Try to get Uniswap V2 contracts first (most common)
    // If not available, try other DEX protocols
    let factory = null
    let router = null

    if (dexContracts) {
      // Try Uniswap V2 first
      if (dexContracts.uniswapV2Factory && dexContracts.uniswapV2Router) {
        factory = dexContracts.uniswapV2Factory
        router = dexContracts.uniswapV2Router
      }
      // Fallback to PancakeSwap (BSC)
      else if (dexContracts.pancakeswapFactory && dexContracts.pancakeswapRouter) {
        factory = dexContracts.pancakeswapFactory
        router = dexContracts.pancakeswapRouter
      }
      // Fallback to QuickSwap (Polygon)
      else if (dexContracts.quickswapFactory && dexContracts.quickswapRouter) {
        factory = dexContracts.quickswapFactory
        router = dexContracts.quickswapRouter
      }
      // Fallback to Trader Joe (Avalanche)
      else if (dexContracts.traderJoeFactory && dexContracts.traderJoeRouter) {
        factory = dexContracts.traderJoeFactory
        router = dexContracts.traderJoeRouter
      }
      // Fallback to SpookySwap (Fantom)
      else if (dexContracts.spookyswapFactory && dexContracts.spookyswapRouter) {
        factory = dexContracts.spookyswapFactory
        router = dexContracts.spookyswapRouter
      }
      // Fallback to SushiSwap (multiple chains)
      else if (dexContracts.sushiswapFactory && dexContracts.sushiswapRouter) {
        factory = dexContracts.sushiswapFactory
        router = dexContracts.sushiswapRouter
      }
    }

    return {
      factory,
      router,
      weth,
      chainName: chainConfig?.name || 'Unknown Network',
      hasV2Support: !!factory && !!router,
    }
  }

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

  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenToProcess?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress && tokenToProcess && getContracts().router ? [userAddress, getContracts().router as `0x${string}`] : undefined,
    query: {
      enabled: !!(userAddress && tokenToProcess?.address && getContracts().router)
    }
  })

  // Check if pool exists
  const { data: poolAddress } = useReadContract({
    address: getContracts().factory as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'getPair',
    args: tokenToProcess && getContracts().factory ? [tokenToProcess.address as `0x${string}`, getContracts().weth as `0x${string}`] : undefined,
    query: {
      enabled: !!(tokenToProcess?.address && getContracts().factory)
    }
  })

  // Check LP token balance for removal
  const { data: lpBalance, refetch: refetchLpBalance } = useReadContract({
    address: poolToRemove?.poolAddress as `0x${string}`,
    abi: LP_TOKEN_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!(userAddress && poolToRemove?.poolAddress && poolToRemove.poolAddress !== '0x0000000000000000000000000000000000000000')
    }
  })

  // Check LP token allowance for removal
  const { data: lpAllowance, refetch: refetchLpAllowance } = useReadContract({
    address: poolToRemove?.poolAddress as `0x${string}`,
    abi: LP_TOKEN_ABI,
    functionName: 'allowance',
    args: userAddress && poolToRemove && getContracts().router ? [userAddress, getContracts().router as `0x${string}`] : undefined,
    query: {
      enabled: !!(userAddress && poolToRemove?.poolAddress && poolToRemove.poolAddress !== '0x0000000000000000000000000000000000000000' && getContracts().router)
    }
  })

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

  // Get token decimals
  const { data: tokenDecimals, error: decimalsError, isLoading: decimalsLoading, refetch: refetchDecimals } = useReadContract({
    address: tokenToProcess?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenToProcess?.address,
      retry: 5,
      retryDelay: TIMEOUTS.TRANSACTION_RETRY_DELAY,
      staleTime: TIMEOUTS.QUERY_STALE_TIME // 5 minutes
    }
  })

  // Save LP token to localStorage for token selection
  const saveLPTokenToStorage = (lpToken: LPToken) => {
    try {
      const stored = localStorage.getItem(LP_TOKENS_STORAGE_KEY)
      const allLPTokens: LPToken[] = stored ? JSON.parse(stored) : []
      
      // Check if LP token already exists (avoid duplicates)
      const existingIndex = allLPTokens.findIndex(token => 
        token.address.toLowerCase() === lpToken.address.toLowerCase() &&
        token.userAddress.toLowerCase() === lpToken.userAddress.toLowerCase()
      )
      
      if (existingIndex === -1) {
        allLPTokens.push(lpToken)
        localStorage.setItem(LP_TOKENS_STORAGE_KEY, JSON.stringify(allLPTokens))
        loggers.liquidity.success(' LP token saved to storage for token selection:', lpToken)
      } else {
        loggers.liquidity.info(' LP token already exists in storage:', lpToken.address)
      }
    } catch (error) {
      loggers.liquidity.error('Error saving LP token to localStorage:', error)
    }
  }

  // Load user's liquidity pools and migrate existing ones
  useEffect(() => {
    if (!userAddress) return
    
    try {
      const stored = localStorage.getItem(LIQUIDITY_STORAGE_KEY)
      if (stored) {
        const allPools = JSON.parse(stored)
        
        // Validate data structure
        if (!Array.isArray(allPools)) {
          loggers.liquidity.warn('Invalid pools data structure in useEffect, clearing localStorage')
          localStorage.removeItem(LIQUIDITY_STORAGE_KEY)
          setUserPools([])
          return
        }
        
        let userCreatedPools = allPools.filter((pool: any) => 
          pool && 
          typeof pool === 'object' && 
          pool.id && 
          pool.id.includes(userAddress.toLowerCase())
        )
        
        // MIGRATION: Fix existing pools with invalid LP token addresses
        let needsPoolUpdate = false
        userCreatedPools = userCreatedPools.map((pool: LiquidityPool) => {
          if (pool.poolAddress === '0x0000000000000000000000000000000000000000' || !pool.poolAddress) {
            loggers.liquidity.info(' Migrating pool with invalid LP address:', pool.id)
            needsPoolUpdate = true
            
            // Try to derive LP token address from Uniswap V2 factory
            // For existing pools, we'll use the transaction hash as a fallback
            const migratedPool = {
              ...pool,
              poolAddress: pool.txHash || `MIGRATION_${pool.tokenAddress}_${pool.createdAt}` // Temporary until we can query real address
            }
            
            // Also add to LP token storage for withdraw modal
            saveLPTokenToStorage({
              address: migratedPool.poolAddress,
              name: `${pool.tokenSymbol}/ETH LP`,
              symbol: `${pool.tokenSymbol}-ETH-LP`,
              poolAddress: migratedPool.poolAddress,
              tokenA: pool.tokenAddress,
              tokenB: getContracts().weth,
              tokenASymbol: pool.tokenSymbol,
              tokenBSymbol: 'ETH',
              createdAt: pool.createdAt,
              chainId,
              userAddress: userAddress as string,
              txHash: pool.txHash
            })
            
            return migratedPool
          }
          
          // For pools with valid LP addresses, ensure they're in LP token storage
          saveLPTokenToStorage({
            address: pool.poolAddress,
            name: `${pool.tokenSymbol}/ETH LP`,
            symbol: `${pool.tokenSymbol}-ETH-LP`,
            poolAddress: pool.poolAddress,
            tokenA: pool.tokenAddress,
            tokenB: getContracts().weth,
            tokenASymbol: pool.tokenSymbol,
            tokenBSymbol: 'ETH',
            createdAt: pool.createdAt,
            chainId,
            userAddress: userAddress as string,
            txHash: pool.txHash
          })
          
          return pool
        })
        
        // Update localStorage if migration was needed
        if (needsPoolUpdate) {
          const updatedAllPools = allPools.map((pool: any) => {
            const updated = userCreatedPools.find((up: any) => up.id === pool.id)
            return updated || pool
          })
          localStorage.setItem(LIQUIDITY_STORAGE_KEY, JSON.stringify(updatedAllPools))
          loggers.liquidity.success(' Migrated pools with invalid LP addresses')
        }
        
        setUserPools(userCreatedPools)
      }
    } catch (error) {
      loggers.liquidity.error('Error loading liquidity pools in useEffect:', error)
      // Clear corrupted data
      try {
        localStorage.removeItem(LIQUIDITY_STORAGE_KEY)
      } catch (clearError) {
        loggers.liquidity.error('Error clearing localStorage in useEffect:', clearError)
      }
      setUserPools([])
    }
  }, [userAddress, chainId])

  // Monitor transaction hash
  useEffect(() => {
    if (currentTxHash) {
      const isTestnet = chainId === baseSepolia.id
      const baseUrl = isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org'
      console.log(`🔗 Transaction submitted! View on explorer: ${baseUrl}/tx/${currentTxHash}`)
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


  // SIMPLIFIED: Handle token approval using wagmi async pattern
  const handleApproveToken = async (tokenInfo: { address: string; tokenAmount: string }) => {
    const finalDecimals = tokenDecimals ?? 18
    const tokenAmountWei = parseUnits(tokenInfo.tokenAmount, finalDecimals)

    console.log('🔑 Approving token for Uniswap V2 Router...', {
      token: tokenInfo.address,
      amount: tokenAmountWei.toString(),
      router: getContracts().router,
      decimals: finalDecimals
    })
    
    // wagmi handles errors automatically via mutation callback
    const hash = await writeContractAsync({
      address: tokenInfo.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [getContracts().router as `0x${string}`, tokenAmountWei],
    })
    
    setCurrentTxHash(hash)
    return hash
  }

  // SIMPLIFIED: Handle add liquidity using wagmi async pattern
  const handleAddLiquidityStep = async (tokenInfo: { address: string; tokenAmount: string; ethAmount: string }) => {
    const finalDecimals = tokenDecimals ?? 18
    const tokenAmountWei = parseUnits(tokenInfo.tokenAmount, finalDecimals)
    const ethAmountWei = parseEther(tokenInfo.ethAmount)
    
    // Set minimum amounts to 95% of desired amounts for slippage protection
    const amountTokenMin = (tokenAmountWei * 95n) / 100n
    const amountETHMin = (ethAmountWei * 95n) / 100n
    
    // Set deadline to 20 minutes from now
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200)

    // CRITICAL: Check current allowance before attempting add liquidity
    
    // FORCE a fresh read from blockchain instead of using cached allowance
    let actualOnChainAllowance: bigint
    try {
      actualOnChainAllowance = await publicClient!.readContract({
        address: tokenInfo.address as `0x${string}`,
        abi: [{
          "inputs": [
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "address", "name": "spender", "type": "address"}
          ],
          "name": "allowance",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }],
        functionName: 'allowance',
        args: [userAddress as `0x${string}`, getContracts().router as `0x${string}`]
      }) as bigint
    } catch (error) {
      loggers.liquidity.error('❌ Failed to read on-chain allowance:', error)
      throw new Error('Failed to verify token allowance. Please try again.')
    }

    const cachedAllowance = (allowance as bigint) || 0n
    const routerAddress = getContracts().router
    
    loggers.liquidity.info(' Adding liquidity to Uniswap V2...', {
      token: tokenInfo.address,
      tokenAmount: tokenInfo.tokenAmount,
      ethAmount: tokenInfo.ethAmount,
      tokenAmountWei: tokenAmountWei.toString(),
      ethAmountWei: ethAmountWei.toString(),
      amountTokenMin: amountTokenMin.toString(),
      amountETHMin: amountETHMin.toString(),
      deadline: deadline.toString(),
      recipient: userAddress,
      router: routerAddress,
      cachedAllowance: cachedAllowance.toString(),
      actualOnChainAllowance: actualOnChainAllowance.toString(),
      allowanceMatch: cachedAllowance === actualOnChainAllowance,
      allowanceIsSufficient: actualOnChainAllowance >= tokenAmountWei
    })

    if (actualOnChainAllowance < tokenAmountWei) {
      throw new Error(`❌ CRITICAL: On-chain allowance is insufficient! 
        Cached: ${cachedAllowance.toString()}
        Actual: ${actualOnChainAllowance.toString()}
        Needed: ${tokenAmountWei.toString()}
        This will cause TransferHelper to fail.`)
    }

    // CRITICAL: Check your actual token balance!
    let actualTokenBalance: bigint
    try {
      actualTokenBalance = await publicClient!.readContract({
        address: tokenInfo.address as `0x${string}`,
        abi: [{
          "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        }],
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`]
      }) as bigint
    } catch (error) {
      loggers.liquidity.error('❌ Failed to read token balance:', error)
      throw new Error('Failed to verify token balance. Please try again.')
    }

    loggers.liquidity.debug(' TOKEN BALANCE CHECK:', {
      tokenBalance: actualTokenBalance.toString(),
      amountNeeded: tokenAmountWei.toString(),
      hasEnoughTokens: actualTokenBalance >= tokenAmountWei,
      balanceInHumanForm: (Number(actualTokenBalance) / 1e18).toLocaleString()
    })

    if (actualTokenBalance < tokenAmountWei) {
      throw new Error(`❌ CRITICAL: You don't have enough tokens! 
        Your balance: ${actualTokenBalance.toString()} (${(Number(actualTokenBalance) / 1e18).toLocaleString()})
        Trying to use: ${tokenAmountWei.toString()} (${(Number(tokenAmountWei) / 1e18).toLocaleString()})
        This will cause TransferHelper to fail.`)
    }

    // CRITICAL: Test if the token can be transferred at all
    try {
      // Test a very small transfer to the router to see if it works
      const testAmount = 1000000000000000000n // 1 token
      const transferSimulation = await publicClient!.simulateContract({
        address: tokenInfo.address as `0x${string}`,
        abi: [{
          "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
          ],
          "name": "transfer",
          "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
          "stateMutability": "nonpayable",
          "type": "function"
        }],
        functionName: 'transfer',
        args: [getContracts().router as `0x${string}`, testAmount],
        account: userAddress as `0x${string}`
      })
      
      loggers.liquidity.success(' Direct transfer simulation successful - token can be transferred')
    } catch (transferError: any) {
      loggers.liquidity.error('❌ DIRECT TRANSFER TEST FAILED:', {
        error: transferError,
        reason: transferError.reason || transferError.shortMessage,
        message: transferError.message
      })
      
      throw new Error(`❌ CRITICAL: Your token contract cannot transfer tokens! 
        Error: ${transferError.reason || transferError.shortMessage}
        This suggests there's an issue with your token contract implementation.
        Even direct transfers are failing, so the problem is with the token itself, not Uniswap.`)
    }

    // CRITICAL: Simulate the transaction first to get detailed error info
    try {
      const simulationResult = await publicClient!.simulateContract({
        address: getContracts().router as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'addLiquidityETH',
        args: [
          tokenInfo.address as `0x${string}`,
          tokenAmountWei,
          amountTokenMin,
          amountETHMin,
          userAddress as `0x${string}`,
          deadline
        ],
        value: ethAmountWei,
        account: userAddress as `0x${string}`
      })
      
      loggers.liquidity.success(' SIMULATION SUCCESSFUL:', {
        result: simulationResult.result,
        request: simulationResult.request
      })
    } catch (simulationError: any) {
      loggers.liquidity.error('❌ SIMULATION FAILED - DETAILED ERROR:', {
        error: simulationError,
        message: simulationError.message,
        cause: simulationError.cause,
        details: simulationError.details,
        data: simulationError.data,
        shortMessage: simulationError.shortMessage,
        version: simulationError.version
      })
      
      // Try to extract more detailed error information
      if (simulationError.cause) {
        loggers.liquidity.error('❌ SIMULATION ERROR CAUSE:', simulationError.cause)
      }
      
      // Check if it's a revert with reason
      if (simulationError.data) {
        loggers.liquidity.error('❌ SIMULATION ERROR DATA:', simulationError.data)
      }
      
      throw new Error(`❌ Transaction simulation failed: ${simulationError.shortMessage || simulationError.message}. 
        This tells us exactly why the transaction would fail before sending it.
        Check console for detailed error analysis.`)
    }

    // If simulation passes, proceed with actual transaction
    loggers.liquidity.success(' Simulation passed, sending actual transaction...')
    const hash = await writeContractAsync({
      address: getContracts().router as `0x${string}`,
      abi: ROUTER_ABI,
      functionName: 'addLiquidityETH',
      args: [
        tokenInfo.address as `0x${string}`,
        tokenAmountWei,
        amountTokenMin,
        amountETHMin,
        userAddress as `0x${string}`,
        deadline
      ],
      value: ethAmountWei,
    })
      
    setCurrentTxHash(hash)
    return hash
  }

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
        console.log('⏳ Waiting for token decimals to load...')
        // Try manual refetch first
        await refetchDecimals()
        
        // Wait up to 10 seconds for decimals to load
        for (let i = 0; i < 100; i++) {
          await new Promise(resolve => setTimeout(resolve, 100))
          if (!decimalsLoading && (tokenDecimals !== undefined || decimalsError)) break
        }
      }
      
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
            abi: ERC20_ABI,
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
              console.log('❌ Insufficient allowance, requesting approval...', {
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
        console.log('❌ Insufficient allowance, requesting approval...', {
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

  // SIMPLIFIED: Handle LP token approval using wagmi async pattern
  const handleApproveLpToken = async (lpAmount: bigint, pool: LiquidityPool) => {
    const contracts = getContracts()
    console.log('🔑 Approving LP tokens for Uniswap V2 Router...', {
      lpToken: pool.poolAddress,
      amount: lpAmount.toString(),
      router: contracts.router
    })
    
    // Let wagmi handle gas estimation automatically
    const hash = await writeContractAsync({
      address: pool.poolAddress as `0x${string}`,
      abi: LP_TOKEN_ABI,
      functionName: 'approve',
      args: [contracts.router as `0x${string}`, lpAmount],
    })
    
    setCurrentTxHash(hash)
    return hash
  }

  // SIMPLIFIED: Handle remove liquidity using wagmi async pattern
  const handleRemoveLiquidityStep = async (lpAmount: bigint) => {
    // FIX: Calculate proper minimum amounts based on LP amount and pool reserves
    // Use 95% of expected output to allow for 5% slippage
    let amountTokenMin: bigint
    let amountETHMin: bigint
    
    try {
      // Get total supply of LP tokens
      const totalSupply = await publicClient?.readContract({
        address: poolToRemove!.poolAddress as `0x${string}`,
        abi: LP_TOKEN_ABI,
        functionName: 'totalSupply'
      })
      
      // Get pool reserves
      const token0 = await publicClient?.readContract({
        address: poolToRemove!.poolAddress as `0x${string}`,
        abi: LP_TOKEN_ABI,
        functionName: 'token0'
      })
      
      loggers.liquidity.debug(' CALCULATING MINIMUM AMOUNTS:', {
        lpAmount: lpAmount.toString(),
        totalSupply: totalSupply?.toString(),
        token0,
        tokenAddress: poolToRemove?.tokenAddress,
        wethAddress: getContracts().weth
      })
      
      if (totalSupply && (totalSupply as bigint) > 0n) {
        // Calculate proportional share: (lpAmount / totalSupply)
        const shareRatio = (lpAmount * 10000n) / (totalSupply as bigint) // Use basis points for precision
        
        // Estimate minimum amounts as 95% of proportional share
        // For small amounts, use at least 1 wei to avoid zero minimums
        amountTokenMin = shareRatio > 500n ? (shareRatio * 95n) / 10000n : 1n // 95% of expected, minimum 1 wei
        amountETHMin = shareRatio > 500n ? (shareRatio * 95n) / 10000n : 1n   // 95% of expected, minimum 1 wei
        
        loggers.liquidity.success(' CALCULATED MINIMUM AMOUNTS:', {
          shareRatio: shareRatio.toString(),
          amountTokenMin: amountTokenMin.toString(),
          amountETHMin: amountETHMin.toString()
        })
      } else {
        throw new Error('Could not get total supply')
      }
    } catch (error) {
      loggers.liquidity.warn('⚠️ Could not calculate optimal minimums, using safe defaults:', error)
      // Fallback: Use 0.1% of LP amount as minimum (very conservative)
      amountTokenMin = lpAmount / 1000n || 1n // 0.1% or 1 wei minimum
      amountETHMin = lpAmount / 1000n || 1n   // 0.1% or 1 wei minimum
    }
    
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes from now

    // DEBUG: Add comprehensive logging to diagnose the underflow error
    loggers.liquidity.debug(' DEBUGGING LP Removal Transaction...', {
      token: poolToRemove?.tokenAddress,
      lpTokenAddress: poolToRemove?.poolAddress,
      lpTokens: lpAmount.toString(),
      lpTokensFormatted: formatUnits(lpAmount, 18),
      amountTokenMin: amountTokenMin.toString(),
      amountETHMin: amountETHMin.toString(),
      deadline: deadline.toString(),
      router: getContracts().router,
      userAddress,
      poolInfo: poolToRemove
    })

    // DEBUG: Check actual LP token balance before attempting removal
    try {
      const actualLpBalance = await publicClient?.readContract({
        address: poolToRemove!.poolAddress as `0x${string}`,
        abi: LP_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`]
      })
      
      const actualAllowance = await publicClient?.readContract({
        address: poolToRemove!.poolAddress as `0x${string}`,
        abi: LP_TOKEN_ABI,
        functionName: 'allowance',
        args: [userAddress as `0x${string}`, getContracts().router as `0x${string}`]
      })

      loggers.liquidity.debug(' ACTUAL LP TOKEN STATE:', {
        requestedAmount: lpAmount.toString(),
        requestedFormatted: formatUnits(lpAmount, 18),
        actualBalance: actualLpBalance?.toString(),
        actualBalanceFormatted: actualLpBalance ? formatUnits(actualLpBalance as bigint, 18) : 'N/A',
        actualAllowance: actualAllowance?.toString(),
        actualAllowanceFormatted: actualAllowance ? formatUnits(actualAllowance as bigint, 18) : 'N/A',
        hasEnoughBalance: actualLpBalance ? (actualLpBalance as bigint) >= lpAmount : false,
        hasEnoughAllowance: actualAllowance ? (actualAllowance as bigint) >= lpAmount : false
      })

      // FIX: If we're trying to remove more than balance, use actual balance instead
      if (actualLpBalance && (actualLpBalance as bigint) < lpAmount) {
        loggers.liquidity.warn(' Requested amount exceeds actual balance, using actual balance instead')
        lpAmount = actualLpBalance as bigint
      }

      // Check if allowance is sufficient (after potential adjustment)
      if (actualAllowance && (actualAllowance as bigint) < lpAmount) {
        throw new Error(`Insufficient LP token allowance. Approved: ${formatUnits(actualAllowance as bigint, 18)}, Required: ${formatUnits(lpAmount, 18)}`)
      }

    } catch (balanceCheckError) {
      loggers.liquidity.error('❌ Error checking LP token state:', balanceCheckError)
      // Don't throw here, let the transaction attempt anyway in case it's a query issue
    }

    loggers.liquidity.info(' Removing liquidity from Uniswap V2...', {
      token: poolToRemove?.tokenAddress,
      lpTokens: lpAmount.toString(),
      amountTokenMin: amountTokenMin.toString(),
      amountETHMin: amountETHMin.toString(),
      deadline: deadline.toString(),
      router: getContracts().router
    })

    // Let wagmi handle gas estimation automatically
    const hash = await writeContractAsync({
      address: getContracts().router as `0x${string}`,
      abi: ROUTER_ABI,
      functionName: 'removeLiquidityETH',
      args: [
        poolToRemove!.tokenAddress as `0x${string}`,
        lpAmount,
        amountTokenMin,
        amountETHMin,
        userAddress as `0x${string}`,
        deadline
      ]
    })
    
    setCurrentTxHash(hash)
    return hash
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
            abi: LP_TOKEN_ABI,
            functionName: 'token0'
          }),
          publicClient?.readContract({
            address: lpTokenAddress as `0x${string}`,
            abi: LP_TOKEN_ABI,
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
        console.log('❌ Insufficient LP allowance, requesting approval...', {
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


  const refetchPools = () => {
    if (!userAddress) return
    
    try {
      const stored = localStorage.getItem(LIQUIDITY_STORAGE_KEY)
      if (stored) {
        const allPools = JSON.parse(stored)
        
        // Validate the data structure
        if (!Array.isArray(allPools)) {
          loggers.liquidity.warn('Invalid pools data structure, clearing localStorage')
          localStorage.removeItem(LIQUIDITY_STORAGE_KEY)
          setUserPools([])
          return
        }
        
        const userCreatedPools = allPools.filter((pool: any) => 
          pool && 
          typeof pool === 'object' && 
          pool.id && 
          pool.id.includes(userAddress.toLowerCase())
        )
        setUserPools(userCreatedPools)
      }
    } catch (error) {
      loggers.liquidity.error('Error loading pools from localStorage:', error)
      // Clear corrupted data
      try {
        localStorage.removeItem(LIQUIDITY_STORAGE_KEY)
      } catch (clearError) {
        loggers.liquidity.error('Error clearing localStorage:', clearError)
      }
      setUserPools([])
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
    poolExists: poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000',
    poolAddress: poolAddress || null,
    lastSuccessfulPool, // Pool info for success modal
    clearSuccessState, // Function to clear success state
    resetLoadingStates // Emergency reset function
  }
}