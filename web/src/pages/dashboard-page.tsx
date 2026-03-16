import { Link } from '@tanstack/react-router'

import { getDashboardCounts, mockStocks } from '../data/mock-stocks'

const bucketLabels = {
  'now-actionable': 'Now Actionable',
  'needs-review': 'Needs Review',
  'at-risk': 'At Risk',
} as const

export function DashboardPage() {
  const counts = getDashboardCounts()

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[2rem] border border-[var(--line-subtle)] bg-[radial-gradient(circle_at_top_left,_rgba(161,185,167,0.22),_transparent_40%),linear-gradient(135deg,_var(--surface-elevated),_var(--surface-muted))] p-8 shadow-[0_24px_80px_rgba(24,33,27,0.08)]">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-[var(--line-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
            Phase 1 + 2
          </span>
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl tracking-tight">
              Frontend scaffold and mock data model are in place.
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--ink-secondary)]">
              This workspace now has the base shell, route structure, and a
              realistic local stock dataset that can drive the dashboard and
              detail views.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {Object.entries(bucketLabels).map(([bucket, label]) => (
          <article
            key={bucket}
            className="rounded-[1.5rem] border border-[var(--line-subtle)] bg-[var(--surface-elevated)] p-5"
          >
            <p className="text-sm font-medium text-[var(--ink-muted)]">
              {label}
            </p>
            <p className="mt-4 font-serif text-4xl tracking-tight text-[var(--ink-primary)]">
              {counts[bucket as keyof typeof counts]}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-[var(--line-subtle)] bg-[var(--surface-elevated)] p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              Mock Dataset Preview
            </p>
            <h3 className="mt-2 font-serif text-3xl tracking-tight">
              Stocks wired for the first dashboard iteration
            </h3>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[var(--ink-secondary)]">
            These cards are intentionally simple. They exist to prove the data
            model and routing, not to represent the final UI treatment.
          </p>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {mockStocks.map((stock) => (
            <Link
              key={stock.id}
              to="/stocks/$ticker"
              params={{ ticker: stock.ticker }}
              className="group rounded-[1.5rem] border border-[var(--line-subtle)] bg-[var(--surface-canvas)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[0_20px_60px_rgba(24,33,27,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl tracking-tight">
                    {stock.companyName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">
                    {stock.ticker} · {stock.businessType}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--line-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                  {stock.actionState}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Price
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[var(--ink-primary)]">
                    ${stock.currentPrice.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Base Fair Value
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[var(--ink-primary)]">
                    ${stock.baseFairValue.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    Discount To Base
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[var(--ink-primary)]">
                    {stock.discountToBase > 0 ? '+' : ''}
                    {stock.discountToBase.toFixed(1)}%
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-[var(--ink-secondary)]">
                {stock.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
