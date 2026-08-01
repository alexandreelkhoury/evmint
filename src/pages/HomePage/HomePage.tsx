import { useEffect } from 'react'
import SEO from '../../components/SEO'
import { layout } from '../../styles/designSystem'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView } from '../../utils/analytics'
import HeroSection from './components/HeroSection'
import CTASection from './components/CTASection'
import SocialProofSection from '../../components/SocialProofSection'
// import TeamSection from '../../components/TeamSection'
import ProblemSolutionSection from './components/ProblemSolutionSection'
import HowItWorksSection from './components/HowItWorksSection'
import PricingSection from './components/PricingSection'

/**
 * HomePage - Conversion-optimized landing page
 *
 * Section Order (Optimized for Conversion):
 * 1. Hero - Immediate value proposition + primary CTA
 * 2. Problem/Solution - Why this matters
 * 3. Problem/Solution - Increase relatability & positioning (includes EVM vs alternatives comparison)
 * 4. How It Works - Visual 3-step process (reduce complexity)
 * 5. Pricing - Transparent cost breakdown (reduces friction)
 * 6. Testimonials - Real user success stories
 * 7. Team - Build credibility
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
        "https://twitter.com/evmint",
        "https://github.com/evmint"
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
        title="EVMint - Multi-Chain Token Creator | Deploy ERC20 Tokens on 15+ EVM Chains"
        description="Create and deploy ERC20 tokens on Ethereum, Base, Arbitrum, Polygon, BSC & 10+ more EVM chains. No coding required, ~$80 flat fee, 60-second deployment. Auto-verified on block explorers. Add liquidity via Uniswap."
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

        {/* 6. CTA — convert */}
        <CTASection />
      </div>
    </div>
  )
}
