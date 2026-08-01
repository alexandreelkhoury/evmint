import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
// TeamSection removed — contained fabricated team members
import SocialProofSection from '../components/SocialProofSection'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { colors, typography, layout } from '../styles/designSystem'

export default function AboutPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'about')
  }, [analytics])

  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About EVMint - Multi-Chain Token Creation Platform",
    "description": "Learn about EVMint, the leading multi-chain token creation platform. Meet our team of blockchain experts and discover our mission.",
    "url": "https://evmint.io/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "EVMint",
      "description": "EVMint is a no-code platform for creating ERC20 tokens on 15+ EVM blockchains",
      "url": "https://evmint.io",
      "foundingDate": "2024",
      "sameAs": [
        "https://twitter.com/evmint",
        "https://github.com/evmint"
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SEO
        title="About EVMint - Our Mission, Team & Story | Multi-Chain Token Platform"
        description="EVMint is a no-code multi-chain token launcher. Deploy ERC-20 tokens on 15+ EVM blockchains in under 60 seconds. Built with OpenZeppelin contracts, auto-verified on block explorers."
        keywords="about evmint, evmint team, blockchain company, token creation platform, erc20 platform, crypto startup"
        canonical="/about"
        structuredData={aboutStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 pt-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-6"
          >
            <span className="text-sm font-medium text-pink-400">About Us</span>
          </motion.div>

          <h1 className={`${typography.pageTitle} mb-6`}>
            Democratizing <span className={typography.pageTitleGradient}>Token Creation</span>
          </h1>

          <p className={`${typography.subtitle} max-w-3xl mx-auto`}>
            EVMint was founded with a simple mission: make token creation accessible to everyone.
            No coding required. No complexity. Just your idea, deployed in 5 seconds.
          </p>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`${colors.glassCard} rounded-2xl p-8`}>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                We envision a world where anyone can participate in the token economy.
                Whether you're an entrepreneur with a game-changing idea, a community
                leader building a movement, or a developer exploring new possibilities,
                EVMint provides the tools to bring your vision to life.
              </p>
            </div>

            <div className={`${colors.glassCard} rounded-2xl p-8`}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                Remove every barrier between great ideas and blockchain deployment.
                We've spent years building infrastructure that handles the complexity
                so you don't have to. Secure smart contracts, multi-chain deployment,
                liquidity tools - all accessible through a simple interface.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
        >
          <div className={`${colors.glassCard} rounded-2xl p-8 lg:p-12`}>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-center">
              Our Story
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 text-gray-400 leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              <p>
                EVMint started in 2024 when our founders, frustrated by the complexity of token deployment,
                asked a simple question: "Why is creating a token so hard?"
              </p>

              <p>
                At the time, launching an ERC20 token required hiring expensive developers, understanding
                Solidity, navigating complex deployment processes, and managing multiple blockchain networks.
                The barrier to entry was immense - countless great ideas never made it on-chain simply because
                the technical hurdles were too high.
              </p>

              <p>
                Drawing from our experience at leading crypto companies, we built EVMint to be the antidote
                to this complexity. We abstracted away all the technical challenges while maintaining the
                security and reliability that blockchain applications demand.
              </p>

              <p>
                Today, EVMint supports 15+ EVM blockchains including Ethereum, Base, Arbitrum, and the
                recently launched Robinhood Chain. Our platform enables creators from all backgrounds
                to deploy professional-grade tokens without writing a single line of code.
              </p>

              <p className="font-semibold text-white">
                This is just the beginning. We're continuing to add new chains, new features, and new ways
                for creators to succeed in Web3.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">
            Our Values
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Security First",
                description: "Every line of code is audited. We use OpenZeppelin contracts, the industry gold standard, ensuring your tokens are production-ready from day one."
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Accessibility",
                description: "No coding skills? No problem. We've designed EVMint so that anyone, regardless of technical background, can create professional-grade tokens."
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Transparency",
                description: "No hidden fees. No lock-ins. You own 100% of your tokens. Our pricing is clear, and our contracts are verified and readable by anyone."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={`${colors.glassCard} rounded-2xl p-6 text-center`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-400">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        {/* TeamSection removed — fabricated team members */}

        {/* Social Proof */}
        <SocialProofSection />

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`${colors.glassCard} rounded-2xl p-8 lg:p-12 text-center mt-16`}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of creators who have launched their tokens with EVMint.
            Your idea deserves to be on-chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/create"
                className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} rounded-xl font-semibold text-lg`}
              >
                Create Your Token
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/blog"
                className={`inline-flex items-center px-8 py-4 ${colors.secondaryButton} rounded-xl font-semibold text-lg`}
              >
                Read Our Blog
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
