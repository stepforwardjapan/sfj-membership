import Image from 'next/image'
import Link from 'next/link'

// CTA遷移先（3つのプラン選択ページ）
const SUPPORT_URL = '/join'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Podcast />
        <Benefits />
        <Pricing />
        <Directors />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}

// ───────────────────────────────────────────────
// Header
// ───────────────────────────────────────────────
function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/sfj-logo.png" alt="Step Forward Japan" width={160} height={32} priority />
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <a href="#about" className="eyebrow hover:text-[var(--color-text)] transition">About</a>
          <a href="#podcast" className="eyebrow hover:text-[var(--color-text)] transition">Podcast</a>
          <a href="#benefits" className="eyebrow hover:text-[var(--color-text)] transition">Benefits</a>
          <a href="#pricing" className="eyebrow hover:text-[var(--color-text)] transition">Pricing</a>
        </nav>
        <Link
          href={SUPPORT_URL}
          className="hidden md:inline-block bg-[var(--color-text)] text-white px-6 py-3 text-sm hover:opacity-85 transition"
        >
          サポーターになる
        </Link>
      </div>
    </header>
  )
}

// ───────────────────────────────────────────────
// Hero
// ───────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative border-b border-[var(--color-border)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-28 md:py-40 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-8 fade-up">
          <p className="eyebrow mb-8" style={{ color: 'var(--color-accent-dark)' }}>
            Step Forward Japan
          </p>
          <h1
            className="font-display font-black leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontFamily: 'var(--font-display)' }}
          >
            失敗できる社会を、<br />
            一緒につくる。
          </h1>
          <p className="max-w-xl text-[var(--color-text-muted)] leading-[1.9] mb-10">
            挑戦し一歩踏み出す人々を輩出する。
            失敗を「恥」や「挫折」で終わらせず、次の一歩につながる学習資産として社会に残すための活動です。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={SUPPORT_URL}
              className="inline-block bg-[var(--color-accent)] text-white px-8 py-4 text-sm hover:bg-[var(--color-accent-dark)] transition"
            >
              挑戦サポーターになる
            </Link>
            <a
              href="#about"
              className="inline-block border border-[var(--color-text)] text-[var(--color-text)] px-8 py-4 text-sm hover:bg-[var(--color-bg-secondary)] transition"
            >
              SFJについて知る
            </a>
          </div>
        </div>
        <div className="md:col-span-4 hidden md:flex justify-end fade-up">
          <Image src="/sfj-mark.png" alt="" width={200} height={200} className="opacity-90" />
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// About
// ───────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-6">About</p>
          <h2
            className="font-display font-bold leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)' }}
          >
            失敗を、<br />学びに変える。
          </h2>
        </div>
        <div className="md:col-span-8 space-y-8 text-[var(--color-text-muted)]">
          <p>
            日本の起業希望者の 55% が「失敗への恐怖が起業を妨げる」と回答している（GEM調査）。
            15歳の 80% が「失敗すると他人の目が気になる」と答えている（OECD PISA）。
            成功談だけでは見えない、迷い・葛藤・遠回りのプロセスを、私たちは正面から扱います。
          </p>
          <p>
            Step Forward Japan は、失敗を前向きに捉え、
            「失敗を学びに変える力」を身につける挑戦者のコミュニティです。
            Podcast・コミュニティ・プロジェクトの 3 つの柱で、
            挑戦が歓迎される文化を社会に広げていきます。
          </p>
          <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[var(--color-border)]">
            <Metric value="171" label="クラファン支援者数" />
            <Metric value="202%" label="達成率" />
            <Metric value="8+" label="ポッドキャストゲスト数" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="pt-6">
      <div className="font-display font-bold text-[var(--color-text)] text-3xl md:text-4xl mb-1">{value}</div>
      <div className="eyebrow">{label}</div>
    </div>
  )
}

