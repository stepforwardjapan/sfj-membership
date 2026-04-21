import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import type { Member } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !member) {
    notFound()
  }

  const m = member as Member

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            ← 一覧に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-6">{m.name ?? '(未入力)'}</h1>

          <Section title="基本情報">
            <Field label="メール" value={m.email} />
            <Field label="氏名" value={m.name} />
            <Field label="ふりがな" value={m.name_kana} />
            <Field label="所属" value={m.organization} />
            <Field label="電話" value={m.phone} />
            <Field label="Web掲載名" value={m.display_name} />
          </Section>

          <Section title="契約情報">
            <Field label="ステータス" value={m.status} />
            <Field label="初回登録日" value={formatDateTime(m.registered_at)} />
            <Field label="最終決済日" value={m.last_paid_at ? formatDateTime(m.last_paid_at) : null} />
            <Field label="有効期限" value={m.expires_at ? formatDateTime(m.expires_at) : null} />
          </Section>

          <Section title="Square連携">
            <Field label="Customer ID" value={m.square_customer_id} mono />
            <Field label="Last Payment ID" value={m.last_square_payment_id} mono />
          </Section>

          <Section title="運営メモ">
            <Field label="メモ" value={m.notes} />
            <Field label="招待者" value={m.invited_by} />
          </Section>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">{title}</h2>
      <dl className="space-y-2">{children}</dl>
    </section>
  )
}

function Field({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-1">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className={`col-span-2 text-sm ${mono ? 'font-mono text-xs' : ''} ${value ? 'text-gray-900' : 'text-gray-400'}`}>
        {value ?? '—'}
      </dd>
    </div>
  )
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP')
}
