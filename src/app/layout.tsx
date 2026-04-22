import type { Metadata } from 'next'
import './globals.css'
// LINE Seed JP — 日本語・英数すべてに統一適用
import '@fontsource/line-seed-jp/400.css'
import '@fontsource/line-seed-jp/700.css'
import '@fontsource/line-seed-jp/800.css'

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
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
