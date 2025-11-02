import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center">
                <img
                  src="/LOGO.png"
                  alt="EVMint Logo"
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                />
              </div>
              <span className="text-base sm:text-lg font-bold text-white">EVMint</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
              The most advanced platform for creating and managing ERC20 tokens across 15+ EVM blockchains. Launch your project with 95% lower fees and lightning-fast transactions.
            </p>
            <p className="text-gray-500 text-xs">
              No code required • 5-second deployment • Enterprise security
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/create" className="text-gray-400 hover:text-white text-sm transition-colors block">Create Token</Link></li>
              <li><Link to="/liquidity" className="text-gray-400 hover:text-white text-sm transition-colors block">Liquidity</Link></li>
              <li><Link to="/tokens" className="text-gray-400 hover:text-white text-sm transition-colors block">My Tokens</Link></li>
              <li><Link to="/guides" className="text-gray-400 hover:text-white text-sm transition-colors block">Guides</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors block">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/guides" className="text-gray-400 hover:text-white text-sm transition-colors block">Documentation</Link></li>
              <li><a href="https://docs.base.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors block">Base Docs</a></li>
              <li><a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors block">BaseScan</a></li>
              <li><a href="https://uniswap.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors block">Uniswap</a></li>
              <li><a href="https://coinbase.com/wallet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors block">Coinbase Wallet</a></li>
            </ul>
          </div>
          
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors block">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors block">Cookie Policy</Link></li>
              <li><Link to="/risks" className="text-gray-400 hover:text-white text-sm transition-colors text-red-300 block">Risk Disclosure</Link></li>
              <li><Link to="/disclaimers" className="text-gray-400 hover:text-white text-sm transition-colors block">Disclaimers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 EVMint. Built with ❤️ for the DeFi community.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link to="/faq" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Support</Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">Terms</Link>
              <Link to="/risks" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors text-red-300">Risks</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}