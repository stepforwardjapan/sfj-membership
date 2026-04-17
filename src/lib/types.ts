export type MemberStatus = 'active' | 'past_due' | 'cancelled' | 'incomplete'

export interface Member {
  id: string
  email: string
  name: string | null
  name_kana: string | null
  organization: string | null
  phone: string | null
  display_name: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: MemberStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at: string | null
  notes: string | null
  invited_by: string | null
  registered_at: string
  created_at: string
  updated_at: string
}
