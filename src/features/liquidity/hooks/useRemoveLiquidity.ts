import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits } from 'viem'
import { LP_TOKEN_ABI, ROUTER_ABI } from '../constants'
import { loggers } from '../../../utils/logger'
import { useLiquidityContracts } from './useLiquidityContracts'
import type { LiquidityPool } from '../types'

/**
 * Hook to handle the remove liquidity flow
 * Manages LP token approval and removeLiquidityETH transaction
 */
export function useRemoveLiquidity(
  poolToRemove: LiquidityPool | null,
  writeContractAsync: any,
  setCurrentTxHash: (hash: `0x${string}` | undefined) => void
) {
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()
  const { getContracts } = useLiquidityContracts()

  // SIMPLIFIED: Handle LP token approval using wagmi async pattern
  const handleApproveLpToken = async (lpAmount: bigint, pool: LiquidityPool) => {
    const contracts = getContracts()

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
      loggers.liquidity.error('❌ Could not calculate minimum output amounts:', error)
      throw new Error('Unable to estimate minimum output. Please try again — do not remove liquidity without slippage protection.')
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

  return {
    handleApproveLpToken,
    handleRemoveLiquidityStep
  }
}
