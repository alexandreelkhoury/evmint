/**
 * Prerender Script for SEO
 * ------------------------
 * Boots `vite preview` against ./dist, drives a headless Chrome over every
 * crawlable route, and writes the fully-rendered DOM back into dist/<route>/index.html.
 *
 * Firebase Hosting always prefers a real static file over a rewrite, so these
 * files take precedence over the `**` -> /index.html SPA fallback in firebase.json.
 *
 * ESM module (package.json has "type": "module").
 * Run after a build:  node scripts/prerender.js
 */

import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const SITEMAP = path.join(ROOT_DIR, 'public', 'sitemap.xml')

const PORT = Number(process.env.PRERENDER_PORT || 4173)
const ORIGIN = `http://localhost:${PORT}`
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 4)
const NAV_TIMEOUT = 45_000
const SETTLE_MS = 1_200

/**
 * Routes that are not in sitemap.xml but still need static HTML.
 * The 4 guide detail pages are real, linked, indexable pages that the
 * sitemap currently omits.
 */
const EXTRA_ROUTES = [
  '/guides/create-base-token',
  '/guides/add-liquidity',
  '/guides/token-security',
  '/guides/advanced-features',
]

/**
 * Never prerender these. `/token/:address` is unbounded and user-generated;
 * it stays on the SPA fallback.
 *
 * `/guide` and `/multi-chain-token-creator` render a <Navigate>, not a page.
 * Prerendering one would capture the *redirect target's* DOM under the old
 * URL — a duplicate of /guides or / with a canonical pointing elsewhere, and
 * a real static file that would shadow the Firebase 301. Both are already
 * absent from sitemap.xml and EXTRA_ROUTES; this is the belt-and-braces.
 */
const EXCLUDE = [/^\/token\//, /^\/500$/, /^\/guide$/, /^\/multi-chain-token-creator$/]

// ---------------------------------------------------------------------------
// Route discovery
// ---------------------------------------------------------------------------

function discoverRoutes() {
  const routes = new Set(['/'])

  if (fs.existsSync(SITEMAP)) {
    const xml = fs.readFileSync(SITEMAP, 'utf8')
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      try {
        const { pathname } = new URL(m[1])
        routes.add(pathname.replace(/\/+$/, '') || '/')
      } catch {
        console.warn(`  ! skipping unparseable sitemap <loc>: ${m[1]}`)
      }
    }
  } else {
    console.warn(`! sitemap not found at ${SITEMAP} — falling back to EXTRA_ROUTES only`)
  }

  for (const r of EXTRA_ROUTES) routes.add(r)

  return [...routes]
    .filter((r) => !EXCLUDE.some((re) => re.test(r)))
    .sort((a, b) => a.localeCompare(b))
}

// ---------------------------------------------------------------------------
// Preview server
// ---------------------------------------------------------------------------

async function isPortTaken() {
  try {
    await fetch(ORIGIN + '/', { redirect: 'manual', signal: AbortSignal.timeout(1500) })
    return true
  } catch {
    return false
  }
}

