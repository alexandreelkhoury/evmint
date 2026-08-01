import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CTACard from '../../../components/CTACard'

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
      initial={{ opacity: 0, y: 20 }}
      animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.25, delay: 0.1 }}
    >
      <CTACard
        title="Ready to launch your token?"
        subtitle="Deploy on any of 15+ EVM chains. Verified, liquid, and live in under a minute."
        buttons={[
          {
            text: 'Launch Token Creator',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            ),
            href: '/create',
            variant: 'primary'
          },
          {
            text: 'Learn More',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ),
            href: '/guides',
            variant: 'secondary'
          }
        ]}
        trustIndicators={[
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            text: '90% Lower Fees',
            color: 'text-green-400'
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            text: 'Deploy in Seconds',
            color: 'text-blue-400'
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            text: 'Secure',
            color: 'text-purple-400'
          }
        ]}
        gradientColors="from-blue-600/15 via-blue-600/10 to-blue-600/15"
      />
    </motion.div>
  )
}
