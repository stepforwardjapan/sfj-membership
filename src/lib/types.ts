export type MemberStatus = 'active' | 'expired' | 'cancelled'

export interface Member {
  id: string
  email: string
  name: string | null
  name_kana: string | null
  organization: string | null
  phone: string | null
  display_name: string | null
  square_customer_id: string | null
  last_square_payment_id: string | null
  status: MemberStatus
  registered_at: string
  last_paid_at: string | null
  expires_at: string | null
  notes: string | null
  invited_by: string | null
  created_at: string
  updated_at: string
}
