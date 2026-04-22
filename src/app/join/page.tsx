import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PlanGrid } from './PlanGrid'

export const metadata: Metadata = {
  title: 'サポーターになる | Step Forward Japan',
  description:
    '挑戦サポーター制度・法人協賛・寄付のお申込み。失敗できる社会を、一緒につくる。',
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
    requireAgreement: true,
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
      '社員・関係者の公開収録参加（3名まで）',
      'SFJイベントへの共催・協力',
      '組織づくりの相談・連携',
      'Podcast 企業枠出演',
    ],
    highlighted: true,
    requireAgreement: true,
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
    requireAgreement: false,
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
            </p>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <PlanGrid plans={PLANS} />
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
                  t: 'プランを選ぶ・規約に同意する',
                  d: '個人・法人・寄付の3つから、ご自身に合うかたちを選びます。会員プランをお選びの方は、会員規約をご確認のうえ同意チェックをお願いします。',
                },
                {
                  n: '02',
                  t: '情報入力・決済',
                  d: '遷移先の決済ページで、お名前・メール・決済情報をご入力いただきます。入力いただいた情報は SFJ が会員管理のために受け取ります。',
                },
                {
                  n: '03',
                  t: '登録完了',
                  d: '決済完了後、ご登録のメールアドレス宛にご案内をお送りします。コミュニティ参加方法と次回公開収録のご案内を含みます。',
                },
              ].map((s) => (
                <li key={s.n} className="grid grid-cols-[auto,1fr] gap-8">
                  <div className="font-display font-bold text-2xl" style={{ color: 'var(--color-accent)' }}>
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
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              ご不明な点は下記までお気軽にご連絡ください
            </p>
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
