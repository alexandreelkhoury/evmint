export interface LiquidityPool {
  id: string
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  tokenAmount: string
  ethAmount: string
  poolAddress: string
  createdAt: number
  txHash: string
  liquidityTokens?: string
  imageUrl?: string
}

export interface LPToken {
  address: string
  name: string
  symbol: string
  poolAddress: string
  tokenA: string
  tokenB: string
  tokenASymbol: string
  tokenBSymbol: string
  createdAt: number
  chainId: number
  userAddress: string
  txHash: string
}

export interface TokenProcessInfo {
  address: string
  name: string
  symbol: string
  tokenAmount: string
  ethAmount: string
}

export type TransactionStep = 'approve' | 'add' | 'remove_approve' | 'remove_liquidity' | null

export interface ContractAddresses {
  factory: string | null
  router: string | null
  weth: string
  chainName: string
  hasV2Support: boolean
}
