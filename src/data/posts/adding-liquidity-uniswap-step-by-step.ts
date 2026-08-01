/**
 * Body of the "adding-liquidity-uniswap-step-by-step" post.
 *
 * Loaded on demand by loadPostBody() in ../blogMeta — never import this
 * statically from a page, or the whole blog ends up in that page's chunk.
 */
const body = `
# Adding Liquidity to Uniswap: The Definitive Guide

After deploying your token, the next crucial step is making it tradeable. Adding liquidity to a decentralized exchange (DEX) like Uniswap creates a market for your token, enabling anyone to buy or sell. This guide covers everything you need to know about providing liquidity on Uniswap V3.

## Understanding Liquidity Pools

### What is a Liquidity Pool?

A liquidity pool is a smart contract containing two tokens that enables trading. Instead of matching buyers with sellers (like a traditional order book), users trade against the pool.

**How it Works**:
1. Liquidity providers (LPs) deposit token pairs
2. Traders swap one token for another
3. LPs earn fees from each trade
4. Prices adjust based on supply/demand

### Uniswap V3 vs V2

**V2 (Classic)**:
- Liquidity spread across all prices
- Simpler to understand
- Less capital efficient

**V3 (Concentrated)**:
- Liquidity in specific price ranges
- Higher capital efficiency
- More complex management
- Higher potential returns

This guide focuses on Uniswap V3, the current standard.

## Prerequisites

Before adding liquidity, ensure you have:

1. **Your Token**: Deployed and verified on your chosen chain
2. **Paired Token**: ETH, USDC, or another token you'll pair with
3. **Wallet**: MetaMask or WalletConnect compatible wallet
4. **Both Tokens in Wallet**: You need both tokens to create a pool
5. **Gas Fees**: Extra native token for transaction costs

## Step-by-Step: Creating Your First Pool

### Step 1: Navigate to Uniswap

Go to [app.uniswap.org](https://app.uniswap.org) and connect your wallet.

**Important**: Ensure you're on the correct network:
- Ethereum Mainnet for ETH tokens
- Base for Base tokens
- Arbitrum for Arbitrum tokens

### Step 2: Access Pool Creation

1. Click "Pool" in the navigation
2. Select "New Position"
3. You'll see the pool creation interface

### Step 3: Select Token Pair

**First Token**: Usually ETH or USDC (established liquidity)
**Second Token**: Your deployed token

**To Add Your Token**:
1. Paste your token contract address
2. Click "Import" when prompted
3. Confirm the token details are correct

### Step 4: Choose Fee Tier

Uniswap V3 offers multiple fee tiers:

**0.01% (Most Stable)**
- Best for stable pairs (USDC/USDT)
- Rarely used for new tokens

**0.05% (Stable)**
- Moderately stable pairs
- Low volatility tokens

**0.30% (Standard)**
- Most common for new tokens
- Good balance of fees and volume
- **Recommended for most launches**

**1.00% (Exotic)**
- High volatility pairs
- Low liquidity tokens
- Consider for very new tokens

### Step 5: Set Initial Price

This is crucial - you're determining your token's starting value.

**Calculation Example**:
If you want 1 TOKEN = $0.001 and ETH = $3,000:
- 1 TOKEN = 0.000000333 ETH
- Price ratio: 3,000,000 TOKEN per ETH

**Tips**:
- Consider your total supply
- Plan for price appreciation room
- Look at comparable tokens
- Use realistic market cap targets

### Step 6: Set Price Range

In V3, you specify where your liquidity is active.

**Full Range (Safest for New Tokens)**:
- Set minimum price to near 0
- Set maximum price very high
- Less capital efficient but always active

**Concentrated Range (Advanced)**:
- Higher fees earned when in range
- Risk of price moving out of range
- Requires active management

**Recommendation for New Tokens**:
Start with full range to ensure liquidity at any price.

### Step 7: Deposit Tokens

Enter the amount of each token:
- Equal value of both tokens required
- Interface shows real-time ratio
- Double-check amounts before confirming

**Common Liquidity Amounts**:
- Minimum viable: $1,000-5,000
- Standard launch: $5,000-20,000
- Strong launch: $20,000-100,000
- Major launch: $100,000+

### Step 8: Approve and Add

1. **Approve Token**: First transaction approves Uniswap to use your tokens
2. **Add Liquidity**: Second transaction creates the pool
3. **Receive NFT**: You get an NFT representing your LP position

## Post-Liquidity Steps

### Verify Your Pool

After adding liquidity:

1. **Check DEXScreener**: Your pair should appear within minutes
2. **Test a Small Trade**: Swap a tiny amount to verify it works
3. **Share the Trade Link**: Distribute to your community

### Lock Your Liquidity

Locking LP tokens builds trust:

**Popular Locking Platforms**:
- Unicrypt
- Team Finance (formerly TrustSwap)
- PinkLock

**Lock Duration Recommendations**:
- Minimum: 3 months
- Standard: 6-12 months
- Best: Permanent burn or multi-year lock

### Monitor Your Position

Track your LP position health:

**Key Metrics**:
- Fees earned
- Position value
- Price range status (in/out of range)
- Impermanent loss

**Tools**:
- Uniswap interface
- Revert Finance
- APY.vision

## Advanced Strategies

### Multi-Pool Strategy

Create multiple pools for better liquidity:

1. **Primary Pool**: TOKEN/ETH (main trading pair)
2. **Stable Pool**: TOKEN/USDC (stable pricing)
3. **Cross-Chain**: Same token on multiple chains

### Dynamic Range Management

For active LP management:

1. Monitor price movements
2. Adjust range as needed
3. Collect fees regularly
4. Rebalance positions

### Fee Reinvestment

Maximize returns by:
1. Collect earned fees periodically
2. Add fees back to position
3. Compound your liquidity over time

## Common Issues and Solutions

### "Insufficient Liquidity"

**Cause**: Not enough tokens in pool for desired trade
**Solution**: Add more liquidity or trade smaller amounts

### "Price Impact Too High"

**Cause**: Trade size too large relative to liquidity
**Solution**: Add more liquidity or reduce trade size

### "Pair Not Found"

**Cause**: Pool doesn't exist or wrong network
**Solution**: Create pool or switch networks

### "Out of Range"

**Cause**: Price moved outside your LP range
**Solution**: Create new position or wait for price return

## Using EVMint's Liquidity Tools

EVMint simplifies liquidity management:

1. **Integrated Interface**: Add liquidity without leaving the platform
2. **Optimal Settings**: Pre-configured for new token launches
3. **Multiple DEXs**: Support for Uniswap, SushiSwap, and more
4. **Multi-Chain**: Works on all supported networks

## Conclusion

Adding liquidity is essential for token success. With Uniswap V3's concentrated liquidity, you have powerful tools to create efficient markets for your token. Start with conservative settings (full range, 0.30% fee), lock your liquidity, and actively monitor your position.

**Quick Checklist**:
- [ ] Token deployed and verified
- [ ] Both tokens in wallet
- [ ] Sufficient gas for transactions
- [ ] 0.30% fee tier selected
- [ ] Full price range set
- [ ] Adequate liquidity amount
- [ ] LP tokens locked
- [ ] Pool verified on DEXScreener

Ready to add liquidity? [Launch your token on EVMint](/create) and use our integrated liquidity tools to get trading live in minutes!
    `

export default body
