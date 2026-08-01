import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits } from 'viem'
import { LP_TOKEN_ABI, ROUTER_ABI, LIQUIDITY_SLIPPAGE_BPS, applyLiquiditySlippage } from '../constants'
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
    const contracts = getContracts()
    const pairAddress = poolToRemove!.poolAddress as `0x${string}`

    // ------------------------------------------------------------------
    // STEP 1: Reconcile the requested LP amount against the on-chain balance.
    //
    // This MUST happen before the minimum amounts are computed. The minimums
    // are derived from the LP amount actually being burned; if we clamped the
    // amount afterwards the minimums would be too high and the router would
    // revert with INSUFFICIENT_A_AMOUNT / INSUFFICIENT_B_AMOUNT.
    // ------------------------------------------------------------------
    let actualLpBalance: bigint | undefined
    let actualAllowance: bigint | undefined

    try {
      actualLpBalance = await publicClient?.readContract({
        address: pairAddress,
        abi: LP_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`]
      })

      actualAllowance = await publicClient?.readContract({
        address: pairAddress,
        abi: LP_TOKEN_ABI,
        functionName: 'allowance',
        args: [userAddress as `0x${string}`, contracts.router as `0x${string}`]
      })

      loggers.liquidity.debug(' ACTUAL LP TOKEN STATE:', {
        requestedAmount: lpAmount.toString(),
        requestedFormatted: formatUnits(lpAmount, 18),
        actualBalance: actualLpBalance?.toString(),
        actualBalanceFormatted: actualLpBalance !== undefined ? formatUnits(actualLpBalance, 18) : 'N/A',
        actualAllowance: actualAllowance?.toString(),
        actualAllowanceFormatted: actualAllowance !== undefined ? formatUnits(actualAllowance, 18) : 'N/A',
        hasEnoughBalance: actualLpBalance !== undefined ? actualLpBalance >= lpAmount : false,
        hasEnoughAllowance: actualAllowance !== undefined ? actualAllowance >= lpAmount : false
      })
    } catch (balanceCheckError) {
      loggers.liquidity.error('❌ Error checking LP token state:', balanceCheckError)
      // Don't throw here — this is only a pre-flight read. If the balance or
      // allowance is genuinely insufficient the transaction itself will revert.
    }

    // If we're trying to remove more than the balance, use the actual balance
    if (actualLpBalance !== undefined && actualLpBalance < lpAmount) {
      loggers.liquidity.warn(' Requested amount exceeds actual balance, using actual balance instead')
      lpAmount = actualLpBalance
    }

    if (lpAmount <= 0n) {
      throw new Error('No LP tokens available to remove.')
    }

    // Check allowance against the (possibly adjusted) amount
    if (actualAllowance !== undefined && actualAllowance < lpAmount) {
      throw new Error(`Insufficient LP token allowance. Approved: ${formatUnits(actualAllowance, 18)}, Required: ${formatUnits(lpAmount, 18)}`)
    }

    // ------------------------------------------------------------------
    // STEP 2: Compute REAL minimum output amounts from the pair reserves.
    //
    // Uniswap V2 `burn()` pays out a straight pro-rata share of the reserves:
    //   expectedToken = reserveToken * lpAmount / totalSupply
    //   expectedETH   = reserveETH   * lpAmount / totalSupply
    // We then subtract the slippage tolerance (5%, LIQUIDITY_SLIPPAGE_BPS):
    //   amountMin = expected * (10000 - 500) / 10000
    //
    // The previous implementation multiplied a *basis-point share* (max 10000)
    // by 95/10000, which capped the minimums at 95 wei — effectively zero
    // protection. Any failure below must therefore BLOCK the removal rather
    // than fall back to a permissive value.
    // ------------------------------------------------------------------
    let amountTokenMin: bigint
    let amountETHMin: bigint

    try {
      if (!contracts.weth) {
        throw new Error('No WETH address configured for this chain')
      }

      const [totalSupply, token0, token1, reserves] = await Promise.all([
        publicClient!.readContract({ address: pairAddress, abi: LP_TOKEN_ABI, functionName: 'totalSupply' }),
        publicClient!.readContract({ address: pairAddress, abi: LP_TOKEN_ABI, functionName: 'token0' }),
        publicClient!.readContract({ address: pairAddress, abi: LP_TOKEN_ABI, functionName: 'token1' }),
        publicClient!.readContract({ address: pairAddress, abi: LP_TOKEN_ABI, functionName: 'getReserves' })
      ])

      if (totalSupply <= 0n) {
        throw new Error('Pair reports a zero LP total supply')
      }

      const [reserve0, reserve1] = reserves

      // Uniswap V2 sorts token0/token1 by address, so the order is NOT known
      // ahead of time. Resolve it explicitly and refuse to guess.
      const tokenAddr = poolToRemove!.tokenAddress.toLowerCase()
      const wethAddr = contracts.weth.toLowerCase()
      const token0Addr = token0.toLowerCase()
      const token1Addr = token1.toLowerCase()

      let reserveToken: bigint
      let reserveETH: bigint

      if (token0Addr === tokenAddr && token1Addr === wethAddr) {
        reserveToken = reserve0
        reserveETH = reserve1
      } else if (token1Addr === tokenAddr && token0Addr === wethAddr) {
        reserveToken = reserve1
        reserveETH = reserve0
      } else {
        throw new Error(`Pair ${pairAddress} is not a ${poolToRemove!.tokenSymbol}/WETH pair (token0=${token0}, token1=${token1})`)
      }

      if (reserveToken <= 0n || reserveETH <= 0n) {
        throw new Error('Pair has empty reserves')
      }

      const expectedToken = (reserveToken * lpAmount) / totalSupply
      const expectedETH = (reserveETH * lpAmount) / totalSupply

      amountTokenMin = applyLiquiditySlippage(expectedToken)
      amountETHMin = applyLiquiditySlippage(expectedETH)

      if (amountTokenMin <= 0n || amountETHMin <= 0n) {
        throw new Error('The LP amount is too small relative to the pool to compute a non-zero minimum output')
      }

      loggers.liquidity.success(' CALCULATED MINIMUM AMOUNTS:', {
        lpAmount: lpAmount.toString(),
        totalSupply: totalSupply.toString(),
        token0,
        token1,
        tokenAddress: poolToRemove?.tokenAddress,
        wethAddress: contracts.weth,
        reserveToken: reserveToken.toString(),
        reserveETH: reserveETH.toString(),
        expectedToken: expectedToken.toString(),
        expectedETH: expectedETH.toString(),
        slippageBps: LIQUIDITY_SLIPPAGE_BPS.toString(),
        amountTokenMin: amountTokenMin.toString(),
        amountETHMin: amountETHMin.toString()
      })
    } catch (error) {
      loggers.liquidity.error('❌ Could not calculate minimum output amounts:', error)
      throw new Error(`Unable to estimate minimum output (${error instanceof Error ? error.message : 'unknown error'}). Please try again — do not remove liquidity without slippage protection.`)
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes from now

    loggers.liquidity.info(' Removing liquidity from Uniswap V2...', {
      token: poolToRemove?.tokenAddress,
      lpTokens: lpAmount.toString(),
      amountTokenMin: amountTokenMin.toString(),
      amountETHMin: amountETHMin.toString(),
      deadline: deadline.toString(),
      router: contracts.router
    })

    // Let wagmi handle gas estimation automatically
    const hash = await writeContractAsync({
      address: contracts.router as `0x${string}`,
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
