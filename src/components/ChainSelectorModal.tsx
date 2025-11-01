import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwitchChain, useChainId } from 'wagmi'
import { ALL_CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainConfig } from '../config/chains'
import { useChainConfig } from '../hooks/useChainConfig'
import { ChainBadge } from './ChainBadge'
import { logEvent } from '../utils/analytics'

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

  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'mainnet' | 'testnet'>('all')
  const [switchingTo, setSwitchingTo] = useState<number | null>(null)

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

      // Log analytics
      logEvent('chain_switched', {
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
      console.error('Failed to switch chain:', error)
      setSwitchingTo(null)
      // Don't close modal on error so user can try again
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Select Network
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search networks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>
          </motion.div>
        </>
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
  const hasLiquidity = chain.features.uniswapV2 || chain.features.uniswapV3 || chain.features.hasMultipleDex

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isSwitching}
      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
        isActive
          ? 'border-green-500 bg-green-500/10'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
      } ${isSwitching ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
      )}

      {/* Chain Info */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{chain.icon}</span>
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
