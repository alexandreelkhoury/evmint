import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

export default function LoadingSpinner({
  size = 'medium',
  message = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] gap-4"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Clean, Professional Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-3 border-gray-700`}
          style={{
            borderTopColor: 'transparent',
            borderRightColor: '#06B6D4',
            borderBottomColor: 'transparent',
            borderLeftColor: '#3B82F6',
            borderWidth: '3px'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
        </motion.div>
      </div>

      {/* Loading Text */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm font-medium tracking-wide"
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
        borderTopColor: '#06B6D4',
        borderRightColor: 'transparent'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear"
      }}
      role="status"
      aria-label="Loading"
    />
  )
}

// Alternative: Modern Progress Bar Loader
export function ProgressLoader({
  message = 'Loading...'
}: { message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] gap-6"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Progress bar container */}
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Loading Text */}
      {message && (
        <p className="text-gray-400 text-sm font-medium tracking-wide">
          {message}
        </p>
      )}
    </div>
  )
}

// Alternative: Skeleton Loader (Most Professional)
export function SkeletonLoader() {
  return (
    <div className="flex flex-col min-h-[400px] p-8 gap-6 max-w-4xl mx-auto">
      {/* Header skeleton */}
      <div className="space-y-3">
        <motion.div
          className="h-8 bg-gray-800 rounded-lg w-1/3"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-4 bg-gray-800 rounded w-2/3"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="h-32 bg-gray-800 rounded-xl"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    </div>
  )
}
