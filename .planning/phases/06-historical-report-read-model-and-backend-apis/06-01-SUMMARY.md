---
phase: 06-historical-report-read-model-and-backend-apis
plan: 01
subsystem: backend
tags: [go, turso, sqlc, r2, publish, historical-reports]

# Dependency graph
requires: []
provides:
  - stock_reports historical read-model columns for per-report detail keys and summary JSON
  - sqlc query surface for historical list filtering and report lookup by ticker + reportId
  - publish path persistence into both stock_reports and published_stock_details
  - publish-handler regression coverage for EN-only and bilingual requests
affects:
  - 06-02
  - 06-03
  - 07-frontend-api-integration

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "stock_reports is the historical per-report read model; published_stock_details remains latest-only"
    - "Historical list queries exclude legacy rows without persisted summary_json or r2_detail_key"
    - "Publish writes identical per-report metadata to stock_reports while preserving the existing latest-detail upsert"

key-files:
  created:
    - be/turso/migrations/20260324190207_stock_reports_historical_read_model.sql
  modified:
    - be/turso/schema.sql
    - be/turso/query/stocks.sql
    - be/lib/app/turso_models/models.go
    - be/lib/app/turso_models/stocks.sql.go
    - be/lib/app/stocks/publish_handler.go
    - be/lib/app/stocks/publish_handler_test.go

key-decisions:
  - "Reuse stock_reports as the historical read model instead of introducing a second history table"
  - "Persist summary/detail metadata at publish time rather than inferring historical data from R2 on reads"
  - "Keep legacy metadata-only rows out of stable historical APIs by filtering summary_json='{}' and r2_detail_key=''"

patterns-established:
  - "Historical report lookup path: ListStockReportsByTicker for summaries, GetStockReportByTickerAndID for detail"
  - "Publish writes once for history and once for latest — no coupling of the two read models"

requirements-completed: [APIH-01]

# Metrics
completed: 2026-03-24
---

# Phase 06 Plan 01: Historical Report Read Model And Backend APIs Summary

**`stock_reports` now persists historical per-report summary/detail metadata, and the publish path writes that read model without changing the latest-only detail path.**

## Accomplishments

- Added the historical read-model migration and aligned `schema.sql` plus sqlc generation to the new `stock_reports` shape
- Expanded `InsertStockReport`, added `GetStockReportByTickerAndID`, and filtered `ListStockReportsByTicker` to stable historical rows only
- Updated `PublishHandler` so every publish stores EN detail key, optional zh-TW detail key, EN summary JSON, and optional zh-TW summary JSON into `stock_reports`
- Extended publish handler tests to lock EN-only defaults, bilingual persistence, and the no-persistence-on-422 path

## Validation

- `cd /Users/huangchihan/develop/deep-value/be && make gen/sqlc`
- `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`

## Notes

- This plan was resumed from an existing dirty worktree per user instruction, so no task commits were created in this execution pass.
