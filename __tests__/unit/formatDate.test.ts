import { formatDate } from '@/lib/utils/formatDate'

describe('formatDate', () => {
  it('returns JP locale date string with yyyy/mm/dd', () => {
    const out = formatDate('2024-01-02T03:04:00Z')
    expect(out).toMatch(/\d{4}\/\d{2}\/\d{2}/)
  })
})


