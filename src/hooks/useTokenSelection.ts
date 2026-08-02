import { useState, useCallback, useEffect, useMemo } from 'react'
import { usePublicClient, useAccount, useChainId } from 'wagmi'
import type { LPToken } from '../features/liquidity'
import { TOKEN_ADDRESSES } from '../config/constants'
import { loggers } from '../utils/logger'
import { isSameAddress } from '../utils/validation'
import { getChainById } from '../config/chains'

// ERC20 ABI for token details
const ERC20_ABI = [
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  }
] as const

export interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: string
  logoUri?: string
  imageUrl?: string
  isUserCreated?: boolean
}

// Interface from token deployment hook for compatibility
interface CreatedToken {
  address: string
  name: string
  symbol: string
  totalSupply: string
  decimals: number
  creator: string
  createdAt: number
  txHash: string
  chainId: number
  imageUrl?: string
}

// Storage keys
const CREATED_TOKENS_STORAGE_KEY = 'evmint_deployments'
const LP_TOKENS_STORAGE_KEY = 'evmint_lpTokens'

/**
 * Simple hook for token selection UI state management
 * Only handles token selection, amounts, and basic token fetching
 * No liquidity logic - that's handled by useUniswapV2Liquidity
 */
export function useTokenSelection() {
  const publicClient = usePublicClient()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  
  // Token selection state
  const [tokenA, setTokenA] = useState<Token | null>(null)
  const [tokenB, setTokenB] = useState<Token | null>(null)
  
  // Amount input state
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  
  // Custom tokens added by user
  const [customTokens, setCustomTokens] = useState<Token[]>([])
  const [userCreatedTokens, setUserCreatedTokens] = useState<Token[]>([])
  const [userLPTokens, setUserLPTokens] = useState<Token[]>([])
  const [isLoadingCustomToken, setIsLoadingCustomToken] = useState(false)

  // Get chain-specific native token info
  const chainConfig = getChainById(chainId)
  const nativeTokenSymbol = chainConfig?.nativeCurrency?.symbol || 'ETH'
  const nativeTokenName = chainConfig?.nativeCurrency?.name || 'Ethereum'
  const wrappedTokenAddress = chainConfig?.weth || TOKEN_ADDRESSES.WETH

  // Default available tokens - chain-aware native wrapped token
  const availableTokens: Token[] = useMemo(() => [
    {
      address: wrappedTokenAddress,
      name: nativeTokenName,
      symbol: nativeTokenSymbol,
      decimals: 18
    }
  ], [wrappedTokenAddress, nativeTokenName, nativeTokenSymbol])

  // Tracks the `${address}:${chainId}` pair the token lists were last loaded for.
  // Consumers use `userTokensLoaded` to avoid acting on lists that are still empty
  // simply because the initial load has not run yet.
  const [loadedTokensKey, setLoadedTokensKey] = useState<string | null>(null)
  const tokensKey = `${userAddress?.toLowerCase() || 'anonymous'}:${chainId}`
  const userTokensLoaded = loadedTokensKey === tokensKey

  // Load user's created tokens and LP tokens from localStorage
  useEffect(() => {
    if (userAddress) {
      loadUserCreatedTokens()
      loadUserLPTokens()
    } else {
      setUserCreatedTokens([])
      setUserLPTokens([])
    }
    // localStorage reads above are synchronous, so the lists and this flag land
    // in the same render — no window where the flag is true but the lists are stale
    setLoadedTokensKey(tokensKey)
  }, [userAddress, chainId, tokensKey])

  // Set ETH as default second token on mount
  useEffect(() => {
    if (!tokenB && availableTokens.length > 0) {
      setTokenB(availableTokens[0]) // ETH
    }
  }, [])

  const loadUserCreatedTokens = useCallback(() => {
    if (!userAddress) return
    
    try {
      const stored = localStorage.getItem(CREATED_TOKENS_STORAGE_KEY)
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
          localStorage.setItem(CREATED_TOKENS_STORAGE_KEY, JSON.stringify(allTokens))
        }
        
        const userTokens = allTokens.filter(token => 
          token.creator.toLowerCase() === userAddress.toLowerCase() &&
          token.chainId === chainId
        )
        
        // Convert to Token format
        const convertedTokens: Token[] = userTokens.map(token => ({
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          imageUrl: token.imageUrl,
          isUserCreated: true
        }))
        
        setUserCreatedTokens(convertedTokens)
      }
    } catch (error) {
      loggers.liquidity.error('Error loading user created tokens:', error)
    }
  }, [userAddress, chainId])

  const loadUserLPTokens = useCallback(() => {
    if (!userAddress) return
    
    try {
      const stored = localStorage.getItem(LP_TOKENS_STORAGE_KEY)
      if (stored) {
        const allLPTokens: LPToken[] = JSON.parse(stored)
        
        // Filter LP tokens for current user and chain
        const userLPs = allLPTokens.filter(lpToken => 
          lpToken.userAddress.toLowerCase() === userAddress.toLowerCase() &&
          lpToken.chainId === chainId
        )
        
        // Convert LP tokens to Token format for token selection
        const formattedLPTokens: Token[] = userLPs.map(lpToken => ({
          address: lpToken.address,
          name: lpToken.name,
          symbol: lpToken.symbol,
          decimals: 18, // LP tokens typically have 18 decimals
          imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${lpToken.address}&backgroundColor=f59e0b,8b5cf6`,
          isUserCreated: false // Mark as LP token, not user created token
        }))
        
        setUserLPTokens(formattedLPTokens)
      }
    } catch (error) {
      loggers.liquidity.error('Error loading LP tokens:', error)
      setUserLPTokens([])
    }
  }, [userAddress, chainId])

  // Add custom token by address — returns the token that was added so callers
  // can use it immediately instead of re-scanning the (still stale) token lists
  const addCustomToken = useCallback(async (tokenAddress: string): Promise<Token> => {
    if (!publicClient || !tokenAddress) {
      throw new Error('Invalid token address')
    }

    setIsLoadingCustomToken(true)
    try {
      
      // Fetch token details from contract
      const [name, symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'name'
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'symbol'
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'decimals'
        }) as Promise<number>
      ])

      const newToken: Token = {
        address: tokenAddress,
        name: name as string,
        symbol: symbol as string,
        decimals: Number(decimals)
      }

      // Check if token already exists in any list
      const existingToken = customTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase()) ||
                          availableTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase()) ||
                          userCreatedTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase())
      
      if (existingToken) {
        throw new Error('Token already in your token list')
      }

      setCustomTokens(prev => [...prev, newToken])
      loggers.liquidity.success('Token added successfully:', newToken)
      return newToken
    } catch (error) {
      loggers.liquidity.error('Failed to add custom token:', error)
      throw error
    } finally {
      setIsLoadingCustomToken(false)
    }
  }, [publicClient, customTokens, availableTokens])

  // Remove custom token
  const removeToken = useCallback((tokenAddress: string) => {
    setCustomTokens(prev => prev.filter(t => !isSameAddress(t.address, tokenAddress)))
  }, [])

  // Fetch token details by address (utility function)
  const fetchCustomTokenByAddress = useCallback(async (tokenAddress: string): Promise<Token | null> => {
    if (!publicClient || !tokenAddress) return null

    try {
      const [name, symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'name'
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'symbol'
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'decimals'
        }) as Promise<number>
      ])

      return {
        address: tokenAddress,
        name: name as string,
        symbol: symbol as string,
        decimals: Number(decimals)
      }
    } catch (error) {
      loggers.liquidity.error('Failed to fetch token details:', error)
      return null
    }
  }, [publicClient])

  return {
    // Token selection state
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,

    // Amount state
    amountA,
    amountB,
    setAmountA,
    setAmountB,

    // Token lists
    availableTokens,
    customTokens,
    userCreatedTokens,
    userLPTokens,
    userTokensLoaded,

    // Chain-specific token info
    nativeTokenSymbol,
    nativeTokenName,
    wrappedTokenAddress,

    // Token management functions
    addCustomToken,
    removeToken,
    fetchCustomTokenByAddress,
    loadUserCreatedTokens,
    loadUserLPTokens,
    isLoadingCustomToken
  }
}