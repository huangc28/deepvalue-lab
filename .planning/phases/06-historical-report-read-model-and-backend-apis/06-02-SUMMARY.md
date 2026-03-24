---
phase: 06-historical-report-read-model-and-backend-apis
plan: 02
subsystem: backend
tags: [go, http, json, locale, historical-reports]

# Dependency graph
requires:
  - phase: 06-01
    provides: persisted historical summary rows in stock_reports
provides:
  - shared historical summary DTO builder aligned to the frontend HistoricalReportSummary contract
  - locale-aware `/v1/stocks/{ticker}/reports` response with localeHasFallback semantics
  - regression tests proving no raw storage keys leak through the list API
affects:
  - 06-03
  - 07-frontend-api-integration

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Historical list responses are built from persisted summary JSON, not metadata passthrough"
    - "localeHasFallback is derived once while selecting zh-TW vs EN summary JSON"
    - "latest flag is structural: first row in publishedAtMs-desc order is marked latest"

key-files:
  created:
    - be/lib/app/stocks/history_summary_contract.go
    - be/lib/app/stocks/reports_list_handler_test.go
  modified:
    - be/lib/app/stocks/reports_list_handler.go

key-decisions:
  - "Move summaryFields into shared backend code so publish and historical list handlers read the same JSON shape"
  - "Keep raw R2 keys internal; list responses expose only the frontend-aligned historical summary fields"
  - "Treat zh-TW summary absence as a first-class localeHasFallback signal instead of a UI-side inference"

patterns-established:
  - "Historical summary builder owns JSON selection, fallback detection, and response shaping"
  - "Reports list handler stays thin and delegates row shaping to buildHistoricalReportSummary"

requirements-completed: [APIH-01, APIH-02]

# Metrics
completed: 2026-03-24
---

# Phase 06 Plan 02: Historical Report Read Model And Backend APIs Summary

**`GET /v1/stocks/{ticker}/reports` now serves frontend-aligned historical summary rows directly from persisted `stock_reports` data, including zh-TW fallback signaling.**

## Accomplishments

- Added `history_summary_contract.go` with the shared `summaryFields` JSON shape and `buildHistoricalReportSummary(...)`
- Replaced the metadata-only `/reports` response with `HistoricalReportSummary`-aligned rows
- Preserved descending `publishedAtMs` ordering and marked the first row `latest: true`
- Added handler tests for default locale, zh-TW summary selection, zh-TW fallback to EN, and absence of raw storage keys

## Validation

- `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`

## Notes

- This plan was resumed from an existing dirty worktree per user instruction, so no task commits were created in this execution pass.
