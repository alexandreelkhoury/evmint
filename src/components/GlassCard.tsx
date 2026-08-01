import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { animations, colors } from '../styles/designSystem'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /**
   * Adds a hover scale + `cursor-pointer`. Defaults to `false`: most cards are
   * static containers, and the pointer cursor advertised a click that never
   * happened. Opt in only where the whole card really is a control.
   */
  hoverable?: boolean
  delay?: number
}

export function GlassCard({
  children,
  className = '',
  hoverable = false,
  delay = 0
}: GlassCardProps) {
  const hoverProps = hoverable ? animations.hoverScale : {}
  const cursorClass = hoverable ? 'cursor-pointer' : ''

  return (
    <motion.div
      className={`${colors.glassCard} p-8 ${cursorClass} ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      {...hoverProps}
    >
      {children}
    </motion.div>
  )
}