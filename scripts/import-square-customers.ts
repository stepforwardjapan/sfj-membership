/**
 * Square の既存顧客 + 決済履歴を取り込んで members テーブルに登録するスクリプト
 *
 * 使い方:
 *   pnpm import:square
 *
 * 必要な環境変数:
 *   SQUARE_ACCESS_TOKEN
 *   SQUARE_ENVIRONMENT (production | sandbox)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * 動作:
 *   1. Square の全顧客を取得
 *   2. 全決済（COMPLETED）を取得し customer_id でグルーピング
 *   3. 顧客ごとに最新決済を特定し、members に upsert
 *      - last_paid_at = 最新決済日
 *      - expires_at   = 最新決済日 + 1年
 *      - status       = 期限内なら 'active'、期限切れなら 'expired'
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { SquareClient, SquareEnvironment } from 'square'

const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === 'sandbox'
      ? SquareEnvironment.Sandbox
      : SquareEnvironment.Production,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function calcExpiresAt(paidAt: Date): Date {
  const e = new Date(paidAt)
  e.setFullYear(e.getFullYear() + 1)
  return e
}

interface CustomerLite {
  id: string
  emailAddress?: string | null
  givenName?: string | null
  familyName?: string | null
  phoneNumber?: string | null
  companyName?: string | null
}

interface PaymentLite {
  id?: string
  status?: string
  customerId?: string
  createdAt?: string
}

async function main() {
  console.log('Square → members 取り込み開始\n')

  // ─── 全顧客を取得 ───
  const customers: CustomerLite[] = []
  const customersPage = await square.customers.list({})
  for await (const c of customersPage) {
    customers.push(c as CustomerLite)
  }
  console.log(`顧客総数: ${customers.length}`)

  // ─── 全決済を取得（直近12か月分） ───
  // Note: Square Payments API では customer_id でのフィルタができないため、
  // 全件取得してメモリ上で customer_id ごとにグルーピングする
  const paymentsByCustomer = new Map<string, PaymentLite>() // customer_id → 最新payment
  const beginTime = new Date()
  beginTime.setFullYear(beginTime.getFullYear() - 2) // 念のため2年遡る

  const paymentsPage = await square.payments.list({
    beginTime: beginTime.toISOString(),
    sortOrder: 'DESC',
  })

  let totalPayments = 0
  for await (const p of paymentsPage) {
    totalPayments++
    const payment = p as PaymentLite
    if (payment.status !== 'COMPLETED') continue
    if (!payment.customerId) continue

    // 最新（最初に登場した = DESCソートの最初）のみ保持
    if (!paymentsByCustomer.has(payment.customerId)) {
      paymentsByCustomer.set(payment.customerId, payment)
    }
  }
  console.log(`決済総数: ${totalPayments} (うち顧客紐付き完了: ${paymentsByCustomer.size})\n`)

  // ─── members に upsert ───
  let imported = 0
  let skipped = 0

  for (const customer of customers) {
    const email = customer.emailAddress
    const name =
      [customer.familyName, customer.givenName].filter(Boolean).join(' ') || null

    if (!email) {
      console.warn(`  skip: ${name ?? customer.id} (メールなし)`)
      skipped++
      continue
    }

    const lastPayment = paymentsByCustomer.get(customer.id)
    if (!lastPayment) {
      console.warn(`  skip: ${email} (完了済み決済なし)`)
      skipped++
      continue
    }

    const paidAt = lastPayment.createdAt ? new Date(lastPayment.createdAt) : new Date()
    const expiresAt = calcExpiresAt(paidAt)
    const status = expiresAt > new Date() ? 'active' : 'expired'

    const { error } = await supabase.from('members').upsert(
      {
        email,
        name,
        phone: customer.phoneNumber ?? null,
        organization: customer.companyName ?? null,
        square_customer_id: customer.id,
        last_square_payment_id: lastPayment.id,
        status,
        registered_at: paidAt.toISOString(),
        last_paid_at: paidAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: 'square_customer_id' }
    )

    if (error) {
      console.error(`  error: ${email}`, error.message)
      skipped++
    } else {
      console.log(
        `  ✓ ${email}  (有効期限: ${expiresAt.toLocaleDateString('ja-JP')}, ${status})`
      )
      imported++
    }
  }

  console.log(`\n完了: ${imported}件取り込み / ${skipped}件スキップ`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
