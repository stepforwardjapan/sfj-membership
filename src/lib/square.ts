/**
 * Square API クライアント
 *
 * Square SDK v44+ の API パターンを利用。
 * 環境（production / sandbox）は SQUARE_ENVIRONMENT で切り替え。
 */
import { SquareClient, SquareEnvironment } from 'square'

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === 'sandbox'
      ? SquareEnvironment.Sandbox
      : SquareEnvironment.Production,
})

/**
 * 決済日 + 1年 を有効期限として返す
 */
export function calcExpiresAt(paidAt: Date | string): Date {
  const base = typeof paidAt === 'string' ? new Date(paidAt) : paidAt
  const expires = new Date(base)
  expires.setFullYear(expires.getFullYear() + 1)
  return expires
}

/**
 * Square Webhook 署名検証
 * https://developer.squareup.com/docs/webhooks/step3validate
 */
export async function verifySquareWebhookSignature(
  body: string,
  signature: string,
  notificationUrl: string,
  signatureKey: string
): Promise<boolean> {
  const stringToSign = notificationUrl + body
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signatureKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign))
  const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
  return expected === signature
}
