import { Link } from 'react-router-dom'
import { HexagonStackIcon } from './HexagonStackLogo'

const footerLinks = {
  Product: [
    { to: '/create', label: 'Create Token' },
    { to: '/liquidity', label: 'Liquidity' },
    { to: '/tokens', label: 'My Tokens' },
  ],
  Resources: [
    { to: '/guides', label: 'Guides' },
    { to: '/blog', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
    { to: '/about', label: 'About' },
  ],
  Legal: [
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' },
    { to: '/disclaimers', label: 'Disclaimers' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Top: brand + link columns */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          {/* Brand */}
          <div className="sm:max-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <HexagonStackIcon size={24} />
              <span className="text-sm font-bold text-white">EVMint</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Multi-chain token launcher. Deploy ERC-20 tokens on 15+ EVM blockchains.
            </p>
            <a
              href="https://spltokenlauncher.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Solana tokens → spltokenlauncher.pro
            </a>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{heading}</h4>
                <ul className="space-y-1">
                  {links.map(link => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 hover:text-white transition-colors block py-1.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 EVMint</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-gray-400">All networks operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
