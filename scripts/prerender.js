/**
 * Prerender Script for SEO
 * Generates static HTML files for key pages using Puppeteer
 * Run after build: node scripts/prerender.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = 4173;

// Routes to prerender for SEO
const ROUTES = [
  '/',
  '/multi-chain-token-creator',
  '/erc20-token-generator',
  '/meme-coin-creator',
  '/cryptocurrency-creator',
  '/blog',
  '/about',
  '/guides',
  '/faq'
];

async function startServer() {
  return new Promise((resolve, reject) => {
    const server = exec(`npx vite preview --port ${PORT}`, {
      cwd: path.join(__dirname, '..')
    });

    // Wait for server to be ready
    setTimeout(() => resolve(server), 3000);

    server.on('error', reject);
  });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `http://localhost:${PORT}${route}`;

  console.log(`Prerendering: ${route}`);

  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for React to finish rendering
    await page.waitForSelector('main', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000));

    // Get the rendered HTML
    const html = await page.content();

    // Determine output path
    const outputPath = route === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, route, 'index.html');

    // Create directory if needed
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the prerendered HTML
    fs.writeFileSync(outputPath, html);
    console.log(`  Saved: ${outputPath}`);

  } catch (error) {
    console.error(`  Error prerendering ${route}:`, error.message);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('Starting prerender process...\n');

  // Start preview server
  console.log('Starting preview server...');
  const server = await startServer();

  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Prerender each route
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }

    console.log('\nPrerendering complete!');

  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
