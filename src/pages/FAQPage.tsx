import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
import { layout, typography, colors } from '../styles/designSystem'
import { faqs } from '../data/faqData'

export default function FAQPage() {
  const analytics = useFirebaseAnalytics()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [allFaqsOpen, setAllFaqsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    trackPageView(analytics, 'faq')
  }, [analytics])

  const toggleAllFaqs = () => {
    setAllFaqsOpen(!allFaqsOpen)
    setOpenFaq(null) // Reset individual FAQ state
  }

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const faqPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Base Token Creation FAQ",
    "description": "Frequently asked questions about creating ERC20 tokens on Base blockchain",
    "url": "https://evmint.io/faq",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <SEO
        title="Base Token Creation FAQ | Frequently Asked Questions"
        description="Get instant answers to common questions about Base token creation, deployment costs, liquidity management, security, and exchange listings."
        keywords="base token faq, token creation questions, base blockchain faq, erc20 token help, token deployment cost, liquidity questions"
        canonical="/faq"
        structuredData={faqPageStructuredData}
      />
      
      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* Modern FAQ Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-8"
          >
            <span className="text-sm font-medium text-purple-400">❓ Expert Q&A</span>
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <br />
            <span className={typography.pageTitleWhite}>Questions</span>
          </motion.h1>
          
          <motion.p 
            className={`${typography.subtitle} max-w-4xl mx-auto text-xl sm:text-2xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Get instant answers to the most common questions about Base token creation and management
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center items-center space-x-8 mt-12"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{faqs.length}</div>
              <div className="text-sm text-gray-400">Expert Answers</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">{filteredFaqs.length}</div>
              <div className="text-sm text-gray-400">Found Results</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${colors.input} pl-12 pr-4 py-4 text-lg rounded-2xl w-full`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* FAQ Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              onClick={toggleAllFaqs}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center px-6 py-3 ${colors.primaryButton} rounded-2xl font-medium`}
            >
              {allFaqsOpen ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  Collapse All
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Expand All
                </>
              )}
            </motion.button>
            
            <div className="flex items-center space-x-4">
              <div className={`${typography.bodyTextSmall} ${colors.badgeNeutral} px-4 py-2 rounded-full`}>
                {filteredFaqs.length} Questions {searchTerm && 'Found'}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/guides"
                  className={`inline-flex items-center px-6 py-3 ${colors.secondaryButton} rounded-2xl font-medium`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read Guides
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Modern FAQ Grid */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="grid gap-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index || allFaqsOpen
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    className="group relative"
                  >
                    {/* Modern card with design system glassmorphism */}
                    <div className={`
                      relative rounded-2xl border transition-all duration-300
                      ${isOpen 
                        ? `${colors.glassCardHover} shadow-2xl` 
                        : `${colors.glassCard} hover:border-white/[0.2] hover:bg-white/[0.1]`
                      }
                    `}>
                      
                      {/* Question button */}
                      <motion.button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full text-left p-6 lg:p-8 focus:outline-none"
                        whileTap={{ scale: 0.995 }}
                      >
                        <div className="flex items-start justify-between">
                          {/* Question text */}
                          <h3 className={`
                            ${typography.cardTitleSmall} text-lg lg:text-xl pr-8 leading-relaxed transition-all duration-300
                            ${isOpen 
                              ? `text-transparent ${typography.gradientText}` 
                              : `${typography.pageTitleWhite} group-hover:text-gray-100`
                            }
                          `}>
                            {faq.question}
                          </h3>
                          
                          {/* Expand icon */}
                          <div className={`
                            flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                            ${isOpen 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 rotate-180' 
                              : 'bg-white/10 group-hover:bg-white/20'
                            }
                          `}>
                            <motion.svg 
                              className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-blue-400'}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </div>
                        </div>
                      </motion.button>
                      
                      {/* Answer section with smooth animation */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                              <div className="border-t border-gradient-to-r from-white/20 to-white/5 pt-6">
                                <motion.p 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 }}
                                  className={`${typography.bodyText} text-gray-300 leading-relaxed text-base lg:text-lg mb-4`}
                                >
                                  {faq.answer}
                                </motion.p>

                                {/* Related guide link */}
                                {faq.relatedGuide && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="mt-4 pt-4 border-t border-white/10"
                                  >
                                    <Link
                                      to={`/guides?guide=${faq.relatedGuide}`}
                                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                      </svg>
                                      <span className="font-medium">Learn more in our guide</span>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </Link>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 blur-sm -z-10"></div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className={`${typography.cardTitle} mb-4`}>No questions found</h3>
                <p className={`${typography.bodyText} mb-6 max-w-md mx-auto`}>
                  Try adjusting your search terms or browse all questions.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className={`inline-flex items-center px-6 py-3 ${colors.primaryButton} rounded-2xl font-medium`}
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Ready to Launch CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-20"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 rounded-3xl blur-3xl"></div>
            
            {/* CTA Card */}
            <div className={`relative ${colors.glassCard} rounded-3xl p-8 lg:p-12 text-center border-white/[0.2]`}>
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center p-3">
                  <img 
                    src="/LOGO.png" 
                    alt="EVMint Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-4`}>
                  Still Have Questions?
                </h3>
                
                <p className={`${typography.subtitle} text-xl mb-8 max-w-2xl mx-auto`}>
                  Ready to put your knowledge into action? Create your first Base token now!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/create"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} font-semibold text-lg`}
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Your Token
                </motion.a>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/guides"
                    className={`inline-flex items-center px-8 py-4 ${colors.secondaryButton} font-medium text-lg`}
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Learn Step-by-Step
                  </Link>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-white/10">
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className={`w-5 h-5 ${typography.success.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={typography.label}>No Code Required</span>
                </div>
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className={`w-5 h-5 ${typography.info.replace('font-medium', '')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className={typography.label}>5s Deploy</span>
                </div>
                <div className={`flex items-center space-x-2 ${typography.bodyText}`}>
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className={typography.label}>Low Cost</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}