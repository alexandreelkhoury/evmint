import { motion } from 'framer-motion'
import SEO from '../../components/SEO'
import { layout, colors } from '../../styles/designSystem'
import { useTokenCreationLogic } from './hooks/useTokenCreationLogic'
import PageHeader from './components/PageHeader'
import TokenForm from './components/TokenForm'
import FeeDisclosure from './components/FeeDisclosure'
import SubmitButton from './components/SubmitButton'
import SuccessModal from './components/SuccessModal'
import ErrorDisplay from './components/ErrorDisplay'
import GettingStartedCTA from './components/GettingStartedCTA'

export default function CreateTokenPage() {
  const {
    ready,
    authenticated,
    showSuccess,
    formData,
    formErrors,
    isCreating,
    createdTokenAddress,
    error,
    isCorrectChain,
    isVerifying,
    feeAmount,
    chainId,
    chainName,
    isSupported,
    nativeTokenName,
    hasDex,
    handleInputChange,
    getFieldValidation,
    handleSubmit
  } = useTokenCreationLogic()

  const createTokenStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Multi-Chain Token Creator - ERC20 Token Generator",
    "description": "Create and deploy ERC20 tokens on any EVM blockchain in seconds. No coding required, ultra-low gas fees on Layer 2 networks.",
    "url": "https://evmint.io/create",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0.02",
      "priceCurrency": "ETH",
      "description": "Token deployment fee on EVM blockchains"
    },
    "provider": {
      "@type": "Organization",
      "name": "Multi-Chain Token Creator",
      "url": "https://evmint.io"
    },
    "potentialAction": {
      "@type": "CreateAction",
      "target": "https://evmint.io/create",
      "result": {
        "@type": "DigitalDocument",
        "name": "ERC20 Token Contract"
      }
    },
    "featureList": [
      "No coding required",
      "Instant deployment",
      "Ultra-low gas fees on L2",
      "Auto-verification on block explorers",
      "Multi-DEX liquidity support",
      "15+ EVM blockchain support"
    ]
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
        {/* Loading skeleton */}
        <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-white/5 rounded-2xl"></div>
            <div className="h-96 bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
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
        title="🚀 Create Token on Any EVM Chain - Multi-Chain ERC20 Deployment | Ultra-Low Fees"
        description="⚡ Launch your ERC20 token on 15+ EVM blockchains instantly! Ethereum, Base, Arbitrum, Polygon & more. No coding needed. Ultra-low gas fees on L2, auto-verify on block explorers, multi-DEX liquidity support. Start your token today!"
        keywords="create token, erc20 token creator, multi-chain token, meme coin creator, no code token maker, ethereum token, base token, arbitrum token, polygon token, cheap crypto deployment, uniswap token launch, layer 2 tokens, defi token generator, cryptocurrency creator, multi-chain launcher"
        canonical="/create"
        structuredData={createTokenStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer}`}>
        {/* Page Header */}
        <PageHeader />

        {/* Token Creation Form */}
        <div className="max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={`${colors.glassCard} rounded-3xl p-8 lg:p-12`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <TokenForm
                formData={formData}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                getFieldValidation={getFieldValidation}
                chainId={chainId}
                chainName={chainName}
                isSupported={isSupported}
                hasDex={hasDex}
              />

              <FeeDisclosure
                feeAmount={feeAmount}
                nativeTokenName={nativeTokenName}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="pt-6"
              >
                <SubmitButton
                  authenticated={authenticated}
                  isCorrectChain={isCorrectChain}
                  isCreating={isCreating}
                  isVerifying={isVerifying}
                  formErrors={formErrors}
                  chainName={chainName}
                />

                {/* Success/Error Messages */}
                {showSuccess && createdTokenAddress && (
                  <SuccessModal
                    tokenAddress={createdTokenAddress}
                    chainName={chainName}
                  />
                )}

                {error && <ErrorDisplay error={error} />}
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Getting Started CTA */}
        <GettingStartedCTA />
      </div>
    </div>
  )
}
