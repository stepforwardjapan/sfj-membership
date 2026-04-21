import { NextRequest, NextResponse } from 'next/server'
import { squareClient, calcExpiresAt, verifySquareWebhookSignature } from '@/lib/square'
import { createAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Square Webhook 受信
 *
 * 想定イベント:
 *  - payment.created   : 支払いリンク経由で決済完了 → 会員登録/更新
 *  - payment.updated   : 状態変化（refundedなど）→ 必要に応じて反映
 *
 * Square Dashboard > 開発者 > Webhook で以下のURLを設定:
 *   https://<your-domain>/api/square/webhook
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-square-hmacsha256-signature')
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  const notificationUrl = process.env.SQUARE_WEBHOOK_URL

  if (!signature || !signatureKey || !notificationUrl) {
    return NextResponse.json(
      { error: 'Missing signature, signature key, or notification URL' },
      { status: 400 }
    )
  }

  const valid = await verifySquareWebhookSignature(body, signature, notificationUrl, signatureKey)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: SquareEvent
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 冪等性チェック
  const { data: existing } = await supabase
    .from('square_events')
    .select('id')
    .eq('id', event.event_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ received: true, duplicated: true })
  }

  try {
    if (event.type === 'payment.created' || event.type === 'payment.updated') {
      await handlePaymentEvent(event)
    }

    await supabase.from('square_events').insert({
      id: event.event_id,
      type: event.type,
      payload: event as unknown as Record<string, unknown>,
    })

    return NextResponse.json({ received: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[square-webhook] handler error:', msg, event.type, event.event_id)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

async function handlePaymentEvent(event: SquareEvent) {
  const supabase = createAdminClient()
  const payment = event.data?.object?.payment
  if (!payment) return
  if (payment.status !== 'COMPLETED') return // 失敗・保留はスキップ

  // 顧客情報を取得
  const customerId = payment.customer_id
  if (!customerId) {
    console.warn('[square-webhook] payment without customer_id:', payment.id)
    return
  }

  const customerRes = await squareClient.customers.get({ customerId })
  const customer = customerRes.customer
  if (!customer) return

  const email = customer.emailAddress
  if (!email) {
    console.warn('[square-webhook] customer without email:', customerId)
    return
  }

  const name = [customer.familyName, customer.givenName].filter(Boolean).join(' ') || null
  const phone = customer.phoneNumber ?? null
  const organization = customer.companyName ?? null

  const paidAt = payment.created_at ? new Date(payment.created_at) : new Date()
  const expiresAt = calcExpiresAt(paidAt)

  await supabase.from('members').upsert(
    {
      email,
      name,
      phone,
      organization,
      square_customer_id: customerId,
      last_square_payment_id: payment.id,
      status: 'active',
      last_paid_at: paidAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: 'square_customer_id' }
  )
}

// ─────────────────────────────────────────────
// Square Webhook ペイロードの最小限の型定義
// ─────────────────────────────────────────────
interface SquareEvent {
  event_id: string
  type: string
  data?: {
    object?: {
      payment?: {
        id: string
        status: string
        customer_id?: string
        created_at?: string
      }
    }
  }
}
