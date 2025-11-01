import { useAccount, useReadContract } from 'wagmi'
import { FACTORY_ABI, LP_TOKEN_ABI } from '../constants'
import { useLiquidityContracts } from './useLiquidityContracts'
import type { TokenProcessInfo, LiquidityPool } from '../types'

/**
 * Hook to query pool information from the blockchain
 * Handles pool existence checks and LP token balance queries
 */
export function usePoolQuery(
  tokenToProcess: TokenProcessInfo | null,
  poolToRemove: LiquidityPool | null
) {
  const { address: userAddress } = useAccount()
  const { getContracts } = useLiquidityContracts()

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

  return {
    poolAddress,
    lpBalance,
    lpAllowance,
    refetchLpBalance,
    refetchLpAllowance,
    poolExists: poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000'
  }
}
