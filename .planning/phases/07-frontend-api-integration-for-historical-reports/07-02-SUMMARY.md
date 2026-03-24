---
phase: 07-frontend-api-integration-for-historical-reports
plan: 02
subsystem: ui
tags: [react, tanstack-query, api, history, locale]

# Dependency graph
requires:
  - phase: 07-01
    provides: async-aware ledger contract and localized history state copy
  - phase: 06-historical-report-read-model-and-backend-apis
    provides: live `/reports` and `/reports/{reportId}` backend endpoints
provides:
  - historical report list and detail client functions
  - cached query hooks for report summaries and per-report details
  - stock detail page history orchestration with live/mock boundary isolation
affects:
  - phase-verification
  - historical-report-ui

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Latest stock detail remains the page boundary while history queries degrade locally"
    - "Historical detail responses are merged onto summary rows so fallback metadata stays intact"

key-files:
  created: []
  modified:
    - web/src/lib/api.ts
    - web/src/lib/queries.ts
    - web/src/pages/stock-detail-page.tsx

key-decisions:
  - "Fetch revision summaries and selected/compare details through separate TanStack Query keys"
  - "Use mock history only when the whole page is already in mock fallback because live latest detail is unavailable"

patterns-established:
  - "History list and detail queries are keyed by ticker, reportId, and locale for cache-safe reselection"
  - "Compare-side failures keep the selected base revision visible by passing local compareDetailState to the ledger"

requirements-completed: [INTH-01, INTH-02]

# Metrics
completed: 2026-03-24
---

# Phase 07 Plan 02: Frontend API Integration For Historical Reports Summary

**The stock detail page now reads historical revisions from the live report APIs, lazily fetches selected and compare snapshots, and keeps `/reports` failures inside the History section.**

## Accomplishments

- Added `fetchStockReports`, `fetchStockReportDetail`, `useStockReports`, `useStockReportDetail`, and `mergeHistoricalReportDetail`
- Split latest-detail reads from history reads so live stock pages no longer mix live latest detail with mock historical revisions
- Wired the `History` section to pass explicit list, selected-detail, and compare-detail async states into `HistoricalRevisionLedger`

## Task Commits

1. **Task 1: Add live historical report client functions, query hooks, and summary-detail merge logic** - `d85471f`
2. **Task 2: Drive the History section from live queries while preserving the current latest-detail boundary** - `5fbb0f3`

## Validation

- `cd /Users/huangchihan/develop/deep-value/web && pnpm lint && pnpm build`

## Notes

- The page still uses mock history only when `useStock(...)` does not return a live stock and a mock fallback exists for the ticker.
