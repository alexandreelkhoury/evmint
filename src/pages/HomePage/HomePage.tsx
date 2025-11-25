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
      "price": "75-100",
      "priceCurrency": "USD",
      "description": "Multi-chain token deployment on 15+ EVM networks including Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, Fantom, Gnosis, Moonbeam, Blast, and Worldchain",
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
        title="🚀 EVMint - Multi-Chain Token Creator | Deploy on 15+ EVM Blockchains in 5 Seconds"
        description="⚡ Create ERC20 tokens on Ethereum, Base, Arbitrum, Polygon, BSC & 10+ more EVM chains! No coding required, ultra-low fees, instant deployment. Launch meme coins, utility tokens, DeFi projects across multiple blockchains. 10,000+ successful launches!"
        keywords="multi-chain token creator, evm token launcher, meme coin creator, erc20 token generator, create cryptocurrency, ethereum token, base token, arbitrum token, polygon token, bsc token, no code crypto, multi-chain deployment, defi token maker, layer 2 tokens, cross-chain token creator"
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
