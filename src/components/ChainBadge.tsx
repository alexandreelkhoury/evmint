import { useSpecificChainConfig } from '../hooks/useChainConfig'

interface ChainBadgeProps {
  chainId: number
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

/**
 * Chain Badge Component
 * Displays a visual indicator for a specific blockchain
 *
 * Features:
 * - Chain icon (emoji)
 * - Optional chain name
 * - Multiple sizes
 * - Color-coded by chain
 * - Tooltip on hover
 */
export default function ChainBadge({ chainId, size = 'md', showName = true, className = '' }: ChainBadgeProps) {
  const { name, icon, color, isTestnet, isSupported } = useSpecificChainConfig(chainId)

  if (!isSupported) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-700 text-gray-400 text-xs ${className}`}>
        <span>⛓️</span>
        {showName && <span>Unknown Chain</span>}
      </span>
    )
  }

  // Size configurations
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }

  // Chain-specific styling
  const badgeStyle = {
    backgroundColor: `${color}20`, // 20% opacity
    borderColor: color,
    color: color,
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-sm ${sizeClasses[size]} ${className}`}
      style={badgeStyle}
      title={`${name}${isTestnet ? ' (Testnet)' : ''}`}
    >
      <span className={iconSizes[size]}>{icon}</span>
      {showName && (
        <span className="font-medium whitespace-nowrap">
          {name}
          {isTestnet && size !== 'sm' && (
            <span className="ml-1 opacity-70 text-xs">(Test)</span>
          )}
        </span>
      )}
    </span>
  )
}

/**
 * Compact Chain Icon Only Badge
 * Useful for tight spaces
 */
export function ChainIcon({ chainId, size = 'md', className = '' }: Omit<ChainBadgeProps, 'showName'>) {
  return <ChainBadge chainId={chainId} size={size} showName={false} className={className} />
}

/**
 * Chain Badge with Background Gradient
 * More prominent visual style
 */
export function ChainBadgeGradient({ chainId, size = 'md', showName = true, className = '' }: ChainBadgeProps) {
  const { name, icon, gradient, isTestnet, isSupported } = useSpecificChainConfig(chainId)

  if (!isSupported) {
    return <ChainBadge chainId={chainId} size={size} showName={showName} className={className} />
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradient} text-white font-semibold shadow-lg ${sizeClasses[size]} ${className}`}
      title={`${name}${isTestnet ? ' (Testnet)' : ''}`}
    >
      <span className={iconSizes[size]}>{icon}</span>
      {showName && (
        <span className="whitespace-nowrap">
          {name}
          {isTestnet && size !== 'sm' && <span className="ml-1 opacity-90 text-xs">(Test)</span>}
        </span>
      )}
    </span>
  )
}
