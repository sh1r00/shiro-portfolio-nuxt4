import { test, expect } from '@playwright/test'

// Admin smoke test. Credentials come from env (set the same NUXT_ADMIN_USERNAME /
// NUXT_ADMIN_PASSWORD used to seed the DB), with test defaults as fallback.
const username = process.env.TEST_ADMIN_USERNAME || 'admin'
const password = process.env.TEST_ADMIN_PASSWORD || 'smoketest-pass'

test('unauthenticated /admin redirects to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('admin login → dashboard renders items table', async ({ page }) => {
  await page.goto('/admin/login')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()

  await expect(page).toHaveURL(/\/admin\/?$/)
  await expect(page.getByText('Portfolio Items')).toBeVisible()
  // The seeded works should be listed.
  await expect(page.getByText('Shop Tulu')).toBeVisible()
})

test('create → edit → delete a portfolio item', async ({ page }) => {
  // login
  await page.goto('/admin/login')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin\/?$/)

  // create
  await page.getByRole('button', { name: '+ Add item' }).click()
  await page.getByLabel('Title').fill('E2E Smoke Test')
  await page.getByLabel('URL').fill('https://example.com/e2e-smoke')
  await page.getByRole('button', { name: 'Save' }).click()

  // verify it appears
  await expect(page.getByText('E2E Smoke Test')).toBeVisible()

  // delete it
  const row = page.locator('tr', { hasText: 'E2E Smoke Test' })
  await row.getByRole('button', { name: 'Delete' }).click()
  await page.once('dialog', (d) => d.accept()) // confirm()
  await expect(page.getByText('E2E Smoke Test')).toHaveCount(0)
})
