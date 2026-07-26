import { loggers } from '../utils/logger'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import ChainIcon from './ChainIcon'
import { useFirebaseAnalytics } from './FirebaseProvider'
import { logEvent } from '../utils/analytics'
import { colors, typography } from '../styles/designSystem'
import { useScrollLock } from '../hooks/useScrollLock'

interface NetworkSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Premium Blockchain Vault Selector Modal
 * WCAG AAA compliant with focus management, ESC handling, and premium animations
 * "Vault Selector" aesthetic - each network is a premium vault with unique properties
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

  // Get layer badge info
  const getLayerBadge = (layer: string) => {
    switch (layer) {
      case 'L2':
        return { icon: '⚡', label: 'Layer 2', color: 'from-green-500 to-emerald-500', textColor: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' }
      case 'L1':
        return { icon: '🏛️', label: 'Layer 1', color: 'from-purple-500 to-violet-500', textColor: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' }
      case 'sidechain':
        return { icon: '🔗', label: 'Sidechain', color: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' }
      case 'parachain':
        return { icon: '🌐', label: 'Parachain', color: 'from-pink-500 to-rose-500', textColor: 'text-pink-400', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30' }
      default:
        return { icon: '⛓️', label: 'Chain', color: 'from-gray-500 to-gray-600', textColor: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' }
    }
  }

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

          {/* Modal Container - Vault Design */}
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

            {/* Animated border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur opacity-50 animate-pulse" />

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

            {/* Header - Vault Door */}
            <div className="relative flex-shrink-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-b border-blue-500/10 p-6 rounded-t-3xl backdrop-blur-sm">
              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={handleClose}
                disabled={switchingTo !== null}
                className={`absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                  switchingTo !== null
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-300 hover:text-white hover:bg-amber-500/10 hover:border-amber-500/30 cursor-pointer border border-transparent'
                }`}
                title={switchingTo !== null ? 'Please wait for network switch to complete' : 'Close vault selector (ESC)'}
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
                      Unlocking Vault...
                    </h2>
                    <p className="text-sm text-gray-300">Approve the switch in your wallet</p>
                  </motion.div>
                ) : (
                  <h2 id="modal-title" className="text-2xl font-display font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Select Blockchain Vault
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
                  className="w-full px-5 py-3.5 pl-12 bg-white/5 border border-blue-500/20 rounded-xl text-white text-base placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  aria-label="Search for blockchain networks by name or type"
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

            {/* Chain List - Vault Inventory */}
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
                  <p className="text-xl font-display font-bold text-gray-300 mb-2">No vaults found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredChains.map((chain, index) => (
                    <ChainCard
                      key={chain.id}
                      chain={chain}
                      isActive={chain.id === currentChainId}
                      isSwitching={switchingTo === chain.id}
                      onClick={() => handleChainSwitch(chain)}
                      index={index}
                      layerBadge={getLayerBadge(chain.layer || '')}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Vault Status */}
            <div className="relative flex-shrink-0 border-t border-amber-500/10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-5 rounded-b-3xl">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                  <span className="text-gray-300">
                    Current:{' '}
                    <span className="font-display font-bold text-amber-400">
                      {ALL_CHAINS.find(c => c.id === currentChainId)?.name || 'Unknown'}
                    </span>
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold shadow-lg shadow-amber-500/5">
                  {filteredChains.length} {filteredChains.length === 1 ? 'vault' : 'vaults'}
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
      className={`flex-1 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
        active
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-lg shadow-amber-500/30'
          : 'bg-gray-800/60 text-gray-300 hover:text-white hover:bg-gray-700/80 border border-blue-500/10 hover:border-blue-500/30'
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{children}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          active ? 'bg-gray-900/30 text-amber-200' : 'bg-gray-700/50 text-gray-400'
        }`}>
          {count}
        </span>
      </div>
    </motion.button>
  )
}

/**
 * Premium Chain Vault Card with Enhanced Visuals
 */
function ChainCard({
  chain,
  isActive,
  isSwitching,
  onClick,
  index,
  layerBadge,
}: {
  chain: ChainConfig
  isActive: boolean
  isSwitching: boolean
  onClick: () => void
  index: number
  layerBadge: { icon: string; label: string; color: string; textColor: string; bgColor: string; borderColor: string }
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      disabled={isSwitching}
      whileHover={!isSwitching && !isActive ? { scale: 1.02, x: 4 } : {}}
      whileTap={!isSwitching ? { scale: 0.98 } : {}}
      className={`group relative w-full p-4 rounded-xl transition-all duration-300 text-left border focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
        isActive
          ? 'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20'
          : chain.trending
          ? 'bg-gradient-to-br from-orange-500/10 via-orange-500/[0.03] to-transparent border-orange-500/30 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/15'
          : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-blue-400/40 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10'
      } ${isSwitching ? 'cursor-wait' : 'cursor-pointer'}`}
      aria-pressed={isActive}
      aria-current={isActive ? 'true' : undefined}
      aria-busy={isSwitching}
      aria-label={`${chain.name} - ${layerBadge.label}${isActive ? ' (currently active)' : ''}`}
    >
      {/* Hover glow effect */}
      {!isActive && !isSwitching && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Active Badge - Premium Gold */}
      {isActive && !isSwitching && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg shadow-lg shadow-amber-500/50">
            <svg className="w-3.5 h-3.5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs font-display font-black text-gray-900 uppercase">Active</span>
          </div>
        </motion.div>
      )}

      {/* Switching Badge - Animated */}
      {isSwitching && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-lg shadow-yellow-500/50 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-xs font-display font-black text-gray-900 uppercase">Unlocking...</span>
          </div>
        </motion.div>
      )}

      {/* Chain Info */}
      <div className="relative flex items-center gap-4">
        {/* Chain Icon with Loading Overlay */}
        <div className="relative flex-shrink-0">
          <ChainIcon
            chainId={chain.id}
            size={40}
            className="rounded-xl ring-2 ring-white/10 group-hover:ring-blue-400/30 transition-all duration-300"
          />
          {isSwitching && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Chain Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className={`font-display font-bold text-base truncate transition-colors ${chain.trending && !isActive ? 'text-orange-100 group-hover:text-orange-300' : 'text-white group-hover:text-blue-400'}`}>
              {chain.name}
            </h3>
            {chain.trending && !isActive && !isSwitching && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[10px] font-bold text-orange-400 uppercase tracking-wide flex-shrink-0">
                🔥 Hot
              </span>
            )}
          </div>

          {/* Layer Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${layerBadge.bgColor} ${layerBadge.borderColor} border text-xs font-semibold ${layerBadge.textColor}`}>
              <span>{layerBadge.icon}</span>
              <span>{layerBadge.label}</span>
            </span>

            {/* Low Gas Badge for L2s */}
            {chain.layer === 'L2' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-xs font-semibold text-green-400">
                <span>💰</span>
                <span>Low Gas</span>
              </span>
            )}
          </div>

          {/* Switching Status */}
          {isSwitching && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-yellow-400 font-semibold mt-2"
            >
              Check your wallet to approve...
            </motion.p>
          )}
        </div>

        {/* Arrow Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isActive ? 0 : 1, x: 0 }}
          className="flex-shrink-0 text-gray-600 group-hover:text-blue-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  )
}
