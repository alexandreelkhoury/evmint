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
      4002: 'fantom',
      // Gnosis (xDai)
      100: 'gnosis',
      // Moonbeam
      1284: 'moonbeam',
      1287: 'moonbeam',
      // WorldChain
      480: 'worldchain',
      // Blast
      81457: 'blast',
      168587773: 'blast',
    }
    return chainNames[id] || null
  }

  const chainName = getChainName(chainId)

  // Multiple CDN sources for redundancy and better quality
  const getIconUrls = (name: string): string[] => {
    // Direct URLs for each chain (more reliable than templates)
    const directUrls: Record<string, string[]> = {
      ethereum: [
        'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/ethereum.png',
        'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      ],
      base: [
        'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
        'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo.png',
      ],
      arbitrum: [
        'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/arbitrum.png',
        'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
      ],
      optimism: [
        'https://avatars.githubusercontent.com/u/38683283?s=200&v=4',
        'https://optimism.mirror.xyz/87eaWY_TVu-NvXY7YJyNKIRjpgCbQEYjHl9YXJ4VKhI/thumbnail',
        'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
      ],
      polygon: [
        'https://avatars.githubusercontent.com/u/52841242?s=200&v=4',
        'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
        'https://cryptologos.cc/logos/polygon-matic-logo.png',
      ],
      binance: [
        'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/binance-coin.png',
        'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      ],
      avalanche: [
        'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/avalanche.png',
        'https://cryptologos.cc/logos/avalanche-avax-logo.png',
      ],
      fantom: [
        'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/fantom.png',
        'https://cryptologos.cc/logos/fantom-ftm-logo.png',
      ],
      gnosis: [
        'https://avatars.githubusercontent.com/u/24954468?s=280&v=4',
        'https://cryptologos.cc/logos/gnosis-gno-gno-logo.png',
      ],
      moonbeam: [
        'https://avatars.githubusercontent.com/u/82559613?s=200&v=4',
        'https://cryptologos.cc/logos/moonbeam-glmr-logo.png',
      ],
      worldchain: [
        'https://avatars.githubusercontent.com/u/150247560?s=200&v=4',
        'https://pbs.twimg.com/profile_images/1693268884751052800/yq7OTW4f_400x400.jpg',
      ],
      blast: [
        'https://avatars.githubusercontent.com/u/154318375?s=200&v=4',
        'https://pbs.twimg.com/profile_images/1725648163638861824/xPb8c3Sh_400x400.jpg',
      ],
    }

    return directUrls[name] || [
      `https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/${name}.png`,
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
