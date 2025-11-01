// Enhanced token form validation utilities with comprehensive security
// Integrates with the advanced validation system in validation.ts

import { 
  TokenValidationSchema, 
  validateTokenData, 
  validateField, 
  type TokenValidationResult,
  type ValidationError 
} from './validation'

// Re-export types for backward compatibility
export type TokenFormData = TokenValidationResult

export interface TokenFormErrors {
  name?: string
  symbol?: string
  decimals?: string
  totalSupply?: string
  security?: string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: TokenFormErrors
}

/**
 * Enhanced validation function using the comprehensive validation system
 * Replaces the basic validation with security-focused validation
 */
export const validateTokenForm = (formData: TokenFormData): TokenFormErrors => {
  const errors: TokenFormErrors = {}
  
  try {
    // Use the comprehensive validation system
    const validationResult = validateTokenData(formData)
    
    if (!validationResult.success) {
      // Map validation errors to form errors
      validationResult.errors.forEach((error: ValidationError) => {
        switch (error.field) {
          case 'name':
            errors.name = error.message
            break
          case 'symbol':
            errors.symbol = error.message
            break
          case 'totalSupply':
            errors.totalSupply = error.message
            break
          case 'decimals':
            errors.decimals = error.message
            break
          default:
            // Handle unknown fields
            if (!errors.security) errors.security = []
            errors.security.push(error.message)
        }
      })
    }
  } catch (error) {
    // Fallback error handling
    if (!errors.security) errors.security = []
    errors.security.push('Validation system error. Please try again.')
  }
  
  return errors
}

/**
 * Simple validation - just check if the form is valid for deployment
 */
export const validateTokenFormEnhanced = (formData: TokenFormData): ValidationResult => {
  const errors = validateTokenForm(formData)
  const isValid = isTokenFormValid(errors)
  
  return {
    isValid,
    errors
  }
}

/**
 * Real-time field validation for better UX
 */
export const validateTokenField = (field: keyof TokenFormData, value: any): {
  isValid: boolean
  error?: string
} => {
  try {
    const result = validateField(field, value)
    
    return {
      isValid: result.isValid,
      error: result.error
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Validation error occurred'
    }
  }
}

/**
 * Checks if the form has any validation errors
 * Simple check - no security concerns
 */
export const isTokenFormValid = (errors: TokenFormErrors): boolean => {
  // Check standard field errors only
  const hasFieldErrors = Object.keys(errors).some(key => 
    key !== 'security' && errors[key as keyof TokenFormErrors]
  )
  
  return !hasFieldErrors
}

/**
 * Default token form data with safe defaults
 */
export const defaultTokenFormData: TokenFormData = {
  name: '',
  symbol: '',
  decimals: 18,
  totalSupply: '1000000000' // 1 billion default
}

/**
 * Sanitize form data before submission
 * Ensures all data is properly cleaned and formatted
 */
export const sanitizeTokenFormData = (formData: TokenFormData): TokenFormData => {
  try {
    const validationResult = validateTokenData(formData)
    
    if (validationResult.success) {
      return validationResult.data
    } else {
      // Return original data if validation fails (errors will be shown)
      return formData
    }
  } catch (error) {
    console.error('Sanitization failed:', error)
    return formData
  }
}

/**
 * Get validation summary for display
 */
export const getValidationSummary = (formData: TokenFormData): {
  status: 'valid' | 'invalid'
  message: string
  details?: string[]
} => {
  const validation = validateTokenFormEnhanced(formData)
  
  if (!validation.isValid) {
    const errorCount = Object.keys(validation.errors).length
    return {
      status: 'invalid',
      message: `Please fix ${errorCount} validation error${errorCount !== 1 ? 's' : ''}`,
      details: Object.values(validation.errors).flat().filter(Boolean)
    }
  }
  
  return {
    status: 'valid',
    message: 'Token parameters validated successfully'
  }
}