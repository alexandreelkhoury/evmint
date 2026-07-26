import { loggers } from '../utils/logger'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import ChainIcon from './ChainIcon'
import { useFirebaseAnalytics } from './FirebaseProvider'
import { logEvent } from '../utils/analytics'
import { useScrollLock } from '../hooks/useScrollLock'

interface NetworkSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Premium Blockchain Network Selector Modal
 * WCAG AAA compliant with focus management, ESC handling, and premium animations
 * "Network Selector" aesthetic - each network is a premium network with unique properties
 */
export default function NetworkSelectorModal({ isOpen, onClose }: NetworkSelectorModalProps) {
  const currentChainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const analytics = useFirebaseAnalytics()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Lock body scroll when modal is open
  useScrollLock(isOpen)

  // Check if we're in development mode to show testnets
  const isDevelopment = import.meta.env.VITE_APP_ENV === 'development'

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'mainnet' | 'testnet'>('mainnet')
  const [switchingTo, setSwitchingTo] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Detect when chain actually switches and show success animation
  useEffect(() => {
    if (switchingTo !== null && currentChainId === switchingTo) {
      // Chain successfully switched!
      loggers.network.info('Chain switched successfully to:', currentChainId)

      // Show success animation
      setShowSuccess(true)

      // Close modal after success animation
      const timer = setTimeout(() => {
        onClose()
        setSwitchingTo(null)
        setShowSuccess(false)
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [currentChainId, switchingTo, onClose])

  // Reset switching state when wagmi reports no longer pending
  useEffect(() => {
    if (switchingTo !== null && !isPending && currentChainId !== switchingTo) {
      // Wagmi finished but chain didn't change = user rejected or error
      loggers.network.warn('Network switch rejected or failed - resetting UI')
      setSwitchingTo(null)
    }
  }, [isPending, switchingTo, currentChainId])

  // ESC key handler - WCAG requirement
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && switchingTo === null) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, switchingTo])

  // Focus trap - WCAG requirement
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)

    // Focus first element when modal opens
    setTimeout(() => closeButtonRef.current?.focus(), 100)

    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Filter chains based on search and active tab
  const filteredChains = useMemo(() => {
    let chains = activeTab === 'mainnet' ? MAINNET_CHAINS : TESTNET_CHAINS

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      chains = chains.filter(
        (chain) =>
          chain.name.toLowerCase().includes(query) ||
          chain.layer?.toLowerCase().includes(query) ||
          chain.id.toString().includes(query)
      )
    }

    return chains
  }, [activeTab, searchQuery])

  const handleChainSwitch = async (chain: ChainConfig) => {
    if (chain.id === currentChainId) {
      onClose()
      return
    }

    try {
      setSwitchingTo(chain.id)

      // Log analytics - will queue if analytics not ready yet
      const currentChain = ALL_CHAINS.find(c => c.id === currentChainId)
      logEvent(analytics!, 'chain_switched', {
        from_chain: currentChain?.name || 'Unknown',
        from_chain_id: currentChainId,
        to_chain: chain.name,
        to_chain_id: chain.id,
        method: 'network_selector_modal',
      })

      // Trigger the wallet switch request
      // The modal will automatically close when currentChainId changes (via useEffect)
      await switchChain({ chainId: chain.id })

      // Note: Don't close modal here! The useEffect will close it when
      // currentChainId actually changes to the target chain
    } catch (error: any) {
      // User rejected or error occurred - remove loader and keep modal open
      loggers.network.warn('Chain switch cancelled or failed:', error?.message || error)

      // Remove the loader immediately when user rejects
      setSwitchingTo(null)

      // Don't close modal - user can try again with another chain
    }
  }

  // Prevent closing modal while switching networks
  const handleClose = useCallback(() => {
    if (switchingTo !== null) {
      // Don't allow closing while switching
      return
    }
    onClose()
  }, [switchingTo, onClose])

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          key="network-modal"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[9998]"
          />

          {/* Modal Container - Network Design */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[9999] w-full max-w-md my-auto bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-blue-500/20 rounded-3xl shadow-2xl shadow-blue-500/10 flex flex-col max-h-[85vh] sm:max-h-[70vh] overflow-hidden"
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none rounded-3xl" />

            {/* Static border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur opacity-40" />

            {/* Success Overlay Animation */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-xl rounded-3xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                      <svg className="w-14 h-14 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-2xl font-display font-bold text-amber-400">Network Switched!</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header - Network Door */}
            <div className="relative flex-shrink-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-b border-blue-500/10 p-5 rounded-t-3xl backdrop-blur-sm">
              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                disabled={switchingTo !== null}
                className={`absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-[color,background-color,border-color,opacity] duration-200 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  switchingTo !== null
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-300 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/30 cursor-pointer border border-transparent'
                }`}
                title={switchingTo !== null ? 'Please wait for network switch to complete' : 'Close network selector (ESC)'}
                aria-label="Close network selector modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title with Orbitron */}
              <div className="text-center mb-6">
                {switchingTo !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <h2 id="modal-title" className="text-2xl font-display font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      Switching Network...
                    </h2>
                    <p className="text-sm text-gray-300">Approve the switch in your wallet</p>
                  </motion.div>
                ) : (
                  <h2 id="modal-title" className="text-2xl font-display font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Select Blockchain Network
                  </h2>
                )}
              </div>

              {/* Search Bar - Premium Design */}
              <div className="relative">
                <label htmlFor="network-search" className="sr-only">
                  Search blockchain networks
                </label>
                <input
                  id="network-search"
                  type="text"
                  placeholder="Search networks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-[border-color,background-color,box-shadow] duration-200"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none"
                    aria-label="Clear search query"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Tabs - Premium Gold Design */}
              {isDevelopment && (
                <div className="flex flex-col sm:flex-row gap-2 mt-5">
                  <TabButton
                    active={activeTab === 'mainnet'}
                    onClick={() => setActiveTab('mainnet')}
                    count={MAINNET_CHAINS.length}
                  >
                    Mainnets
                  </TabButton>
                  <TabButton
                    active={activeTab === 'testnet'}
                    onClick={() => setActiveTab('testnet')}
                    count={TESTNET_CHAINS.length}
                  >
                    Testnets
                  </TabButton>
                </div>
              )}
            </div>

            {/* Chain List - Network Inventory */}
            <div className="relative flex-1 overflow-y-auto p-5 custom-scrollbar min-h-0">
              {filteredChains.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-20"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center border border-gray-700/50"
                  >
                    <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                  <p className="text-xl font-display font-bold text-gray-300 mb-2">No networks found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {filteredChains.map((chain) => (
                    <ChainCard
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

            {/* Footer - Network Status */}
            <div className="relative flex-shrink-0 border-t border-amber-500/10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-5 rounded-b-3xl">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                  <span className="text-gray-300">
                    Current:{' '}
                    <span className="font-display font-bold text-amber-400">
                      {ALL_CHAINS.find(c => c.id === currentChainId)?.name || 'Unknown'}
                    </span>
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold tabular-nums">
                  {filteredChains.length} {filteredChains.length === 1 ? 'network' : 'networks'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

/**
 * Premium Tab Button with Gold Accent
 */
function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count: number
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-[background-color,color,border-color,box-shadow] duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
        active
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-lg shadow-amber-500/30'
          : 'bg-gray-800/60 text-gray-300 hover:text-white hover:bg-gray-700/80 border border-blue-500/10 hover:border-blue-500/30'
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{children}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
          active ? 'bg-gray-900/30 text-amber-200' : 'bg-gray-700/50 text-gray-400'
        }`}>
          {count}
        </span>
      </div>
    </motion.button>
  )
}

/**
 * Clean, compact chain row — logo + name only
 */
function ChainCard({
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
      className={`group relative w-full px-3 py-2.5 rounded-lg text-left transition-[background-color,box-shadow] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
        isActive
          ? 'bg-amber-500/15 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.4)]'
          : chain.trending
          ? 'shadow-[inset_0_0_0_1px_rgba(249,115,22,0.15)] hover:bg-orange-500/10 hover:shadow-[inset_0_0_0_1px_rgba(249,115,22,0.3)]'
          : 'hover:bg-white/[0.06]'
      } ${isSwitching ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
      aria-pressed={isActive}
      aria-label={`${chain.name}${isActive ? ' (active)' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <ChainIcon chainId={chain.id} size={28} />
          {isSwitching && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 rounded-full">
              <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Name */}
        <span className={`text-sm font-semibold truncate transition-colors ${
          isActive ? 'text-amber-400' : chain.trending ? 'text-orange-100 group-hover:text-orange-300' : 'text-gray-200 group-hover:text-white'
        }`}>
          {chain.name}
        </span>

        {/* Trending badge */}
        {chain.trending && !isActive && (
          <span className="text-[10px] font-bold text-orange-400 flex-shrink-0">🔥</span>
        )}

        {/* Active check / Switching text */}
        <div className="ml-auto flex-shrink-0">
          {isActive && !isSwitching && (
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          )}
          {isSwitching && (
            <span className="text-[10px] text-yellow-400 font-semibold">Switching...</span>
          )}
        </div>
      </div>
    </button>
  )
}
