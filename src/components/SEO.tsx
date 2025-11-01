import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object
}

export default function SEO({ 
  title = "Base Token Creator - Launch ERC20 Tokens in 5 Seconds | 90% Lower Fees",
  description = "🚀 Create ERC20 tokens on 8+ EVM blockchains instantly! No coding required. Deploy for <$3, add liquidity on DEXes, auto-verify. Support for Base, Arbitrum, Polygon, BSC & more. Start your crypto empire today!",
  keywords = "base token creator, erc20 token generator, base blockchain, create cryptocurrency, meme coin creator, token launcher base, no code crypto, defi token maker, uniswap token, base layer 2, coinbase base, basescan token, crypto token generator, ethereum alternative, cheap token deployment",
  canonical,
  ogImage = "/og-image.png",
  noIndex = false,
  structuredData
}: SEOProps) {
  const siteUrl = "https://base-token-creator.com"
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl

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
      <meta name="author" content="Base Token Creator" />
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
      <meta property="og:image:alt" content="Multi-Chain Token Creator - Launch ERC20 tokens on 8+ EVM blockchains" />
      <meta property="og:site_name" content="Base Token Creator" />
      <meta property="og:locale" content="en_US" />
      <meta property="fb:app_id" content="your-facebook-app-id" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@BaseTokenCreator" />
      <meta name="twitter:creator" content="@BaseTokenCreator" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content="Base Token Creator - Launch ERC20 tokens on Base blockchain" />
      
      {/* Additional Social Meta */}
      <meta property="article:publisher" content="https://twitter.com/BaseTokenCreator" />
      <meta property="article:author" content="Base Token Creator Team" />
      <meta property="article:section" content="Cryptocurrency" />
      <meta property="article:tag" content="Base Blockchain" />
      <meta property="article:tag" content="ERC20 Tokens" />
      <meta property="article:tag" content="DeFi" />
      <meta property="article:tag" content="Token Creator" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}