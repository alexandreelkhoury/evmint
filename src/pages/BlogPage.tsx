import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { blogPosts, getFeaturedPosts, BlogPost } from '../data/blogData'
import { colors, typography, layout } from '../styles/designSystem'

const categories = ['All', 'Tutorials', 'Guides', 'Strategy']

export default function BlogPage() {
  const analytics = useFirebaseAnalytics()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    trackPageView(analytics, 'blog')
  }, [analytics])

  const featuredPosts = getFeaturedPosts()

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "EVMint Blog - Token Creation Guides & Tutorials",
    "description": "Expert guides on ERC20 token creation, multi-chain deployment, liquidity management, and cryptocurrency marketing strategies.",
    "url": "https://evmint.io/blog",
    "publisher": {
      "@type": "Organization",
      "name": "EVMint",
      "logo": {
        "@type": "ImageObject",
        "url": "https://evmint.io/logo.svg"
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://evmint.io/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      }
    }))
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <SEO
        title="EVMint Blog - Token Creation Guides, Tutorials & Strategies"
        description="Expert guides on creating ERC20 tokens, multi-chain deployment, meme coin launches, Uniswap liquidity, and cryptocurrency marketing. Learn from industry experts."
        keywords="crypto blog, token creation guides, erc20 tutorials, meme coin guide, uniswap liquidity, multi-chain strategy, defi blog"
        canonical="/blog"
        structuredData={blogStructuredData}
      />

      <div className={`relative z-10 ${layout.pageContainer} pb-20`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-8"
        >
          <h1 className={`${typography.pageTitle} mb-6`}>
            EVMint <span className={typography.pageTitleGradient}>Blog</span>
          </h1>

          <p className={`${typography.subtitle} max-w-3xl mx-auto mb-8`}>
            Expert guides on token creation, multi-chain deployment, and cryptocurrency strategies.
            Everything you need to launch and grow your crypto project.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <label htmlFor="blog-search" className="sr-only">Search articles</label>
            <input
              id="blog-search"
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${colors.input} pl-12 pr-4 py-3 rounded-xl w-full`}
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-[background-color,color,border-color] duration-200 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Posts */}
        {selectedCategory === 'All' && !searchTerm && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <FeaturedBlogCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* All Posts Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {searchTerm ? `Search Results (${filteredPosts.length})` : 'All Articles'}
          </h2>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`${typography.cardTitle} mb-4`}>No articles found</h3>
              <p className={typography.bodyText}>Try adjusting your search or filter.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className={`mt-4 px-6 py-2 ${colors.primaryButton} rounded-xl cursor-pointer`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.section>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`${colors.glassCard} rounded-2xl p-8 mt-16 text-center`}
        >
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Get the latest guides, tutorials, and strategies delivered to your inbox.
            No spam, just valuable content for token creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`${colors.input} flex-1 rounded-xl`}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 ${colors.primaryButton} rounded-xl font-medium whitespace-nowrap cursor-pointer`}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

function FeaturedBlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link to={`/blog/${post.slug}`} className="cursor-pointer">
        <div className={`${colors.glassCard} rounded-2xl overflow-hidden h-full flex flex-col`}>
          {/* Image placeholder with gradient */}
          <div className="h-48 bg-gradient-to-br from-purple-600/30 to-blue-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-purple-500/80 rounded-full text-xs font-medium text-white">
                {post.category}
              </span>
            </div>
            {/* Featured badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white">
                Featured
              </span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {post.author.avatar}
                </div>
                <span className="text-gray-400">{post.author.name}</span>
              </div>
              <span className="text-gray-500 font-mono">{post.readTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/blog/${post.slug}`} className="cursor-pointer">
        <div className={`${colors.glassCard} rounded-2xl p-6 h-full flex flex-col hover:border-purple-500/30 transition-[border-color] duration-200`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-medium text-purple-400">
              {post.category}
            </span>
            <span className="text-gray-500 text-xs font-mono">{post.readTime} min read</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
            <span className="text-gray-500">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-purple-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Read more
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
