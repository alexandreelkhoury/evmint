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