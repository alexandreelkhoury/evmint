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
 * 2. Social Proof - Build trust early (10,000+ launches)
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
    "description": "Create ERC20 tokens, meme coins, and cryptocurrencies on 15+ EVM blockchains instantly. Deploy on Ethereum, Base, Arbitrum, Polygon, BSC & more. No coding required, ultra-low fees, 10,000+ successful projects.",
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
      "🚀 5-second token deployment",
      "🌐 15+ EVM blockchains supported",
      "💰 Ultra-low gas fees on Layer 2 networks",
      "🎯 No coding skills required",
      "🔥 Meme coin & cryptocurrency creation",
      "⚡ Deploy on Ethereum, Base, Arbitrum, Polygon, BSC & more",
      "🦄 Multi-DEX liquidity support (Uniswap, SushiSwap, PancakeSwap)",
      "✅ Auto-verification on all block explorers",
      "📱 Mobile-friendly interface",
      "🔒 Secure audited smart contracts",
      "💎 10,000+ successful launches across all chains"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <SEO
        title="EVMint - Multi-Chain Token Creator | Deploy on 15+ EVM Blockchains in 5 Seconds"
        description="Create ERC20 tokens on Ethereum, Base, Arbitrum, Polygon, BSC & 10+ more EVM chains! No coding required, ultra-low fees, instant deployment. Launch meme coins, utility tokens, DeFi projects across multiple blockchains. 10,000+ successful launches!"
        keywords="multi-chain token creator, evm token launcher, meme coin creator, erc20 token generator, create cryptocurrency, ethereum token, base token, arbitrum token, polygon token, bsc token, no code crypto, multi-chain deployment, defi token maker, layer 2 tokens, cross-chain token creator"
        canonical="/"
        structuredData={homePageStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* 1. Hero Section - Immediate value proposition */}
        <HeroSection />

        {/* 2. Social Proof - Build trust early with 10,000+ launches */}
        <SocialProofSection />

        {/* 3. Problem/Solution - Increase relatability & positioning */}
        <ProblemSolutionSection />

        {/* 4. How It Works - Visual 3-step process to reduce perceived complexity */}
        <HowItWorksSection />

        {/* 5. Pricing - Transparent cost breakdown for trust & conversion */}
        <PricingSection />

        {/* 6. Team Section - Build credibility */}
        {/* <TeamSection /> */}

        {/* 8. Final CTA Section - Last chance conversion */}
        <CTASection />
      </div>
    </div>
  )
}
