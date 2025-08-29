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
  await page.getByRole('main').getByRole('button', { name: 'ログイン' }).click()

  // race: dashboard URL vs. visible error message
  const dashboardWait = page.waitForURL('**/dashboard*', { timeout: 30000 })
  const errorWait = page.locator('div', { hasText: 'エラー' }).first().waitFor({ timeout: 30000 }).catch(() => null)
  await Promise.race([dashboardWait, errorWait])

  if (!page.url().includes('/dashboard')) {
    const errorBox = page.locator('div', { hasText: 'エラー' }).first()
    const msg = (await errorBox.isVisible()) ? await errorBox.textContent() : 'No explicit error box found'
    throw new Error(`Login did not navigate to /dashboard. URL=${page.url()} Error=${(msg||'').trim()}`)
  }
  expect(page.url()).toContain('/dashboard')
})


