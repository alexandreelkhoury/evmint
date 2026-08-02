import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import ChainIcon from '../components/ChainIcon'
import { MAINNET_CHAINS } from '../config/chains'
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
    question: 'Is it legal to create a cryptocurrency?',
    answer: 'Creating a token is legal in most jurisdictions. How you market and use it is what carries risk. Avoid making investment promises, do not offer what amounts to an unregistered security, and take legal advice for your own jurisdiction before you sell anything.'
  },
  {
    question: "Can I change my token's parameters after deployment?",
    answer: 'No. The contract is immutable once deployed. Name, symbol, decimals and total supply are fixed at construction and there is no admin function to change any of them. Decide carefully before you deploy, and try a testnet first if you are unsure.'
  },
  {
    question: 'What does it actually cost?',
    answer: 'A platform fee of roughly $80, paid in the native token of the chain you deploy on — 0.02 ETH on Ethereum, Base, Arbitrum and Optimism, 0.075 BNB on BSC, 400 POL on Polygon, and so on. Network gas is charged separately on top of that: a few cents on a Layer 2, potentially several dollars on Ethereum mainnet depending on congestion.'
  },
  {
    question: 'How do I distribute tokens to my team or community?',
    answer: 'The entire supply is minted to your wallet at deployment. From there you transfer it: directly to individual addresses, into a vesting contract for team allocations, into a liquidity pool so people can buy it, or through an airdrop tool.'
  },
  {
    question: "What's the difference between a token and a coin?",
    answer: 'A coin runs on its own blockchain — Bitcoin has Bitcoin, Ethereum has Ethereum. A token runs on someone else\'s blockchain, using a standard contract. In everyday use the words are interchangeable. EVMint creates tokens, which behave like coins in every wallet and exchange that supports the ERC20 standard.'
  },
  {
    question: 'How long until my token is tradeable?',
    answer: 'Deployment takes under 60 seconds including the wallet confirmation. Trading needs one more step: pairing your token with ETH or a stablecoin in a DEX liquidity pool, which is another couple of minutes of setup and requires you to supply both sides of that pair.'
  }
]

const glossary = [
  {
    term: 'Token',
    plain: 'A smart contract that keeps a ledger of who owns how much. That is genuinely all a token is — a table of addresses and balances, plus rules for moving between them.'
  },
  {
    term: 'Contract address',
    plain: 'The 42-character 0x… string your token lives at. It is the only identifier that matters. Anyone can add it to MetaMask to see their balance, and two tokens can share a name but never an address.'
  },
  {
    term: 'Gas',
    plain: 'What the network charges to run your transaction. It goes to the blockchain, not to us, and it moves with demand. Cents on a Layer 2 like Base or Arbitrum, dollars on Ethereum mainnet.'
  },
  {
    term: 'Total supply',
    plain: 'How many tokens exist. On an EVMint token this number is set once at deployment and can never go up — there is no mint function to call.'
  },
  {
    term: 'Decimals',
    plain: 'How finely a token can be split. 18 is the ERC20 convention and matches ETH, so one token is stored internally as 1,000,000,000,000,000,000 of its smallest unit.'
  },
  {
    term: 'Liquidity',
    plain: 'A pool holding your token alongside ETH or a stablecoin. Without one, nobody can buy or sell. You create it, you fund both sides of it, and the ratio you choose sets the opening price.'
  }
]

const steps = [
  {
    title: 'Pick a network',
    hint: 'Network button, top-right of the header',
    body: 'Base or Arbitrum if you want cheap gas and fast blocks. Ethereum mainnet if you want the deepest liquidity and are willing to pay for it. The platform fee is the same ~$80 everywhere; only gas differs.'
  },
  {
    title: 'Fill in four fields',
    hint: 'Name · Symbol · Total supply · Decimals',
    body: 'A readable name, a 3–5 character ticker, the number of tokens to create, and the decimal precision (leave it at 18 unless you have a reason). Every one of these is permanent.'
  },
  {
    title: 'Confirm one transaction',
    hint: 'Your wallet pops up once',
    body: 'The ~$80 platform fee is sent with that transaction as its value; gas is added by the network on top. There is no second signature, no subscription and no cut of your supply.'
  },
  {
    title: 'Receive the whole supply',
    hint: 'Visible in /tokens once the block confirms',
    body: 'Every token is minted to the wallet that deployed it. EVMint keeps nothing, and the contract has no privileged address that could take any of it later.'
  },
  {
    title: 'Add liquidity when you are ready',
    hint: 'Liquidity page, optional',
    body: 'Pair your token with ETH or a stablecoin on Uniswap or an equivalent DEX. This is the step that makes it tradeable, and the point at which your token starts appearing on DEXScreener.'
  }
]

