/**
 * Liquidity Context
 * Centralized state management for liquidity operations
 * Eliminates props drilling across liquidity components
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Token } from '../hooks/useTokenSelection'
import { TOKEN_ADDRESSES } from '../config/constants'

// ============================================================================
// TYPES
// ============================================================================

export interface LiquidityValidationErrors {
  tokenA?: string
  tokenB?: string
  amountA?: string
  amountB?: string
  lpTokenAmount?: string
}

export type LiquidityMode = 'add' | 'withdraw'

export interface LiquidityContextValue {
  // ===== TOKEN SELECTION STATE =====
  tokenA: Token | null
  tokenB: Token | null
  selectedLpToken: Token | null
  setTokenA: (token: Token | null) => void
  setTokenB: (token: Token | null) => void
  setSelectedLpToken: (token: Token | null) => void

  // ===== AMOUNT STATE =====
  amountA: string
  amountB: string
  lpTokenAmount: string
  setAmountA: (amount: string) => void
  setAmountB: (amount: string) => void
  setLpTokenAmount: (amount: string) => void

  // ===== MODE STATE =====
  liquidityMode: LiquidityMode
  setLiquidityMode: (mode: LiquidityMode) => void

  // ===== MODAL STATE =====
  showTokenModalA: boolean
  showTokenModalB: boolean
  showLpTokenModal: boolean
  showProgressModal: boolean
  setShowTokenModalA: (show: boolean) => void
  setShowTokenModalB: (show: boolean) => void
  setShowLpTokenModal: (show: boolean) => void
  setShowProgressModal: (show: boolean) => void

  // ===== VALIDATION STATE =====
  validationErrors: LiquidityValidationErrors
  setValidationErrors: (errors: LiquidityValidationErrors) => void

  // ===== TOKEN ADDRESS INPUT =====
  tokenAddressInput: string
  setTokenAddressInput: (address: string) => void

  // ===== UTILITY FUNCTIONS =====
  resetForm: () => void
  switchTokens: () => void
}

// ============================================================================
// CONTEXT
// ============================================================================

const LiquidityContext = createContext<LiquidityContextValue | undefined>(undefined)

// ============================================================================
// PROVIDER
// ============================================================================

interface LiquidityProviderProps {
  children: ReactNode
}

export function LiquidityProvider({ children }: LiquidityProviderProps) {
  // Token selection state
  const [tokenA, setTokenA] = useState<Token | null>(null)
  const [tokenB, setTokenB] = useState<Token | null>({
    address: TOKEN_ADDRESSES.WETH,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  })
  const [selectedLpToken, setSelectedLpToken] = useState<Token | null>(null)

  // Amount state
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [lpTokenAmount, setLpTokenAmount] = useState('')

  // Mode state
  const [liquidityMode, setLiquidityMode] = useState<LiquidityMode>('add')

  // Modal state
  const [showTokenModalA, setShowTokenModalA] = useState(false)
  const [showTokenModalB, setShowTokenModalB] = useState(false)
  const [showLpTokenModal, setShowLpTokenModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)

  // Validation state
  const [validationErrors, setValidationErrors] = useState<LiquidityValidationErrors>({})

  // Token address input
  const [tokenAddressInput, setTokenAddressInput] = useState('')

  // ===== UTILITY FUNCTIONS =====

  /**
   * Reset all form fields to default state
   */
  const resetForm = useCallback(() => {
    setAmountA('')
    setAmountB('')
    setLpTokenAmount('')
    setValidationErrors({})
    setTokenAddressInput('')
  }, [])

  /**
   * Switch tokenA and tokenB positions
   */
  const switchTokens = useCallback(() => {
    const tempToken = tokenA
    const tempAmount = amountA

    setTokenA(tokenB)
    setTokenB(tempToken)
    setAmountA(amountB)
    setAmountB(tempAmount)
  }, [tokenA, tokenB, amountA, amountB])

  // ===== CONTEXT VALUE =====

  const value: LiquidityContextValue = {
    // Token selection
    tokenA,
    tokenB,
    selectedLpToken,
    setTokenA,
    setTokenB,
    setSelectedLpToken,

    // Amounts
    amountA,
    amountB,
    lpTokenAmount,
    setAmountA,
    setAmountB,
    setLpTokenAmount,

    // Mode
    liquidityMode,
    setLiquidityMode,

    // Modals
    showTokenModalA,
    showTokenModalB,
    showLpTokenModal,
    showProgressModal,
    setShowTokenModalA,
    setShowTokenModalB,
    setShowLpTokenModal,
    setShowProgressModal,

    // Validation
    validationErrors,
    setValidationErrors,

    // Token address input
    tokenAddressInput,
    setTokenAddressInput,

    // Utilities
    resetForm,
    switchTokens,
  }

  return (
    <LiquidityContext.Provider value={value}>
      {children}
    </LiquidityContext.Provider>
  )
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access liquidity context
 * @throws Error if used outside LiquidityProvider
 */
export function useLiquidity(): LiquidityContextValue {
  const context = useContext(LiquidityContext)

  if (context === undefined) {
    throw new Error('useLiquidity must be used within a LiquidityProvider')
  }

  return context
}

// ============================================================================
// SELECTOR HOOKS (for optimized re-renders)
// ============================================================================

/**
 * Hook to access only token selection state
 * Use this to avoid unnecessary re-renders when amounts change
 */
export function useLiquidityTokens() {
  const { tokenA, tokenB, selectedLpToken, setTokenA, setTokenB, setSelectedLpToken, switchTokens } = useLiquidity()
  return { tokenA, tokenB, selectedLpToken, setTokenA, setTokenB, setSelectedLpToken, switchTokens }
}

/**
 * Hook to access only amount state
 */
export function useLiquidityAmounts() {
  const { amountA, amountB, lpTokenAmount, setAmountA, setAmountB, setLpTokenAmount } = useLiquidity()
  return { amountA, amountB, lpTokenAmount, setAmountA, setAmountB, setLpTokenAmount }
}

/**
 * Hook to access only modal state
 */
export function useLiquidityModals() {
  const {
    showTokenModalA,
    showTokenModalB,
    showLpTokenModal,
    showProgressModal,
    setShowTokenModalA,
    setShowTokenModalB,
    setShowLpTokenModal,
    setShowProgressModal,
  } = useLiquidity()

  return {
    showTokenModalA,
    showTokenModalB,
    showLpTokenModal,
    showProgressModal,
    setShowTokenModalA,
    setShowTokenModalB,
    setShowLpTokenModal,
    setShowProgressModal,
  }
}

/**
 * Hook to access only mode state
 */
export function useLiquidityMode() {
  const { liquidityMode, setLiquidityMode } = useLiquidity()
  return { liquidityMode, setLiquidityMode }
}
