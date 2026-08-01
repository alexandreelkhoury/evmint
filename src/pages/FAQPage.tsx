import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
import { faqs } from '../data/faqData'

export default function FAQPage() {
  const analytics = useFirebaseAnalytics()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    trackPageView(analytics, 'faq')
  }, [analytics])

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const faqPageStructuredData: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "ERC20 Token Creation FAQ - Frequently Asked Questions",
      "description": "Get instant answers to common questions about ERC20 token creation, deployment costs, liquidity management, security, and exchange listings on 15+ EVM blockchains.",
      "url": "https://evmint.io/faq",
      "inLanguage": "en-US",
      "dateModified": "2026-02-01",
      "publisher": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
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
          "name": "FAQ",
          "item": "https://evmint.io/faq"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ERC20 Token Creation FAQ",
      "description": "Expert answers to frequently asked questions about creating and managing ERC20 tokens on EVM blockchains",
      "url": "https://evmint.io/faq",
      "isPartOf": {
        "@type": "WebSite",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
      "about": {
        "@type": "Thing",
        "name": "ERC20 Token Creation",
        "description": "Creating and deploying ERC20 tokens on EVM-compatible blockchains"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h3", ".text-gray-300"]
      },
      "significantLink": [
        "https://evmint.io/create",
        "https://evmint.io/guides"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <SEO
        title="ERC20 Token Creation FAQ | Frequently Asked Questions"
        description="Get instant answers to common questions about ERC20 token creation, deployment costs, liquidity management, security, and exchange listings on EVM blockchains."
        keywords="erc20 token faq, token creation questions, evm blockchain faq, erc20 token help, token deployment cost, liquidity questions"
        canonical="/faq"
        structuredData={faqPageStructuredData}
      />

      <div className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-base text-gray-400 leading-relaxed">
            Answers to common questions about ERC20 token creation and management.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <label htmlFor="faq-search" className="sr-only">Search questions</label>
          <input
            id="faq-search"
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-150"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results count when searching */}
        {searchTerm && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for "{searchTerm}"
          </p>
        )}

        {/* FAQ List */}
        <div className="divide-y divide-gray-800/80">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={index}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} FAQ: ${faq.question}`}
                    className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
                  >
                    <span className={`text-[15px] font-medium leading-relaxed transition-colors duration-150 ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.relatedGuide && (
                            <Link
                              to={`/guides?guide=${faq.relatedGuide}`}
                              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-500 hover:text-blue-400 transition-colors duration-150"
                            >
                              <span>Read related guide</span>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-500 mb-4">
                No questions match your search.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-500 hover:text-blue-400 cursor-pointer transition-colors duration-150"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
