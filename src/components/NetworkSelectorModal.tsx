import { loggers } from '../utils/logger'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import ChainIcon from './ChainIcon'
import { useFirebaseAnalytics } from './FirebaseProvider'
import { trackNetworkSwitch } from '../utils/analytics'
import { useScrollLock } from '../hooks/useScrollLock'

interface NetworkSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NetworkSelectorModal({ isOpen, onClose }: NetworkSelectorModalProps) {
  const currentChainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const analytics = useFirebaseAnalytics()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useScrollLock(isOpen)

  const isDevelopment = import.meta.env.VITE_APP_ENV === 'development'

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'mainnet' | 'testnet'>('mainnet')
  const [switchingTo, setSwitchingTo] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Detect when chain actually switches
  useEffect(() => {
    if (switchingTo !== null && currentChainId === switchingTo) {
      loggers.network.info('Chain switched successfully to:', currentChainId)
      setShowSuccess(true)
      const timer = setTimeout(() => {
        onClose()
        setSwitchingTo(null)
        setShowSuccess(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [currentChainId, switchingTo, onClose])

  // Reset switching state on rejection
  useEffect(() => {
    if (switchingTo !== null && !isPending && currentChainId !== switchingTo) {
      loggers.network.warn('Network switch rejected or failed')
      setSwitchingTo(null)
    }
  }, [isPending, switchingTo, currentChainId])

  // ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && switchingTo === null) onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, switchingTo])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return
    const modal = modalRef.current
    const focusable = modal.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
    modal.addEventListener('keydown', handleTab)
    setTimeout(() => closeButtonRef.current?.focus(), 100)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const filteredChains = useMemo(() => {
    let chains = activeTab === 'mainnet' ? MAINNET_CHAINS : TESTNET_CHAINS
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      chains = chains.filter(c => c.name.toLowerCase().includes(q) || c.id.toString().includes(q))
    }
    return chains
  }, [activeTab, searchQuery])

  const handleChainSwitch = async (chain: ChainConfig) => {
    if (chain.id === currentChainId) { onClose(); return }
    try {
      setSwitchingTo(chain.id)
      const currentChain = ALL_CHAINS.find(c => c.id === currentChainId)
      trackNetworkSwitch(analytics, currentChain?.name || 'Unknown', chain.name, {
        from_chain_id: currentChainId,
        to_chain_id: chain.id,
        method: 'network_selector_modal',
      })
      await switchChain({ chainId: chain.id })
    } catch (error: any) {
      loggers.network.warn('Chain switch cancelled:', error?.message || error)
      setSwitchingTo(null)
    }
  }

  const handleClose = useCallback(() => {
    if (switchingTo !== null) return
    onClose()
  }, [switchingTo, onClose])

  const currentChainName = ALL_CHAINS.find(c => c.id === currentChainId)?.name || 'Unknown'

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          key="network-modal"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[9999] w-full max-w-sm my-auto bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex flex-col max-h-[80vh] sm:max-h-[70vh] overflow-hidden"
          >
            {/* Success overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/95 rounded-2xl"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-white">Switched to {currentChainName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex-shrink-0 p-4 pb-3 border-b border-white/[0.06]">
              {/* Title row */}
              <div className="flex items-center justify-between mb-3">
                <h2 id="modal-title" className="text-lg font-bold text-white">
                  {switchingTo !== null ? 'Switching...' : 'Select Network'}
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  disabled={switchingTo !== null}
                  className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg transition-[color,background-color] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                    switchingTo !== null
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer'
                  }`}
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <label htmlFor="network-search" className="sr-only">Search networks</label>
                <input
                  id="network-search"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-[border-color,box-shadow] duration-150"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Tabs (dev only) */}
              {isDevelopment && (
                <div className="flex gap-1.5 mt-3">
                  {(['mainnet', 'testnet'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-[background-color,color] duration-150 cursor-pointer ${
                        activeTab === tab
                          ? 'bg-white/10 text-white'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {tab === 'mainnet' ? 'Mainnets' : 'Testnets'}
                      <span className="ml-1.5 text-gray-500 tabular-nums">
                        {tab === 'mainnet' ? MAINNET_CHAINS.length : TESTNET_CHAINS.length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chain list */}
            <div className="flex-1 overflow-y-auto p-2 min-h-0 custom-scrollbar">
              {filteredChains.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No networks found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filteredChains.map((chain) => (
                    <ChainRow
                      key={chain.id}
                      chain={chain}
                      isActive={chain.id === currentChainId}
                      isSwitching={switchingTo === chain.id}
                      onClick={() => handleChainSwitch(chain)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span>Connected to <span className="text-gray-300 font-medium">{currentChainName}</span></span>
              </div>
              <span className="text-xs text-gray-600 tabular-nums">
                {filteredChains.length} {filteredChains.length === 1 ? 'network' : 'networks'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

/**
 * Chain row — logo + name, minimal
 */
function ChainRow({
  chain,
  isActive,
  isSwitching,
  onClick,
}: {
  chain: ChainConfig
  isActive: boolean
  isSwitching: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={isSwitching}
      className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-[background-color,box-shadow] duration-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
        isActive
          ? 'bg-blue-500/10'
          : chain.trending
          ? 'hover:bg-orange-500/[0.08]'
          : 'hover:bg-white/[0.05]'
      } ${isSwitching ? 'cursor-wait opacity-50' : 'cursor-pointer'}`}
      aria-label={`${chain.name}${isActive ? ' (active)' : ''}`}
    >
      {/* Icon */}
      <div className="relative flex-shrink-0">
        <ChainIcon chainId={chain.id} size={24} />
        {isSwitching && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-full">
            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Name */}
      <span className={`text-sm truncate ${
        isActive ? 'text-white font-semibold' : 'text-gray-300 group-hover:text-white'
      }`}>
        {chain.name}
      </span>

      {/* Trending */}
      {chain.trending && !isActive && (
        <span className="text-[10px] text-orange-400 flex-shrink-0">🔥</span>
      )}

      {/* Right side */}
      <div className="ml-auto flex-shrink-0">
        {isActive && !isSwitching && (
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
        )}
        {isSwitching && (
          <span className="text-[10px] text-gray-500">...</span>
        )}
      </div>
    </button>
  )
}
