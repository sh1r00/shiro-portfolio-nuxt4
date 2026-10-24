import { defineConfig } from '@playwright/test'

// E2E smoke test. Requires the dev server (or a build) running with a seeded admin.
//   npx playwright install        (once, to fetch browsers)
//   npm run dev                   (with .env admin creds set)
//   npm run test:e2e
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
  },
})
