import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { getBlogPost, getRelatedPosts, BlogPost } from '../data/blogData'
import { colors, typography, layout } from '../styles/designSystem'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const analytics = useFirebaseAnalytics()

  const post = slug ? getBlogPost(slug) : undefined
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : []

  useEffect(() => {
    if (post) {
      trackPageView(analytics, `blog_${post.slug}`)
    }
  }, [analytics, post])

  useEffect(() => {
    if (!post && slug) {
      navigate('/blog', { replace: true })
    }
  }, [post, slug, navigate])

  if (!post) {
    return null
  }

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://evmint.io${post.image}`,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "EVMint",
      "logo": {
        "@type": "ImageObject",
        "url": "https://evmint.io/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://evmint.io/blog/${post.slug}`
    }
  }

  // Parse content into sections for rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: JSX.Element[] = []
    let currentList: string[] = []
    let listType: 'ul' | 'ol' | null = null

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul'
        elements.push(
          <ListTag key={elements.length} className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} list-inside space-y-2 mb-6 text-gray-300`}>
            {currentList.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ListTag>
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      // Empty line
      if (!trimmedLine) {
        flushList()
        return
      }

      // Headers
      if (trimmedLine.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={index} className="text-3xl lg:text-4xl font-bold text-white mb-6 mt-8">
            {trimmedLine.slice(2)}
          </h1>
        )
        return
      }

      if (trimmedLine.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={index} className="text-2xl lg:text-3xl font-bold text-white mb-4 mt-8">
            {trimmedLine.slice(3)}
          </h2>
        )
        return
      }

      if (trimmedLine.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={index} className="text-xl lg:text-2xl font-bold text-white mb-3 mt-6">
            {trimmedLine.slice(4)}
          </h3>
        )
        return
      }

      // Bold text sections
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList()
        elements.push(
          <p key={index} className="text-white font-semibold mb-2 mt-4">
            {trimmedLine.slice(2, -2)}
          </p>
        )
        return
      }

      // Lists
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        currentList.push(trimmedLine.slice(2))
        return
      }

      if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ''))
        return
      }

      // Tables (simplified - just show as text)
      if (trimmedLine.startsWith('|')) {
        flushList()
        elements.push(
          <div key={index} className="font-mono text-sm text-gray-400 mb-2 overflow-x-auto">
            {trimmedLine}
          </div>
        )
        return
      }

      // Regular paragraphs
      flushList()
      elements.push(
        <p key={index} className="text-gray-300 leading-relaxed mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
          {trimmedLine}
        </p>
      )
    })

    flushList()
    return elements
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <SEO
        title={post.seo.title}
        description={post.seo.description}
        keywords={post.seo.keywords}
        canonical={`/blog/${post.slug}`}
        structuredData={articleStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title }
          ]}
        />

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {/* Category and Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-purple-500/20 rounded-full text-sm font-medium text-purple-400">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm font-mono">{post.readTime} min read</span>
            <span className="text-gray-500 text-sm">
              Updated {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-400 mb-8 leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 pb-8 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {post.author.avatar}
            </div>
            <div>
              <p className="text-white font-semibold">{post.author.name}</p>
              <p className="text-gray-500 text-sm">{post.author.role}</p>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="prose prose-invert prose-lg max-w-none">
            {renderContent(post.content)}
          </div>
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-wrap gap-2 pb-8 border-b border-white/10">
            <span className="text-gray-500 mr-2">Tags:</span>
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 hover:bg-white/10 transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`${colors.glassCard} rounded-2xl p-8 max-w-4xl mx-auto mb-16 text-center`}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Create Your Token?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Put what you've learned into action. Deploy your ERC20 token on 15+ chains in just 5 seconds.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/create"
              className={`inline-flex items-center px-8 py-4 ${colors.primaryButton} rounded-xl font-semibold text-lg`}
            >
              Create Your Token Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <RelatedPostCard key={relatedPost.slug} post={relatedPost} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

function RelatedPostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`}>
        <div className={`${colors.glassCard} rounded-2xl p-6 h-full flex flex-col hover:border-purple-500/30 transition-[border-color] duration-200`}>
          <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-medium text-purple-400 w-fit mb-4">
            {post.category}
          </span>

          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2 flex-1">
            {post.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-mono">{post.readTime} min</span>
            <span className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Read
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
