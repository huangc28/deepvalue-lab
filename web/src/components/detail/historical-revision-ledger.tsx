import { useState } from 'react'

import { AccentBadge, TechnicalBadge, ThesisBadge, ValuationBadge } from '../ui/status-badge'
import { cx } from '../../lib/cx'
import { useI18n } from '../../i18n/context'
import type {
  HistoricalReportDetail,
  HistoricalReportSummary,
} from '../../types/stocks'
import type { LocalizedText } from '../../i18n/types'

export interface HistoricalRevisionLedgerProps {
  reports?: HistoricalReportSummary[]
  reportDetails?: Record<string, HistoricalReportDetail>
  legacyItems: LocalizedText[]
  mode?: 'legacy' | 'live'
  selectedId?: string | null
  compareId?: string | null
  onSelectedIdChange?: (reportId: string) => void
  onCompareIdChange?: (reportId: string | null) => void
  listState?: { status: 'idle' | 'loading' | 'ready' | 'error'; errorMessage?: string }
  selectedDetailState?: { status: 'idle' | 'loading' | 'ready' | 'error'; errorMessage?: string }
  compareDetailState?: { status: 'idle' | 'loading' | 'ready' | 'error'; errorMessage?: string }
}

export function HistoricalRevisionLedger({
  reports,
  reportDetails,
  legacyItems,
  mode,
  selectedId,
  compareId,
  onSelectedIdChange,
  onCompareIdChange,
  listState,
  selectedDetailState,
  compareDetailState,
}: HistoricalRevisionLedgerProps) {
  const { locale, m, text } = useI18n()
  const resolvedMode = mode ?? (reports === undefined ? 'legacy' : 'live')
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null)
  const [internalCompareId, setInternalCompareId] = useState<string | null>(null)

  if (resolvedMode === 'legacy') {
    return <LegacyHistory items={legacyItems} />
  }

  if (listState?.status === 'loading') {
    return <HistoryLoadingState />
  }

  if (listState?.status === 'error') {
    return <HistoryErrorState errorMessage={listState.errorMessage} />
  }

  const sortedReports = reports
    ? [...reports].sort((left, right) => right.publishedAtMs - left.publishedAtMs)
    : []

  if (sortedReports.length === 0) {
    return <EmptyHistoryState />
  }

  const currentSelectedId = selectedId ?? internalSelectedId
  const currentCompareId = compareId ?? internalCompareId
  const resolvedSelectedId =
    currentSelectedId &&
    sortedReports.some((report) => report.reportId === currentSelectedId)
      ? currentSelectedId
      : sortedReports[0].reportId
  const selectedReport =
    sortedReports.find((report) => report.reportId === resolvedSelectedId) ??
    sortedReports[0]
  const selectedDetail = reportDetails?.[selectedReport.reportId] ?? null
  const selectedIndex = sortedReports.findIndex(
    (report) => report.reportId === selectedReport.reportId,
  )

  const resolvedCompareId =
    currentCompareId &&
    sortedReports.some((report) => report.reportId === currentCompareId) &&
    currentCompareId !== resolvedSelectedId
      ? currentCompareId
      : null
  const compareDetail = resolvedCompareId ? (reportDetails?.[resolvedCompareId] ?? null) : null

  const inCompareMode = resolvedCompareId !== null
  const canCompare = sortedReports.length > 1

  function commitSelectedId(reportId: string) {
    if (onSelectedIdChange) {
      onSelectedIdChange(reportId)
      return
    }

    setInternalSelectedId(reportId)
  }

  function commitCompareId(reportId: string | null) {
    if (onCompareIdChange) {
      onCompareIdChange(reportId)
      return
    }

    setInternalCompareId(reportId)
  }

  function handleSelectRevision(reportId: string) {
    // If clicking the compare target while in compare mode, swap them
    if (inCompareMode && reportId === resolvedCompareId) {
      commitSelectedId(resolvedCompareId)
      commitCompareId(resolvedSelectedId)
      return
    }
    // Clear compare if the new base selection would collide
    if (inCompareMode && reportId === resolvedSelectedId) {
      return
    }
    commitSelectedId(reportId)
  }

  function handleSetCompare(reportId: string) {
    if (reportId === resolvedSelectedId) return
    commitCompareId(reportId)
  }

  function handleClearCompare() {
    commitCompareId(null)
  }

  function handleExitCompare() {
    commitCompareId(null)
    // base selection is preserved — do not touch selectedId
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.14fr)]">
        {/* Left column: revision list */}
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
              const isBase = report.reportId === resolvedSelectedId
              const isCompare = inCompareMode && report.reportId === resolvedCompareId

              return (
                <div
                  key={report.reportId}
                  role="listitem"
                  className={cx(
                    'rounded-[1.2rem] border bg-[var(--surface-muted)] transition',
                    isBase && !isCompare
                      ? 'border-[var(--accent-copper)] shadow-[0_0_0_1px_rgba(88,166,255,0.22)]'
                      : isCompare
                        ? 'border-[color:rgba(46,160,67,0.6)] shadow-[0_0_0_1px_rgba(46,160,67,0.18)]'
                        : 'border-[var(--line-subtle)]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectRevision(report.reportId)}
                    aria-pressed={isBase}
                    className="block w-full cursor-pointer rounded-[1.2rem] px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-panel)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
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
                          {isBase ? (
                            <Chip
                              label={m.detail.historySelected}
                              tone="neutral"
                            />
                          ) : null}
                          {isCompare ? (
                            <Chip
                              label={m.detail.historyCompareTarget}
                              tone="positive"
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

                  {/* Compare affordance: shown on non-base rows when canCompare */}
                  {canCompare && !isBase ? (
                    <div className="border-t border-[var(--line-subtle)] px-4 py-3">
                      {isCompare ? (
                        <button
                          type="button"
                          onClick={handleClearCompare}
                          className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--signal-positive-soft)] transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-panel)]"
                        >
                          {m.detail.historyClearComparison}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCompare(report.reportId)}
                          disabled={inCompareMode}
                          className={cx(
                            'font-mono text-[0.62rem] uppercase tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-panel)]',
                            inCompareMode
                              ? 'cursor-not-allowed text-[var(--ink-muted)] opacity-40'
                              : 'cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink-secondary)]',
                          )}
                        >
                          {m.detail.historyAddComparison}
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: snapshot or compare panel */}
        <div className="space-y-4">
          {inCompareMode ? (
            <ComparePanel
              baseReport={selectedDetail}
              compareReport={compareDetail}
              selectedDetailState={selectedDetailState}
              compareDetailState={compareDetailState}
              onExit={handleExitCompare}
            />
          ) : (
            <>
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

              {selectedDetailState?.status === 'loading' ? (
                <SelectedRevisionLoadingState />
              ) : selectedDetailState?.status === 'error' ? (
                <SelectedRevisionErrorState errorMessage={selectedDetailState.errorMessage} />
              ) : selectedDetail ? (
                <SelectedRevisionCard
                  report={selectedDetail}
                  isOldestRevision={selectedIndex === sortedReports.length - 1}
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      <RevisionTrend reports={sortedReports} selectedId={resolvedSelectedId} compareId={resolvedCompareId} />
    </div>
  )
}

function ComparePanel({
  baseReport,
  compareReport,
  selectedDetailState,
  compareDetailState,
  onExit,
}: {
  baseReport: HistoricalReportDetail | null
  compareReport: HistoricalReportDetail | null
  selectedDetailState?: { status: 'idle' | 'loading' | 'ready' | 'error'; errorMessage?: string }
  compareDetailState?: { status: 'idle' | 'loading' | 'ready' | 'error'; errorMessage?: string }
  onExit: () => void
}) {
  const { m } = useI18n()

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--accent-copper)]">
            {m.detail.historyCompareMode}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--ink-secondary)]">
            {m.detail.historyCompareDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="shrink-0 rounded-full border border-[var(--line-subtle)] bg-[var(--surface-chip)] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-panel)]"
        >
          {m.detail.historyExitCompare}
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {selectedDetailState?.status === 'loading' ? (
          <SelectedRevisionLoadingState />
        ) : selectedDetailState?.status === 'error' ? (
          <SelectedRevisionErrorState errorMessage={selectedDetailState.errorMessage} />
        ) : baseReport ? (
          <CompareRevisionCard
            report={baseReport}
            roleLabel={m.detail.historyBaseRevision}
            roleColor="var(--accent-copper)"
          />
        ) : null}
        {compareDetailState?.status === 'loading' ? (
          <CompareRevisionLoadingState />
        ) : compareDetailState?.status === 'error' ? (
          <CompareRevisionErrorState errorMessage={compareDetailState.errorMessage} />
        ) : compareReport ? (
          <CompareRevisionCard
            report={compareReport}
            roleLabel={m.detail.historyComparisonRevision}
            roleColor="var(--signal-positive-soft)"
          />
        ) : null}
      </div>

      {baseReport && compareReport ? (
        <CompareMetricDiff base={baseReport} compare={compareReport} />
      ) : null}
    </div>
  )
}

function CompareRevisionCard({
  report,
  roleLabel,
  roleColor,
}: {
  report: HistoricalReportDetail
  roleLabel: string
  roleColor: string
}) {
  const { locale, m, text } = useI18n()
  const showFallbackIndicator = locale === 'zh-TW' && report.localeHasFallback

  return (
    <div className="rounded-[1.25rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-5">
      {showFallbackIndicator ? (
        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          {m.detail.historyLocaleFallbackIndicator}
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: roleColor }}
        />
        <span
          className="font-mono text-[0.62rem] uppercase tracking-[0.18em]"
          style={{ color: roleColor }}
        >
          {roleLabel}
        </span>
      </div>

      <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {formatRevisionDate(report.publishedAtMs, locale)}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <Chip label={m.detail.revisionProvenance[report.provenance]} />
        {report.latest ? (
          <Chip label={m.detail.historyLatest} tone="accent" />
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--ink-secondary)]">
        {text(report.summary)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <ValuationBadge value={report.valuationStatus} />
        <ThesisBadge value={report.thesisStatus} />
        <TechnicalBadge value={report.technicalEntryStatus} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
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

      <div className="mt-4 rounded-[1.1rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-4 py-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          {m.detail.historyPriceImpliesBrief}
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--ink-secondary)]">
          {text(report.currentPriceImpliesBrief)}
        </p>
      </div>
    </div>
  )
}

