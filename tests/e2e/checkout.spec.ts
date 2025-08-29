import { test, expect } from '@playwright/test'

test.setTimeout(30000)

test('premium article checkout returns Stripe URL', async ({ page }) => {
  const base = process.env.BASE_URL || 'http://localhost:4000'
  const email = 'guest@example.com'
  const password = 'Guest@123'

  // Ensure guest user exists (ignore if already exists)
  const su = await page.request.post(`${base}/api/auth/signup`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email, password },
  })
  expect([201, 400]).toContain(su.status())

  // Login via UI
  await page.goto('/signin')
  await page.getByPlaceholder('guest@example.com').fill(email)
  await page.getByPlaceholder('パスワードを入力').fill(password)
  await page.getByRole('main').getByRole('button', { name: 'ログイン' }).click()
  await page.waitForURL('**/dashboard*', { timeout: 15000 })

  // Create a premium article via API (uses the same browser context session)
  const createRes = await page.request.post(`${base}/api/articles`, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': base,
    },
    data: {
      title: `有料記事E2E ${Date.now()}`,
      content: '<p>本文</p>',
      tags: ['e2e', 'premium'],
      isPremium: true,
      price: 500,
    },
  })
  expect(createRes.status()).toBe(200)
  const article = await createRes.json()
  expect(article.id).toBeTruthy()

  // Request checkout session
  const checkoutRes = await page.request.post(`${base}/api/checkout`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: { articleId: article.id as string },
  })
  expect(checkoutRes.status()).toBe(200)
  const payload = await checkoutRes.json()
  expect(payload).toHaveProperty('url')
  expect(String(payload.url)).toContain('checkout.stripe.com')
})


