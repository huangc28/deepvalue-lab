---
phase: 05-interaction-contract-and-frontend-history-data-model
plan: 01
subsystem: ui
tags: [typescript, react, mock-data, types, frontend]

# Dependency graph
requires:
  - phase: 04-historical-revision-ledger-mockup
    provides: HistoricalReport fat type and HistoricalRevisionLedger component with mock data
provides:
  - HistoricalReportSummary interface (summary fields + localeHasFallback)
  - HistoricalReportDetail interface extending HistoricalReportSummary (detail-panel fields)
  - HistoricalReport transitional alias pointing to HistoricalReportDetail
  - StockDetail updated with historicalReportSummary[] and historicalReportDetails lookup map
  - Mock data split into per-ticker summary arrays and detail lookup maps
  - HistoricalRevisionLedger updated to accept summary list and detail map separately
affects:
  - 05-02 (component type migration)
  - 06-backend-historical-reports-api
  - 07-api-integration

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Summary/detail split: list-row types carry only display fields; detail types extend summary with panel-only fields"
    - "localeHasFallback flag computed at data layer so render components never inspect individual LocalizedText fields"
    - "Detail lookup map keyed by reportId enables O(1) detail access without array scanning"

key-files:
  created: []
  modified:
    - web/src/types/stocks.ts
    - web/src/data/mock-stocks.ts
    - web/src/components/detail/historical-revision-ledger.tsx
    - web/src/pages/stock-detail-page.tsx

key-decisions:
  - "HistoricalReportDetail extends HistoricalReportSummary (not wraps) — single publishedAtMs field via inheritance, avoids duplication"
  - "localeHasFallback: false for TSM (all Record<Locale,string> fields), true for ADBE (plain string fields)"
  - "computeLocaleHasFallback utility documented in mock data for Phase 7 reuse when API responses arrive"
  - "HistoricalRevisionLedger now takes reports: HistoricalReportSummary[] for list and reportDetails: Record<string,HistoricalReportDetail> for panels — matches future Phase 7 API loading shape"

patterns-established:
  - "Summary list + detail map: ledger list binds to summaries; snapshot/compare panels look up details by reportId"
  - "Transitional alias: keep HistoricalReport = HistoricalReportDetail until all callers are migrated in Plan 02"

requirements-completed: [FEH-01]

# Metrics
duration: 6min
completed: 2026-03-24
---

# Phase 05 Plan 01: Interaction Contract and Frontend History Data Model Summary

**HistoricalReport fat type split into HistoricalReportSummary and HistoricalReportDetail with mock data migrated to summary arrays and detail lookup maps**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-03-24T10:15:00Z
- **Completed:** 2026-03-24T10:21:39Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Defined `HistoricalReportSummary` (list-row fields + `localeHasFallback`) and `HistoricalReportDetail` (extends summary, adds panel-only fields: `currentPriceImpliesBrief`, `currentPriceImplies`, `changeSummary`, `monitorNext`)
- Migrated all three tickers' mock data to the new split shape with correct `localeHasFallback` values (TSM: false, ADBE: true, SOFI: empty)
- Updated `HistoricalRevisionLedger` and `stock-detail-page.tsx` to consume the new types without breaking the build

## Task Commits

Each task was committed atomically:

1. **Task 1: Define HistoricalReportSummary and HistoricalReportDetail types** - `08d9acd` (feat)
2. **Task 2: Migrate mock data to summary arrays and detail lookup maps** - `050ec3a` (feat)

## Files Created/Modified

- `web/src/types/stocks.ts` - Added HistoricalReportSummary, HistoricalReportDetail interfaces; kept HistoricalReport as transitional alias; updated StockDetail with new field types
- `web/src/data/mock-stocks.ts` - Added computeLocaleHasFallback utility; split all three tickers into summary arrays and detail lookup maps; updated mockStocks entries
- `web/src/components/detail/historical-revision-ledger.tsx` - Updated props to accept HistoricalReportSummary[] list and Record<string,HistoricalReportDetail> map; sub-components now typed against HistoricalReportDetail
- `web/src/pages/stock-detail-page.tsx` - Passes historicalReportDetails alongside historicalReports to HistoricalRevisionLedger

## Decisions Made

- `HistoricalReportDetail extends HistoricalReportSummary` rather than wrapping it — keeps a single `publishedAtMs` field via inheritance and makes type assignment clean
- `localeHasFallback` is a pre-computed boolean at the data layer, not a runtime inspection of each `LocalizedText` field — keeps render components simple
- Detail lookup map (`Record<string, HistoricalReportDetail>`) rather than a parallel array — O(1) access by reportId, matches expected API shape for Phase 7

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed downstream type mismatch in HistoricalRevisionLedger**
- **Found during:** Task 2 (Mock data migration)
- **Issue:** After changing `StockDetail.historicalReports` to `HistoricalReportSummary[]`, the `HistoricalRevisionLedger` component still typed its `reports` prop as `HistoricalReport[]` (= `HistoricalReportDetail[]`), causing a build error in `stock-detail-page.tsx`
- **Fix:** Updated `HistoricalRevisionLedger` to accept `reports: HistoricalReportSummary[]` + new `reportDetails: Record<string, HistoricalReportDetail>` prop; updated panel sub-components to use `HistoricalReportDetail`; removed unused `HistoricalReport` import and `compareReport` variable
- **Files modified:** `web/src/components/detail/historical-revision-ledger.tsx`, `web/src/pages/stock-detail-page.tsx`
- **Verification:** `pnpm build` passes with zero errors
- **Committed in:** `050ec3a` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** The fix was a necessary consequence of the type change and advances the Plan 02 component migration slightly. No scope creep — the ledger now correctly models the summary/detail boundary.

## Issues Encountered

None beyond the auto-fixed type mismatch above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Type contract is stable: Phase 6 backend and Phase 7 API integration can target `HistoricalReportSummary` for the list endpoint and `HistoricalReportDetail` for the detail endpoint
- `HistoricalReport` alias remains for any residual callers until Plan 02 cleans them up
- `HistoricalRevisionLedger` already accepts the summary/detail split — Plan 02 can focus on remaining component consumers

---
*Phase: 05-interaction-contract-and-frontend-history-data-model*
*Completed: 2026-03-24*
