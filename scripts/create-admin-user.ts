/**
 * 理事ユーザーを Supabase Admin API で直接作成し、
 * ワンタイムログインリンクを発行するスクリプト
 *
 * メール送信をバイパスするため、レート制限に影響されない。
 *
 * 使い方:
 *   pnpm tsx scripts/create-admin-user.ts <email>
 *   例: pnpm tsx scripts/create-admin-user.ts info@step-forward-japan.jp
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
if (!email) {
  console.error('Usage: pnpm tsx scripts/create-admin-user.ts <email>')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  // 既存ユーザーを確認
  const { data: existing } = await supabase.auth.admin.listUsers()
  const found = existing?.users.find((u) => u.email === email)

  if (!found) {
    // 新規作成（メール認証済みフラグONで送信スキップ）
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    })
    if (error) {
      console.error('createUser error:', error.message)
      process.exit(1)
    }
    console.log(`✓ ユーザー作成: ${email} (id: ${data.user?.id})`)
  } else {
    console.log(`既存ユーザー: ${email} (id: ${found.id})`)
  }

  // マジックリンクを発行（メール送信なし、URLだけ取得）
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
        : 'http://localhost:3000/admin',
    },
  })

  if (linkError) {
    console.error('generateLink error:', linkError.message)
    process.exit(1)
  }

  console.log('\n========================================')
  console.log('ワンタイムログインリンク（このURLをブラウザで開く）')
  console.log('========================================')
  console.log(linkData.properties?.action_link)
  console.log('========================================\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
