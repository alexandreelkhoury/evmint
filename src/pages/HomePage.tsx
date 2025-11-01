import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackTokenCreation } from '../utils/analytics'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import React, { useRef, useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { base, baseSepolia } from 'viem/chains'
import SEO from '../components/SEO'
import WalletButton from '../components/WalletButton'
import { useOpenZeppelinTokenDeployment } from '../hooks/useOpenZeppelinTokenDeployment'
import { useTokenForm } from '../hooks/useTokenForm'
import { layout, typography, colors } from '../styles/designSystem'

export default function HomePage() {
  const analytics = useFirebaseAnalytics()
  const featuresRef = useRef(null)
  const formRef = useRef(null)
  const ctaRef = useRef(null)
  
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 })
  const formInView = useInView(formRef, { once: true, amount: 0.1 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.1 })

  // Token creation functionality
  const { authenticated } = usePrivy()
  const { 
    createToken, 
    isCreating, 
    createdTokenAddress, 
    error,
    isConnected,
    isCorrectChain,
    chainId
  } = useOpenZeppelinTokenDeployment()

  // Helper function to get network name
  const getNetworkName = () => {
    if (chainId === base.id) return 'Base Mainnet'
    if (chainId === baseSepolia.id) return 'Base Testnet'
    return 'Base'
  }
  
  // Use shared token form hook for validation and state management
  const { formData, formErrors, handleInputChange, validateForm, resetForm, setFormErrors } = useTokenForm()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (!authenticated || !isConnected) {
      return
    }

    try {
      await createToken(formData)
      setShowSuccess(true)
      setFormErrors({})
      
      // Track token creation
      trackTokenCreation(analytics, {
        name: formData.name,
        symbol: formData.symbol,
        supply: formData.totalSupply,
        network: getNetworkName()
      })
    } catch (error) {
      console.error('Token creation failed:', error)
    }
  }

  // Track page view on mount
  useEffect(() => {
    trackPageView(analytics, 'home')
  }, [analytics])

  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Base Token Creator - #1 Cryptocurrency & Meme Coin Generator",
    "description": "Create ERC20 tokens, meme coins, and cryptocurrencies on Base blockchain instantly. No coding required, under $1 deployment, 10,000+ successful projects.",
    "url": "https://base-token-creator.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "provider": {
      "@type": "Organization",
      "name": "Base Token Creator",
      "url": "https://base-token-creator.com",
      "sameAs": [
        "https://twitter.com/BaseTokenCreator",
        "https://github.com/base-token-creator"
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "0.02",
      "@priceCurrency": "ETH",
      "description": "Token deployment on Base blockchain",
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
    "installUrl": "https://base-token-creator.com/create",
    "screenshot": "https://base-token-creator.com/og-image.png"
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
        title="🚀 Base Token Creator - Launch Your Cryptocurrency in 5 Seconds | #1 Meme Coin Maker"
        description="⚡ Create ERC20 tokens on Base blockchain instantly! No coding, <$1 fees, 10,000+ successful launches. Build your crypto empire: meme coins, utility tokens, DeFi projects. Join the Base revolution!"
        keywords="base token creator, meme coin creator, erc20 token generator, create cryptocurrency, base blockchain, no code crypto, token launcher, defi token maker, cryptocurrency creator, base layer 2, cheap token deployment, viral crypto projects, uniswap listing, basescan verification"
        canonical="/"
        structuredData={homePageStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* Unique Landing Page Hero */}
        <motion.div 
          className="text-center min-h-screen flex flex-col justify-center mb-32"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
        >
          {/* Logo + Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.1, type: "spring", stiffness: 100 }}
            className="mb-12"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl flex items-center justify-center p-6 shadow-2xl shadow-blue-500/25 ring-1 ring-white/10">
              <img 
                src="/LOGO.png" 
                alt="Base Token Creator Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="block text-white drop-shadow-lg"
              >
                Deploy Tokens
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              >
                Like a Pro
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className="text-2xl sm:text-3xl text-gray-300 max-w-5xl mx-auto mb-16 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            The most <span className="text-blue-400 font-semibold">powerful</span> and <span className="text-purple-400 font-semibold">user-friendly</span> way to launch ERC20 tokens on Base blockchain. 
            <br />
            <span className="text-xl text-gray-400 mt-4 block">No coding skills required. Deploy in 5 seconds.</span>
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/create"
                className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-300 border border-blue-400/30"
              >
                <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Launch Your Token Now
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/guides?guide=token-creation"
                className="inline-flex items-center px-8 py-5 text-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 rounded-2xl backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-24"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center text-gray-400 hover:text-blue-400 transition-colors cursor-pointer group"
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            >
              {/* Mouse Icon */}
              <div className="w-7 h-11 border-2 border-current rounded-full mb-3 group-hover:border-blue-400 transition-all duration-300 bg-black/20 backdrop-blur-sm flex items-start justify-center pt-2 relative overflow-hidden">
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 bg-current rounded-full group-hover:bg-blue-400 transition-colors"
                />
              </div>
            </motion.div>
          </motion.div>

        </motion.div>


        {/* Why Base Section */}
        <motion.div 
          id="why-base"
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}>
            <div className="text-center mb-12">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-6"
              >
                <span className="text-sm font-medium text-green-400">⚡ Base Blockchain</span>
              </motion.div>

              <h2 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}>
                Why Choose <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Base</span>?
              </h2>
              <p className={`${typography.subtitle} text-xl max-w-3xl mx-auto`}>
                Coinbase's Layer 2 blockchain offering 90% lower fees, instant confirmation, and <span className="text-blue-400 font-semibold">very high visibility</span> compared to oversaturated networks
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 p-2">
                    <svg className="w-full h-full text-white" viewBox="0 0 111 111" fill="currentColor">
                      <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.632 85.359 0 54.921 0C26.790 0 3.67 21.471 0.637 48.858H61.711V61.209H0.637C3.67 88.596 26.790 110.034 54.921 110.034Z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-blue-400">Base</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liquidity Pool</span>
                    <span className="text-blue-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction Speed</span>
                    <span className="text-blue-400 font-semibold">2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visibility</span>
                    <span className="text-blue-400 font-semibold">Very High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ecosystem</span>
                    <span className="text-blue-400 font-semibold">Coinbase</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mr-4 p-2">
                    <svg className="w-full h-full text-white" viewBox="0 0 256 417" fill="currentColor">
                      <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                      <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#8C8C8C"/>
                      <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z"/>
                      <path d="M127.962 416.905v-104.72L0 236.585z" fill="#8C8C8C"/>
                      <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#F2F2F2"/>
                      <path d="M0 212.32l127.96 75.638v-133.8z" fill="#8C8C8C"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-400">Ethereum</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liquidity Pool</span>
                    <span className="text-red-400 font-semibold">$60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction Speed</span>
                    <span className="text-red-400 font-semibold">5 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visibility</span>
                    <span className="text-yellow-400 font-semibold">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ecosystem</span>
                    <span className="text-yellow-400 font-semibold">Largest DeFi</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4 p-2">
                    <img 
                      src="https://cryptologos.cc/logos/solana-sol-logo.png" 
                      alt="Solana Logo" 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to another official Solana logo URL if first one fails
                        e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-orange-400">Solana</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Liquidity Pool</span>
                    <span className="text-orange-400 font-semibold">$40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Saturation</span>
                    <span className="text-red-400 font-semibold">Oversaturated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visibility</span>
                    <span className="text-red-400 font-semibold">Very Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ecosystem</span>
                    <span className="text-orange-400 font-semibold">Memecoin Heavy</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
                  <p className="text-xs text-orange-200">
                    ⚠️ Thousands of new memecoins daily - very hard to get noticed
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">Low Cost</h4>
                <p className="text-gray-400 text-sm">90% lower fees than Ethereum mainnet</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">Fast Speed</h4>
                <p className="text-gray-400 text-sm">2-second transaction confirmation</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-2">Secure</h4>
                <p className="text-gray-400 text-sm">Backed by Coinbase infrastructure</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          ref={featuresRef}
          id="features"
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}>
            <div className="text-center mb-12">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={featuresInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6"
              >
                <span className="text-sm font-medium text-purple-400">🛠️ Features</span>
              </motion.div>

              <h2 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">No-Code</span> Token Creation
              </h2>
              <p className={`${typography.subtitle} text-xl max-w-3xl mx-auto`}>
                Professional-grade tools for ERC20 deployment, liquidity management, and DeFi integration on Base
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:bg-blue-500/15 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className={`${typography.cardTitle} text-xl mb-4`}>Token Creation</h3>
                <p className={typography.bodyText}>Deploy fully functional ERC20 tokens with customizable parameters in 5 seconds.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 hover:bg-green-500/15 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <h3 className={`${typography.cardTitle} text-xl mb-4`}>Liquidity Management</h3>
                <p className={typography.bodyText}>Add and remove liquidity on Uniswap V3 directly from our interface.</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:bg-purple-500/15 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <h3 className={`${typography.cardTitle} text-xl mb-4`}>Secure & Reliable</h3>
                <p className={typography.bodyText}>Built on Base blockchain with audited smart contracts and proven security.</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Token Creation Form */}
        <motion.div 
          ref={formRef}
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}>
            <div className="text-center mb-12">
              {/* Hero badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={formInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
              >
                <span className="text-sm font-medium text-blue-400">⚡ Quick Start</span>
              </motion.div>

              <h2 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Create Your Token
                </span>
              </h2>
              <p className={`${typography.subtitle} text-xl max-w-2xl mx-auto`}>
                Try our token creator with this interactive demo. Ready to deploy? Click the button below!
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Token Configuration
                </h3>
                <p className="text-gray-400">
                  Fill in the details for your new ERC20 token
                </p>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Token Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Token Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., My Awesome Token"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                      maxLength={50}
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-400">{formErrors.name}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Choose a clear, descriptive name for your token</p>
                </motion.div>

                {/* Token Symbol */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Symbol *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., MAT"
                      value={formData.symbol}
                      onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 uppercase"
                      maxLength={10}
                      required
                    />
                  </div>
                  {formErrors.symbol && (
                    <p className="mt-2 text-sm text-red-400">{formErrors.symbol}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">3-10 characters, uppercase letters and numbers only</p>
                </motion.div>

                {/* Decimals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Decimals
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      value={formData.decimals}
                      onChange={(e) => handleInputChange('decimals', parseInt(e.target.value) || 18)}
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                    />
                  </div>
                  {formErrors.decimals && (
                    <p className="mt-2 text-sm text-red-400">{formErrors.decimals}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Number of decimal places (typically 18)</p>
                </motion.div>

                {/* Total Supply */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Total Supply *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., 1000000"
                      value={formData.totalSupply}
                      onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                  </div>
                  {formErrors.totalSupply && (
                    <p className="mt-2 text-sm text-red-400">{formErrors.totalSupply}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Total number of tokens to create</p>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="pt-6"
              >
                {!authenticated ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Connect Your Wallet</h3>
                      <p className="text-blue-200 mb-6">
                        Connect your wallet to deploy tokens on Base blockchain and start creating your own cryptocurrency.
                      </p>
                      <WalletButton />
                    </div>
                  </div>
                ) : !isCorrectChain ? (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Switch Network</h3>
                    <p className="text-orange-200">
                      Please switch to Base mainnet or Base Sepolia testnet to create tokens. Your wallet needs to be on the correct network.
                    </p>
                  </div>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isCreating || Object.keys(formErrors).some(key => formErrors[key as keyof typeof formErrors])}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-6 text-xl font-semibold rounded-2xl transition-all duration-300 ${
                      isCreating || Object.keys(formErrors).some(key => formErrors[key as keyof typeof formErrors])
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl hover:shadow-2xl'
                    } text-white`}
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Token on {getNetworkName()}...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span>🚀</span>
                        <span>Create Token on {getNetworkName()}</span>
                      </div>
                    )}
                  </motion.button>
                )}

                {/* Success/Error Messages */}
                {showSuccess && createdTokenAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Token Created Successfully!</h3>
                      <p className="text-green-200 mb-4">
                        Your token has been deployed to Base blockchain.
                      </p>
                      <div className="bg-black/20 rounded-xl p-4 mb-6">
                        <p className="text-xs font-mono break-all text-gray-300">
                          Contract: {createdTokenAddress}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                          to="/tokens"
                          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium text-white"
                        >
                          <span>💎</span>
                          <span className="ml-2">View My Tokens</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowSuccess(false)
                            resetForm()
                          }}
                          className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-medium text-white"
                        >
                          Create Another
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Token Creation Failed</h3>
                    <p className="text-red-200">
                      {error.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div 
          ref={ctaRef}
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>
            
            {/* CTA Card */}
            <div className={`relative ${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center border-white/[0.2]`}>
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center p-3">
                  <img 
                    src="/LOGO.png" 
                    alt="Base Token Creator Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-4`}>
                  Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Launch</span>?
                </h3>
                
                <p className={`${typography.subtitle} text-xl mb-8 max-w-2xl mx-auto`}>
                  Join thousands of successful projects that have launched on Base. Start building the future today!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/create"
                    className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} font-semibold text-lg rounded-2xl`}
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Launch Token Creator
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/guides"
                    className={`inline-flex items-center px-8 py-4 ${colors.secondaryButton} font-medium text-lg rounded-2xl`}
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Learn More
                  </Link>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-white/10">
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className={`w-5 h-5 ${typography.success.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={typography.label}>90% Lower Fees</span>
                </div>
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className={`w-5 h-5 ${typography.info.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className={typography.label}>5s Deploy</span>
                </div>
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className={typography.label}>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}