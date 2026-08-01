import type {
  VerificationParams,
  VerificationResult,
  VerificationStatusResult,
  VerificationPollOptions,
  ExplorerApiResponse
} from './types'
import { buildVerificationUrl, buildStatusCheckUrl, getApiKey, isVerificationSupported, getChainName, isBlockscoutChain } from './explorerConfig'
import { COMPILER_OPTIMIZATION, EVM_VERSION, CODE_FORMAT, LICENSE_TYPE, VIA_IR, API_STATUS } from './constants'

/**
 * API interaction utilities for contract verification
 * Uses Etherscan V2 unified API for all chains
 */

/** Delay between verification status checks */
const POLL_INTERVAL_MS = 4000

/** Hard cap on how long we wait for the explorer to finish a verification job */
const POLL_TIMEOUT_MS = 120000

/**
 * Sleep that resolves early when the supplied signal aborts
 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    if (signal?.aborted) {
      resolve()
      return
    }

    const onAbort = () => {
      clearTimeout(timer)
      resolve()
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * Verifies a deployed contract using Etherscan V2 API
 * Single endpoint supports all EVM chains via chainid parameter
 *
 * NOTE: a successful response here only means the explorer QUEUED the job.
 * Callers must poll `pollVerificationStatus` with the returned guid before
 * telling the user anything is verified.
 */
export async function verifyContract(params: VerificationParams): Promise<VerificationResult> {
  const { contractAddress, sourceCode, contractName, compilerVersion, constructorArguments, chainId, signal } = params

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
      body: formData,
      signal
    })

    const result: ExplorerApiResponse = await response.json()

    if (result.status === API_STATUS.SUCCESS) {
      // The explorer accepted the submission — it has NOT compiled/compared anything yet.
      // isVerified stays false until checkVerificationStatus says otherwise.
      return {
        success: true,
        isVerified: false,
        message: 'Contract verification submitted - awaiting explorer confirmation',
        guid: result.result
      }
    }

    const explorerMessage = result.result || result.message || 'Verification failed'

    // Re-submitting a contract the explorer already knows about comes back as a
    // failure status, but it genuinely is verified.
    if (/already verified/i.test(explorerMessage)) {
      return {
        success: true,
        isVerified: true,
        message: 'Contract source code is already verified'
      }
    }

    return {
      success: false,
      isVerified: false,
      message: explorerMessage
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
export async function checkVerificationStatus(
  guid: string,
  chainId: number,
  signal?: AbortSignal
): Promise<VerificationStatusResult> {
  const apiKey = getApiKey(chainId)
  if (!apiKey && !isBlockscoutChain(chainId)) {
    return { success: false, message: 'API configuration missing', status: 'failed' }
  }

  if (!isVerificationSupported(chainId)) {
    return { success: false, message: 'Unsupported network', status: 'failed' }
  }

  try {
    const url = buildStatusCheckUrl(chainId, guid, apiKey)

    const response = await fetch(url, { signal })
    const result: ExplorerApiResponse = await response.json()

    if (result.status === API_STATUS.SUCCESS) {
      return { success: true, message: 'Contract verified successfully!', status: 'success' }
    }

    const explorerMessage = result.result || result.message || 'Verification failed'

    // Etherscan reports "Pending in queue"; Blockscout reports "Pending"/"In queue".
    // The contract can also briefly be unindexed right after deployment.
    if (/pending|in queue|unable to locate contractcode/i.test(explorerMessage)) {
      return { success: true, message: 'Verification pending...', status: 'pending' }
    }

    if (/already verified/i.test(explorerMessage)) {
      return { success: true, message: 'Contract source code is already verified', status: 'success' }
    }

    return { success: false, message: explorerMessage, status: 'failed' }

  } catch (error) {
    if (signal?.aborted) {
      return { success: false, message: 'Verification check cancelled', status: 'pending' }
    }
    return { success: false, message: 'Failed to check verification status', status: 'failed' }
  }
}

/**
 * Polls a queued verification job until the explorer reaches a terminal state.
 *
 * Guaranteed to terminate: every iteration either returns or sleeps for
 * `intervalMs`, and the loop is bounded by `timeoutMs` (and by `signal`).
 * A timeout resolves to `failed` — "not verified yet" is the honest thing to
 * tell the user, and the caller can offer a retry.
 */
export async function pollVerificationStatus(
  guid: string,
  chainId: number,
  options: VerificationPollOptions = {}
): Promise<VerificationStatusResult> {
  const {
    intervalMs = POLL_INTERVAL_MS,
    timeoutMs = POLL_TIMEOUT_MS,
    signal,
    onPoll
  } = options

  const deadline = Date.now() + timeoutMs

  while (!signal?.aborted && Date.now() < deadline) {
    // Wait first — the explorer never has a result immediately after submission
    await delay(intervalMs, signal)
    if (signal?.aborted) break

    const result = await checkVerificationStatus(guid, chainId, signal)
    if (signal?.aborted) break

    onPoll?.(result)

    if (result.status !== 'pending') {
      return result
    }
  }

  if (signal?.aborted) {
    return { success: false, message: 'Verification check cancelled', status: 'pending' }
  }

  return {
    success: false,
    message: 'Verification did not complete in time - the explorer may still finish it shortly',
    status: 'failed'
  }
}
