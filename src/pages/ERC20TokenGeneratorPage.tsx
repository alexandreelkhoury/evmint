import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import ChainIcon from '../components/ChainIcon'
import { MAINNET_CHAINS, CHAIN_FEES, getDeploymentFeeUSD } from '../config/chains'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView, trackButtonClick } from '../utils/analytics'

/**
 * Single source of truth for this page's FAQ. The visible list and the FAQPage
 * JSON-LD are both rendered from this array — Google requires the marked-up
 * questions and answers to match the on-page copy, and hand-duplicating them
 * guarantees the two eventually drift.
 */
const faqs = [
  {
    question: 'What exactly gets deployed?',
    answer: "A single contract extending OpenZeppelin's ERC20 implementation. The constructor mints the entire supply to msg.sender, forwards the platform fee, and returns. The resulting external surface is the nine ERC20 methods plus two public view constants, FEE and feeRecipient. There is no Ownable, no AccessControl, no Pausable and no upgrade proxy."
  },
  {
    question: 'Is the smart contract audited?',
    answer: "Your token is built on OpenZeppelin's ERC20 implementation — audited, and among the most widely reviewed Solidity in existence. On top of it sits a short constructor that mints your supply and forwards the platform fee, and that is the entire contract. It is source-verified on the block explorer immediately after deployment, so you can read the exact deployed code rather than take anyone's word for it."
  },
  {
    question: 'How is total supply encoded?',
    answer: 'You supply a whole-token count. The constructor scales it by 10**decimals and mints that many base units to the deployer. With the default 18 decimals, a supply of 1,000,000 becomes a totalSupply() of 1000000 * 10**18 base units. Wallets and explorers divide by 10**decimals again for display.'
  },
  {
    question: 'Can total supply change after deployment?',
    answer: 'No. There is no mint function and no burn function in the deployed contract, so totalSupply() returns the same value forever. Holders can send tokens to a dead address to remove them from circulation, but totalSupply() will not reflect that.'
  },
  {
    question: 'What does deployment cost?',
    answer: "A platform fee of roughly $80 equivalent, sent as msg.value on the deployment transaction in the chain's native token — 0.02 ETH on Ethereum, Base, Arbitrum and Optimism, 0.075 BNB on BSC, 400 POL on Polygon. Network gas is charged separately on top by the chain: a few cents on a Layer 2, several dollars on Ethereum mainnet under load."
  },
  {
    question: 'Which chain should I deploy on?',
    answer: 'The bytecode is identical everywhere, so the choice is about gas, liquidity depth and where your users already are. Ethereum mainnet has the deepest liquidity and the highest gas. Base, Arbitrum and Optimism run the same EVM for a fraction of the cost. The platform fee targets the same figure on every network.'
  },
  {
    question: 'Can I add the token to MetaMask?',
    answer: 'Yes. It is a standard ERC20, so any wallet that speaks the standard — MetaMask, Rabby, Trust Wallet, Coinbase Wallet — will import it from the contract address alone and display balances using the name, symbol and decimals stored on-chain.'
  }
]

const parameters = [
  {
    name: 'name_',
    type: 'string',
    accepts: 'Free text, e.g. "My Awesome Token"',
    note: 'Not unique. Two contracts may share a name; only the address disambiguates.'
  },
  {
    name: 'symbol_',
    type: 'string',
    accepts: 'Conventionally 3–5 uppercase characters',
    note: 'Also not unique and not enforced on-chain. Check the DEX aggregators first.'
  },
  {
    name: 'initialSupply_',
    type: 'uint256',
    accepts: 'Whole tokens, scaled by 10**decimals on mint',
    note: 'Minted in full to msg.sender in the constructor. Cannot be increased later.'
  },
  {
    name: 'decimals_',
    type: 'uint8',
    accepts: '0–255, default 18',
    note: 'A display divisor only. 18 matches ETH; 6 matches USDC.'
  },
  {
    name: 'fee_',
    type: 'uint256',
    accepts: 'The platform fee, checked against msg.value',
    note: 'Set per chain by the app. Readable afterwards from the public FEE constant.'
  }
]

