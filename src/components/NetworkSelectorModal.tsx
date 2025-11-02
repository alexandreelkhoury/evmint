import { loggers } from '../utils/logger'
import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import ChainIcon from './ChainIcon'
import { useFirebaseAnalytics } from './FirebaseProvider'
import { logEvent as firebaseLogEvent } from 'firebase/analytics'

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

      // Wait for user to approve the network switch in their wallet
      await switchChain({ chainId: chain.id })

      // Only close modal after successful switch (user approved in wallet)
      onClose()
      setSwitchingTo(null)
    } catch (error) {
      // User rejected or error occurred - keep modal open
      loggers.network.error('Failed to switch chain:', error)
      setSwitchingTo(null)
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[9999] w-full max-w-sm my-auto bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-2 border-gray-600/80 rounded-xl shadow-2xl flex flex-col max-h-[60vh]"
          >
            {/* Header */}
            <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border-b border-gray-700/50 p-3">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <div className="text-center mb-3">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
                  Select Network
                </h2>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search networks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <div className="flex gap-2 mt-3">
                  <TabButton
                    active={activeTab === 'mainnet'}
                    onClick={() => setActiveTab('mainnet')}
                    count={MAINNET_CHAINS.length}
                    icon="🌐"
                  >
                    Mainnets
                  </TabButton>
                  <TabButton
                    active={activeTab === 'testnet'}
                    onClick={() => setActiveTab('testnet')}
                    count={TESTNET_CHAINS.length}
                    icon="🧪"
                  >
                    Testnets
                  </TabButton>
                </div>
              )}
            </div>

            {/* Chain List */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar min-h-0">
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
            <div className="flex-shrink-0 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>
                    Connected to{' '}
                    <span className="text-white font-semibold">
                      {ALL_CHAINS.find(c => c.id === currentChainId)?.name || 'Unknown'}
                    </span>
                  </span>
                </div>
                <div className="text-gray-500">
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
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count: number
  icon: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-1 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
          : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">{icon}</span>
        <span>{children}</span>
        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/20' : 'bg-gray-700'
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
      className={`relative w-full p-2.5 rounded-lg transition-colors duration-150 text-left ${
        isActive
          ? 'bg-gradient-to-r from-blue-600/40 to-purple-600/40 border-2 border-blue-500'
          : 'bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/60'
      } ${isSwitching ? 'cursor-wait' : 'cursor-pointer'}`}
    >
      {/* Active Badge */}
      {isActive && !isSwitching && (
        <div className="absolute -top-1 -right-1">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-md">
            <span className="text-xs font-semibold text-white">Active</span>
          </div>
        </div>
      )}

      {/* Switching Badge */}
      {isSwitching && (
        <div className="absolute -top-1 -right-1">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-md animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-xs font-semibold text-white">Switching...</span>
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
          <h3 className="font-medium text-white text-sm truncate">
            {chain.name}
          </h3>
          {isSwitching && (
            <p className="text-xs text-yellow-400 mt-0.5">Approve in your wallet...</p>
          )}
        </div>
      </div>

    </button>
  )
}
