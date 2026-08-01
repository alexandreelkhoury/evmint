import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { getBlogPostMeta, getRelatedPostMetas } from '../data/blogMeta'
import type { BlogPostMeta } from '../data/blogMeta'
import { loadPostBody } from '../data/blogBody'
import { colors, layout } from '../styles/designSystem'
import { loggers } from '../utils/logger'

// Sentinel for "the body chunk failed to load", distinct from null (still
// loading) and '' (a genuinely empty post).
const BODY_LOAD_FAILED = Symbol('body-load-failed')

/**
 * Bodies already fetched in this session. loadPostBody() goes through the ES
 * module cache anyway, but that cache is only reachable via a promise — this
 * one lets a re-visit render the article on the first pass with no skeleton.
 */
const bodyCache = new Map<string, string>()

// ---------------------------------------------------------------------------
// Inline markdown
// ---------------------------------------------------------------------------

/**
 * `code` | **bold** | [text](href)
 *
 * Code spans come first so a span containing brackets or asterisks is taken
 * whole and never re-parsed. Bold comes before links so `**[x](/y)**` matches
 * as bold-wrapping-a-link rather than leaving a stray `**` behind; `[**x**](/y)`
 * still matches as a link because the scan starts at the `[`, where the bold
 * alternative cannot apply. Either way the captured inner text is re-parsed.
 */
const INLINE_TOKEN = /`([^`]+)`|\*\*([\s\S]+?)\*\*|\[([^\]]+)\]\(([^()\s]+)\)/g

/** Depth cap so a pathological `**[**a**](/x)**` cannot recurse forever. */
const MAX_INLINE_DEPTH = 3

interface LinkTarget {
  href: string
  external: boolean
}

const SITE_ORIGIN = 'https://evmint.io'

/**
 * Resolve a markdown href to something safe to put in the DOM, or null to drop
 * the link and keep only its text.
 *
 * The gate is the URL parser, not a regex: it lowercases the scheme, decodes
 * escapes and strips the tab/newline characters that `java\tscript:alert(1)`
 * hides behind — all tricks a `/^https?:/` test waves straight through. Only
 * http(s) survives, so `javascript:`, `data:`, `vbscript:` and `file:` are out.
 *
 * Not DOMPurify, despite it being a dependency already: vite.config.ts puts
 * dompurify in the `vendor-utils` manual chunk, which the app *entry* imports,
 * so pulling it in here adds ~23 kB raw / ~8.7 kB gzip to every route in the
 * site (measured) to validate six hardcoded hrefs. URL is free and stricter on
 * scheme parsing. If DOMPurify is ever wanted here, move it out of
 * `vendor-utils` first.
 */
function resolveHref(raw: string): LinkTarget | null {
  const value = raw.trim()
  if (!value) return null

  let parsed: URL
  try {
    parsed = new URL(value, SITE_ORIGIN)
  } catch {
    return null
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null

  // Internal links keep their authored relative form so react-router handles
  // them client-side. Note the negative lookahead: `//evil.com` is a
  // protocol-relative URL, and routing to it would hand <Link> an off-site
  // path, so only a single leading slash (or a bare fragment) counts.
  if (value.startsWith('#') || /^\/(?!\/)/.test(value)) {
    return { href: value, external: false }
  }

  // An absolute URL back to our own origin is still an internal route — send it
  // through <Link> rather than making the reader reload the whole app.
  if (parsed.origin === SITE_ORIGIN) {
    return { href: `${parsed.pathname}${parsed.search}${parsed.hash}`, external: false }
  }

  return { href: parsed.href, external: true }
}

const linkClass = 'text-purple-400 hover:text-purple-300 underline underline-offset-2 decoration-purple-400/40 hover:decoration-purple-300 transition-colors'

/**
 * Turn one line of markdown into React nodes. Returns an array so callers can
 * drop it straight into JSX children.
 */
