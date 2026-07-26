import { Link } from 'react-router-dom'
import { HexagonStackIcon } from './HexagonStackLogo'

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center">
                <HexagonStackIcon
                  size={32}
                  className="scale-75 sm:scale-100"
                />
              </div>
              <span className="text-base sm:text-lg font-bold text-white">EVMint</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
              The most trusted multi-chain token launcher.
              <br />
              <span className="text-white font-semibold">10,000+ successful deployments</span> across 15+ EVM blockchains.
            </p>
            <p className="text-gray-500 text-xs mb-4">
              No code required • 60-second deployment • Enterprise security
            </p>

            {/* Security & Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold cursor-pointer hover:bg-green-500/20 transition-colors">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Audited Contracts
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold cursor-pointer hover:bg-blue-500/20 transition-colors">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                10,000+ Deployments
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold cursor-pointer hover:bg-amber-500/20 transition-colors">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                Multi-Chain Support
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-0">
              <li><Link to="/create" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Create Token</Link></li>
              <li><Link to="/liquidity" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Liquidity</Link></li>
              <li><Link to="/tokens" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">My Tokens</Link></li>
              <li><Link to="/guides" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Guides</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-0">
              <li><Link to="/blog" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Blog</Link></li>
              <li><Link to="/guides" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Documentation</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">About Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">FAQ</Link></li>
              <li><a href="https://spltokenlauncher.pro" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Solana Token Launcher ↗</a></li>
            </ul>
          </div>
          
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-0">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Terms of Service</Link></li>
              <li><Link to="/disclaimers" className="text-gray-400 hover:text-white text-sm transition-colors block cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Disclaimers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                © 2026 EVMint. Built for the DeFi community.
              </p>

              {/* Network Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <div className="relative">
                  <span className="absolute w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75"></span>
                  <span className="relative w-2 h-2 rounded-full bg-green-400 block"></span>
                </div>
                <span className="text-green-400 font-semibold">All Networks Operational</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-500">15+ Chains Active</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link to="/faq" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Support</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Privacy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:rounded focus-visible:outline-none">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}