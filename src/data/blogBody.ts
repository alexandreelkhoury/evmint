/**
 * On-demand loader for blog post bodies.
 *
 * Deliberately a separate module from ./blogMeta so that list views (the blog
 * index, related-post rails, sitemaps) can import metadata without dragging a
 * single dynamic import into their chunk. Only the article view needs this.
 *
 * import.meta.glob leaves every body behind its own dynamic import, so Rollup
 * emits one chunk per post and reading one article downloads one article
 * (the shortest is ~0.5 kB gzip; the whole set is 21 kB gzip).
 */

const postBodyLoaders = import.meta.glob('./posts/*.ts') as Record<
  string,
  () => Promise<{ default: string }>
>

/** Slugs that actually have a body module on disk. */
export const postBodySlugs: string[] = Object.keys(postBodyLoaders)
  .map(file => file.slice('./posts/'.length, -'.ts'.length))

/**
 * Fetch a single post body. Resolves to null for an unknown slug so callers can
 * render a 404 rather than hang on a rejected import.
 */
export async function loadPostBody(slug: string): Promise<string | null> {
  const load = postBodyLoaders[`./posts/${slug}.ts`]
  if (!load) return null
  return (await load()).default
}
