/**
 * Next.js instrumentation hook (server-side).
 * SENTRY_DSN が設定されているときだけ Sentry を初期化する。
 * ローカル開発で DSN が無くても動作するように conditional にしている。
 */
import * as Sentry from '@sentry/nextjs'

export async function register() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
    })
  }
}

export const onRequestError = Sentry.captureRequestError