/**
 * SEO Landing Page: Cryptocurrency Creator
 * Targets keyword: "cryptocurrency creator"
 * Written for the complete beginner — glossary first, jargon explained inline.
 */
export default function CryptocurrencyCreatorPage() {
  const analytics = useFirebaseAnalytics()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    trackPageView(analytics, 'cryptocurrency_creator')
  }, [analytics])

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Cryptocurrency Creator - Launch Your Own Crypto Token",
      "description": "Create your own cryptocurrency on Ethereum, Base, Arbitrum, Polygon and more. Deploy a fixed-supply ERC20 token in under 60 seconds. No coding required.",
      "url": "https://evmint.io/cryptocurrency-creator",
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
        "description": "~$80 platform fee per deployment, paid in the native token of the chain you deploy on. Network gas is charged separately by the blockchain and is not included.",
        "priceValidUntil": "2027-12-31"
      },
      "featureList": [
        "Token deployment in under 60 seconds",
        "15 EVM mainnets supported",
        "No coding skills required",
        "Built on OpenZeppelin's audited ERC20 libraries",
        "Fixed supply — no mint, pause, blacklist or tax functions in the deployed contract",
        "Automatic source verification on block explorers",
        "Built-in liquidity tools for Uniswap and other DEXs",
        "Non-custodial — the deployer receives the entire supply"
      ],
      "installUrl": "https://evmint.io/create"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Cryptocurrency Creator FAQ",
      "url": "https://evmint.io/cryptocurrency-creator",
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
          "name": "Cryptocurrency Creator",
          "item": "https://evmint.io/cryptocurrency-creator"
        }
      ]
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      <SEO
        title="Cryptocurrency Creator: Make Your Own Coin | EVMint"
        description="Create your own cryptocurrency without writing code. Fixed supply, no owner key, no mint function. ~$80 platform fee plus network gas, on 15 EVM chains."
        keywords="cryptocurrency creator, create cryptocurrency, crypto token maker, launch crypto token, make your own cryptocurrency, crypto coin creator, digital currency maker, blockchain token generator, defi token creator"
        canonical="/cryptocurrency-creator"
        structuredData={structuredData}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-hairline-1 rounded-full text-xs font-semibold text-cyan-300 uppercase tracking-widest mb-6">
              Start here
            </span>

            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white leading-[1.08] mb-6">
              Create your own cryptocurrency,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                starting from nothing
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-4">
              This page assumes you have never deployed a smart contract and are not sure what half
              the words mean. We explain them, then you fill in four fields and confirm one
              transaction. Your token is live in under 60 seconds.
            </p>

            <p className="text-base text-gray-400 leading-relaxed mb-8">
              What you get is a plain, fixed-supply ERC20 token on any of 15 EVM networks — the
              same kind of contract behind USDC, UNI and LINK, minus everything you do not need.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/create"
                onClick={() => trackButtonClick(analytics, 'cta_primary_cryptocurrency', 'hero_section')}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
              >
                Create your token
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-sm text-gray-400 leading-snug">
                ~$80 platform fee, paid in the chain's native token.<br className="hidden sm:block" />
                Network gas is extra and goes to the blockchain, not to us.
              </p>
            </div>
          </motion.header>

          {/* ── Glossary ─────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Six words, in plain English
            </h2>
            <p className="text-gray-400 mb-8">
              Everything else on this page is built from these. None of them are as complicated as
              they sound.
            </p>

            <dl className="grid sm:grid-cols-2 gap-3">
              {glossary.map(item => (
                <div
                  key={item.term}
                  className="bg-surface-1 border border-hairline-1 rounded-card p-5 hover:border-hairline-2 transition-[border-color] duration-200"
                >
                  <dt className="text-white font-display font-semibold tracking-tight mb-2">
                    {item.term}
                  </dt>
                  <dd className="text-sm text-gray-400 leading-relaxed">{item.plain}</dd>
                </div>
              ))}
            </dl>
          </motion.section>

          {/* ── What gets deployed ───────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              What the contract can and cannot do
            </h2>
            <p className="text-gray-400 mb-8">
              Most token generators hand you a contract with an admin key attached. Ours does not
              have one — there is no address anywhere in the code with special powers, including
              yours and including ours.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-surface-1 border border-hairline-1 rounded-card p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  Functions it has
                </h3>
                <ul className="space-y-2.5">
                  {['transfer', 'transferFrom', 'approve', 'allowance', 'balanceOf', 'totalSupply', 'name / symbol / decimals'].map(fn => (
                    <li key={fn} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="text-cyan-400 mt-px" aria-hidden="true">+</span>
                      <code className="font-mono text-[13px] text-gray-200">{fn}</code>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  The nine standard ERC20 methods, plus two read-only constants recording the
                  platform fee. Nothing else.
                </p>
              </div>

              <div className="bg-surface-1 border border-hairline-1 rounded-card p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  Functions it does not
                </h3>
                <ul className="space-y-2.5">
                  {[
                    ['mint', 'supply can never grow'],
                    ['pause', 'transfers can never be frozen'],
                    ['blacklist', 'no wallet can be blocked'],
                    ['owner', 'no privileged address exists'],
                    ['setTax', 'no fee on transfers'],
                    ['upgrade', 'the code can never change']
                  ].map(([fn, why]) => (
                    <li key={fn} className="flex items-start gap-2.5 text-sm">
                      <span className="text-gray-400 mt-px" aria-hidden="true">−</span>
                      <span>
                        <code className="font-mono text-[13px] text-gray-400 line-through decoration-gray-600">{fn}</code>
                        <span className="text-gray-400"> — {why}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  A contract-level rug pull needs one of these. None exist.
                </p>
              </div>
            </div>

            <div className="mt-3 bg-surface-1 border border-hairline-1 rounded-card p-5">
              <p className="text-sm text-gray-400 leading-relaxed">
                <strong className="text-gray-200 font-semibold">Read it yourself.</strong>{' '}
                The ERC20 logic comes from OpenZeppelin's libraries, which are audited and used
                across most of the ecosystem. On top of them sits a short constructor that mints
                your supply and forwards the platform fee — and that's the whole contract. It is
                source-verified on the block explorer the moment you deploy, so you never have to
                take our word for what it does.
              </p>
            </div>
          </motion.section>

          {/* ── Cost ─────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              What it costs, split honestly
            </h2>
            <p className="text-gray-400 mb-8">
              Two separate charges land in the same wallet confirmation. They are not the same
              thing and only one of them is ours.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-surface-2 border border-hairline-1 rounded-card p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Paid to EVMint
                </p>
                <p className="text-3xl font-display font-bold tracking-tight text-white tabular-nums mb-3">
                  ~$80
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A flat platform fee, sent as the value of the deployment transaction in whatever
                  the chain's native token is: 0.02 ETH, 0.075 BNB, 400 POL, 4 AVAX, 80 xDAI. Same
                  target price on every network. One-off, no subscription.
                </p>
              </div>

              <div className="bg-surface-2 border border-hairline-1 rounded-card p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Paid to the network
                </p>
                <p className="text-3xl font-display font-bold tracking-tight text-white tabular-nums mb-3">
                  + gas
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Charged on top, by the blockchain, at whatever the going rate is when you press
                  confirm. A few cents on Base, Arbitrum, Optimism or Polygon. Several dollars on
                  Ethereum mainnet when the network is busy. Your wallet shows the exact figure
                  before you sign.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Steps ────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-8">
              The whole process, five steps
            </h2>

            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="bg-surface-1 border border-hairline-1 rounded-card p-5 sm:p-6 hover:border-hairline-2 transition-[border-color] duration-200"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-control bg-surface-3 border border-hairline-1 flex items-center justify-center text-sm font-display font-bold text-cyan-300 tabular-nums"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                        <h3 className="text-lg font-display font-semibold tracking-tight text-white">
                          {step.title}
                        </h3>
                        <span className="text-[11px] font-mono text-gray-400 bg-surface-2 border border-hairline-1 rounded px-2 py-0.5">
                          {step.hint}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>

          {/* ── Chains ───────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Where you can deploy
            </h2>
            <p className="text-gray-400 mb-8">
              {MAINNET_CHAINS.length} EVM mainnets, one price. If you have no strong opinion, Base
              is the sensible default: cheap, fast, and easy for newcomers to bridge into.
            </p>

            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MAINNET_CHAINS.map(chain => (
                <li
                  key={chain.id}
                  className="flex items-center gap-2.5 min-h-[44px] px-3 bg-surface-1 border border-hairline-1 rounded-control"
                >
                  <ChainIcon chainId={chain.id} size={20} />
                  <span className="text-sm text-gray-300 truncate">{chain.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              For the technical detail on what a chain choice actually changes, see the{' '}
              <Link to="/erc20-token-generator" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                ERC20 token generator
              </Link>{' '}
              page, which lists the exact native-token fee for each network.
            </p>
          </motion.section>

          {/* ── Comparison ───────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              EVMint versus doing it yourself
            </h2>
            <p className="text-gray-400 mb-8">
              The realistic alternative is not hiring an agency. It is opening Remix and working
              through it — which is genuinely free, and genuinely more work.
            </p>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[36rem]">
                  <caption className="sr-only">
                    EVMint compared with deploying an ERC20 token yourself using Remix or Foundry
                  </caption>
                  <thead>
                    <tr className="border-b border-hairline-1">
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5 w-1/3">Step</th>
                      <th scope="col" className="text-left font-semibold text-white py-3 px-5">EVMint</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">DIY with Remix or Foundry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Getting the contract', 'Fixed template, no admin functions', 'Find a template and hope it is not backdoored'],
                      ['Compiling', 'Pre-compiled, already tested', 'Install a toolchain, match the compiler version'],
                      ['Deploying', 'One wallet confirmation', 'Pay gas, debug a failed deploy, pay again'],
                      ['Verifying source', 'Automatic on the explorer', 'Flatten the source and submit it per explorer'],
                      ['Adding liquidity', 'Built into the Liquidity page', 'Call the router contract yourself'],
                      ['Cost', '~$80 platform fee + gas', 'Gas only, but unpredictable'],
                      ['You need to know', 'Nothing', 'Solidity, and enough Web3 to debug it']
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
            <p className="text-sm text-gray-400 mt-4">
              If you already write Solidity, the DIY column is the better deal and we would rather
              say so. The fee buys the parts in between.
            </p>
          </motion.section>

          {/* ── After deployment ─────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-8">
              What happens next
            </h2>

            <div className="space-y-3">
              {[
                {
                  h: 'Your source code goes public',
                  p: 'EVMint submits the contract for verification on Etherscan, Basescan, Arbiscan or whichever explorer covers your chain. Anyone can then read exactly what your token does — which is the point of having nothing to hide in it.'
                },
                {
                  h: 'People can add it to a wallet',
                  p: 'Share the contract address. MetaMask, Rabby, Trust Wallet and Coinbase Wallet all accept a raw ERC20 address and will show the holder their balance.'
                },
                {
                  h: 'A pool makes it tradeable',
                  p: 'Until you pair it with ETH or a stablecoin on a DEX, your token exists but has no price. The ratio you deposit sets the opening price; everything after that is the market.'
                },
                {
                  h: 'Aggregators pick it up',
                  p: 'DEXScreener indexes new pools automatically, usually within minutes. CoinGecko and CoinMarketCap are manual applications and want a verified contract, real trading volume and a genuine web presence first.'
                }
              ].map(item => (
                <div key={item.h} className="bg-surface-1 border border-hairline-1 rounded-card p-5 sm:p-6">
                  <h3 className="text-base font-display font-semibold tracking-tight text-white mb-2">{item.h}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.p}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── FAQ ──────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-8">
              Questions beginners actually ask
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
                        aria-controls={`crypto-faq-${index}`}
                        id={`crypto-faq-q-${index}`}
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
                      Always mounted, collapsed with CSS only. FAQPage structured
                      data is only eligible for rich results when the answer text
                      is present in the delivered HTML, and the JSON-LD above is
                      generated from this same `faqs` array — so the two cannot
                      disagree. `invisible` keeps collapsed content out of the
                      a11y tree without removing it from the document.
                    */}
                    <div
                      id={`crypto-faq-${index}`}
                      role="region"
                      aria-labelledby={`crypto-faq-q-${index}`}
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
            className="bg-surface-2 border border-hairline-1 rounded-panel p-8 sm:p-10 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-3">
              Four fields and one confirmation
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              You can walk through the form without connecting a wallet. Nothing is charged until
              you sign the deployment transaction.
            </p>
            <Link
              to="/create"
              onClick={() => trackButtonClick(analytics, 'cta_secondary_cryptocurrency', 'bottom_section')}
              className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
            >
              Open the creator
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
