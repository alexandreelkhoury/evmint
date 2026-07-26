import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * ProblemSolutionSection — concise before/after framing
 * No fake stats, no eyebrow badges, no gradient text
 */
export default function ProblemSolutionSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-20 relative" aria-labelledby="why-heading">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 id="why-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Token creation shouldn't be hard
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The traditional way costs $5k–50k, takes weeks, and requires Solidity expertise. EVMint does it in 60 seconds for ~$80.
          </p>
        </motion.div>

        {/* Before / After comparison */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">The old way</h3>
            <ul className="space-y-3">
              {[
                'Hire a Solidity developer ($5k–50k)',
                'Write, test, and audit the contract',
                'Deploy manually via CLI or Remix',
                'Verify source code on each explorer',
                'Set up liquidity pool separately',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-white/[0.06] text-sm text-gray-500">
              2–4 weeks · $5,000–50,000 · Requires expertise
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-xl border border-green-500/20 bg-green-500/[0.03] p-6"
          >
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4">With EVMint</h3>
            <ul className="space-y-3">
              {[
                'Connect wallet, pick a chain',
                'Enter name, symbol, and supply',
                'Click deploy — contract goes live',
                'Auto-verified on the block explorer',
                'Add liquidity on built-in DEX integration',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-green-500/10 text-sm text-green-400/80">
              60 seconds · ~$80 · No code required
            </div>
          </motion.div>
        </div>

        {/* Supported chains callout */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          Works on Ethereum, Base, Arbitrum, Optimism, Robinhood Chain, Polygon, BSC, Avalanche, Monad, MegaETH, and more.
        </motion.p>
      </div>
    </section>
  )
}
