# EVMint

**Deploy ERC20 tokens on 15+ EVM blockchains in seconds. No coding required.**

[![Live App](https://img.shields.io/badge/Live-evmint.io-blue?style=for-the-badge)](https://evmint.io)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

---

## Features

- **Multi-Chain Deployment** — Ethereum, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche, Fantom, Gnosis, Moonbeam, Blast, Worldchain, Monad, MegaETH + testnets
- **Instant Verification** — Contracts automatically verified on Etherscan, Basescan, Arbiscan, and all major explorers
- **DEX Liquidity** — Add and remove liquidity on Uniswap V2/V3, SushiSwap, PancakeSwap, QuickSwap, TraderJoe, SpookySwap
- **No Code Required** — Intuitive UI handles everything from deployment to verification
- **Secure** — Built on audited OpenZeppelin v5 contracts, XSS protection, input validation
- **Mobile-Friendly** — Fully responsive with glassmorphism design and Framer Motion animations

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 · TypeScript · Vite |
| **Styling** | Tailwind CSS · Framer Motion |
| **Web3** | Wagmi v2 · Viem · Privy |
| **State** | TanStack React Query · React Context |
| **Contracts** | Solidity 0.8.30 · OpenZeppelin v5.4 · Hardhat |
| **Analytics** | Firebase Analytics |
| **Hosting** | Firebase Hosting |

---

## Prerequisites

- Node.js 18+
- npm or yarn
- [Privy](https://dashboard.privy.io/) account (wallet authentication)
- [Etherscan](https://etherscan.io/myapikey) API key (contract verification)
- Firebase project (optional — analytics)

---

## Setup

```bash
git clone https://github.com/alexandreelkhoury/evmint.git
cd evmint/react-token-launcher
npm install
cp .env.example .env
# Fill in your env vars (see below)
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment Variables

Copy `.env.example` and fill in your values:

| Variable | Required | Description |
|---|---|---|
| `VITE_PRIVY_APP_ID` | Yes | Privy app ID for wallet connection |
| `VITE_ETHERSCAN_API_KEY` | Yes | Etherscan V2 unified API key (works for all chains) |
| `VITE_FIREBASE_API_KEY` | No | Firebase Analytics API key |
| `VITE_FIREBASE_PROJECT_ID` | No | Firebase project ID |
| `VITE_*_RPC` | No | Custom RPC endpoints per chain for better performance |

See `.env.example` for the full list with descriptions.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run build:prerender` | Build with static page prerendering |
| `npm run preview` | Preview production build locally |
| `npm run firebase:deploy` | Deploy to Firebase |
| `npm run firebase:build` | Build + deploy hosting |
| `npm run firebase:emulators` | Start local Firebase emulators |

---

## Project Structure

```
react-token-launcher/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx        # Navigation bar
│   │   ├── WalletButton.tsx  # Wallet connection
│   │   ├── NetworkManager.tsx# Network switching
│   │   └── liquidity/        # Liquidity-specific UI
│   │
│   ├── pages/                # Route-based pages
│   │   ├── HomePage/         # Landing page sections
│   │   ├── CreateTokenPage/  # Token creation form
│   │   ├── TokensPage.tsx    # User's deployed tokens
│   │   ├── TokenDetailPage/  # Token stats & swap
│   │   ├── LiquidityPage/    # Add/remove liquidity
│   │   └── ...               # Guide, FAQ, Blog, legal pages
│   │
│   ├── features/             # Feature modules
│   │   ├── liquidity/        # DEX interaction hooks
│   │   └── verification/     # Contract verification logic
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useOpenZeppelinTokenDeployment.ts
│   │   ├── useChainConfig.ts
│   │   └── liquidity/        # Liquidity management hooks
│   │
│   ├── config/               # App configuration
│   │   ├── chains.ts         # Multi-chain definitions (20+ chains)
│   │   ├── web3.ts           # Wagmi + Privy setup
│   │   └── firebase.ts       # Analytics config
│   │
│   ├── contracts/            # Compiled contract ABI + bytecode
│   ├── contexts/             # React context providers
│   ├── services/             # External API integrations
│   ├── utils/                # Validation, analytics, logging
│   └── styles/               # Design system tokens
│
├── contracts/                # Solidity source files
├── public/                   # Static assets, sitemap, robots.txt
└── dist/                     # Build output (gitignored)
```

---

## Architecture

```
PrivyProvider (auth)
  → QueryClientProvider (async state)
    → WagmiProvider (Web3)
      → React Router (navigation)
```

**Token deployment flow:** User fills form → selects chain → wallet signs tx → contract deployed → auto-verified on explorer → success modal with links.

**Liquidity flow:** Select token pair → approve tokens → add/remove liquidity via chain-specific DEX router → LP tokens tracked in localStorage.

---

## Supported Chains

**Mainnets:** Ethereum · Base · Arbitrum · Optimism · Polygon · BSC · Avalanche · Fantom · Gnosis · Moonbeam · Blast · Worldchain · Monad · MegaETH

**Testnets:** Sepolia · Base Sepolia · Arbitrum Sepolia · Optimism Sepolia · Polygon Amoy · BSC Testnet · Avalanche Fuji · Moonbase Alpha · Blast Sepolia

---

## Adding a New Chain

Edit `src/config/chains.ts`:

```typescript
export const YOUR_CHAIN: ChainConfig = {
  ...yourChain,             // from viem/chains
  icon: '/icons/chain.svg',
  weth: '0x...',            // wrapped native token
  dex: { uniswapV2Router: '0x...', uniswapV2Factory: '0x...' },
  explorer: { name: 'YourScan', url: '...', apiUrl: '...' },
  features: { tokenDeployment: true, uniswapV2: true },
  category: 'mainnet',
  layer: 'L2',
}
```

Then add to `ALL_CHAINS` and update `src/config/web3.ts`.

---

## Deployment

```bash
npm run build
npm run firebase:deploy
```

Also works with Vercel, Netlify, Cloudflare Pages, or any static host — just deploy the `dist/` folder.

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push and open a Pull Request

Use TypeScript for all new code. Follow existing component patterns.

---

## License

MIT
