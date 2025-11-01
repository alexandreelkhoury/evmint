import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import WalletButton from './WalletButton'

const navigation = [
  { name: 'Home', href: '/', title: 'Base Token Creator - Create ERC20 Tokens on Base Blockchain', icon: '🏠' },
  { name: 'Create Token', href: '/create', title: 'Create Base Token - Deploy ERC20 Tokens in 5 Seconds', icon: '🚀' },
  // { name: 'My Tokens', href: '/tokens', title: 'My Base Tokens - Manage Your ERC20 Tokens', icon: '💎' },
  { name: 'Liquidity', href: '/liquidity', title: 'Base Liquidity Management - Uniswap V2 Integration', icon: '💧' },
  { name: 'Guides', href: '/guides', title: 'Base Token Creation Guides - Step-by-Step Tutorials', icon: '📚' },
  { name: 'FAQ', href: '/faq', title: 'Base Token FAQ - Frequently Asked Questions', icon: '❓' },
]

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-800/95 backdrop-blur-md border-b border-gray-700 shadow-lg"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between w-full">
          {/* Logo - Left side */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center space-x-2 sm:space-x-4">
                <motion.div 
                  className="h-8 w-8 sm:h-12 sm:w-12 flex items-center justify-center flex-shrink-0"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src="/LOGO.png" 
                    alt="Base Token Creator Logo" 
                    className="h-6 w-6 sm:h-10 sm:w-10 object-contain"
                  />
                </motion.div>
                <span className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
                  <span className="hidden sm:inline">Base Token Creator</span>
                  <span className="sm:hidden">Base Creator</span>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Navigation - Center (hidden below 1400px) */}
          <nav className="hidden xl:flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  title={item.title}
                  className={`group text-base font-medium transition-all duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                    location.pathname === item.href
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-gray-300 hover:text-blue-400 hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side - Wallet + Mobile menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="flex-shrink-0">
              <WalletButton />
            </div>
            
            {/* Mobile menu button - Shows below 1400px */}
            <div className="xl:hidden flex-shrink-0">
              <motion.button 
                type="button" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2 sm:p-3 rounded-lg hover:bg-white/5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-gray-800/98 backdrop-blur-md border-t border-gray-700"
          >
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'text-blue-400 bg-blue-400/10 border-l-4 border-blue-400'
                        : 'text-gray-300 hover:text-blue-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}