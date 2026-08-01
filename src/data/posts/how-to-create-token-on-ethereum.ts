/**
 * Body of the "how-to-create-token-on-ethereum" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Ethereum Mainnet

Ethereum is the original smart contract platform and still the gold standard for serious token projects. While gas fees are higher than Layer 2s, Ethereum offers unmatched security, liquidity, and credibility.

## Why Ethereum Mainnet?

- **Maximum security**: Secured by hundreds of thousands of validators
- **Deepest liquidity**: More DEX volume than all L2s combined
- **Institutional trust**: The chain that institutions recognize
- **DeFi capital**: Uniswap, Aave, Maker, Compound — all started here

## When to Choose Ethereum vs Layer 2

Choose Ethereum mainnet when:
- Your project targets institutional or serious DeFi users
- You need the credibility of an Etherscan-verified contract
- You're building a governance or utility token (not a meme coin)
- You plan to integrate with established Ethereum DeFi protocols

Choose a Layer 2 when:
- You want lower deployment costs
- You're launching a meme coin or community token
- Speed of deployment matters more than prestige
- Your audience is already on L2

## Deploy on Ethereum with EVMint

1. **Visit evmint.io/create** and connect your wallet
2. **Select Ethereum** (chain ID 1)
3. **Enter token details** and click "Create Token"
4. **Fee**: 0.02 ETH (~$80) plus gas (~$5-75 depending on network congestion)

Note: Ethereum gas varies significantly. Check current gas prices at etherscan.io/gastracker before deploying. Off-peak hours (weekends, early mornings UTC) typically have the lowest gas.

## Verification

Your contract is automatically verified on Etherscan via the Etherscan V2 unified API. No manual steps needed — the source code, compiler settings, and constructor arguments are submitted immediately after deployment.

## Liquidity on Uniswap

Ethereum has the most liquid Uniswap V2 deployment. After creating your token, use EVMint's liquidity page to pair it with WETH and create a trading pool.
`

export default body
