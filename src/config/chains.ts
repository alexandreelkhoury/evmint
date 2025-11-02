import { Chain } from 'viem'
import {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
  fantom,
  fantomTestnet,
  linea,
  lineaTestnet,
  scroll,
  scrollSepolia,
  zkSync,
  zkSyncSepoliaTestnet,
  mantle,
  mantleTestnet,
  celo,
  celoAlfajores,
  gnosis,
  moonbeam,
  moonbaseAlpha
} from 'viem/chains'

/**
 * DEX Protocol Support for a chain
 */
export interface DexConfig {
  uniswapV2Factory?: string
  uniswapV2Router?: string
  uniswapV3Factory?: string
  uniswapV3Router?: string
  uniswapV3QuoterV2?: string
  sushiswapFactory?: string
  sushiswapRouter?: string
  pancakeswapFactory?: string
  pancakeswapRouter?: string
  quickswapFactory?: string
  quickswapRouter?: string
  traderJoeFactory?: string
  traderJoeRouter?: string
  spookyswapFactory?: string
  spookyswapRouter?: string
  // Add more DEX protocols as needed
}

/**
 * Block Explorer Configuration
 */
export interface ExplorerConfig {
  name: string
  url: string
  apiUrl: string
  apiKeyEnvVar?: string // Environment variable name for API key
}

/**
 * Extended Chain Configuration
 */
export interface ChainConfig extends Chain {
  // Visual Identity
  icon: string // URL or path to chain icon
  color: string // Primary brand color
  gradient: string // Tailwind gradient classes

  // Smart Contract Addresses
  weth: string // Wrapped native token address
  dex: DexConfig

  // Block Explorer
  explorer: ExplorerConfig

  // RPC Configuration
  rpcUrls: {
    default: { http: string[] }
    public: { http: string[] }
  }
  rpcEnvVar?: string // Environment variable for custom RPC

  // Feature Flags
  features: {
    tokenDeployment: boolean // Can deploy ERC20 tokens
    uniswapV2: boolean // Has Uniswap V2 liquidity support
    uniswapV3: boolean // Has Uniswap V3 liquidity support
    hasMultipleDex: boolean // Multiple DEX options available
  }

  // Category
  category: 'mainnet' | 'testnet'
  layer: 'L1' | 'L2' | 'sidechain'
}

/**
 * Comprehensive Chain Configurations
 * Organized by network type for easy management
 */

// ============================================================================
// ETHEREUM
// ============================================================================

export const ethereumMainnetConfig: ChainConfig = {
  ...mainnet,
  icon: '🔷',
  color: '#627EEA',
  gradient: 'from-blue-500 to-purple-600',
  weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  dex: {
    uniswapV2Factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    uniswapV2Router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    uniswapV3QuoterV2: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
    sushiswapFactory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    sushiswapRouter: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
  },
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io',
    apiUrl: 'https://api.etherscan.io/api',
    apiKeyEnvVar: 'VITE_ETHERSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://eth.llamarpc.com'] },
    public: { http: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'] },
  },
  rpcEnvVar: 'VITE_ETHEREUM_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: true,
    hasMultipleDex: true,
  },
  category: 'mainnet',
  layer: 'L1',
}

export const sepoliaConfig: ChainConfig = {
  ...sepolia,
  icon: '🔷',
  color: '#627EEA',
  gradient: 'from-blue-400 to-purple-500',
  weth: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
  dex: {
    uniswapV2Factory: '0x7E0987E5b3a30e3f2828572Bb659A548460a3003',
    uniswapV2Router: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
  },
  explorer: {
    name: 'Etherscan',
    url: 'https://sepolia.etherscan.io',
    apiUrl: 'https://api-sepolia.etherscan.io/api',
    apiKeyEnvVar: 'VITE_ETHERSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.org'] },
    public: { http: ['https://rpc.sepolia.org', 'https://ethereum-sepolia.blockpi.network/v1/rpc/public'] },
  },
  rpcEnvVar: 'VITE_ETHEREUM_SEPOLIA_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'L1',
}

// ============================================================================
// BASE
// ============================================================================

