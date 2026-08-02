import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { layout } from '../../styles/designSystem'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView } from '../../utils/analytics'
import HeroSection from './components/HeroSection'
import CTASection from './components/CTASection'
import SocialProofSection from '../../components/SocialProofSection'
import ProblemSolutionSection from './components/ProblemSolutionSection'
import HowItWorksSection from './components/HowItWorksSection'
import PricingSection from './components/PricingSection'

/**
 * Deep-dive landing pages. The deployer is the same for all of them; each page
 * covers the decisions specific to that kind of launch.
 */
const useCasePages = [
  {
    to: '/erc20-token-generator',
    title: 'ERC20 Token Generator',
    desc: 'What the standard actually guarantees, and which parameters are locked in at deployment.',
  },
  {
    to: '/meme-coin-creator',
    title: 'Meme Coin Creator',
    desc: 'Supply, liquidity, and community tactics for a launch that lives or dies on attention.',
  },
  {
    to: '/cryptocurrency-creator',
    title: 'Cryptocurrency Creator',
    desc: 'Token economics, distribution planning, and what happens after your contract goes live.',
  },
]

/**
 * HomePage - Conversion-optimized landing page
 *
 * Section Order (Optimized for Conversion):
 * 1. Hero - Immediate value proposition + primary CTA
 * 2. Problem/Solution - Why this matters
 * 3. Problem/Solution - Increase relatability & positioning (includes EVM vs alternatives comparison)
 * 4. How It Works - Visual 3-step process (reduce complexity)
 * 5. Pricing - Transparent cost breakdown (reduces friction)
 * 6. Social Proof - Build credibility
 * 7. Use-case deep dives - route readers who want detail to the landing pages
 * 8. Final CTA - Last chance conversion
 */
export default function HomePage() {
  const analytics = useFirebaseAnalytics()

  // Track page view on mount
  useEffect(() => {
    trackPageView(analytics, 'home')
  }, [analytics])

  // Structured data for SEO
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EVMint - #1 Multi-Chain Cryptocurrency & Meme Coin Generator",
    "description": "Create ERC20 tokens on 15+ EVM blockchains instantly. Deploy on Ethereum, Base, Arbitrum, Polygon, BSC & more. No coding required, ~$80 flat fee, 60-second deployment.",
    "url": "https://evmint.io",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "provider": {
      "@type": "Organization",
      "name": "EVMint",
      "url": "https://evmint.io",
      "sameAs": [
        "https://twitter.com/evmint"
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "80",
      "priceCurrency": "USD",
      "description": "~$80 equivalent per token deployment on any supported chain, paid in native token. Same price across all 15+ EVM networks.",
      "priceValidUntil": "2027-12-31"
    },
    "featureList": [
      "60-second token deployment",
      "15+ EVM blockchains supported",
      "No coding skills required",
      "Deploy on Ethereum, Base, Arbitrum, Polygon, BSC, Robinhood Chain & more",
      "Multi-DEX liquidity support (Uniswap, SushiSwap, PancakeSwap, QuickSwap)",
      "Auto-verification on all block explorers (Etherscan, Blockscout)",
      "OpenZeppelin audited smart contract templates",
      "Non-custodial — deployer owns the contract",
      "~$80 equivalent fee on any chain"
    ],
    "applicationSubCategory": [
      "Multi-Chain Token Creator",
      "EVM Token Launcher",
      "Meme Coin Generator",
      "DeFi Tools",
      "Cryptocurrency Platform",
      "ERC20 Token Deployer"
    ],
    "keywords": "multi-chain token creator, evm token launcher, meme coin creator, cryptocurrency generator, ERC20 tokens, ethereum token, base token, arbitrum token, polygon token, bsc token, no code crypto, token launcher, defi token maker, multi-chain deployment, layer 2 tokens",
    "installUrl": "https://evmint.io/create",
    "screenshot": "https://evmint.io/og-image.png"
  }

  return (
    <div className="bg-gray-900 relative">

      <SEO
        title="EVMint - Multi-Chain Token Creator | ERC20 on 15+ EVM Chains"
        description="Deploy ERC20 tokens on Ethereum, Base, Arbitrum, Polygon, BSC and 10+ more EVM chains. No coding, ~$80 flat fee, auto-verified in 60 seconds."
        keywords="multi-chain token creator, evm token launcher, meme coin creator, erc20 token generator, create cryptocurrency, ethereum token, base token, arbitrum token, polygon token, bsc token, no code crypto, multi-chain deployment, defi token maker, layer 2 tokens, cross-chain token creator"
        canonical="/"
        structuredData={homePageStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* 1. Hero — attention + value prop */}
        <HeroSection />

        {/* 2. Problem/Solution — why this matters */}
        <ProblemSolutionSection />

        {/* 3. How It Works — concrete steps */}
        <HowItWorksSection />

        {/* 4. Pricing — what it costs */}
        <PricingSection />

        {/* 5. Social Proof — tech credibility before the ask */}
        <SocialProofSection />

        {/* 6. Use-case deep dives — for readers who want detail before deploying */}
        <section className="py-20" aria-labelledby="use-cases-heading">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 id="use-cases-heading" className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Launching something specific?
              </h2>
              <p className="text-gray-400">
                Same deployer, different starting points.
              </p>
            </div>
            {/* Three cards: 2-up would strand one on its own row, so go straight
                from one column to three at md. */}
            <div className="grid gap-4 md:grid-cols-3">
              {useCasePages.map(page => (
                <Link
                  key={page.to}
                  to={page.to}
                  className="group block p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.04] transition-colors"
                >
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{page.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA — convert */}
        <CTASection />
      </div>
    </div>
  )
}
