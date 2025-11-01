/**
 * DEPRECATED: This file has been refactored into a modular structure.
 *
 * The hook has been split into the following files in src/features/liquidity/:
 * - constants.ts - All ABIs and constants
 * - types.ts - TypeScript interfaces and types
 * - hooks/useLiquidityContracts.ts - Contract address getters
 * - hooks/useLPTokenStorage.ts - LP token localStorage operations
 * - hooks/usePoolQuery.ts - Pool and balance queries
 * - hooks/useAddLiquidity.ts - Add liquidity functionality
 * - hooks/useRemoveLiquidity.ts - Remove liquidity functionality
 * - hooks/useUniswapV2Liquidity.ts - Main orchestrating hook
 *
 * This file now re-exports from the new location to maintain backward compatibility.
 */

export { useUniswapV2Liquidity } from '../features/liquidity'
export type { LiquidityPool, LPToken } from '../features/liquidity'
