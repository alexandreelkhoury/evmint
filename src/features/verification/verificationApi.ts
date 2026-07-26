import type { VerificationParams, VerificationResult, VerificationStatusResult, ExplorerApiResponse } from './types'
import { buildVerificationUrl, buildStatusCheckUrl, getApiKey, isVerificationSupported, getChainName, isBlockscoutChain } from './explorerConfig'
import { COMPILER_OPTIMIZATION, EVM_VERSION, CODE_FORMAT, LICENSE_TYPE, VIA_IR, API_STATUS } from './constants'

/**
 * API interaction utilities for contract verification
 * Uses Etherscan V2 unified API for all chains
 */

/**
 * Verifies a deployed contract using Etherscan V2 API
 * Single endpoint supports all EVM chains via chainid parameter
 */
export async function verifyContract(params: VerificationParams): Promise<VerificationResult> {
  const { contractAddress, sourceCode, contractName, compilerVersion, constructorArguments, chainId } = params

  // Validate supported networks
  if (!isVerificationSupported(chainId)) {
    return { success: false, isVerified: false, message: 'Unsupported network for verification' }
  }

  const apiKey = getApiKey(chainId)
  if (!apiKey && !isBlockscoutChain(chainId)) {
    const chainName = getChainName(chainId)
    return {
      success: false,
      isVerified: false,
      message: `Etherscan API key not configured. Please add VITE_ETHERSCAN_API_KEY to your environment variables to verify contracts on ${chainName}.`
    }
  }

  try {
    const url = buildVerificationUrl(chainId, apiKey)

    const formData = new FormData()
    formData.append('contractaddress', contractAddress)
    formData.append('sourceCode', sourceCode)
    formData.append('codeformat', CODE_FORMAT)
    formData.append('contractname', contractName)
    formData.append('compilerversion', compilerVersion)
    formData.append('optimizationUsed', COMPILER_OPTIMIZATION.enabled ? '1' : '0')
    formData.append('runs', COMPILER_OPTIMIZATION.runs.toString())
    formData.append('constructorArguments', constructorArguments)
    formData.append('evmversion', EVM_VERSION)
    formData.append('viaIR', VIA_IR ? 'true' : 'false')
    formData.append('licenseType', LICENSE_TYPE)

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const result: ExplorerApiResponse = await response.json()

    if (result.status === API_STATUS.SUCCESS) {
      return {
        success: true,
        isVerified: true,
        message: 'Contract verification submitted successfully',
        guid: result.result
      }
    } else {
      return {
        success: false,
        isVerified: false,
        message: result.result || result.message || 'Verification failed'
      }
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown verification error'
    return {
      success: false,
      isVerified: false,
      message: errorMessage.includes('Failed to fetch')
        ? 'Network error - verification may need to be done manually'
        : errorMessage
    }
  }
}

/**
 * Checks the status of a contract verification
 * Uses Etherscan V2 unified API
 */
export async function checkVerificationStatus(guid: string, chainId: number): Promise<VerificationStatusResult> {
  const apiKey = getApiKey(chainId)
  if (!apiKey && !isBlockscoutChain(chainId)) {
    return { success: false, message: 'API configuration missing', status: 'failed' }
  }

  if (!isVerificationSupported(chainId)) {
    return { success: false, message: 'Unsupported network', status: 'failed' }
  }

  try {
    const url = buildStatusCheckUrl(chainId, guid, apiKey)

    const response = await fetch(url)
    const result: ExplorerApiResponse = await response.json()

    if (result.status === API_STATUS.SUCCESS) {
      return { success: true, message: 'Contract verified successfully!', status: 'success' }
    } else if (result.result === 'Pending in queue') {
      return { success: true, message: 'Verification pending...', status: 'pending' }
    } else {
      return { success: false, message: result.result || 'Verification failed', status: 'failed' }
    }

  } catch (error) {
    return { success: false, message: 'Failed to check verification status', status: 'failed' }
  }
}
