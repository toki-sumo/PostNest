import request from 'supertest'

jest.setTimeout(30000)

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const ORIGIN = BASE

function form(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

describe('POST /api/articles (authenticated)', () => {
  it('creates an article when authenticated and with valid origin', async () => {
    const email = `test${Date.now()}@example.com`
    const password = 'Aa1!aaaa'

    // 1) signup
    const su = await request(BASE)
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({ email, password })
    expect([200, 201, 400]).toContain(su.status)

    // 2) sign in via NextAuth credentials provider
    const signin = await request(BASE)
      .post('/api/auth/callback/credentials')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Origin', ORIGIN)
      .send(
        form({
          email,
          password,
          callbackUrl: `${BASE}/`,
          json: 'true',
        })
      )

    // capture session cookie
    const setCookie = signin.headers['set-cookie']
    expect(setCookie).toBeTruthy()

    // 3) create article with cookie + origin
    const payload = {
      title: '統合テスト記事',
      content: '<p>本文</p>',
      tags: ['test'],
      isPremium: false,
    }

    const res = await request(BASE)
      .post('/api/articles')
      .set('Origin', ORIGIN)
      .set('Cookie', setCookie)
      .set('Content-Type', 'application/json')
      .send(payload)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe(payload.title)
  })
})


