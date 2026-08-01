import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import SEO from '../components/SEO'
import { guidesById, guideSequence, countGuideWords, buildGuideHowTo } from '../data/guidesData'
import {
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function GuidePage() {
  const { guideId } = useParams<{ guideId: string }>()
  const analytics = useFirebaseAnalytics()

  const guide = guideId ? guidesById[guideId] ?? null : null

  // Get next guide in sequence
  const getNextGuide = (currentGuideId: string) => {
    const currentIndex = guideSequence.indexOf(currentGuideId)
    if (currentIndex >= 0 && currentIndex < guideSequence.length - 1) {
      const nextGuideId = guideSequence[currentIndex + 1]
      return {
        id: nextGuideId,
        title: guidesById[nextGuideId]?.title || 'Next Guide'
      }
    }
    return null
  }
  
  const nextGuide = guide ? getNextGuide(guide.id) : null

  useEffect(() => {
    if (guide) {
      trackPageView(analytics, `guide_${guide.id}`)
    }
  }, [analytics, guide])

  // Structured data for the guide: HowTo (shared with the guides index),
  // breadcrumbs and an Article record. No dates are emitted — we do not track
  // per-guide publication/modification dates, and inventing them is worse than
  // omitting them. wordCount is measured from the prose actually rendered.
  const guideStructuredData: object[] | undefined = guide ? [
    buildGuideHowTo(guide),
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
          "name": "Guides",
          "item": "https://evmint.io/guides"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": guide.title,
          "item": `https://evmint.io/guides/${guide.id}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": guide.title,
      "description": guide.description,
      "url": `https://evmint.io/guides/${guide.id}`,
      "author": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EVMint",
        "url": "https://evmint.io",
        "logo": {
          "@type": "ImageObject",
          "url": "https://evmint.io/og-image.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://evmint.io/guides/${guide.id}`
      },
      "articleSection": "Cryptocurrency Guides",
      "wordCount": countGuideWords(guide)
    }
  ] : undefined

  if (!guide) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Guide Not Found
          </h1>
          <p className="text-gray-400 mb-8">The guide you're looking for doesn't exist.</p>
          <Link 
            to="/guides"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
          >
            Back to Guides
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-900 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <SEO
        title={`${guide.title} | Token Creation Guide`}
        description={guide.description}
        keywords={`erc20 token, ${guide.keywords}, tutorial, guide, blockchain, evm, how to, step by step`}
        canonical={`/guides/${guide.id}`}
        structuredData={guideStructuredData}
      />

      <div className="relative py-12">
        {/* Static background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.05)_0%,_transparent_60%)]" />
        </div>

        <div className="relative z-10">
          {/* Breadcrumb */}
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <nav className="text-sm text-gray-400">
              <Link to="/guides" className="hover:text-blue-400 transition-colors">Guides</Link>
              <span className="mx-2">→</span>
              <span className="text-white">{guide.title}</span>
            </nav>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                {guide.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {guide.description}
              </p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{guide.time} read</span>
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  <span>{guide.difficulty} level</span>
                </div>
                {guide.cost && (
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span>Cost: {guide.cost}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pool Types Comparison (if applicable) */}
          {guide.poolTypes && (
            <div className="max-w-4xl mx-auto px-4 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Pool Type Information</h2>
              <div className="grid md:grid-cols-1 gap-6">
                {guide.poolTypes.map((pool, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.2) }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{pool.title}</h3>
                    <p className="text-gray-300 mb-4">{pool.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Pros:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {pool.pros.map((pro, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircleIcon className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Cons:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {pool.cons.map((con, i) => (
                            <li key={i} className="flex items-center">
                              <ExclamationTriangleIcon className="h-3 w-3 text-red-400 mr-2 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <span className="text-sm text-blue-400 font-medium">Best for: {pool.bestFor}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Important Warnings */}
          {guide.warnings && (
            <div className="max-w-4xl mx-auto px-4 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Important Considerations</h2>
              <div className="space-y-4">
                {guide.warnings.map((warning, index) => (
                  <motion.div
                    key={index}
                    className="bg-yellow-500/10 border-yellow-500/20 border rounded-xl p-6 backdrop-blur-sm"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.2) }}
                  >
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-6 w-6 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white mb-2">{warning.title}</h3>
                        <p className="text-gray-300">{warning.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Step-by-Step Guide</h2>
            {guide.steps.map((step, index) => (
              <motion.div
                key={index}
                className="mb-12"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.2) }}
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-white/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200">
                  {/* Step Header */}
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>

                  {/* Step Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Action items:</h3>
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-gray-300">
                              {typeof detail === 'string' ? (
                                <span>{detail}</span>
                              ) : (
                                <div>
                                  <span>{detail.text}</span>
                                  <br />
                                  <Link 
                                    to={detail.link.url}
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm mt-1 font-medium"
                                  >
                                    {detail.link.text}
                                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start">
                        <LightBulbIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">Pro Tip</h4>
                          <p className="text-gray-300 text-sm">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="max-w-4xl mx-auto px-4 mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
              <SparklesIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              {nextGuide ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-4">Continue Learning</h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Ready for the next step? Learn about {nextGuide.title.toLowerCase()}.
                  </p>
                  <Link 
                    to={`/guides/${nextGuide.id}`}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Next Guide
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    You've completed all our guides! Put your knowledge to work and create your token now.
                  </p>
                  <Link 
                    to="/create"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Create Your Token
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Guide Navigation */}
          <motion.div 
            className="max-w-4xl mx-auto px-4 mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <Link 
                  to="/guides"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-xl hover:border-white/30 transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2 rotate-180" />
                  Back to All Guides
                </Link>
              </div>
              
              <div className="flex-1 flex justify-end">
                {nextGuide ? (
                  <Link 
                    to={`/guides/${nextGuide.id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    Next Guide
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                ) : (
                  <Link 
                    to="/create"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-[background-color,color,border-color,box-shadow,opacity] duration-200 transform hover:scale-105"
                  >
                    Start Creating
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}