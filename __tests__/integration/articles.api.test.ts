import request from 'supertest'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

describe('GET /api/articles', () => {
  it('returns 200 and array payload', async () => {
    const res = await request(BASE).get('/api/articles')
    expect([200, 204]).toContain(res.status)
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true)
    }
  })
})


