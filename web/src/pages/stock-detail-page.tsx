import { Link } from '@tanstack/react-router'

import { getStockByTicker } from '../data/mock-stocks'

interface StockDetailPageProps {
  ticker: string
}

export function StockDetailPage({ ticker }: StockDetailPageProps) {
  const stock = getStockByTicker(ticker)

  if (!stock) {
    return (
      <section className="rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-elevated)] p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Stock Not Found
        </p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight">
          There is no mock stock wired to {ticker.toUpperCase()} yet.
        </h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full border border-[var(--line-subtle)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)]"
        >
          Back to dashboard
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[2rem] border border-[var(--line-subtle)] bg-[var(--surface-elevated)] p-8 shadow-[0_24px_80px_rgba(24,33,27,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Link
              to="/"
              className="text-sm font-medium text-[var(--ink-muted)] transition hover:text-[var(--ink-primary)]"
            >
              ← Back to dashboard
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              {stock.businessType}
            </p>
            <h2 className="mt-2 font-serif text-5xl tracking-tight">
              {stock.companyName}
            </h2>
            <p className="mt-2 text-base text-[var(--ink-secondary)]">
              {stock.ticker} · Updated {stock.lastUpdated}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ink-secondary)]">
              {stock.summary}
            </p>
          </div>

          <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
            <MetricCard
              label="Current Price"
              value={`$${stock.currentPrice.toFixed(1)}`}
            />
            <MetricCard
              label="Fair Value Range"
              value={`$${stock.bearFairValue.toFixed(0)} - $${stock.bullFairValue.toFixed(0)}`}
            />
            <MetricCard label="Action State" value={stock.actionState} />
            <MetricCard label="Thesis Status" value={stock.thesisStatus} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-[1.75rem] border border-[var(--line-subtle)] bg-[var(--surface-elevated)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Mock Data Shape Preview
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <FieldGroup
              title="Thesis"
              items={[stock.thesisStatement, ...stock.thesisBullets]}
            />
            <FieldGroup
              title="Variant Perception"
              items={[stock.variantPerception]}
            />
            <FieldGroup
              title="Valuation Lens"
              items={[
                `Primary: ${stock.valuationLens.primary}`,
                `Cross-check: ${stock.valuationLens.crossCheck}`,
                stock.valuationLens.rationale,
              ]}
            />
            <FieldGroup
              title="What To Monitor Next"
              items={stock.monitorNext}
            />
          </div>
        </article>

        <aside className="rounded-[1.75rem] border border-[var(--line-subtle)] bg-[var(--surface-elevated)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Wiring Notes
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--ink-secondary)]">
            <li>News-to-model items: {stock.newsToModel.length}</li>
            <li>Scenario cards available: {stock.scenarios.length}</li>
            <li>Sources listed: {stock.sourcesUsed.length}</li>
            <li>History items: {stock.history.length}</li>
          </ul>
        </aside>
      </section>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--line-subtle)] bg-[var(--surface-canvas)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold capitalize text-[var(--ink-primary)]">
        {value}
      </p>
    </div>
  )
}

interface FieldGroupProps {
  title: string
  items: string[]
}

function FieldGroup({ title, items }: FieldGroupProps) {
  return (
    <section>
      <h3 className="font-serif text-2xl tracking-tight">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--ink-secondary)]">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl bg-[var(--surface-canvas)] px-4 py-3"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
