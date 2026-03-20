---
phase: 03-add-zh-tw-stockdetail-json-support-to-backend-api
status: passed
verified: 2026-03-20
verifier: codex
---

# Phase 03 Verification

## Goal

Add zh-TW StockDetail JSON support to the backend API so the backend can accept, store, and serve zh-TW structured stock detail data while preserving existing EN behavior.

## Verification Result

Passed.

## What Was Verified

- Publish path accepts optional `stockDetailZhTW` and persists zh-TW summary/detail metadata
- `published_stock_details` schema, migration, sqlc query, and generated models all expose zh-TW fields
- `GET /v1/stocks/{ticker}?locale=zh-TW` prefers zh-TW detail, then zh-TW summary, then EN fallback
- `GET /v1/stocks?locale=zh-TW` returns zh-TW summaries per row where available and EN summaries otherwise
- Existing EN behavior remains the default when `locale` is not provided

## Commands

```bash
cd be && make gen/sqlc
cd be && go test ./...
```

## Evidence

- `be/lib/app/stocks/publish_handler.go` includes `stockDetailZhTW` handling and `r2DetailZhTWKey` in the response
- `be/lib/app/stocks/detail_handler.go` and `be/lib/app/stocks/list_handler.go` branch on `locale=zh-TW`
- `be/lib/app/stocks/publish_handler_test.go`, `be/lib/app/stocks/detail_handler_test.go`, and `be/lib/app/stocks/list_handler_test.go` pass

## Residual Risks

- No live integration test against real Turso + R2 was run in this session
- Backend currently recognizes only exact `zh-TW`, not broader locale aliases

