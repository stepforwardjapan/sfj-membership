'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">SFJ 管理画面</h1>
        <p className="text-sm text-gray-600 mb-6">理事メンバー専用ログイン</p>

        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => {
              setMode('password')
              setError(null)
              setSent(false)
            }}
            className={`px-3 py-2 text-sm ${
              mode === 'password'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            パスワード
          </button>
          <button
            onClick={() => {
              setMode('magic')
              setError(null)
              setSent(false)
            }}
            className={`px-3 py-2 text-sm ${
              mode === 'magic'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            マジックリンク
          </button>
        </div>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
            <p className="font-semibold mb-1">メールを送信しました</p>
            <p>{email} にログインリンクを送りました。</p>
          </div>
        ) : (
          <form
            onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@step-forward-japan.jp"
              />
            </div>

            {mode === 'password' && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? '処理中...'
                : mode === 'password'
                ? 'ログイン'
                : 'ログインリンクをメールで受け取る'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
