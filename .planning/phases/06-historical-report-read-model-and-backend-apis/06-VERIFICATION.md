---
phase: 06-historical-report-read-model-and-backend-apis
verified: 2026-03-24T11:16:01Z
status: verified
score: 10/10 must-haves verified
human_verification: []
---

# Phase 06: Historical Report Read Model And Backend APIs — Verification Report

**Phase Goal:** Persist historical per-report summary/detail metadata and expose stable historical summary/detail APIs without request-time fan-out across all report artifacts.
**Verified:** 2026-03-24T11:16:01Z
**Status:** verified

## Goal Achievement

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `stock_reports` stores per-report EN/zh-TW detail keys and EN/zh-TW summary JSON | VERIFIED | Migration, `schema.sql`, generated `StockReport` model, and expanded `InsertStockReport` params |
| 2 | The publish path writes historical summary/detail metadata on every report insert | VERIFIED | `publish_handler.go` now passes `R2DetailKey`, `R2DetailZhTwKey`, `SummaryJson`, and `SummaryJsonZhTw` into `InsertStockReport` |
| 3 | `ListStockReportsByTicker` returns only stable historical rows with persisted summary/detail metadata | VERIFIED | `stocks.sql` filters `summary_json != '{}'` and `r2_detail_key != ''` |
| 4 | `GET /v1/stocks/{ticker}/reports` returns frontend-aligned historical summary rows | VERIFIED | `reports_list_handler.go` uses `buildHistoricalReportSummary(...)` and returns `reportId`, summary fields, `localeHasFallback`, and `latest` |
| 5 | Historical list responses do not expose raw storage keys | VERIFIED | `reports_list_handler_test.go` asserts response bodies do not contain `r2Key`, `r2DetailKey`, or `r2DetailZhTwKey` |
| 6 | zh-TW historical summary selection uses zh-TW JSON when present and EN JSON plus `localeHasFallback` when absent | VERIFIED | `history_summary_contract.go` and `reports_list_handler_test.go` |
| 7 | `GetStockReportByTickerAndID` exists and historical detail lookup is keyed by `ticker + reportId` | VERIFIED | `stocks.sql`, generated sqlc, and `report_detail_handler.go` |
| 8 | `GET /v1/stocks/{ticker}/reports/{reportId}` mirrors current latest-detail locale rules | VERIFIED | `report_detail_handler.go` selects zh-TW detail key when present, otherwise EN detail key, otherwise 404 |
| 9 | The new historical detail route is registered without removing the existing latest-detail route | VERIFIED | `be/cmd/server/main.go` includes `stocks.NewReportDetailHandler` next to the existing stock handlers |
| 10 | Focused and full backend suites pass after the phase changes | VERIFIED | `make gen/sqlc`, `go test ./lib/app/stocks -count=1`, and `go test ./...` all exit 0 |

## Validation Commands

- `cd /Users/huangchihan/develop/deep-value/be && make gen/sqlc`
- `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`
- `cd /Users/huangchihan/develop/deep-value/be && go test ./...`

## Result

All APIH requirements claimed by phase 6 are satisfied. The repo-truth mismatch from older second-brain notes was resolved in favor of the current codebase: historical detail reads use `zh-TW detail -> EN detail -> 404`, not summary fallback.
