import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 冪等性チェック: 既に処理済みのイベントはスキップ
  const { data: existing } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ received: true, duplicated: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        // 想定外イベントは記録のみ
        break
    }

    await supabase.from('stripe_events').insert({
      id: event.id,
      type: event.type,
      payload: event.data.object as unknown as Record<string, unknown>,
    })

    return NextResponse.json({ received: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] handler error:', msg, event.type, event.id)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient()
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
  if (!customerId) return

  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) return

  const email = customer.email ?? session.customer_details?.email
  const name = customer.name ?? session.customer_details?.name ?? null
  const phone = customer.phone ?? session.customer_details?.phone ?? null

  if (!email) return

  await supabase.from('members').upsert(
    {
      email,
      name,
      phone,
      stripe_customer_id: customerId,
      status: 'active',
    },
    { onConflict: 'stripe_customer_id' }
  )
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  const supabase = createAdminClient()
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) return

  const email = customer.email
  if (!email) return

  // Stripe SDK の型に余裕を持たせて current_period_* を取得
  const subAny = sub as unknown as {
    current_period_start?: number
    current_period_end?: number
    cancel_at?: number | null
  }

  const status = mapStripeStatus(sub.status)

  await supabase.from('members').upsert(
    {
      email,
      name: customer.name,
      phone: customer.phone,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      status,
      current_period_start: subAny.current_period_start
        ? new Date(subAny.current_period_start * 1000).toISOString()
        : null,
      current_period_end: subAny.current_period_end
        ? new Date(subAny.current_period_end * 1000).toISOString()
        : null,
      cancel_at: subAny.cancel_at
        ? new Date(subAny.cancel_at * 1000).toISOString()
        : null,
    },
    { onConflict: 'stripe_customer_id' }
  )
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const supabase = createAdminClient()
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id

  await supabase
    .from('members')
    .update({ status: 'cancelled', cancel_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId)
}

function mapStripeStatus(s: Stripe.Subscription.Status): 'active' | 'past_due' | 'cancelled' | 'incomplete' {
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
