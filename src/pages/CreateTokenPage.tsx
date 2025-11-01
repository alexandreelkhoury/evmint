import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import { Link } from 'react-router-dom'
import { base, baseSepolia } from 'viem/chains'
import WalletButton from '../components/WalletButton'
import SEO from '../components/SEO'
import { trackTokenResult, trackTokenCreation, trackTokenCreationError, trackWalletError } from '../utils/analytics'
import { useOpenZeppelinTokenDeployment } from '../hooks/useOpenZeppelinTokenDeployment'
import { useTokenForm } from '../hooks/useTokenForm'
import { layout, typography, colors } from '../styles/designSystem'
import { useGlobalToasts } from '../App'

export default function CreateTokenPage() {
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

  // Helper function to get network name
  const getNetworkName = () => {
    if (chainId === base.id) return 'Base Mainnet'
    if (chainId === baseSepolia.id) return 'Base Testnet'
    return 'Base'
  }
  
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
      console.log('❌ BASE TOKEN LAUNCHER - WALLET NOT CONNECTED');
      toasts.warning(
        'Please connect your wallet first to create tokens on Base blockchain',
        '🔗 Wallet Required'
      );
      trackWalletError(analytics, 'Wallet not connected - user attempted token creation', 'create_token_attempt');
      return
    }

    try {
      // Use sanitized form data for token creation
      const sanitizedData = getSanitizedFormData()
      console.log('🔍 BASE TOKEN LAUNCHER - Creating token with data:', sanitizedData);
      await createToken(sanitizedData)
      setShowSuccess(true)
    } catch (error: any) {
      console.error('❌ BASE TOKEN LAUNCHER - Token creation failed:', error)
      
      // Track detailed token creation error
      trackTokenCreationError(analytics, error, {
        name: formData.name,
        symbol: formData.symbol,
        supply: formData.totalSupply,
        decimals: formData.decimals,
        network: getNetworkName()
      });
      
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
            network: chainId === base.id ? 'Base Mainnet' : 'Base Sepolia'
          })

          // Track successful token creation
          trackTokenResult(analytics, {
            success: true,
            tokenAddress: createdTokenAddress
          })
          
          console.log('Token created successfully - Firebase save disabled')
        } catch (error) {
          console.error('Failed to save token to Firebase:', error)
        }
      }

      saveToFirebase()
    }
  }, [isSuccess, createdTokenAddress, formData, analytics, chainId])

  const createTokenStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base Token Creator - ERC20 Token Generator",
    "description": "Create and deploy ERC20 tokens on Base blockchain in 5 seconds. No coding required, less than $1 gas fees only.",
    "url": "https://base-token-creator.com/create",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0.02",
      "priceCurrency": "ETH",
      "description": "Token deployment fee on Base blockchain"
    },
    "provider": {
      "@type": "Organization",
      "name": "Base Token Creator",
      "url": "https://base-token-creator.com"
    },
    "potentialAction": {
      "@type": "CreateAction",
      "target": "https://base-token-creator.com/create",
      "result": {
        "@type": "DigitalDocument",
        "name": "ERC20 Token Contract"
      }
    },
    "featureList": [
      "No coding required",
      "5-second deployment",
      "Under $1 gas fees",
      "Auto-verification on BaseScan",
      "Uniswap liquidity support",
      "Base blockchain deployment"
    ]
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
        {/* Loading skeleton */}
        <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-white/5 rounded-2xl"></div>
            <div className="h-96 bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <SEO
        title="🚀 Create Token on Base - Deploy ERC20 in 5 Seconds | <$1 Gas Fees"
        description="⚡ Launch your ERC20 token on Base blockchain instantly! No coding needed. Deploy for under $1, auto-verify on BaseScan, add Uniswap liquidity. Join 10,000+ successful projects. Start your meme coin empire today!"
        keywords="create token base, erc20 token creator, base blockchain token, meme coin creator, no code token maker, cheap crypto deployment, uniswap token launch, base layer 2 tokens, defi token generator, cryptocurrency creator, token launcher base, basescan verification"
        canonical="/create"
        structuredData={createTokenStructuredData}
      />
      
      <div className={`relative z-10 ${layout.pageContainer}`}>
        {/* Modern Create Token Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
          >
            <span className="text-sm font-medium text-blue-400">🚀 Token Creator</span>
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Create Your Token
            </span>
            <br />
            <span className={typography.pageTitleWhite}>on Base Network</span>
          </motion.h1>
          
          <motion.p 
            className={`${typography.subtitle} max-w-4xl mx-auto text-xl sm:text-2xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Deploy your own ERC20 token on Base blockchain in 5 seconds. No coding experience required! Gas fees less than $1.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center items-center space-x-8 mt-12"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">&lt;$1</div>
              <div className="text-sm text-gray-400">Gas Fees</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">3 Min</div>
              <div className="text-sm text-gray-400">Deploy Time</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">No Code</div>
              <div className="text-sm text-gray-400">Required</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Token Creation Form */}
        <div className="max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Title */}
              <div className="text-center mb-8">
                <h2 className={`${typography.sectionTitle} text-2xl lg:text-3xl mb-4`}>
                  Token Configuration
                </h2>
                <p className={`${typography.bodyText} text-gray-400 mb-4`}>
                  Fill in the details for your new ERC20 token
                </p>
                
                
                {/* See Your Created Tokens Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="mt-4"
                >
                  <Link
                    to="/tokens"
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium underline decoration-blue-400/50 hover:decoration-blue-300 underline-offset-2 transition-all duration-300 group"
                  >
                    <span>See your created tokens</span>
                    <motion.svg 
                      className="w-4 h-4"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </motion.svg>
                  </Link>
                </motion.div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Token Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                >
                  <label className={`block ${typography.label} mb-3`}>
                    Token Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., My Awesome Token"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`${colors.input} pl-12 py-4 text-lg rounded-2xl w-full`}
                      maxLength={50}
                      required
                    />
                  </div>
                  {getFieldValidation('name').hasError && (
                    <p className={`mt-2 text-sm ${typography.error}`}>{formErrors.name}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Choose a clear, descriptive name for your token</p>
                </motion.div>

                {/* Token Symbol */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >
                  <label className={`block ${typography.label} mb-3`}>
                    Symbol *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., MAT"
                      value={formData.symbol}
                      onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                      className={`${colors.input} pl-12 py-4 text-lg rounded-2xl w-full uppercase`}
                      maxLength={10}
                      required
                    />
                  </div>
                  {getFieldValidation('symbol').hasError && (
                    <p className={`mt-2 text-sm ${typography.error}`}>{formErrors.symbol}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">3-10 characters, uppercase letters and numbers only</p>
                </motion.div>

                {/* Decimals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                  <label className={`block ${typography.label} mb-3`}>
                    Decimals
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      value={formData.decimals}
                      onChange={(e) => handleInputChange('decimals', parseInt(e.target.value) || 18)}
                      className={`${colors.input} pl-12 py-4 text-lg rounded-2xl w-full`}
                    />
                  </div>
                  {getFieldValidation('decimals').hasError && (
                    <p className={`mt-2 text-sm ${typography.error}`}>{formErrors.decimals}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Number of decimal places (typically 18)</p>
                </motion.div>

                {/* Total Supply */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  <label className={`block ${typography.label} mb-3`}>
                    Total Supply *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., 1000000"
                      value={formData.totalSupply}
                      onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                      className={`${colors.input} pl-12 py-4 text-lg rounded-2xl w-full`}
                      required
                    />
                  </div>
                  {getFieldValidation('totalSupply').hasError && (
                    <p className={`mt-2 text-sm ${typography.error}`}>{formErrors.totalSupply}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Total number of tokens to create</p>
                </motion.div>
              </div>

              {/* Fee Disclosure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.25 }}
                className="mt-8"
              >
                <div className={`${colors.glassCard} rounded-2xl p-4 sm:p-6 border border-blue-500/20`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`${typography.cardTitle} text-base sm:text-lg mb-2`}>Token Creation Fee</h3>
                      <p className={`${typography.bodyText} text-gray-300 mb-3 text-sm sm:text-base`}>
                        Creating a token requires a one-time fee of <span className="text-blue-400 font-semibold">{feeAmount} ETH</span> plus network gas fees.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="break-words">Fee covers platform maintenance and development costs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="pt-6"
              >
                {!authenticated ? (
                  <div className="space-y-6">
                    <div className={`${colors.infoBg} rounded-2xl p-6 text-center`}>
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className={`${typography.cardTitle} text-white mb-3`}>Connect Your Wallet</h3>
                      <p className={`${typography.bodyText} text-blue-200 mb-6`}>
                        Connect your wallet to deploy tokens on Base blockchain and start creating your own cryptocurrency.
                      </p>
                      <WalletButton />
                    </div>
                  </div>
                ) : !isCorrectChain ? (
                  <div className={`${colors.warningBg} rounded-2xl p-6 text-center`}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className={`${typography.cardTitle} text-white mb-3`}>Switch Network</h3>
                    <p className={`${typography.bodyText} text-orange-200`}>
                      Please switch to Base mainnet or Base Sepolia testnet to create tokens. Your wallet needs to be on the correct network.
                    </p>
                  </div>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={
                      isCreating || 
                      Object.keys(formErrors).some(key => formErrors[key as keyof typeof formErrors])
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-300 ${
                      isCreating || 
                      Object.keys(formErrors).some(key => formErrors[key as keyof typeof formErrors])
                        ? colors.primaryButtonDisabled
                        : colors.primaryButton
                    }`}
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>
                          {isVerifying ? 'Verifying Contract...' : `Creating Token on ${getNetworkName()}...`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="flex items-center space-x-2">
                          <span>🚀</span>
                          <span>Create Token</span>
                        </div>
                        <span className="text-sm text-blue-200 opacity-80">
                          One transaction • Auto-verified on Basescan
                        </span>
                      </div>
                    )}
                  </motion.button>
                )}

                {/* Success/Error Messages */}
                {showSuccess && createdTokenAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 ${colors.successBg} rounded-2xl p-6`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className={`${typography.cardTitle} text-white mb-3`}>Token Created Successfully!</h3>
                      <p className={`${typography.bodyText} text-green-200 mb-4`}>
                        Your token has been deployed to Base blockchain.
                      </p>
                      <div className="bg-black/20 rounded-xl p-4 mb-6">
                        <p className="text-xs font-mono break-all text-gray-300">
                          Contract: {createdTokenAddress}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          to="/tokens"
                          className={`inline-flex items-center justify-center px-6 py-3 ${colors.primaryButton} rounded-xl font-medium`}
                        >
                          <span>💎</span>
                          <span className="ml-2">View My Tokens</span>
                        </Link>
                        <Link
                          to="/liquidity"
                          className={`inline-flex items-center justify-center px-6 py-3 ${colors.secondaryButton} rounded-xl font-medium`}
                        >
                          <span>💧</span>
                          <span className="ml-2">Add Liquidity</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 ${colors.errorBg} rounded-2xl p-6 text-center`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className={`${typography.cardTitle} text-white mb-3`}>Token Creation Failed</h3>
                    <p className={`${typography.bodyText} text-red-200`}>
                      {error.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Ready to Launch CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-20"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>
            
            {/* CTA Card */}
            <div className={`relative ${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center border-white/[0.2]`}>
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center p-3">
                  <img 
                    src="/LOGO.png" 
                    alt="Base Token Creator Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-4`}>
                Need help getting <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">started</span>?
                </h3>
                
                <p className={`${typography.subtitle} text-xl mb-8 max-w-2xl mx-auto`}>
                  Check out our comprehensive guides and FAQ section!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/guides"
                    className={`inline-flex items-center px-8 py-4 ${colors.secondaryButton} font-medium text-lg rounded-2xl`}
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Read Guides
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/faq"
                    className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} font-semibold text-lg rounded-2xl`}
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Get Help
                  </Link>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <div className="flex justify-center items-center space-x-8 mt-8 pt-8 border-t border-white/10">
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className={`w-5 h-5 ${typography.success.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={typography.label}>No Code Required</span>
                </div>
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className={`6-5 h-6 ${typography.info.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className={typography.label}>15s Deploy</span>
                </div>
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className={typography.label}>Low Cost</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}