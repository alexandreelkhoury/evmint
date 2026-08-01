import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

function LogoMark({ width = 64 }: { width?: number }) {
  const height = width * (140 / 180)
  return (
    <svg viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" width={width} height={height} aria-hidden="true" style={{ filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.3))' }}>
      <g transform="translate(50,0)"><path d="M50 0L93.3 25V75L50 100L6.7 75V25Z" fill="#06B6D4" opacity=".9"/></g>
      <g transform="translate(10,40) scale(.9)"><path d="M50 0L93.3 25V75L50 100L6.7 75V25Z" fill="#A855F7" opacity=".85"/></g>
      <g transform="translate(90,40) scale(.9)"><path d="M50 0L93.3 25V75L50 100L6.7 75V25Z" fill="#3B82F6" opacity=".9"/></g>
    </svg>
  )
}

export default function LoadingSpinner({
  size = 'medium',
  message,
}: LoadingSpinnerProps) {
  const logoWidth = { small: 40, medium: 56, large: 72 }[size]

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-7"
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LogoMark width={logoWidth} />
      </motion.div>

      {/* Sliding bar — matches HTML splash */}
      <div className="w-40 h-[3px] bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full w-[40%] rounded-full"
          style={{ background: 'linear-gradient(90deg,#06B6D4,#3B82F6,#A855F7)' }}
          animate={{ x: ['-100%', '350%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Message fades in after a delay so fast loads never flash text */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-gray-400 text-xs font-medium tracking-widest uppercase"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

// Minimal inline spinner for small spaces
export function InlineSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`inline-block w-4 h-4 border-2 border-gray-700 rounded-full ${className}`}
      style={{
        borderTopColor: '#3B82F6',
        borderRightColor: 'transparent',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      role="status"
      aria-label="Loading"
    />
  )
}
