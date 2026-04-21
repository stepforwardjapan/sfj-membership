import type { Metadata } from 'next'
import { Noto_Sans_JP, Raleway } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

const raleway = Raleway({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Step Forward Japan | 失敗できる社会の醸成',
  description:
    '一般社団法人ステップフォワードジャパン。失敗をポジティブに捉え、挑戦し一歩踏み出す人々を輩出する活動を行っています。',
  openGraph: {
    title: 'Step Forward Japan | 失敗できる社会の醸成',
    description: '挑戦し一歩踏み出す人々を輩出する。SFJ 挑戦サポーター募集中。',
    images: ['/sfj-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
