/**
 * Shared utility functions for liquidity operations
 * Pure functions with no React dependencies
 */

import { BLOCKCHAIN_CONFIG } from '../../config/constants'

// ============================================================================
// DEADLINE CALCULATIONS
// ============================================================================

/**
 * Calculate deadline timestamp for Uniswap transactions
 * @param minutes - Minutes from now (default: 20)
 * @returns Unix timestamp in seconds
 */
export function calculateDeadline(minutes: number = BLOCKCHAIN_CONFIG.TRANSACTION_DEADLINE_MINUTES): number {
  return Math.floor(Date.now() / 1000) + minutes * 60
}

// ============================================================================
// AMOUNT CALCULATIONS
// ============================================================================

/**
 * Calculate minimum amount with slippage tolerance
 * @param amount - Amount in wei
 * @param slippagePercent - Slippage tolerance (0.5 = 0.5%)
 * @returns Minimum amount after slippage
 */
export function calculateMinAmount(amount: bigint, slippagePercent: number): bigint {
  const slippageBps = BigInt(Math.floor(slippagePercent * 100)) // Convert to basis points
  const minAmount = (amount * (10000n - slippageBps)) / 10000n
  return minAmount
}

/**
 * Apply slippage tolerance to an amount
 */
export function applySlippage(amount: bigint, slippageTolerance: number): bigint {
  return calculateMinAmount(amount, slippageTolerance)
}

// ============================================================================
// LP TOKEN PARSING
// ============================================================================

/**
 * Parse LP token address from transaction receipt logs
 * Looks for PairCreated or Mint events
 */
export function parseLPTokenAddress(receipt: any): string | null {
  // TODO: Implement LP token address parsing from receipt logs
  // Look for Mint event or PairCreated event
  // Extract pair address from logs
  return null
}

// ============================================================================
// ERROR HELPERS
// ============================================================================

/**
 * Get user-friendly error message for liquidity operations
 */
export function getLiquidityErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'An unexpected error occurred'
  }

  const message = error.message.toLowerCase()

  // User rejections
  if (message.includes('user rejected') || message.includes('user denied')) {
    return 'Transaction cancelled by user'
  }

  // Insufficient balance
  if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
    return 'Insufficient balance for this transaction'
  }

  // Gas errors
  if (message.includes('gas required exceeds') || message.includes('out of gas')) {
    return 'Gas limit too low. Try increasing gas limit.'
  }

  // Slippage
  if (message.includes('slippage') || message.includes('price')) {
    return 'Price changed too much. Try increasing slippage tolerance.'
  }

  // Deadline
  if (message.includes('expired') || message.includes('deadline')) {
    return 'Transaction deadline exceeded. Please try again.'
  }

  return error.message || 'Transaction failed'
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Check if amount is valid (positive and not zero)
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || amount.trim() === '') return false
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}
