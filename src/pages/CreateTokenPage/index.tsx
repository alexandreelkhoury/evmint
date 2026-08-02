import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SEO from '../../components/SEO'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView } from '../../utils/analytics'
import { layout } from '../../styles/designSystem'
import { useTokenCreationLogic } from './hooks/useTokenCreationLogic'
import StandardPageHeader from '../../components/StandardPageHeader'
import TokenForm from './components/TokenForm'
import FeeDisclosure from './components/FeeDisclosure'
import SubmitButton from './components/SubmitButton'
import SuccessModal from './components/SuccessModal'
import ErrorDisplay from './components/ErrorDisplay'
import GettingStartedCTA from './components/GettingStartedCTA'
import NetworkSelectorModal from '../../components/NetworkSelectorModal'

export default function CreateTokenPage() {
  const analytics = useFirebaseAnalytics()
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  useEffect(() => {
    trackPageView(analytics, 'create')
  }, [analytics])
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
    verificationStatus,
    retryVerification,
    createAnother,
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

  const createTokenStructuredData: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "EVMint - Multi-Chain ERC20 Token Creator",
      "description": "Create and deploy ERC20 tokens on 15+ EVM blockchains in seconds. No coding required. Deploy on Ethereum, Base, Arbitrum, Polygon, BSC, Avalanche, Optimism, Fantom, Gnosis, Moonbeam, Blast, Worldchain & more with ultra-low gas fees on Layer 2 networks.",
      "url": "https://evmint.io/create",
      "applicationCategory": "FinanceApplication",
      "applicationSubCategory": "Token Creator",
      "operatingSystem": "Web Browser",
      "browserRequirements": "Requires a modern web browser with Web3 wallet support (MetaMask, Rainbow, WalletConnect)",
      "offers": {
        "@type": "Offer",
        "price": "80",
        "priceCurrency": "USD",
        "priceValidUntil": "2027-12-31",
        "description": "~$80 equivalent per token deployment on any supported chain, paid in native token. Same price across all 15+ EVM networks.",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      "provider": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io",
        "sameAs": [
          "https://twitter.com/evmint"
        ]
      },
      "potentialAction": {
        "@type": "CreateAction",
        "name": "Create ERC20 Token",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://evmint.io/create",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "DigitalDocument",
          "name": "ERC20 Token Smart Contract",
          "description": "A deployed and verified ERC20 token contract on the selected EVM blockchain"
        }
      },
      "featureList": [
        "No coding required - visual token creation form",
        "Deploy in under 5 seconds on most networks",
        "15+ EVM blockchains supported",
        "Ultra-low gas fees on Layer 2 networks",
        "Automatic contract verification on block explorers",
        "Multi-DEX liquidity support (Uniswap, SushiSwap, PancakeSwap)",
        "Custom token name, symbol, and supply",
        "Standard ERC20 compliance for full DeFi compatibility",
        "Mobile-friendly responsive interface",
        "Immutable and secure smart contracts"
      ],
      "screenshot": "https://evmint.io/og-image.png",
      "softwareVersion": "2.0",
      "releaseNotes": "Multi-chain support with 15+ EVM networks"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://evmint.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Create Token",
          "item": "https://evmint.io/create"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Create an ERC20 Token with EVMint",
      "description": "Step-by-step guide to creating your own ERC20 token on any EVM blockchain using EVMint's no-code token creator.",
      "totalTime": "PT2M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "80"
      },
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Web3 wallet (MetaMask, Rainbow, or WalletConnect-compatible)"
        },
        {
          "@type": "HowToTool",
          "name": "Web browser (Chrome, Firefox, Safari, or Brave)"
        }
      ],
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Native tokens for gas fees (ETH, MATIC, BNB, etc.)"
        },
        {
          "@type": "HowToSupply",
          "name": "Deployment fee (~$80 USD equivalent in native tokens)"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Connect Your Wallet",
          "text": "Click 'Connect Wallet' and select your preferred wallet provider. Ensure you have native tokens for gas fees on your chosen network.",
          "url": "https://evmint.io/create"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Select Your Blockchain Network",
          "text": "Choose from 15+ supported EVM networks including Ethereum, Base, Arbitrum, Polygon, BSC, Avalanche, Optimism, and more. Layer 2 networks offer the lowest fees.",
          "url": "https://evmint.io/create"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Enter Token Details",
          "text": "Fill in your token name, symbol, total supply, and decimals. The form validates your inputs in real-time to ensure a successful deployment.",
          "url": "https://evmint.io/create"
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Deploy Your Token",
          "text": "Review the details, click 'Create Token', and approve the transaction in your wallet. Your token deploys in seconds and is automatically verified on the block explorer.",
          "url": "https://evmint.io/create"
        }
      ]
    }
  ]

  if (!ready) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      {/* Static background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.05)_0%,_transparent_60%)]" />
      </div>

      <SEO
        title="Create an ERC20 Token on Any EVM Chain | No-Code Launcher"
        description="Launch an ERC20 token on 15+ EVM chains: Ethereum, Base, Arbitrum, Polygon and more. No coding, ultra-low L2 gas fees, auto-verified on block explorers."
        keywords="create token, erc20 token creator, multi-chain token, meme coin creator, no code token maker, ethereum token, base token, arbitrum token, polygon token, cheap crypto deployment, uniswap token launch, layer 2 tokens, defi token generator, cryptocurrency creator, multi-chain launcher"
        canonical="/create"
        structuredData={createTokenStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer}`}>
        {/* Page Header */}
        <StandardPageHeader
          badgeIcon=""
          badgeText="Token Creator"
          titleGradient="Create Your Token"
          titleWhite="on Any EVM Chain"
          subtitle="Deploy your own ERC20 token on any EVM blockchain in seconds. No coding experience required! Ultra-low gas fees on Layer 2 networks."
          stats={[
            { value: '15+ Chains', label: 'Supported', color: 'blue' },
            { value: 'Instant', label: 'Deployment', color: 'purple' },
            { value: `${feeAmount} ${nativeTokenName}`, label: 'Fee', color: 'cyan' }
          ]}
          chainId={chainId}
          onNetworkClick={() => setIsNetworkModalOpen(true)}
          warningContent={!isSupported ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-red-300 font-semibold">Unsupported Network</div>
                  <div className="text-red-200 text-sm">
                    Please switch to a supported chain to deploy tokens.
                  </div>
                </div>
              </div>
            </div>
          ) : undefined}
        />

        {/* Token Creation Form */}
        <div className="max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 lg:p-6 shadow-xl shadow-black/20"
          >
            <form onSubmit={handleSubmit}>
              <TokenForm
                formData={formData}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                getFieldValidation={getFieldValidation}
              />

              <FeeDisclosure
                feeAmount={feeAmount}
                nativeTokenName={nativeTokenName}
              />

              <div className="mt-5">
                <SubmitButton
                  authenticated={authenticated}
                  isCorrectChain={isCorrectChain}
                  isCreating={isCreating}
                  isVerifying={isVerifying}
                  formErrors={formErrors}
                  chainName={chainName}
                />

                {showSuccess && createdTokenAddress && (
                  <SuccessModal
                    tokenAddress={createdTokenAddress}
                    chainName={chainName}
                    tokenName={formData.name}
                    tokenSymbol={formData.symbol}
                    totalSupply={formData.totalSupply}
                    chainId={chainId}
                    verificationStatus={verificationStatus}
                    onRetryVerification={retryVerification}
                    onCreateAnother={createAnother}
                  />
                )}

                {error && <ErrorDisplay error={error} />}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Getting Started CTA */}
        <GettingStartedCTA />
      </div>

      {/* Network Selector Modal */}
      <NetworkSelectorModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  )
}
