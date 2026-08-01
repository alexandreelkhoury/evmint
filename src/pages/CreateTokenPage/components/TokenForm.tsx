import { Link } from 'react-router-dom'

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
}

function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      <p className="mt-1.5 text-xs text-gray-600">{hint}</p>
    </div>
  )
}

const inputBase = "w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 transition-all duration-150 text-[15px]"

export default function TokenForm({
  formData,
  formErrors,
  handleInputChange,
  getFieldValidation
}: TokenFormProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">
            Token Configuration
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Configure your new ERC20 token
          </p>
        </div>
        <Link
          to="/tokens"
          className="text-sm text-blue-400/80 hover:text-blue-300 transition-colors duration-150 flex items-center gap-1"
        >
          My tokens
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          id="tokenName"
          label="Token Name"
          required
          hint="Choose a clear, descriptive name"
          error={getFieldValidation('name').hasError ? formErrors.name : undefined}
        >
          <input
            id="tokenName"
            type="text"
            placeholder="e.g., My Awesome Token"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={inputBase}
            maxLength={50}
            required
          />
        </FormField>

        <FormField
          id="tokenSymbol"
          label="Symbol"
          required
          hint="3-10 characters, uppercase letters and numbers"
          error={getFieldValidation('symbol').hasError ? formErrors.symbol : undefined}
        >
          <input
            id="tokenSymbol"
            type="text"
            placeholder="e.g., MAT"
            value={formData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
            className={`${inputBase} uppercase`}
            maxLength={10}
            required
          />
        </FormField>

        <FormField
          id="tokenDecimals"
          label="Decimals"
          hint="Most tokens use 18 decimals (same as ETH)"
          error={getFieldValidation('decimals').hasError ? formErrors.decimals : undefined}
        >
          <input
            id="tokenDecimals"
            type="number"
            min={0}
            max={18}
            placeholder="18"
            value={formData.decimals}
            onChange={(e) => handleInputChange('decimals', parseInt(e.target.value) || 18)}
            className={inputBase}
          />
        </FormField>

        <FormField
          id="tokenSupply"
          label="Total Supply"
          required
          hint="Most tokens have a supply of 1B"
          error={getFieldValidation('totalSupply').hasError ? formErrors.totalSupply : undefined}
        >
          <input
            id="tokenSupply"
            type="text"
            placeholder="1000000000"
            value={formData.totalSupply}
            onChange={(e) => handleInputChange('totalSupply', e.target.value)}
            className={inputBase}
            required
          />
        </FormField>
      </div>
    </>
  )
}
