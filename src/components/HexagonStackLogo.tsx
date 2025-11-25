import { motion } from 'framer-motion'

interface HexagonStackLogoProps {
  size?: number
  animated?: boolean
  className?: string
}

export default function HexagonStackLogo({
  size = 120,
  animated = true,
  className = ''
}: HexagonStackLogoProps) {
  // Hexagon path (pointing up)
  const hexagonPath = "M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"

  const hexagons = [
    {
      gradient: 'hexagon-cyan',
      delay: 0,
      x: 50,
      y: 0,
      scale: 1,
      opacity: 0.9,
      colors: ['#06B6D4', '#0891B2']
    },
    {
      gradient: 'hexagon-purple',
      delay: 0.1,
      x: 10,
      y: 40,
      scale: 0.9,
      opacity: 0.85,
      colors: ['#A855F7', '#9333EA']
    },
    {
      gradient: 'hexagon-blue',
      delay: 0.2,
      x: 90,
      y: 40,
      scale: 0.9,
      opacity: 0.9,
      colors: ['#3B82F6', '#2563EB']
    }
  ]

  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradient for cyan hexagon */}
        <linearGradient id="hexagon-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.95" />
        </linearGradient>

        {/* Gradient for purple hexagon */}
        <linearGradient id="hexagon-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9333EA" stopOpacity="0.9" />
        </linearGradient>

        {/* Gradient for blue hexagon */}
        <linearGradient id="hexagon-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.95" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Render hexagons in triangular arrangement */}
      {hexagons.map((hex, index) => {
        const HexagonComponent = animated ? motion.path : 'path'
        const GroupComponent = animated ? motion.g : 'g'

        const animationProps = animated ? {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: hex.opacity, scale: hex.scale },
          transition: {
            duration: 0.6,
            delay: hex.delay,
            ease: "easeOut"
          },
          whileHover: {
            scale: hex.scale * 1.1,
            transition: { duration: 0.2 }
          }
        } : {}

        const groupProps = animated ? {} : { transform: `scale(${hex.scale})` }

        return (
          <GroupComponent key={index} transform={`translate(${hex.x}, ${hex.y})`} {...groupProps}>
            <HexagonComponent
              d={hexagonPath}
              fill={`url(#${hex.gradient})`}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              filter="url(#glow)"
              {...animationProps}
            />
          </GroupComponent>
        )
      })}
    </svg>
  )
}

// Icon-only version (smaller, simpler)
export function HexagonStackIcon({
  size = 40,
  className = ''
}: { size?: number, className?: string }) {
  const hexagonPath = "M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"

  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="icon-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="icon-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9333EA" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="icon-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <g transform="translate(50, 0) scale(1)">
        <path d={hexagonPath} fill="url(#icon-cyan)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      </g>
      <g transform="translate(10, 40) scale(0.9)">
        <path d={hexagonPath} fill="url(#icon-purple)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      </g>
      <g transform="translate(90, 40) scale(0.9)">
        <path d={hexagonPath} fill="url(#icon-blue)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      </g>
    </svg>
  )
}
