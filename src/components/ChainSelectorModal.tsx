import { loggers } from '../utils/logger'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import { useChainConfig } from '../hooks/useChainConfig'
import ChainBadge from './ChainBadge'
import ChainIcon from './ChainIcon'
import { useFirebaseAnalytics } from './FirebaseProvider'
import { logEvent } from '../utils/analytics'
import { useScrollLock } from '../hooks/useScrollLock'
import CloseButton from './CloseButton'

interface ChainSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Chain Selector Modal Component
 * Beautiful modal for selecting and switching between EVM chains
 *
 * Features:
 * - Grid layout with chain cards
 * - Search/filter functionality
 * - Mainnet/Testnet tabs
 * - Visual indicators for current chain and DEX support
 * - Smooth animations
 * - Mobile responsive
 */
export default function ChainSelectorModal({ isOpen, onClose }: ChainSelectorModalProps) {
  const currentChainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const { name: currentChainName } = useChainConfig()
  const analytics = useFirebaseAnalytics()
  const modalRef = useRef<HTMLDivElement>(null)


  // Lock body scroll when modal is open
  useScrollLock(isOpen)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'mainnet' | 'testnet'>('all')
  const [switchingTo, setSwitchingTo] = useState<number | null>(null)

  // ESC key handler - WCAG requirement
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

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

    // Focus first focusable element when modal opens
    const firstFocusable = modal.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    setTimeout(() => firstFocusable?.focus(), 100)

    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Filter chains based on search and tab
  const filteredChains = useMemo(() => {
    let chains = ALL_CHAINS

    // Filter by mainnet/testnet
    if (filterTab === 'mainnet') {
      chains = MAINNET_CHAINS
    } else if (filterTab === 'testnet') {
      chains = TESTNET_CHAINS
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      chains = chains.filter(
        (chain) =>
          chain.name.toLowerCase().includes(query) ||
          chain.id.toString().includes(query) ||
          chain.layer?.toLowerCase().includes(query)
      )
    }

    return chains
  }, [filterTab, searchQuery])

  const handleChainSwitch = async (chain: ChainConfig) => {
    if (chain.id === currentChainId) {
      onClose()
      return
    }

    try {
      setSwitchingTo(chain.id)

      // Log analytics - will queue if analytics not ready yet
      logEvent(analytics!, 'chain_switched', {
        from_chain: currentChainName,
        from_chain_id: currentChainId,
        to_chain: chain.name,
        to_chain_id: chain.id,
        method: 'modal_selector',
      })

      await switchChain({ chainId: chain.id })

      // Close modal after successful switch
      setTimeout(() => {
        onClose()
        setSwitchingTo(null)
      }, 300)
    } catch (error) {
      loggers.network.error('Failed to switch chain:', error)
      setSwitchingTo(null)
      // Don't close modal on error so user can try again
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chain-selector-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="chain-selector-title" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Select Network
                  </h2>
                  <CloseButton
                    onClick={onClose}
                    ariaLabel="Close network selector (ESC)"
                  />
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <label htmlFor="chain-search" className="sr-only">Search networks</label>
                  <input
                    id="chain-search"
                    type="text"
                    placeholder="Search networks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-4">
                  <TabButton
                    active={filterTab === 'all'}
                    onClick={() => setFilterTab('all')}
                    count={ALL_CHAINS.length}
                  >
                    All Networks
                  </TabButton>
                  <TabButton
                    active={filterTab === 'mainnet'}
                    onClick={() => setFilterTab('mainnet')}
                    count={MAINNET_CHAINS.length}
                  >
                    Mainnets
                  </TabButton>
                  <TabButton
                    active={filterTab === 'testnet'}
                    onClick={() => setFilterTab('testnet')}
                    count={TESTNET_CHAINS.length}
                  >
                    Testnets
                  </TabButton>
                </div>
              </div>

              {/* Chain Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredChains.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg">No networks found</p>
                    <p className="text-sm mt-2">Try adjusting your search or filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* Footer */}
              <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <p className="text-sm text-gray-400 text-center">
                  Current Network: <ChainBadge chainId={currentChainId} size="sm" className="ml-2" />
                </p>
              </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/**
 * Tab Button Component
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
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer ${
        active
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
          : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      {children} <span className="ml-1 opacity-70">({count})</span>
    </button>
  )
}

/**
 * Chain Card Component
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
  const hasLiquidity = chain.features.hasV2Liquidity || chain.features.hasMultipleDex

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isSwitching}
      className={`relative p-4 rounded-xl border-2 text-left transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
        isActive
          ? 'border-blue-500 bg-blue-500/10'
          : chain.trending
          ? 'border-orange-500/40 bg-gradient-to-br from-orange-500/[0.07] to-transparent hover:border-orange-400/60 hover:shadow-lg hover:shadow-orange-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
      } ${isSwitching ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </div>
      )}

      {/* Trending Badge */}
      {chain.trending && !isActive && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[10px] font-bold text-orange-400 uppercase tracking-wide">
            <span>🔥</span> Hot
          </span>
        </div>
      )}

      {/* Chain Info */}
      <div className="flex items-start gap-3">
        <ChainIcon chainId={chain.id} size={48} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base truncate">{chain.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{chain.layer}</span>
            {chain.category === 'testnet' && (
              <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Testnet
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {chain.features.tokenDeployment && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">✓ Deploy</span>
            )}
            {hasLiquidity && (
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">✓ Liquidity</span>
            )}
          </div>
        </div>
      </div>

      {/* Switching Indicator */}
      {isSwitching && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </motion.button>
  )
}
