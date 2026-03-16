import { startTransition, useDeferredValue, useMemo, useState } from 'react'

import { CompanyCard } from '../components/dashboard/company-card'
import { WatchlistTable } from '../components/dashboard/watchlist-table'
import { MetricBlock } from '../components/ui/metric-block'
import {
  Panel,
  PanelBody,
  PanelChrome,
  PanelLead,
} from '../components/ui/panel'
import { AccentBadge } from '../components/ui/status-badge'
import { TerminalLabel } from '../components/ui/terminal-label'
import { getDashboardCounts, mockStocks } from '../data/mock-stocks'
import type { DashboardBucket, StockSummary } from '../types/stocks'

const bucketLabels = {
  'now-actionable': 'Now Actionable',
  'needs-review': 'Needs Review',
  'at-risk': 'At Risk',
} as const

type ViewMode = 'cards' | 'table'
type SortMode = 'most-actionable' | 'largest-discount' | 'recently-updated'

const filters: Array<{ label: string; value: DashboardBucket | 'all' }> = [
  { label: 'All Names', value: 'all' },
  { label: 'Now Actionable', value: 'now-actionable' },
  { label: 'Needs Review', value: 'needs-review' },
  { label: 'At Risk', value: 'at-risk' },
]

export function DashboardPage() {
  const counts = getDashboardCounts()
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [bucketFilter, setBucketFilter] = useState<DashboardBucket | 'all'>(
    'all',
  )
  const [sortMode, setSortMode] = useState<SortMode>('most-actionable')
  const [query, setQuery] = useState('')

  const deferredQuery = useDeferredValue(query)

  const filteredStocks = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return mockStocks
      .filter((stock) => {
        if (bucketFilter !== 'all' && stock.dashboardBucket !== bucketFilter) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const haystack =
          `${stock.ticker} ${stock.companyName} ${stock.businessType}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
      .toSorted(sortStocks(sortMode))
  }, [bucketFilter, deferredQuery, sortMode])

  return (
    <div className="flex flex-col gap-8">
      <Panel className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(211,155,123,0.18),_transparent_22%),linear-gradient(135deg,_rgba(15,16,18,1),_rgba(9,9,10,1))]">
        <PanelChrome
          label="main.ts"
          status="decision-support research cockpit"
        />
        <PanelBody className="space-y-8 p-8">
          <PanelLead
            label="deepvalue-lab://watchlist"
            title={
              <>
                <span className="text-[var(--accent-copper)]">&gt;</span>{' '}
                DeepValue Research Board
              </>
            }
            description="Track cheap versus fair value, thesis integrity, news-to-model changes, and entry timing in one dark research workspace. This mockup now follows the DeepValue Terminal Editorial direction."
            aside={<AccentBadge label="cards default · table secondary" />}
          />

          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
            <Panel className="overflow-hidden bg-[var(--surface-panel-alt)]">
              <PanelChrome label="decision-summary.log" status="live buckets" />
              <PanelBody>
                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(bucketLabels).map(([bucket, label]) => (
                    <MetricBlock
                      key={bucket}
                      label={label}
                      value={String(counts[bucket as keyof typeof counts])}
                      detail="Tracked companies in this decision bucket."
                    />
                  ))}
                </div>
              </PanelBody>
            </Panel>

            <Panel className="overflow-hidden bg-[var(--surface-panel-alt)]">
              <PanelChrome label="operator-notes.md" status="use the board" />
              <PanelBody className="space-y-4">
                <TerminalLabel>what the user should know first</TerminalLabel>
                <ul className="space-y-3 text-sm leading-7 text-[var(--ink-secondary)]">
                  <li>Judgment appears before raw data.</li>
                  <li>Cards help decide what deserves a click now.</li>
                  <li>
                    Table mode supports dense comparison without replacing the
                    board.
                  </li>
                </ul>
              </PanelBody>
            </Panel>
          </div>
        </PanelBody>
      </Panel>

      <div className="grid gap-6 2xl:grid-cols-[1fr_22rem]">
        <Panel className="overflow-hidden">
          <PanelChrome
            label="watchlist.board"
            status={`${filteredStocks.length} visible names`}
          />
          <PanelBody className="space-y-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <TerminalLabel>browse.tsx</TerminalLabel>
                <h3 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[var(--ink-primary)]">
                  Browse the watchlist like a live research file.
                </h3>
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <div className="flex flex-wrap gap-2">
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
                          ? 'rounded-full border border-[color:rgba(211,155,123,0.28)] bg-[color:rgba(211,155,123,0.12)] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-primary)]'
                          : 'rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]'
                      }
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <label className="flex items-center gap-3 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-3 font-mono text-[0.74rem] text-[var(--ink-secondary)]">
                    <span className="text-[var(--accent-copper)]">$ find</span>
                    <input
                      value={query}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        startTransition(() => {
                          setQuery(nextValue)
                        })
                      }}
                      placeholder="TSM, semicap, compounder"
                      className="min-w-[16rem] bg-transparent text-[var(--ink-primary)] outline-none placeholder:text-[var(--ink-faint)]"
                    />
                  </label>

                  <div className="flex items-center gap-3 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-4 py-3 font-mono text-[0.74rem] text-[var(--ink-secondary)]">
                    <span className="text-[var(--accent-copper)]">sort</span>
                    <select
                      value={sortMode}
                      onChange={(event) =>
                        startTransition(() => {
                          setSortMode(event.target.value as SortMode)
                        })
                      }
                      className="bg-transparent text-[var(--ink-primary)] outline-none"
                    >
                      <option value="most-actionable">most actionable</option>
                      <option value="largest-discount">largest discount</option>
                      <option value="recently-updated">recently updated</option>
                    </select>
                  </div>

                  <div className="flex rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] p-1">
                    <ViewToggleButton
                      isActive={viewMode === 'cards'}
                      onClick={() =>
                        startTransition(() => {
                          setViewMode('cards')
                        })
                      }
                    >
                      cards
                    </ViewToggleButton>
                    <ViewToggleButton
                      isActive={viewMode === 'table'}
                      onClick={() =>
                        startTransition(() => {
                          setViewMode('table')
                        })
                      }
                    >
                      table
                    </ViewToggleButton>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'cards' ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {filteredStocks.map((stock) => (
                  <CompanyCard key={stock.id} stock={stock} />
                ))}
              </div>
            ) : (
              <WatchlistTable stocks={filteredStocks} />
            )}
          </PanelBody>
        </Panel>

        <div className="space-y-6">
          <Panel className="overflow-hidden">
            <PanelChrome
              label="signals.log"
              status="changed since last review"
            />
            <PanelBody className="space-y-4">
              <InsightRow
                title="TSM fair value revised"
                body="Packaging bottlenecks improved confidence in the base case."
              />
              <InsightRow
                title="ASML thesis downgraded to watch"
                body="Export visibility remains the main pressure point."
              />
              <InsightRow
                title="ADBE entered the strongest alignment bucket"
                body="Valuation support and favorable entry conditions now overlap."
              />
            </PanelBody>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelChrome label="view-rules.md" status="style direction" />
            <PanelBody className="space-y-4">
              <TerminalLabel>design ratio</TerminalLabel>
              <ul className="space-y-3 text-sm leading-7 text-[var(--ink-secondary)]">
                <li>70% research cockpit</li>
                <li>20% editor / code metaphor</li>
                <li>10% terminal flavor</li>
              </ul>
            </PanelBody>
          </Panel>
        </div>
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
          ? 'rounded-full bg-[color:rgba(211,155,123,0.16)] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-primary)]'
          : 'rounded-full px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition hover:text-[var(--ink-primary)]'
      }
    >
      {children}
    </button>
  )
}

function InsightRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-4">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent-copper)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-secondary)]">
        {body}
      </p>
    </div>
  )
}
