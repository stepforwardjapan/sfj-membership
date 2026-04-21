import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Member } from '@/lib/types'

export const dynamic = 'force-dynamic'

const statusLabel: Record<string, { label: string; color: string }> = {
  active: { label: '有効', color: 'bg-green-100 text-green-800' },
  expired: { label: '期限切れ', color: 'bg-orange-100 text-orange-800' },
  cancelled: { label: '解約', color: 'bg-gray-100 text-gray-800' },
}

export default async function AdminMembersPage() {
  const supabase = await createClient()
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('registered_at', { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">エラー: {error.message}</p>
      </div>
    )
  }

  const list = (members ?? []) as Member[]
  const now = Date.now()
  const activeCount = list.filter((m) => m.status === 'active').length
  const expiringSoon = list.filter((m) => {
    if (m.status !== 'active' || !m.expires_at) return false
    const days = (new Date(m.expires_at).getTime() - now) / (1000 * 60 * 60 * 24)
    return days >= 0 && days <= 30
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">SFJ 会員管理</h1>
          <form action="/admin/logout" method="post">
            <button className="text-sm text-gray-600 hover:text-gray-900">ログアウト</button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat label="総会員数" value={list.length} />
          <Stat label="有効サポーター" value={activeCount} />
          <Stat label="30日以内に期限切れ" value={expiringSoon} highlight={expiringSoon > 0} />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">氏名</th>
                <th className="px-6 py-3">メール</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">有効期限</th>
                <th className="px-6 py-3">登録日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    会員データがありません
                  </td>
                </tr>
              ) : (
                list.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/members/${m.id}`} className="text-blue-600 hover:underline">
                        {m.name ?? '(未入力)'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{m.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${statusLabel[m.status]?.color ?? 'bg-gray-100'}`}>
                        {statusLabel[m.status]?.label ?? m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {m.expires_at ? formatDate(m.expires_at) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(m.registered_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${highlight ? 'ring-2 ring-orange-400' : ''}`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`text-3xl font-bold ${highlight ? 'text-orange-600' : ''}`}>{value}</div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
