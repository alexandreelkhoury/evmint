import { useEffect, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { LP_TOKENS_STORAGE_KEY, LIQUIDITY_STORAGE_KEY } from '../constants'
import { loggers } from '../../../utils/logger'
import type { LPToken, LiquidityPool } from '../types'
import { useLiquidityContracts } from './useLiquidityContracts'

/**
 * Hook to manage LP token storage in localStorage
 * Handles saving, retrieving, and migrating LP token data
 */
export function useLPTokenStorage() {
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  const { getContracts } = useLiquidityContracts()
  const [userPools, setUserPools] = useState<LiquidityPool[]>([])

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

  return {
    userPools,
    setUserPools,
    saveLPTokenToStorage,
    refetchPools
  }
}
