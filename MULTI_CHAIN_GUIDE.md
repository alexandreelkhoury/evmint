# 🌍 Multi-Chain EVM Support Guide

Your token launcher now supports **ALL EVM-compatible blockchains**! This guide explains how to use the multi-chain features and deploy tokens across different networks.

---

## 📋 Table of Contents

1. [Supported Chains](#supported-chains)
2. [Quick Start](#quick-start)
3. [Switching Chains](#switching-chains)
4. [DEX Availability](#dex-availability)
5. [Chain-Specific Features](#chain-specific-features)
6. [Adding New Chains](#adding-new-chains)
7. [Troubleshooting](#troubleshooting)

---

## 🔗 Supported Chains

### Mainnets (Production)

| Chain | Chain ID | DEX Support | Gas Token | Best For |
|-------|----------|-------------|-----------|----------|
| **Ethereum** | 1 | Uniswap V2/V3 + SushiSwap | ETH | Maximum liquidity, highest fees |
| **Base** | 8453 | Uniswap V2/V3 + SushiSwap | ETH | Low fees, fast, great UX ⭐ |
| **Arbitrum** | 42161 | Uniswap V2/V3 + SushiSwap | ETH | Low fees, high liquidity |
| **Optimism** | 10 | Uniswap V3 | ETH | Low fees, Ethereum security |
| **Polygon** | 137 | Uniswap V3 + QuickSwap + SushiSwap | MATIC | Very low fees |
| **BSC** | 56 | PancakeSwap | BNB | Low fees, high speed |
| **Avalanche** | 43114 | Trader Joe | AVAX | Fast finality |
| **Fantom** | 250 | SpookySwap | FTM | Ultra-low fees |

### Testnets (Development)

| Chain | Chain ID | DEX Support | Faucet |
|-------|----------|-------------|--------|
| **Sepolia** | 11155111 | Uniswap V2 | [sepolia-faucet](https://sepoliafaucet.com/) |
| **Base Sepolia** | 84532 | ❌ None | [base-faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) |
| **Arbitrum Sepolia** | 421614 | ❌ None | [arbitrum-faucet](https://faucet.quicknode.com/arbitrum/sepolia) |
| **Optimism Sepolia** | 11155420 | ❌ None | [optimism-faucet](https://app.optimism.io/faucet) |
| **Polygon Amoy** | 80002 | ❌ None | [polygon-faucet](https://faucet.polygon.technology/) |

> **💡 Tip**: Most testnets don't have DEX deployments. Use testnets for token creation testing, then deploy on mainnet for liquidity features.

---

## 🚀 Quick Start

### 1. Connect Your Wallet

1. Click **"Connect Wallet"** in the header
2. Choose your preferred wallet (MetaMask, Coinbase Wallet, WalletConnect, etc.)
3. Approve the connection

### 2. Select Your Chain

1. Click the **Chain Selector** button in the header (shows current chain icon + name)
2. A modal will open showing all supported chains
3. Use the **Search** box to find specific chains
4. Filter by **Mainnet** or **Testnet** tabs
5. Click any chain card to switch instantly

### 3. Deploy Your Token

1. Navigate to **"Create Token"** page
2. The current chain is displayed under the form title
3. Fill in token details (Name, Symbol, Supply, Decimals)
4. Click **"Create Token"**
5. Approve the transaction in your wallet
6. Wait for deployment confirmation

### 4. Add Liquidity (If DEX Available)

1. Navigate to **"Liquidity"** page
2. If the current chain has DEX support, you'll see the form
3. If not, you'll see a warning to switch chains
4. Select your token and ETH/native token amount
5. Click **"Add Liquidity"**
6. Approve (2 transactions: token approval + add liquidity)

---

## 🔄 Switching Chains

### Method 1: Chain Selector Modal (Recommended)

1. Click the chain button in header
2. Browse or search for desired chain
3. Click to switch
4. Your wallet will prompt for approval
5. Done! UI updates automatically

### Method 2: Wallet Extension

1. Open your wallet (e.g., MetaMask)
2. Click network dropdown
3. Select desired network
4. App detects change automatically

### Method 3: Network Manager (Auto-Prompt)

- If you connect on an unsupported network, the app will show a modal
- Click **"Switch to Base"** for quick switching
- Or dismiss and use chain selector

---

## 💧 DEX Availability

### Chains with Full DEX Support

✅ **Can add liquidity immediately:**
- Ethereum (Uniswap V2/V3, SushiSwap)
- Base (Uniswap V2/V3, SushiSwap)
- Arbitrum (Uniswap V2/V3, SushiSwap)
- Optimism (Uniswap V3)
- Polygon (Uniswap V3, QuickSwap, SushiSwap)
- BSC (PancakeSwap)
- Avalanche (Trader Joe)
- Fantom (SpookySwap)

### Chains Without DEX

⚠️ **Token creation only:**
- All testnets (except Sepolia)
- You can create tokens but must use mainnet for liquidity

### Visual Indicators

- **Green "✓ DEX Available" badge**: Shows on Create Token page when DEX is present
- **Yellow warning banner**: Shows on Liquidity page when DEX is unavailable
- **Chain badge**: Every token card shows which chain it's deployed on

---

## ⚙️ Chain-Specific Features

### Gas Fees

| Chain | Avg. Deploy Cost | Avg. Liquidity Cost | Speed |
|-------|------------------|---------------------|-------|
| Ethereum | $50-200 | $30-100 | 12s-5min |
| Base | $0.10-0.50 | $0.05-0.20 | 2s |
| Arbitrum | $0.50-2 | $0.20-1 | 2s |
| Polygon | $0.01-0.10 | $0.01-0.05 | 2s |
| BSC | $0.20-1 | $0.10-0.50 | 3s |

### Contract Verification

✅ **Automatic verification on:**
- All chains with configured API keys
- Verification happens automatically after deployment
- Check `.env.example` for API key setup

### Native Tokens

- **ETH Chains**: Ethereum, Base, Arbitrum, Optimism
- **MATIC**: Polygon
- **BNB**: Binance Smart Chain
- **AVAX**: Avalanche
- **FTM**: Fantom

---

## ➕ Adding New Chains

Want to add support for a new EVM chain? Easy!

### 1. Update Chain Configuration

Edit `src/config/chains.ts`:

```typescript
import { defineChain } from 'viem'

// Define your custom chain
export const myNewChain = defineChain({
  id: 123456,
  name: 'My New Chain',
  network: 'mynewchain',
  nativeCurrency: {
    decimals: 18,
    name: 'My Token',
    symbol: 'MTK',
  },
  rpcUrls: {
    default: { http: ['https://rpc.mynewchain.com'] },
    public: { http: ['https://rpc.mynewchain.com'] },
  },
  blockExplorers: {
    default: { name: 'MyExplorer', url: 'https://explorer.mynewchain.com' },
  },
})

// Add chain config
export const myNewChainConfig: ChainConfig = {
  ...myNewChain,
  icon: '🔷',
  color: '#FF6B00',
  gradient: 'from-orange-500 to-red-500',
  weth: '0x...', // Wrapped native token address
  dex: {
    uniswapV2Factory: '0x...', // If Uniswap V2 fork exists
    uniswapV2Router: '0x...',
  },
  explorer: {
    name: 'MyExplorer',
    url: 'https://explorer.mynewchain.com',
    apiUrl: 'https://api.explorer.mynewchain.com/api',
    apiKeyEnvVar: 'VITE_MYCHAIN_API_KEY',
  },
  features: {
    tokenDeployment: true,
    uniswapV2: true, // Set based on DEX availability
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'mainnet',
  layer: 'L2',
}

// Add to ALL_CHAINS array
export const ALL_CHAINS: ChainConfig[] = [
  // ... existing chains
  myNewChainConfig, // Add here!
]
```

### 2. Add Environment Variables

In `.env`:

```bash
VITE_MYCHAIN_API_KEY=your_api_key
VITE_MYNEWCHAIN_RPC=https://custom-rpc.mynewchain.com
```

### 3. Test

1. Restart dev server: `npm run dev`
2. Open chain selector - your chain should appear
3. Switch to it and test token deployment
4. If DEX configured, test liquidity addition

That's it! The chain is now fully integrated.

---

## 🔧 Troubleshooting

### "Unsupported Network" Warning

**Problem**: App shows red warning when wallet connects

**Solution**:
1. Click chain selector in header
2. Choose a supported mainnet (Base recommended)
3. Approve network switch in wallet

### Chain Not Appearing in Selector

**Problem**: Added a new chain but it doesn't show

**Solution**:
1. Check `chains.ts` - is it in `ALL_CHAINS` array?
2. Restart dev server: `npm run dev`
3. Clear browser cache and reload

### DEX Not Available

**Problem**: "⚠️ No DEX support" message on Liquidity page

**Solution**:
- This is expected on testnets and some newer chains
- Switch to a mainnet with DEX support (see table above)
- Base, Ethereum, Arbitrum recommended

### Transaction Failing

**Problem**: Token deployment transaction fails

**Possible causes**:
1. **Insufficient gas**: Add more native tokens to wallet
2. **Wrong network**: Check wallet is on correct chain
3. **Fee not paid**: Ensure 0.02 ETH fee is included

**Solution**:
1. Check wallet has enough for gas + 0.02 ETH fee
2. Try increasing gas limit in wallet
3. Switch to less congested chain (Base, Polygon)

### Contract Not Verifying

**Problem**: Token deploys but doesn't verify on block explorer

**Solution**:
1. Check `.env` has API key for that chain's explorer
2. Wait 1-2 minutes - verification can be delayed
3. Manually verify using block explorer website

### Wallet Won't Switch Chains

**Problem**: Click chain but wallet doesn't respond

**Solution**:
1. Make sure wallet is unlocked
2. Try switching manually in wallet first
3. Refresh page and try again
4. Check wallet has that network configured

---

## 📊 Best Practices

### For Testing

1. **Start on testnet**: Use Sepolia for initial testing
2. **Test deployment**: Create a test token first
3. **Check verification**: Ensure contract verifies
4. **Switch to mainnet**: Once confident, use Base or Polygon

### For Production

1. **Choose the right chain**:
   - **Low fees**: Base, Polygon, Arbitrum
   - **Max liquidity**: Ethereum (expensive)
   - **Fast finality**: Avalanche, BSC

2. **Add liquidity**:
   - Start small to test pool creation
   - Use DEXScreener link to verify pool
   - Gradually add more liquidity

3. **Marketing**:
   - Each chain has different communities
   - Base and Ethereum have large audiences
   - Share DEXScreener and block explorer links

### Cost Optimization

| Chain | Deploy Token | Add Liquidity | Total Est. |
|-------|--------------|---------------|------------|
| Ethereum | $100 | $50 | **$150** |
| Base | $0.20 | $0.10 | **$0.30** ⭐ |
| Polygon | $0.05 | $0.03 | **$0.08** ⭐ |
| Arbitrum | $1 | $0.50 | **$1.50** |
| BSC | $0.50 | $0.30 | **$0.80** |

**Recommendation**: Start on Base or Polygon for testing, then expand to other chains as needed.

---

## 🎯 Chain Selection Guide

### Choose Base If:
- ✅ You want low fees
- ✅ You want fast transactions
- ✅ You want Ethereum compatibility
- ✅ You're new to crypto
- ⭐ **Recommended for most users**

### Choose Ethereum If:
- ✅ You need maximum liquidity
- ✅ You have a large budget
- ✅ You're targeting DeFi power users
- ⚠️ Expensive gas fees

### Choose Polygon If:
- ✅ You want the absolute lowest fees
- ✅ You're targeting gaming/NFT users
- ✅ You need multiple DEX options
- ⚠️ Different ecosystem than Ethereum

### Choose Arbitrum/Optimism If:
- ✅ You want Ethereum security + low fees
- ✅ You're targeting L2 users
- ✅ You want good liquidity

---

## 🆘 Support

### Getting Help

1. **Check this guide first**
2. **Review `.env.example`** for configuration
3. **Check browser console** for error messages
4. **Test on testnet** before mainnet

### Useful Resources

- [Privy Docs](https://docs.privy.io/)
- [Viem Docs](https://viem.sh/)
- [Uniswap Docs](https://docs.uniswap.org/)
- [Base Docs](https://docs.base.org/)

---

## 📝 Summary

Your multi-chain token launcher supports:
- ✅ 8 mainnets + 5 testnets
- ✅ Automatic chain detection
- ✅ One-click chain switching
- ✅ Multi-DEX protocol support
- ✅ Contract verification
- ✅ Beautiful UI with chain indicators

**Deploy on ANY EVM chain with the same great experience!** 🚀

---

*Built with ❤️ using Claude Code*
