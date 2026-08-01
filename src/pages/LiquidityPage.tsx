import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import TokenSelectModal from '../components/liquidity/TokenSelectModal'
import SuccessModal from '../components/liquidity/SuccessModal'
import TransactionProgressModal from '../components/liquidity/TransactionProgressModal'
import NetworkSelectorModal from '../components/NetworkSelectorModal'
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
      <div className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-lg px-4 pt-16 pb-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-white/5 rounded-lg"></div>
            <div className="h-4 w-64 bg-white/5 rounded-lg"></div>
            <div className="h-64 bg-white/5 rounded-xl mt-8"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SEO
        title="Add Liquidity to Uniswap V2 - Earn Trading Fees on EVM Chains"
        description="Add liquidity to Uniswap V2 pools across multiple EVM blockchains and start earning trading fees. Provide liquidity for your tokens on Base, Ethereum, Arbitrum, and more."
        keywords="uniswap v2 liquidity, multi-chain liquidity, add liquidity evm, earn trading fees, liquidity provider, base arbitrum ethereum"
        canonical="/liquidity"
      />

      <div className="mx-auto max-w-lg px-4 pt-10 sm:pt-16 pb-20">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Liquidity
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your Uniswap V2 liquidity positions.
          </p>
        </div>

        {/* Network button */}
        <button
          onClick={() => setIsNetworkModalOpen(true)}
          className="mb-5 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors duration-150"
        >
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          Network
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* No DEX warning */}
        {!isV2Available && <NoDexWarning isV2Available={isV2Available} />}

        {/* Tab bar */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setLiquidityMode('add')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 relative cursor-pointer ${
              liquidityMode === 'add'
                ? 'text-blue-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Add
            {liquidityMode === 'add' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setLiquidityMode('withdraw')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 relative cursor-pointer ${
              liquidityMode === 'withdraw'
                ? 'text-blue-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Withdraw
            {liquidityMode === 'withdraw' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Form */}
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
            tokens={[...customTokens]}
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
              isWithdrawal={lastSuccessfulPool.id?.startsWith('direct-')}
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