function CompareMetricDiff({
  base,
  compare,
}: {
  base: HistoricalReportDetail
  compare: HistoricalReportDetail
}) {
  const { m } = useI18n()

  // CompareMetricDiff delta direction convention:
  //   base   = the more recently published revision (higher publishedAtMs)
  //   compare = the older revision (lower publishedAtMs)
  //   delta   = base - compare (positive means metric rose since the previous revision)
  // This component enforces order regardless of which argument was passed as base/compare.
  const [newer, older] =
    base.publishedAtMs >= compare.publishedAtMs
      ? [base, compare]
      : [compare, base]

  const priceDiff = newer.currentPrice - older.currentPrice
  const baseDiff = newer.baseFairValue - older.baseFairValue
  const bearDiff = newer.bearFairValue - older.bearFairValue
  const bullDiff = newer.bullFairValue - older.bullFairValue

  return (
    <div className="rounded-[1.25rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-5">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {m.detail.historyCompareHelper}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <DiffMetric
          label={m.detail.currentPrice}
          value={formatCurrency(newer.currentPrice)}
          diff={priceDiff}
        />
        <DiffMetric
          label={m.detail.scenario.Bear}
          value={formatCurrency(newer.bearFairValue)}
          diff={bearDiff}
        />
        <DiffMetric
          label={m.detail.scenario.Base}
          value={formatCurrency(newer.baseFairValue)}
          diff={baseDiff}
        />
        <DiffMetric
          label={m.detail.scenario.Bull}
          value={formatCurrency(newer.bullFairValue)}
          diff={bullDiff}
        />
      </div>
    </div>
  )
}

