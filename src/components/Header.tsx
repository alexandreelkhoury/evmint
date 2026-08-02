import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import WalletButtonLazy from './WalletButtonLazy'
import { HexagonStackIcon } from './HexagonStackLogo'
import { useScrollLock } from '../hooks/useScrollLock'

const navLinks = [
  { name: 'Deploy', href: '/create' },
  { name: 'Portfolio', href: '/tokens' },
  { name: 'Liquidity', href: '/liquidity' },
  { name: 'Guides', href: '/guides' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Blog', href: '/blog' },
]

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useScrollLock(mobileMenuOpen)

  const isActive = (href: string) => location.pathname === href

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-white/[0.06]"
      // Fixed elements sit outside the html padding box, so when useScrollLock
      // pads <html> to replace the scrollbar this keeps the header from jumping
      style={{ paddingRight: 'var(--scrollbar-compensation, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <HexagonStackIcon size={24} />
            <span className="text-sm font-wordmark font-bold tracking-tight text-white">EVMint</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-[background-color,color] duration-150 ${
                  isActive(item.href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <WalletButtonLazy />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer active:scale-[0.96]"
              aria-expanded={mobileMenuOpen}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-white/[0.06] bg-gray-900/95 backdrop-blur-md overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-0.5">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-[background-color,color] duration-150 ${
                    isActive(item.href)
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
