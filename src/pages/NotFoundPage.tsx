import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { trackPageView, trackError } from '../utils/analytics'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { Helmet } from 'react-helmet-async'

const quickLinks = [
  { to: '/create', label: 'Create Token', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { to: '/guides', label: 'Guides', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { to: '/faq', label: 'FAQ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01' },
  { to: '/tokens', label: 'My Tokens', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { to: '/liquidity', label: 'Liquidity', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { to: '/blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2' },
]

export default function NotFoundPage() {
  const analytics = useFirebaseAnalytics()
  const location = useLocation()

  useEffect(() => {
    const attemptedPath = location.pathname + location.search
    trackPageView(analytics, '404')
    trackError(analytics, `404: ${attemptedPath}`, '404_page', {
      error_type: '404',
      attempted_url: attemptedPath.slice(0, 95),
      referrer: document.referrer?.slice(0, 95) || 'direct',
    })
  }, [analytics, location.pathname, location.search])

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | EVMint</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-gray-900 text-white flex items-center justify-center p-4 min-h-[70vh]">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            {/* 404 heading */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-6xl sm:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                404
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Page Not Found</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </motion.div>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-colors duration-150"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.10] text-white font-semibold rounded-xl transition-colors duration-150"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Token
              </Link>
            </motion.div>

            {/* Quick links grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.25 }}
              className="pt-8 border-t border-white/[0.06]"
            >
              <p className="text-sm text-gray-500 mb-4">Or try one of these:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.05] transition-colors text-sm text-gray-300 hover:text-white"
                  >
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                    </svg>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