async function waitForServer(server, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    // If vite died (e.g. EADDRINUSE under --strictPort) stop immediately rather
    // than silently prerendering against whatever else is on the port.
    if (server.exitCode !== null || server.signalCode !== null) return false
    try {
      const res = await fetch(ORIGIN + '/', { redirect: 'manual' })
      if (res.status < 500) return true
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  return false
}

async function startServer() {
  if (await isPortTaken()) {
    throw new Error(
      `Port ${PORT} is already in use. Stop the process holding it (or set PRERENDER_PORT) — ` +
        `otherwise the prerender would run against a stale server instead of ./dist.`
    )
  }

  // `detached: true` puts vite in its own process group so we can kill the
  // whole tree later. The original script used exec(), which only killed the
  // intermediate shell and left vite holding the port.
  const server = spawn(
    process.execPath,
    [path.join(ROOT_DIR, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT_DIR, detached: true, stdio: ['ignore', 'pipe', 'pipe'] }
  )

  let stderr = ''
  server.stderr.on('data', (d) => {
    stderr += d.toString()
  })
  server.on('error', (e) => {
    stderr += String(e)
  })

  if (!(await waitForServer(server))) {
    stopServer(server)
    throw new Error(`vite preview never became ready on ${ORIGIN}\n${stderr}`)
  }

  return server
}

function stopServer(server) {
  if (!server || server.killed) return
  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch {
    try {
      server.kill('SIGTERM')
    } catch {
      /* already gone */
    }
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function outputPathFor(route) {
  return route === '/'
    ? path.join(DIST_DIR, 'index.html')
    : path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html')
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage()
  page.setDefaultTimeout(NAV_TIMEOUT)

  try {
    await page.setViewport({ width: 1280, height: 900 })

    // networkidle0 never fires reliably here: Privy/wagmi keep sockets and
    // polling requests open for the life of the page. Wait on the DOM instead.
    const res = await page.goto(ORIGIN + route, {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT,
    })
    if (res && res.status() >= 400) {
      throw new Error(`HTTP ${res.status()}`)
    }

    // React has mounted once the splash inside #root is gone and <main> exists.
    await page.waitForSelector('main#main-content', { timeout: NAV_TIMEOUT })
    // ...and once the lazy route chunk has resolved past its Suspense fallback.
    await page.waitForFunction(
      () => {
        const main = document.querySelector('main#main-content')
        if (!main) return false
        // Blog bodies load via a dynamic import one hop after the <h1>, which
        // renders synchronously from metadata. Without this the article text
        // is captured only by winning a race against the settle delay.
        const article = main.querySelector('[data-post-loaded]')
        if (article && article.getAttribute('data-post-loaded') !== 'true') return false
        if (main.querySelector('h1')) return true
        return main.innerText.trim().length > 200
      },
      { timeout: NAV_TIMEOUT, polling: 200 }
    )
    // react-helmet-async commits the <head> in a separate pass that can land
    // well after the body renders (especially under concurrency). Wait for its
    // marker attribute rather than guessing with a sleep — without this, most
    // routes get written with the generic <title> from index.html.
    let helmetApplied = true
    try {
      await page.waitForFunction(
        () =>
          !!document.head.querySelector(
            'link[rel="canonical"][data-rh], meta[name="description"][data-rh]'
          ),
        { timeout: NAV_TIMEOUT, polling: 100 }
      )
    } catch {
      helmetApplied = false
    }
    await new Promise((r) => setTimeout(r, SETTLE_MS))

    const cleanup = await page.evaluate(() => {
      // 1. Strip the splash div and its 8s safety-net timer. Neither is in the
      //    prerendered output any more, so the timer is dead weight.
      document.getElementById('splash')?.remove()
      for (const s of document.querySelectorAll('script:not([src])')) {
        if (s.textContent.includes("getElementById('splash')")) s.remove()
      }

      // 1b. Drop HTML comments. index.html carries a fair amount of authoring
      //     commentary that is useful in source and pointless in the shipped
      //     output, where it repeats on every route and is readable by
      //     anyone opening view-source.
      const commentWalker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_COMMENT)
      const comments = []
      while (commentWalker.nextNode()) comments.push(commentWalker.currentNode)
      for (const c of comments) c.remove()

      // 2. De-duplicate the <head>. index.html ships a full set of generic SEO
      //    tags; helmet appends the route-specific ones *after* them. Crawlers
      //    read the FIRST occurrence, so without this every prerendered page
      //    advertises the homepage description/canonical/og tags.
      const keyOf = (el) => {
        const t = el.tagName.toLowerCase()
        if (t === 'meta') {
          const k = el.getAttribute('name') || el.getAttribute('property')
          return k ? `meta:${k}` : null
        }
        if (t === 'link' && el.getAttribute('rel') === 'canonical') return 'link:canonical'
        return null
      }

      const managed = new Set()
      for (const el of document.head.querySelectorAll('[data-rh]')) {
        const k = keyOf(el)
        if (k) managed.add(k)
      }

      let removed = 0
      for (const el of [...document.head.children]) {
        if (el.hasAttribute('data-rh')) continue
        const k = keyOf(el)
        if (k && managed.has(k)) {
          el.remove()
          removed++
        }
      }
      return { removed, managed: managed.size }
    })

    const html = await page.content()
    const meta = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      h1: document.querySelector('main#main-content h1')?.innerText?.trim().slice(0, 80) || '',
    }))

    // Hard gate: never write a file that would be worse than the SPA fallback.
    if (!/<main[\s>]/i.test(html)) throw new Error('rendered HTML has no <main>')
    if (!meta.h1) throw new Error('rendered HTML has no <h1> inside <main>')
    if (!meta.title) throw new Error('rendered HTML has no <title>')
    if (!helmetApplied) throw new Error('react-helmet-async never committed its <head> tags')
    if ((html.match(/<meta name="description"/gi) || []).length !== 1) {
      throw new Error('expected exactly one <meta name="description"> after dedupe')
    }

    const outputPath = outputPathFor(route)
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, html)

    return { route, ok: true, bytes: Buffer.byteLength(html), removed: cleanup.removed, ...meta }
  } catch (error) {
    return { route, ok: false, error: error.message }
  } finally {
    await page.close().catch(() => {})
  }
}

