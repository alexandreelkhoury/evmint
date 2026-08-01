/**
 * Body of the "how-to-create-token-on-base" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# How to Create a Token on Base

Base is Coinbase's Layer 2 network built on the OP Stack. It offers sub-cent gas fees, fast finality, and access to Coinbase's massive user base. For token creators, Base is one of the best chains to launch on in 2026.

## Why Base?

- **Ultra-low fees**: Token deployment costs under $1 in gas on Base
- **Coinbase ecosystem**: Direct access to Coinbase Wallet users
- **Growing DeFi**: Uniswap, Aave, and hundreds of protocols are live on Base
- **EVM compatible**: Standard Solidity tooling, MetaMask support, familiar stack

## Step-by-Step: Deploy on Base with EVMint

### 1. Go to evmint.io/create

Open the EVMint token creator. No account or sign-up needed.

### 2. Connect your wallet

Click "Connect Wallet" and choose MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet. Make sure you have some ETH on Base for the deployment fee (~0.02 ETH, roughly $80).

### 3. Select Base as your network

Use the network selector in the header to switch to Base (chain ID 8453). Your wallet will prompt you to add the network if you haven't already.

### 4. Configure your token

Fill in:
- **Token Name**: The full name (e.g., "My Project Token")
- **Symbol**: The ticker (e.g., "MPT")
- **Total Supply**: How many tokens to mint (e.g., 1,000,000)

### 5. Deploy

Click "Create Token." Approve the transaction in your wallet. In about 10-15 seconds:
- Your ERC20 contract deploys on Base
- Source code is auto-verified on Basescan
- You receive the full token supply in your wallet

### 6. Add liquidity (optional)

Navigate to the Liquidity page to create a trading pair on Uniswap V2. Pair your token with ETH so others can buy and sell.

## What You Get

- A standard ERC20 token on Base mainnet
- Verified source code on Basescan (basescan.org)
- Full ownership — the contract is yours, non-custodial
- Ready for Uniswap, SushiSwap, and other Base DEXes

## Costs

The deployment fee is 0.02 ETH (~$80) which covers the smart contract deployment, gas, and automatic Basescan verification. No monthly fees, no subscription.

## FAQ

**Can I create a meme coin on Base?**
Yes. EVMint deploys standard ERC20 tokens — you control the name, symbol, and supply. What you do with it (meme coin, utility token, governance token) is up to you.

**Is my token automatically listed on exchanges?**
No. You need to add liquidity on a DEX (like Uniswap on Base) for your token to be tradeable. EVMint includes a built-in liquidity management tool for this.

**Can I deploy on Base testnet first?**
Yes. Switch to Base Sepolia (chain ID 84532) in the network selector to test with free testnet ETH before deploying on mainnet.
`

export default body
