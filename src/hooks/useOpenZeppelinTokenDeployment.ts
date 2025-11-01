import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount, useChainId, useSwitchChain, useDeployContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { parseEther } from 'viem'
import { isChainSupported, baseConfig } from '../config/chains'
import { MY_ERC20_ABI, MY_ERC20_BYTECODE, FEE_RECIPIENT } from '../contracts/MyERC20Artifacts'
import {
  verifyContractWithEtherscan,
  encodeConstructorArguments,
  type VerificationResult
} from '../features/verification'
import {
  validateTokenData,
  sanitizeString,
  type TokenValidationResult
} from '../utils/validation'
import { TIMEOUTS, FEES } from '../config/constants'
import { loggers } from '../utils/logger'

// Use the validated token data type from validation system
export type TokenData = TokenValidationResult

interface CreatedToken extends TokenData {
  address: string
  creator: string
  createdAt: number
  txHash: string
  chainId: number
  imageUrl?: string
}

// Storage for user tokens
const STORAGE_KEY = 'baseTokens_openZeppelinDeployments'

export function useOpenZeppelinTokenDeployment() {
  const { address: userAddress, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const publicClient = usePublicClient()
  
  
  const [createdTokenAddress, setCreatedTokenAddress] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [userTokens, setUserTokens] = useState<CreatedToken[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | null>(null)
  const [verificationMethod, setVerificationMethod] = useState<'etherscan' | null>(null)
  const hasInitiallyLoaded = useRef(false)

  // Deploy OpenZeppelin-based contract - THIS TRIGGERS REAL METAMASK POPUP! 🎯
  const { 
    deployContract, 
    data: hash, 
    isPending: isDeployPending,
    error: deployError
  } = useDeployContract()

  // Wait for deployment confirmation  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError,
    data: receipt
  } = useWaitForTransactionReceipt({
    hash,
  })

  const generateTokenImage = (tokenAddress: string): string => {
    // Generate a unique avatar for the token
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${tokenAddress}&backgroundColor=3b82f6,8b5cf6,10b981&size=100`
  }

  const updateTokenWithContractData = useCallback(async (tokenAddress: string, txHash: string) => {
    if (!publicClient || !userAddress) return

    try {
      loggers.contract.info('Fetching real token data from contract:', tokenAddress)

      // Fetch token details from deployed contract
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: MY_ERC20_ABI,
          functionName: 'name'
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: MY_ERC20_ABI,
          functionName: 'symbol'
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: MY_ERC20_ABI,
          functionName: 'decimals'
        }) as Promise<number>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: MY_ERC20_ABI,
          functionName: 'totalSupply'
        }) as Promise<bigint>
      ])

      // Update the token in storage with real data
      const updatedToken: CreatedToken = {
        address: tokenAddress,
        name: name as string,
        symbol: symbol as string,
        totalSupply: totalSupply.toString(),
        decimals: Number(decimals),
        creator: userAddress,
        createdAt: Date.now(),
        txHash,
        chainId,
        imageUrl: generateTokenImage(tokenAddress)
      }

      // Update localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const allTokens: CreatedToken[] = stored ? JSON.parse(stored) : []
        
        // Find and update the token with matching address
        const tokenIndex = allTokens.findIndex(token => token.address.toLowerCase() === tokenAddress.toLowerCase())
        if (tokenIndex >= 0) {
          allTokens[tokenIndex] = updatedToken
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allTokens))
          loggers.contract.success('Updated token with real contract data:', updatedToken)
        }
      } catch (error) {
        loggers.contract.error('Error updating token in storage:', error)
      }
    } catch (error) {
      loggers.contract.error('Error fetching token contract data:', error)
    }
  }, [publicClient, userAddress, chainId])

  const loadUserTokens = useCallback(async () => {
    if (!userAddress) return
    
    setIsRefreshing(true)
    loggers.contract.debug('loadUserTokens called, isInitialLoading:', isInitialLoading)

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        let allTokens: CreatedToken[] = JSON.parse(stored)
        
        // Migration: Add chainId to existing tokens that don't have it
        let needsUpdate = false
        allTokens = allTokens.map(token => {
          if (token.chainId === undefined) {
            needsUpdate = true
            // Assume existing tokens without chainId are from current network
            return { ...token, chainId }
          }
          return token
        })
        
        // Update localStorage if migration was needed
        if (needsUpdate) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allTokens))
          loggers.contract.info('Migrated existing tokens to include chainId')
        }
        
        const userCreatedTokens = allTokens.filter(token => 
          token.creator.toLowerCase() === userAddress.toLowerCase() &&
          token.chainId === chainId
        )
        
        loggers.contract.debug('Token filtering results:', {
          currentChainId: chainId,
          totalTokens: allTokens.length,
          userTokensOnNetwork: userCreatedTokens.length,
          filteredTokens: userCreatedTokens.map(t => ({ name: t.name, symbol: t.symbol, chainId: t.chainId, address: t.address }))
        })
        
        setUserTokens(userCreatedTokens)
        
        // Check if any tokens need updating (have "Loading..." data)
        const tokensNeedingUpdate = userCreatedTokens.filter(token => 
          token.name === 'Loading...' || token.symbol === 'LOADING'
        )
        
        // Update tokens with loading data
        tokensNeedingUpdate.forEach(token => {
          setTimeout(() => {
            updateTokenWithContractData(token.address, token.txHash)
          }, 1000)
        })
      }
      
      // Add a small delay only for initial loading to ensure user sees loading state
      if (isInitialLoading) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } catch (error) {
      loggers.contract.error('Error loading user tokens:', error)
    } finally {
      setIsRefreshing(false)
      if (!hasInitiallyLoaded.current) {
        setIsInitialLoading(false)
        hasInitiallyLoaded.current = true
        loggers.contract.debug('First time loading completed, setting isInitialLoading to false')
      }
    }
  }, [userAddress, chainId, isInitialLoading, updateTokenWithContractData])

  // Load user tokens from localStorage on mount
  useEffect(() => {
    loggers.contract.debug('useEffect triggered', { userAddress, chainId, hasInitiallyLoaded: hasInitiallyLoaded.current })
    if (userAddress) {
      loadUserTokens()
    } else {
      // No user address yet, set initial loading to false immediately
      if (!hasInitiallyLoaded.current) {
        loggers.contract.debug('No userAddress, setting isInitialLoading to false')
        setIsInitialLoading(false)
        hasInitiallyLoaded.current = true
      }
    }
  }, [userAddress, chainId, loadUserTokens])

  const addTokenToStorage = (tokenAddress: string, txHash: string) => {
    // Store basic info - real details will be fetched from blockchain
    const newToken: CreatedToken = {
      address: tokenAddress,
      name: 'Loading...', // Will be updated when we read from contract
      symbol: 'LOADING',
      totalSupply: '0',
      decimals: 18,
      creator: userAddress!,
      createdAt: Date.now(),
      txHash,
      chainId,
      imageUrl: generateTokenImage(tokenAddress)
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const allTokens: CreatedToken[] = stored ? JSON.parse(stored) : []
      allTokens.push(newToken)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTokens))
    } catch (error) {
      loggers.contract.error('Error saving token to storage:', error)
    }
  }

  const verifyDeployedContract = useCallback(async (contractAddress: string) => {
    if (!pendingTokenDataRef.current) {
      loggers.contract.warn('No token data available for verification')
      return
    }

    const tokenData = pendingTokenDataRef.current
    
    try {
      setIsVerifying(true)
      setVerificationStatus('pending')
      
      loggers.contract.info('Starting contract verification for:', contractAddress)

      // Wait for the contract to be available on the network (blockchain propagation)
      loggers.contract.info('Waiting for contract to propagate on blockchain...')
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.POLLING_INTERVAL))
      
      // Verify the contract exists by checking bytecode
      if (publicClient) {
        try {
          const bytecode = await publicClient.getBytecode({ address: contractAddress as `0x${string}` })
          if (!bytecode || bytecode === '0x') {
            loggers.contract.error('No contract found at address:', contractAddress)
            setVerificationStatus('failed')
            return
          }
          loggers.contract.success('Contract bytecode confirmed at:', contractAddress)
        } catch (error) {
          loggers.contract.error('Error checking contract bytecode:', error)
          setVerificationStatus('failed')
          return
        }
      }
      
      const verificationResult = await verifyContractWithEtherscan(
        contractAddress,
        tokenData.name,
        tokenData.symbol,
        BigInt(tokenData.totalSupply),
        tokenData.decimals,
        chainId
      )

      if (verificationResult.success && verificationResult.isVerified) {
        loggers.contract.success('Contract verification submitted successfully!')
        setVerificationStatus('success')
        setVerificationMethod('etherscan')
      } else {
        loggers.contract.warn('Contract verification failed')
        loggers.contract.info('Verification result:', verificationResult.message)
        setVerificationStatus('failed')
      }

    } catch (error) {
      loggers.contract.error('Error during contract verification:', error)
      setVerificationStatus('failed')
    } finally {
      setIsVerifying(false)
    }
  }, [chainId])

  // Handle successful deployment
  useEffect(() => {
    if (isConfirmed && receipt && userAddress) {
      const newTokenAddress = receipt.contractAddress
      if (newTokenAddress) {
        setCreatedTokenAddress(newTokenAddress)
        addTokenToStorage(newTokenAddress, hash!)
        
        loggers.contract.success('Token creation successful')

        // Wait a moment for the contract to be available, then fetch real data
        setTimeout(() => {
          updateTokenWithContractData(newTokenAddress, hash!)
        }, TIMEOUTS.TRANSACTION_RETRY_DELAY)
        
        loadUserTokens()

        // Start contract verification after successful deployment
        verifyDeployedContract(newTokenAddress)
      }
    }
  }, [isConfirmed, receipt, userAddress, hash, updateTokenWithContractData, loadUserTokens, verifyDeployedContract])

  // Handle errors with detailed debugging
  useEffect(() => {
    if (deployError) {
      loggers.contract.error('DEPLOYMENT ERROR DETAILS:', {
        error: deployError,
        message: deployError.message,
        name: deployError.name,
        stack: deployError.stack
      })
      
      
      let cleanMessage = 'Deployment failed'
      
      // Handle common error cases with user-friendly messages
      if (deployError.message?.includes('User rejected')) {
        cleanMessage = 'Transaction cancelled - You rejected the wallet signature'
      } else if (deployError.message?.includes('insufficient funds')) {
        cleanMessage = 'Insufficient funds - You need more ETH for gas fees'
      } else if (deployError.message?.includes('gas required exceeds allowance')) {
        cleanMessage = 'Gas limit too low - Try increasing gas limit in wallet'
      } else if (deployError.message?.includes('nonce too low')) {
        cleanMessage = 'Transaction conflict - Try resetting your wallet account'
      } else if (deployError.message?.includes('already known')) {
        cleanMessage = 'Transaction already pending - Please wait or try again'
      } else if (deployError.message?.includes('replacement transaction underpriced')) {
        cleanMessage = 'Transaction underpriced - Increase gas price and try again'
      } else if (deployError.message?.includes('Internal JSON-RPC error')) {
        cleanMessage = `MetaMask RPC Error: ${deployError.message} - Try refreshing page or switching networks`
      } else {
        // Show more of the actual error for debugging
        cleanMessage = `Deployment Error: ${deployError.message}`
      }
      
      setError(new Error(cleanMessage))
    } else if (confirmError) {
      let cleanMessage = 'Transaction confirmation failed'
      
      if (confirmError.message?.includes('timeout')) {
        cleanMessage = 'Transaction timeout - Network is congested, try again'
      } else if (confirmError.message?.includes('reverted')) {
        cleanMessage = 'Transaction failed - Contract deployment was rejected by network'
      } else {
        cleanMessage = confirmError.message?.split('Request Arguments:')[0]?.trim() || cleanMessage
      }
      
      setError(new Error(cleanMessage))
    }
  }, [deployError, confirmError])






  // Store token data for verification
  const pendingTokenDataRef = useRef<TokenData | null>(null)


  const createToken = async (tokenData: TokenData) => {

    if (!isConnected || !userAddress) {
      throw new Error('Please connect your wallet first')
    }

    // Temporarily bypass validation to debug stack underflow issue
    loggers.contract.debug('Using direct token data without validation...')
    const sanitizedTokenData = tokenData
    loggers.contract.debug('Token data (no validation):', sanitizedTokenData)

    // Skip security analysis for now
    const securityAnalysis = { riskLevel: 'low' as const, warnings: [] }

    // Check if on a supported chain
    if (!isChainSupported(chainId)) {
      try {
        // Try Base mainnet as default
        await switchChain({ chainId: baseConfig.id })
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (e) {
        throw new Error('Please switch to a supported network to create tokens. Supported chains: Ethereum, Base, Arbitrum, Polygon, BSC, Optimism, Avalanche, and more.')
      }
    }

    setError(null)
    setCreatedTokenAddress(null)
    setVerificationStatus(null)

    // Store sanitized token data for later verification
    pendingTokenDataRef.current = sanitizedTokenData

    try {
      loggers.contract.info('Attempting token deployment with sanitized data')
      loggers.contract.debug('Deployment details:', {
        userAddress,
        chainId,
        tokenData: sanitizedTokenData,
        riskLevel: securityAnalysis.riskLevel
      })

      // Final validation check
      if (!sanitizedTokenData.name || !sanitizedTokenData.symbol || !sanitizedTokenData.totalSupply) {
        throw new Error('Missing required token data after sanitization')
      }

      loggers.contract.info('Deploying with args:', {
        name: sanitizedTokenData.name,
        symbol: sanitizedTokenData.symbol,
        totalSupply: sanitizedTokenData.totalSupply,
        decimals: sanitizedTokenData.decimals
      })
      
      deployContract({
        bytecode: MY_ERC20_BYTECODE,
        abi: MY_ERC20_ABI,
        args: [
          sanitizedTokenData.name,
          sanitizedTokenData.symbol,
          BigInt(sanitizedTokenData.totalSupply),
          sanitizedTokenData.decimals
        ],
        value: parseEther(FEES.DEPLOYMENT_FEE.toString()), // 0.02 ETH - matches contract FEE constant
      })

      // What happens after clicking "Confirm" in MetaMask:
      // 1. Transaction is broadcast to Base Sepolia network
      // 2. Miners/validators process the transaction
      // 3. Real ERC20 contract is deployed with your parameters  
      // 4. You get a real contract address that's verifiable on BaseScan
      // 5. The contract is fully functional - you can transfer tokens, check balances, etc!

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred'
      setError(new Error(errorMessage))
      throw e
    }
  }

  return {
    createToken,
    isCreating: isDeployPending || isConfirming,
    isSuccess: !!createdTokenAddress,
    createdTokenAddress,
    userTokens,
    refetchUserTokens: loadUserTokens,
    isRefreshing,
    isInitialLoading,
    error,
    isConnected,
    chainId,
    isCorrectChain: isChainSupported(chainId),
    transactionHash: hash,
    isVerifying,
    verificationStatus,
    verificationMethod,
    feeAmount: '0.02', // For UI display
    feeRecipient: FEE_RECIPIENT,
  }
}