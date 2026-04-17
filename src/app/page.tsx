import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">SFJ Membership</h1>
        <p className="text-gray-600 mb-8">一般社団法人ステップフォワードジャパン 会員管理システム</p>
        <Link
          href="/admin"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          管理画面へ
        </Link>
      </div>
    </main>
  )
}
