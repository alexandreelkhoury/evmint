import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { colors, typography } from '../styles/designSystem'

export interface CTAButton {
  text: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  variant: 'primary' | 'secondary'
}

export interface TrustIndicator {
  icon: React.ReactNode
  text: string
  color?: string
}

interface CTACardProps {
  // Content
  title: string | React.ReactNode
  subtitle: string

  // Buttons
  buttons: CTAButton[]

  // Optional features
  trustIndicators?: TrustIndicator[]

  // Styling
  gradientColors?: string
  className?: string

  // Animation (optional)
  delay?: number
}

export default function CTACard({
  title,
  subtitle,
  buttons,
  trustIndicators,
  gradientColors = 'from-blue-600/20 via-purple-600/20 to-cyan-600/20',
  className = '',
  delay = 0
}: CTACardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={`mt-20 ${className}`}
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Background gradient — static, halved intensity */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors} rounded-3xl blur-3xl opacity-50`}></div>

        {/* CTA Card */}
        <div className={`relative ${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center border-white/[0.2]`}>
          <div className="mb-8">
            {/* Title */}
            <h3 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-4`}>
              {title}
            </h3>

            {/* Subtitle */}
            <p className={`${typography.subtitle} text-xl mb-8 max-w-2xl mx-auto`}>
              {subtitle}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {buttons.map((button, index) => {
              const buttonContent = (
                <>
                  {button.icon && <span className="w-6 h-6 mr-3">{button.icon}</span>}
                  {button.text}
                </>
              )

              const buttonClasses = `inline-flex items-center px-8 py-4 ${
                button.variant === 'primary' ? colors.primaryButton : colors.secondaryButton
              } ${
                button.variant === 'primary' ? 'font-semibold' : 'font-medium'
              } text-lg rounded-2xl cursor-pointer`

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {button.href ? (
                    <Link to={button.href} className={buttonClasses}>
                      {buttonContent}
                    </Link>
                  ) : (
                    <button onClick={button.onClick} className={buttonClasses}>
                      {buttonContent}
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Trust Indicators */}
          {trustIndicators && trustIndicators.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-white/10">
              {trustIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${typography.bodyText}`}
                >
                  <span className={`w-6 h-6 ${indicator.color || 'text-blue-400'}`}>
                    {indicator.icon}
                  </span>
                  <span className={typography.label}>{indicator.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
