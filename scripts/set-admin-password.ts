/**
 * 理事ユーザーにパスワードを設定（メール送信なし）
 *
 * 使い方:
 *   pnpm tsx scripts/set-admin-password.ts <email> <password>
 *   例: pnpm tsx scripts/set-admin-password.ts info@step-forward-japan.jp MyPass123!
 *
 * その後、管理画面のログインページでメール + パスワードでログイン可能。
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: pnpm tsx scripts/set-admin-password.ts <email> <password>')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  const { data: existing } = await supabase.auth.admin.listUsers()
  let userId = existing?.users.find((u) => u.email === email)?.id

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) {
      console.error('createUser error:', error.message)
      process.exit(1)
    }
    userId = data.user?.id
    console.log(`✓ ユーザー作成 + パスワード設定: ${email}`)
    return
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  })

  if (error) {
    console.error('updateUser error:', error.message)
    process.exit(1)
  }

  console.log(`✓ パスワード設定完了: ${email}`)
  console.log(`\nログインページ: https://sfj-membership.vercel.app/admin/login`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
