/**
 * Body of the "how-to-create-token-on-monad" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Monad

Monad is a high-performance Layer 1 blockchain with 10,000 TPS and sub-second finality. It's fully EVM-compatible, meaning all Ethereum tools (MetaMask, Solidity, etc.) work natively.

## Why Monad?

- **10,000 TPS**: One of the fastest EVM chains
- **Sub-second finality**: Transactions confirm almost instantly
- **EVM compatible**: Use MetaMask, deploy Solidity contracts, same tools
- **Growing ecosystem**: Early mover advantage for token creators

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **Monad** (chain ID 143)
3. Enter token details and click **Create Token**
4. Fee: 0.1 MON (~$80), auto-verified on MonadScan

## Liquidity

Monad has active Uniswap V2 forks for liquidity. Use EVMint's liquidity page to create pools.

## Resources

- Explorer: monadscan.com
- RPC: rpc.monad.xyz
`

export default body
