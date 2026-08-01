/**
 * Body of the "how-to-create-token-on-optimism" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Optimism

Optimism is an Ethereum Layer 2 using optimistic rollups. It offers low fees, fast transactions, and full EVM compatibility. The Optimism ecosystem includes Uniswap, Aave, Velodrome, and hundreds of DeFi protocols.

## Why Optimism?

- **OP Stack**: The same technology powering Base, World Chain, and other L2s
- **Retroactive Public Goods Funding**: Unique grants program for builders
- **Low fees**: Token deployment gas under $2
- **Strong DeFi**: Uniswap V2, Velodrome, and more

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **Optimism** (chain ID 10)
3. Enter token name, symbol, and supply
4. Click **Create Token** — fee is 0.02 ETH (~$80)
5. Contract auto-verifies on Optimistic Etherscan

## Adding Liquidity

EVMint routes to Uniswap V2 on Optimism for pool creation. Pair your token with WETH to enable trading.

## Resources

- Explorer: optimistic.etherscan.io
- Bridge: app.optimism.io/bridge
`

export default body
