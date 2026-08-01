import { useState, useEffect } from 'react'
import { useSafePrivy } from '../../../hooks/useSafePrivy'
import { useSafeOpenZeppelinTokenDeployment } from '../../../hooks/useSafeOpenZeppelinTokenDeployment'
import { useTokenForm } from '../../../hooks/useTokenForm'
import { useFirebaseAnalytics } from '../../../components/FirebaseProvider'
import { trackPageView, trackTokenCreation } from '../../../utils/analytics'
import { getChainById } from '../../../config/chains'
import { loggers } from '../../../utils/logger'

/**
 * Custom hook containing all business logic for the HomePage
 * Handles token creation, form validation, modal states, and analytics
 *
 * Uses safe hooks that work even when Web3 providers aren't loaded,
 * enabling lazy loading of the 2.5MB Web3 bundle.
 */
export function useHomePageLogic() {
  const analytics = useFirebaseAnalytics()

  // Token creation functionality - using safe wrappers for lazy loading
  const { authenticated } = useSafePrivy()
  const {
    createToken,
    isCreating,
    createdTokenAddress,
    error,
    isConnected,
    isCorrectChain,
    chainId
  } = useSafeOpenZeppelinTokenDeployment()

  // Helper function to get network name
  const getNetworkName = () => {
    if (!chainId) return 'EVM Network'
    const chain = getChainById(chainId)
    return chain?.name || 'Unknown Network'
  }

  // Use shared token form hook for validation and state management
  const {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormErrors
  } = useTokenForm()

  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!authenticated || !isConnected) {
      return
    }

    try {
      await createToken(formData)
      setShowSuccess(true)
      setFormErrors({})

      // Track token creation
      trackTokenCreation(analytics, {
        name: formData.name,
        symbol: formData.symbol,
        supply: formData.totalSupply,
        network: getNetworkName()
      })
    } catch (error) {
      loggers.ui.error('Token creation failed:', error)
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    resetForm()
  }

  return {
    // Form state
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,

    // Token creation state
    isCreating,
    createdTokenAddress,
    error,

    // Wallet state
    authenticated,
    isConnected,
    isCorrectChain,

    // Modal state
    showSuccess,
    handleCloseSuccess,

    // Utilities
    getNetworkName,
    resetForm
  }
}
