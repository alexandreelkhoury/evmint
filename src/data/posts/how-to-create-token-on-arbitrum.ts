/**
 * Body of the "how-to-create-token-on-arbitrum" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Arbitrum

Arbitrum One is the largest Ethereum Layer 2 by TVL, processing over $10B in DeFi activity. It uses optimistic rollups to offer Ethereum-level security with dramatically lower gas fees.

## Why Arbitrum?

- **Highest TVL of any L2**: More liquidity means more trading opportunities for your token
- **Ethereum security**: Inherits Ethereum's validator set for settlement
- **Mature DeFi**: Uniswap, GMX, Aave, Camelot, and hundreds more
- **Low fees**: Token deployment gas is typically under $2

## Deploy on Arbitrum with EVMint

1. **Visit evmint.io/create** and connect your wallet
2. **Switch to Arbitrum One** (chain ID 42161) in the network selector
3. **Enter token details**: name, symbol, and total supply
4. **Click "Create Token"** — approve the transaction (~0.02 ETH fee)
5. **Done** — your token is live and verified on Arbiscan within seconds

## Adding Liquidity

After deployment, go to the EVMint Liquidity page to create a Uniswap V2 pool. Pair your token with ETH (WETH on Arbitrum) to enable trading.

Alternatively, you can use Camelot DEX or SushiSwap — both have active trading on Arbitrum.

## Costs

- Deployment fee: 0.02 ETH (~$80)
- Gas for adding liquidity: typically $0.50-2
- No ongoing fees

## Key Resources

- Arbiscan: arbiscan.io — verify your contract and track transactions
- Arbitrum Bridge: bridge.arbitrum.io — move ETH from Ethereum to Arbitrum
- Uniswap on Arbitrum: app.uniswap.org — add liquidity and trade
`

export default body
