import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { colors, typography } from '../../../styles/designSystem'

/**
 * Call-to-Action section component
 * Final CTA with trust indicators and action buttons
 */
export default function CTASection() {
  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ctaRef}
      className="mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>

        {/* CTA Card */}
        <div className={`relative ${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center border-white/[0.2]`}>
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center p-3">
              <img
                src="/LOGO.png"
                alt="Base Token Creator Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-4`}>
              Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Launch</span>?
            </h3>

            <p className={`${typography.subtitle} text-xl mb-8 max-w-2xl mx-auto`}>
              Join thousands of successful projects that have launched on Base. Start building the future today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/create"
                className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} font-semibold text-lg rounded-2xl`}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Launch Token Creator
              </Link>
            </motion.div>

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
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-white/10">
            <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
              <svg className={`w-5 h-5 ${typography.success.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={typography.label}>90% Lower Fees</span>
            </div>
            <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
              <svg className={`w-5 h-5 ${typography.info.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className={typography.label}>5s Deploy</span>
            </div>
            <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className={typography.label}>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
