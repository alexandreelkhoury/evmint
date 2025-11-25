import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import RotatingChainText from '../../../components/RotatingChainText'

/**
 * Hero section component for HomePage
 * Features: Logo, headline with rotating chain text, CTA buttons, scroll indicator
 */
export default function HeroSection() {
  return (
    <motion.div
      className="text-center min-h-screen flex flex-col justify-center mb-32"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0 }}
    >

      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="block text-white drop-shadow-lg"
          >
            Deploy Tokens On
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="block"
          >
            <RotatingChainText className="text-6xl sm:text-7xl lg:text-8xl font-black" interval={2000} />
          </motion.div>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-2xl sm:text-3xl text-gray-300 max-w-5xl mx-auto mb-16 leading-relaxed font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        The most <span className="text-blue-400 font-semibold">powerful</span> and <span className="text-purple-400 font-semibold">user-friendly</span> way to launch ERC20 tokens across multiple EVM blockchains.
        <br />
        <span className="text-xl text-gray-400 mt-4 block">No coding skills required. Support for 13+ chains including Base, Monad, Arbitrum & more.</span>
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
      >
        <motion.div
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            to="/create"
            className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-300 border border-blue-400/30"
          >
            <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Launch Your Token Now
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            to="/guides?guide=token-creation"
            className="inline-flex items-center px-8 py-5 text-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 rounded-2xl backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            See How It Works
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="mt-24"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-gray-400 hover:text-blue-400 transition-colors cursor-pointer group"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          {/* Mouse Icon */}
          <div className="w-7 h-11 border-2 border-current rounded-full mb-3 group-hover:border-blue-400 transition-all duration-300 bg-black/20 backdrop-blur-sm flex items-start justify-center pt-2 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-current rounded-full group-hover:bg-blue-400 transition-colors"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