export const baseConfig: ChainConfig = {
  ...base,
  icon: '🔵',
  color: '#0052FF',
  gradient: 'from-blue-600 to-blue-400',
  weth: '0x4200000000000000000000000000000000000006',
  dex: {
    uniswapV2Factory: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapV2Router: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    uniswapV3Factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    uniswapV3Router: '0x2626664c2603336E57B271c5C0b26F421741e481',
    sushiswapFactory: '0x71524B4f93c58fcbF659783284E38825f0622859',
    sushiswapRouter: '0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891',
  },
  explorer: {
    name: 'Basescan',
    url: 'https://basescan.org',
    apiUrl: 'https://api.basescan.org/api',
    apiKeyEnvVar: 'VITE_BASESCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org', 'https://base.llamarpc.com'] },
  },
  rpcEnvVar: 'VITE_BASE_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: true,
    hasMultipleDex: true,
  },
  category: 'mainnet',
  layer: 'L2',
}

export const baseSepoliaConfig: ChainConfig = {
  ...baseSepolia,
  icon: '🔵',
  color: '#0052FF',
  gradient: 'from-blue-500 to-blue-300',
  weth: '0x4200000000000000000000000000000000000006',
  dex: {
    // NOTE: Uniswap V2 is NOT deployed on Base Sepolia testnet
  },
  explorer: {
    name: 'Basescan',
    url: 'https://sepolia.basescan.org',
    apiUrl: 'https://api-sepolia.basescan.org/api',
    apiKeyEnvVar: 'VITE_BASESCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  rpcEnvVar: 'VITE_BASE_SEPOLIA_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'L2',
}

// ============================================================================
// ARBITRUM
// ============================================================================

export const arbitrumConfig: ChainConfig = {
  ...arbitrum,
  icon: '🔷',
  color: '#28A0F0',
  gradient: 'from-blue-500 to-cyan-400',
  weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  dex: {
    uniswapV2Factory: '0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9',
    uniswapV2Router: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    sushiswapFactory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    sushiswapRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  explorer: {
    name: 'Arbiscan',
    url: 'https://arbiscan.io',
    apiUrl: 'https://api.arbiscan.io/api',
    apiKeyEnvVar: 'VITE_ARBISCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://arb1.arbitrum.io/rpc'] },
    public: { http: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum.llamarpc.com'] },
  },
  rpcEnvVar: 'VITE_ARBITRUM_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: true,
    hasMultipleDex: true,
  },
  category: 'mainnet',
  layer: 'L2',
}

export const arbitrumSepoliaConfig: ChainConfig = {
  ...arbitrumSepolia,
  icon: '🔷',
  color: '#28A0F0',
  gradient: 'from-blue-400 to-cyan-300',
  weth: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
  dex: {},
  explorer: {
    name: 'Arbiscan',
    url: 'https://sepolia.arbiscan.io',
    apiUrl: 'https://api-sepolia.arbiscan.io/api',
    apiKeyEnvVar: 'VITE_ARBISCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
    public: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
  },
  rpcEnvVar: 'VITE_ARBITRUM_SEPOLIA_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'L2',
}

// ============================================================================
// OPTIMISM
// ============================================================================

export const optimismConfig: ChainConfig = {
  ...optimism,
  icon: '🔴',
  color: '#FF0420',
  gradient: 'from-red-500 to-pink-500',
  weth: '0x4200000000000000000000000000000000000006',
  dex: {
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  },
  explorer: {
    name: 'Optimistic Etherscan',
    url: 'https://optimistic.etherscan.io',
    apiUrl: 'https://api-optimistic.etherscan.io/api',
    apiKeyEnvVar: 'VITE_OPTIMISM_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.optimism.io'] },
    public: { http: ['https://mainnet.optimism.io', 'https://optimism.llamarpc.com'] },
  },
  rpcEnvVar: 'VITE_OPTIMISM_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: true,
    hasMultipleDex: false,
  },
  category: 'mainnet',
  layer: 'L2',
}

