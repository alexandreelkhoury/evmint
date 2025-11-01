/**
 * Contract Verification Module
 *
 * This module provides utilities for verifying deployed smart contracts
 * on various block explorers (Etherscan, Basescan, etc.)
 */

import { verifyContract, checkVerificationStatus } from './verificationApi'
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
 * @param chainId - Chain ID where the contract is deployed
 * @returns Promise with verification result
 */
export async function verifyContractWithEtherscan(
  contractAddress: string,
  name: string,
  symbol: string,
  initialSupply: bigint,
  decimals: number,
  chainId: number
): Promise<VerificationResult> {
  const sourceCode = getMyERC20SourceCode()
  const compilerVersion = MYERC20_COMPILER_VERSION
  const constructorArguments = encodeConstructorArguments(name, symbol, initialSupply, decimals)

  return await verifyContract({
    contractAddress,
    sourceCode,
    contractName: MYERC20_CONTRACT_NAME,
    compilerVersion,
    constructorArguments,
    chainId
  })
}

// Re-export public APIs
export { checkVerificationStatus } from './verificationApi'
export { encodeConstructorArguments } from './abiEncoder'

// Re-export types
export type {
  VerificationResult,
  VerificationParams,
  VerificationStatusResult,
  MyERC20ConstructorParams
} from './types'
