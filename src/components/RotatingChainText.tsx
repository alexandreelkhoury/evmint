import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MAINNET_CHAINS } from '../config/chains'

interface RotatingChainTextProps {
  interval?: number
  className?: string
}

export default function RotatingChainText({ interval = 2500, className = '' }: RotatingChainTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MAINNET_CHAINS.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  const currentChain = MAINNET_CHAINS[currentIndex]

  return (
    <div className={`inline-block relative ${className}`} style={{ minWidth: '180px' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentChain.id}
          initial={{
            opacity: 0,
            y: 30,
            filter: 'blur(8px)'
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
          }}
          exit={{
            opacity: 0,
            y: -30,
            filter: 'blur(8px)'
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap"
        >
          {currentChain.name}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