const abiSurface = [
  { sig: 'name() → string', mut: 'view' },
  { sig: 'symbol() → string', mut: 'view' },
  { sig: 'decimals() → uint8', mut: 'view' },
  { sig: 'totalSupply() → uint256', mut: 'view' },
  { sig: 'balanceOf(address) → uint256', mut: 'view' },
  { sig: 'allowance(address,address) → uint256', mut: 'view' },
  { sig: 'transfer(address,uint256) → bool', mut: 'nonpayable' },
  { sig: 'transferFrom(address,address,uint256) → bool', mut: 'nonpayable' },
  { sig: 'approve(address,uint256) → bool', mut: 'nonpayable' },
  { sig: 'FEE() → uint256', mut: 'view' },
  { sig: 'feeRecipient() → address', mut: 'view' }
]

const absent: Array<[string, string]> = [
  ['mint(address,uint256)', 'Supply is fixed at construction. Nothing can inflate it.'],
  ['burn(uint256)', 'No supply-reducing path either — totalSupply() is constant.'],
  ['pause() / unpause()', 'Transfers can never be halted, by anyone, for any reason.'],
  ['owner() / transferOwnership()', 'Not Ownable. No privileged address exists in the deployed code.'],
  ['blacklist(address)', 'No address can be prevented from sending or receiving.'],
  ['setTax() / _update override', 'No transfer tax, reflection or sell-blocking hook.'],
  ['upgradeTo(address)', 'Not a proxy. The bytecode at that address is final.']
]

/**
 * SEO Landing Page: ERC20 Token Generator
 * Targets keyword: "erc20 token generator"
 * Written for the technical reader: the standard itself, the exact ABI surface,
 * supply and decimal semantics, and per-chain fees read from config.
 */
