import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  {
    num: '1',
    title: 'Connect Wallet',
    desc: 'MetaMask, Coinbase Wallet, WalletConnect, or embedded wallet. No sign-up.',
  },
  {
    num: '2',
    title: 'Configure Token',
    desc: 'Enter name, symbol, and total supply. Pick any of 15+ chains. See gas estimate.',
  },
  {
    num: '3',
    title: 'Deploy',
    desc: 'One click. Contract deploys, gets verified on the block explorer, ready for liquidity.',
  },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="how-it-works" ref={ref} className="py-20" aria-labelledby="how-it-works-heading">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.25 }}
          className="text-center mb-12"
        >
          <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold text-white mb-3">
            How it works
          </h2>
          <p className="text-gray-400">
            From wallet connection to live token in under 60 seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }}
              className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-0.5">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="text-center mt-10"
        >
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg transition-[background-color] duration-150 active:scale-[0.97]"
          >
            Try it now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
