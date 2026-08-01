/**
 * Contract Verification Module
 *
 * This module provides utilities for verifying deployed smart contracts
 * on various block explorers (Etherscan, Basescan, etc.)
 */

import { verifyContract } from './verificationApi'
import { encodeConstructorArguments } from './abiEncoder'
import { getMyERC20SourceCode } from './sourceCodeFormatter'
import { MYERC20_COMPILER_VERSION, MYERC20_CONTRACT_NAME } from './constants'
import type { VerificationResult } from './types'

/**
 * Main verification function for MyERC20 contracts
 * Attempts to verify the contract on the appropriate block explorer
 *
 * @param contractAddress - Address of the deployed contract
 * @param name - Token name
 * @param symbol - Token symbol
 * @param initialSupply - Initial token supply (before decimals adjustment)
 * @param decimals - Number of decimal places
 * @param fee - Deployment fee in wei
 * @param chainId - Chain ID where the contract is deployed
 * @param signal - Optional abort signal to cancel the submission
 * @returns Promise with verification result. A `success` result with a `guid` and
 *          `isVerified: false` means the job is QUEUED — poll `pollVerificationStatus`
 *          before reporting the contract as verified.
 */
export async function verifyContractWithEtherscan(
  contractAddress: string,
  name: string,
  symbol: string,
  initialSupply: bigint,
  decimals: number,
  fee: bigint,
  chainId: number,
  signal?: AbortSignal
): Promise<VerificationResult> {
  const sourceCode = getMyERC20SourceCode()
  const compilerVersion = MYERC20_COMPILER_VERSION
  const constructorArguments = encodeConstructorArguments(name, symbol, initialSupply, decimals, fee)

  return await verifyContract({
    contractAddress,
    sourceCode,
    contractName: MYERC20_CONTRACT_NAME,
    compilerVersion,
    constructorArguments,
    chainId,
    signal
  })
}

// Re-export public APIs
export { checkVerificationStatus, pollVerificationStatus } from './verificationApi'
export { encodeConstructorArguments } from './abiEncoder'

// Re-export types
export type {
  VerificationResult,
  VerificationParams,
  VerificationStatusResult,
  VerificationPollOptions,
  MyERC20ConstructorParams
} from './types'
