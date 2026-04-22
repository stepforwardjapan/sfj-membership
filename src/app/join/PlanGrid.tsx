'use client'

import { useState } from 'react'
import Link from 'next/link'

type Plan = {
  id: string
  label: string
  name: string
  price: string
  per: string
  url: string
  description: string
  benefits: readonly string[]
  highlighted?: boolean
  requireAgreement: boolean
}

export function PlanGrid({ plans }: { plans: readonly Plan[] }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div>
      <div className="max-w-2xl mx-auto mb-12 p-6 md:p-8 bg-white border border-[var(--color-border)]">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm text-[var(--color-text)] leading-relaxed">
            <Link href="/terms" target="_blank" className="underline hover:text-[var(--color-accent-dark)]">
              会員規約（会員申込書兼契約書）
            </Link>
            を確認し、内容に同意のうえ申し込みます。
            <span className="block text-xs text-[var(--color-text-muted)] mt-1">
              （寄付のみのお申込みには同意は不要です）
            </span>
          </span>
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} agreed={agreed} />
        ))}
      </div>
    </div>
  )
}

function PlanCard({ plan, agreed }: { plan: Plan; agreed: boolean }) {
  const isDisabled = plan.requireAgreement && !agreed
  return (
    <div
      className={`bg-white p-8 md:p-10 flex flex-col ${
        plan.highlighted ? 'ring-1 ring-[var(--color-accent)] relative' : ''
      }`}
    >
      {plan.highlighted && (
        <span
          className="absolute top-0 right-0 text-[0.6rem] font-semibold tracking-widest uppercase text-white px-3 py-1"
          style={{ background: 'var(--color-accent)' }}
        >
          Recommended
        </span>
      )}
      <p className="eyebrow mb-4" style={{ color: 'var(--color-accent-dark)' }}>
        {plan.label}
      </p>
      <h3 className="font-display font-bold text-xl mb-6 text-[var(--color-text)]">{plan.name}</h3>
      <div className="flex items-end gap-2 mb-6">
        <span className="font-display font-black text-4xl text-[var(--color-text)]">{plan.price}</span>
        {plan.per && <span className="text-xs text-[var(--color-text-muted)] mb-2">{plan.per}</span>}
      </div>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-8">{plan.description}</p>
      <ul className="space-y-3 text-sm text-[var(--color-text-muted)] mb-10 flex-grow">
        {plan.benefits.map((b) => (
          <li key={b} className="flex gap-3">
            <svg width="14" height="14" viewBox="0 0 16 16" className="flex-shrink-0 mt-1.5" aria-hidden>
              <path d="M3 8L6.5 11.5L13 5" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {isDisabled ? (
        <button
          disabled
          className="block text-center py-4 text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
          title="規約への同意が必要です"
        >
          規約に同意してください
        </button>
      ) : (
        <a
          href={plan.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-center py-4 text-sm transition ${
            plan.highlighted
              ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]'
              : 'bg-[var(--color-text)] text-white hover:opacity-85'
          }`}
        >
          {plan.id === 'donation' ? '寄付する' : '申し込む'}
        </a>
      )}
    </div>
  )
}
