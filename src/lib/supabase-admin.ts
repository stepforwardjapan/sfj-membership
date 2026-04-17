import { createClient } from '@supabase/supabase-js'

// service_roleキーを使うサーバー側クライアント（RLSをバイパス）
// Webhook処理や管理スクリプトでのみ使用
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
