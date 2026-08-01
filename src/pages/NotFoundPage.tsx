import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { trackPageView, trackError } from '../utils/analytics'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { Helmet } from 'react-helmet-async'

export default function NotFoundPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, '404')
    trackError(analytics, 'Page not found', '404_page', {
      error_type: '404'
    })
  }, [analytics])

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | EVMint</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Animated 404 */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-9xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </p>
            </motion.div>

            {/* Floating Hexagons Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center gap-4 mb-12"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16"
                >
                  <svg viewBox="0 0 100 100" fill="none">
                    <path
                      d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                      fill={`url(#gradient-${i})`}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop
                          offset="0%"
                          stopColor={i === 0 ? '#06B6D4' : i === 1 ? '#A855F7' : '#3B82F6'}
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor={i === 0 ? '#0891B2' : i === 1 ? '#9333EA' : '#2563EB'}
                          stopOpacity="0.5"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 shadow-lg hover:shadow-cyan-500/50 inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go Home
              </Link>

              <Link
                to="/create"
                className="px-8 py-4 bg-gray-700/50 text-white font-semibold rounded-lg hover:bg-gray-600/50 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 border border-gray-600 inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Token
              </Link>
            </motion.div>

            {/* Popular Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-700"
            >
              <p className="text-gray-500 text-sm mb-4">Popular Pages:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/create"
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  Create Token
                </Link>
                <Link
                  to="/tokens"
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  My Tokens
                </Link>
                <Link
                  to="/liquidity"
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  Add Liquidity
                </Link>
                <Link
                  to="/guide"
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  Guide
                </Link>
                <Link
                  to="/faq"
                  className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                >
                  FAQ
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
