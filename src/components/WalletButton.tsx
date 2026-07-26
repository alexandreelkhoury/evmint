import { loggers } from '../utils/logger'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useAccount } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { useState, useRef, useEffect } from 'react'
import { colors } from '../styles/designSystem'
import { useGlobalToasts } from '../App'
import NetworkSelectorModal from './NetworkSelectorModal'
import ChainIcon from './ChainIcon'

export default function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const { chain, isConnected, address } = useAccount()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false)
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toasts = useGlobalToasts()
  
  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen])

  // Get the active wallet's chain info
  const activeWallet = wallets.find(wallet => 
    wallet.walletClientType === 'privy' || 
    wallet.walletClientType === 'metamask' ||
    wallet.walletClientType === 'coinbase_wallet' ||
    wallet.walletClientType === 'wallet_connect'
  )
  const walletChainId = activeWallet?.chainId
  
  // Helper function to get chain info from chain ID
  const getChainInfo = (chainId: string | number | undefined) => {
    let numChainId: number | undefined

    if (typeof chainId === 'string') {
      if (chainId.startsWith('eip155:')) {
        numChainId = parseInt(chainId.split(':')[1])
      } else {
        numChainId = parseInt(chainId)
      }
    } else {
      numChainId = chainId
    }

    switch (numChainId) {
      // Base chains
      case 8453:
        return { name: 'Base Mainnet', color: 'text-blue-400', isBase: true, chainId: numChainId }
      case 84532:
        return { name: 'Base Sepolia', color: 'text-blue-400', isBase: true, chainId: numChainId }

      // Ethereum
      case 1:
        return { name: 'Ethereum', color: 'text-purple-400', isBase: false, chainId: numChainId }
      case 11155111:
        return { name: 'Sepolia', color: 'text-purple-400', isBase: false, chainId: numChainId }

      // Arbitrum
      case 42161:
        return { name: 'Arbitrum One', color: 'text-cyan-400', isBase: false, chainId: numChainId }
      case 421614:
        return { name: 'Arbitrum Sepolia', color: 'text-cyan-400', isBase: false, chainId: numChainId }

      // Optimism
      case 10:
        return { name: 'Optimism', color: 'text-red-400', isBase: false, chainId: numChainId }
      case 11155420:
        return { name: 'OP Sepolia', color: 'text-red-400', isBase: false, chainId: numChainId }

      // Polygon
      case 137:
        return { name: 'Polygon', color: 'text-purple-400', isBase: false, chainId: numChainId }
      case 80002:
        return { name: 'Polygon Amoy', color: 'text-purple-400', isBase: false, chainId: numChainId }

      // Binance Smart Chain
      case 56:
        return { name: 'BNB Smart Chain', color: 'text-yellow-400', isBase: false, chainId: numChainId }
      case 97:
        return { name: 'BNB Testnet', color: 'text-yellow-400', isBase: false, chainId: numChainId }

      // Avalanche
      case 43114:
        return { name: 'Avalanche', color: 'text-red-400', isBase: false, chainId: numChainId }
      case 43113:
        return { name: 'Avalanche Fuji', color: 'text-red-400', isBase: false, chainId: numChainId }

      // Fantom
      case 250:
        return { name: 'Fantom', color: 'text-blue-400', isBase: false, chainId: numChainId }
      case 4002:
        return { name: 'Fantom Testnet', color: 'text-blue-400', isBase: false, chainId: numChainId }

      // Gnosis
      case 100:
        return { name: 'Gnosis', color: 'text-teal-400', isBase: false, chainId: numChainId }

      // Moonbeam
      case 1284:
        return { name: 'Moonbeam', color: 'text-pink-400', isBase: false, chainId: numChainId }
      case 1287:
        return { name: 'Moonbase Alpha', color: 'text-pink-400', isBase: false, chainId: numChainId }

      // WorldChain
      case 480:
        return { name: 'WorldChain', color: 'text-orange-400', isBase: false, chainId: numChainId }

      // Blast
      case 81457:
        return { name: 'Blast', color: 'text-yellow-400', isBase: false, chainId: numChainId }
      case 168587773:
        return { name: 'Blast Sepolia', color: 'text-yellow-400', isBase: false, chainId: numChainId }

      // Monad
      case 143:
        return { name: 'Monad', color: 'text-purple-400', isBase: false, chainId: numChainId }
      case 10143:
        return { name: 'Monad Testnet', color: 'text-purple-400', isBase: false, chainId: numChainId }

      // MegaETH
      case 4326:
        return { name: 'MegaETH', color: 'text-cyan-400', isBase: false, chainId: numChainId }
      case 6342:
        return { name: 'MegaETH Testnet', color: 'text-cyan-400', isBase: false, chainId: numChainId }

      // Robinhood Chain
      case 4663:
        return { name: 'Robinhood 🔥', color: 'text-orange-400', isBase: false, chainId: numChainId }
      case 46630:
        return { name: 'Robinhood Testnet', color: 'text-green-400', isBase: false, chainId: numChainId }

      default:
        return { name: numChainId ? `Chain ${numChainId}` : 'Unknown', color: 'text-gray-400', isBase: false, chainId: numChainId }
    }
  }
  
  // Get current network info
  const currentChain = chain || (walletChainId ? { name: '', id: walletChainId } : null)
  const chainInfo = currentChain ? getChainInfo(currentChain.id) : null
  
  // Get wallet address
  const walletAddress = user?.wallet?.address || address

  // Handle copy address
  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress)
        setShowCopiedFeedback(true)
        setTimeout(() => setShowCopiedFeedback(false), 2000)
        // No toast notification and keep dropdown open
      } catch (error) {
        loggers.wallet.error('Failed to copy address:', error)
        // Only show error toast if copy fails
        toasts.error('Failed to copy address to clipboard', 'Copy Failed')
      }
    }
  }

  const handleDisconnect = () => {
    logout()
    setIsDropdownOpen(false)
    toasts.info('Wallet disconnected successfully', 'Disconnected')
  }

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg cursor-not-allowed"
        disabled
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
          <span>Loading...</span>
        </div>
      </motion.button>
    )
  }

  // Show wallet dropdown when connected
  if (authenticated && user && walletAddress) {
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`${colors.glassCard} px-2 sm:px-4 min-h-[44px] hover:border-white/30 transition-all duration-200 flex items-center space-x-2 sm:space-x-3 min-w-0 max-w-[140px] sm:max-w-none cursor-pointer`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="Wallet menu"
        >
          {/* Wallet Avatar */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* Connection Status Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-1 sm:border-2 border-gray-900 bg-green-500 flex items-center justify-center">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
          
          {/* Wallet Address */}
          <div className="flex flex-col items-start min-w-0 hidden sm:flex">
            <span className="text-white font-medium text-sm truncate">
              {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </span>
            {chainInfo && chainInfo.chainId && (
              <span className={`text-xs flex items-center space-x-1.5 ${chainInfo.color}`}>
                <ChainIcon chainId={chainInfo.chainId} size={14} />
                <span className="truncate">{chainInfo.name}</span>
              </span>
            )}
          </div>
          
          {/* Mobile: Just show short address */}
          <div className="flex flex-col items-start min-w-0 sm:hidden">
            <span className="text-white font-medium text-xs truncate">
              {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-2)}`}
            </span>
          </div>
          
          {/* Dropdown Arrow */}
          <svg 
            className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
                onClick={() => setIsDropdownOpen(false)}
              />
              
              {/* Dropdown content */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
                style={{
                  background: 'rgba(17, 24, 39, 0.98)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}
              >
              {/* User Info Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">Wallet Connected</p>
                    <p className="text-gray-400 text-xs font-mono">{`${walletAddress.slice(0, 5)}...${walletAddress.slice(-5)}`}</p>
                  </div>
                </div>
              </div>

              {/* Network Status */}
              {chainInfo && chainInfo.chainId && (
                <div className="p-3 bg-black/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <ChainIcon chainId={chainInfo.chainId} size={28} />
                      <div>
                        <p className="text-white text-sm font-medium">Current Network</p>
                        <p className={`text-xs ${chainInfo.color}`}>{chainInfo.name}</p>
                      </div>
                    </div>
                    {/* Change Network Icon */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsNetworkModalOpen(true)
                        setIsDropdownOpen(false)
                      }}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      title="Change Network"
                      aria-label="Change Network"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-2 space-y-1">
                {/* Copy Address */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={handleCopyAddress}
                  className="w-full px-3 min-h-[44px] text-left text-white hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer"
                  aria-label={showCopiedFeedback ? 'Address copied' : 'Copy wallet address'}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{showCopiedFeedback ? 'Copied!' : 'Copy Address'}</span>
                </motion.button>

                {/* Change Network */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => {
                    setIsNetworkModalOpen(true)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full px-3 min-h-[44px] text-left text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer"
                  aria-label="Change blockchain network"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-sm">Change Network</span>
                </motion.button>

                {/* View on Explorer */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => {
                    const explorerUrl = chainInfo?.isBase
                      ? (currentChain?.id === 8453 ? `https://basescan.org/address/${walletAddress}` : `https://sepolia.basescan.org/address/${walletAddress}`)
                      : `https://etherscan.io/address/${walletAddress}`
                    window.open(explorerUrl, '_blank')
                  }}
                  className="w-full px-3 min-h-[44px] text-left text-white hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer"
                  aria-label="View wallet on block explorer"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-sm">View on Explorer</span>
                </motion.button>

                {/* Disconnect */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  onClick={handleDisconnect}
                  className="w-full px-3 min-h-[44px] text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-3 cursor-pointer"
                  aria-label="Disconnect wallet"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm">Disconnect Wallet</span>
                </motion.button>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Network Selector Modal */}
        <NetworkSelectorModal
          isOpen={isNetworkModalOpen}
          onClose={() => setIsNetworkModalOpen(false)}
        />
      </div>
    )
  }

  // Show connect button when not authenticated
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={login}
      className={`${colors.primaryButton} px-3 sm:px-4 min-h-[44px] flex items-center text-sm sm:text-base cursor-pointer`}
      aria-label="Connect wallet"
    >
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="hidden xs:inline">Connect Wallet</span>
        <span className="xs:hidden">Connect</span>
      </div>
    </motion.button>
  )
}