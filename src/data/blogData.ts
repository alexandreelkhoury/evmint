/**
 * Backwards-compatible view of the blog: metadata with the body inlined.
 *
 * DEPRECATED. This module statically imports all 20 post bodies, so anything
 * that imports it pulls the entire blog (68 kB raw / 21 kB gzip) into its
 * chunk — including the index, which only needs titles and excerpts.
 *
 * Use the split API instead:
 *   list views  ->  ./blogMeta  (blogPostsMeta, getFeaturedPostMetas, …)
 *   article     ->  ./blogMeta  (getBlogPostMeta) + ./blogBody (loadPostBody)
 *
 * Note this file does NOT re-export ./blogBody: pulling the lazy loader in here
 * would make Rollup see the bodies both statically and dynamically, which stops
 * them splitting and costs ~5 kB of dead import stubs. Import ./blogBody direct.
 *
 * Once BlogPage.tsx and BlogPostPage.tsx have moved over, delete this file.
 */
import { blogPostsMeta } from './blogMeta'
import type { BlogPostMeta } from './blogMeta'
import body_howToCreateErc20Token2026 from './posts/how-to-create-erc20-token-2026'
import body_ethereumVsBaseBestChainTokenDeployment from './posts/ethereum-vs-base-best-chain-token-deployment'
import body_completeMemeCoinLaunchGuide from './posts/complete-meme-coin-launch-guide'
import body_addingLiquidityUniswapStepByStep from './posts/adding-liquidity-uniswap-step-by-step'
import body_multiChainTokenStrategy2026 from './posts/multi-chain-token-strategy-2026'
import body_howToCreateTokenOnBase from './posts/how-to-create-token-on-base'
import body_howToCreateTokenOnArbitrum from './posts/how-to-create-token-on-arbitrum'
import body_howToCreateTokenOnRobinhoodChain from './posts/how-to-create-token-on-robinhood-chain'
import body_howToCreateTokenOnPolygon from './posts/how-to-create-token-on-polygon'
import body_howToCreateTokenOnBsc from './posts/how-to-create-token-on-bsc'
import body_howToCreateTokenOnEthereum from './posts/how-to-create-token-on-ethereum'
import body_howToCreateTokenOnOptimism from './posts/how-to-create-token-on-optimism'
import body_howToCreateTokenOnMonad from './posts/how-to-create-token-on-monad'
import body_howToCreateTokenOnMegaeth from './posts/how-to-create-token-on-megaeth'
import body_howToCreateTokenOnAvalanche from './posts/how-to-create-token-on-avalanche'
import body_howToCreateTokenOnFantom from './posts/how-to-create-token-on-fantom'
import body_howToCreateTokenOnBlast from './posts/how-to-create-token-on-blast'
import body_howToCreateTokenOnGnosis from './posts/how-to-create-token-on-gnosis'
import body_howToCreateTokenOnMoonbeam from './posts/how-to-create-token-on-moonbeam'
import body_howToCreateTokenOnWorldChain from './posts/how-to-create-token-on-world-chain'

export {
  blogPostsMeta,
  getBlogPostMeta,
  getFeaturedPostMetas,
  getPostMetasByCategory,
  getRelatedPostMetas
} from './blogMeta'
export type { BlogPostMeta } from './blogMeta'

export interface BlogPost extends BlogPostMeta {
  content: string
}

const bodies: Record<string, string> = {
  'how-to-create-erc20-token-2026': body_howToCreateErc20Token2026,
  'ethereum-vs-base-best-chain-token-deployment': body_ethereumVsBaseBestChainTokenDeployment,
  'complete-meme-coin-launch-guide': body_completeMemeCoinLaunchGuide,
  'adding-liquidity-uniswap-step-by-step': body_addingLiquidityUniswapStepByStep,
  'multi-chain-token-strategy-2026': body_multiChainTokenStrategy2026,
  'how-to-create-token-on-base': body_howToCreateTokenOnBase,
  'how-to-create-token-on-arbitrum': body_howToCreateTokenOnArbitrum,
  'how-to-create-token-on-robinhood-chain': body_howToCreateTokenOnRobinhoodChain,
  'how-to-create-token-on-polygon': body_howToCreateTokenOnPolygon,
  'how-to-create-token-on-bsc': body_howToCreateTokenOnBsc,
  'how-to-create-token-on-ethereum': body_howToCreateTokenOnEthereum,
  'how-to-create-token-on-optimism': body_howToCreateTokenOnOptimism,
  'how-to-create-token-on-monad': body_howToCreateTokenOnMonad,
  'how-to-create-token-on-megaeth': body_howToCreateTokenOnMegaeth,
  'how-to-create-token-on-avalanche': body_howToCreateTokenOnAvalanche,
  'how-to-create-token-on-fantom': body_howToCreateTokenOnFantom,
  'how-to-create-token-on-blast': body_howToCreateTokenOnBlast,
  'how-to-create-token-on-gnosis': body_howToCreateTokenOnGnosis,
  'how-to-create-token-on-moonbeam': body_howToCreateTokenOnMoonbeam,
  'how-to-create-token-on-world-chain': body_howToCreateTokenOnWorldChain
}

export const blogPosts: BlogPost[] = blogPostsMeta.map(meta => ({
  ...meta,
  content: bodies[meta.slug] ?? ''
}))

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category)
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPost(currentSlug)
  if (!currentPost) return []

  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post =>
      post.tags.some(tag => currentPost.tags.includes(tag)) ||
      post.category === currentPost.category
    )
    .slice(0, limit)
}
