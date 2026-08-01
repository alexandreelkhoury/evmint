import { useState } from 'react'
import { useAccount, useReadContract, usePublicClient } from 'wagmi'
import { parseUnits, parseEther, formatUnits } from 'viem'
import { ERC20_ABI, ROUTER_ABI } from '../constants'
import { TIMEOUTS, RETRY_CONFIG } from '../../../config/constants'
import { loggers } from '../../../utils/logger'
import { useLiquidityContracts } from './useLiquidityContracts'
import type { TokenProcessInfo } from '../types'

/**
 * Slippage tolerance applied to the minimum amounts sent to addLiquidityETH.
 *
 * Creating a pool has no slippage surface at all (there are no reserves to move),
 * so this only bites when adding to a pool that already exists. It is surfaced to
 * the user in AddLiquidityForm — keep the two in sync.
 *
 * NOTE: an equivalent constant now lives in ../constants (LIQUIDITY_SLIPPAGE_BPS);
 * consolidating onto it is a follow-up, deliberately not done here to avoid
 * touching that file concurrently.
 */
export const ADD_LIQUIDITY_SLIPPAGE_PERCENT = 5
const SLIPPAGE_BPS = BigInt(ADD_LIQUIDITY_SLIPPAGE_PERCENT * 100)
const BPS_DENOMINATOR = 10000n

/** floor(amount * (1 - slippage)) — bigint throughout, always rounds down */
const applySlippage = (amount: bigint): bigint =>
  (amount * (BPS_DENOMINATOR - SLIPPAGE_BPS)) / BPS_DENOMINATOR

/** Wei → a number a human can read, for error messages only */
const toReadableAmount = (amount: bigint, decimals: number): string => {
  const formatted = formatUnits(amount, decimals)
  const value = parseFloat(formatted)
  if (!Number.isFinite(value)) return formatted
  if (value > 0 && value < 0.000001) return value.toExponential(2)
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

/**
 * Hook to handle the add liquidity flow
 * Manages token approval and addLiquidityETH transaction
 */
export function useAddLiquidity(
  tokenToProcess: TokenProcessInfo | null,
  writeContractAsync: any,
  setCurrentTxHash: (hash: `0x${string}` | undefined) => void
) {
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()
  const { getContracts } = useLiquidityContracts()

  // Get token decimals
  const { data: tokenDecimals, error: decimalsError, isLoading: decimalsLoading, refetch: refetchDecimals } = useReadContract({
    address: tokenToProcess?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenToProcess?.address,
      retry: 5,
      retryDelay: RETRY_CONFIG.RETRY_DELAY,
      staleTime: TIMEOUTS.QUERY_STALE_TIME // 5 minutes
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

  // SIMPLIFIED: Handle token approval using wagmi async pattern
  const handleApproveToken = async (tokenInfo: { address: string; tokenAmount: string }) => {
    const finalDecimals = tokenDecimals ?? 18
    const tokenAmountWei = parseUnits(tokenInfo.tokenAmount, finalDecimals)


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

    // Minimum amounts the router may settle for — see ADD_LIQUIDITY_SLIPPAGE_PERCENT
    const amountTokenMin = applySlippage(tokenAmountWei)
    const amountETHMin = applySlippage(ethAmountWei)

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
      loggers.liquidity.error('❌ On-chain allowance is insufficient — TransferHelper would fail:', {
        token: tokenInfo.address,
        cachedAllowance: cachedAllowance.toString(),
        actualOnChainAllowance: actualOnChainAllowance.toString(),
        needed: tokenAmountWei.toString()
      })

      throw new Error("Approval didn't go through. Your wallet may have replaced or dropped the approval transaction — try again, and confirm both prompts.")
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
      balanceInHumanForm: toReadableAmount(actualTokenBalance, finalDecimals)
    })

    if (actualTokenBalance < tokenAmountWei) {
      loggers.liquidity.error('❌ Insufficient token balance — TransferHelper would fail:', {
        token: tokenInfo.address,
        balance: actualTokenBalance.toString(),
        needed: tokenAmountWei.toString(),
        decimals: finalDecimals
      })

      const symbol = tokenToProcess?.symbol || 'tokens'
      throw new Error(`Not enough ${symbol}. You have ${toReadableAmount(actualTokenBalance, finalDecimals)}, this needs ${toReadableAmount(tokenAmountWei, finalDecimals)}.`)
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

      const symbol = tokenToProcess?.symbol || 'This token'
      throw new Error(`${symbol} can't be transferred right now, so it can't be added to a pool. The token contract itself is rejecting transfers — check for trading limits, a paused state, or transfer fees.`)
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

      const reason = simulationError.shortMessage || simulationError.message
      throw new Error(`This transaction would fail, so we didn't send it — no gas was spent.${reason ? ` Reason: ${reason}` : ''}`)
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

  return {
    tokenDecimals,
    decimalsError,
    decimalsLoading,
    refetchDecimals,
    allowance,
    refetchAllowance,
    handleApproveToken,
    handleAddLiquidityStep
  }
}
