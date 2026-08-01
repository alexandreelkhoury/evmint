/**
 * Body of the "how-to-create-token-on-avalanche" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Avalanche

Avalanche's C-Chain is an EVM-compatible blockchain known for fast finality (~1 second) and a strong DeFi ecosystem led by Trader Joe.

## Why Avalanche?

- **Fast finality**: ~1 second confirmation
- **Trader Joe**: The leading DEX on Avalanche
- **Subnet architecture**: Scalable and flexible
- **Established ecosystem**: Aave, GMX, and hundreds of protocols

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **Avalanche** (chain ID 43114)
3. Enter token details and click **Create Token**
4. Fee: 4 AVAX (~$80), auto-verified on Snowtrace

## Liquidity

EVMint routes to Trader Joe (V2-style router) for pool creation on Avalanche.

## Resources

- Explorer: snowtrace.io
- Bridge: core.app/bridge
`

export default body
