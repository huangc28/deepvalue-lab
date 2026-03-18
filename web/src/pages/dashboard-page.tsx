import { startTransition, useDeferredValue, useMemo, useState } from 'react'

import { CompanyCard } from '../components/dashboard/company-card'
import { WatchlistTable } from '../components/dashboard/watchlist-table'
import { ErrorState } from '../components/ui/error-state'
import { LoadingState } from '../components/ui/loading-state'
import { MetricBlock } from '../components/ui/metric-block'
import {
  Panel,
  PanelBody,
  PanelChrome,
  PanelLead,
} from '../components/ui/panel'
import { AccentBadge } from '../components/ui/status-badge'
import { TerminalLabel } from '../components/ui/terminal-label'
import { useI18n } from '../i18n/context'
import { flattenLocalizedText } from '../i18n/utils'
import { computeDashboardCounts, useStocks } from '../lib/queries'
import type { DashboardBucket, StockSummary } from '../types/stocks'

type ViewMode = 'cards' | 'table'
type SortMode = 'most-actionable' | 'largest-discount' | 'recently-updated'

const EMPTY_STOCKS: StockSummary[] = []

export function DashboardPage() {
  const { m } = useI18n()
  const { data: stocks = EMPTY_STOCKS, isLoading, error } = useStocks()
  const counts = useMemo(() => computeDashboardCounts(stocks), [stocks])
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [bucketFilter, setBucketFilter] = useState<DashboardBucket | 'all'>(
    'all',
  )
  const [sortMode, setSortMode] = useState<SortMode>('most-actionable')
  const [query, setQuery] = useState('')

  const filters: Array<{ label: string; value: DashboardBucket | 'all' }> = [
    { label: m.dashboard.filters.all, value: 'all' },
    {
      label: m.dashboard.filters['now-actionable'],
      value: 'now-actionable',
    },
    {
      label: m.dashboard.filters['needs-review'],
      value: 'needs-review',
    },
    { label: m.dashboard.filters['at-risk'], value: 'at-risk' },
  ]

  const deferredQuery = useDeferredValue(query)

  const filteredStocks = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return stocks
      .filter((stock) => {
        if (bucketFilter !== 'all' && stock.dashboardBucket !== bucketFilter) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const haystack =
          `${stock.ticker} ${stock.companyName} ${flattenLocalizedText(stock.businessType)} ${flattenLocalizedText(stock.summary)}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
      .toSorted(sortStocks(sortMode))
  }, [stocks, bucketFilter, deferredQuery, sortMode])

  if (isLoading) return <LoadingState label="deepvalue-lab://watchlist" />
  if (error) return <ErrorState label="deepvalue-lab://watchlist" />

  return (
    <div className="flex flex-col gap-8">
      <Panel className="overflow-hidden bg-[linear-gradient(135deg,_rgba(22,27,34,1),_rgba(13,17,23,1))]">
        <PanelChrome label={m.dashboard.heroLabel} status={m.dashboard.heroStatus} />
        <PanelBody className="space-y-8 p-8">
          <PanelLead
            label="deepvalue-lab://watchlist"
            title={
              <>
                <span className="text-[var(--accent-copper)]">&gt;</span>{' '}
                {m.dashboard.heroTitle}
              </>
            }
            description={m.dashboard.heroDescription}
            aside={<AccentBadge label={m.badge.cardsDefault} />}
          />

          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
            <Panel className="overflow-hidden bg-[var(--surface-panel-alt)]">
              <PanelChrome
                label={m.dashboard.summaryLabel}
                status={m.dashboard.summaryStatus}
              />
              <PanelBody>
                <div className="grid gap-4 md:grid-cols-3">
                  {(
                    Object.entries(m.dashboard.buckets) as Array<
                      [DashboardBucket, string]
                    >
                  ).map(([bucket, label]) => (
                    <MetricBlock
                      key={bucket}
                      label={label}
                      value={String(counts[bucket as keyof typeof counts])}
                      detail={m.dashboard.summaryDetail}
                    />
                  ))}
                </div>
              </PanelBody>
            </Panel>

            <Panel className="overflow-hidden bg-[var(--surface-panel-alt)]">
              <PanelChrome
                label={m.dashboard.operatorPanelLabel}
                status={m.dashboard.operatorStatus}
              />
              <PanelBody className="space-y-4">
                <TerminalLabel>{m.dashboard.operatorLabel}</TerminalLabel>
                <ul className="space-y-3 text-sm leading-7 text-[var(--ink-secondary)]">
                  {m.dashboard.operatorBullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          </div>
        </PanelBody>
      </Panel>

      <div>
        <Panel className="overflow-hidden">
          <PanelChrome
            label={m.dashboard.boardLabel}
            status={`${filteredStocks.length} ${m.dashboard.boardVisible}`}
          />
          <PanelBody className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex flex-col gap-3">
                <div>
                  <TerminalLabel>{m.dashboard.browseLabel}</TerminalLabel>
                  <h3 className="mt-2 font-serif text-[2rem] tracking-[-0.04em] text-[var(--ink-primary)]">
                    {m.dashboard.browseTitle}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() =>
                        startTransition(() => {
                          setBucketFilter(filter.value)
                        })
                      }
                      className={
                        bucketFilter === filter.value
                          ? 'rounded-full border border-[color:rgba(88,166,255,0.3)] bg-[color:rgba(56,139,253,0.16)] px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--ink-primary)]'
                          : 'rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-[var(--ink-muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]'
                      }
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-3 py-1.5 font-mono text-[0.74rem] text-[var(--ink-secondary)]">
                    <span className="text-[var(--accent-copper)]">
                      {m.dashboard.searchLabel}
                    </span>
                    <input
                      value={query}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        startTransition(() => {
                          setQuery(nextValue)
                        })
                      }}
                      placeholder={m.dashboard.searchPlaceholder}
                      className="w-40 min-w-0 bg-transparent text-[var(--ink-primary)] outline-none placeholder:text-[var(--ink-faint)] focus-visible:outline-none"
                    />
                  </label>

                  <div className="flex items-center gap-2 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-3 py-1.5 font-mono text-[0.74rem] text-[var(--ink-secondary)]">
                    <span className="text-[var(--accent-copper)]">
                      {m.dashboard.sortLabel}
                    </span>
                    <select
                      value={sortMode}
                      onChange={(event) =>
                        startTransition(() => {
                          setSortMode(event.target.value as SortMode)
                        })
                      }
                      className="bg-transparent text-[var(--ink-primary)] outline-none"
                    >
                      <option value="most-actionable">
                        {m.dashboard.sortOptions['most-actionable']}
                      </option>
                      <option value="largest-discount">
                        {m.dashboard.sortOptions['largest-discount']}
                      </option>
                      <option value="recently-updated">
                        {m.dashboard.sortOptions['recently-updated']}
                      </option>
                    </select>
                  </div>

                  <div className="flex rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] p-0.5">
                    <ViewToggleButton
                      isActive={viewMode === 'cards'}
                      onClick={() =>
                        startTransition(() => {
                          setViewMode('cards')
                        })
                      }
                    >
                      {m.dashboard.view.cards}
                    </ViewToggleButton>
                    <ViewToggleButton
                      isActive={viewMode === 'table'}
                      onClick={() =>
                        startTransition(() => {
                          setViewMode('table')
                        })
                      }
                    >
                      {m.dashboard.view.table}
                    </ViewToggleButton>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'cards' ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredStocks.map((stock) => (
                  <CompanyCard key={stock.id} stock={stock} />
                ))}
              </div>
            ) : (
              <WatchlistTable stocks={filteredStocks} />
            )}
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}

function sortStocks(sortMode: SortMode) {
  switch (sortMode) {
    case 'largest-discount':
      return (left: StockSummary, right: StockSummary) =>
        left.discountToBase - right.discountToBase
    case 'recently-updated':
      return (left: StockSummary, right: StockSummary) =>
        right.lastUpdated.localeCompare(left.lastUpdated)
    case 'most-actionable':
    default:
      return (left: StockSummary, right: StockSummary) => {
        const priority = {
          'now-actionable': 0,
          'needs-review': 1,
          'at-risk': 2,
        } satisfies Record<DashboardBucket, number>

        if (
          priority[left.dashboardBucket] !== priority[right.dashboardBucket]
        ) {
          return (
            priority[left.dashboardBucket] - priority[right.dashboardBucket]
          )
        }

        return left.discountToBase - right.discountToBase
      }
  }
}

function ViewToggleButton({
  children,
  isActive,
  onClick,
}: {
  children: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isActive
          ? 'rounded-full bg-[color:rgba(56,139,253,0.18)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--ink-primary)]'
          : 'rounded-full px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--ink-muted)] transition hover:text-[var(--ink-primary)]'
      }
    >
      {children}
    </button>
  )
}
