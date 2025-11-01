/**
 * Application error type definitions
 * Provides type-safe error handling across the application
 */

import { ERROR_CODES } from '../config/constants'

// ============================================================================
// BASE ERROR TYPES
// ============================================================================

/**
 * Base application error with additional context
 */
export interface AppError extends Error {
  code: string
  context?: Record<string, unknown>
  timestamp: number
}

/**
 * Transaction-related errors from blockchain operations
 */
export interface TransactionError extends Error {
  code?: string
  reason?: string
  transaction?: {
    to?: string
    from?: string
    data?: string
    value?: string
  }
  receipt?: unknown
  cause?: unknown
}

/**
 * Network and RPC errors
 */
export interface NetworkError extends Error {
  chainId?: number
  expectedChainId?: number
  code?: string | number
  details?: string
}

/**
 * Validation errors for form inputs
 */
export interface ValidationError extends Error {
  field: string
  value: unknown
  rule: string
}

/**
 * Contract interaction errors
 */
export interface ContractError extends Error {
  contractAddress: string
  method: string
  args?: unknown[]
  code?: string
}

/**
 * User action errors (rejections, cancellations)
 */
export interface UserActionError extends Error {
  action: 'rejected' | 'cancelled' | 'timeout'
  context?: string
}

// ============================================================================
// ERROR GUARDS
// ============================================================================

/**
 * Type guard to check if error is a transaction error
 */
export function isTransactionError(error: unknown): error is TransactionError {
  return (
    error instanceof Error &&
    ('transaction' in error || 'receipt' in error || 'reason' in error)
  )
}

/**
 * Type guard to check if error is a network error
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return (
    error instanceof Error &&
    ('chainId' in error || 'expectedChainId' in error)
  )
}

/**
 * Type guard to check if error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    error instanceof Error &&
    'field' in error &&
    'value' in error
  )
}

/**
 * Type guard to check if error is a contract error
 */
export function isContractError(error: unknown): error is ContractError {
  return (
    error instanceof Error &&
    'contractAddress' in error &&
    'method' in error
  )
}

/**
 * Type guard for user action errors (rejected transactions, etc.)
 */
export function isUserActionError(error: unknown): error is UserActionError {
  const errorMsg = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    errorMsg.includes('user rejected') ||
    errorMsg.includes('user denied') ||
    errorMsg.includes('user cancelled') ||
    errorMsg.includes('cancelled by user') ||
    errorMsg.includes('rejected by user')
  )
}

/**
 * Type guard for insufficient funds errors
 */
export function isInsufficientFundsError(error: unknown): boolean {
  const errorMsg = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    errorMsg.includes('insufficient funds') ||
    errorMsg.includes('insufficient balance') ||
    errorMsg.includes('exceeds balance')
  )
}

/**
 * Type guard for gas-related errors
 */
export function isGasError(error: unknown): boolean {
  const errorMsg = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    errorMsg.includes('gas required exceeds') ||
    errorMsg.includes('out of gas') ||
    errorMsg.includes('gas limit')
  )
}

/**
 * Type guard for slippage errors
 */
export function isSlippageError(error: unknown): boolean {
  const errorMsg = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    errorMsg.includes('slippage') ||
    errorMsg.includes('price impact') ||
    errorMsg.includes('excessive slippage')
  )
}

// ============================================================================
// ERROR FACTORIES
// ============================================================================

/**
 * Create a standardized application error
 */
export function createAppError(
  message: string,
  code: keyof typeof ERROR_CODES,
  context?: Record<string, unknown>
): AppError {
  const error = new Error(message) as AppError
  error.code = ERROR_CODES[code]
  error.context = context
  error.timestamp = Date.now()
  return error
}

/**
 * Create a validation error
 */
export function createValidationError(
  field: string,
  value: unknown,
  rule: string,
  message?: string
): ValidationError {
  const error = new Error(
    message || `Validation failed for ${field}: ${rule}`
  ) as ValidationError
  error.field = field
  error.value = value
  error.rule = rule
  return error
}

/**
 * Create a contract error
 */
export function createContractError(
  contractAddress: string,
  method: string,
  originalError: Error,
  args?: unknown[]
): ContractError {
  const error = new Error(
    `Contract error calling ${method} on ${contractAddress}: ${originalError.message}`
  ) as ContractError
  error.contractAddress = contractAddress
  error.method = method
  error.args = args
  error.code = (originalError as any).code
  error.cause = originalError
  return error
}

// ============================================================================
// ERROR MESSAGE FORMATTER
// ============================================================================

/**
 * Get user-friendly error message from any error type
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'An unexpected error occurred. Please try again.'
  }

  // User action errors
  if (isUserActionError(error)) {
    return 'Transaction cancelled by user.'
  }

  // Insufficient funds
  if (isInsufficientFundsError(error)) {
    return "You don't have enough tokens or ETH. Please check your balance."
  }

  // Gas errors
  if (isGasError(error)) {
    return 'Gas limit too low or gas price too high. Try adjusting gas settings.'
  }

  // Slippage errors
  if (isSlippageError(error)) {
    return 'Price changed too much during transaction. Try increasing slippage tolerance.'
  }

  // Network errors
  if (isNetworkError(error)) {
    return `Wrong network. Please switch to ${error.expectedChainId ? `chain ID ${error.expectedChainId}` : 'the correct network'}.`
  }

  // Validation errors
  if (isValidationError(error)) {
    return error.message
  }

  // Default to error message
  return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Get error code from any error type
 */
export function getErrorCode(error: unknown): string {
  if (error instanceof Error) {
    if ('code' in error && typeof error.code === 'string') {
      return error.code
    }
  }
  return ERROR_CODES.UNKNOWN_ERROR
}

// ============================================================================
// ERROR LOGGING HELPERS
// ============================================================================

/**
 * Extract relevant error details for logging
 */
export function getErrorDetails(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { message: String(error) }
  }

  const details: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  }

  // Add transaction-specific details
  if (isTransactionError(error)) {
    details.transaction = error.transaction
    details.reason = error.reason
    details.code = error.code
  }

  // Add network-specific details
  if (isNetworkError(error)) {
    details.chainId = error.chainId
    details.expectedChainId = error.expectedChainId
  }

  // Add validation-specific details
  if (isValidationError(error)) {
    details.field = error.field
    details.value = error.value
    details.rule = error.rule
  }

  // Add contract-specific details
  if (isContractError(error)) {
    details.contractAddress = error.contractAddress
    details.method = error.method
    details.args = error.args
  }

  return details
}
