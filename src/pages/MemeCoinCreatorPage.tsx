import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import ChainIcon from '../components/ChainIcon'
import { CHAIN_FEES, getChainById } from '../config/chains'
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
    question: 'How much does it cost to launch a meme coin?',
    answer: "A ~$80 platform fee, paid in the native token of whichever chain you pick — 0.02 ETH on Base, Arbitrum, Optimism or Ethereum, 0.075 BNB on BSC, 400 POL on Polygon. Network gas is charged separately on top: a few cents on a Layer 2, several dollars on Ethereum mainnet when it is busy. You will also need real money for the liquidity pool, which is usually the bigger number."
  },
  {
    question: 'Can holders check that my coin is not a rug?',
    answer: 'They can check the contract, and it will come back clean: there is no mint function, no owner, no pause, no blacklist and no transfer tax, so token sniffers and honeypot checkers have nothing to flag. What they cannot check from the contract is whether you sell your own bag or pull the liquidity — those are wallet and pool decisions. Lock your LP if you want to answer that question too.'
  },
  {
    question: 'What actually makes a meme coin work?',
    answer: 'A community that keeps showing up, an idea that is easy to retell, honest liquidity and a founder who does not vanish after launch day. The contract takes under 60 seconds; everything that determines the outcome happens after it.'
  },
  {
    question: 'Should I use a huge supply like one trillion?',
    answer: 'It changes nothing mechanically — a trillion tokens at a tiny unit price and a million tokens at a larger one are the same market cap. Large supplies are popular because holding millions of something feels good. Just make sure your own messaging talks about market cap, not unit price, or you will attract people who do not understand what they bought.'
  },
  {
    question: 'How do I get listed on DEXScreener and CoinGecko?',
    answer: 'DEXScreener indexes new pools automatically, usually within minutes of your first liquidity being added — no application needed. CoinGecko and CoinMarketCap are manual submissions and expect a verified contract, sustained real trading volume, a working site and live social accounts before they will consider it.'
  },
  {
    question: 'Can I change the name or supply after launch?',
    answer: 'No. Name, symbol, decimals and supply are all baked into the contract at deployment and there is no admin function to change them. If you get the ticker wrong, the only fix is deploying again and paying again.'
  }
]

/** Chains worth recommending for a meme launch, with the fee read from config. */
const memeChains = [
  {
    id: 8453,
    pitch: 'Cheap, fast, and the easiest place for a normal person to bridge into. The default pick unless you have a reason.',
    tag: 'Start here'
  },
  {
    id: 42161,
    pitch: 'Deepest Layer 2 liquidity and a trading crowd that is already there. Slightly more serious energy than Base.',
    tag: 'Traders'
  },
  {
    id: 56,
    pitch: 'Enormous retail audience and a meme culture that never really left. PancakeSwap instead of Uniswap.',
    tag: 'Retail'
  },
  {
    id: 1,
    pitch: 'Maximum credibility and the deepest liquidity anywhere — and gas that can cost more than the fee itself.',
    tag: 'Expensive'
  }
]

const timeline = [
  {
    at: '0:00',
    title: 'Pick the chain',
    body: 'Network button in the header. Base if you are undecided.'
  },
  {
    at: '0:10',
    title: 'Name, ticker, supply',
    body: 'Four fields. All four are permanent, so read the ticker twice.'
  },
  {
    at: '0:25',
    title: 'Sign once',
    body: '~$80 fee goes out as the transaction value; gas is added by the chain.'
  },
  {
    at: '0:60',
    title: 'Contract is live',
    body: 'Full supply in your wallet, source verified on the explorer.'
  }
]

const mistakes: Array<{ h: string; p: string; link?: boolean }> = [
  {
    h: 'Launching with $500 of liquidity',
    p: 'A thin pool means a $200 buy moves the price 40%. It looks like a scam chart within the hour and the first sellers get destroyed. Fund the pool properly, or wait until you can.'
  },
  {
    h: 'Leaving the LP unlocked',
    p: 'The one thing your contract cannot solve for you. The token has no owner and no mint function, but liquidity you are able to withdraw is liquidity holders have to trust you not to withdraw. Lock it, and show the lock.'
  },
  {
    h: 'Bolting on clever tokenomics',
    p: 'Reflections, buy-and-burn taxes and anti-whale limits all need code paths that a honeypot checker cannot tell apart from a trap. A plain fixed-supply ERC20 is the boring, verifiable option — see the ',
    link: true
  },
  {
    h: 'Going quiet after launch day',
    p: 'Deployment is the fastest and least important part. The projects that survive are the ones still posting in week six.'
  }
]

/**
 * SEO Landing Page: Meme Coin Creator
 * Targets keyword: "meme coin creator"
 * The fastest-moving of the three landing pages — launch-day mechanics,
 * a timeline rather than an essay, and blunt about what can still go wrong.
 */
