/**
 * Stripeの既存Customer/Subscriptionを取り込んでmembersテーブルに登録するスクリプト
 *
 * 使い方:
 *   pnpm tsx scripts/import-stripe-customers.ts
 *
 * 必要な環境変数:
 *   STRIPE_SECRET_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import 'dotenv/config'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function mapStatus(s: Stripe.Subscription.Status): 'active' | 'past_due' | 'cancelled' | 'incomplete' {
  switch (s) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    case 'canceled':
      return 'cancelled'
    default:
      return 'incomplete'
  }
}

async function main() {
  console.log('Stripe → members 取り込み開始')

  let imported = 0
  let skipped = 0

  // アクティブなサブスクリプションを全件取得
  const subs = await stripe.subscriptions.list({ status: 'all', limit: 100, expand: ['data.customer'] })

  for (const sub of subs.data) {
    const customer = sub.customer as Stripe.Customer
    if (customer.deleted) {
      skipped++
      continue
    }
    const email = customer.email
    if (!email) {
      console.warn(`  skip: customer ${customer.id} にメールなし`)
      skipped++
      continue
    }

    const subAny = sub as unknown as {
      current_period_start?: number
      current_period_end?: number
      cancel_at?: number | null
    }

    const { error } = await supabase.from('members').upsert(
      {
        email,
        name: customer.name,
        phone: customer.phone,
        stripe_customer_id: customer.id,
        stripe_subscription_id: sub.id,
        status: mapStatus(sub.status),
        current_period_start: subAny.current_period_start
          ? new Date(subAny.current_period_start * 1000).toISOString()
          : null,
        current_period_end: subAny.current_period_end
          ? new Date(subAny.current_period_end * 1000).toISOString()
          : null,
        cancel_at: subAny.cancel_at ? new Date(subAny.cancel_at * 1000).toISOString() : null,
      },
      { onConflict: 'stripe_customer_id' }
    )

    if (error) {
      console.error(`  error: ${email}`, error.message)
      skipped++
    } else {
      console.log(`  ✓ ${email} (${sub.status})`)
      imported++
    }
  }

  console.log(`\n完了: ${imported}件取り込み / ${skipped}件スキップ`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
