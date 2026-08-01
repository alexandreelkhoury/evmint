import { useState } from 'react'

// Import chain icons from @web3icons/react
import {
  NetworkEthereum,
  NetworkArbitrumOne,
  NetworkOptimism,
  NetworkPolygon,
  NetworkBinanceSmartChain,
  NetworkAvalanche,
  NetworkFantom,
  NetworkGnosis,
  NetworkMoonbeam,
  NetworkBlast,
  NetworkWorld,
} from '@web3icons/react'

interface ChainIconProps {
  chainId: number
  className?: string
  size?: number
}

/**
 * Chain Icon Component
 * Uses @web3icons/react library as primary source with CDN fallback
 *
 * Strategy:
 * 1. Try @web3icons/react component (bundled, reliable) ⭐ PRIMARY
 * 2. Fall back to CDN URLs (for chains not in library)
 * 3. Show gradient circle (ultimate fallback)
 *
 * Accessibility: this is a purely decorative chain mark and is hidden from
 * assistive tech in every branch. Callers must supply the chain name as
 * adjacent text, an aria-label on the control, or an sr-only span.
 */
export default function ChainIcon({ chainId, className = '', size = 40 }: ChainIconProps) {
  const [imageError, setImageError] = useState(false)
  const [cdnIndex, setCdnIndex] = useState(0)

  // Map chain IDs to @web3icons/react components
  const getWeb3IconComponent = (id: number): React.ComponentType<any> | null => {
    const iconMap: Record<number, React.ComponentType<any>> = {
      // Ethereum
      1: NetworkEthereum,
      11155111: NetworkEthereum,
      // Base - using CDN instead (better icon quality)
      // Arbitrum
      42161: NetworkArbitrumOne,
      421614: NetworkArbitrumOne,
      // Optimism
      10: NetworkOptimism,
      11155420: NetworkOptimism,
      // Polygon
      137: NetworkPolygon,
      80002: NetworkPolygon,
      // BSC
      56: NetworkBinanceSmartChain,
      97: NetworkBinanceSmartChain,
      // Avalanche
      43114: NetworkAvalanche,
      43113: NetworkAvalanche,
      // Fantom
      250: NetworkFantom,
      4002: NetworkFantom,
      // Gnosis
      100: NetworkGnosis,
      // Moonbeam
      1284: NetworkMoonbeam,
      1287: NetworkMoonbeam,
      // WorldChain
      480: NetworkWorld,
      // Blast
      81457: NetworkBlast,
      168587773: NetworkBlast,
    }
    return iconMap[id] || null
  }

  // Fallback: Map chain IDs to CDN URLs (for chains not in @web3icons)
  const getCdnIconName = (id: number): string | null => {
    const chainNames: Record<number, string> = {
      1: 'ethereum',
      11155111: 'ethereum',
      8453: 'base',
      84532: 'base',
      42161: 'arbitrum',
      421614: 'arbitrum',
      10: 'optimism',
      11155420: 'optimism',
      137: 'polygon',
      80002: 'polygon',
      56: 'binance',
      97: 'binance',
      43114: 'avalanche',
      43113: 'avalanche',
      250: 'fantom',
      4002: 'fantom',
      100: 'gnosis',
      1284: 'moonbeam',
      1287: 'moonbeam',
      480: 'worldchain',
      81457: 'blast',
      168587773: 'blast',
      143: 'monad',
      4326: 'megaeth',
      6342: 'megaeth',
      4663: 'robinhood',
      46630: 'robinhood',
    }
    return chainNames[id] || null
  }

  // CDN URLs for fallback (when @web3icons doesn't have the chain)
  const getIconUrls = (name: string): string[] => {
    const directUrls: Record<string, string[]> = {
      ethereum: [
        'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/ethereum.png',
        'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      ],
      base: [
        'https://avatars.githubusercontent.com/u/108554348',
        'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
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
      monad: [
        'https://monadscan.com/assets/monad/images/svg/logos/chain-light.svg',
        'https://monadscan.com/assets/monad/images/svg/logos/chain-dark.svg',
      ],
      megaeth: [
        'https://megaeth.com/favicon.svg',
        'https://l2beat.com/icons/megaeth.png',
      ],
      robinhood: [
        'https://robinhood.com/favicon.ico',
        'https://avatars.githubusercontent.com/u/51801908?s=200&v=4',
      ],
    }

    return directUrls[name] || []
  }

  const IconComponent = getWeb3IconComponent(chainId)
  const cdnName = getCdnIconName(chainId)

  // Special positioning adjustments for specific chains
  const getIconTransform = (id: number): string => {
    // Avalanche needs to be pushed up slightly
    if (id === 43114 || id === 43113) {
      return 'translateY(-10%)'
    }
    return 'none'
  }

  // Primary: Try to use @web3icons/react component (bundled, no CDN dependency!)
  if (IconComponent) {
    return (
      <div className={className} aria-hidden="true" style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconComponent
          width={size}
          height={size}
          className="rounded-full"
          style={{ transform: getIconTransform(chainId) }}
        />
      </div>
    )
  }

  // Fallback: Use CDN URLs (for chains not in @web3icons library like Gnosis, Moonbeam, WorldChain, Blast)
  if (cdnName && !imageError) {
    const iconUrls = getIconUrls(cdnName)

    if (iconUrls.length > 0) {
      const currentUrl = iconUrls[cdnIndex]

      const handleImageError = () => {
        // Try next CDN source
        if (cdnIndex < iconUrls.length - 1) {
          setCdnIndex(cdnIndex + 1)
        } else {
          // All CDNs failed, show gradient fallback
          setImageError(true)
        }
      }

      return (
        <img
          src={currentUrl}
          alt=""
          aria-hidden="true"
          className={`rounded-full object-cover shadow-md ${className}`}
          style={{ width: size, height: size }}
          onError={handleImageError}
        />
      )
    }
  }

  // Ultimate fallback: Gradient circle with first letter
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg ${className}`}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
        {cdnName ? cdnName[0].toUpperCase() : '?'}
      </span>
    </div>
  )
}
