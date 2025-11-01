import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { typography, colors } from '../../../styles/designSystem'

export default function GettingStartedCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="mt-20"
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>

        {/* CTA Card */}
        <div className={`relative ${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center border-white/[0.2]`}>
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center p-3">
              <img
                src="/LOGO.png"
                alt="Base Token Creator Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-4`}>
            Need help getting <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">started</span>?
            </h3>

            <p className={`${typography.subtitle} text-xl mb-8 max-w-2xl mx-auto`}>
              Check out our comprehensive guides and FAQ section!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/guides"
                className={`inline-flex items-center px-8 py-4 ${colors.secondaryButton} font-medium text-lg rounded-2xl`}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read Guides
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/faq"
                className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} font-semibold text-lg rounded-2xl`}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Help
              </Link>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-8 mt-8 pt-8 border-t border-white/10">
            <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
              <svg className={`w-5 h-5 ${typography.success.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={typography.label}>No Code Required</span>
            </div>
            <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
              <svg className={`6-5 h-6 ${typography.info.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className={typography.label}>15s Deploy</span>
            </div>
            <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className={typography.label}>Low Cost</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
