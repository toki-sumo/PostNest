import { test, expect } from '@playwright/test'

test.setTimeout(45000)

test('mock checkout.session.completed creates subscription and is listed for user', async ({ page }) => {
  const base = process.env.BASE_URL || 'http://localhost:4000'
  const email = `stripe-mock-${Date.now()}@example.com`
  const password = 'Aa1!aaaa'

  // Ensure STRIPE_WEBHOOK_SECRET is set (user must export it after `stripe listen`)
  test.skip(Boolean(!process.env.STRIPE_WEBHOOK_SECRET), 'STRIPE_WEBHOOK_SECRET is required')

  // Signup + login
  await page.request.post(`${base}/api/auth/signup`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email, password },
  })
  await page.goto('/signin')
  await page.getByPlaceholder('guest@example.com').fill(email)
  await page.getByPlaceholder('パスワードを入力').fill(password)
  await page.getByRole('main').getByRole('button', { name: 'ログイン' }).click()
  await page.waitForURL('**/dashboard*', { timeout: 20000 })

  // Create premium article
  const createRes = await page.request.post(`${base}/api/articles`, {
    headers: { 'Content-Type': 'application/json', 'Origin': base },
    data: { title: `E2E Webhook ${Date.now()}`, content: '<p>本文</p>', isPremium: true, price: 500 },
  })
  expect(createRes.status()).toBe(200)
  const article = await createRes.json()

  // Trigger Stripe CLI mock event (user must run `stripe listen --forward-to localhost:4000/api/stripe/webhook`)
  // Here we just document the step; automated triggering would require shelling out to the Stripe CLI.
  console.log('\n[Manual step] In another terminal, run:')
  console.log('stripe trigger checkout.session.completed')
  console.log('Then return here; test will poll until subscription appears.')

  // Poll subscriptions endpoint for appearance
  const deadline = Date.now() + 30000
  let found = false
  while (Date.now() < deadline && !found) {
    const subs = await page.request.get(`${base}/api/user/subscriptions`)
    if (subs.status() === 200) {
      const data = await subs.json()
      const match = (data.subscriptions || []).find((s: any) => s.articleId === article.id && s.status === 'completed')
      if (match) {
        found = true
        break
      }
    }
    await page.waitForTimeout(2000)
  }

  expect(found).toBe(true)
})


