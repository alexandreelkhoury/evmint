import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { typography, colors } from '../../../styles/designSystem'
import ChainBadge from '../../../components/ChainBadge'

interface TokenFormProps {
  formData: {
    name: string
    symbol: string
    decimals: number
    totalSupply: string
  }
  formErrors: {
    name?: string
    symbol?: string
    decimals?: string
    totalSupply?: string
  }
  handleInputChange: (field: string, value: string | number) => void
  getFieldValidation: (field: string) => { hasError: boolean }
  chainId: number | undefined
  chainName: string
  isSupported: boolean
  hasDex: boolean
}

export default function TokenForm({
  formData,
  formErrors,
  handleInputChange,
  getFieldValidation,
  chainId,
  chainName,
  isSupported,
  hasDex
}: TokenFormProps) {
  return (
    <>
      {/* Form Title */}
      <div className="text-center mb-8">
        <h2 className={`${typography.sectionTitle} text-2xl lg:text-3xl mb-4`}>
          Token Configuration
        </h2>
        <p className={`${typography.bodyText} text-gray-400 mb-4`}>
          Fill in the details for your new ERC20 token
        </p>

        {/* Chain Indicator */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-sm text-gray-400">Deploying on:</span>
          <ChainBadge chainId={chainId} size="md" />
          {hasDex && (
            <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">
              ✓ DEX Available
            </span>
          )}
        </div>

        {!isSupported && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-300">
              ⚠️ Unsupported network. Please switch to a supported chain to deploy tokens.
            </p>
          </div>
        )}

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
    </>
  )
}