function renderInline(text: string, keyPrefix: string, depth = 0): (string | JSX.Element)[] {
  if (!text) return []
  if (depth >= MAX_INLINE_DEPTH) return [text]

  const nodes: (string | JSX.Element)[] = []
  // Fresh regex per call: INLINE_TOKEN is stateful (/g) and this recurses.
  const pattern = new RegExp(INLINE_TOKEN.source, 'g')
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    lastIndex = pattern.lastIndex

    const key = `${keyPrefix}-${match.index}`
    const [, code, bold, linkText, linkHref] = match

    if (code !== undefined) {
      nodes.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-white/10 text-purple-200 font-mono text-[0.9em]">
          {code}
        </code>
      )
      continue
    }

    if (bold !== undefined) {
      nodes.push(
        <strong key={key} className="text-white font-semibold">
          {renderInline(bold, key, depth + 1)}
        </strong>
      )
      continue
    }

    const children = renderInline(linkText, key, depth + 1)
    const target = resolveHref(linkHref)

    // Unsafe or unsupported scheme: keep the label, drop the link.
    if (!target) {
      nodes.push(<span key={key}>{children}</span>)
      continue
    }

    nodes.push(
      target.external ? (
        <a key={key} href={target.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {children}
        </a>
      ) : (
        <Link key={key} to={target.href} className={linkClass}>
          {children}
        </Link>
      )
    )
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/**
 * The `|---|:--:|` row that promotes the line above it to a header. Its presence
 * is what makes a run of pipe lines a table rather than prose that happens to
 * contain a pipe, so the pattern is anchored and deliberately strict.
 */
const TABLE_DIVIDER = /^\|(?:\s*:?-+:?\s*\|)+$/

type CellAlign = 'left' | 'center' | 'right'

const alignClass: Record<CellAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

/** `| a | b |` -> `['a', 'b']`. The outer pipes produce empty edges; drop them. */
function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim())
}

function readAlignment(spec: string): CellAlign {
  const left = spec.startsWith(':')
  const right = spec.endsWith(':')
  if (left && right) return 'center'
  if (right) return 'right'
  return 'left'
}

/**
 * Render a GFM pipe table: header row, divider, then body rows.
 *
 * Every cell goes through renderInline, so `**bold**`, `code` and links behave
 * exactly as they do in a paragraph. Ragged rows are squared off against the
 * header width rather than dropped — a missing cell renders empty, and a cell
 * past the last header column would have no header to sit under.
 *
 * The scroll wrapper is what keeps a wide table off the page's own scrollbar:
 * `min-w-*` on the <table> lets it outgrow a 360px viewport, and `overflow-x-auto`
 * on the bounded wrapper catches the overflow instead of the document.
 */