async function runPool(browser, routes) {
  const queue = [...routes]
  const results = []
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const route = queue.shift()
      const result = await prerenderRoute(browser, route)
      results.push(result)
      console.log(
        result.ok
          ? `  ok   ${result.route.padEnd(48)} ${String(result.bytes).padStart(7)} B  -${String(result.removed).padStart(2)} dup  ${result.title.slice(0, 60)}`
          : `  FAIL ${result.route.padEnd(48)} ${result.error}`
      )
    }
  })
  await Promise.all(workers)
  return results
}

// ---------------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    throw new Error(`No build found at ${DIST_DIR}/index.html — run \`npm run build\` first.`)
  }

  const routes = discoverRoutes()
  const baselineBytes = fs.statSync(path.join(DIST_DIR, 'index.html')).size
  console.log(`Prerendering ${routes.length} routes (concurrency ${CONCURRENCY})`)
  console.log(`Baseline dist/index.html: ${baselineBytes} B\n`)

  const server = await startServer()
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // react-helmet-async flushes the <head> from a requestAnimationFrame
        // callback. Chrome throttles rAF/timers in non-foreground tabs, so with
        // more than one page open the head commit can stall for tens of seconds
        // (or never land). These three flags keep every tab running at full speed.
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    })

    const results = await runPool(browser, routes)
    const failed = results.filter((r) => !r.ok)
    const ok = results.filter((r) => r.ok)

    console.log(`\n${ok.length}/${results.length} routes prerendered.`)
    if (failed.length) {
      console.error('\nFailed routes:')
      for (const f of failed) console.error(`  ${f.route}: ${f.error}`)
      process.exitCode = 1
      return
    }

    const titles = new Map()
    for (const r of ok) titles.set(r.title, [...(titles.get(r.title) || []), r.route])
    const shared = [...titles.entries()].filter(([, rs]) => rs.length > 1)
    console.log(`Unique <title> values: ${titles.size}/${ok.length}`)
    if (shared.length) {
      console.warn('\nRoutes sharing a <title> (duplicate-title SEO risk):')
      for (const [t, rs] of shared) console.warn(`  "${t}"\n    ${rs.join('\n    ')}`)
    }
  } finally {
    if (browser) await browser.close().catch(() => {})
    stopServer(server)
  }
}

main().catch((err) => {
  console.error('\nPrerender failed:', err.message)
  process.exit(1)
})
