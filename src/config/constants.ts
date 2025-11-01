/**
 * Application-wide constants
 * Centralized configuration for magic numbers, addresses, and other constants
 */

// ============================================================================
// TOKEN ADDRESSES
// ============================================================================
export const TOKEN_ADDRESSES = {
  /** Wrapped Ether (WETH) on Base - 0x4200...0006 */
  WETH: '0x4200000000000000000000000000000000000006' as const,

  /** Zero address for burn operations */
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000' as const,
} as const

// ============================================================================
// TIMEOUTS & DELAYS (in milliseconds)
// ============================================================================
export const TIMEOUTS = {
  /** Transaction confirmation timeout - 5 minutes */
  TRANSACTION_WAIT: 300000,

  /** Delay between transaction retry attempts - 2 seconds */
  TRANSACTION_RETRY_DELAY: 2000,

  /** React Query stale time - 5 minutes */
  QUERY_STALE_TIME: 300000,

  /** Toast notification display duration - 2 seconds */
  TOAST_DURATION: 2000,

  /** Polling interval for transaction status - 3 seconds */
  POLLING_INTERVAL: 3000,

  /** Wait before contract verification - 1 second */
  VERIFICATION_WAIT: 1000,

  /** Modal close animation delay - 500ms */
  MODAL_ANIMATION_DELAY: 500,

  /** Debounce delay for user input - 300ms */
  INPUT_DEBOUNCE: 300,
} as const

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================
export const RETRY_CONFIG = {
  /** Maximum number of retry attempts for transactions */
  MAX_RETRIES: 15,

  /** Maximum retry attempts for API calls */
  API_MAX_RETRIES: 3,

  /** Exponential backoff base multiplier */
  BACKOFF_MULTIPLIER: 1.5,
} as const

// ============================================================================
// STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  /** Key for storing user's created tokens */
  USER_TOKENS: 'user_tokens',

  /** Key for storing user's liquidity pools */
  USER_POOLS: 'user_pools',

  /** Key for storing custom imported tokens */
  CUSTOM_TOKENS: 'custom_tokens',

  /** Key for storing LP tokens */
  LP_TOKENS: 'lp_tokens',

  /** Key for storing user preferences */
  USER_PREFERENCES: 'user_preferences',

  /** Storage version for migration purposes */
  STORAGE_VERSION: 'storage_version',
} as const

// Current storage version for data migration
export const CURRENT_STORAGE_VERSION = 1

// ============================================================================
// FEE CONFIGURATION
// ============================================================================
export const FEES = {
  /** Token deployment fee in ETH */
  DEPLOYMENT_FEE: 0.02,

  /** Default slippage tolerance (0.5%) */
  SLIPPAGE_TOLERANCE: 0.5,

  /** Max slippage tolerance allowed (5%) */
  MAX_SLIPPAGE: 5,

  /** Uniswap V2 LP fee (0.3%) */
  UNISWAP_LP_FEE: 0.3,
} as const

// ============================================================================
// TRANSACTION LIMITS
// ============================================================================
export const LIMITS = {
  /** Minimum amount for liquidity addition */
  MIN_LIQUIDITY_AMOUNT: 0.0001,

  /** Maximum decimals for token amounts */
  MAX_DECIMALS: 18,

  /** Default token decimals */
  DEFAULT_DECIMALS: 18,

  /** Maximum token name length */
  MAX_TOKEN_NAME_LENGTH: 50,

  /** Maximum token symbol length */
  MAX_TOKEN_SYMBOL_LENGTH: 10,

  /** Maximum token supply (2^256 - 1) */
  MAX_TOKEN_SUPPLY: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
} as const

// ============================================================================
// UI CONFIGURATION
// ============================================================================
export const UI_CONFIG = {
  /** Number of tokens to show per page */
  TOKENS_PER_PAGE: 12,

  /** Number of transactions to show in history */
  TX_HISTORY_LIMIT: 50,

  /** Skeleton loader count during initial load */
  SKELETON_COUNT: 6,

  /** Animation duration for transitions (ms) */
  ANIMATION_DURATION: 300,

  /** Toast auto-dismiss delay (ms) */
  TOAST_AUTO_DISMISS: 5000,
} as const

// ============================================================================
// VALIDATION RULES
// ============================================================================
export const VALIDATION = {
  /** Ethereum address regex pattern */
  ETH_ADDRESS_REGEX: /^0x[a-fA-F0-9]{40}$/,

  /** Minimum ETH balance required for operations */
  MIN_ETH_BALANCE: 0.001,

  /** Gas limit buffer percentage */
  GAS_LIMIT_BUFFER: 1.2,
} as const

// ============================================================================
// ERROR CODES
// ============================================================================
export const ERROR_CODES = {
  USER_REJECTED: 'USER_REJECTED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

// ============================================================================
// API ENDPOINTS
// ============================================================================
export const API_ENDPOINTS = {
  /** DeFiLlama chain icons base URL */
  DEFILLAMA_ICONS: 'https://defillama.com/chain-icons',

  /** Trust Wallet assets base URL */
  TRUSTWALLET_ASSETS: 'https://raw.githubusercontent.com/trustwallet/assets/master',

  /** Dicebear avatar generator */
  DICEBEAR_API: 'https://api.dicebear.com/7.x',
} as const

// ============================================================================
// BLOCKCHAIN CONFIGURATION
// ============================================================================
export const BLOCKCHAIN_CONFIG = {
  /** Block confirmations required for finality */
  CONFIRMATIONS_REQUIRED: 1,

  /** Default gas limit for token deployment */
  DEFAULT_GAS_LIMIT: 3000000,

  /** Default gas limit for liquidity operations */
  LIQUIDITY_GAS_LIMIT: 500000,

  /** Transaction deadline (minutes from now) */
  TRANSACTION_DEADLINE_MINUTES: 20,
} as const

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
export type TokenAddress = typeof TOKEN_ADDRESSES[keyof typeof TOKEN_ADDRESSES]