function renderTable(rows: string[], key: number) {
  const headers = splitRow(rows[0])
  const aligns = splitRow(rows[1]).map(readAlignment)
  const body = rows.slice(2).map(splitRow)

  return (
    <div key={key} className="mb-6 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {headers.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400 ${alignClass[aligns[i] ?? 'left']}`}
              >
                {renderInline(cell, `th-${key}-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              {headers.map((_, c) => (
                <td
                  key={c}
                  className={`px-4 py-3 align-top text-gray-300 ${alignClass[aligns[c] ?? 'left']}`}
                >
                  {renderInline(row[c] ?? '', `td-${key}-${r}-${c}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Block markdown
// ---------------------------------------------------------------------------

/**
 * Render a post body.
 *
 * Heading policy: the page header already renders the post title as the one and
 * only <h1>, and every body opens with a `#` restating that same title. So the
 * leading `#` is dropped rather than demoted — demoting it would leave every
 * article starting with an <h2> that reads as a near-duplicate of the <h1>
 * directly above it. A `#` anywhere else (none today) is demoted to <h2> so a
 * stray top-level heading can never reintroduce a second <h1>. `##`/`###` keep
 * their existing levels, leaving the outline h1 -> h2 -> h3 with no gaps.
 */
function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let seenContent = false

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul'
      elements.push(
        <ListTag key={elements.length} className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} list-inside space-y-2 mb-6 text-gray-300`}>
          {currentList.map((item, i) => (
            <li key={i} className="leading-relaxed">{renderInline(item, `li-${elements.length}-${i}`)}</li>
          ))}
        </ListTag>
      )
      currentList = []
      listType = null
    }
  }

  // Indexed rather than forEach: a table spans several lines, so the loop has
  // to look ahead at the divider and then consume the rows it swallowed.
  for (let index = 0; index < lines.length; index++) {
    const trimmedLine = lines[index].trim()

    // Empty line
    if (!trimmedLine) {
      flushList()
      continue
    }

    // Headers
    if (trimmedLine.startsWith('# ')) {
      flushList()
      // The leading title heading is already the page <h1>. Skip it.
      if (!seenContent) {
        seenContent = true
        continue
      }
      elements.push(
        <h2 key={index} className="text-2xl lg:text-3xl font-bold text-white mb-4 mt-8">
          {renderInline(trimmedLine.slice(2), `h-${index}`)}
        </h2>
      )
      continue
    }

    seenContent = true

    if (trimmedLine.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={index} className="text-2xl lg:text-3xl font-bold text-white mb-4 mt-8">
          {renderInline(trimmedLine.slice(3), `h-${index}`)}
        </h2>
      )
      continue
    }

    if (trimmedLine.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={index} className="text-xl lg:text-2xl font-bold text-white mb-3 mt-6">
          {renderInline(trimmedLine.slice(4), `h-${index}`)}
        </h3>
      )
      continue
    }

    // Lists
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      currentList.push(trimmedLine.slice(2))
      continue
    }

    if (/^\d+\.\s/.test(trimmedLine)) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      currentList.push(trimmedLine.replace(/^\d+\.\s/, ''))
      continue
    }

    // Tables. A pipe line only starts one if the very next line is a divider;
    // that check is what keeps prose containing a stray `|` out of a <table>.
    if (trimmedLine.startsWith('|') && TABLE_DIVIDER.test((lines[index + 1] ?? '').trim())) {
      flushList()

      const tableRows = [trimmedLine, lines[index + 1].trim()]
      let cursor = index + 2
      while (cursor < lines.length && lines[cursor].trim().startsWith('|')) {
        tableRows.push(lines[cursor].trim())
        cursor++
      }

      elements.push(renderTable(tableRows, index))
      index = cursor - 1
      continue
    }

    // A line that is nothing but one bold run acts as a sub-subheading.
    const wholeLineBold = /^\*\*([^*]+)\*\*$/.exec(trimmedLine)
    if (wholeLineBold) {
      flushList()
      elements.push(
        <p key={index} className="text-white font-semibold mb-2 mt-4">
          {renderInline(wholeLineBold[1], `b-${index}`, 1)}
        </p>
      )
      continue
    }

    // Regular paragraphs
    flushList()
    elements.push(
      <p key={index} className="text-gray-300 leading-relaxed mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
        {renderInline(trimmedLine, `p-${index}`)}
      </p>
    )
  }

  flushList()
  return elements
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`h-4 rounded bg-white/5 ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const analytics = useFirebaseAnalytics()

  // Metadata stays synchronous: it drives <SEO>, the 404 redirect and the <h1>,
  // and the prerender refuses to write a page whose <main> has no <h1>.
  const post = slug ? getBlogPostMeta(slug) : undefined
  const relatedPosts = slug ? getRelatedPostMetas(slug, 3) : []

  const [body, setBody] = useState<string | null | typeof BODY_LOAD_FAILED>(() => (slug ? bodyCache.get(slug) ?? null : null))

  useEffect(() => {
    if (!slug || !post) return

    const cached = bodyCache.get(slug)
    if (cached !== undefined) {
      setBody(cached)
      return
    }

    let cancelled = false
    setBody(null)
    loadPostBody(slug).then(text => {
      const resolved = text ?? ''
      bodyCache.set(slug, resolved)
      if (!cancelled) setBody(resolved)
    }).catch(error => {
      // A rejected dynamic import (stale chunk hash after a redeploy, dropped
      // connection) would otherwise leave the skeleton up forever. Not cached,
      // so navigating back retries.
      loggers.ui.error('Failed to load blog post body', { slug, error })
      if (!cancelled) setBody(BODY_LOAD_FAILED)
    })

    return () => {
      cancelled = true
    }
  }, [slug, post])

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
    "@type": "BlogPosting",
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

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-x-hidden">
      {/* Static background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.05)_0%,_transparent_60%)]" />
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
          transition={{ duration: 0.25 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {/* Category and Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-purple-500/20 rounded-full text-sm font-medium text-purple-400">
              {post.category}
            </span>
            <span className="text-gray-400 text-sm font-mono">{post.readTime} min read</span>
            <span className="text-gray-400 text-sm">
              Updated {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Title — the page's only <h1> */}
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
              <p className="text-gray-400 text-sm">{post.author.role}</p>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="max-w-4xl mx-auto mb-16"
          // Machine-readable "the body has arrived" flag for the prerender.
          data-post-loaded={body !== null && body !== BODY_LOAD_FAILED}
        >
          <div className="prose prose-invert prose-lg max-w-none">
            {body === null ? (
              <ArticleSkeleton />
            ) : body === BODY_LOAD_FAILED ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-gray-300">This article didn't finish loading.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 min-h-[44px] px-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  Reload the page
                </button>
              </div>
            ) : (
              renderContent(body)
            )}
          </div>
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-wrap gap-2 pb-8 border-b border-white/10">
            <span className="text-gray-400 mr-2">Tags:</span>
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
          transition={{ duration: 0.25, delay: 0.2 }}
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
            transition={{ duration: 0.25, delay: 0.2 }}
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

function RelatedPostCard({ post, index }: { post: BlogPostMeta; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(0.05 * index, 0.2) }}
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
            <span className="text-gray-400 font-mono">{post.readTime} min</span>
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
