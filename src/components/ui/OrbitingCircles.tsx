import React from 'react'

interface OrbitingCirclesProps {
  radius: number
  duration: number
  reverse?: boolean
  path?: boolean
  iconSize?: number
  children: React.ReactNode
}

export default function OrbitingCircles({
  radius,
  duration,
  reverse = false,
  path = false,
  iconSize = 40,
  children,
}: OrbitingCirclesProps) {
  const items = React.Children.toArray(children)
  const angleStep = 360 / items.length

  return (
    <>
      {/* Optional orbit path ring */}
      {path && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={1}
          />
        </svg>
      )}

      {items.map((child, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 animate-orbit"
          style={{
            '--angle': angleStep * i,
            '--radius': radius,
            '--duration': `${duration}s`,
            width: iconSize,
            height: iconSize,
            marginLeft: -(iconSize / 2),
            marginTop: -(iconSize / 2),
            animationDirection: reverse ? 'reverse' : 'normal',
          } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </>
  )
}
