// Capture fresh screenshots of every live project into public/img/.
// Run: node scripts/capture-screenshots.mjs
import { chromium } from '@playwright/test'

const projects = [
  { slug: 'shop-tulu', url: 'https://shop-tulu.netlify.app' },
  { slug: 'kphone-marketing', url: 'https://marketing-gen.pages.dev' },
  { slug: 'credit-wizard', url: 'https://credit-wizard-sh1r00-229.netlify.app' },
  { slug: 'trading-bot', url: 'https://trading-bot-sh1r00-332.netlify.app' },
  { slug: 'meti-site', url: 'https://meti-site.onrender.com' },
  { slug: 'skilled-trades', url: 'https://skilled-trades-marketplace.vercel.app' },
  { slug: 'dice-arena', url: 'https://sh1r00-dice-arena.rasisg.workers.dev' },
]

// Use the system Edge/Chrome (no Playwright browser download needed).
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })

for (const p of projects) {
  try {
    await page.goto(p.url, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(1800)
    await page.screenshot({ path: `public/img/${p.slug}.png` })
    console.log(`OK   ${p.slug}`)
  } catch (e) {
    console.error(`FAIL ${p.slug}: ${e.message.split('\n')[0]}`)
  }
}

await browser.close()
console.log('done')
