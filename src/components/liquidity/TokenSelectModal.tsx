import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useScrollLock } from '../../hooks/useScrollLock'
import { useModalA11y } from '../../hooks/useModalA11y'
import CloseButton from '../CloseButton'

interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: string
  logoUri?: string
}

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  tokens: Token[]
  onSelectToken: (token: Token) => void
  selectedToken?: Token
  title: string
  showTokenInput?: boolean
  tokenAddressInput: string
  onTokenAddressInputChange: (value: string) => void
  onAddTokenFromAddress: () => void
  isLoadingToken: boolean
  userCreatedTokens?: Token[]
  userLPTokens?: Token[]
  mode?: 'add' | 'withdraw'
}

function TokenRow({
  token,
  isSelected,
  onSelect,
  variant = 'default',
}: {
  token: Token
  isSelected: boolean
  onSelect: () => void
  variant?: 'default' | 'lp'
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
        isSelected
          ? 'bg-blue-500/10'
          : 'hover:bg-white/[0.04]'
      }`}
    >
      {token.logoUri ? (
        <img src={token.logoUri} alt={token.symbol} className="w-8 h-8 rounded-full flex-shrink-0" />
      ) : (
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold uppercase tracking-wide flex-shrink-0 ${
          variant === 'lp'
            ? 'bg-red-500/15 text-red-300'
            : 'bg-white/[0.08] text-gray-300'
        }`}>
          {variant === 'lp' ? 'LP' : token.symbol.slice(0, 2)}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white text-sm">{token.symbol}</div>
        <div className="text-xs text-gray-500 truncate">{token.name}</div>
      </div>
      {token.balance && (
        <div className="text-right flex-shrink-0">
          <div className="text-sm text-gray-300 tabular-nums">{token.balance}</div>
        </div>
      )}
      {isSelected && (
        <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}

export default function TokenSelectModal({
  isOpen,
  onClose,
  tokens,
  onSelectToken,
  selectedToken,
  title,
  showTokenInput = false,
  tokenAddressInput,
  onTokenAddressInputChange,
  onAddTokenFromAddress,
  isLoadingToken,
  userCreatedTokens = [],
  userLPTokens = [],
  mode = 'add'
}: TokenSelectModalProps) {
  useScrollLock(isOpen)
  const modalRef = useModalA11y(isOpen, onClose)
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const filteredTokens = tokens
    .filter(token => {
      if (mode === 'add' && token.symbol.includes('LP')) return false
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return token.symbol.toLowerCase().includes(q) || token.name.toLowerCase().includes(q)
    })

  const filteredLPTokens = userLPTokens.filter(token => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return token.symbol.toLowerCase().includes(q) || token.name.toLowerCase().includes(q)
  })

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title || 'Select Token'} ref={modalRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-[420px] shadow-2xl shadow-black/40 flex flex-col max-h-[min(85vh,600px)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <CloseButton onClick={onClose} ariaLabel="Close token selection" />
        </div>

        {/* Search */}
        <div className="px-5 pt-3 pb-2">
          <input
            type="text"
            placeholder="Search by name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 transition-all duration-150"
            autoFocus
          />
        </div>

        {/* Token list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0">
          {/* LP tokens (withdraw mode) */}
          {mode === 'withdraw' && filteredLPTokens.length > 0 && (
            <div className="mb-1">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                Your LP Tokens
              </div>
              {filteredLPTokens.map((token) => (
                <TokenRow
                  key={`lp-${token.address}`}
                  token={token}
                  isSelected={selectedToken?.address === token.address}
                  onSelect={() => onSelectToken(token)}
                  variant="lp"
                />
              ))}
              {filteredTokens.length > 0 && (
                <div className="border-t border-white/[0.06] mx-3 my-2" />
              )}
            </div>
          )}

          {/* Regular tokens */}
          {filteredTokens.length > 0 ? (
            <div>
              {mode === 'withdraw' && filteredLPTokens.length > 0 && (
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Other Tokens
                </div>
              )}
              {filteredTokens.map((token) => (
                <TokenRow
                  key={token.address}
                  token={token}
                  isSelected={selectedToken?.address === token.address}
                  onSelect={() => onSelectToken(token)}
                />
              ))}
            </div>
          ) : filteredLPTokens.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No tokens match your search' : 'No tokens available'}
              </p>
            </div>
          ) : null}
        </div>

        {/* Custom address input */}
        {showTokenInput && (
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <div className="flex gap-2">
              <label htmlFor="token-address-input" className="sr-only">Token address</label>
              <input
                id="token-address-input"
                type="text"
                placeholder="Paste token address (0x...)"
                value={tokenAddressInput}
                onChange={(e) => onTokenAddressInputChange(e.target.value)}
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/10 transition-all duration-150"
              />
              <button
                onClick={onAddTokenFromAddress}
                disabled={isLoadingToken || !tokenAddressInput}
                aria-label="Add token from address"
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 flex-shrink-0 ${
                  isLoadingToken || !tokenAddressInput
                    ? 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                }`}
              >
                {isLoadingToken ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin block" />
                ) : (
                  'Add'
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