export const optimismSepoliaConfig: ChainConfig = {
  ...optimismSepolia,
  icon: '🔴',
  color: '#FF0420',
  gradient: 'from-red-400 to-pink-400',
  weth: '0x4200000000000000000000000000000000000006',
  dex: {},
  explorer: {
    name: 'Optimistic Etherscan',
    url: 'https://sepolia-optimism.etherscan.io',
    apiUrl: 'https://api-sepolia-optimistic.etherscan.io/api',
    apiKeyEnvVar: 'VITE_OPTIMISM_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.optimism.io'] },
    public: { http: ['https://sepolia.optimism.io'] },
  },
  rpcEnvVar: 'VITE_OPTIMISM_SEPOLIA_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'L2',
}

// ============================================================================
// POLYGON
// ============================================================================

export const polygonConfig: ChainConfig = {
  ...polygon,
  icon: '💜',
  color: '#8247E5',
  gradient: 'from-purple-600 to-purple-400',
  weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', // WETH on Polygon
  dex: {
    uniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    uniswapV3Router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    quickswapFactory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    quickswapRouter: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    sushiswapFactory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    sushiswapRouter: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  },
  explorer: {
    name: 'Polygonscan',
    url: 'https://polygonscan.com',
    apiUrl: 'https://api.polygonscan.com/api',
    apiKeyEnvVar: 'VITE_POLYGONSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
    public: { http: ['https://polygon-rpc.com', 'https://polygon.llamarpc.com'] },
  },
  rpcEnvVar: 'VITE_POLYGON_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: true,
    hasMultipleDex: true,
  },
  category: 'mainnet',
  layer: 'sidechain',
}

export const polygonAmoyConfig: ChainConfig = {
  ...polygonAmoy,
  icon: '💜',
  color: '#8247E5',
  gradient: 'from-purple-500 to-purple-300',
  weth: '0x360ad4f9a9A8EFe9A8DCB5f461c4Cc1047E1Dcf9',
  dex: {},
  explorer: {
    name: 'Polygonscan',
    url: 'https://amoy.polygonscan.com',
    apiUrl: 'https://api-amoy.polygonscan.com/api',
    apiKeyEnvVar: 'VITE_POLYGONSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
    public: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  rpcEnvVar: 'VITE_POLYGON_AMOY_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'sidechain',
}

// ============================================================================
// BINANCE SMART CHAIN
// ============================================================================

export const bscConfig: ChainConfig = {
  ...bsc,
  icon: '🟡',
  color: '#F3BA2F',
  gradient: 'from-yellow-500 to-yellow-300',
  weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
  dex: {
    pancakeswapFactory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    pancakeswapRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  },
  explorer: {
    name: 'BscScan',
    url: 'https://bscscan.com',
    apiUrl: 'https://api.bscscan.com/api',
    apiKeyEnvVar: 'VITE_BSCSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org'] },
    public: { http: ['https://bsc-dataseed.binance.org', 'https://binance.llamarpc.com'] },
  },
  rpcEnvVar: 'VITE_BSC_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true, // PancakeSwap uses V2 model
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'mainnet',
  layer: 'sidechain',
}

export const bscTestnetConfig: ChainConfig = {
  ...bscTestnet,
  icon: '🟡',
  color: '#F3BA2F',
  gradient: 'from-yellow-400 to-yellow-200',
  weth: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', // WBNB
  dex: {
    pancakeswapFactory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
    pancakeswapRouter: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  },
  explorer: {
    name: 'BscScan',
    url: 'https://testnet.bscscan.com',
    apiUrl: 'https://api-testnet.bscscan.com/api',
    apiKeyEnvVar: 'VITE_BSCSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
  },
  rpcEnvVar: 'VITE_BSC_TESTNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'sidechain',
}

// ============================================================================
// AVALANCHE
// ============================================================================

export const avalancheConfig: ChainConfig = {
  ...avalanche,
  icon: '🔺',
  color: '#E84142',
  gradient: 'from-red-600 to-red-400',
  weth: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
  dex: {
    traderJoeFactory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    traderJoeRouter: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
  },
  explorer: {
    name: 'Snowtrace',
    url: 'https://snowtrace.io',
    apiUrl: 'https://api.snowtrace.io/api',
    apiKeyEnvVar: 'VITE_SNOWTRACE_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    public: { http: ['https://api.avax.network/ext/bc/C/rpc', 'https://avalanche.public-rpc.com'] },
  },
  rpcEnvVar: 'VITE_AVALANCHE_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true, // Trader Joe uses V2 model
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'mainnet',
  layer: 'L1',
}

