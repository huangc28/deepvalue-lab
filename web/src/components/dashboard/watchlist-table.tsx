import { Link } from '@tanstack/react-router'

import { useI18n } from '../../i18n/context'
import type { StockSummary } from '../../types/stocks'
import {
  ActionBadge,
  NewsImpactBadge,
  TechnicalBadge,
  ThesisBadge,
} from '../ui/status-badge'
import { Panel, PanelBody, PanelChrome } from '../ui/panel'

export function WatchlistTable({ stocks }: { stocks: StockSummary[] }) {
  const { m, text } = useI18n()

  return (
    <Panel className="overflow-hidden">
      <PanelChrome
        label="watchlist.table"
        status={`${stocks.length} ${m.table.names}`}
      />
      <PanelBody className="overflow-x-auto p-0">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--line-subtle)] bg-[rgba(255,255,255,0.02)] text-left">
              {m.table.headers.map((label) => (
                <th
                  key={label}
                  className="px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.id}
                className="border-b border-[var(--line-subtle)] last:border-b-0"
              >
                <td className="px-5 py-4 font-mono text-sm text-[var(--ink-primary)]">
                  <Link
                    to="/stocks/$ticker"
                    params={{ ticker: stock.ticker }}
                    className="hover:text-[var(--accent-copper)]"
                  >
                    {stock.ticker}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink-primary)]">
                      {stock.companyName}
                    </p>
                    <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                      {text(stock.businessType)}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-sm text-[var(--ink-primary)]">
                  ${stock.currentPrice.toFixed(1)}
                </td>
                <td className="px-5 py-4 font-mono text-sm text-[var(--ink-primary)]">
                  ${stock.baseFairValue.toFixed(0)}
                </td>
                <td className="px-5 py-4 font-mono text-sm text-[var(--ink-primary)]">
                  {stock.discountToBase > 0 ? '+' : ''}
                  {stock.discountToBase.toFixed(1)}%
                </td>
                <td className="px-5 py-4">
                  <NewsImpactBadge value={stock.newsImpactStatus} />
                </td>
                <td className="px-5 py-4">
                  <ThesisBadge value={stock.thesisStatus} />
                </td>
                <td className="px-5 py-4">
                  <TechnicalBadge value={stock.technicalEntryStatus} />
                </td>
                <td className="px-5 py-4">
                  <ActionBadge value={stock.actionState} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PanelBody>
    </Panel>
  )
}