function DiffMetric({
  label,
  value,
  diff,
}: {
  label: string
  value: string
  diff: number
}) {
  const isPositive = diff > 0
  const isNeutral = diff === 0

  return (
    <div className="rounded-[1rem] border border-[var(--line-subtle)] bg-[var(--surface-panel)] px-3 py-3">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm font-semibold text-[var(--ink-primary)]">
        {value}
      </p>
      {!isNeutral ? (
        <p
          className={cx(
            'mt-1 font-mono text-[0.62rem] font-medium',
            isPositive
              ? 'text-[var(--signal-positive-soft)]'
              : 'text-[var(--signal-danger-soft)]',
          )}
        >
          {isPositive ? '+' : ''}{formatCurrency(diff)}
        </p>
      ) : null}
    </div>
  )
}

function SelectedRevisionCard({
  report,
  isOldestRevision,
}: {
  report: HistoricalReportDetail
  isOldestRevision: boolean
}) {
  const { locale, m, text } = useI18n()
  const showFallbackIndicator = locale === 'zh-TW' && report.localeHasFallback

  return (
    <div className="rounded-[1.25rem] border border-[var(--line-subtle)] bg-[var(--surface-muted)] p-5">
      {showFallbackIndicator ? (
        <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          {m.detail.historyLocaleFallbackIndicator}
        </p>
      ) : null}
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

function RevisionTrend({
  reports,
  selectedId,
  compareId,
}: {
  reports: HistoricalReportSummary[]
  selectedId: string | null
  compareId: string | null
}) {
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
              const isSelected = report.reportId === selectedId
              const isCompare = report.reportId === compareId

              return (
                <g key={report.reportId}>
                  <circle
                    cx={x}
                    cy={toPointY(report.baseFairValue, minValue, maxValue)}
                    r={isSelected || isCompare ? 6 : 4.5}
                    fill="var(--signal-positive-soft)"
                    opacity={isSelected || isCompare ? 1 : 0.7}
                  />
                  <circle
                    cx={x}
                    cy={toPointY(report.currentPrice, minValue, maxValue)}
                    r={isSelected || isCompare ? 6 : 4.5}
                    fill="var(--accent-copper)"
                    opacity={isSelected || isCompare ? 1 : 0.7}
                  />
                  {isSelected ? (
                    <circle
                      cx={x}
                      cy={toPointY(report.currentPrice, minValue, maxValue)}
                      r={11}
                      fill="none"
                      stroke="var(--accent-copper)"
                      strokeWidth="1.5"
                      opacity={0.5}
                    />
                  ) : null}
                  {isCompare ? (
                    <circle
                      cx={x}
                      cy={toPointY(report.currentPrice, minValue, maxValue)}
                      r={11}
                      fill="none"
                      stroke="var(--signal-positive-soft)"
                      strokeWidth="1.5"
                      opacity={0.5}
                    />
                  ) : null}
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

function HistoryLoadingState() {
  const { m } = useI18n()

  return (
    <HistoryStatePanel
      label={detailMessage(m.detail, 'historyLoadingLabel', 'Loading History')}
      title={detailMessage(
        m.detail,
        'historyLoadingTitle',
        'Fetching structured revisions from the live report archive.',
      )}
      description={detailMessage(
        m.detail,
        'historyLoadingDescription',
        'Latest stock detail stays available while historical summaries load.',
      )}
    />
  )
}

function HistoryErrorState({ errorMessage }: { errorMessage?: string }) {
  const { m } = useI18n()

  return (
    <HistoryStatePanel
      label={detailMessage(m.detail, 'historyErrorLabel', 'History Unavailable')}
      title={detailMessage(
        m.detail,
        'historyErrorTitle',
        'Historical revisions could not be loaded right now.',
      )}
      description={detailMessage(
        m.detail,
        'historyErrorDescription',
        'The latest stock detail is still available. Retry the history request when the report APIs recover.',
      )}
      errorMessage={errorMessage}
      tone="error"
    />
  )
}

function SelectedRevisionLoadingState() {
  const { m } = useI18n()

  return (
    <HistoryStatePanel
      label={detailMessage(m.detail, 'historySelectedLoadingLabel', 'Loading Revision')}
      description={detailMessage(
        m.detail,
        'historySelectedLoadingDescription',
        'Fetching the selected revision snapshot from the live historical detail API.',
      )}
      compact
    />
  )
}

function SelectedRevisionErrorState({ errorMessage }: { errorMessage?: string }) {
  const { m } = useI18n()

  return (
    <HistoryStatePanel
      label={detailMessage(m.detail, 'historySelectedErrorLabel', 'Revision Unavailable')}
      description={detailMessage(
        m.detail,
        'historySelectedErrorDescription',
        'The selected revision summary is visible, but the structured snapshot could not be loaded.',
      )}
      errorMessage={errorMessage}
      tone="error"
      compact
    />
  )
}

function CompareRevisionLoadingState() {
  const { m } = useI18n()

  return (
    <HistoryStatePanel
      label={detailMessage(m.detail, 'historyCompareLoadingLabel', 'Loading Comparison')}
      description={detailMessage(
        m.detail,
        'historyCompareLoadingDescription',
        'Fetching the comparison revision without replacing the base selection.',
      )}
      compact
    />
  )
}

function CompareRevisionErrorState({ errorMessage }: { errorMessage?: string }) {
  const { m } = useI18n()

  return (
    <HistoryStatePanel
      label={detailMessage(m.detail, 'historyCompareErrorLabel', 'Comparison Unavailable')}
      description={detailMessage(
        m.detail,
        'historyCompareErrorDescription',
        'The base revision is still active. Pick another comparison target or retry this revision.',
      )}
      errorMessage={errorMessage}
      tone="error"
      compact
    />
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

function HistoryStatePanel({
  label,
  title,
  description,
  errorMessage,
  tone = 'neutral',
  compact = false,
}: {
  label: string
  title?: string
  description: string
  errorMessage?: string
  tone?: 'neutral' | 'error'
  compact?: boolean
}) {
  return (
    <div
      className={cx(
        'rounded-[1.2rem] border bg-[var(--surface-muted)]',
        compact ? 'px-5 py-5' : 'px-5 py-6',
        tone === 'error'
          ? 'border-[color:rgba(218,54,51,0.35)]'
          : 'border-[var(--line-subtle)]',
      )}
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {label}
      </p>
      {title ? (
        <h4 className="mt-3 font-serif text-2xl tracking-[-0.04em] text-[var(--ink-primary)]">
          {title}
        </h4>
      ) : null}
      <p
        className={cx(
          'text-sm leading-7 text-[var(--ink-secondary)]',
          title ? 'mt-3' : 'mt-4',
        )}
      >
        {description}
      </p>
      {errorMessage ? (
        <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--signal-danger-soft)]">
          {errorMessage}
        </p>
      ) : null}
    </div>
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

function detailMessage(
  detail: object,
  key: string,
  fallback: string,
) {
  const detailMessages = detail as Record<string, string | undefined>
  return detailMessages[key] ?? fallback
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
