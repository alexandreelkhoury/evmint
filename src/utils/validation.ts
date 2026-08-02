import { z } from 'zod'

// ===================================
// COMPREHENSIVE TOKEN VALIDATION SCHEMAS
// ===================================

// Simple sanitization - only trim whitespace
export const sanitizeString = (input: string): string => {
  return input.trim()
}

// ===================================
// ZOD VALIDATION SCHEMAS
// ===================================

// Token name validation - only check what would break contract deployment
const tokenNameSchema = z
  .string()
  .min(1, 'Token name is required')
  .max(50, 'Token name must be 50 characters or less')
  .transform((val) => val.trim())

// Token symbol validation - only check what would break contract deployment
const tokenSymbolSchema = z
  .string()
  .min(1, 'Token symbol is required')
  .max(50, 'Token symbol must be 50 characters or less')
  .transform((val) => val.trim().toUpperCase())

// Total supply validation - only check what would break contract deployment
const totalSupplySchema = z
  .string()
  .min(1, 'Total supply is required')
  .transform((val) => val.trim())
  .refine((val) => /^\d+$/.test(val), 'Total supply must be a positive integer')
  .refine((val) => {
    try {
      const supply = BigInt(val)
      return supply >= 1n && supply <= BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935') // uint256 max
    } catch {
      return false
    }
  }, 'Total supply must be between 1 and max uint256')

// Decimals validation with standard constraints
const decimalsSchema = z
  .number()
  .int('Decimals must be a whole number')
  .min(0, 'Decimals cannot be negative')
  .max(18, 'Decimals cannot exceed 18')

// ===================================
// MAIN TOKEN VALIDATION SCHEMA
// ===================================

export const TokenValidationSchema = z.object({
  name: tokenNameSchema,
  symbol: tokenSymbolSchema,
  totalSupply: totalSupplySchema,
  decimals: decimalsSchema
}).strict() // Prevent additional properties

// ===================================
// VALIDATION RESULT TYPES
// ===================================

export type TokenValidationResult = z.infer<typeof TokenValidationSchema>

export interface ValidationError {
  field: string
  message: string
  code: string
}

// ===================================
// VALIDATION FUNCTIONS
// ===================================

export const validateTokenData = (data: unknown): { 
  success: true; 
  data: TokenValidationResult 
} | { 
  success: false; 
  errors: ValidationError[] 
} => {
  try {
    const validatedData = TokenValidationSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
      return { success: false, errors }
    }
    return { 
      success: false, 
      errors: [{ field: 'unknown', message: 'Validation failed', code: 'unknown' }] 
    }
  }
}

// Real-time field validation for better UX
export const validateField = (field: keyof TokenValidationResult, value: any): {
  isValid: boolean
  error?: string
} => {
  try {
    switch (field) {
      case 'name':
        tokenNameSchema.parse(value)
        break
      case 'symbol':
        tokenSymbolSchema.parse(value)
        break
      case 'totalSupply':
        totalSupplySchema.parse(value)
        break
      case 'decimals':
        decimalsSchema.parse(value)
        break
      default:
        return { isValid: false, error: 'Unknown field' }
    }
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Validation failed' }
    }
    return { isValid: false, error: 'Validation failed' }
  }
}



// Export validation constants for testing
export const VALIDATION_CONSTANTS = {
  MAX_NAME_LENGTH: 50,
  MAX_SYMBOL_LENGTH: 50,
  MAX_DECIMALS: 18,
  MAX_SUPPLY: BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935') // uint256 max
} as const

// ===================================
// ADDRESS VALIDATION
// ===================================

/**
 * Ethereum address format regex
 * Matches: 0x followed by 40 hexadecimal characters
 */
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

/**
 * Check if a string is a valid Ethereum address format
 * @param address - The address string to validate
 * @returns true if valid Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }
  return ETH_ADDRESS_REGEX.test(address.trim())
}

/**
 * Validate and format an Ethereum address
 * @param address - The address to validate
 * @returns Formatted lowercase address
 * @throws Error if address is invalid
 */
export function validateAndFormatAddress(address: string): string {
  const trimmed = address.trim()

  if (!trimmed) {
    throw new Error('Address is required')
  }

  if (!isValidEthereumAddress(trimmed)) {
    throw new Error('Invalid Ethereum address format. Must be 0x followed by 40 hexadecimal characters.')
  }

  // Normalize to lowercase
  return trimmed.toLowerCase()
}

/**
 * Case-insensitive Ethereum address equality.
 *
 * The same contract reaches the UI in three different shapes: EIP-55
 * checksummed (viem / RPC responses and most block-explorer copy buttons),
 * all-lowercase (validateAndFormatAddress, localStorage records written by
 * older builds), and whatever mixed casing the user pasted. `===` treats those
 * as different contracts, which is how the wrong leg of a pair gets picked.
 *
 * Deliberately never throws — this is called inside renders, so a missing or
 * malformed address must simply not match rather than blow up the tree. (This
 * is why it is not viem's getAddress/isAddressEqual, both of which throw on
 * anything that is not a well-formed address.)
 */
export function isSameAddress(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

/**
 * Check if address is the zero address
 */
export function isZeroAddress(address: string): boolean {
  return address.toLowerCase() === '0x0000000000000000000000000000000000000000'
}

/**
 * Check if address is a valid contract address (not zero address)
 */
export function isValidContractAddress(address: string): boolean {
  return isValidEthereumAddress(address) && !isZeroAddress(address)
}

// ===================================
// AMOUNT VALIDATION
// ===================================

/**
 * Check if amount string is valid number format
 */
export function isValidAmount(amount: string): boolean {
  if (!amount || typeof amount !== 'string') {
    return false
  }

  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Validate numeric amount
 * @param amount - Amount as string
 * @param fieldName - Field name for error message
 * @returns Validated amount as number
 * @throws Error if invalid
 */
export function validateAmount(amount: string, fieldName: string = 'amount'): number {
  if (!amount || amount.trim() === '') {
    throw new Error(`${fieldName} is required`)
  }

  const num = parseFloat(amount)

  if (isNaN(num)) {
    throw new Error('Please enter a valid number')
  }

  if (!isFinite(num)) {
    throw new Error('Amount must be a finite number')
  }

  if (num <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  return num
}