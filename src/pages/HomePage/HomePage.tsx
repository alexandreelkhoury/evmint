import SEO from '../../components/SEO'
import { layout } from '../../styles/designSystem'
import { useHomePageLogic } from './hooks/useHomePageLogic'
import HeroSection from './components/HeroSection'
import WhyEVMSection from './components/WhyEVMSection'
import FeaturesSection from './components/FeaturesSection'
import QuickStartForm from './components/QuickStartForm'
import CTASection from './components/CTASection'

/**
 * HomePage - Slim orchestrator component
 * Composes all sections using extracted components and business logic hook
 */
export default function HomePage() {
  // All business logic extracted to custom hook
  const {
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    isCreating,
    createdTokenAddress,
    error,
    authenticated,
    isConnected,
    isCorrectChain,
    showSuccess,
    handleCloseSuccess,
    getNetworkName
  } = useHomePageLogic()

  // Structured data for SEO
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EVMint - #1 Cryptocurrency & Meme Coin Generator",
    "description": "Create ERC20 tokens, meme coins, and cryptocurrencies on Base blockchain instantly. No coding required, under $1 deployment, 10,000+ successful projects.",
    "url": "https://evmint.io",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "provider": {
      "@type": "Organization",
      "name": "EVMint",
      "url": "https://evmint.io",
      "sameAs": [
        "https://twitter.com/BaseTokenCreator",
        "https://github.com/evmint"
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "75-100",
      "priceCurrency": "USD",
      "description": "Token deployment on multi-chain EVM networks",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "🚀 5-second token deployment",
      "💰 Under $1 gas fees (90% cheaper than Ethereum)",
      "🎯 No coding skills required",
      "🔥 Meme coin & cryptocurrency creation",
      "⚡ Base Layer 2 blockchain (Coinbase)",
      "🦄 Instant Uniswap liquidity",
      "✅ Auto-verification on BaseScan",
      "📱 Mobile-friendly interface",
      "🔒 Secure smart contracts",
      "💎 10,000+ successful launches"
    ],
    "applicationSubCategory": [
      "Token Creator",
      "Meme Coin Generator",
      "DeFi Tools",
      "Cryptocurrency Platform",
      "Base Blockchain Tools"
    ],
    "keywords": "base token creator, meme coin creator, cryptocurrency generator, ERC20 tokens, Base blockchain, DeFi tools",
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
        title="🚀 EVMint - Launch Your Cryptocurrency in 5 Seconds | #1 Meme Coin Maker"
        description="⚡ Create ERC20 tokens on Base blockchain instantly! No coding, <$1 fees, 10,000+ successful launches. Build your crypto empire: meme coins, utility tokens, DeFi projects. Join the Base revolution!"
        keywords="base token creator, meme coin creator, erc20 token generator, create cryptocurrency, base blockchain, no code crypto, token launcher, defi token maker, cryptocurrency creator, base layer 2, cheap token deployment, viral crypto projects, uniswap listing, basescan verification"
        canonical="/"
        structuredData={homePageStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* Hero Section */}
        <HeroSection />

        {/* Why EVM Section */}
        <WhyEVMSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Quick Start Form */}
        <QuickStartForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCloseSuccess={handleCloseSuccess}
          isCreating={isCreating}
          createdTokenAddress={createdTokenAddress}
          error={error}
          authenticated={authenticated}
          isCorrectChain={isCorrectChain}
          showSuccess={showSuccess}
          getNetworkName={getNetworkName}
        />

        {/* Final CTA Section */}
        <CTASection />
      </div>
    </div>
  )
}
