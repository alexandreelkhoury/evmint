/**
 * Body of the "how-to-create-token-on-robinhood-chain" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Robinhood Chain

Robinhood Chain launched on July 1, 2026 as an Arbitrum Orbit L2 with ETH as the gas token. It's quickly become one of the most active chains for token launches, with built-in access to Robinhood's retail user base.

## Why Robinhood Chain?

- **Massive retail audience**: Robinhood has 20M+ active users
- **ETH as gas**: No new token to buy — use the ETH you already have
- **Arbitrum Orbit**: Inherits Arbitrum's security and EVM compatibility
- **Low fees**: Sub-cent gas for most transactions
- **Growing DEX ecosystem**: Uniswap V2 is live with active trading

## Deploy on Robinhood Chain with EVMint

EVMint was one of the first token launchers to support Robinhood Chain. Here's how:

1. **Go to evmint.io/create** and connect your wallet
2. **Select Robinhood Chain** (chain ID 4663) — look for the 🔥 trending indicator
3. **Enter your token details**: name, symbol, supply
4. **Deploy** — 0.02 ETH fee (~$80), auto-verified on Blockscout

## Verification on Blockscout

Unlike most chains that use Etherscan, Robinhood Chain uses Blockscout as its block explorer (robinhoodchain.blockscout.com). EVMint handles this automatically — your contract source code is verified via Blockscout's Etherscan-compatible API without any manual steps.

## Adding Liquidity

Robinhood Chain has a live Uniswap V2 deployment:
- **Factory**: 0x8bcEaA40B9AcdfAedF85AdF4FF01F5Ad6517937f
- **Router**: 0x89e5DB8B5aA49aA85AC63f691524311AEB649eba

Use EVMint's built-in liquidity page to create a pool and pair your token with WETH.

## Key Addresses

- **WETH**: 0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73
- **Multicall3**: 0xcA11bde05977b3631167028862bE2a173976CA11
- **Explorer**: robinhoodchain.blockscout.com

## Testnet

Want to test first? Use Robinhood Chain Testnet (chain ID 46630) with the RPC at rpc.testnet.chain.robinhood.com.
`

export default body
