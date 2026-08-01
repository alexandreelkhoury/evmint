/**
 * Blog metadata — everything the list views need, and nothing they do not.
 *
 * Post bodies are NOT here. They live one file per slug under ./posts and are
 * fetched on demand by loadPostBody() in ./blogBody. That separation is the
 * whole point: the blog index renders 20 titles and excerpts, and it used to
 * ship ~7,500 words of article text (68 kB raw / 21 kB gzip) to do it.
 *
 * Importing this module pulls metadata only — 19 kB raw / 4 kB gzip.
 *
 *   list views  ->  this module (blogPostsMeta, getFeaturedPostMetas, …)
 *   article     ->  this module (getBlogPostMeta) + ./blogBody (loadPostBody)
 *
 * Never import a file under ./posts directly from a page: a static import puts
 * that body — and, once Rollup gives up on splitting them, all the others —
 * back into the page's chunk.
 */

export interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  updatedAt: string
  readTime: number
  category: string
  tags: string[]
  featured: boolean
  image: string
  seo: {
    title: string
    description: string
    keywords: string
  }
}

export const blogPostsMeta: BlogPostMeta[] = [
  {
    slug: "how-to-create-erc20-token-2026",
    title: "How to Create an ERC20 Token in 2026: Complete Guide",
    excerpt: "Learn how to create your own ERC20 token step-by-step in 2026. Covers smart contracts, deployment on Ethereum, Base, and other EVM chains, with no coding required.",
    author: {
      name: "EVMint Team",
      avatar: "ET",
      role: "Token Creation Experts"
    },
    publishedAt: "2026-01-15",
    updatedAt: "2026-01-31",
    readTime: 12,
    category: "Tutorials",
    tags: ["ERC20", "Token Creation", "Ethereum", "Smart Contracts", "DeFi"],
    featured: true,
    image: "/og-image.png",
    seo: {
      title: "How to Create an ERC20 Token in 2026 | Complete Guide | EVMint",
      description: "Step-by-step guide to creating ERC20 tokens in 2026. Learn token deployment on Ethereum, Base, Arbitrum & more. No coding required. Start in 5 seconds!",
      keywords: "create erc20 token, erc20 token tutorial, how to make cryptocurrency, ethereum token creation, token deployment guide 2026"
    }
  },
  {
    slug: "ethereum-vs-base-best-chain-token-deployment",
    title: "Ethereum vs Base: Best Chain for Token Deployment in 2026",
    excerpt: "Comprehensive comparison of Ethereum and Base for token deployment. Learn about gas fees, speed, ecosystem, and which chain is right for your project.",
    author: {
      name: "EVMint Team",
      avatar: "ET",
      role: "Multi-Chain Experts"
    },
    publishedAt: "2026-01-20",
    updatedAt: "2026-01-31",
    readTime: 10,
    category: "Guides",
    tags: ["Ethereum", "Base", "Layer 2", "Token Deployment", "Comparison"],
    featured: true,
    image: "/og-image.png",
    seo: {
      title: "Ethereum vs Base: Best Chain for Token Deployment 2026 | EVMint",
      description: "Compare Ethereum and Base for token deployment. Gas fees, speed, security, and ecosystem analysis. Find the best chain for your crypto project.",
      keywords: "ethereum vs base, layer 2 comparison, best blockchain for tokens, token deployment chain, base network, ethereum mainnet"
    }
  },
  {
    slug: "complete-meme-coin-launch-guide",
    title: "Complete Meme Coin Launch Guide: From Idea to Moon",
    excerpt: "Everything you need to know about launching a successful meme coin in 2026. Community building, tokenomics, marketing strategies, and common pitfalls to avoid.",
    author: {
      name: "EVMint Team",
      avatar: "ET",
      role: "Meme Coin Specialists"
    },
    publishedAt: "2026-01-22",
    updatedAt: "2026-01-31",
    readTime: 15,
    category: "Guides",
    tags: ["Meme Coins", "Community Building", "Marketing", "Token Launch", "Viral"],
    featured: true,
    image: "/og-image.png",
    seo: {
      title: "Complete Meme Coin Launch Guide 2026 | Create Viral Crypto | EVMint",
      description: "Learn how to launch a successful meme coin. Community building, tokenomics, marketing strategies, and step-by-step deployment guide. Create your meme token today!",
      keywords: "meme coin launch guide, create meme coin, viral cryptocurrency, dogecoin shiba pepe, meme token marketing, crypto community building"
    }
  },
  {
    slug: "adding-liquidity-uniswap-step-by-step",
    title: "Adding Liquidity to Uniswap: Complete Step-by-Step Guide",
    excerpt: "Learn how to add liquidity for your token on Uniswap V3. Covers pool creation, price ranges, fee tiers, and strategies for optimal liquidity provision.",
    author: {
      name: "EVMint Team",
      avatar: "ET",
      role: "DeFi Specialists"
    },
    publishedAt: "2026-01-25",
    updatedAt: "2026-01-31",
    readTime: 14,
    category: "Tutorials",
    tags: ["Uniswap", "Liquidity", "DeFi", "Trading Pairs", "AMM"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Add Liquidity on Uniswap V3 | Complete Guide 2026 | EVMint",
      description: "Step-by-step guide to adding liquidity on Uniswap V3. Learn pool creation, price ranges, fee tiers, and liquidity strategies. Make your token tradeable today!",
      keywords: "add liquidity uniswap, uniswap v3 guide, create liquidity pool, token trading pair, defi liquidity provision, uniswap tutorial"
    }
  },
  {
    slug: "multi-chain-token-strategy-2026",
    title: "Multi-Chain Token Strategy for 2026: Maximize Your Reach",
    excerpt: "Learn how to deploy tokens across multiple blockchains strategically. Covers chain selection, bridging, unified liquidity, and cross-chain marketing.",
    author: {
      name: "EVMint Team",
      avatar: "ET",
      role: "Multi-Chain Strategists"
    },
    publishedAt: "2026-01-28",
    updatedAt: "2026-01-31",
    readTime: 16,
    category: "Strategy",
    tags: ["Multi-Chain", "Cross-Chain", "Token Strategy", "Layer 2", "Expansion"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "Multi-Chain Token Strategy 2026 | Deploy Across Blockchains | EVMint",
      description: "Complete guide to multi-chain token deployment strategy. Learn chain selection, cross-chain liquidity, and how to maximize reach across EVM blockchains.",
      keywords: "multi-chain token strategy, cross-chain deployment, token expansion strategy, multiple blockchain launch, layer 2 token strategy"
    }
  },
  {
    slug: "how-to-create-token-on-base",
    title: "How to Create a Token on Base: Step-by-Step Guide",
    excerpt: "Deploy an ERC20 token on Base (Coinbase's Layer 2) in under 60 seconds. No Solidity, no CLI — just connect your wallet and go.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-27",
    readTime: 5,
    category: "Guides",
    tags: ["Base", "ERC20", "Layer 2", "Coinbase", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Base | Deploy ERC20 in 60 Seconds | EVMint",
      description: "Step-by-step guide to creating an ERC20 token on Base (Coinbase L2). No coding required, ~$80 fee, auto-verified on Basescan. Deploy in under 60 seconds with EVMint.",
      keywords: "create token on base, base token creator, deploy erc20 base, base blockchain token, coinbase l2 token, base chain token creation"
    }
  },
  {
    slug: "how-to-create-token-on-arbitrum",
    title: "How to Create a Token on Arbitrum: Complete Guide",
    excerpt: "Launch an ERC20 token on Arbitrum One with low fees and instant verification on Arbiscan. No coding required.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-18",
    updatedAt: "2026-07-27",
    readTime: 4,
    category: "Guides",
    tags: ["Arbitrum", "ERC20", "Layer 2", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Arbitrum | Deploy ERC20 | EVMint",
      description: "Create an ERC20 token on Arbitrum One in under 60 seconds. Low fees, auto-verified on Arbiscan, no coding required. Step-by-step guide with EVMint.",
      keywords: "create token on arbitrum, arbitrum token creator, deploy erc20 arbitrum, arbitrum one token, arbiscan verified token"
    }
  },
  {
    slug: "how-to-create-token-on-robinhood-chain",
    title: "How to Create a Token on Robinhood Chain: First Look",
    excerpt: "Robinhood Chain is the hottest new L2. Learn how to deploy an ERC20 token with auto-verification on Blockscout.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-27",
    readTime: 4,
    category: "Guides",
    tags: ["Robinhood Chain", "ERC20", "Layer 2", "Blockscout", "token creation", "trending"],
    featured: true,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Robinhood Chain | Deploy ERC20 | EVMint",
      description: "Deploy an ERC20 token on Robinhood Chain (Arbitrum Orbit L2) in 60 seconds. Auto-verified on Blockscout, ~$80 fee, no coding. The hottest chain for token launches in 2026.",
      keywords: "create token on robinhood chain, robinhood chain token, robinhood blockchain token creator, deploy erc20 robinhood, robinhood orbit l2"
    }
  },
  {
    slug: "how-to-create-token-on-polygon",
    title: "How to Create a Token on Polygon: Low-Cost Deployment Guide",
    excerpt: "Deploy tokens on Polygon with gas fees under $0.01. Use QuickSwap or SushiSwap for instant liquidity.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-22",
    updatedAt: "2026-07-27",
    readTime: 3,
    category: "Guides",
    tags: ["Polygon", "ERC20", "sidechain", "QuickSwap", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Polygon | Low-Cost ERC20 Deployment | EVMint",
      description: "Create an ERC20 token on Polygon with near-zero gas fees. Auto-verified on Polygonscan, QuickSwap liquidity, ~$80 deployment. No coding needed.",
      keywords: "create token on polygon, polygon token creator, deploy erc20 polygon, matic token creation, quickswap token listing"
    }
  },
  {
    slug: "how-to-create-token-on-bsc",
    title: "How to Create a Token on BSC (BNB Smart Chain)",
    excerpt: "Launch a BEP-20 token on BNB Smart Chain and list it on PancakeSwap. Step-by-step guide.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-24",
    updatedAt: "2026-07-27",
    readTime: 3,
    category: "Guides",
    tags: ["BSC", "BNB", "BEP-20", "PancakeSwap", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on BSC | BNB Smart Chain BEP-20 Guide | EVMint",
      description: "Create a BEP-20 token on BNB Smart Chain and list it on PancakeSwap. 0.075 BNB fee, auto-verified on BscScan, no coding required.",
      keywords: "create token on bsc, bnb smart chain token, bep20 token creator, pancakeswap token listing, bsc token deployment"
    }
  },
  {
    slug: "how-to-create-token-on-ethereum",
    title: "How to Create a Token on Ethereum Mainnet",
    excerpt: "Deploy on the original EVM chain — maximum security, deepest liquidity, highest prestige. Here's how.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-10",
    updatedAt: "2026-07-27",
    readTime: 4,
    category: "Guides",
    tags: ["Ethereum", "ERC20", "Layer 1", "Uniswap", "mainnet", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Ethereum Mainnet | ERC20 Guide | EVMint",
      description: "Deploy an ERC20 token on Ethereum mainnet. Auto-verified on Etherscan, Uniswap V2 liquidity, ~$80 + gas. The definitive guide for serious token projects.",
      keywords: "create token on ethereum, ethereum token creator, deploy erc20 ethereum mainnet, etherscan verified token, ethereum token deployment"
    }
  },
  {
    slug: "how-to-create-token-on-optimism",
    title: "How to Create a Token on Optimism",
    excerpt: "Deploy an ERC20 token on Optimism with low fees and fast finality. Auto-verified on Optimistic Etherscan.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-25",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Optimism", "ERC20", "Layer 2", "OP Stack", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Optimism | ERC20 Guide | EVMint",
      description: "Deploy an ERC20 token on Optimism L2 in 60 seconds. Low fees, auto-verified on Optimistic Etherscan, Uniswap V2 liquidity. No coding required.",
      keywords: "create token on optimism, optimism token creator, deploy erc20 optimism, op stack token, optimism token deployment"
    }
  },
  {
    slug: "how-to-create-token-on-monad",
    title: "How to Create a Token on Monad",
    excerpt: "Deploy on Monad — the high-performance EVM L1 with 10,000 TPS. Sub-second finality, ultra-low fees.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-26",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Monad", "ERC20", "Layer 1", "high performance", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Monad | High-Performance EVM L1 | EVMint",
      description: "Deploy an ERC20 token on Monad (10,000 TPS EVM L1). Sub-second finality, ~$80 fee, auto-verified on MonadScan. No coding required.",
      keywords: "create token on monad, monad token creator, deploy erc20 monad, monad blockchain token, high performance evm token"
    }
  },
  {
    slug: "how-to-create-token-on-megaeth",
    title: "How to Create a Token on MegaETH",
    excerpt: "Deploy on MegaETH — the real-time Ethereum L2 with 100,000 TPS and sub-10ms block times.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-27",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["MegaETH", "ERC20", "Layer 2", "real-time", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on MegaETH | Real-Time L2 | EVMint",
      description: "Deploy an ERC20 token on MegaETH (100,000 TPS L2). Sub-10ms blocks, ~$80 fee, auto-verified on MegaScan. No coding needed.",
      keywords: "create token on megaeth, megaeth token creator, deploy erc20 megaeth, real-time blockchain token, megaeth deployment"
    }
  },
  {
    slug: "how-to-create-token-on-avalanche",
    title: "How to Create a Token on Avalanche",
    excerpt: "Deploy on Avalanche C-Chain with fast finality and Trader Joe DEX integration.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-28",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Avalanche", "ERC20", "Layer 1", "Trader Joe", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Avalanche | C-Chain ERC20 Guide | EVMint",
      description: "Deploy an ERC20 token on Avalanche C-Chain. Fast finality, Trader Joe liquidity, 4 AVAX fee (~$80). Auto-verified on Snowtrace.",
      keywords: "create token on avalanche, avalanche token creator, deploy erc20 avalanche, avax token deployment, trader joe token"
    }
  },
  {
    slug: "how-to-create-token-on-fantom",
    title: "How to Create a Token on Fantom",
    excerpt: "Deploy on Fantom Opera with SpookySwap DEX integration and ultra-low gas.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-28",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Fantom", "ERC20", "Layer 1", "SpookySwap", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Fantom | SpookySwap Guide | EVMint",
      description: "Deploy an ERC20 token on Fantom Opera. Ultra-low gas, SpookySwap liquidity, 500 FTM fee (~$75). Auto-verified on FTMScan.",
      keywords: "create token on fantom, fantom token creator, deploy erc20 fantom, ftm token deployment, spookyswap token"
    }
  },
  {
    slug: "how-to-create-token-on-blast",
    title: "How to Create a Token on Blast",
    excerpt: "Deploy on Blast — the yield-generating L2 with native ETH staking rewards.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-29",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Blast", "ERC20", "Layer 2", "yield", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Blast | Yield-Generating L2 | EVMint",
      description: "Deploy an ERC20 token on Blast L2. Native ETH yield, low fees, 0.02 ETH (~$80). Auto-verified on Blastscan.",
      keywords: "create token on blast, blast token creator, deploy erc20 blast, blast l2 token, blast blockchain deployment"
    }
  },
  {
    slug: "how-to-create-token-on-gnosis",
    title: "How to Create a Token on Gnosis Chain",
    excerpt: "Deploy on Gnosis (xDAI) — stable gas fees paid in DAI, with SushiSwap liquidity.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-29",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Gnosis", "xDAI", "ERC20", "sidechain", "SushiSwap", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Gnosis Chain | Stable Gas Fees | EVMint",
      description: "Deploy an ERC20 token on Gnosis Chain (xDAI). Stable gas fees, SushiSwap liquidity, 80 xDAI (~$80). Auto-verified on Gnosisscan.",
      keywords: "create token on gnosis, gnosis chain token, deploy erc20 gnosis, xdai token creator, gnosis deployment"
    }
  },
  {
    slug: "how-to-create-token-on-moonbeam",
    title: "How to Create a Token on Moonbeam",
    excerpt: "Deploy on Moonbeam — the Polkadot parachain with full EVM compatibility and cross-chain bridges.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-30",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["Moonbeam", "ERC20", "parachain", "Polkadot", "SushiSwap", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on Moonbeam | Polkadot EVM | EVMint",
      description: "Deploy an ERC20 token on Moonbeam (Polkadot parachain). Cross-chain bridges, SushiSwap liquidity, 450 GLMR (~$81). Auto-verified on Moonscan.",
      keywords: "create token on moonbeam, moonbeam token creator, deploy erc20 moonbeam, polkadot evm token, moonbeam deployment"
    }
  },
  {
    slug: "how-to-create-token-on-world-chain",
    title: "How to Create a Token on World Chain",
    excerpt: "Deploy on World Chain — the L2 built for World ID and human-verified communities.",
    author: { name: "EVMint", avatar: "/logo-icon.svg", role: "Platform" },
    publishedAt: "2026-07-30",
    updatedAt: "2026-08-01",
    readTime: 3,
    category: "Guides",
    tags: ["World Chain", "ERC20", "Layer 2", "World ID", "token creation"],
    featured: false,
    image: "/og-image.png",
    seo: {
      title: "How to Create a Token on World Chain | World ID L2 | EVMint",
      description: "Deploy an ERC20 token on World Chain. Human-verified community, Uniswap V2, 0.02 ETH (~$80). Auto-verified on WorldScan.",
      keywords: "create token on world chain, world chain token, deploy erc20 world chain, worldcoin l2 token, world chain deployment"
    }
  }
]

export function getBlogPostMeta(slug: string): BlogPostMeta | undefined {
  return blogPostsMeta.find(post => post.slug === slug)
}

export function getFeaturedPostMetas(): BlogPostMeta[] {
  return blogPostsMeta.filter(post => post.featured)
}

export function getPostMetasByCategory(category: string): BlogPostMeta[] {
  return blogPostsMeta.filter(post => post.category === category)
}

export function getRelatedPostMetas(currentSlug: string, limit: number = 3): BlogPostMeta[] {
  const currentPost = getBlogPostMeta(currentSlug)
  if (!currentPost) return []

  return blogPostsMeta
    .filter(post => post.slug !== currentSlug)
    .filter(post =>
      post.tags.some(tag => currentPost.tags.includes(tag)) ||
      post.category === currentPost.category
    )
    .slice(0, limit)
}
