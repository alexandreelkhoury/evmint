import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import RiskDisclaimer from '../../components/RiskDisclaimer'
import RelatedPages from '../../components/RelatedPages'
import { motion } from 'framer-motion'
import { useFirebaseAnalytics } from '../../components/FirebaseProvider'
import { trackPageView, trackButtonClick, persistTrafficSource } from '../../utils/analytics'

const faqs = [
  {
    question: 'What is the cheapest way to create an ERC-20 token?',
    answer: 'The cheapest method is deploying via Remix IDE on a Layer 2 like Base or Arbitrum, where gas costs under $0.10 and there is no platform fee. If you do not write Solidity, the cheapest no-code option is EVMint at ~$80 flat fee plus minimal L2 gas. Deploying on Ethereum mainnet is the most expensive regardless of method.'
  },
  {
    question: 'Why does gas cost vary so much between chains?',
    answer: 'Gas costs depend on network congestion and the chain architecture. Ethereum L1 processes every transaction through thousands of validators, making block space expensive. Layer 2s like Base and Arbitrum batch transactions and post compressed data to Ethereum, splitting the security cost across all users in the batch. This makes individual transactions 100-500x cheaper.'
  },
  {
    question: 'Are there any hidden fees when creating a token?',
    answer: 'With EVMint, the only costs are the ~$80 platform fee and network gas. There are no subscription fees, no per-feature charges, and no ongoing costs. However, adding liquidity to a DEX is a separate transaction with its own gas cost, and you will need to fund the liquidity pool with ETH or another base pair token.'
  },
  {
    question: 'Does the token creation cost include adding liquidity?',
    answer: 'No. Token creation deploys the ERC-20 contract and mints the supply to your wallet. Adding liquidity to a DEX like Uniswap is a separate step that requires its own transaction, gas fees, and the tokens or ETH you want to pair. EVMint provides built-in liquidity tools but the cost of funding the pool is yours.'
  },
  {
    question: 'Can I create a token for free?',
    answer: 'You can create a token using Remix IDE or Hardhat with no platform fee — you pay only gas. On Ethereum mainnet that is $5-50, on Base or Arbitrum it is under $0.10. However, free methods require Solidity knowledge, manual compilation, manual deployment, and manual block explorer verification. There is no truly zero-cost method because every deployment requires gas.'
  }
]

const chainCosts = [
  { chain: 'Ethereum', layer: 'L1', gasCost: '$5 - $50', platformFee: '~$80', total: '$85 - $130' },
  { chain: 'Base', layer: 'L2', gasCost: '$0.01 - $0.10', platformFee: '~$80', total: '~$80' },
  { chain: 'Arbitrum', layer: 'L2', gasCost: '$0.01 - $0.10', platformFee: '~$80', total: '~$80' },
  { chain: 'Optimism', layer: 'L2', gasCost: '$0.01 - $0.10', platformFee: '~$80', total: '~$80' },
  { chain: 'Polygon', layer: 'L1', gasCost: '$0.01 - $0.05', platformFee: '~$80', total: '~$80' },
  { chain: 'BSC', layer: 'L1', gasCost: '$0.10 - $0.50', platformFee: '~$80', total: '~$80' },
  { chain: 'Avalanche', layer: 'L1', gasCost: '$0.10 - $1.00', platformFee: '~$80', total: '~$81' },
  { chain: 'Fantom', layer: 'L1', gasCost: '$0.01 - $0.05', platformFee: '~$80', total: '~$80' },
  { chain: 'Cronos', layer: 'L1', gasCost: '$0.05 - $0.20', platformFee: '~$80', total: '~$80' },
  { chain: 'Gnosis', layer: 'L1', gasCost: '$0.001 - $0.01', platformFee: '~$80', total: '~$80' },
  { chain: 'Celo', layer: 'L1', gasCost: '$0.001 - $0.01', platformFee: '~$80', total: '~$80' },
  { chain: 'Mantle', layer: 'L2', gasCost: '$0.01 - $0.05', platformFee: '~$80', total: '~$80' },
  { chain: 'Linea', layer: 'L2', gasCost: '$0.01 - $0.10', platformFee: '~$80', total: '~$80' },
  { chain: 'Scroll', layer: 'L2', gasCost: '$0.01 - $0.10', platformFee: '~$80', total: '~$80' },
  { chain: 'zkSync', layer: 'L2', gasCost: '$0.01 - $0.10', platformFee: '~$80', total: '~$80' }
]

