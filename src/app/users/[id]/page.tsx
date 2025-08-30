import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils/formatDate'

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bio: true,
      image: true,
      Article: {
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">ユーザーが見つかりません</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[var(--muted)]/20 border" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name ?? '名無しさん'}</h1>
        </div>
      </div>

      {user.bio && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">プロフィール</h2>
          <p className="text-[var(--text)]/85 whitespace-pre-wrap">{user.bio}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">最近の投稿</h2>
        <ul className="space-y-2">
          {user.Article.map(a => (
            <li key={a.id} className="flex items-center justify-between border-b border-[var(--border)] py-2">
              <a href={`/articles/${a.id}`} className="text-[var(--primary)] hover:underline">{a.title}</a>
              <span className="text-xs text-[var(--muted)]">{formatDate(String(a.createdAt))}</span>
            </li>
          ))}
          {user.Article.length === 0 && <li className="text-[var(--muted)]">投稿はまだありません</li>}
        </ul>
      </div>
    </div>
  )
}


