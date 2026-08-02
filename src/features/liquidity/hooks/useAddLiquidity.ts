import { useState } from 'react'
import { useAccount, useReadContract, usePublicClient } from 'wagmi'
import { parseUnits, parseEther, formatUnits } from 'viem'
import {
  ERC20_ABI,
  ROUTER_ABI,
  FACTORY_ABI,
  LP_TOKEN_ABI,
  LIQUIDITY_SLIPPAGE_BPS,
  applySlippageBps,
  UserFacingError
} from '../constants'
import { TIMEOUTS, RETRY_CONFIG } from '../../../config/constants'
import { loggers } from '../../../utils/logger'
import { useLiquidityContracts } from './useLiquidityContracts'
import type { TokenProcessInfo } from '../types'

/**
 * Slippage tolerance applied to the minimum amounts sent to addLiquidityETH.
 *
 * Creating a pool has no slippage surface at all (there are no reserves to move),
 * so this only bites when adding to a pool that already exists. It is surfaced to
 * the user in AddLiquidityForm, which imports it from here.
 *
 * Re-exported from ../constants so the figure displayed and the figure enforced
 * are literally the same value and cannot drift.
 */
export { LIQUIDITY_SLIPPAGE_PERCENT as ADD_LIQUIDITY_SLIPPAGE_PERCENT } from '../constants'

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

    // Minimum amounts the router may settle for.
    //
    // For a NEW pool the router banks both desired amounts exactly, so a
    // slippage floor under each is correct.
    //
    // For an EXISTING pool it does not: UniswapV2Router._addLiquidity keeps one
    // side whole and recomputes the other from the current reserves, then
    // requires that recomputed figure to clear the matching minimum. Deriving
    // the minimums from what the user typed therefore reverts with
    // INSUFFICIENT_A_AMOUNT / INSUFFICIENT_B_AMOUNT whenever their ratio
    // differs from the pool's — which is essentially always. We mirror the
    // router's own arithmetic here so the floors sit under the amounts it will
    // actually settle on.
    let amountTokenMin = applySlippageBps(tokenAmountWei, LIQUIDITY_SLIPPAGE_BPS)
    let amountETHMin = applySlippageBps(ethAmountWei, LIQUIDITY_SLIPPAGE_BPS)

    try {
      const { factory, weth } = getContracts()
      if (publicClient && factory && weth) {
        const pair = await publicClient.readContract({
          address: factory as `0x${string}`,
          abi: FACTORY_ABI,
          functionName: 'getPair',
          args: [tokenInfo.address as `0x${string}`, weth as `0x${string}`]
        }) as string

        if (pair && pair !== '0x0000000000000000000000000000000000000000') {
          const [reserves, token0] = await Promise.all([
            publicClient.readContract({ address: pair as `0x${string}`, abi: LP_TOKEN_ABI, functionName: 'getReserves' }) as Promise<readonly [bigint, bigint, number]>,
            publicClient.readContract({ address: pair as `0x${string}`, abi: LP_TOKEN_ABI, functionName: 'token0' }) as Promise<string>
          ])

          const tokenIsToken0 = token0.toLowerCase() === tokenInfo.address.toLowerCase()
          const reserveToken = tokenIsToken0 ? reserves[0] : reserves[1]
          const reserveETH = tokenIsToken0 ? reserves[1] : reserves[0]

          // Only an initialised pool constrains the ratio.
          if (reserveToken > 0n && reserveETH > 0n) {
            // quote(): amountB = amountA * reserveB / reserveA
            const ethOptimal = (tokenAmountWei * reserveETH) / reserveToken

            if (ethOptimal <= ethAmountWei) {
              amountTokenMin = applySlippageBps(tokenAmountWei, LIQUIDITY_SLIPPAGE_BPS)
              amountETHMin = applySlippageBps(ethOptimal, LIQUIDITY_SLIPPAGE_BPS)
            } else {
              const tokenOptimal = (ethAmountWei * reserveToken) / reserveETH
              amountTokenMin = applySlippageBps(tokenOptimal, LIQUIDITY_SLIPPAGE_BPS)
              amountETHMin = applySlippageBps(ethAmountWei, LIQUIDITY_SLIPPAGE_BPS)
            }

            loggers.liquidity.debug('Existing pool — minimums derived from reserves', {
              reserveToken: reserveToken.toString(),
              reserveETH: reserveETH.toString(),
              amountTokenMin: amountTokenMin.toString(),
              amountETHMin: amountETHMin.toString()
            })
          }
        }
      }
    } catch (error) {
      // A failed read leaves the new-pool floors in place. Those are correct for
      // a pool that does not exist and merely conservative for one that does —
      // the transaction reverts rather than filling at a bad ratio.
      loggers.liquidity.warn('Could not read pool reserves; using desired-amount minimums', error)
    }

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
      throw new UserFacingError('Failed to verify token allowance. Please try again.')
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

      throw new UserFacingError(
        "Approval didn't go through. Your wallet may have replaced or dropped the approval transaction — try again, and confirm both prompts.",
        'Approval incomplete'
      )
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
      throw new UserFacingError('Failed to verify token balance. Please try again.')
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
      throw new UserFacingError(`Not enough ${symbol}. You have ${toReadableAmount(actualTokenBalance, finalDecimals)}, this needs ${toReadableAmount(tokenAmountWei, finalDecimals)}.`)
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
      throw new UserFacingError(`${symbol} can't be transferred right now, so it can't be added to a pool. The token contract itself is rejecting transfers — check for trading limits, a paused state, or transfer fees.`)
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
      throw new UserFacingError(`This transaction would fail, so we didn't send it — no gas was spent.${reason ? ` Reason: ${reason}` : ''}`)
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
