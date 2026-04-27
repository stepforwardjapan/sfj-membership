import { describe, it, expect } from 'vitest'
import { calcExpiresAt, verifySquareWebhookSignature } from '@/lib/square'

/**
 * 正しい署名を Square の手順に従って計算するヘルパー。
 * テスト内での「期待値生成」と、実装側の検証が一致することを確かめる。
 */
async function computeSquareSignature(
  body: string,
  notificationUrl: string,
  signatureKey: string
): Promise<string> {
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
  return btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
}

describe('verifySquareWebhookSignature', () => {
  const notificationUrl = 'https://example.com/api/square/webhook'
  const signatureKey = 'test-signature-key-1234567890'
  const body = JSON.stringify({ type: 'payment.updated', data: { id: 'abc' } })

  it('returns true when the signature matches the body + url + key', async () => {
    const validSig = await computeSquareSignature(body, notificationUrl, signatureKey)
    const result = await verifySquareWebhookSignature(
      body,
      validSig,
      notificationUrl,
      signatureKey
    )
    expect(result).toBe(true)
  })

  it('returns false for a tampered signature', async () => {
    const validSig = await computeSquareSignature(body, notificationUrl, signatureKey)
    // 1文字書き換える（base64 として有効な範囲で）
    const tampered = validSig.slice(0, -2) + (validSig.endsWith('A') ? 'B' : 'A') + '='
    const result = await verifySquareWebhookSignature(
      body,
      tampered,
      notificationUrl,
      signatureKey
    )
    expect(result).toBe(false)
  })

  it('returns false when the body has been modified', async () => {
    const validSig = await computeSquareSignature(body, notificationUrl, signatureKey)
    const modifiedBody = body.replace('abc', 'xyz')
    const result = await verifySquareWebhookSignature(
      modifiedBody,
      validSig,
      notificationUrl,
      signatureKey
    )
    expect(result).toBe(false)
  })

  it('returns false when the signature key is wrong', async () => {
    const validSig = await computeSquareSignature(body, notificationUrl, signatureKey)
    const result = await verifySquareWebhookSignature(
      body,
      validSig,
      notificationUrl,
      'wrong-key'
    )
    expect(result).toBe(false)
  })
})

describe('calcExpiresAt', () => {
  it('returns a date exactly one year after the given Date', () => {
    const paidAt = new Date('2026-04-26T12:00:00Z')
    const expires = calcExpiresAt(paidAt)
    expect(expires.getUTCFullYear()).toBe(2027)
    expect(expires.getUTCMonth()).toBe(paidAt.getUTCMonth())
    expect(expires.getUTCDate()).toBe(paidAt.getUTCDate())
  })

  it('accepts an ISO string and returns a Date one year later', () => {
    const expires = calcExpiresAt('2026-01-15T00:00:00Z')
    expect(expires).toBeInstanceOf(Date)
    expect(expires.getUTCFullYear()).toBe(2027)
    expect(expires.getUTCMonth()).toBe(0) // January
    expect(expires.getUTCDate()).toBe(15)
  })

  it('does not mutate the input Date', () => {
    const paidAt = new Date('2026-04-26T12:00:00Z')
    const before = paidAt.getTime()
    calcExpiresAt(paidAt)
    expect(paidAt.getTime()).toBe(before)
  })
})
