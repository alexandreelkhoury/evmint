import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

/**
 * Query params that genuinely define a distinct page and therefore have to
 * survive into the canonical URL. Everything else — utm_*, ref, fbclid, gclid,
 * and UI-state params such as /liquidity?token= — is noise that would split one
 * page into a family of near-duplicate canonicals.
 *
 * Keyed by path so a param that is page-defining on one route does not leak
 * into routes where it is only prefill state: the same contract address exists
 * on every chain, so /token/:address?chain= is a different page per chain,
 * while /liquidity?chain= is just a preselected dropdown.
 */
const PAGE_DEFINING_PARAMS: ReadonlyArray<readonly [RegExp, readonly string[]]> = [
  [/^\/token\//, ['chain']]
]

/**
 * Build a self-referential canonical path from the route the user is actually
 * on. Used only when a page forgets to pass `canonical` — the previous fallback
 * was the bare origin, which told every such page "I am the homepage".
 */
function canonicalPathFrom(pathname: string, search: string): string {
  // Collapse trailing slashes (root excepted) so /blog and /blog/ agree.
  const path = pathname.replace(/\/+$/, '') || '/'

  const allowed = PAGE_DEFINING_PARAMS.find(([pattern]) => pattern.test(path))?.[1]
  if (!allowed || !search) return path

  const incoming = new URLSearchParams(search)
  const kept = new URLSearchParams()
  // Iterate the allowlist, not the incoming params, so the canonical is stable
  // regardless of the order the params happened to arrive in.
  for (const key of allowed) {
    const value = incoming.get(key)
    if (value) kept.set(key, value)
  }

  const query = kept.toString()
  return query ? `${path}?${query}` : path
}

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object | object[]
}

export default function SEO({
  title = "EVMint - Multi-Chain EVM Token Launcher | Deploy on 15+ Chains",
  description = "Create ERC20 tokens on 15+ EVM blockchains instantly! No coding required. Deploy on Ethereum, Base, Arbitrum, Polygon, BSC & more. Ultra-low fees. Auto-verify. Start your crypto project today! ",
  keywords = "evmint, evm token creator, multi-chain token launcher, erc20 token generator, create cryptocurrency, meme coin creator, no code crypto, defi token maker, ethereum token, base token, arbitrum token, polygon token, bsc token, multi-chain deployment, cheap token deployment",
  canonical,
  ogImage = "/og-image.png",
  noIndex = false,
  structuredData
}: SEOProps) {
  const siteUrl = "https://evmint.io"

  // Router state, not window.location. Both work under the Puppeteer prerender
  // (it renders the real client app in a real browser), but useLocation also
  // stays correct across client-side navigation and in-page query changes.
  // Only the path is ever taken from the location: the prerender crawls
  // http://localhost:4173, so the origin must always be the hardcoded one.
  const { pathname, search } = useLocation()
  const fullCanonical = `${siteUrl}${canonical ?? canonicalPathFrom(pathname, search)}`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="EVMint" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//base.org" />
      <link rel="dns-prefetch" href="//basescan.org" />
      <link rel="dns-prefetch" href="//uniswap.org" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="EVMint - Launch ERC20 tokens on 15+ EVM blockchains" />
      <meta property="og:site_name" content="EVMint" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@evmint" />
      <meta name="twitter:creator" content="@evmint" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content="EVMint - Multi-chain EVM token launcher" />
      
      {/* Additional Social Meta */}
      <meta property="article:publisher" content="https://twitter.com/evmint" />
      <meta property="article:author" content="EVMint Team" />
      <meta property="article:section" content="Cryptocurrency" />
      <meta property="article:tag" content="EVM Blockchains" />
      <meta property="article:tag" content="ERC20 Tokens" />
      <meta property="article:tag" content="DeFi" />
      <meta property="article:tag" content="Token Creator" />

      {/* Structured Data - supports single object or array of objects */}
      {structuredData && (
        Array.isArray(structuredData)
          ? structuredData.map((data, index) => (
              <script key={index} type="application/ld+json">
                {JSON.stringify(data)}
              </script>
            ))
          : (
              <script type="application/ld+json">
                {JSON.stringify(structuredData)}
              </script>
            )
      )}
    </Helmet>
  )
}