import { useChainId } from 'wagmi'
import { getDexContracts, getWethAddress, getChainById } from '../../../config/chains'
import type { ContractAddresses } from '../types'

/**
 * Hook to get DEX contract addresses for the current chain
 * Supports multiple DEX protocols with fallback hierarchy:
 * 1. Uniswap V2 (most common)
 * 2. PancakeSwap (BSC)
 * 3. QuickSwap (Polygon)
 * 4. Trader Joe (Avalanche)
 * 5. SpookySwap (Fantom)
 * 6. SushiSwap (multiple chains)
 */
export function useLiquidityContracts() {
  const chainId = useChainId()

  const getContracts = (): ContractAddresses => {
    const dexContracts = getDexContracts(chainId)
    const weth = getWethAddress(chainId)
    const chainConfig = getChainById(chainId)

    // Try to get Uniswap V2 contracts first (most common)
    // If not available, try other DEX protocols
    let factory = null
    let router = null

    if (dexContracts) {
      // Try Uniswap V2 first
      if (dexContracts.uniswapV2Factory && dexContracts.uniswapV2Router) {
        factory = dexContracts.uniswapV2Factory
        router = dexContracts.uniswapV2Router
      }
      // Fallback to PancakeSwap (BSC)
      else if (dexContracts.pancakeswapFactory && dexContracts.pancakeswapRouter) {
        factory = dexContracts.pancakeswapFactory
        router = dexContracts.pancakeswapRouter
      }
      // Fallback to QuickSwap (Polygon)
      else if (dexContracts.quickswapFactory && dexContracts.quickswapRouter) {
        factory = dexContracts.quickswapFactory
        router = dexContracts.quickswapRouter
      }
      // Fallback to Trader Joe (Avalanche)
      else if (dexContracts.traderJoeFactory && dexContracts.traderJoeRouter) {
        factory = dexContracts.traderJoeFactory
        router = dexContracts.traderJoeRouter
      }
      // Fallback to SpookySwap (Fantom)
      else if (dexContracts.spookyswapFactory && dexContracts.spookyswapRouter) {
        factory = dexContracts.spookyswapFactory
        router = dexContracts.spookyswapRouter
      }
      // Fallback to SushiSwap (multiple chains)
      else if (dexContracts.sushiswapFactory && dexContracts.sushiswapRouter) {
        factory = dexContracts.sushiswapFactory
        router = dexContracts.sushiswapRouter
      }
    }

    return {
      factory,
      router,
      weth,
      chainName: chainConfig?.name || 'Unknown Network',
      hasV2Support: !!factory && !!router,
    }
  }

  return { getContracts, chainId }
}
