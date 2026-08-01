import { useState } from 'react'
import { useAccount, useReadContract, usePublicClient } from 'wagmi'
import { parseUnits, parseEther } from 'viem'
import { ERC20_ABI, ROUTER_ABI } from '../constants'
import { TIMEOUTS, RETRY_CONFIG } from '../../../config/constants'
import { loggers } from '../../../utils/logger'
import { useLiquidityContracts } from './useLiquidityContracts'
import type { TokenProcessInfo } from '../types'

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
