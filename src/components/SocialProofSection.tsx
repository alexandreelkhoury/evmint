import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * SocialProofSection — real tech integrations, no fake stats
 * Shows what EVMint actually uses under the hood
 */

const integrations = [
  { name: 'OpenZeppelin', detail: 'Audited contract templates', what: 'Smart contract base' },
  { name: 'Uniswap V2', detail: 'Liquidity pool creation', what: 'DEX integration' },
  { name: 'Etherscan', detail: 'Auto source verification', what: 'Contract verification' },
  { name: 'Blockscout', detail: 'Verification for Orbit chains', what: 'Contract verification' },
  { name: 'Privy', detail: 'Wallet authentication', what: 'Wallet connection' },
  { name: 'Viem + Wagmi', detail: 'Multi-chain interactions', what: 'Blockchain layer' },
]

const qualities = [
  { label: 'Non-custodial', desc: 'You deploy, you own. We never hold your tokens or keys.' },
  { label: 'Open contracts', desc: 'Every deployed contract is auto-verified. Read the source on-chain.' },
  { label: 'Same price everywhere', desc: '~$80 equivalent on any chain. No hidden fees, no subscription.' },
]

export default function SocialProofSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-16 relative" aria-labelledby="trust-heading">
      <div className="max-w-5xl mx-auto px-4">
        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 id="trust-heading" className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center mb-6">
            Built on
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {integrations.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                className="text-center py-3 px-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <p className="text-sm font-semibold text-gray-200">{item.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core qualities */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid sm:grid-cols-3 gap-6"
        >
          {qualities.map((q) => (
            <div key={q.label}>
              <h3 className="text-sm font-semibold text-white mb-1">{q.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{q.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
