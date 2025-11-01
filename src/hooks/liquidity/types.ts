/**
 * Shared TypeScript types for liquidity hooks
 * Extracted from useUniswapV2Liquidity.ts
 */

// ============================================================================
// LP TOKEN TYPES
// ============================================================================

export interface LPToken {
  address: string
  name: string
  symbol: string
  tokenAAddress: string
  tokenBAddress: string
  tokenASymbol: string
  tokenBSymbol: string
  liquidityAmount: string
  userAddress: string
  chainId: number
  createdAt: number
}

export interface PoolData {
  lpTokenAddress: string
  tokenA: string
  tokenB: string
  liquidityAmount: string
  timestamp: number
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionStep =
  | 'idle'
  | 'approving_token'
  | 'approval_confirming'
  | 'adding_liquidity'
  | 'liquidity_confirming'
  | 'approving_lp'
  | 'lp_approval_confirming'
  | 'removing_liquidity'
  | 'removal_confirming'
  | 'success'
  | 'error'

export interface TransactionState {
  currentStep: TransactionStep
  currentTxHash?: `0x${string}`
  isLoading: boolean
  error: Error | null
}

// ============================================================================
// LIQUIDITY OPERATION TYPES
// ============================================================================

export interface AddLiquidityParams {
  tokenAddress: string
  tokenAmount: string
  ethAmount: string
  slippageTolerance?: number
  deadline?: number
}

export interface RemoveLiquidityParams {
  lpTokenAddress: string
  lpTokenAmount: string
  tokenAddress: string
  slippageTolerance?: number
  deadline?: number
}

export interface LiquidityResult {
  success: boolean
  txHash?: string
  lpTokenAddress?: string
  error?: Error
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface BalanceCheckResult {
  hasEnough: boolean
  balance: bigint
  required: bigint
}

// ============================================================================
// ALLOWANCE TYPES
// ============================================================================

export interface AllowanceInfo {
  current: bigint
  required: bigint
  needsApproval: boolean
}
