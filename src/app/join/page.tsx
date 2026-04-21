import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'サポーターになる | Step Forward Japan',
  description: '挑戦サポーター制度・法人協賛・寄付のお申込み。失敗できる社会を、一緒につくる。',
}

const PLANS = [
  {
    id: 'individual',
    label: 'Individual',
    name: '挑戦サポーター（個人）',
    price: '¥30,000',
    per: '/ 年（税込）',
    url: 'https://square.link/u/6FNuffLM',
    description:
      '個人で SFJ の活動を支え、挑戦者コミュニティの当事者として関わっていただくプランです。法人契約での経費処理にも対応します。',
    benefits: [
      '公開収録 毎回無料参加',
      '毎回3名まで無料招待可能',
      'SFJプロジェクト立ち上げ権',
      'コミュニティ内イベント企画',
      'リアルイベント優待',
      'Podcast ゲスト出演（年1回）',
      'Web等への掲載（任意）',
    ],
  },
  {
    id: 'corporate',
    label: 'Corporate',
    name: '法人協賛会員',
    price: '¥300,000',
    per: '/ 年（税込）',
    url: 'https://square.link/u/fqljnKbS',
    description:
      '法人として SFJ の活動を協賛いただくプラン。組織としての挑戦文化づくりにご関心のある企業・団体向けです。',
    benefits: [
      '挑戦サポーター全特典',
      'SFJ公式サイトへの企業ロゴ掲載',
      '社員・関係者の公開収録参加',
      'SFJイベントへの共催・協力',
      '組織づくりの相談・連携',
      'Podcast 企業枠出演',
    ],
    highlighted: true,
  },
  {
    id: 'donation',
    label: 'Donation',
    name: '寄付',
    price: '任意額',
    per: '',
    url: 'https://square.link/u/7mskjwDM',
    description:
      '活動への共感に応じて自由な額でご支援いただけます。サポーター特典は付きませんが、SFJの活動を継続的に支える力になります。',
    benefits: ['お礼のメッセージ', 'ご希望に応じて寄付者としての掲載'],
  },
] as const

export default function JoinPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/sfj-logo.png" alt="Step Forward Japan" width={160} height={32} priority />
          </Link>
          <Link href="/" className="eyebrow hover:text-[var(--color-text)] transition">
            ← Back
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[var(--color-border)]">
          <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
            <p className="eyebrow mb-6" style={{ color: 'var(--color-accent-dark)' }}>
              Join SFJ
            </p>
            <h1
              className="font-display font-bold leading-[1.15] tracking-tight mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
            >
              サポーターになる
            </h1>
            <p className="max-w-xl mx-auto text-[var(--color-text-muted)] leading-[1.9]">
              挑戦文化を、一緒につくる。
              ご自身に合うかたちを選んでお申込みください。
              決済は Square のセキュアなページで完結します。
            </p>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
              {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <p className="eyebrow mb-8">How it works</p>
            <h2
              className="font-display font-bold mb-12 leading-[1.2]"
              style={{ fontSize: 'clamp(1.6rem, 2.2vw, 2rem)' }}
            >
              お申込みの流れ
            </h2>
            <ol className="space-y-10">
              {[
                {
                  n: '01',
                  t: 'プランを選ぶ',
                  d: '個人・法人・寄付の3つから、ご自身に合うかたちを選びます。迷う場合は個人会員がおすすめです。',
                },
                {
                  n: '02',
                  t: 'Square で情報入力・決済',
                  d: '遷移先の Square 決済ページで、お名前・メール・決済情報をご入力いただきます。これらの情報はSFJが会員管理のために受け取ります。',
                },
                {
                  n: '03',
                  t: '登録完了',
                  d: '決済完了後、ご登録のメールアドレス宛にご案内をお送りします。コミュニティ参加方法と次回公開収録のご案内を含みます。',
                },
              ].map((s) => (
                <li key={s.n} className="grid grid-cols-[auto,1fr] gap-8">
                  <div
                    className="font-display font-bold text-2xl"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-[var(--color-text)]">{s.t}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[var(--color-accent-tint)]">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <p className="text-sm text-[var(--color-text-muted)] mb-3">ご不明な点は下記までお気軽にご連絡ください</p>
            <a
              href="mailto:info@step-forward-japan.jp"
              className="font-display font-semibold text-[var(--color-text)] hover:text-[var(--color-accent-dark)] transition"
            >
              info@step-forward-japan.jp
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <span>© Step Forward Japan</span>
          <span className="font-display tracking-widest uppercase">SFJ</span>
        </div>
      </footer>
    </>
  )
}

function PlanCard({
  plan,
}: {
  plan: {
    id: string
    label: string
    name: string
    price: string
    per: string
    url: string
    description: string
    benefits: readonly string[]
    highlighted?: boolean
  }
}) {
  return (
    <div
      className={`bg-white p-8 md:p-10 flex flex-col ${
        plan.highlighted ? 'ring-1 ring-[var(--color-accent)] relative' : ''
      }`}
    >
      {plan.highlighted && (
        <span
          className="absolute top-0 right-0 text-[0.6rem] font-semibold tracking-widest uppercase text-white px-3 py-1"
          style={{ background: 'var(--color-accent)' }}
        >
          Recommended
        </span>
      )}
      <p className="eyebrow mb-4" style={{ color: 'var(--color-accent-dark)' }}>
        {plan.label}
      </p>
      <h3 className="font-display font-bold text-xl mb-6 text-[var(--color-text)]">{plan.name}</h3>
      <div className="flex items-end gap-2 mb-6">
        <span className="font-display font-black text-4xl text-[var(--color-text)]">{plan.price}</span>
        {plan.per && <span className="text-xs text-[var(--color-text-muted)] mb-2">{plan.per}</span>}
      </div>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">
        {plan.description}
      </p>
      <ul className="space-y-3 text-sm text-[var(--color-text-muted)] mb-10 flex-grow">
        {plan.benefits.map((b) => (
          <li key={b} className="flex gap-3">
            <svg width="14" height="14" viewBox="0 0 16 16" className="flex-shrink-0 mt-1.5" aria-hidden>
              <path
                d="M3 8L6.5 11.5L13 5"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
              />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <a
        href={plan.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block text-center py-4 text-sm transition ${
          plan.highlighted
            ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]'
            : 'bg-[var(--color-text)] text-white hover:opacity-85'
        }`}
      >
        {plan.id === 'donation' ? 'Square で寄付する' : 'Square で申し込む'}
      </a>
    </div>
  )
}
