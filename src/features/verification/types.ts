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
}

/**
 * Result of a verification attempt
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
