/**
 * Body of the "how-to-create-token-on-megaeth" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on MegaETH

MegaETH is a real-time Ethereum Layer 2 with 100,000 TPS and sub-10ms block times. Backed by Paradigm and Vitalik Buterin, it launched in February 2026.

## Why MegaETH?

- **100,000 TPS**: The fastest EVM L2
- **Sub-10ms blocks**: Near-instant confirmation
- **ETH gas**: Use ETH you already have
- **Growing DEX ecosystem**: Kumbaya, GTE, and more

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **MegaETH** (chain ID 4326)
3. Enter token details and click **Create Token**
4. Fee: 0.02 ETH (~$80), auto-verified on MegaScan

## Note on Liquidity

MegaETH currently has V3-only DEXes (Kumbaya). EVMint's built-in liquidity feature requires V2 routers, so liquidity must be added directly on Kumbaya or GTE for now.

## Resources

- Explorer: mega.etherscan.io
- RPC: carrot.megaeth.com/rpc
`

export default body
