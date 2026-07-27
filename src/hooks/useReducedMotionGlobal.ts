import { useReducedMotion } from 'framer-motion'

/**
 * Global reduced motion hook
 * Returns animation props that respect prefers-reduced-motion
 *
 * Usage:
 *   const motion = useMotionSafe()
 *   <motion.div {...motion.fadeIn}>
 *
 * When reduced motion is preferred, all animations resolve to
 * instant opacity transitions (no movement, no scale).
 */
export function useMotionSafe() {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return {
      fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.01 } },
      fadeInUp: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.01 } },
      stagger: { transition: { staggerChildren: 0 } },
      hover: {},
      tap: {},
      reduced: true,
    }
  }

  return {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } },
    fadeInUp: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } },
    stagger: { transition: { staggerChildren: 0.05 } },
    hover: { whileHover: { scale: 1.02 } },
    tap: { whileTap: { scale: 0.98 } },
    reduced: false,
  }
}
