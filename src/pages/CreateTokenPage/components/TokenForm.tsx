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

export default function TokenForm({
  formData,
  formErrors,
  handleInputChange,
  getFieldValidation
}: TokenFormProps) {
  return (
    <>
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Token Name */}
        <div>
          <label htmlFor="tokenName" className="block text-sm font-medium text-gray-300 mb-2">
            Token Name <span className="text-red-400">*</span>
          </label>
          <input
            id="tokenName"
            type="text"
            placeholder="e.g., My Awesome Token"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
              getFieldValidation('name').hasError
                ? 'border-red-500/50'
                : 'border-white/10 hover:border-white/20'
            }`}
            maxLength={50}
            required
          />
          {getFieldValidation('name').hasError ? (
            <p className="mt-1.5 text-xs text-red-400">{formErrors.name}</p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">A clear, descriptive name for your token</p>
          )}
        </div>

        {/* Token Symbol */}
        <div>
          <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-300 mb-2">
            Symbol <span className="text-red-400">*</span>
          </label>
          <input
            id="tokenSymbol"
            type="text"
            placeholder="e.g., MAT"
            value={formData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
              getFieldValidation('symbol').hasError
                ? 'border-red-500/50'
                : 'border-white/10 hover:border-white/20'
            }`}
            maxLength={10}
            required
          />
          {getFieldValidation('symbol').hasError ? (
            <p className="mt-1.5 text-xs text-red-400">{formErrors.symbol}</p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">3-10 characters, uppercase letters and numbers</p>
          )}
        </div>

        {/* Decimals */}
        <div>
          <label htmlFor="tokenDecimals" className="block text-sm font-medium text-gray-300 mb-2">
            Decimals
          </label>
          <input
            id="tokenDecimals"
            type="number"
            min={0}
            max={18}
            placeholder="18"
            value={formData.decimals}
            onChange={(e) => handleInputChange('decimals', parseInt(e.target.value) || 18)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
              getFieldValidation('decimals').hasError
                ? 'border-red-500/50'
                : 'border-white/10 hover:border-white/20'
            }`}
          />
          {getFieldValidation('decimals').hasError ? (
            <p className="mt-1.5 text-xs text-red-400">{formErrors.decimals}</p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">Standard is 18 (same as ETH)</p>
          )}
        </div>

        {/* Total Supply */}
        <div>
          <label htmlFor="tokenSupply" className="block text-sm font-medium text-gray-300 mb-2">
            Total Supply <span className="text-red-400">*</span>
          </label>
          <input
            id="tokenSupply"
            type="text"
            placeholder="1000000000"
            value={formData.totalSupply}
            onChange={(e) => handleInputChange('totalSupply', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
              getFieldValidation('totalSupply').hasError
                ? 'border-red-500/50'
                : 'border-white/10 hover:border-white/20'
            }`}
            required
          />
          {getFieldValidation('totalSupply').hasError ? (
            <p className="mt-1.5 text-xs text-red-400">{formErrors.totalSupply}</p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">Common supply is 1,000,000,000</p>
          )}
        </div>
      </div>

      {/* View tokens link — subtle, below the fields */}
      <div className="flex justify-end">
        <Link
          to="/tokens"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          View your created tokens &rarr;
        </Link>
      </div>
    </>
  )
}