export default function HowMuchDoesItCostPage() {
  const analytics = useFirebaseAnalytics()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    persistTrafficSource()
    trackPageView(analytics, 'how_much_does_it_cost_erc20')
  }, [analytics])

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How Much Does It Cost to Create an ERC-20 Token? [2026 Guide]",
      "description": "Complete cost breakdown for creating ERC-20 tokens in 2026. Compare costs across Ethereum, Base, Arbitrum, Polygon, BSC. No-code vs coding approaches.",
      "url": "https://evmint.io/blog/how-much-does-it-cost-to-create-erc20-token",
      "datePublished": "2026-08-01",
      "dateModified": "2026-08-18",
      "author": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "ERC-20 Token Cost FAQ",
      "url": "https://evmint.io/blog/how-much-does-it-cost-to-create-erc20-token",
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
          "name": "Blog",
          "item": "https://evmint.io/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "How Much Does It Cost to Create an ERC-20 Token?",
          "item": "https://evmint.io/blog/how-much-does-it-cost-to-create-erc20-token"
        }
      ]
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      <SEO
        title="How Much Does It Cost to Create an ERC-20 Token? [2026 Guide]"
        description="Complete cost breakdown for creating ERC-20 tokens in 2026. Compare costs across Ethereum, Base, Arbitrum, Polygon, BSC. No-code vs coding approaches."
        keywords="erc20 token cost, how much to create token, token creation price, create token ethereum cost, base token cost, cheapest token deployment"
        canonical="/blog/how-much-does-it-cost-to-create-erc20-token"
        structuredData={structuredData}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">

          {/* ── Hero ── */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-hairline-1 rounded-full text-xs font-mono text-purple-300 uppercase tracking-widest mb-6">
              Guide · August 2026
            </span>

            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white leading-[1.08] mb-6">
              How much does it cost to create{' '}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                an ERC-20 token?
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
              The cost of creating an ERC-20 token depends on three factors: the blockchain you deploy
              on, the deployment method you use, and current network congestion. This guide breaks down
              every cost component across 15 chains and two approaches so you know exactly what to expect.
            </p>
          </motion.header>

          {/* ── Atomic Answer ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-4">
              How much does it cost to create an ERC-20 token?
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-3xl mb-6">
              Creating an ERC-20 token costs between $0.50 and $150 depending on the blockchain and
              method. With EVMint, deployment costs ~$80 on any of 15+ chains, plus gas fees ranging
              from $0.01 on Layer 2s like Base to $5-50 on Ethereum mainnet. Using Remix IDE or
              Hardhat, you pay only gas — but you need Solidity skills and must handle verification
              manually.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { range: '$0.01 - $0.10', label: 'Gas on Layer 2s', desc: 'Base, Arbitrum, Optimism, Scroll, Linea, zkSync' },
                { range: '$5 - $50', label: 'Gas on Ethereum L1', desc: 'Varies with network congestion and gas price' },
                { range: '~$80', label: 'EVMint platform fee', desc: 'Same on every chain, covers deployment + verification' }
              ].map(item => (
                <div key={item.label} className="bg-surface-1 border border-hairline-1 rounded-card p-5">
                  <p className="text-2xl font-display font-bold tracking-tight text-white tabular-nums mb-1">{item.range}</p>
                  <p className="text-sm font-semibold text-purple-300 mb-2">{item.label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Cost Breakdown by Blockchain ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-2">
              Cost breakdown by blockchain
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Gas estimates are based on typical network conditions. Actual costs vary with congestion.
              The EVMint platform fee targets ~$80 on every chain, denominated in the native token.
            </p>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[40rem]">
                  <caption className="sr-only">ERC-20 token creation cost by blockchain</caption>
                  <thead>
                    <tr className="border-b border-hairline-1">
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Chain</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Layer</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Gas Cost</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Platform Fee</th>
                      <th scope="col" className="text-left font-semibold text-white py-3 px-5">Est. Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chainCosts.map((row, i) => (
                      <tr key={row.chain} className={i % 2 === 1 ? 'bg-surface-1' : undefined}>
                        <th scope="row" className="text-left font-medium text-gray-200 py-3 px-5">{row.chain}</th>
                        <td className="py-3 px-5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-surface-2 border border-hairline-1 rounded px-1.5 py-0.5">
                            {row.layer}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-gray-300 font-mono">{row.gasCost}</td>
                        <td className="py-3 px-5 text-gray-300">{row.platformFee}</td>
                        <td className="py-3 px-5 text-white font-semibold">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* ── No-Code vs Coding ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-4">
              No-code vs coding: which is cheaper?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
              Coding is cheaper in dollars — you pay only gas, which can be under $0.10 on a Layer 2.
              No-code platforms like EVMint add an ~$80 platform fee. The hidden cost of coding is
              time: writing Solidity, configuring the compiler, debugging reverts, and verifying on
              each block explorer. For a single deployment by an experienced developer, Remix is
              cheaper. For anyone else, the $80 buys back hours of work and eliminates the risk of
              deployment mistakes.
            </p>

            <div className="bg-surface-1 border border-hairline-1 rounded-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[36rem]">
                  <caption className="sr-only">No-code vs coding cost comparison</caption>
                  <thead>
                    <tr className="border-b border-hairline-1">
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Factor</th>
                      <th scope="col" className="text-left font-semibold text-white py-3 px-5">No-Code (EVMint)</th>
                      <th scope="col" className="text-left font-semibold text-gray-400 py-3 px-5">Coding (Remix/Hardhat)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Platform fee', '~$80', '$0'],
                      ['Gas fee', 'Same as coding', 'Same as no-code'],
                      ['Time investment', '~60 seconds', '30-60 minutes (first time)'],
                      ['Skill required', 'None', 'Solidity + Web3 tooling'],
                      ['Verification', 'Automatic', 'Manual per chain'],
                      ['Risk of mistakes', 'Template prevents errors', 'Depends on your code'],
                      ['Multi-chain cost', '$80 per chain + gas', 'Gas only, but re-verify each']
                    ].map(([factor, noCode, coding], i) => (
                      <tr key={factor} className={i % 2 === 1 ? 'bg-surface-1' : undefined}>
                        <th scope="row" className="text-left font-medium text-gray-400 py-3 px-5 align-top">{factor}</th>
                        <td className="py-3 px-5 text-gray-200 align-top">{noCode}</td>
                        <td className="py-3 px-5 text-gray-400 align-top">{coding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* ── Hidden Costs ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-4">
              Hidden costs to watch out for
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
              The deployment cost is only part of the picture. Several additional costs catch first-time
              token creators off guard. Understanding them upfront prevents budget surprises.
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                {
                  title: 'Gas price spikes',
                  desc: 'Ethereum L1 gas can spike 10x during high-demand events like NFT mints or market volatility. A deployment that costs $10 in gas normally might cost $100 during a spike. Layer 2s are mostly immune to this.'
                },
                {
                  title: 'Failed transactions',
                  desc: 'A reverted transaction still costs gas. With Remix, a misconfigured constructor or insufficient msg.value burns gas with no result. EVMint estimates gas and validates parameters before submission.'
                },
                {
                  title: 'Liquidity funding',
                  desc: 'Creating the token is step one. Adding liquidity to a DEX requires funding the pool with your tokens and a base pair (usually ETH or USDC). The amount is entirely up to you — there is no minimum.'
                },
                {
                  title: 'Multi-chain deployments',
                  desc: 'Deploying on three chains costs three times the gas and, with a platform, three times the platform fee. Factor in per-chain costs when planning a multi-chain launch.'
                }
              ].map(item => (
                <div key={item.title} className="bg-surface-1 border border-hairline-1 rounded-card p-5">
                  <h3 className="text-base font-display font-semibold tracking-tight text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Lowest Cost ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-4">
              How to create a token for the lowest cost
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
              Deploy on a Layer 2 like Base, Arbitrum, or Optimism. Gas on these chains is consistently
              under $0.10, making the total cost with EVMint approximately $80 regardless of network
              conditions. Avoid Ethereum mainnet unless you specifically need L1 liquidity. Deploy
              during low-traffic hours (weekday mornings UTC) if you are using Ethereum. And always
              check the gas estimate in your wallet before signing — never override the gas limit
              downward.
            </p>
          </motion.section>

          {/* ── Is It Worth Paying? ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-4">
              Is it worth paying for a token creator?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">
              If you write Solidity and deploy contracts regularly, a no-code platform is an unnecessary
              expense. Use Remix or Hardhat and pay gas only. If you do not write Solidity, the ~$80
              fee buys contract generation from audited OpenZeppelin code, automatic block explorer
              verification, built-in liquidity tools, and deployment in 60 seconds instead of an hour.
              For most non-technical users, the time savings alone justify the cost.
            </p>
          </motion.section>

          {/* ── FAQ ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-8">
              Frequently asked questions
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
                        aria-controls={`cost-faq-${index}`}
                        id={`cost-faq-q-${index}`}
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
                    <div
                      id={`cost-faq-${index}`}
                      role="region"
                      aria-labelledby={`cost-faq-q-${index}`}
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

          {/* ── Closing CTA ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="bg-surface-2 border border-hairline-1 rounded-panel p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8"
          >
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-white mb-2">
                Deploy a token for ~$80, any chain
              </h2>
              <p className="text-sm text-gray-400 max-w-md">
                No coding, no account. Fill in the form, sign one transaction, and your verified ERC-20 is live.
              </p>
            </div>
            <Link
              to="/create"
              onClick={() => trackButtonClick(analytics, 'create_token_cta', 'how_much_does_it_cost_bottom')}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-control shadow-lg shadow-blue-600/25 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
            >
              Create a token
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.section>

          <RelatedPages pages={[
            { to: '/comparisons/base-vs-ethereum-token-creation', title: 'Base vs Ethereum', desc: 'Compare the two most popular chains for deployment.' },
            { to: '/comparisons/best-evm-token-creator-2026', title: '6 Best Token Creators', desc: 'Compare EVMint with other platforms.' },
            { to: '/blog', title: 'All Blog Posts', desc: 'Chain guides, strategy, and tutorials.' },
            { to: '/guides/create-base-token', title: 'Step-by-Step Guide', desc: 'Create your first ERC-20 token in 4 steps.' },
            { to: '/erc20-token-generator', title: 'ERC-20 Generator', desc: 'Learn about ERC-20 token standards.' },
          ]} />

          <p className="text-xs text-gray-500 text-center mb-4">Last Updated: August 2026</p>
          <RiskDisclaimer />

        </div>
      </div>
    </div>
  )
}
