---
phase: 06-historical-report-read-model-and-backend-apis
plan: 03
subsystem: backend
tags: [go, http, r2, routing, locale, historical-reports]

# Dependency graph
requires:
  - phase: 06-01
    provides: GetStockReportByTickerAndID and persisted historical detail keys
  - phase: 06-02
    provides: stable historical summary contract for frontend integration
provides:
  - locale-aware `/v1/stocks/{ticker}/reports/{reportId}` endpoint
  - route registration for historical report detail reads
  - regression tests for zh-TW preference, EN fallback, and 404 behavior
affects:
  - 07-frontend-api-integration

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Historical detail reads trust persisted DB keys only; no R2 key guessing from reportId"
    - "Locale behavior matches the existing latest-detail handler: zh-TW detail -> EN detail -> 404"
    - "Route registration extends the stock API surface without changing the latest-detail endpoint"

key-files:
  created:
    - be/lib/app/stocks/report_detail_handler.go
    - be/lib/app/stocks/report_detail_handler_test.go
  modified:
    - be/cmd/server/main.go

key-decisions:
  - "Mirror current repo detail semantics rather than older NotebookLM notes that mentioned summary fallback on detail reads"
  - "Keep report detail handler independent from the latest-detail handler so historical lookup stays keyed by reportId"
  - "Verify router exposure with full backend tests after focused stocks tests pass"

patterns-established:
  - "Historical detail handler shape mirrors latest-detail structure but swaps GetPublishedStockDetail for GetStockReportByTickerAndID"
  - "Tests assert the last downloaded key to prove locale routing uses persisted DB state"

requirements-completed: [APIH-03]

# Metrics
completed: 2026-03-24
---

# Phase 06 Plan 03: Historical Report Read Model And Backend APIs Summary

**Historical report detail reads are now exposed at `/v1/stocks/{ticker}/reports/{reportId}` with the same locale semantics as the current latest-detail endpoint and no key guessing.**

## Accomplishments

- Added `ReportDetailHandler` backed by `GetStockReportByTickerAndID`
- Implemented zh-TW preference with EN fallback and a clear `stock report detail not found` 404 when no persisted detail key exists
- Registered the new historical detail route alongside the existing stock handlers
- Added focused tests for zh-TW preference, zh-TW fallback, default EN behavior, missing detail keys, and missing DB rows

## Validation

- `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`
- `cd /Users/huangchihan/develop/deep-value/be && go test ./...`

## Notes

- This plan was resumed from an existing dirty worktree per user instruction, so no task commits were created in this execution pass.
