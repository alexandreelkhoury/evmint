import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * MobileBottomNav - Sticky bottom navigation for mobile devices
 * Provides easy access to key actions on smaller screens
 */
export default function MobileBottomNav() {
  const location = useLocation()

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/create',
      label: 'Create',
      isPrimary: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      to: '/tokens',
      label: 'Tokens',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      to: '/liquidity',
      label: 'Liquidity',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-black/50"
      aria-label="Mobile navigation"
      role="navigation"
    >
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const active = isActive(item.to)
          const isPrimary = item.isPrimary

          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] relative cursor-pointer group focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:rounded-lg focus-visible:outline-none"
              aria-label={`${item.label}${active ? ' (current page)' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="mobileNavActive"
                  className={`absolute inset-0 rounded-xl ${
                    isPrimary
                      ? 'bg-gradient-to-r from-blue-500/20 to-blue-400/20'
                      : 'bg-white/5'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <div
                  className={`transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
                    active
                      ? isPrimary
                        ? 'text-blue-400 scale-110'
                        : 'text-white scale-110'
                      : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                >
                  {item.icon}
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium relative z-10 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 ${
                  active
                    ? isPrimary
                      ? 'text-blue-400 font-semibold'
                      : 'text-white font-semibold'
                    : 'text-gray-300 group-hover:text-gray-200'
                }`}
              >
                {item.label}
              </span>

              {/* Primary CTA Glow */}
              {isPrimary && active && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 to-blue-400/30 blur-md -z-10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