export default function MemeCoinCreatorPage() {
  const analytics = useFirebaseAnalytics()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    trackPageView(analytics, 'meme_coin_creator')
  }, [analytics])

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Meme Coin Creator - Launch Your Meme Token in Under 60 Seconds",
      "description": "Launch a meme coin on Base, Ethereum, BSC, Polygon and more. Fixed supply, no mint function, no owner. Add liquidity and grow your community. No coding required.",
      "url": "https://evmint.io/meme-coin-creator",
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
        "Meme coin deployment in under 60 seconds",
        "15 EVM mainnets supported, including Base, BSC and Polygon",
        "No coding skills required",
        "Built on OpenZeppelin's audited ERC20 libraries",
        "Fixed supply — no mint, pause, blacklist or transfer tax in the deployed contract",
        "Built-in liquidity tools for Uniswap and other DEXs",
        "Automatic source verification on block explorers",
        "Non-custodial — the entire supply is minted to the deployer"
      ],
      "installUrl": "https://evmint.io/create"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Meme Coin Creator FAQ",
      "url": "https://evmint.io/meme-coin-creator",
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
          "name": "Meme Coin Creator",
          "item": "https://evmint.io/meme-coin-creator"
        }
      ]
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      <SEO
        title="Meme Coin Creator - Launch a Token in 60s | EVMint"
        description="Launch a meme coin on Base, BSC, Ethereum and 12 more EVM chains. Fixed supply, no mint function, no owner key. ~$80 platform fee plus network gas."
        keywords="meme coin creator, create meme coin, meme token maker, launch meme coin, doge coin creator, shiba inu maker, pepe token creator, viral crypto"
        canonical="/meme-coin-creator"
        structuredData={structuredData}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-hairline-1 rounded-full text-xs font-semibold text-amber-300 uppercase tracking-widest mb-6">
              Ship it today
            </span>

            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-white leading-[1.03] mb-6">
              Launch the coin{' '}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                before the joke goes stale
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-4">
              Deployment takes under 60 seconds. What you get is deliberately boring: a fixed
              supply, no owner key, no mint function, nothing a honeypot checker can flag. The
              interesting part is what you do with it afterwards.
            </p>
            <p className="text-base text-gray-400 leading-relaxed mb-8">
              No presale mechanics, no bonding curve, no cut of your supply. Deploy, add liquidity
              when you are ready, go and be funny somewhere.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                to="/create"
                onClick={() => trackButtonClick(analytics, 'cta_primary_meme_coin', 'hero_section')}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
              >
                Launch your coin
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-sm text-gray-400 leading-snug">
                ~$80 platform fee in the chain's native token.<br className="hidden sm:block" />
                Gas is separate and goes to the network, not to us.
              </p>
            </div>
          </motion.header>

          {/* ── The clock ────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              The whole launch, on the clock
            </h2>
            <p className="text-gray-400 mb-8">
              One wallet signature, start to finish. Liquidity is a separate step whenever you are
              ready for it.
            </p>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {timeline.map(item => (
                <li
                  key={item.at}
                  className="bg-surface-1 border border-hairline-1 rounded-card p-5 hover:border-hairline-2 transition-[border-color] duration-200"
                >
                  <p className="text-2xl font-display font-bold tracking-tight text-amber-300 tabular-nums mb-3">
                    {item.at}
                  </p>
                  <h3 className="text-base font-display font-semibold tracking-tight text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ol>
          </motion.section>

          {/* ── Rug-proof by construction ────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              The contract cannot rug. You still can.
            </h2>
            <p className="text-gray-400 mb-8">
              Every meme coin buyer now pastes the address into a token sniffer before they touch
              it. Here is exactly what they will and will not find.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-surface-1 border border-hairline-1 rounded-panel p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  Impossible in the contract
                </h3>
                <ul className="space-y-2.5">
                  {[
                    'Minting more supply out of thin air',
                    'Pausing transfers so nobody can sell',
                    'Blacklisting a wallet that annoyed you',
                    'Adding a transfer tax after the fact',
                    'Upgrading the code to do any of the above'
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="text-amber-300 mt-px font-bold" aria-hidden="true">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  None of these functions exist in the deployed bytecode. There is no owner address
                  to hold them.
                </p>
              </div>

              <div className="bg-surface-1 border border-hairline-1 rounded-panel p-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">
                  Still entirely on you
                </h3>
                <ul className="space-y-2.5">
                  {[
                    'Selling the supply that was minted to your wallet',
                    'Withdrawing liquidity from an unlocked pool',
                    'Distributing fairly instead of to five alt wallets',
                    'Turning up after launch day'
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="text-gray-400 mt-px font-bold" aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  No token contract can fix these, and any platform claiming otherwise is selling
                  you something.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              The ERC20 logic comes from OpenZeppelin's audited libraries, and the contract is
              source-verified on the explorer the moment you deploy — so you and your holders can
              read exactly what shipped. Full function-by-function breakdown on the{' '}
              <Link to="/erc20-token-generator" className="text-amber-300 hover:text-amber-200 underline underline-offset-2">
                ERC20 token generator
              </Link>{' '}
              page.
            </p>
          </motion.section>

          {/* ── Cost ─────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Three costs, and only one is ours
            </h2>
            <p className="text-gray-400 mb-8">
              People quote the first number and forget the third. The third is the one that decides
              whether your chart looks real.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  amount: '~$80',
                  who: 'Platform fee → EVMint',
                  d: "Flat, one-off, sent as the value of the deployment transaction in the chain's native token. No subscription and no share of your supply."
                },
                {
                  amount: '+ gas',
                  who: 'Network fee → the chain',
                  d: 'Charged on top by the blockchain at the going rate. Cents on Base, Arbitrum or Polygon; several dollars on Ethereum mainnet under load.'
                },
                {
                  amount: 'your call',
                  who: 'Liquidity → the pool',
                  d: 'Real ETH or stablecoins you deposit alongside your tokens. Not a fee — you still own it — but it is the largest number in a serious launch.'
                }
              ].map(item => (
                <div key={item.who} className="bg-surface-2 border border-hairline-1 rounded-card p-5">
                  <p className="text-2xl font-display font-bold tracking-tight text-white tabular-nums mb-1">
                    {item.amount}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    {item.who}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Chain picks ──────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Where meme coins actually land
            </h2>
            <p className="text-gray-400 mb-8">
              All 15 supported mainnets work identically and cost the same ~$80 platform fee. These
              four are where the audience is.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3">
              {memeChains.map(pick => {
                const chain = getChainById(pick.id)
                if (!chain) return null
                return (
                  <li
                    key={pick.id}
                    className="bg-surface-1 border border-hairline-1 rounded-card p-5 hover:border-hairline-2 transition-[border-color] duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <ChainIcon chainId={chain.id} size={28} />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-display font-semibold tracking-tight text-white truncate">
                          {chain.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono tabular-nums">
                          {CHAIN_FEES[chain.id]} {chain.nativeCurrency.symbol} fee + gas
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-surface-2 border border-hairline-1 rounded px-2 py-1">
                        {pick.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{pick.pitch}</p>
                  </li>
                )
              })}
            </ul>
          </motion.section>

          {/* ── Mistakes ─────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Four ways launches die
            </h2>
            <p className="text-gray-400 mb-8">
              None of these are contract problems, which is exactly why they keep happening.
            </p>

            <div className="space-y-2">
              {mistakes.map((m, i) => (
                <div
                  key={m.h}
                  className="flex items-start gap-4 bg-surface-1 border border-hairline-1 rounded-card p-5"
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-control bg-surface-3 border border-hairline-1 flex items-center justify-center text-sm font-display font-bold text-amber-300 tabular-nums"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-display font-semibold tracking-tight text-white mb-1.5">
                      {m.h}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {m.p}
                      {m.link && (
                        <>
                          <Link to="/erc20-token-generator" className="text-amber-300 hover:text-amber-200 underline underline-offset-2">
                            full ABI surface
                          </Link>
                          , which is the nine standard ERC20 functions plus two read-only
                          constants, and nothing else.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── DIY comparison ───────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Or do it yourself
            </h2>
            <p className="text-gray-400 mb-8">
              Genuinely an option, and free apart from gas. Here is what you are trading away.
            </p>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[34rem]">
                  <caption className="sr-only">
                    Launching with EVMint compared with deploying the contract yourself
                  </caption>
                  <thead>
                    <tr className="border-b border-hairline-1">
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5 w-1/4">Step</th>
                      <th scope="col" className="text-left font-semibold text-white py-3 px-5">EVMint</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Remix, by hand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Find a contract', 'Fixed template, no admin functions', 'Copy one off the internet and hope it is not backdoored'],
                      ['Deploy it', 'One confirmation, under 60 seconds', 'Pay gas, hit a revert, pay gas again'],
                      ['Verify the source', 'Automatic, before anyone asks', 'Flatten it and submit by hand, or look sketchy'],
                      ['Open the pool', 'Built into the Liquidity page', 'Call the router yourself and hope the ordering is right'],
                      ['Total', '~$80 fee + gas', 'Gas only, plus your evening']
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

          {/* ── FAQ ──────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-8">
              Meme coin FAQ
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
                        aria-controls={`meme-faq-${index}`}
                        id={`meme-faq-q-${index}`}
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
                      id={`meme-faq-${index}`}
                      role="region"
                      aria-labelledby={`meme-faq-q-${index}`}
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
              The contract is the easy part
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Under 60 seconds and one signature. Everything that decides whether it works happens
              after that — so get this bit over with.
            </p>
            <Link
              to="/create"
              onClick={() => trackButtonClick(analytics, 'cta_secondary_meme_coin', 'bottom_section')}
              className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
            >
              Launch your coin
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
