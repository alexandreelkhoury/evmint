import { useState, useCallback, useEffect } from 'react'
import { 
  type TokenFormData, 
  type TokenFormErrors, 
  type ValidationResult,
  validateTokenForm, 
  validateTokenFormEnhanced,
  validateTokenField,
  isTokenFormValid, 
  defaultTokenFormData,
  sanitizeTokenFormData,
  getValidationSummary
} from '../utils/tokenValidation'

interface FieldValidation {
  isValid: boolean
  error?: string
}

interface FormValidationState {
  isValid: boolean
  errors: TokenFormErrors
  summary: {
    status: 'valid' | 'invalid'
    message: string
    details?: string[]
  }
}

/**
 * Enhanced custom hook for managing token form state and validation
 * Includes comprehensive security validation, real-time feedback, and sanitization
 */
export function useTokenForm() {
  const [formData, setFormData] = useState<TokenFormData>(defaultTokenFormData)
  const [formErrors, setFormErrors] = useState<TokenFormErrors>({})
  const [fieldValidations, setFieldValidations] = useState<Record<keyof TokenFormData, FieldValidation>>({
    name: { isValid: true },
    symbol: { isValid: true },
    decimals: { isValid: true },
    totalSupply: { isValid: true }
  })
  const [touchedFields, setTouchedFields] = useState<Record<keyof TokenFormData, boolean>>({
    name: false,
    symbol: false,
    decimals: false,
    totalSupply: false
  })
  const [validationState, setValidationState] = useState<FormValidationState>({
    isValid: false,
    errors: {},
    summary: { status: 'invalid', message: 'Please fill in all required fields' }
  })
  const [isValidating, setIsValidating] = useState(false)

  // Real-time field validation
  const validateSingleField = useCallback((field: keyof TokenFormData, value: any) => {
    const validation = validateTokenField(field, value)
    setFieldValidations(prev => ({
      ...prev,
      [field]: validation
    }))
    
    // Clear form error for this field if it's now valid
    if (validation.isValid && formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    return validation
  }, [formErrors])

  // Handle input changes with real-time validation and sanitization
  const handleInputChange = useCallback((field: keyof TokenFormData, value: string | number) => {
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    
    // Sanitize input based on field type
    let sanitizedValue = value
    
    if (field === 'symbol' && typeof value === 'string') {
      // Auto-uppercase symbol and remove invalid characters
      sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    } else if (field === 'totalSupply' && typeof value === 'string') {
      // Remove any non-numeric characters except numbers
      sanitizedValue = value.replace(/[^0-9]/g, '')
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }))
    
    // Only perform validation if field has been touched and has content
    if (sanitizedValue !== '' && sanitizedValue !== 0) {
      validateSingleField(field, sanitizedValue)
    } else {
      // Clear any existing errors when field is empty
      setFieldValidations(prev => ({
        ...prev,
        [field]: { isValid: true }
      }))
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [validateSingleField])

  // Enhanced form validation with security analysis
  const validateForm = useCallback(() => {
    setIsValidating(true)
    
    try {
      const enhancedValidation = validateTokenFormEnhanced(formData)
      const summary = getValidationSummary(formData)
      
      setFormErrors(enhancedValidation.errors)
      setValidationState({
        isValid: enhancedValidation.isValid,
        errors: enhancedValidation.errors,
        summary
      })
      
      return enhancedValidation.isValid
    } catch (error) {
      console.error('Form validation failed:', error)
      const errorState = {
        isValid: false,
        errors: { security: ['Validation system error'] },
        summary: { status: 'invalid' as const, message: 'Validation error occurred' }
      }
      setValidationState(errorState)
      return false
    } finally {
      setIsValidating(false)
    }
  }, [formData])

  // Sanitize and prepare data for submission
  const getSanitizedFormData = useCallback(() => {
    return sanitizeTokenFormData(formData)
  }, [formData])

  // Reset form to defaults
  const resetForm = useCallback(() => {
    setFormData(defaultTokenFormData)
    setFormErrors({})
    setFieldValidations({
      name: { isValid: true },
      symbol: { isValid: true },
      decimals: { isValid: true },
      totalSupply: { isValid: true }
    })
    setValidationState({
      isValid: false,
      errors: {},
      summary: { status: 'invalid', message: 'Please fill in all required fields' }
    })
  }, [])

  // Auto-validate form when data changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.values(formData).some(value => value !== '' && value !== 0)) {
        validateForm()
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [formData, validateForm])

  // Get current validation state
  const isValid = isTokenFormValid(formErrors) && validationState.isValid

  // Get field-specific validation info
  const getFieldValidation = useCallback((field: keyof TokenFormData) => {
    return {
      ...fieldValidations[field],
      hasError: !!(formErrors[field] && touchedFields[field])
    }
  }, [fieldValidations, formErrors, touchedFields])


  return {
    // Form state
    formData,
    formErrors,
    validationState,
    fieldValidations,
    
    // Form actions
    handleInputChange,
    validateForm,
    resetForm,
    getSanitizedFormData,
    
    // Validation utilities
    validateSingleField,
    getFieldValidation,
    touchedFields,
    
    // Computed state
    isValid,
    isValidating,
    summary: validationState.summary,
    
    // Legacy compatibility
    setFormData,
    setFormErrors
  }
}