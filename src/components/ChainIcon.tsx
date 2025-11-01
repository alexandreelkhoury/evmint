import { useState } from 'react'

interface ChainIconProps {
  chainId: number
  className?: string
  size?: number
}

/**
 * Chain Icon Component
 * Displays chain logos using multiple high-quality CDN sources with smart fallback
 */
export default function ChainIcon({ chainId, className = '', size = 40 }: ChainIconProps) {
  const [imageError, setImageError] = useState(false)
  const [cdnIndex, setCdnIndex] = useState(0)

  // Map chain IDs to their canonical names for different CDNs
  const getChainName = (id: number): string | null => {
    const chainNames: Record<number, string> = {
      // Ethereum
      1: 'ethereum',
      11155111: 'ethereum',
      // Base
      8453: 'base',
      84532: 'base',
      // Arbitrum
      42161: 'arbitrum',
      421614: 'arbitrum',
      // Optimism
      10: 'optimism',
      11155420: 'optimism',
      // Polygon
      137: 'polygon',
      80002: 'polygon',
      // BSC
      56: 'binance',
      97: 'binance',
      // Avalanche
      43114: 'avalanche',
      43113: 'avalanche',
      // Fantom
      250: 'fantom',
    }
    return chainNames[id] || null
  }

  const chainName = getChainName(chainId)

  // Multiple CDN sources for redundancy and better quality
  const getIconUrls = (name: string): string[] => {
    return [
      // Primary: Chainlist API (high quality)
      `https://defillama.com/chain-icons/rsz_${name}.jpg`,
      // Secondary: LlamaFi (backup)
      `https://icons.llamao.fi/icons/chains/rsz_${name}.jpg`,
      // Tertiary: Raw githubusercontent (Trust Wallet assets as last resort)
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${name}/info/logo.png`,
    ]
  }

  // Show fallback if no chain name or all CDNs failed
  if (!chainName || imageError) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
          {chainName ? chainName[0].toUpperCase() : '?'}
        </span>
      </div>
    )
  }

  const iconUrls = getIconUrls(chainName)
  const currentUrl = iconUrls[cdnIndex]

  const handleImageError = () => {
    // Try next CDN source
    if (cdnIndex < iconUrls.length - 1) {
      setCdnIndex(cdnIndex + 1)
    } else {
      // All CDNs failed, show fallback
      setImageError(true)
    }
  }

  return (
    <img
      src={currentUrl}
      alt={`${chainName} icon`}
      className={`rounded-full object-cover shadow-md ${className}`}
      style={{ width: size, height: size }}
      onError={handleImageError}
    />
  )
}
