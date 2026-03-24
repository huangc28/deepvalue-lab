import { useState } from 'react'

import { AccentBadge, TechnicalBadge, ThesisBadge, ValuationBadge } from '../ui/status-badge'
import { cx } from '../../lib/cx'
import { useI18n } from '../../i18n/context'
import type { HistoricalReport } from '../../types/stocks'
import type { LocalizedText } from '../../i18n/types'

export function HistoricalRevisionLedger({
  reports,
  legacyItems,
}: {
  reports?: HistoricalReport[]
  legacyItems: LocalizedText[]
}) {
  const { locale, m, text } = useI18n()
  const sortedReports = reports
    ? [...reports].sort((left, right) => right.publishedAtMs - left.publishedAtMs)
    : undefined
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!sortedReports) {
    return <LegacyHistory items={legacyItems} />
  }

  if (sortedReports.length === 0) {
    return <EmptyHistoryState />
  }

  const resolvedSelectedId =
    selectedId && sortedReports.some((report) => report.reportId === selectedId)
      ? selectedId
      : sortedReports[0].reportId
  const selectedReport =
    sortedReports.find((report) => report.reportId === resolvedSelectedId) ??
    sortedReports[0]
  const selectedIndex = sortedReports.findIndex(
    (report) => report.reportId === selectedReport.reportId,
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.14fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                {m.detail.historyLedgerLabel}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-secondary)]">
                {m.detail.historyLedgerDescription}
              </p>
            </div>
            <AccentBadge
              label={`${sortedReports.length} ${m.detail.historyRevisionCountLabel}`}
            />
          </div>

          <div
            className="space-y-3"
            role="list"
            aria-label={m.detail.historyLedgerLabel}
          >
            {sortedReports.map((report) => {
              const isSelected = report.reportId === selectedReport.reportId

              return (
                <div
                  key={report.reportId}
                  className={cx(
                    'rounded-[1.2rem] border bg-[var(--surface-muted)] transition',
                    isSelected
                      ? 'border-[var(--accent-copper)] shadow-[0_0_0_1px_rgba(88,166,255,0.22)]'
                      : 'border-[var(--line-subtle)]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(report.reportId)}
                    className="block w-full cursor-pointer rounded-[1.2rem] px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-panel)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                            {formatRevisionDate(report.publishedAtMs, locale)}
                          </span>
                          <Chip
                            label={m.detail.revisionProvenance[report.provenance]}
                          />
                          {report.latest ? (
                            <Chip
                              label={m.detail.historyLatest}
                              tone="accent"
                            />
                          ) : null}
                          {isSelected ? (
                            <Chip
                              label={m.detail.historySelected}
                              tone="neutral"
                            />
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-secondary)]">
                          {text(report.summary)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                          {m.detail.currentPrice}
                        </p>
                        <p className="mt-2 font-mono text-xl font-semibold text-[var(--ink-primary)]">
                          {formatCurrency(report.currentPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <ValuationBadge value={report.valuationStatus} />
                      <ThesisBadge value={report.thesisStatus} />
                      <TechnicalBadge value={report.technicalEntryStatus} />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MiniMetric
                        label={m.detail.scenario.Bear}
                        value={formatCurrency(report.bearFairValue)}
                      />
                      <MiniMetric
                        label={m.detail.scenario.Base}
                        value={formatCurrency(report.baseFairValue)}
                      />
                      <MiniMetric
                        label={m.detail.scenario.Bull}
                        value={formatCurrency(report.bullFairValue)}
                      />
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--accent-copper)]">
              {sortedReports.length === 1
                ? m.detail.historySingleRevision
                : m.detail.historySelectedRevision}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-secondary)]">
              {sortedReports.length === 1
                ? m.detail.historySingleRevisionDescription
                : m.detail.historySelectedDescription}
            </p>
          </div>

          <SelectedRevisionCard
            report={selectedReport}
            isOldestRevision={selectedIndex === sortedReports.length - 1}
          />
        </div>
      </div>

      <RevisionTrend reports={sortedReports} />
    </div>
  )
}

function SelectedRevisionCard({
  report,
  isOldestRevision,
}: {
  report: HistoricalReport
  isOldestRevision: boolean
}) {
  const { m, text } = useI18n()

  return (
    <div className="rounded-[1.25rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip label={m.detail.revisionProvenance[report.provenance]} />
            {report.latest ? (
              <Chip label={m.detail.historyLatest} tone="accent" />
            ) : null}
          </div>
          <p className="mt-3 text-base leading-8 text-[var(--ink-primary)]">
            {text(report.summary)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniMetric
            label={m.detail.scenario.Bear}
            value={formatCurrency(report.bearFairValue)}
          />
          <MiniMetric
            label={m.detail.scenario.Base}
            value={formatCurrency(report.baseFairValue)}
          />
          <MiniMetric
            label={m.detail.scenario.Bull}
            value={formatCurrency(report.bullFairValue)}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <ValuationBadge value={report.valuationStatus} />
        <ThesisBadge value={report.thesisStatus} />
        <TechnicalBadge value={report.technicalEntryStatus} />
      </div>

      <dl className="mt-5 space-y-3">
        <SnapshotRow
          label={m.detail.currentPrice}
          value={formatCurrency(report.currentPrice)}
        />
        <SnapshotRow
          label={m.detail.historyPriceImpliesBrief}
          value={text(report.currentPriceImpliesBrief)}
        />
        <SnapshotRow
          label={
            isOldestRevision
              ? m.detail.historyInitialRevision
              : m.detail.historyChangeSincePrevious
          }
          value={text(report.changeSummary)}
        />
      </dl>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-4 py-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {m.detail.currentPriceImpliesTitle}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-secondary)]">
            {text(report.currentPriceImplies)}
          </p>
        </div>
        <div className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-4 py-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {m.detail.monitorNextTitle}
          </p>
          <ul className="mt-3 space-y-2">
            {report.monitorNext.slice(0, 3).map((item, index) => (
              <li
                key={`${text(item)}-${index}`}
                className="text-sm leading-7 text-[var(--ink-secondary)]"
              >
                {text(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function RevisionTrend({ reports }: { reports: HistoricalReport[] }) {
  const { locale, m } = useI18n()
  const chronological = [...reports].reverse()
  const values = chronological.flatMap((report) => [
    report.currentPrice,
    report.baseFairValue,
  ])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const currentPath = toLinePath(
    chronological.map((report) => report.currentPrice),
    minValue,
    maxValue,
  )
  const basePath = toLinePath(
    chronological.map((report) => report.baseFairValue),
    minValue,
    maxValue,
  )

  return (
    <div className="rounded-[1.25rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-5 py-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--accent-copper)]">
            {m.detail.historyTrendLabel}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--ink-secondary)]">
            {m.detail.historyTrendDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LegendDot
            color="var(--accent-copper)"
            label={m.detail.historyTrendCurrentPrice}
          />
          <LegendDot
            color="var(--signal-positive-soft)"
            label={m.detail.historyTrendBaseValue}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[38rem]">
          <svg
            viewBox="0 0 620 180"
            className="h-[12rem] w-full overflow-visible"
            aria-label={m.detail.historyTrendLabel}
          >
            <path
              d={basePath}
              fill="none"
              stroke="var(--signal-positive-soft)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={currentPath}
              fill="none"
              stroke="var(--accent-copper)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chronological.map((report, index) => {
              const x = toPointX(index, chronological.length)

              return (
                <g key={report.reportId}>
                  <circle
                    cx={x}
                    cy={toPointY(report.baseFairValue, minValue, maxValue)}
                    r="4.5"
                    fill="var(--signal-positive-soft)"
                  />
                  <circle
                    cx={x}
                    cy={toPointY(report.currentPrice, minValue, maxValue)}
                    r="4.5"
                    fill="var(--accent-copper)"
                  />
                </g>
              )
            })}
          </svg>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {chronological.map((report) => (
              <div key={report.reportId}>
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  {formatTrendDate(report.publishedAtMs, locale)}
                </p>
                <p className="mt-2 text-sm text-[var(--ink-secondary)]">
                  {formatCurrency(report.currentPrice)} /{' '}
                  {formatCurrency(report.baseFairValue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyHistoryState() {
  const { m } = useI18n()

  return (
    <div className="rounded-[1.2rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-muted)] px-5 py-6">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {m.detail.historyEmptyLabel}
      </p>
      <h4 className="mt-3 font-serif text-2xl tracking-[-0.04em] text-[var(--ink-primary)]">
        {m.detail.historyEmptyTitle}
      </h4>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-secondary)]">
        {m.detail.historyEmptyDescription}
      </p>
    </div>
  )
}

function LegacyHistory({ items }: { items: LocalizedText[] }) {
  const { text } = useI18n()

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={text(item)}
          className="rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-7 text-[var(--ink-secondary)]"
        >
          {text(item)}
        </li>
      ))}
    </ul>
  )
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-4 py-4 md:grid-cols-[11rem_1fr]">
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </dt>
      <dd className="text-sm leading-7 text-[var(--ink-secondary)]">{value}</dd>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-3 py-3">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm font-semibold text-[var(--ink-primary)]">
        {value}
      </p>
    </div>
  )
}

function Chip({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: 'neutral' | 'accent' | 'positive'
}) {
  return (
    <span
      className={cx(
        'inline-flex rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]',
        tone === 'neutral' &&
          'border-[var(--line-subtle)] bg-[var(--surface-chip)] text-[var(--ink-secondary)]',
        tone === 'accent' &&
          'border-[color:rgba(88,166,255,0.28)] bg-[color:rgba(56,139,253,0.14)] text-[var(--accent-copper)]',
        tone === 'positive' &&
          'border-[color:rgba(46,160,67,0.34)] bg-[color:rgba(46,160,67,0.14)] text-[var(--signal-positive-soft)]',
      )}
    >
      {label}
    </span>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[var(--ink-secondary)]">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

function formatRevisionDate(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(timestamp)
}

function formatTrendDate(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
    month: 'short',
    day: '2-digit',
  }).format(timestamp)
}

function toPointX(index: number, total: number) {
  const start = 36
  const end = 584

  if (total <= 1) {
    return (start + end) / 2
  }

  return start + ((end - start) / (total - 1)) * index
}

function toPointY(value: number, min: number, max: number) {
  const top = 24
  const bottom = 152

  if (max <= min) {
    return (top + bottom) / 2
  }

  const ratio = (value - min) / (max - min)
  return bottom - ratio * (bottom - top)
}

function toLinePath(values: number[], min: number, max: number) {
  return values
    .map((value, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${toPointX(index, values.length)} ${toPointY(value, min, max)}`
    })
    .join(' ')
}