export const avalancheFujiConfig: ChainConfig = {
  ...avalancheFuji,
  icon: '🔺',
  color: '#E84142',
  gradient: 'from-red-500 to-red-300',
  weth: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', // WAVAX
  dex: {},
  explorer: {
    name: 'Snowtrace',
    url: 'https://testnet.snowtrace.io',
    apiUrl: 'https://api-testnet.snowtrace.io/api',
    apiKeyEnvVar: 'VITE_SNOWTRACE_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
    public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  rpcEnvVar: 'VITE_AVALANCHE_FUJI_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: false,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'testnet',
  layer: 'L1',
}

// ============================================================================
// OTHER CHAINS (Add more as needed)
// ============================================================================

export const fantomConfig: ChainConfig = {
  ...fantom,
  icon: '👻',
  color: '#1969FF',
  gradient: 'from-blue-600 to-indigo-500',
  weth: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  dex: {
    spookyswapFactory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
    spookyswapRouter: '0xF491e7B69E4244ad4002BC14e878a34207E38c29',
  },
  explorer: {
    name: 'FTMScan',
    url: 'https://ftmscan.com',
    apiUrl: 'https://api.ftmscan.com/api',
    apiKeyEnvVar: 'VITE_FTMSCAN_API_KEY',
  },
  rpcUrls: {
    default: { http: ['https://rpc.ftm.tools'] },
    public: { http: ['https://rpc.ftm.tools', 'https://fantom.publicnode.com'] },
  },
  rpcEnvVar: 'VITE_FANTOM_MAINNET_RPC',
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'mainnet',
  layer: 'L1',
}

// ============================================================================
// CHAIN REGISTRY
// ============================================================================

/**
 * All supported chain configurations
 */
export const ALL_CHAINS: ChainConfig[] = [
  // Mainnets
  ethereumMainnetConfig,
  baseConfig,
  arbitrumConfig,
  optimismConfig,
  polygonConfig,
  bscConfig,
  avalancheConfig,
  fantomConfig,

  // Testnets
  sepoliaConfig,
  baseSepoliaConfig,
  arbitrumSepoliaConfig,
  optimismSepoliaConfig,
  polygonAmoyConfig,
  bscTestnetConfig,
  avalancheFujiConfig,
]

/**
 * Mainnet chains only
 */
export const MAINNET_CHAINS = ALL_CHAINS.filter(chain => chain.category === 'mainnet')

/**
 * Testnet chains only
 */
export const TESTNET_CHAINS = ALL_CHAINS.filter(chain => chain.category === 'testnet')

/**
 * Chains with Uniswap V2 support
 */
export const UNISWAP_V2_CHAINS = ALL_CHAINS.filter(chain => chain.features.uniswapV2)

/**
 * Chains with Uniswap V3 support
 */
export const UNISWAP_V3_CHAINS = ALL_CHAINS.filter(chain => chain.features.uniswapV3)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get chain configuration by chain ID
 */
export function getChainById(chainId: number): ChainConfig | undefined {
  return ALL_CHAINS.find(chain => chain.id === chainId)
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return ALL_CHAINS.some(chain => chain.id === chainId)
}

/**
 * Get chain name by chain ID
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.name || 'Unknown Network'
}

/**
 * Get DEX contracts for a chain
 */
export function getDexContracts(chainId: number): DexConfig | null {
  const chain = getChainById(chainId)
  return chain?.dex || null
}

/**
 * Get WETH address for a chain
 */
export function getWethAddress(chainId: number): string | null {
  const chain = getChainById(chainId)
  return chain?.weth || null
}

/**
 * Get block explorer URL for a chain
 */
export function getExplorerUrl(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.explorer.url || 'https://etherscan.io'
}

/**
 * Get transaction URL for a specific transaction hash
 */
export function getTxUrl(chainId: number, txHash: string): string {
  const explorerUrl = getExplorerUrl(chainId)
  return `${explorerUrl}/tx/${txHash}`
}

/**
 * Get address URL for a specific address
 */
export function getAddressUrl(chainId: number, address: string): string {
  const explorerUrl = getExplorerUrl(chainId)
  return `${explorerUrl}/address/${address}`
}

/**
 * Get token URL for a specific token address
 */
export function getTokenUrl(chainId: number, tokenAddress: string): string {
  const explorerUrl = getExplorerUrl(chainId)
  return `${explorerUrl}/token/${tokenAddress}`
}

/**
 * Check if chain has Uniswap V2 support
 */
export function hasUniswapV2(chainId: number): boolean {
  const chain = getChainById(chainId)
  return chain?.features.uniswapV2 || false
}

/**
 * Check if chain has any DEX support
 */
export function hasDexSupport(chainId: number): boolean {
  const chain = getChainById(chainId)
  return chain?.features.uniswapV2 || chain?.features.uniswapV3 || chain?.features.hasMultipleDex || false
}

/**
 * Get RPC URL for a chain (respects environment variable)
 */
export function getRpcUrl(chainId: number): string {
  const chain = getChainById(chainId)
  if (!chain) return ''

  // Check for custom RPC in environment variables
  if (chain.rpcEnvVar) {
    const customRpc = import.meta.env[chain.rpcEnvVar]
    if (customRpc) return customRpc
  }

  // Fall back to default RPC
  return chain.rpcUrls.default.http[0] || chain.rpcUrls.public.http[0] || ''
}

/**
 * Get all viem chain objects (for wagmi config)
 */
export function getAllViemChains(): Chain[] {
  return ALL_CHAINS
}

// ============================================================================
// DEPLOYMENT FEE CONFIGURATION (Chain-Specific)
// ============================================================================

/**
 * Deployment fees per chain (in native token)
 * Targeting $75-100 USD equivalent based on current market prices
 *
 * ETH ≈ $4,000 → 0.02 ETH = $80
 * BNB ≈ $1,100 → 0.075 BNB = $82.50
 * MATIC ≈ $0.20 → 400 MATIC = $80
 * AVAX ≈ $20 → 4 AVAX = $80
 * FTM/S ≈ $0.15 → 500 FTM = $75
 *
 * Note: Adjust these periodically based on market conditions
 */
export const CHAIN_FEES: Record<number, string> = {
  // ETH-based chains (ETH as gas token)
  1: '0.02',         // Ethereum Mainnet
  8453: '0.02',      // Base Mainnet
  42161: '0.02',     // Arbitrum One
  10: '0.02',        // Optimism

  // BNB chain
  56: '0.075',       // BSC Mainnet

  // MATIC chain
  137: '400',        // Polygon Mainnet

  // AVAX chain
  43114: '4',        // Avalanche C-Chain

  // FTM chain (Sonic S)
  250: '500',        // Fantom Opera

  // Testnets (much lower fees for testing)
  11155111: '0.001', // Sepolia
  84532: '0.001',    // Base Sepolia
  421614: '0.001',   // Arbitrum Sepolia
  11155420: '0.001', // Optimism Sepolia
  80002: '1',        // Polygon Amoy (1 MATIC for testing)
}

/**
 * Get deployment fee for a specific chain
 * @param chainId - Chain ID
 * @returns Fee amount as string (in native token units)
 */
export function getDeploymentFee(chainId: number): string {
  return CHAIN_FEES[chainId] || '0.02' // Default fallback
}

/**
 * Get deployment fee in USD (approximate)
 * @param chainId - Chain ID
 * @returns Approximate USD value
 */
export function getDeploymentFeeUSD(chainId: number): number {
  // Approximate USD values (update periodically)
  const usdValues: Record<number, number> = {
    1: 80, 8453: 80, 42161: 80, 10: 80,  // ETH chains
    56: 82.5,                             // BSC
    137: 80,                              // Polygon
    43114: 80,                            // Avalanche
    250: 75,                              // Fantom/Sonic
    // Testnets
    11155111: 4, 84532: 4, 421614: 4, 11155420: 4, 80002: 0.2,
  }
  return usdValues[chainId] || 80 // Default $80
}
