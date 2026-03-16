import { Link } from '@tanstack/react-router'

import type { StockSummary } from '../../types/stocks'
import {
  ActionBadge,
  TechnicalBadge,
  ThesisBadge,
  ValuationBadge,
} from '../ui/status-badge'
import { Panel, PanelBody, PanelChrome } from '../ui/panel'

export function CompanyCard({ stock }: { stock: StockSummary }) {
  return (
    <Link
      to="/stocks/$ticker"
      params={{ ticker: stock.ticker }}
      className="block"
    >
      <Panel className="group h-full overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[0_34px_90px_rgba(0,0,0,0.32)]">
        <PanelChrome
          label={`${stock.ticker.toLowerCase()}.md`}
          status={stock.lastUpdated}
        />
        <PanelBody className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-[1.55rem] leading-[1.1] tracking-[-0.04em] text-[var(--ink-primary)]">
                {stock.companyName}
              </p>
              <p className="mt-2 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                {stock.ticker} · {stock.businessType}
              </p>
            </div>
            <ActionBadge value={stock.actionState} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricColumn
              label="price"
              value={`$${stock.currentPrice.toFixed(1)}`}
            />
            <MetricColumn
              label="base fair value"
              value={`$${stock.baseFairValue.toFixed(0)}`}
            />
            <MetricColumn
              label="discount to base"
              value={`${stock.discountToBase > 0 ? '+' : ''}${stock.discountToBase.toFixed(1)}%`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <ValuationBadge value={stock.valuationStatus} />
            <ThesisBadge value={stock.thesisStatus} />
            <TechnicalBadge value={stock.technicalEntryStatus} />
          </div>

          <p className="text-sm leading-7 text-[var(--ink-secondary)]">
            {stock.summary}
          </p>
        </PanelBody>
      </Panel>
    </Link>
  )
}

function MetricColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-3 py-3">
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold text-[var(--ink-primary)]">
        {value}
      </p>
    </div>
  )
}
