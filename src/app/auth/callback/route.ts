import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * Supabase 認証コールバック
 * マジックリンク → /auth/callback?code=... → セッションCookie設定 → リダイレクト
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth/callback] exchange error:', error.message)
      return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, url.origin))
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
