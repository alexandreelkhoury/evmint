import { Link } from 'react-router-dom'
import { HexagonStackIcon } from './HexagonStackLogo'

const footerLinks = {
  Product: [
    { to: '/create', label: 'Create Token' },
    { to: '/liquidity', label: 'Liquidity' },
    { to: '/tokens', label: 'My Tokens' },
  ],
  'Token Creators': [
    { to: '/erc20-token-generator', label: 'ERC20 Token Generator' },
    { to: '/meme-coin-creator', label: 'Meme Coin Creator' },
    { to: '/cryptocurrency-creator', label: 'Cryptocurrency Creator' },
    { to: '/multi-chain-token-creator', label: 'Multi-Chain Token Creator' },
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
        {/* Top: brand + link columns.
            The brand only sits beside the columns from lg up — below that it
            would eat the width four columns need, and the 640–1023px range is
            exactly where the layout used to strand an orphan column. */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Brand */}
          <div className="max-w-sm lg:max-w-[220px]">
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

          {/* Link columns — 2 up to md, then 4. There are four groups, so any
              3-column step would always orphan one onto a second row. */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                {/* Headings read above the links by being lighter, smaller and
                    uppercase. Going darker is not an option: gray-500 is only
                    3.67:1 on gray-900 and fails WCAG AA. */}
                <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">{heading}</h4>
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
            {/* Live status sits a step above the copyright line it shares a row with */}
            <span className="font-medium text-gray-300">All networks operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
