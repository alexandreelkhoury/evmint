import { loggers } from '../utils/logger'
import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import ChainIcon from './ChainIcon'
import { useFirebaseAnalytics } from './FirebaseProvider'
import { logEvent as firebaseLogEvent } from 'firebase/analytics'
import { colors, typography } from '../styles/designSystem'

interface NetworkSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Professional Network Selector Modal
 * Complete chain selector with mainnet/testnet tabs, search, and beautiful UI
 */
export default function NetworkSelectorModal({ isOpen, onClose }: NetworkSelectorModalProps) {
  const currentChainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const analytics = useFirebaseAnalytics()

  // Check if we're in development mode to show testnets
  const isDevelopment = import.meta.env.VITE_APP_ENV === 'development'

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'mainnet' | 'testnet'>('mainnet')
  const [switchingTo, setSwitchingTo] = useState<number | null>(null)

  // Detect when chain actually switches and close modal
  useEffect(() => {
    if (switchingTo !== null && currentChainId === switchingTo) {
      // Chain successfully switched!
      loggers.network.info('Chain switched successfully to:', currentChainId)
      onClose()
      setSwitchingTo(null)
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

      // Log analytics
      if (analytics) {
        const currentChain = ALL_CHAINS.find(c => c.id === currentChainId)
        firebaseLogEvent(analytics, 'chain_switched', {
          from_chain: currentChain?.name || 'Unknown',
          from_chain_id: currentChainId,
          to_chain: chain.name,
          to_chain_id: chain.id,
          method: 'network_selector_modal',
        })
      }

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
  const handleClose = () => {
    if (switchingTo !== null) {
      // Don't allow closing while switching
      return
    }
    onClose()
  }

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div key="network-modal" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[9999] w-full max-w-md my-auto bg-gray-900 border border-white/20 rounded-2xl shadow-2xl flex flex-col max-h-[70vh]"
          >
            {/* Header */}
            <div className="flex-shrink-0 relative bg-gray-800/50 border-b border-white/10 p-4 rounded-t-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                disabled={switchingTo !== null}
                className={`absolute top-2 right-2 p-1 rounded-md transition-all duration-200 ${
                  switchingTo !== null
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={switchingTo !== null ? 'Please wait for network switch to complete' : 'Close'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <div className="text-center mb-4">
                {switchingTo !== null ? (
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-yellow-400">
                      Switching Network...
                    </h2>
                    <p className="text-sm text-gray-400">Please approve in your wallet</p>
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-white">
                    Select Network
                  </h2>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search networks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Tabs - Show testnets only in development */}
              {isDevelopment && (
                <div className="flex gap-2 mt-4">
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

            {/* Chain List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
              {filteredChains.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-400 mb-2">No networks found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-2">
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
            <div className="flex-shrink-0 border-t border-white/10 bg-gray-800/50 backdrop-blur-sm p-4 rounded-b-2xl">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                  </div>
                  <span className="text-gray-400">
                    Connected:{' '}
                    <span className="font-semibold text-white">
                      {ALL_CHAINS.find(c => c.id === currentChainId)?.name || 'Unknown'}
                    </span>
                  </span>
                </div>
                <div className="px-2 py-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-600/30 text-xs font-medium">
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
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-white/10'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{children}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          active ? 'bg-white/20' : 'bg-white/10'
        }`}>
          {count}
        </span>
      </div>
    </motion.button>
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
  return (
    <button
      onClick={onClick}
      disabled={isSwitching}
      className={`relative w-full p-3 rounded-lg transition-all duration-200 text-left ${
        isActive
          ? 'bg-blue-600/20 border border-blue-500'
          : 'bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-white/10'
      } ${isSwitching ? 'cursor-wait' : 'cursor-pointer'}`}
    >
      {/* Active Badge */}
      {isActive && !isSwitching && (
        <div className="absolute -top-2 -right-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-600 rounded-md shadow-md">
            <span className="text-xs font-medium text-white">Active</span>
          </div>
        </div>
      )}

      {/* Switching Badge */}
      {isSwitching && (
        <div className="absolute -top-2 -right-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 rounded-md shadow-md animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-xs font-medium text-white">Switching...</span>
          </div>
        </div>
      )}

      {/* Chain Info - Row Layout */}
      <div className="flex items-center gap-3">
        {/* Chain Icon */}
        <div className="relative">
          <ChainIcon chainId={chain.id} size={32} className="rounded-full ring-1 ring-white/10 flex-shrink-0" />
          {isSwitching && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Chain Name */}
        <div className="flex-1">
          <h3 className="font-semibold text-white text-base truncate">
            {chain.name}
          </h3>
          {isSwitching && (
            <p className="text-xs text-yellow-400 mt-1">Approve in your wallet...</p>
          )}
        </div>
      </div>

    </button>
  )
}
