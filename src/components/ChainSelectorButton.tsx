import { useState } from 'react'
import { motion } from 'framer-motion'
import { useChainConfig } from '../hooks/useChainConfig'
import ChainSelectorModal from './ChainSelectorModal'
import { logEvent } from '../utils/analytics'

/**
 * Chain Selector Button
 * Displays current chain and opens selector modal on click
 *
 * Features:
 * - Shows current chain icon and name
 * - Visual indicator when on unsupported chain
 * - Compact mobile version
 * - Opens chain selector modal
 */
export default function ChainSelectorButton() {
  const [modalOpen, setModalOpen] = useState(false)
  const { name, icon, isSupported, isTestnet, color } = useChainConfig()

  const handleClick = () => {
    setModalOpen(true)
    logEvent('chain_selector_opened', {
      current_chain: name,
      is_supported: isSupported,
    })
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all border-2 backdrop-blur-sm ${
          isSupported
            ? 'bg-gray-800/80 border-gray-700 hover:border-gray-600 hover:bg-gray-800 text-white'
            : 'bg-red-500/20 border-red-500/50 hover:border-red-500 text-red-400 animate-pulse'
        }`}
        title={isSupported ? `Current network: ${name}` : `Unsupported network: ${name}`}
      >
        {/* Chain Icon */}
        <span className="text-lg sm:text-xl">{icon}</span>

        {/* Chain Name (hidden on small mobile) */}
        <span className="hidden sm:inline text-sm font-semibold truncate max-w-[120px] md:max-w-[150px]">
          {name}
          {isTestnet && <span className="ml-1 text-xs opacity-70">(Test)</span>}
        </span>

        {/* Warning indicator for unsupported chains */}
        {!isSupported && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}

        {/* Dropdown indicator */}
        <svg
          className="w-4 h-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.button>

      {/* Chain Selector Modal */}
      <ChainSelectorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
