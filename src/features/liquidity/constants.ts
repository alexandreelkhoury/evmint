// Uniswap V2 Router ABI
export const ROUTER_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "amountTokenDesired", "type": "uint256"},
      {"internalType": "uint256", "name": "amountTokenMin", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETHMin", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "addLiquidityETH",
    "outputs": [
      {"internalType": "uint256", "name": "amountToken", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETH", "type": "uint256"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"}
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"},
      {"internalType": "uint256", "name": "amountTokenMin", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETHMin", "type": "uint256"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "removeLiquidityETH",
    "outputs": [
      {"internalType": "uint256", "name": "amountToken", "type": "uint256"},
      {"internalType": "uint256", "name": "amountETH", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Uniswap V2 Factory ABI
export const FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"}
    ],
    "name": "getPair",
    "outputs": [
      {"internalType": "address", "name": "pair", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"}
    ],
    "name": "createPair",
    "outputs": [
      {"internalType": "address", "name": "pair", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// LP Token ABI for balance and approval checks
export const LP_TOKEN_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token0",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      {"internalType": "uint112", "name": "_reserve0", "type": "uint112"},
      {"internalType": "uint112", "name": "_reserve1", "type": "uint112"},
      {"internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ERC20 Token ABI for approvals
export const ERC20_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [
      {"internalType": "bool", "name": "", "type": "bool"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {"internalType": "uint8", "name": "", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ============================================================================
// SLIPPAGE PROTECTION
//
// Single home for every slippage calculation in the app. There used to be three
// copies of this arithmetic (here, useAddLiquidity, SwapPanel) whose values
// happened to agree but were not tied together.
//
// The rate is ALWAYS a parameter: liquidity uses a fixed 5%, while the swap
// panel lets the user pick 0.5 / 1 / 3%. Nothing below hardcodes a rate.
// ============================================================================

/** Basis-point denominator: 10000 bps == 100%. */
export const BPS_DENOMINATOR = 10000n

/**
 * Fixed slippage tolerance for add/remove liquidity, as a percentage.
 *
 * This is the single source of truth. It is both what AddLiquidityForm shows the
 * user (imported as ADD_LIQUIDITY_SLIPPAGE_PERCENT, re-exported from
 * useAddLiquidity) and what the router is told to enforce, so the displayed
 * figure cannot drift from the enforced one.
 */
export const LIQUIDITY_SLIPPAGE_PERCENT = 5

/** 500 bps == 5%. Derived from the percentage above, never written out twice. */
export const LIQUIDITY_SLIPPAGE_BPS = BigInt(LIQUIDITY_SLIPPAGE_PERCENT * 100)

/**
 * Returns floor(expectedAmount * (10000 - slippageBps) / 10000).
 *
 * All arithmetic is bigint, so the result is always rounded DOWN — the safe
 * direction for a minimum-received value.
 */
export function applySlippageBps(expectedAmount: bigint, slippageBps: bigint): bigint {
  if (expectedAmount <= 0n) return 0n
  if (slippageBps <= 0n) return expectedAmount
  if (slippageBps >= BPS_DENOMINATOR) return 0n
  return (expectedAmount * (BPS_DENOMINATOR - slippageBps)) / BPS_DENOMINATOR
}

/** Same as applySlippageBps, for a tolerance given as a percentage (0.5 => 0.5%). */
export function applySlippagePercent(expectedAmount: bigint, slippagePercent: number): bigint {
  return applySlippageBps(expectedAmount, BigInt(Math.round(slippagePercent * 100)))
}

/**
 * Minimum-output variant used when REMOVING liquidity.
 *
 * Identical to applySlippageBps except that a genuinely non-zero expected amount
 * never yields a zero minimum. At 500 bps, floor(expected * 0.95) is zero for
 * exactly one input — expected == 1 — so the clamp raises the minimum to 1 wei,
 * i.e. 100% of the expected amount. That is STRICTER than the 5% tolerance, not
 * weaker: the minimum stays a real number the router must honour.
 *
 * Without the clamp, a dust withdrawal on a low-decimal token (6-decimal token,
 * reserve 1e9, totalSupply 1e18, lpAmount 1e9 => expectedToken == 1) produced a
 * zero minimum, which the caller correctly refuses to send — hard-blocking the
 * whole withdrawal even though the ETH side was fine.
 *
 * A zero expected amount still returns 0n so the caller fails closed.
 */
export function applyLiquidityMinimum(expectedAmount: bigint, slippageBps: bigint = LIQUIDITY_SLIPPAGE_BPS): bigint {
  if (expectedAmount <= 0n) return 0n
  // A tolerance of 100% or more is no protection at all — do not clamp it up.
  if (slippageBps >= BPS_DENOMINATOR) return 0n
  const minimum = applySlippageBps(expectedAmount, slippageBps)
  return minimum > 0n ? minimum : 1n
}

// ============================================================================
// TRANSACTION ERROR CLASSIFICATION
//
// One classifier and one copy table for the whole liquidity/swap surface. This
// used to be duplicated three times (useUniswapV2Liquidity.getErrorType,
// TransactionProgressModal.describeTransactionError, SwapPanel's inline map),
// and the modal re-classified the string the hook had already translated — so
// the same wallet rejection produced different copy depending on which layer
// rendered it.
//
// Rule: classify the RAW error exactly once, then render from the table below.
// Never feed a translated string back into the classifier.
// ============================================================================

export type TransactionErrorType =
  | 'USER_FACING'
  | 'USER_REJECTED'
  | 'ALLOWANCE_ERROR'
  | 'INSUFFICIENT_NATIVE'
  | 'INSUFFICIENT_TOKEN'
  | 'NETWORK_ERROR'
  | 'GAS_ERROR'
  | 'SLIPPAGE_ERROR'
  | 'DEADLINE_ERROR'
  | 'CONTRACT_ERROR'
  | 'UNKNOWN'

/**
 * An error whose message is ALREADY final, user-facing copy.
 *
 * The preflight checks in the liquidity/swap hooks produce these deliberately
 * worded messages; the UI renders them verbatim rather than running them back
 * through the classifier (which would flatten "…rounds to zero at the selected
 * slippage" into the generic slippage copy, and so on).
 */
export class UserFacingError extends Error {
  readonly title: string

  constructor(body: string, title: string = 'Transaction failed') {
    super(body)
    this.name = 'UserFacingError'
    this.title = title
  }
}

export interface TransactionErrorCopy {
  type: TransactionErrorType
  title: string
  body: string
}

/** Lowercased haystack combining message + viem's shortMessage. */
function errorText(error: unknown): string {
  const e = error as { message?: string; shortMessage?: string } | null
  return `${e?.message || ''} ${e?.shortMessage || ''}`.toLowerCase()
}

/** The developer-facing text, for logs and the deterministic reference code. */
export function rawErrorMessage(error: unknown): string {
  const e = error as { message?: string; shortMessage?: string } | null
  return e?.message || e?.shortMessage || ''
}

/**
 * Classify a RAW error from the wallet, the RPC, or one of our own preflight
 * checks. Order matters and is deliberate:
 *
 *  - approval/allowance is tested before either balance case, because allowance
 *    errors also contain the word "insufficient"
 *  - native-currency shortfall is tested before token shortfall, because
 *    "insufficient funds" is the wallet's wording for gas/value, not for the
 *    ERC20 being deposited
 */
export function classifyTransactionError(error: unknown): TransactionErrorType {
  if (!error) return 'UNKNOWN'
  if (error instanceof UserFacingError) return 'USER_FACING'

  const code = (error as { code?: number | string }).code
    ?? (error as { cause?: { code?: number | string } }).cause?.code

  if (code === 4001 || code === 'ACTION_REJECTED' || code === 'TRANSACTION_REJECTED') {
    return 'USER_REJECTED'
  }

  const message = errorText(error)

  if (
    message.includes('user rejected') ||
    message.includes('user denied') ||
    message.includes('user cancelled') ||
    message.includes('cancelled by user') ||
    message.includes('transaction was rejected') ||
    message.includes('rejected the request')
  ) {
    return 'USER_REJECTED'
  }

  if (
    message.includes('allowance') ||
    message.includes('not approved') ||
    message.includes('approval')
  ) {
    return 'ALLOWANCE_ERROR'
  }

  if (
    message.includes('insufficient funds') ||
    message.includes('exceeds the balance of the account')
  ) {
    return 'INSUFFICIENT_NATIVE'
  }

  if (
    message.includes('have enough tokens') ||
    message.includes('insufficient token balance') ||
    message.includes('transfer amount exceeds balance')
  ) {
    return 'INSUFFICIENT_TOKEN'
  }

  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('connection') ||
    message.includes('fetch') ||
    message.includes('rpc')
  ) {
    return 'NETWORK_ERROR'
  }

  if (
    message.includes('gas') ||
    message.includes('out of gas') ||
    message.includes('gas estimate') ||
    message.includes('gas limit')
  ) {
    return 'GAS_ERROR'
  }

  if (
    message.includes('slippage') ||
    message.includes('insufficient_output_amount') ||
    message.includes('insufficient_a_amount') ||
    message.includes('insufficient_b_amount')
  ) {
    return 'SLIPPAGE_ERROR'
  }

  if (message.includes('deadline')) {
    return 'DEADLINE_ERROR'
  }

  if (
    message.includes('revert') ||
    message.includes('execution reverted') ||
    message.includes('insufficient') ||
    message.includes('liquidity')
  ) {
    return 'CONTRACT_ERROR'
  }

  return 'UNKNOWN'
}

/**
 * The one copy table. `nativeSymbol` is the chain's native currency ticker.
 *
 * Every string here already existed somewhere in the app before consolidation —
 * they were written deliberately and are reproduced verbatim.
 */
export function getTransactionErrorCopy(error: unknown, nativeSymbol: string = 'ETH'): TransactionErrorCopy {
  if (error instanceof UserFacingError) {
    return { type: 'USER_FACING', title: error.title, body: error.message }
  }

  const type = classifyTransactionError(error)

  switch (type) {
    case 'USER_REJECTED':
      return {
        type,
        title: 'Transaction cancelled',
        body: "No funds were moved. You can try again whenever you're ready."
      }
    case 'ALLOWANCE_ERROR':
      return {
        type,
        title: 'Approval incomplete',
        body: "Approval didn't go through. Your wallet may have replaced or dropped the approval transaction — try again, and confirm both prompts."
      }
    case 'INSUFFICIENT_NATIVE':
      return {
        type,
        title: 'Transaction failed',
        body: `Not enough ${nativeSymbol} to cover this transaction.`
      }
    case 'INSUFFICIENT_TOKEN':
      return {
        type,
        title: 'Transaction failed',
        body: "You don't have enough of this token for the amount you entered."
      }
    case 'NETWORK_ERROR':
      return {
        type,
        title: 'Network error',
        body: 'Network error occurred. Please check your connection and try again.'
      }
    case 'GAS_ERROR':
      return {
        type,
        title: 'Transaction failed',
        body: 'Gas estimation failed. The transaction may require more gas than expected or the contract interaction may fail.'
      }
    case 'SLIPPAGE_ERROR':
      return {
        type,
        title: 'Price moved',
        body: 'Price moved past your slippage tolerance and the transaction was reverted — no funds were taken. Try again, or raise the slippage setting.'
      }
    case 'DEADLINE_ERROR':
      return {
        type,
        title: 'Transaction failed',
        body: 'Transaction deadline exceeded. Please try again.'
      }
    case 'CONTRACT_ERROR':
      return {
        type,
        title: 'Transaction failed',
        body: 'Smart contract interaction failed. Please check your transaction parameters and try again.'
      }
    default:
      return {
        type: 'UNKNOWN',
        title: 'Transaction failed',
        body: 'Something went wrong with this transaction.'
      }
  }
}

// Storage keys
export const LIQUIDITY_STORAGE_KEY = 'evmint_uniswapV2Pools'
export const LP_TOKENS_STORAGE_KEY = 'evmint_lpTokens'
