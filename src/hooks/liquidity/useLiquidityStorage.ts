/**
 * Liquidity Storage Hook
 * Handles localStorage persistence for LP tokens and pool data
 *
 * MIGRATION STATUS: Template created - needs implementation
 * TODO: Extract localStorage logic from useUniswapV2Liquidity.ts
 */

import { useState, useCallback, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import type { LPToken } from './types'
import { STORAGE_KEYS } from '../../config/constants'
import { loggers } from '../../utils/logger'

// ============================================================================
// HOOK
// ============================================================================

export function useLiquidityStorage() {
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  const [userLPTokens, setUserLPTokens] = useState<LPToken[]>([])

  /**
   * Load LP tokens for current user and chain from localStorage
   */
  const loadLPTokens = useCallback(() => {
    if (!userAddress) {
      setUserLPTokens([])
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LP_TOKENS)
      if (!stored) {
        setUserLPTokens([])
        return
      }

      const allTokens: LPToken[] = JSON.parse(stored)

      // Filter for current user and chain
      const filtered = allTokens.filter(
        (token) =>
          token.userAddress.toLowerCase() === userAddress.toLowerCase() &&
          token.chainId === chainId
      )

      setUserLPTokens(filtered)
      loggers.liquidity.info(`Loaded ${filtered.length} LP tokens`)
    } catch (error) {
      loggers.liquidity.error('Failed to load LP tokens:', error)
      setUserLPTokens([])
    }
  }, [userAddress, chainId])

  /**
   * Save a new LP token to localStorage
   */
  const saveLPToken = useCallback(
    (lpToken: LPToken) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LP_TOKENS)
        const existing: LPToken[] = stored ? JSON.parse(stored) : []

        // Check if token already exists
        const isDuplicate = existing.some(
          (token) =>
            token.address.toLowerCase() === lpToken.address.toLowerCase() &&
            token.userAddress.toLowerCase() === lpToken.userAddress.toLowerCase() &&
            token.chainId === lpToken.chainId
        )

        if (isDuplicate) {
          loggers.liquidity.warn('LP token already exists in storage')
          return
        }

        // Add new token
        existing.push(lpToken)
        localStorage.setItem(STORAGE_KEYS.LP_TOKENS, JSON.stringify(existing))

        // Update state
        loadLPTokens()

        loggers.liquidity.success('LP token saved to storage')
      } catch (error) {
        loggers.liquidity.error('Failed to save LP token:', error)
      }
    },
    [loadLPTokens]
  )

  /**
   * Remove LP token from localStorage
   */
  const removeLPToken = useCallback(
    (lpTokenAddress: string) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LP_TOKENS)
        if (!stored) return

        const existing: LPToken[] = JSON.parse(stored)

        // Filter out the token
        const filtered = existing.filter(
          (token) =>
            !(
              token.address.toLowerCase() === lpTokenAddress.toLowerCase() &&
              token.userAddress.toLowerCase() === userAddress?.toLowerCase() &&
              token.chainId === chainId
            )
        )

        localStorage.setItem(STORAGE_KEYS.LP_TOKENS, JSON.stringify(filtered))

        // Update state
        loadLPTokens()

        loggers.liquidity.success('LP token removed from storage')
      } catch (error) {
        loggers.liquidity.error('Failed to remove LP token:', error)
      }
    },
    [userAddress, chainId, loadLPTokens]
  )

  /**
   * Update LP token liquidity amount
   */
  const updateLPTokenAmount = useCallback(
    (lpTokenAddress: string, newAmount: string) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LP_TOKENS)
        if (!stored) return

        const existing: LPToken[] = JSON.parse(stored)

        // Find and update the token
        const updated = existing.map((token) => {
          if (
            token.address.toLowerCase() === lpTokenAddress.toLowerCase() &&
            token.userAddress.toLowerCase() === userAddress?.toLowerCase() &&
            token.chainId === chainId
          ) {
            return { ...token, liquidityAmount: newAmount }
          }
          return token
        })

        localStorage.setItem(STORAGE_KEYS.LP_TOKENS, JSON.stringify(updated))

        // Update state
        loadLPTokens()
      } catch (error) {
        loggers.liquidity.error('Failed to update LP token amount:', error)
      }
    },
    [userAddress, chainId, loadLPTokens]
  )

  // Load LP tokens when user or chain changes
  useEffect(() => {
    loadLPTokens()
  }, [loadLPTokens])

  return {
    userLPTokens,
    loadLPTokens,
    saveLPToken,
    removeLPToken,
    updateLPTokenAmount,
  }
}
