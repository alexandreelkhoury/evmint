import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import TokenSelectModal from '../components/liquidity/TokenSelectModal'
import SuccessModal from '../components/liquidity/SuccessModal'
import TransactionProgressModal from '../components/liquidity/TransactionProgressModal'
import NetworkSelectorModal from '../components/NetworkSelectorModal'
import StandardPageHeader from '../components/StandardPageHeader'
import CTACard from '../components/CTACard'
import { layout } from '../styles/designSystem'
import { loggers } from '../utils/logger'
import AddLiquidityForm from './LiquidityPage/components/AddLiquidityForm'
import RemoveLiquidityForm from './LiquidityPage/components/RemoveLiquidityForm'
import NoDexWarning from './LiquidityPage/components/NoDexWarning'
import { useLiquidityPageLogic } from './LiquidityPage/hooks/useLiquidityPageLogic'

export default function LiquidityPage() {
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const {
    // State
    ready,
    authenticated,
    currentChainId,
    liquidityMode,
    tokenA,
    tokenB,
    amountA,
    amountB,
    selectedLpToken,
    lpTokenAmount,
    validationErrors,
    isFormValid,
    showTokenModalA,
    showTokenModalB,
    showLpTokenModal,
    showProgressModal,
    tokenAddressInput,

    // Balances
    balanceA,
    balanceB,
    lpTokenBalance,

    // Token selection
    availableTokens,
    userCreatedTokens,
    userLPTokens,
    customTokens,
    isLoadingCustomToken,

    // Deep-link prefill
    prefillChainName,
    needsChainSwitch,
    isSwitchingChain,
    prefillError,

    // Liquidity hook data
    isAddingLiquidity,
    isRemovingLiquidity,
    currentStep,
    liquidityError,
    isV2CorrectChain,
    isV2Available,
    lastSuccessfulPool,
    transactionHash,
    poolAddress,

    // Actions
    setLiquidityMode,
    setTokenA,
    setTokenB,
    setAmountA,
    setAmountB,
    setSelectedLpToken,
    setLpTokenAmount,
    setShowTokenModalA,
    setShowTokenModalB,
    setShowLpTokenModal,
    setShowProgressModal,
    setTokenAddressInput,
    setPercentageAmount,
    switchToPrefillChain,
    handleAddTokenFromAddress,
    handleAddLiquidity,
    handleRemoveLiquidity,
    clearSuccessState,
    resetLoadingStates
  } = useLiquidityPageLogic()

  if (!ready) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
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
        title="Add Liquidity to Uniswap V2 - Earn Trading Fees on EVM Chains"
        description="Add liquidity to Uniswap V2 pools across multiple EVM blockchains and start earning trading fees. Provide liquidity for your tokens on Base, Ethereum, Arbitrum, and more."
        keywords="uniswap v2 liquidity, multi-chain liquidity, add liquidity evm, earn trading fees, liquidity provider, base arbitrum ethereum"
        canonical="/liquidity"
      />

      <div className={`relative z-10 ${layout.pageContainer}`}>
        {/* Header */}
        <StandardPageHeader
          badgeIcon=""
          badgeText="Liquidity Provider"
          titleGradient="Liquidity Management"
          titleWhite="on Uniswap V2"
          subtitle="Add liquidity to earn trading fees or withdraw your existing positions."
          stats={[
            { value: 'Uniswap V2', label: 'Protocol', color: 'blue' },
            { value: 'Earn Fees', label: 'Trading', color: 'purple' },
            { value: 'Multi-Chain', label: 'Support', color: 'cyan' }
          ]}
          chainId={currentChainId}
          onNetworkClick={() => setIsNetworkModalOpen(true)}
          warningContent={!isV2Available ? <NoDexWarning isV2Available={isV2Available} /> : undefined}
        />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-24">
          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="flex bg-white/5 rounded-2xl p-2">
              <button
                onClick={() => setLiquidityMode('add')}
                className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-[background-color,color,box-shadow] duration-200 text-sm sm:text-base cursor-pointer ${
                  liquidityMode === 'add'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Add Liquidity
              </button>
              <button
                onClick={() => setLiquidityMode('withdraw')}
                className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-[background-color,color,box-shadow] duration-200 text-sm sm:text-base cursor-pointer ${
                  liquidityMode === 'withdraw'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Withdraw Liquidity
              </button>
            </div>
          </motion.div>

          {/* Deep link points at another chain — prompt, never switch silently */}
          {needsChainSwitch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl"
            >
              <p className="flex-1 text-sm text-blue-100">
                This token is on {prefillChainName} — switch network to add liquidity.
              </p>
              <button
                onClick={switchToPrefillChain}
                disabled={!authenticated || isSwitchingChain}
                className="shrink-0 inline-flex items-center justify-center px-4 min-h-[40px] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
              >
                {!authenticated
                  ? 'Connect wallet to switch'
                  : isSwitchingChain
                    ? 'Switching…'
                    : `Switch to ${prefillChainName}`}
              </button>
            </motion.div>
          )}

          {/* Deep-linked token could not be resolved on the active chain */}
          {!needsChainSwitch && prefillError && !tokenA && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-sm text-amber-100"
            >
              {prefillError}
            </motion.div>
          )}

          {/* Form Components */}
          {liquidityMode === 'add' ? (
            <AddLiquidityForm
              tokenA={tokenA}
              tokenB={tokenB}
              amountA={amountA}
              amountB={amountB}
              balanceA={balanceA}
              balanceB={balanceB}
              validationErrors={validationErrors}
              isFormValid={isFormValid}
              authenticated={authenticated}
              isV2CorrectChain={isV2CorrectChain}
              isV2Available={isV2Available}
              isAddingLiquidity={isAddingLiquidity}
              onAmountAChange={setAmountA}
              onAmountBChange={setAmountB}
              onTokenAClick={() => setShowTokenModalA(true)}
              onTokenBClick={() => setShowTokenModalB(true)}
              onSetPercentageAmount={setPercentageAmount}
              onSubmit={handleAddLiquidity}
            />
          ) : (
            <RemoveLiquidityForm
              selectedLpToken={selectedLpToken}
              lpTokenAmount={lpTokenAmount}
              lpTokenBalance={lpTokenBalance}
              validationErrors={validationErrors}
              isFormValid={isFormValid}
              authenticated={authenticated}
              isV2CorrectChain={isV2CorrectChain}
              isV2Available={isV2Available}
              isRemovingLiquidity={isRemovingLiquidity}
              onLpTokenAmountChange={setLpTokenAmount}
              onLpTokenClick={() => setShowLpTokenModal(true)}
              onSetPercentageAmount={setPercentageAmount}
              onSubmit={() => handleRemoveLiquidity('withdraw')}
            />
          )}
        </div>

        {/* Getting Started CTA */}
        <CTACard
          title={
            <>
              Need help getting <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">started</span>?
            </>
          }
          subtitle="Check out our comprehensive guides and FAQ section!"
          buttons={[
            {
              text: 'Read Guides',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              href: '/guides',
              variant: 'secondary'
            },
            {
              text: 'Get Help',
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              href: '/faq',
              variant: 'primary'
            }
          ]}
          trustIndicators={[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              text: 'Instant',
              color: 'text-blue-400'
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              text: 'Secure',
              color: 'text-purple-400'
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              ),
              text: 'Low Fees',
              color: 'text-green-400'
            }
          ]}
          gradientColors="from-blue-600/20 via-purple-600/20 to-cyan-600/20"
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showTokenModalA && (
          <TokenSelectModal
            isOpen={showTokenModalA}
            onClose={() => setShowTokenModalA(false)}
            title="Select First Token"
            tokens={[...availableTokens, ...userCreatedTokens, ...customTokens].filter(t => !tokenB || t.address.toLowerCase() !== tokenB.address.toLowerCase())}
            selectedToken={tokenA || undefined}
            onSelectToken={(token) => {
              setTokenA(token)
              setShowTokenModalA(false)
            }}
            showTokenInput={true}
            tokenAddressInput={tokenAddressInput}
            onTokenAddressInputChange={setTokenAddressInput}
            onAddTokenFromAddress={handleAddTokenFromAddress}
            isLoadingToken={isLoadingCustomToken}
            userLPTokens={userLPTokens}
            mode="add"
          />
        )}

        {showTokenModalB && (
          <TokenSelectModal
            isOpen={showTokenModalB}
            onClose={() => setShowTokenModalB(false)}
            title="Select Second Token"
            tokens={[...availableTokens, ...userCreatedTokens, ...customTokens].filter(t => !tokenA || t.address.toLowerCase() !== tokenA.address.toLowerCase())}
            selectedToken={tokenB || undefined}
            onSelectToken={(token) => {
              setTokenB(token)
              setShowTokenModalB(false)
            }}
            showTokenInput={true}
            tokenAddressInput={tokenAddressInput}
            onTokenAddressInputChange={setTokenAddressInput}
            onAddTokenFromAddress={handleAddTokenFromAddress}
            isLoadingToken={isLoadingCustomToken}
            userLPTokens={userLPTokens}
            mode="add"
          />
        )}

        {showLpTokenModal && (
          <TokenSelectModal
            isOpen={showLpTokenModal}
            onClose={() => setShowLpTokenModal(false)}
            title="Select LP Token to Withdraw"
            tokens={[...customTokens]} // Allow custom LP token addresses
            selectedToken={selectedLpToken || undefined}
            onSelectToken={(token) => {
              setSelectedLpToken(token)
              setShowLpTokenModal(false)
            }}
            showTokenInput={true}
            tokenAddressInput={tokenAddressInput}
            onTokenAddressInputChange={setTokenAddressInput}
            onAddTokenFromAddress={handleAddTokenFromAddress}
            isLoadingToken={isLoadingCustomToken}
            userLPTokens={userLPTokens}
            mode="withdraw"
          />
        )}

        {showProgressModal && (
          <TransactionProgressModal
            isOpen={showProgressModal}
            onClose={() => setShowProgressModal(false)}
            currentStep={currentStep}
            isProcessing={isAddingLiquidity}
            tokenA={tokenA}
            tokenB={tokenB}
            amountA={amountA}
            amountB={amountB}
            error={liquidityError}
            transactionHash={transactionHash || undefined}
            poolAddress={poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000' ? poolAddress : undefined}
            chainId={currentChainId}
            resetLoadingStates={resetLoadingStates}
          />
        )}

        {lastSuccessfulPool && !showProgressModal && (
          <>
            {loggers.liquidity.info('Showing success modal:', {
              poolId: lastSuccessfulPool.id,
              txHash: lastSuccessfulPool.txHash,
              lpTokenAddress: lastSuccessfulPool.poolAddress,
              tokenSymbol: lastSuccessfulPool.tokenSymbol,
              chainId: currentChainId
            })}
            <SuccessModal
              isOpen={!!lastSuccessfulPool}
              onClose={clearSuccessState}
              pool={{
                tokenAddress: lastSuccessfulPool.tokenAddress,
                tokenName: lastSuccessfulPool.tokenName,
                tokenSymbol: lastSuccessfulPool.tokenSymbol,
                tokenAmount: lastSuccessfulPool.tokenAmount,
                ethAmount: lastSuccessfulPool.ethAmount,
                txHash: lastSuccessfulPool.txHash,
                lpTokenAddress: lastSuccessfulPool.poolAddress
              }}
              chainId={currentChainId}
              isWithdrawal={lastSuccessfulPool.id?.startsWith('direct-')} // Detect if it's a withdrawal
            />
          </>
        )}
      </AnimatePresence>

      {/* Network Selector Modal */}
      <NetworkSelectorModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />
    </div>
  )
}
