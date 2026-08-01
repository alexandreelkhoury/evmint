/**
 * Type definitions for contract verification
 */

/**
 * Parameters required for contract verification
 */
export interface VerificationParams {
  contractAddress: string
  sourceCode: string
  contractName: string
  compilerVersion: string
  constructorArguments: string
  chainId: number
  signal?: AbortSignal
}

/**
 * Result of a verification attempt
 *
 * `success` means the explorer accepted the request.
 * `isVerified` means the explorer has actually CONFIRMED the source code matches —
 * a freshly submitted job is `success: true, isVerified: false` until the returned
 * `guid` is polled to a terminal state via `pollVerificationStatus`.
 */
export interface VerificationResult {
  success: boolean
  isVerified: boolean
  message: string
  guid?: string
}

/**
 * Status check result for a verification request
 */
export interface VerificationStatusResult {
  success: boolean
  message: string
  status: 'pending' | 'success' | 'failed'
}

/**
 * Options for polling a verification job to a terminal state
 */
export interface VerificationPollOptions {
  /** Delay between status checks (ms) */
  intervalMs?: number
  /** Hard cap on total polling time (ms) — polling always stops after this */
  timeoutMs?: number
  /** Abort polling (e.g. on component unmount) */
  signal?: AbortSignal
  /** Called after every status check, useful for progress reporting */
  onPoll?: (result: VerificationStatusResult) => void
}

/**
 * Block explorer API response structure
 */
export interface ExplorerApiResponse {
  status: string
  result: string
  message?: string
}

/**
 * Constructor parameters for MyERC20 contract
 */
export interface MyERC20ConstructorParams {
  name: string
  symbol: string
  initialSupply: bigint
  decimals: number
}
