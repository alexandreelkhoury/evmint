import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import WalletButtonLazy from './WalletButtonLazy'
import HexagonStackLogo from './HexagonStackLogo'
import { useScrollLock } from '../hooks/useScrollLock'
import {
  HomeIcon,
  RocketLaunchIcon,
  CubeIcon,
  BeakerIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/', title: 'EVMint - Create ERC20 Tokens on 15+ EVM Chains', icon: HomeIcon },
  { name: 'Create Token', href: '/create', title: 'Create ERC20 Token - Deploy in Seconds on 15+ Chains', icon: RocketLaunchIcon },
  { name: 'My Tokens', href: '/tokens', title: 'My Tokens - Manage Your ERC20 Tokens', icon: CubeIcon },
  { name: 'Liquidity', href: '/liquidity', title: 'Liquidity Management - Add & Remove on Uniswap V2', icon: BeakerIcon },
  { name: 'Guides', href: '/guides', title: 'Token Creation Guides - Step-by-Step Tutorials', icon: BookOpenIcon },
  { name: 'FAQ', href: '/faq', title: 'EVMint FAQ - Frequently Asked Questions', icon: QuestionMarkCircleIcon },
]

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useScrollLock(mobileMenuOpen)

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
              <Link to="/" className="flex items-center space-x-2 sm:space-x-4 cursor-pointer">
                <div className="flex items-center justify-center flex-shrink-0">
                  <HexagonStackLogo
                    size={40}
                    animated={true}
                    className="scale-75 sm:scale-100"
                  />
                </div>
                <span className="text-lg sm:text-2xl font-display font-bold text-white whitespace-nowrap">
                  EVMint
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Navigation - Center (hidden below 1024px) */}
          <nav className="hidden lg:flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
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
                  className={`group text-base font-medium transition-[background-color,color,border-color,box-shadow,opacity] duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer ${
                    location.pathname === item.href
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-gray-300 hover:text-blue-400 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side - Wallet + Mobile menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="flex-shrink-0">
              <WalletButtonLazy />
            </div>
            
            {/* Mobile menu button - Shows below 1400px */}
            <div className="lg:hidden flex-shrink-0">
              <motion.button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
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
            className="lg:hidden bg-gray-800/98 backdrop-blur-md border-t border-gray-700"
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
                    className={`flex items-center space-x-3 px-4 min-h-[44px] rounded-lg text-base font-medium transition-[background-color,color,border-color,box-shadow,opacity] duration-200 cursor-pointer ${
                      location.pathname === item.href
                        ? 'text-blue-400 bg-blue-400/10 border-l-4 border-blue-400'
                        : 'text-gray-300 hover:text-blue-400 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
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