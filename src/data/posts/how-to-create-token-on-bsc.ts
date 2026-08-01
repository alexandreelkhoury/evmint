/**
 * Body of the "how-to-create-token-on-bsc" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on BNB Smart Chain

BNB Smart Chain (BSC) remains one of the most popular chains for token launches, especially in Asia and emerging markets. It uses BNB as the gas token and has deep liquidity through PancakeSwap.

## Why BSC?

- **High trading volume**: PancakeSwap is the 2nd largest DEX by volume
- **Low fees**: Token deployment gas is under $5
- **Large user base**: Binance funnels millions of users to BSC
- **BEP-20 = ERC20**: Same standard, same tooling, just a different chain

## Deploy on BSC with EVMint

1. **Go to evmint.io/create** and connect your wallet
2. **Switch to BSC** (chain ID 56)
3. **Enter your token details** — name, symbol, total supply
4. **Deploy** — fee is 0.075 BNB (~$80), auto-verified on BscScan

## Adding Liquidity on PancakeSwap

EVMint routes liquidity operations through PancakeSwap's V2 router on BSC. After deployment:
1. Go to the EVMint Liquidity page
2. Select your token and pair it with BNB (WBNB)
3. Set your initial liquidity amounts
4. Approve and add — your token is now tradeable on PancakeSwap

## Cost Breakdown

- Deployment fee: 0.075 BNB (~$80)
- PancakeSwap liquidity creation: ~$1-3 in gas
- No monthly fees
`

export default body
