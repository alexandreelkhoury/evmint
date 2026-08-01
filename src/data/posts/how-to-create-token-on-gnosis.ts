/**
 * Body of the "how-to-create-token-on-gnosis" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Gnosis Chain

Gnosis Chain (formerly xDAI) is unique because gas fees are paid in xDAI (a stablecoin pegged to $1). This means predictable, stable costs regardless of crypto market volatility.

## Why Gnosis?

- **Stable gas fees**: Pay in xDAI ($1-pegged), no ETH price volatility
- **Cheap transactions**: Fractions of a cent
- **SushiSwap**: Active V2 DEX for liquidity
- **Community-focused**: Strong governance and community

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **Gnosis** (chain ID 100)
3. Enter token details and click **Create Token**
4. Fee: 80 xDAI (~$80), auto-verified on Gnosisscan

## Resources

- Explorer: gnosisscan.io
- Bridge: bridge.gnosischain.com
- DEX: SushiSwap on Gnosis
`

export default body
