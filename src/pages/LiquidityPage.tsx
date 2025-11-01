import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import TokenSelectModal from '../components/liquidity/TokenSelectModal'
import SuccessModal from '../components/liquidity/SuccessModal'
import TransactionProgressModal from '../components/liquidity/TransactionProgressModal'
import { layout, typography } from '../styles/designSystem'
import { loggers } from '../utils/logger'
import AddLiquidityForm from './LiquidityPage/components/AddLiquidityForm'
import RemoveLiquidityForm from './LiquidityPage/components/RemoveLiquidityForm'
import NoDexWarning from './LiquidityPage/components/NoDexWarning'
import { useLiquidityPageLogic } from './LiquidityPage/hooks/useLiquidityPageLogic'

export default function LiquidityPage() {
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
    handleAddTokenFromAddress,
    handleAddLiquidity,
    handleRemoveLiquidity,
    clearSuccessState,
    resetLoadingStates
  } = useLiquidityPageLogic()

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
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
        title="Add Liquidity to Uniswap V2 - Earn Trading Fees on EVM Chains"
        description="Add liquidity to Uniswap V2 pools across multiple EVM blockchains and start earning trading fees. Provide liquidity for your tokens on Base, Ethereum, Arbitrum, and more."
        keywords="uniswap v2 liquidity, multi-chain liquidity, add liquidity evm, earn trading fees, liquidity provider, base arbitrum ethereum"
        canonical="/liquidity"
      />

      <div className={`relative z-10 ${layout.pageContainer}`}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
          >
            <span className="text-sm font-medium text-blue-400">💧 Liquidity Provider</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Liquidity Management
            </span>
            <br />
            <span className={typography.pageTitleWhite}>on Uniswap V2</span>
          </motion.h1>

          <motion.p
            className={`${typography.subtitle} max-w-3xl mx-auto text-lg sm:text-xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Add liquidity to earn trading fees or withdraw your existing positions.
          </motion.p>

          <NoDexWarning isV2Available={isV2Available} />
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-24">
          {/* Mode Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div className="flex bg-white/5 rounded-2xl p-2">
              <button
                onClick={() => setLiquidityMode('add')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  liquidityMode === 'add'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Add Liquidity
              </button>
              <button
                onClick={() => setLiquidityMode('withdraw')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  liquidityMode === 'withdraw'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Withdraw Liquidity
              </button>
            </div>
          </motion.div>

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
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showTokenModalA && (
          <TokenSelectModal
            isOpen={showTokenModalA}
            onClose={() => setShowTokenModalA(false)}
            title="Select First Token"
            tokens={[...availableTokens, ...userCreatedTokens, ...customTokens]}
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
            userCreatedTokens={userCreatedTokens}
            userLPTokens={userLPTokens}
            mode="add"
          />
        )}

        {showTokenModalB && (
          <TokenSelectModal
            isOpen={showTokenModalB}
            onClose={() => setShowTokenModalB(false)}
            title="Select Second Token"
            tokens={[...availableTokens, ...userCreatedTokens, ...customTokens]}
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
            userCreatedTokens={userCreatedTokens}
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
            userCreatedTokens={userCreatedTokens}
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
    </div>
  )
}