// ───────────────────────────────────────────────
// Podcast
// ───────────────────────────────────────────────
function Podcast() {
  const guests = [
    { name: '松永エリック・匡史', role: '青山学院大学 地球社会共生学部 学部長・教授' },
    { name: '豊田圭一', role: '株式会社スパイスアップ・ジャパン 代表取締役' },
    { name: '森本千賀子', role: '株式会社morich 代表取締役' },
    { name: '田中秀行', role: 'AFRIKA ROSE 代表取締役' },
    { name: '山本紳也', role: 'HRファーブラ 代表' },
    { name: '岡田兵吾', role: 'Microsoft Singapore APAC 責任者' },
  ]
  return (
    <section id="podcast" className="border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <p className="eyebrow mb-6">Podcast</p>
            <h2
              className="font-display font-bold leading-[1.15] tracking-tight"
              style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)' }}
            >
              失敗の履歴書
            </h2>
          </div>
          <div className="md:col-span-8 text-[var(--color-text-muted)] space-y-6">
            <p>
              挑戦の結果として生まれた失敗に焦点を当て、背景・意思決定・乗り越え方をひも解くインタビュー番組。
              成功談だけでは見えない、リアルな意思決定のプロセスを届けます。
            </p>
            <p>
              毎週火曜日配信 / 1ゲスト 15分 × 4エピソード構成。
            </p>
            <a
              href="https://open.spotify.com/show/3PaXMIvEGMhOHMaIBiOKxl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[var(--color-text)] px-6 py-3 text-sm hover:bg-[var(--color-bg-secondary)] transition"
            >
              Spotify で聴く
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
          {guests.map((g) => (
            <div
              key={g.name}
              className="bg-white p-6 hover:bg-[var(--color-bg-secondary)] transition"
            >
              <div className="font-display font-semibold text-[var(--color-text)] mb-2">{g.name}</div>
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">{g.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// Benefits
// ───────────────────────────────────────────────
function Benefits() {
  const items = [
    { n: '01', title: '公開収録への無料参加', desc: '毎回の公開収録にサポーターとして無料でご参加いただけます。' },
    { n: '02', title: '3名までの無料招待', desc: 'サポーターは毎回3名までゲストを招待できます。若者でも大人でも。' },
    { n: '03', title: 'プロジェクトの立ち上げ権', desc: '「やってみたい」を起点に、SFJプロジェクトの発起人になれます。' },
    { n: '04', title: 'コミュニティ内イベント企画', desc: 'サポーターコミュニティ内でイベントを企画・開催できます。' },
    { n: '05', title: 'リアルイベントの割引・無料招待', desc: 'SFJ主催の不定期リアルイベントに優待でご参加いただけます。' },
    { n: '06', title: 'ポッドキャスト出演', desc: '年1回、失敗の履歴書にゲスト出演が可能です（事前面談あり）。' },
    { n: '07', title: 'Webへの掲載', desc: 'SFJ公式サイトにサポーターとして名前・法人名を掲載（任意）。' },
  ]
  return (
    <section id="benefits" className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-6">Benefits</p>
          <h2
            className="font-display font-bold leading-[1.15] tracking-tight mb-6"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)' }}
          >
            挑戦サポーター特典
          </h2>
          <p className="text-[var(--color-text-muted)]">
            「ファン」ではなく、「共に挑戦文化をつくる当事者」として関わっていただきます。
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
          {items.map((it) => (
            <div key={it.n} className="bg-white p-8 md:p-10 hover:bg-[var(--color-bg-secondary)] transition">
              <div className="flex gap-6 items-start">
                <div
                  className="font-display font-bold flex-shrink-0 text-2xl"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {it.n}
                </div>
                <div>
                  <h3 className="font-display font-semibold mb-3 text-[var(--color-text)]">{it.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// Pricing
// ───────────────────────────────────────────────
function Pricing() {
  const plans = [
    { label: 'Individual', name: '個人会員', price: '¥30,000', per: '/ 年' },
    { label: 'Corporate', name: '法人協賛', price: '¥300,000', per: '/ 年' },
    { label: 'Donation', name: '寄付', price: '任意額', per: '' },
  ]
  return (
    <section id="pricing" className="border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-6">Pricing</p>
          <h2
            className="font-display font-bold leading-[1.15] tracking-tight mb-6"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)' }}
          >
            3つの関わり方
          </h2>
          <p className="text-[var(--color-text-muted)] leading-[1.9]">
            個人として、法人として、あるいは寄付として。ご自身に合うかたちで SFJ の活動を支えていただけます。
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] mb-10">
          {plans.map((p) => (
            <div key={p.name} className="bg-white p-10">
              <p className="eyebrow mb-5" style={{ color: 'var(--color-accent-dark)' }}>
                {p.label}
              </p>
              <h3 className="font-display font-bold text-lg mb-6 text-[var(--color-text)]">{p.name}</h3>
              <div className="flex items-end gap-2">
                <span className="font-display font-black text-4xl text-[var(--color-text)]">{p.price}</span>
                {p.per && <span className="text-xs text-[var(--color-text-muted)] mb-2">{p.per}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href={SUPPORT_URL}
            className="inline-block bg-[var(--color-accent)] text-white px-10 py-4 text-sm hover:bg-[var(--color-accent-dark)] transition"
          >
            詳細を見る・申し込む
          </Link>
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// Directors
// ───────────────────────────────────────────────
function Directors() {
  const directors = [
    { name: '小俣 勇祐', role: '代表理事 / ファシリテーター', desc: '経営・マーケティング・人材ビジネス' },
    { name: '押田 絵梨香', role: '代表理事 / 企画&コミュニケーター', desc: '事業・組織づくり' },
    { name: '大川 彰一', role: '理事 / 対外交渉', desc: 'グローバル人材育成・産学官連携' },
    { name: '樫村 周磨', role: '理事 / イベント運営', desc: '人材採用・人事戦略' },
    { name: 'デューク', role: '理事', desc: '人材ビジネス' },
  ]
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-6">Directors</p>
          <h2
            className="font-display font-bold leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)' }}
          >
            運営メンバー
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
          {directors.map((d) => (
            <div key={d.name} className="bg-white p-6">
              <div className="font-display font-semibold mb-2 text-[var(--color-text)]">{d.name}</div>
              <div className="eyebrow mb-3">{d.role}</div>
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// FAQ
// ───────────────────────────────────────────────
function Faq() {
  const faqs = [
    { q: 'サポーターになるには何が必要ですか？', a: 'メールアドレスと決済情報のみで、お申込みいただけます。所属・肩書は問いません。' },
    { q: '年度途中で参加した場合、更新はいつですか？', a: '決済日から1年後までが有効期限となり、満了前にご案内をお送りします。' },
    { q: '公開収録はどこで開催されますか？', a: '東京都内を中心に、月1回程度の頻度で開催。サポーターには毎回ご案内いたします。' },
    { q: '若者（18〜29歳）は会員にならなくても参加できますか？', a: 'はい。公開収録には、18〜29歳の方は事前申込のみで毎回無料で参加いただけます。' },
    { q: '法人契約・経費処理はできますか？', a: '可能です。請求書発行もご希望に応じて対応いたします。' },
  ]
  return (
    <section className="border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-6">FAQ</p>
          <h2
            className="font-display font-bold leading-[1.15] tracking-tight"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)' }}
          >
            よくある質問
          </h2>
        </div>
        <dl className="md:col-span-8 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faqs.map((f) => (
            <div key={f.q} className="py-8">
              <dt className="font-semibold text-[var(--color-text)] mb-3">{f.q}</dt>
              <dd className="text-sm text-[var(--color-text-muted)] leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// Final CTA
// ───────────────────────────────────────────────
function FinalCta() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-accent-tint)]">
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <p className="eyebrow mb-8" style={{ color: 'var(--color-accent-dark)' }}>
          Join SFJ
        </p>
        <h2
          className="font-display font-bold leading-[1.2] tracking-tight mb-8 text-[var(--color-text)]"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
        >
          挑戦文化を、一緒につくる<br />仲間を募集しています。
        </h2>
        <Link
          href={SUPPORT_URL}
          className="inline-block bg-[var(--color-text)] text-white px-10 py-4 text-sm hover:opacity-85 transition"
        >
          挑戦サポーターになる
        </Link>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────
// Footer
// ───────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-6">
          <Image src="/sfj-logo.png" alt="Step Forward Japan" width={160} height={32} />
          <p className="text-sm text-[var(--color-text-muted)] mt-6 max-w-md leading-relaxed">
            一般社団法人ステップフォワードジャパン<br />
            〒103-0022 東京都中央区日本橋室町1丁目11番12号 日本橋水野ビル7階
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Links</p>
          <ul className="space-y-3 text-sm">
            <li><a href="https://step-forward-japan.jp/" className="hover:text-[var(--color-accent-dark)]">公式サイト</a></li>
            <li><a href="https://open.spotify.com/show/3PaXMIvEGMhOHMaIBiOKxl" className="hover:text-[var(--color-accent-dark)]">Podcast</a></li>
            <li><a href="https://step-forward-japan.jp/contact" className="hover:text-[var(--color-accent-dark)]">お問い合わせ</a></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Contact</p>
          <ul className="space-y-3 text-sm">
            <li><a href="mailto:info@step-forward-japan.jp" className="hover:text-[var(--color-accent-dark)]">info@step-forward-japan.jp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-[var(--color-text-muted)] flex justify-between">
          <span>© Step Forward Japan</span>
          <span className="font-display tracking-widest uppercase">SFJ</span>
        </div>
      </div>
    </footer>
  )
}
