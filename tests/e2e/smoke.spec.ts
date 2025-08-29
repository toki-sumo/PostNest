import { test, expect } from '@playwright/test'

test('signin page shows heading', async ({ page }) => {
  await page.goto('/signin')
  await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
})


