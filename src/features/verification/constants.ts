/**
 * Constants for contract verification
 */

/**
 * Compiler version used for MyERC20 contract
 */
export const MYERC20_COMPILER_VERSION = 'v0.8.30+commit.73712a01'

/**
 * Contract name for MyERC20 verification
 */
export const MYERC20_CONTRACT_NAME = 'MyERC20'

/**
 * Compiler optimization settings
 */
export const COMPILER_OPTIMIZATION = {
  enabled: true,
  runs: 200,
}

/**
 * EVM version used for compilation
 */
export const EVM_VERSION = 'prague'

/**
 * Code format for verification
 */
export const CODE_FORMAT = 'solidity-single-file'

/**
 * License type (3 = MIT License)
 */
export const LICENSE_TYPE = '3'

/**
 * Via IR compilation flag
 */
export const VIA_IR = true

/**
 * Verification status types
 */
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const

/**
 * API response status codes
 */
export const API_STATUS = {
  SUCCESS: '1',
  FAILURE: '0',
} as const
