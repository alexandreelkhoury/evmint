/**
 * Body of the "how-to-create-token-on-world-chain" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on World Chain

World Chain is an Ethereum L2 built by the World (formerly Worldcoin) team. It integrates World ID for human verification and has Uniswap V2 for token trading.

## Why World Chain?

- **Human-verified users**: World ID integration reduces bots
- **Ethereum L2**: Low fees, fast transactions
- **ETH gas**: Use ETH you already have
- **Uniswap V2**: Active DEX for liquidity

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **World Chain** (chain ID 480)
3. Enter token details and click **Create Token**
4. Fee: 0.02 ETH (~$80), auto-verified on WorldScan

## Resources

- Explorer: worldscan.org
- Bridge: worldchain bridge via Alchemy
`

export default body
