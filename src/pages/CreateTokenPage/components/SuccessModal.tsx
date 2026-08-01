import { useState } from 'react'
import { Link } from 'react-router-dom'

interface SuccessModalProps {
  tokenAddress: string
  chainName: string
  tokenName?: string
  tokenSymbol?: string
  totalSupply?: string
}

export default function SuccessModal({
  tokenAddress,
  chainName,
  tokenName,
  tokenSymbol,
  totalSupply
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatSupply = (supply: string) => {
    const num = parseInt(supply)
    if (isNaN(num)) return supply
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getExplorerUrl = () => {
    const explorers: Record<string, string> = {
      'Base': 'basescan.org',
      'Ethereum': 'etherscan.io',
      'Arbitrum One': 'arbiscan.io',
      'Arbitrum': 'arbiscan.io',
      'Optimism': 'optimistic.etherscan.io',
      'Polygon': 'polygonscan.com',
      'BNB Smart Chain': 'bscscan.com',
      'BSC': 'bscscan.com',
      'Avalanche': 'snowtrace.io',
      'Fantom': 'ftmscan.com',
      'Gnosis': 'gnosisscan.io',
      'Moonbeam': 'moonscan.io',
      'World Chain': 'worldscan.org',
      'Blast': 'blastscan.io',
      'Monad': 'monadscan.com',
      'Sepolia': 'sepolia.etherscan.io',
      'Base Sepolia': 'sepolia.basescan.org',
      'Arbitrum Sepolia': 'sepolia.arbiscan.io',
      'Optimism Sepolia': 'sepolia-optimism.etherscan.io',
      'Polygon Amoy': 'amoy.polygonscan.com',
      'BSC Testnet': 'testnet.bscscan.com',
      'Avalanche Fuji': 'testnet.snowtrace.io',
      'Moonbase Alpha': 'moonbase.moonscan.io',
      'Blast Sepolia': 'sepolia.blastscan.io',
      'Monad Testnet': 'testnet.monadscan.com',
    }
    const domain = explorers[chainName] || 'etherscan.io'
    return `https://${domain}/address/${tokenAddress}`
  }

  const getChainHashtag = () => {
    return chainName
      .replace(/\s*(Sepolia|Testnet|Amoy|Fuji|Alpha)\s*/gi, '')
      .replace(/\s+/g, '')
  }

  const displayName = tokenName || 'My Token'
  const displaySymbol = tokenSymbol || 'TOKEN'
  const displaySupply = totalSupply ? formatSupply(totalSupply) : '???'

  const tweetText = `Just deployed $${displaySymbol} on ${chainName}

${displayName} | ${displaySupply} supply

Built with @EVMint_io

${getExplorerUrl()}

#${displaySymbol} #${getChainHashtag()} #DeFi #Web3`

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`

  const trackShare = (platform: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'token_creation',
        item_id: tokenAddress
      })
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Token created on {chainName}</h3>
          {tokenName && (
            <p className="text-xs text-gray-400">{tokenName} ({tokenSymbol}) &middot; {displaySupply} supply</p>
          )}
        </div>
      </div>

      {/* Contract address */}
      <div className="rounded-lg bg-black/20 border border-white/5 px-3 py-2.5 mb-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Contract Address</p>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono text-gray-300 break-all flex-1">{tokenAddress}</code>
          <button
            type="button"
            onClick={handleCopyAddress}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/5 hover:bg-white/10 text-gray-400'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Actions — clear hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <Link
          to="/liquidity"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Add Liquidity
        </Link>
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-medium rounded-xl transition-colors"
        >
          View on Explorer
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Secondary actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare('twitter')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </a>
        <Link
          to="/tokens"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg transition-colors"
        >
          View My Tokens
        </Link>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            window.location.reload()
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg transition-colors"
        >
          Create Another
        </button>
      </div>
    </div>
  )
}
