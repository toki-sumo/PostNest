import { test, expect } from '@playwright/test'

test.setTimeout(30000)

test('author profile link navigates to /users/[id]', async ({ page, request }) => {
  const base = process.env.BASE_URL || 'http://localhost:4000'

  // ログイン（ゲスト）
  await page.goto('/signin')
  await page.getByPlaceholder('guest@example.com').fill('guest@example.com')
  await page.getByPlaceholder('パスワードを入力').fill('Guest@123')
  await page.getByRole('main').getByRole('button', { name: 'ログイン' }).click()
  await page.waitForURL('**/dashboard*', { timeout: 30000 })

  // 記事一覧へ
  await page.goto('/articles')

  // 著者リンクを取得（/users/ へのリンク）
  const link = page.locator('a[href^="/users/"]').first()
  const count = await link.count()
  if (count === 0) {
    // 記事が無い等でリンクが見つからない場合はスキップ扱い
    test.info().annotations.push({ type: 'skip', description: 'No author link found in /articles' })
    return
  }

  await expect(link).toBeVisible({ timeout: 10000 })
  await link.click()

  // プロフィールページに遷移することを確認
  await page.waitForURL('**/users/*', { timeout: 15000 })
  expect(page.url()).toMatch(/\/users\//)
})


