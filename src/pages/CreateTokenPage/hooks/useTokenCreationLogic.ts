import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useFirebaseAnalytics } from '../../../components/FirebaseProvider'
import { useChainConfig } from '../../../hooks/useChainConfig'
import { useOpenZeppelinTokenDeployment } from '../../../hooks/useOpenZeppelinTokenDeployment'
import { useTokenForm } from '../../../hooks/useTokenForm'
import { useGlobalToasts } from '../../../App'
import {
  trackTokenResult,
  trackTokenCreation,
  trackTokenCreationError,
  trackWalletError
} from '../../../utils/analytics'
import { loggers } from '../../../utils/logger'

export function useTokenCreationLogic() {
  const analytics = useFirebaseAnalytics()
  const { ready, authenticated } = usePrivy()
  const toasts = useGlobalToasts()
  const {
    createToken,
    isCreating,
    isSuccess,
    createdTokenAddress,
    error,
    isConnected,
    isCorrectChain,
    chainId,
    isVerifying,
    feeAmount
  } = useOpenZeppelinTokenDeployment()

  // Get chain information
  const { name: chainName, isSupported, getNativeTokenName, hasDex } = useChainConfig()

  // Use enhanced token form hook with validation
  const {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    getSanitizedFormData,
    getFieldValidation
  } = useTokenForm()

  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!authenticated || !isConnected) {
      toasts.warning(
        `Please connect your wallet first to create tokens on ${chainName}`,
        '🔗 Wallet Required'
      )
      trackWalletError(analytics, 'Wallet not connected - user attempted token creation', 'create_token_attempt')
      return
    }

    try {
      // Use sanitized form data for token creation
      const sanitizedData = getSanitizedFormData()
      await createToken(sanitizedData)
      setShowSuccess(true)
    } catch (error: any) {
      loggers.ui.error('❌ EVMint - Token creation failed:', error)

      // Track detailed token creation error
      trackTokenCreationError(analytics, error, {
        name: formData.name,
        symbol: formData.symbol,
        supply: formData.totalSupply,
        decimals: formData.decimals,
        network: chainName
      })

      // Error is already handled by the hook and will be displayed
    }
  }

  // Save token to Firebase when successfully created
  useEffect(() => {
    if (isSuccess && createdTokenAddress) {
      const saveToFirebase = async () => {
        try {
          // Log analytics event
          trackTokenCreation(analytics, {
            name: formData.name,
            symbol: formData.symbol,
            supply: formData.totalSupply,
            network: chainName
          })

          // Track successful token creation
          trackTokenResult(analytics, {
            success: true,
            tokenAddress: createdTokenAddress
          })
        } catch (error) {
          loggers.ui.error('Failed to save token to Firebase:', error)
        }
      }

      saveToFirebase()
    }
  }, [isSuccess, createdTokenAddress, formData, analytics, chainId])

  return {
    // State
    ready,
    authenticated,
    showSuccess,
    formData,
    formErrors,

    // Token creation state
    isCreating,
    isSuccess,
    createdTokenAddress,
    error,
    isConnected,
    isCorrectChain,
    isVerifying,
    feeAmount,

    // Chain info
    chainId,
    chainName,
    isSupported,
    nativeTokenName: getNativeTokenName(),
    hasDex,

    // Form handlers
    handleInputChange,
    getFieldValidation,
    handleSubmit
  }
}
