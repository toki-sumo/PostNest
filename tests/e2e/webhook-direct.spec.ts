import { test, expect } from '@playwright/test'
import Stripe from 'stripe'

test.setTimeout(45000)

test('direct webhook POST with signed payload creates subscription', async ({ page }) => {
  const base = process.env.BASE_URL || 'http://localhost:4000'
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  test.skip(!webhookSecret, 'STRIPE_WEBHOOK_SECRET is required')

  const email = `webhook-direct-${Date.now()}@example.com`
  const password = 'Aa1!aaaa'

  // Sign up & login via UI to establish session
  await page.request.post(`${base}/api/auth/signup`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email, password },
  })
  await page.goto('/signin')
  await page.getByPlaceholder('guest@example.com').fill(email)
  await page.getByPlaceholder('パスワードを入力').fill(password)
  await page.getByRole('main').getByRole('button', { name: 'ログイン' }).click()
  await page.waitForURL('**/dashboard*', { timeout: 20000 })

  // Create premium article and take authorId as userId
  const createRes = await page.request.post(`${base}/api/articles`, {
    headers: { 'Content-Type': 'application/json', 'Origin': base },
    data: { title: `Direct Hook ${Date.now()}`, content: '<p>本文</p>', isPremium: true, price: 500 },
  })
  expect(createRes.status()).toBe(200)
  const article = await createRes.json()
  const articleId: string = article.id
  const userId: string = article.authorId

  // Build a minimal checkout.session.completed event
  const event = {
    id: 'evt_test_123',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        payment_intent: 'pi_test_123',
        amount_total: 500,
        metadata: { articleId, userId },
      },
    },
  }
  const rawBody = JSON.stringify(event)

  // Generate Stripe test header signature
  const stripe = new Stripe('sk_test_dummy', { apiVersion: '2024-06-20' })
  const header = stripe.webhooks.generateTestHeaderString({ payload: rawBody, secret: webhookSecret as string })

  const hookRes = await page.request.post(`${base}/api/stripe/webhook`, {
    headers: { 'Content-Type': 'application/json', 'stripe-signature': header },
    data: rawBody,
  })
  expect(hookRes.status()).toBe(200)

  // Poll subscriptions endpoint until the new subscription is visible
  const deadline = Date.now() + 30000
  let found = false
  while (Date.now() < deadline && !found) {
    const subs = await page.request.get(`${base}/api/user/subscriptions`)
    if (subs.status() === 200) {
      const data = await subs.json()
      const match = (data.subscriptions || []).find((s: any) => s.articleId === articleId && s.status === 'completed')
      if (match) {
        found = true
        break
      }
    }
    await page.waitForTimeout(1000)
  }

  expect(found).toBe(true)
})


