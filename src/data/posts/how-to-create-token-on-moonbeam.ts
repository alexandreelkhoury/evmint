/**
 * Body of the "how-to-create-token-on-moonbeam" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Moonbeam

Moonbeam is a Polkadot parachain with full Ethereum compatibility. It bridges the Polkadot and Ethereum ecosystems, giving your token access to both.

## Why Moonbeam?

- **Polkadot + Ethereum**: Access both ecosystems
- **Cross-chain bridges**: Built-in interoperability via XCM
- **SushiSwap**: Active V2 DEX
- **EVM compatible**: Standard Solidity, MetaMask, same tools

## Deploy with EVMint

1. Visit **evmint.io/create** and connect your wallet
2. Switch to **Moonbeam** (chain ID 1284)
3. Enter token details and click **Create Token**
4. Fee: 450 GLMR (~$81), auto-verified on Moonscan

## Resources

- Explorer: moonscan.io
- Bridge: apps.moonbeam.network
- DEX: SushiSwap on Moonbeam
`

export default body
