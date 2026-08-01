export const faqs = [
  {
    question: "How much does it cost to create an ERC20 token across different blockchains?",
    answer: "Token creation costs ~$80 USD equivalent on any chain, paid in native tokens (0.02 ETH on Ethereum/Base/Arbitrum/Optimism/Robinhood Chain/MegaETH, 0.075 BNB on BSC, 400 POL on Polygon, 4 AVAX on Avalanche, 500 FTM on Fantom, 80 xDAI on Gnosis, 450 GLMR on Moonbeam, 0.1 MON on Monad). This single fee covers deployment, gas, and auto-verification. No subscription or hidden charges.",
    relatedGuide: "create-base-token"
  },
  {
    question: "Which blockchain should I choose for token creation?",
    answer: "Choose based on your needs: Ethereum (largest ecosystem, highest prestige), Base (Coinbase ecosystem, low fees), Arbitrum (highest L2 TVL), Optimism (developer-friendly, OP Stack), Robinhood Chain (trending, massive retail audience), MegaETH (100,000 TPS, real-time), Monad (10,000 TPS, ultra-fast L1), BSC (PancakeSwap, high trading volume), Polygon (near-zero gas, QuickSwap), Avalanche (fast finality, Trader Joe), Blast (native ETH yield), World Chain (human-verified users), Fantom (ultra-cheap), Gnosis (stable xDAI gas fees), Moonbeam (Polkadot bridge). All 15+ chains are EVM-compatible and work with MetaMask.",
    relatedGuide: "create-base-token"
  },
  {
    question: "Can I create a token without coding experience?",
    answer: "Yes! Our no-code token launcher allows anyone to create ERC20 tokens without programming knowledge. Simply fill in your token details (name, symbol, supply), select your blockchain, pay the gas fee, and your token is deployed automatically within 5 seconds.",
    relatedGuide: "create-base-token"
  },
  {
    question: "How long does token deployment take?",
    answer: "Token deployment on EVM blockchains takes 5-15 seconds on average depending on the network. The process includes smart contract compilation, blockchain deployment, and automatic verification on block explorers. Your token becomes tradeable immediately after successful deployment.",
    relatedGuide: "create-base-token"
  },
  {
    question: "How to add liquidity for my tokens on DEXes?",
    answer: "Use EVMint's built-in liquidity page: select your token, pair it with the chain's native wrapped token (WETH, WBNB, etc.), and complete the two-step process (approve + add). This creates a Uniswap V2 trading pool. You earn a share of swap fees from every trade.",
    relatedGuide: "add-liquidity"
  },
  {
    question: "What ERC20 token standards work across EVM blockchains?",
    answer: "All EVM chains support standard ERC20 tokens including standard tokens, deflationary tokens, reflection tokens, governance tokens, and upgradeable proxies. All tokens are compatible with MetaMask, major wallets, and DeFi protocols across chains.",
    relatedGuide: "create-base-token"
  },
  {
    question: "Will my token be automatically listed on exchanges?",
    answer: "No, token creation doesn't include exchange listings. For DEX trading, add liquidity on chain-specific DEXes (Uniswap, SushiSwap, PancakeSwap, etc.). For CEX listings (Coinbase, Binance, OKX), submit applications separately. Most tokens start trading on DEXs first.",
    relatedGuide: "add-liquidity"
  },
  {
    question: "Can I create deflationary or burn tokens?",
    answer: "Yes! Create deflationary tokens with automatic burn mechanisms, reflection tokens that reward holders, or tokens with custom taxation on any EVM blockchain. Our advanced token templates support burn functions, fee redistribution, and tokenomics customization."
  },
  {
    question: "What happens if I lose my wallet private key?",
    answer: "Losing your private key means permanent loss of token admin access. Always backup seed phrases securely, use hardware wallets for valuable projects, and consider multi-signature wallets for team projects to prevent single points of failure.",
    relatedGuide: "token-security"
  },
  {
    question: "How to verify token contract on block explorers?",
    answer: "Verify your token contract by visiting your network's block explorer (Etherscan, Arbiscan, Polygonscan, etc.), clicking 'Contract' tab, selecting 'Verify and Publish', uploading your Solidity source code, and matching compilation settings. Verified contracts show green checkmarks and build user trust.",
    relatedGuide: "token-security"
  },
  {
    question: "What's the maximum token supply limit on EVM blockchains?",
    answer: "ERC20 tokens support up to 2^256-1 total supply (approximately 115 quattuordecillion tokens with 18 decimals). Most projects use 1 million to 1 trillion total supply for practical tokenomics and market psychology reasons.",
    relatedGuide: "create-base-token"
  },
  {
    question: "Can I burn tokens to reduce supply?",
    answer: "Yes! Implement token burning by sending tokens to the zero address (0x000...000) or create burn functions in your contract. Token burning permanently reduces circulating supply, potentially increasing token value through scarcity mechanics."
  },
  {
    question: "How to setup token presale or IDO launch?",
    answer: "Launch token presales using chain-specific platforms like Pinksale, DxSale, or custom presale contracts. Set presale price, duration, hard/soft caps, and vesting schedules. Ensure proper liquidity lock and tokenomics for successful launches."
  },
  {
    question: "What are gas fees across different blockchains?",
    answer: "Gas fees vary by chain: Layer 2s (Base, Arbitrum, Optimism) offer 90-95% savings vs Ethereum mainnet. Token transfers cost $0.001-0.01 on L2s, $1-5 on Ethereum. Token creation on EVMint costs ~$80 equivalent on any chain (one fee covers everything). Fees fluctuate with network congestion.",
    relatedGuide: "create-base-token"
  },
  {
    question: "How to create pausable tokens?",
    answer: "Create pausable tokens using OpenZeppelin's Pausable contract on any EVM chain. Add pause/unpause functions to halt all token transfers during emergencies, maintenance, or regulatory compliance. Only contract owners can trigger pause functionality."
  },
  {
    question: "Best multi-signature wallets for token management?",
    answer: "Use Gnosis Safe (most popular) or BitGo for multi-sig management across EVM chains. Multi-sig wallets require 2-of-3 or 3-of-5 signatures for token operations, preventing single points of failure and enhancing security.",
    relatedGuide: "token-security"
  },
  {
    question: "How to implement token vesting?",
    answer: "Implement token vesting using time-locked contracts that release tokens gradually (cliff vesting, linear vesting, or milestone-based). Popular solutions include TokenVest, Sablier streaming, or custom vesting smart contracts compatible across EVM chains."
  },
  {
    question: "How to add tokens to wallets like MetaMask?",
    answer: "Add tokens to MetaMask by switching to the correct network, clicking 'Import tokens', entering contract address, symbol, and decimals. Most wallets automatically display tokens after receiving transactions."
  },
  {
    question: "Can I create NFTs on EVM chains?",
    answer: "Yes! All EVM chains support ERC721 and ERC1155 NFT standards. L2 chains offer 90% lower minting costs vs Ethereum. Create NFT collections using OpenSea, Foundation, or custom contracts. Store metadata on IPFS for decentralized NFT data."
  },
  {
    question: "Which EVM chain is best for token creation?",
    answer: "Layer 2 chains (Arbitrum, Optimism, Base) and high-performance L1s like Monad offer faster transactions and 90% lower fees vs Ethereum mainnet. Ethereum has the largest ecosystem. BSC/Polygon offer wide adoption. Monad delivers 10,000 TPS with sub-second finality. Choose based on your priority: speed (Monad), cost (L2s), liquidity (Ethereum), or user base (BSC/Polygon).",
    relatedGuide: "create-base-token"
  },
  {
    question: "How do I bridge tokens between chains?",
    answer: "Bridge tokens between chains using official bridges (Arbitrum Bridge, Optimism Bridge, etc.) or third-party bridges (Hop, Stargate). The process involves locking tokens on the source chain and minting equivalent tokens on the destination chain."
  },
  {
    question: "Can I create governance tokens?",
    answer: "Yes! Governance tokens allow holders to vote on protocol decisions. You can create ERC20 tokens with additional governance functionality using standards like OpenZeppelin's Governor contracts."
  },
  {
    question: "What are the tax implications of creating tokens?",
    answer: "Tax implications vary by jurisdiction. Creating tokens might be considered taxable events in some regions. Consult with a tax professional familiar with cryptocurrency regulations in your area."
  },
  {
    question: "How do I market my newly created token?",
    answer: "Token marketing involves building community, creating social media presence, listing on tracking websites like CoinGecko, engaging with crypto influencers, and providing utility for your token."
  },
  {
    question: "Can I create staking functionality for my token?",
    answer: "Yes! Staking contracts can be created separately from your token contract. Users can stake your tokens to earn rewards, providing utility and encouraging long-term holding."
  },
  {
    question: "What is a token audit and do I need one?",
    answer: "A token audit is a security review of your smart contract code. While not required for basic tokens, audits are recommended for complex projects or those handling significant value to identify vulnerabilities.",
    relatedGuide: "token-security"
  },
  {
    question: "How do I handle token distribution?",
    answer: "Token distribution can be handled through airdrops, presales, initial DEX offerings (IDOs), or direct transfers. Plan your distribution strategy based on your project's goals and community building needs."
  },
  {
    question: "Can I create deflationary tokens?",
    answer: "Yes! Deflationary tokens automatically burn a percentage of tokens on each transaction, reducing total supply over time. This mechanism can create scarcity and potentially increase token value."
  },
  {
    question: "What wallets support EVM networks?",
    answer: "Major EVM-compatible wallets include MetaMask, Rainbow, Frame, Trust Wallet, and most Ethereum wallets. Users can add any EVM network by entering chain details (RPC, Chain ID) to access their tokens."
  },
  {
    question: "How do I add a custom logo to my token?",
    answer: "Add logos by: 1) Verifying your contract on block explorers, 2) Updating token information with logo upload (200x200px PNG recommended), 3) Submitting to chain-specific token lists with IPFS logo hash, 4) Adding to CoinMarketCap/CoinGecko after getting trading activity. Logos appear on explorers, wallets, and trading platforms."
  },
  {
    question: "How long does block explorer contract verification take?",
    answer: "Block explorer contract verification typically takes 5-30 minutes after submission. Ensure you use the correct compiler version (0.8.20), optimization settings (200 runs), and exact source code. Verified contracts get green checkmarks and enable logo uploads.",
    relatedGuide: "token-security"
  },
  {
    question: "What are the requirements for CoinMarketCap listing?",
    answer: "CoinMarketCap listing requires: verified smart contract on block explorer, active trading with sufficient volume ($10,000+ daily), complete project information, professional logo, active social media, and legitimate use case. Process takes 1-4 weeks after application."
  },
  {
    question: "How do I get my token logo on MetaMask automatically?",
    answer: "Token logos appear on MetaMask through token lists. Submit your token to chain-specific official token lists, community lists, and ensure your contract is verified on block explorers with logo uploaded. This enables automatic logo display for all users."
  },
  {
    question: "What's the difference between DEX and CEX listings?",
    answer: "DEX listings (Uniswap, SushiSwap) require adding liquidity pools - instant and permissionless. CEX listings (Binance, OKX, etc.) require applications, compliance checks, and fees ranging from $50,000-500,000. Most tokens start on DEXs first.",
    relatedGuide: "add-liquidity"
  }
]

export type FAQ = typeof faqs[0]