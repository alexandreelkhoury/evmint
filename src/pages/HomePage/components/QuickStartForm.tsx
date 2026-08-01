import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { colors, typography } from '../../../styles/designSystem'
import WalletButton from '../../../components/WalletButton'
import type { TokenFormData, TokenFormErrors } from '../../../utils/tokenValidation'

interface QuickStartFormProps {
  // Form data
  formData: TokenFormData
  formErrors: TokenFormErrors

  // Handlers
  handleInputChange: (field: keyof TokenFormData, value: string | number) => void
  handleSubmit: (e: React.FormEvent) => void
  handleCloseSuccess: () => void

  // State
  isCreating: boolean
  createdTokenAddress: string | null
  error: Error | null
  authenticated: boolean
  isCorrectChain: boolean
  showSuccess: boolean

  // Utilities
  getNetworkName: () => string
}

/**
 * Quick Start Form component
 * Interactive token creation form embedded on the homepage
 */
export default function QuickStartForm({
  formData,
  formErrors,
  handleInputChange,
  handleSubmit,
  handleCloseSuccess,
  isCreating,
  createdTokenAddress,
  error,
  authenticated,
  isCorrectChain,
  showSuccess,
  getNetworkName
}: QuickStartFormProps) {
  const formRef = useRef(null)
  const formInView = useInView(formRef, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={formRef}
      className="mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}>
        <div className="text-center mb-12">
          {/* Hero badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={formInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
          >
            <span className="text-sm font-medium text-blue-400">⚡ Quick Start</span>
          </motion.div>

          <h2 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Create Your Token
            </span>
          </h2>
          <p className={`${typography.subtitle} text-xl max-w-2xl mx-auto`}>
            Try our token creator with this interactive demo. Ready to deploy? Click the button below!
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Title */}
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Token Configuration
              </h3>
              <p className="text-gray-400">
                Fill in the details for your new ERC20 token
              </p>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label htmlFor="quickTokenName" className="block text-sm font-medium text-gray-300 mb-3">
                  Token Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <input
                    id="quickTokenName"
                    type="text"
                    placeholder="e.g., My Awesome Token"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/15 transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                    maxLength={50}
                    required
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-400">{formErrors.name}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">Choose a clear, descriptive name for your token</p>
              </motion.div>

              {/* Token Symbol */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label htmlFor="quickTokenSymbol" className="block text-sm font-medium text-gray-300 mb-3">
                  Symbol *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <input
                    id="quickTokenSymbol"
                    type="text"
                    placeholder="e.g., MAT"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/15 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 uppercase"
                    maxLength={10}
                    required
                  />
                </div>
                {formErrors.symbol && (
                  <p className="mt-2 text-sm text-red-400">{formErrors.symbol}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">3-10 characters, uppercase letters and numbers only</p>
              </motion.div>

              {/* Decimals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label htmlFor="quickTokenDecimals" className="block text-sm font-medium text-gray-300 mb-3">
                  Decimals
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="quickTokenDecimals"
                    type="number"
                    min={0}
                    max={18}
                    value={formData.decimals}
                    onChange={(e) => handleInputChange('decimals', parseInt(e.target.value) || 18)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/15 transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                  />
                </div>
                {formErrors.decimals && (
                  <p className="mt-2 text-sm text-red-400">{formErrors.decimals}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">Number of decimal places (typically 18)</p>
              </motion.div>

              {/* Total Supply */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label htmlFor="quickTokenSupply" className="block text-sm font-medium text-gray-300 mb-3">
                  Total Supply *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <input
                    id="quickTokenSupply"
                    type="text"
                    placeholder="e.g., 1000000"
                    value={formData.totalSupply}
                    onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white/15 transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                    required
                  />
                </div>
                {formErrors.totalSupply && (
                  <p className="mt-2 text-sm text-red-400">{formErrors.totalSupply}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">Total number of tokens to create</p>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-6"
            >
              {!authenticated ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Connect Your Wallet</h3>
                    <p className="text-blue-200 mb-6">
                      Connect your wallet to deploy tokens on 15+ EVM chains and start creating your own cryptocurrency.
                    </p>
                    <div className="flex justify-center">
                      <WalletButton />
                    </div>
                  </div>
                </div>
              ) : !isCorrectChain ? (
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Switch Network</h3>
                  <p className="text-orange-200">
                    Please switch to a supported EVM network to create tokens. Choose from Base, Arbitrum, Polygon, BNB Chain, Avalanche, or Fantom.
                  </p>
                </div>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isCreating || Object.keys(formErrors).some(key => formErrors[key as keyof typeof formErrors])}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-6 text-xl font-semibold rounded-2xl transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
                    isCreating || Object.keys(formErrors).some(key => formErrors[key as keyof typeof formErrors])
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-xl hover:shadow-2xl'
                  } text-white`}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Token on {getNetworkName()}...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span>🚀</span>
                      <span>Create Token on {getNetworkName()}</span>
                    </div>
                  )}
                </motion.button>
              )}

              {/* Success/Error Messages */}
              {showSuccess && createdTokenAddress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Token Created Successfully!</h3>
                    <p className="text-green-200 mb-4">
                      Your token has been deployed to {getNetworkName()}.
                    </p>
                    <div className="bg-black/20 rounded-xl p-4 mb-6">
                      <p className="text-xs font-mono break-all text-gray-300">
                        Contract: {createdTokenAddress}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        to="/tokens"
                        className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium text-white cursor-pointer"
                      >
                        <span>💎</span>
                        <span className="ml-2">View My Tokens</span>
                      </Link>
                      <button
                        onClick={handleCloseSuccess}
                        className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-xl font-medium text-white cursor-pointer"
                      >
                        Create Another
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Token Creation Failed</h3>
                  <p className="text-red-200">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
