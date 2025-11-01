import type { VerificationParams, VerificationResult, VerificationStatusResult, ExplorerApiResponse } from './types'
import { buildVerificationUrl, buildStatusCheckUrl, getApiKey, getApiUrl, isVerificationSupported, getChainName } from './explorerConfig'
import { COMPILER_OPTIMIZATION, EVM_VERSION, CODE_FORMAT, LICENSE_TYPE, VIA_IR, API_STATUS } from './constants'

/**
 * API interaction utilities for contract verification
 */

/**
 * Verifies a deployed contract using block explorer API
 * Supports Etherscan V2 API and compatible explorers
 */
export async function verifyContract(params: VerificationParams): Promise<VerificationResult> {
  const { contractAddress, sourceCode, contractName, compilerVersion, constructorArguments, chainId } = params

  // Validate supported networks
  if (!isVerificationSupported(chainId)) {
    return { success: false, isVerified: false, message: 'Unsupported network for verification' }
  }

  const apiKey = getApiKey(chainId)
  if (!apiKey) {
    const chainName = getChainName(chainId)
    return {
      success: false,
      isVerified: false,
      message: `Block explorer API key not configured for ${chainName}. Please add the API key to your environment variables.`
    }
  }

  const apiUrl = getApiUrl(chainId)
  if (!apiUrl) {
    return { success: false, isVerified: false, message: 'Block explorer API not available for this network' }
  }

  try {
    const url = buildVerificationUrl(chainId, apiKey)
    if (!url) {
      return { success: false, isVerified: false, message: 'Failed to build verification URL' }
    }

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
 * Polls the block explorer API to check if verification has completed
 */
export async function checkVerificationStatus(guid: string, chainId: number): Promise<VerificationStatusResult> {
  const apiKey = getApiKey(chainId)
  if (!apiKey) {
    return { success: false, message: 'API configuration missing', status: 'failed' }
  }

  if (!isVerificationSupported(chainId)) {
    return { success: false, message: 'Unsupported network', status: 'failed' }
  }

  const apiUrl = getApiUrl(chainId)
  if (!apiUrl) {
    return { success: false, message: 'Block explorer API not available', status: 'failed' }
  }

  try {
    const url = buildStatusCheckUrl(chainId, guid, apiKey)
    if (!url) {
      return { success: false, message: 'Failed to build status check URL', status: 'failed' }
    }

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
