# 🚀 EVMint - Multi-Chain Token Creator

**Deploy ERC20 tokens on 15+ EVM blockchains in 5 seconds. No coding required.**

[![Live App](https://img.shields.io/badge/Live-evmint.io-blue?style=for-the-badge)](https://evmint.io)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌟 Features

- 🌐 **Multi-Chain Support** - Deploy on Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, Fantom, Gnosis, Moonbeam, Blast, Worldchain + testnets
- ⚡ **5-Second Deployment** - Instant token creation with automatic verification
- 💰 **Ultra-Low Fees** - $75-100 platform fee + minimal gas on Layer 2s
- 🎯 **No Code Required** - User-friendly interface for everyone
- 🦄 **Multi-DEX Liquidity** - Add/remove liquidity on Uniswap, SushiSwap, PancakeSwap, and more
- ✅ **Auto-Verification** - Contracts automatically verified on all block explorers
- 🔒 **Secure** - Built with audited OpenZeppelin contracts
- 📱 **Mobile-Friendly** - Responsive design for all devices

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Web3**: Wagmi v2 + Viem + Privy (wallet connection)
- **State Management**: TanStack React Query
- **Analytics**: Firebase Analytics
- **Hosting**: Firebase Hosting

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Privy account (for wallet connection)
- Firebase project (for analytics - optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/evmint/react-token-launcher.git
cd react-token-launcher

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Privy App ID to .env
# VITE_PRIVY_APP_ID=your_privy_app_id_here

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Privy App ID for wallet connection
VITE_PRIVY_APP_ID=your_privy_app_id

# Optional: Firebase configuration (for analytics)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Getting Your Privy App ID:

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Create a new app or select existing one
3. Copy your App ID from the settings
4. Paste it in your `.env` file

---

## 🛠️ Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Firebase Hosting
npm run firebase:deploy
```

---

## 🏗️ Project Structure

```
react-token-launcher/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Main navigation
│   │   ├── Footer.tsx       # Footer with links
│   │   ├── WalletButton.tsx # Wallet connection
│   │   ├── NetworkManager.tsx # Network handling
│   │   └── ...
│   │
│   ├── pages/               # Route-based pages
│   │   ├── HomePage/        # Landing page
│   │   ├── CreateTokenPage/ # Token creation
│   │   ├── TokensPage/      # User's tokens
│   │   ├── LiquidityPage/   # Liquidity management
│   │   ├── GuidesPage/      # Documentation
│   │   └── FAQPage/         # Help section
│   │
│   ├── features/            # Feature modules
│   │   ├── liquidity/       # DEX liquidity logic
│   │   └── verification/    # Contract verification
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useOpenZeppelinTokenDeployment.ts
│   │   ├── useChainConfig.ts
│   │   └── ...
│   │
│   ├── config/              # Configuration
│   │   ├── chains.ts        # Multi-chain configuration
│   │   ├── web3.ts          # Wagmi setup
│   │   ├── firebase.ts      # Analytics
│   │   └── constants.ts     # App constants
│   │
│   ├── utils/               # Utility functions
│   │   ├── validation.ts    # Form validation
│   │   └── analytics.ts     # Analytics helpers
│   │
│   ├── styles/              # Design system
│   │   └── designSystem.ts  # Colors, typography, animations
│   │
│   └── App.tsx              # Main app component
│
├── public/                  # Static assets
│   ├── sitemap.xml          # SEO sitemap
│   ├── robots.txt           # Search engine config
│   └── ...
│
├── CLAUDE.md                # Project documentation for AI
├── COMPREHENSIVE_ANALYSIS_REPORT.md # Full app audit
└── README.md                # This file
```

---

## 🎨 Key Features Explained

### Multi-Chain Token Deployment

Deploy tokens on 15+ EVM chains with a single interface:

**Mainnets:**
- Ethereum
- Base
- Arbitrum
- Optimism
- Polygon
- BSC (Binance Smart Chain)
- Avalanche
- Fantom
- Gnosis
- Moonbeam
- Blast
- Worldchain

**Testnets:**
- Sepolia (Ethereum)
- Base Sepolia
- Arbitrum Sepolia
- Optimism Sepolia
- Polygon Amoy
- BSC Testnet
- Avalanche Fuji
- Moonbase Alpha
- Blast Sepolia

### Liquidity Management

Add and remove liquidity on multiple DEXes:
- Uniswap V2/V3
- SushiSwap
- PancakeSwap
- QuickSwap
- TraderJoe
- SpookySwap

### Automatic Verification

Contracts are automatically verified on:
- Etherscan (Ethereum)
- Basescan (Base)
- Arbiscan (Arbitrum)
- Optimistic Etherscan
- Polygonscan
- BSCScan
- Snowtrace (Avalanche)
- FTMScan (Fantom)
- Gnosisscan
- Moonscan

---

## 🔧 Configuration

### Adding a New Chain

To add support for a new EVM chain, edit `src/config/chains.ts`:

```typescript
export const YOUR_CHAIN: ChainConfig = {
  ...yourChain, // Import from viem/chains
  icon: '/icons/yourchain.svg',
  color: '#yourcolor',
  gradient: 'from-your-500 to-chain-600',
  weth: '0xWrappedNativeTokenAddress',
  dex: {
    uniswapV2Router: '0xRouterAddress',
    uniswapV2Factory: '0xFactoryAddress',
  },
  explorer: {
    name: 'YourScan',
    url: 'https://yourscan.io',
    apiUrl: 'https://api.yourscan.io/api',
  },
  features: {
    tokenDeployment: true,
    uniswapV2: true,
    uniswapV3: false,
    hasMultipleDex: false,
  },
  category: 'mainnet',
  layer: 'L1' // or 'L2', 'sidechain'
}
```

Then add to `ALL_CHAINS` array and update Wagmi config in `src/config/web3.ts`.

---

## 📊 Analytics

The app tracks user interactions via Firebase Analytics:

**Events Tracked:**
- `page_view` - Page navigation
- `token_created` - Successful token deployment
- `liquidity_added` - Liquidity addition
- `liquidity_removed` - Liquidity removal
- `wallet_connected` - Wallet connections
- `network_switched` - Network changes
- `error_occurred` - Error tracking

See `src/utils/analytics.ts` for all tracked events.

---

## 🔐 Security

- **Smart Contracts**: Built with audited OpenZeppelin v5.4.0
- **Wallet Security**: Privy handles authentication
- **No Private Keys Stored**: All transactions signed in user's wallet
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: DOMPurify sanitization
- **HTTPS Only**: Enforced in production

---

## 🚢 Deployment

### Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase
npm run firebase:deploy

# Or deploy hosting only
firebase deploy --only hosting
```

### Other Platforms

The app is a static site and can be deployed to:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- Any static hosting

Just run `npm run build` and deploy the `dist/` folder.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Add JSDoc comments for functions
- Keep components under 300 lines
- Use custom hooks for business logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: [evmint.io/guides](https://evmint.io/guides)
- **FAQ**: [evmint.io/faq](https://evmint.io/faq)
- **Issues**: [GitHub Issues](https://github.com/evmint/react-token-launcher/issues)
- **Email**: support@evmint.io

---

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Smart contract library
- [Privy](https://privy.io/) - Wallet authentication
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Viem](https://viem.sh/) - TypeScript Ethereum library
- [Uniswap](https://uniswap.org/) - DEX protocol

---

## 📈 Roadmap

- [ ] Token vesting/locking features
- [ ] Multi-signature wallet support
- [ ] Bulk token airdrop tool
- [ ] Token analytics dashboard
- [ ] Cross-chain bridge integration
- [ ] NFT metadata generator
- [ ] Governance token templates
- [ ] Automated market maker pools

---

## 🌟 Star History

If you find this project useful, please give it a star! ⭐

---

**Built with ❤️ by the EVMint Team**

[Website](https://evmint.io) • [Twitter](https://twitter.com/evmint) • [GitHub](https://github.com/evmint)
