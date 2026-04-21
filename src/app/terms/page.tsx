import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '会員規約 | Step Forward Japan',
  description: '一般社団法人ステップフォワードジャパン 会員規約（会員申込書兼契約書）',
}

export default function TermsPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/sfj-logo.png" alt="Step Forward Japan" width={160} height={32} priority />
          </Link>
          <Link href="/join" className="eyebrow hover:text-[var(--color-text)] transition">
            ← Back to Join
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[var(--color-border)]">
          <div className="max-w-3xl mx-auto px-6 py-24 md:py-28">
            <p className="eyebrow mb-6">Terms</p>
            <h1
              className="font-display font-bold leading-[1.15] tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
            >
              会員規約
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              会員申込書兼契約書（秘密保持契約含む）
            </p>
          </div>
        </section>

        <section>
          <article className="max-w-3xl mx-auto px-6 py-20 text-[var(--color-text)] leading-[1.9]">
            <Clause title="第1条（契約の趣旨）">
              本契約は、申込者（以下「乙」）が、一般社団法人ステップフォワードジャパン（以下「甲」）のビジョンおよび活動趣旨に賛同し、会員として参画するにあたり、両者の権利義務関係を明確にすることを目的とします。
            </Clause>

            <Clause title="第2条（活動内容と目的）">
              <p>甲は「失敗できる社会の醸成」をビジョンとし、以下のような場を提供します。</p>
              <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                <li>月1回の定例会やイベント（失敗の履歴書、チャレンジシェア等）</li>
                <li>オンラインクローズドコミュニティ（ネットワーキング、相談機会、事例共有など）</li>
                <li>会員同士の学びと実践を支えるコンテンツ・アーカイブ</li>
              </ul>
            </Clause>

            <Clause title="第3条（会員種別および会費）">
              <ul className="list-disc pl-6 space-y-1 text-sm text-[var(--color-text-muted)]">
                <li>協賛会員（法人）：年額 300,000 円（税込）、3 名まで参加可能、団体の HP にロゴ掲載</li>
                <li>一般会員（個人）：年額 30,000 円（税込）</li>
              </ul>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                支払後の返金は理由を問わず不可とし、支払方法は Square 決済とします。
              </p>
            </Clause>

            <Clause title="第4条（禁止事項）">
              <p>乙は、以下の行為を一切行わないことに同意します。</p>
              <ol className="list-decimal pl-6 mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                <li>本活動を利用した営業行為、営利活動、ネットワークビジネス（連鎖販売取引）等の勧誘</li>
                <li>宗教団体・思想団体等への勧誘</li>
                <li>他の会員への迷惑行為、誹謗中傷、情報の無断開示</li>
                <li>反社会的勢力との関係を持つこと、またはそれに準ずる行為</li>
              </ol>
            </Clause>

            <Clause title="第5条(契約期間および更新)">
              本契約の有効期間は申込日より 1 年間とし、乙より書面または所定フォームにて退会の意思表示がない限り、自動更新されます。
            </Clause>

            <Clause title="第6条（退会）">
              乙は、退会を希望する場合は 1 ヶ月前までに書面またはフォームにて甲に通知することで、任意に契約を終了できます。既に支払済の会費の返金は行われません。
            </Clause>

            <Clause title="第7条（契約解除）">
              <p>甲または乙は、相手方が以下のいずれかに該当する場合、本契約を催告なしに解除できるものとします。</p>
              <ol className="list-decimal pl-6 mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                <li>本契約に違反し、相当期間内に是正がなされなかった場合</li>
                <li>信用、名誉または信頼関係を著しく損なう行為を行った場合</li>
                <li>破産・民事再生等の法的整理に関する申立がなされた場合</li>
                <li>差押え、競売、支払停止等が発生した場合</li>
                <li>合併、事業譲渡、解散その他重大な事業変更があった場合</li>
                <li>その他、前各号に準ずる重大な信用不安があると甲または乙が合理的に判断した場合</li>
              </ol>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                本条に基づく解除は、損害賠償の請求を妨げません。
              </p>
            </Clause>

            <Clause title="第8条（秘密保持）">
              乙は、甲の提供する活動、会員情報、他会員の発言・体験談、非公開情報等について、事前の書面許可なく第三者に開示・漏洩・転載してはなりません。この義務は契約終了後も継続します。
            </Clause>

            <Clause title="第9条（写真・映像等の使用同意）">
              <p>乙は、甲が主催するイベント・活動において撮影された写真・映像・発言等が、以下の目的で使用されることに同意します。</p>
              <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                <li>広報・記録・報告・募集等（SNS、ウェブサイト、報告書、パンフレットなど）</li>
                <li>氏名・発言が付随して利用される可能性</li>
                <li>使用に対して金銭等の対価や削除要求を行わない</li>
              </ul>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                ただし、乙が事前に申し出た場合は、個別に対応します。
              </p>
            </Clause>

            <Clause title="第10条（不可抗力によるサービス中断）">
              地震、台風、水害、火災、戦争、内乱、感染症（COVID-19 含む）、ストライキ、政府や公的機関の指示等により、甲が乙へのサービス提供を継続できない場合、またはそのおそれがある場合、甲は乙に事前の連絡なくサービスを中断することがあり、この中断に関する損害賠償責任を負わないものとします。
            </Clause>

            <Clause title="第11条（損害賠償）">
              甲または乙が、自身の責めに帰すべき行為により相手方に損害を与えた場合は、速やかにこれを賠償するものとします。
            </Clause>

            <Clause title="第12条（合意管轄）">
              本契約に関する紛争については、甲の主たる事務所所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </Clause>

            <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-sm text-[var(--color-text-muted)] leading-relaxed">
              <p>一般社団法人ステップフォワードジャパン</p>
              <p>〒103-0022 東京都中央区日本橋室町 1 丁目 11 番 12 号 日本橋水野ビル 7 階</p>
              <p>
                <a href="mailto:info@step-forward-japan.jp" className="hover:text-[var(--color-accent-dark)]">
                  info@step-forward-japan.jp
                </a>
              </p>
            </div>
          </article>
        </section>

        <section className="border-t border-[var(--color-border)] bg-[var(--color-accent-tint)]">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <Link
              href="/join"
              className="inline-block bg-[var(--color-text)] text-white px-10 py-4 text-sm hover:opacity-85 transition"
            >
              申込ページに戻る
            </Link>
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

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-bold mb-3 text-[var(--color-text)]">{title}</h2>
      <div className="text-sm text-[var(--color-text-muted)] leading-[1.9]">{children}</div>
    </section>
  )
}