export default function ERC20TokenGeneratorPage() {
  const analytics = useFirebaseAnalytics()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    trackPageView(analytics, 'erc20_token_generator')
  }, [analytics])

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ERC20 Token Generator - Create Fixed-Supply Tokens",
      "description": "Generate a fixed-supply ERC20 token with custom name, symbol, supply and decimals. Deploy on any of 15 EVM mainnets in under 60 seconds. No coding required.",
      "url": "https://evmint.io/erc20-token-generator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "provider": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
      "offers": {
        "@type": "Offer",
        "price": "80",
        "priceCurrency": "USD",
        "description": "~$80 platform fee per deployment, sent as msg.value in the native token of the chain. Network gas is charged separately by the blockchain and is not included.",
        "priceValidUntil": "2027-12-31"
      },
      "featureList": [
        "ERC20 deployment in under 60 seconds",
        "Custom name, symbol, total supply and decimals",
        "15 EVM mainnets supported",
        "No coding skills required",
        "Built on OpenZeppelin's audited ERC20 libraries",
        "No mint, burn, pause, blacklist, owner or tax functions in the deployed contract",
        "Automatic source verification on block explorers",
        "Non-custodial — the entire supply is minted to the deployer"
      ],
      "installUrl": "https://evmint.io/create"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "ERC20 Token Generator FAQ",
      "url": "https://evmint.io/erc20-token-generator",
      "inLanguage": "en-US",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://evmint.io"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "ERC20 Token Generator",
          "item": "https://evmint.io/erc20-token-generator"
        }
      ]
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      <SEO
        title="ERC20 Token Generator - Fixed Supply, No Owner | EVMint"
        description="Generate an ERC20 token with custom name, symbol, supply and decimals. No mint, no owner, no pause. ~$80 platform fee plus network gas, on 15 EVM chains."
        keywords="erc20 token generator, create erc20 token, erc20 maker, ethereum token generator, custom erc20, token factory, erc20 deployment"
        canonical="/erc20-token-generator"
        structuredData={structuredData}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">

          {/* ── Hero: the claim on the left, the actual contract on the right ── */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-start mb-20"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-hairline-1 rounded-full text-xs font-mono text-purple-300 uppercase tracking-widest mb-6">
                EIP-20 · Solidity 0.8.30
              </span>

              <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white leading-[1.08] mb-6">
                An ERC20 generator that ships{' '}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  nothing you didn't ask for
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Five constructor arguments, one deployment transaction, an immutable fixed-supply
                token. The contract that lands on-chain has no owner, no mint function, no pause
                switch, no blacklist and no transfer hook.
              </p>
              <p className="text-base text-gray-400 leading-relaxed mb-8">
                The complete external surface is below. It is eleven functions, and you can read
                every one of them before spending anything.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to="/create"
                  onClick={() => trackButtonClick(analytics, 'cta_primary_erc20', 'hero_section')}
                  className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Generate a token
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="text-sm text-gray-400 leading-snug">
                  ~$80 platform fee, sent as <code className="font-mono text-gray-300">msg.value</code>.
                  <br className="hidden sm:block" />
                  Network gas is billed separately by the chain.
                </p>
              </div>
            </div>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline-1">
                <span className="w-2 h-2 rounded-full bg-surface-3" aria-hidden="true" />
                <span className="text-[11px] font-mono text-gray-400">MyERC20.sol</span>
              </div>
              <pre className="p-4 sm:p-5 text-[12.5px] leading-relaxed font-mono text-gray-300 overflow-x-auto">
                <code>{`contract MyERC20 is ERC20 {
  uint256 public immutable FEE;
  address public immutable feeRecipient;

  constructor(
    string  memory name_,
    string  memory symbol_,
    uint256 initialSupply_,
    uint8   decimals_,
    uint256 fee_
  ) payable ERC20(name_, symbol_) {
    // the whole supply, to the deployer
    _mint(msg.sender,
          initialSupply_ * 10 ** decimals_);
  }
}`}</code>
              </pre>
              <p className="px-4 sm:px-5 pb-4 text-xs text-gray-400 leading-relaxed">
                Abridged for readability — fee handling omitted. The full source is submitted to
                the block explorer for verification at deployment time.
              </p>
            </div>
          </motion.header>

          {/* ── Constructor parameters ───────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              The five parameters
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              All fixed at construction. There is no path in the deployed bytecode to change any
              value in this table after the transaction confirms.
            </p>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[44rem]">
                  <caption className="sr-only">Constructor parameters for an EVMint ERC20 token</caption>
                  <thead>
                    <tr className="border-b border-hairline-1">
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Argument</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Type</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Accepts</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((p, i) => (
                      <tr key={p.name} className={i % 2 === 1 ? 'bg-surface-1' : undefined}>
                        <th scope="row" className="text-left py-3.5 px-5 align-top">
                          <code className="font-mono text-[13px] text-purple-300">{p.name}</code>
                        </th>
                        <td className="py-3.5 px-5 align-top">
                          <code className="font-mono text-[13px] text-gray-400">{p.type}</code>
                        </td>
                        <td className="py-3.5 px-5 align-top text-gray-200">{p.accepts}</td>
                        <td className="py-3.5 px-5 align-top text-gray-400">{p.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* ── ABI surface: present and, more usefully, absent ──────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              The complete external surface
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              This is the entire ABI, not a highlight reel. The right-hand column is the more
              interesting one: a contract-level rug pull needs a function that is not there.
            </p>

            <div className="grid lg:grid-cols-2 gap-3">
              <div className="bg-surface-1 border border-hairline-1 rounded-panel p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  Present · 11 functions
                </h3>
                <ul>
                  {abiSurface.map(fn => (
                    <li
                      key={fn.sig}
                      className="flex items-baseline justify-between gap-3 py-2 border-b border-hairline-1 last:border-b-0"
                    >
                      <code className="font-mono text-[12.5px] text-gray-200 break-all">{fn.sig}</code>
                      <span className="flex-shrink-0 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                        {fn.mut}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface-1 border border-hairline-1 rounded-panel p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  Absent by construction
                </h3>
                <ul className="space-y-3">
                  {absent.map(([sig, why]) => (
                    <li key={sig}>
                      <code className="font-mono text-[12.5px] text-gray-400 line-through decoration-gray-600 break-all">
                        {sig}
                      </code>
                      <p className="text-[13px] text-gray-400 leading-relaxed mt-1">{why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 bg-surface-1 border border-hairline-1 rounded-panel p-5 sm:p-6">
              <h3 className="text-base font-display font-semibold tracking-tight text-white mb-2">
                What that does, and does not, guarantee
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                It guarantees the token contract itself cannot be used to mint against holders,
                freeze transfers, block an address or tax a trade — the mechanisms behind most
                contract-level rug pulls. It does not make any project trustworthy: the deployer
                still holds the entire supply and can sell it, and liquidity can still be pulled
                from an unlocked pool. Those are wallet and pool behaviours, not contract
                behaviours, and no ERC20 can prevent them.
              </p>
            </div>
          </motion.section>

          {/* ── Supply and decimals ──────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Supply and decimals, precisely
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              The most common misunderstanding in ERC20 land. Decimals are a display convention —
              the EVM only ever stores integers.
            </p>

            <div className="grid md:grid-cols-3 gap-3 mb-3">
              {[
                {
                  k: '18',
                  t: 'The default',
                  d: 'Matches ETH and almost every DeFi token. One token is stored as 10^18 base units, giving eighteen digits of fractional precision.'
                },
                {
                  k: '6',
                  t: 'Stablecoin style',
                  d: 'USDC and USDT use six. Smaller integers in call data, and fractional cents stay representable. Some tooling still assumes 18 — test before committing.'
                },
                {
                  k: '0',
                  t: 'Indivisible',
                  d: 'Whole units only. Sensible for tickets, credits or membership counts where half a token is meaningless.'
                }
              ].map(item => (
                <div key={item.k} className="bg-surface-1 border border-hairline-1 rounded-card p-5">
                  <p className="text-3xl font-display font-bold tracking-tight text-white tabular-nums mb-1">
                    {item.k}
                  </p>
                  <p className="text-sm font-semibold text-purple-300 mb-3">{item.t}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel p-5 sm:p-6">
              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                Worked example — a supply of one million at the default eighteen decimals:
              </p>
              <pre className="text-[12.5px] font-mono text-gray-300 leading-relaxed overflow-x-auto">
                <code>{`you enter       1,000,000
minted as       1000000 * 10**18
                = 10^24 base units
totalSupply()   returns that integer, forever
a wallet shows  1,000,000 MYT   (divides by 10**18)`}</code>
              </pre>
            </div>
          </motion.section>

          {/* ── Per-chain fees, read from config ─────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Platform fee per network
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Identical bytecode on all {MAINNET_CHAINS.length} mainnets. The amount below is sent
              as <code className="font-mono text-gray-300">msg.value</code> and targets the same
              ~$80 everywhere.{' '}
              <strong className="text-gray-200 font-semibold">
                Network gas is charged on top of every figure in this list
              </strong>{' '}
              and is set by the chain, not by us.
            </p>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {MAINNET_CHAINS.map(chain => (
                <li
                  key={chain.id}
                  className="flex items-center gap-3 min-h-[56px] px-4 py-2.5 bg-surface-1 border border-hairline-1 rounded-card hover:border-hairline-2 transition-[border-color] duration-200"
                >
                  <ChainIcon chainId={chain.id} size={24} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200 truncate">{chain.name}</p>
                    <p className="text-xs text-gray-400 font-mono tabular-nums">
                      {CHAIN_FEES[chain.id]} {chain.nativeCurrency.symbol} · ≈${getDeploymentFeeUSD(chain.id)}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-surface-2 border border-hairline-1 rounded px-1.5 py-0.5">
                    {chain.layer}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              Native amounts are retuned periodically against market prices, so the dollar column
              is approximate. Your wallet shows the exact total — fee plus gas — before you sign.
            </p>
          </motion.section>

          {/* ── Against rolling your own ─────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Against rolling your own
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              If you write Solidity, the honest comparison is Remix or Foundry — not an agency
              quote. Here is what the fee is actually buying.
            </p>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[40rem]">
                  <caption className="sr-only">
                    EVMint compared with a self-managed Remix or Foundry deployment
                  </caption>
                  <thead>
                    <tr className="border-b border-hairline-1">
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5 w-1/4">Step</th>
                      <th scope="col" className="text-left font-semibold text-white py-3 px-5">EVMint</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Remix / Foundry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Contract source', 'Fixed template, no admin functions', 'Pick a template and audit it yourself for backdoors'],
                      ['Toolchain', 'None', 'solc version pinning, optimizer runs, a deploy script'],
                      ['Deploying', 'One confirmation, gas estimated for you', 'Pay gas, debug a revert, pay gas again'],
                      ['Verification', 'Submitted automatically per explorer', 'Flatten the source, match settings, submit by hand'],
                      ['Multi-chain', 'Switch the network selector', 'Re-run and re-verify for every chain'],
                      ['Liquidity', 'Router calls wrapped in the Liquidity page', 'Call addLiquidityETH yourself and get the ordering right'],
                      ['Cost', '~$80 platform fee, plus gas', 'Gas only — but unpredictable, and paid per attempt'],
                      ['Prerequisite', 'None', 'Solidity, and enough Web3 to debug it']
                    ].map(([label, ours, diy], i) => (
                      <tr key={label} className={i % 2 === 1 ? 'bg-surface-1' : undefined}>
                        <th scope="row" className="text-left font-medium text-gray-400 py-3 px-5 align-top">{label}</th>
                        <td className="py-3 px-5 text-gray-200 align-top">{ours}</td>
                        <td className="py-3 px-5 text-gray-400 align-top">{diy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* ── The standard itself ──────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-6">
              Why the standard is worth conforming to
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-400 leading-relaxed">
              <div className="space-y-4">
                <p>
                  ERC20 — Ethereum Request for Comments 20, finalised as EIP-20 in 2015 — is an
                  interface, not an implementation. It specifies six functions and two events and
                  says nothing about how you implement them. That minimalism is why every wallet,
                  DEX router, lending market and indexer in the EVM ecosystem can integrate a token
                  it has never seen before, with no bespoke work on either side.
                </p>
                <p>
                  The corollary is that conforming to the interface says nothing about behaviour.
                  A honeypot that reverts on sell, a token with a 30% transfer tax, and a token
                  whose owner can mint at will are all perfectly valid ERC20s. That is precisely
                  why the absent-functions list above is the part worth reading.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  OpenZeppelin's implementation is why most of the ecosystem does not write this
                  from scratch. It handles the allowance edge cases, zero-address checks and
                  overflow semantics that hand-rolled ERC20s have historically got wrong, and it
                  has been reviewed continuously for years. EVMint uses it unmodified.
                </p>
                <p>
                  Every chain listed above runs the same virtual machine, so identical bytecode
                  behaves identically on Base, Arbitrum, Polygon or BSC; only gas, block time and
                  surrounding liquidity differ. If you want the same deployment explained from
                  first principles, the{' '}
                  <Link to="/cryptocurrency-creator" className="text-purple-300 hover:text-purple-200 underline underline-offset-2">
                    cryptocurrency creator
                  </Link>{' '}
                  page covers it, and the{' '}
                  <Link to="/meme-coin-creator" className="text-purple-300 hover:text-purple-200 underline underline-offset-2">
                    meme coin creator
                  </Link>{' '}
                  page covers launch-day mechanics.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── FAQ ──────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-8">
              Technical FAQ
            </h2>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div
                    key={faq.question}
                    className="bg-surface-1 border border-hairline-1 rounded-card overflow-hidden transition-[border-color] duration-200 hover:border-hairline-2"
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`erc20-faq-${index}`}
                        id={`erc20-faq-q-${index}`}
                        className="w-full min-h-[56px] flex items-start justify-between gap-4 text-left px-5 py-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset"
                      >
                        <span className="font-display font-semibold tracking-tight text-white">
                          {faq.question}
                        </span>
                        <svg
                          className={`flex-shrink-0 w-5 h-5 mt-0.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </h3>
                    {/*
                      Always mounted, collapsed with CSS only. The FAQPage JSON-LD
                      above is generated from this same `faqs` array, and Google
                      requires the answer text to exist in the delivered HTML for
                      the markup to be eligible — unmounting on collapse would
                      ship questions with no answers.
                    */}
                    <div
                      id={`erc20-faq-${index}`}
                      role="region"
                      aria-labelledby={`erc20-faq-q-${index}`}
                      className={`grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 invisible'}`}
                    >
                      <div className="overflow-hidden min-h-0">
                        <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* ── Closing CTA ──────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="bg-surface-2 border border-hairline-1 rounded-panel p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-white mb-2">
                Five arguments, one transaction
              </h2>
              <p className="text-sm text-gray-400 max-w-md">
                Fill in the form without connecting a wallet. Nothing is charged until you sign the
                deployment.
              </p>
            </div>
            <Link
              to="/create"
              onClick={() => trackButtonClick(analytics, 'cta_secondary_erc20', 'bottom_section')}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
            >
              Open the generator
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.section>

        </div>
      </div>
    </div>
  )
}
