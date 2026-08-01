import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { animations, colors } from '../styles/designSystem'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  delay?: number
}

export function GlassCard({
  children,
  className = '',
  hoverable = true,
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