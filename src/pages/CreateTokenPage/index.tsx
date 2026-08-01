import { useState, useEffect } from 'react'
import SEO from '../../components/SEO'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView } from '../../utils/analytics'
import { layout } from '../../styles/designSystem'
import { useTokenCreationLogic } from './hooks/useTokenCreationLogic'
import TokenForm from './components/TokenForm'
import FeeDisclosure from './components/FeeDisclosure'
import SubmitButton from './components/SubmitButton'
import SuccessModal from './components/SuccessModal'
import ErrorDisplay from './components/ErrorDisplay'
import NetworkSelectorModal from '../../components/NetworkSelectorModal'
import ChainBadge from '../../components/ChainBadge'

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
      <div className="min-h-screen bg-gray-950">
        <div className={`${layout.narrowContainer} pb-20`}>
          <div className="animate-pulse space-y-6 pt-8">
            <div className="h-8 w-48 bg-white/5 rounded-lg" />
            <div className="h-[420px] bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <SEO
        title="Create Token on Any EVM Chain - Multi-Chain ERC20 Deployment | Ultra-Low Fees"
        description="Launch your ERC20 token on 15+ EVM blockchains instantly! Ethereum, Base, Arbitrum, Polygon & more. No coding needed. Ultra-low gas fees on L2, auto-verify on block explorers, multi-DEX liquidity support. Start your token today!"
        keywords="create token, erc20 token creator, multi-chain token, meme coin creator, no code token maker, ethereum token, base token, arbitrum token, polygon token, cheap crypto deployment, uniswap token launch, layer 2 tokens, defi token generator, cryptocurrency creator, multi-chain launcher"
        canonical="/create"
        structuredData={createTokenStructuredData}
      />

      <div className={`${layout.narrowContainer} pb-20`}>
        {/* Minimal page header — title + network selector inline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              Create Token
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Deploy an ERC-20 token on any supported EVM chain.
            </p>
          </div>

          {chainId !== undefined && (
            <button
              type="button"
              onClick={() => setIsNetworkModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08] transition-colors text-sm text-gray-300 self-start sm:self-auto"
            >
              <ChainBadge chainId={chainId} size="sm" />
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Unsupported network warning */}
        {!isSupported && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300">
              Unsupported network. Please switch to a supported chain to deploy tokens.
            </p>
          </div>
        )}

        {/* The form card — the hero of the page */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            )}

            {error && <ErrorDisplay error={error} />}
          </form>
        </div>
      </div>

      <NetworkSelectorModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  )
}
