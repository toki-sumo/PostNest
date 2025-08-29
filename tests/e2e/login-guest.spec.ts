import { test, expect } from '@playwright/test'

test.setTimeout(30000)

test('guest credentials login navigates to dashboard', async ({ page, request }) => {
  const base = process.env.BASE_URL || 'http://localhost:4000'
  const email = 'guest@example.com'
  const password = 'Guest@123'

  // Ensure guest user exists (ignore if already exists)
  const resp = await request.post(`${base}/api/auth/signup`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email, password },
  })
  expect([201, 400]).toContain(resp.status())

  // UI login
  await page.goto('/signin')
  await page.getByPlaceholder('guest@example.com').fill(email)
  await page.getByPlaceholder('パスワードを入力').fill(password)
  await page.getByRole('button', { name: 'ログイン' }).click()

  await page.waitForURL('**/dashboard*', { timeout: 15000 })
  expect(page.url()).toContain('/dashboard')
})


