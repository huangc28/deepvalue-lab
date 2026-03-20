# Phase 03 Research — Add zh-TW StockDetail JSON support to backend API

**Date:** 2026-03-20
**Status:** Complete
**Question:** What does the executor need to know to implement locale-aware zh-TW StockDetail support in the backend without breaking the existing EN path?

## Current Backend Shape

- `be/lib/app/stocks/publish_handler.go` accepts `report` plus one required `stockDetail` payload, uploads the markdown and JSON artifacts to R2, extracts an EN summary payload, persists one row in `published_stock_details`, and auto-subscribes the ticker.
- `be/lib/app/stocks/detail_handler.go` serves the EN detail artifact from `r2_detail_key`, with a fallback to `summary_json` for pre-migration rows.
- `be/lib/app/stocks/list_handler.go` returns `summary_json` for every published row and currently has no query-parameter branching.
- `be/turso/query/stocks.sql` keeps write behavior concentrated in `UpsertPublishedStockDetail`; the read queries are `SELECT *`, so sqlc regeneration will expand generated scan structs after schema changes.
- `be/lib/pkg/r2/client.go` already centralizes report/detail key conventions; locale-specific detail storage should extend that helper layer instead of hardcoding suffixes in handlers.

## Durable Constraints

- Scope is backend only. No frontend changes and no generic locale framework in this phase.
- zh-TW support is additive and backward-compatible:
  - `stockDetailZhTW` is optional on publish.
  - `?locale` defaults to EN semantics when omitted.
  - existing rows must keep working with safe default column values.
- Internal status tokens remain English and are passed through as-is; only user-facing structured text is localized.
- The backend read path must continue serving structured JSON directly. It should not parse markdown reports.

## Implementation Decisions Confirmed By Phase Context

### Persistence

- Add `r2_detail_zh_tw_key TEXT NOT NULL DEFAULT ''` to `published_stock_details`.
- Add `summary_json_zh_tw TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw))` to `published_stock_details`.
- Use a replacement-table goose migration, matching the pattern from `20260318100726_stock_detail_to_r2.sql`, so SQLite column changes remain explicit and reversible.

### R2 Keys

- Keep EN detail key unchanged: `reports/{ticker}/{YYYYMMDD}/{reportID}.json`.
- Add a locale-specific zh-TW detail key: `reports/{ticker}/{YYYYMMDD}/{reportID}.zh-TW.json`.
- Implement the suffix in the R2 helper layer so handlers only call a helper and do not hand-build object keys.

### Publish Path

- Extend the request contract with optional `stockDetailZhTW json.RawMessage`.
- Validate EN `stockDetail` exactly as today.
- When `stockDetailZhTW` is present:
  - upload the zh-TW JSON artifact to the zh-TW R2 key,
  - extract zh-TW summary JSON using the same `summaryFields` struct,
  - persist both zh-TW columns in `published_stock_details`,
  - include `r2DetailZhTWKey` in the response.
- When `stockDetailZhTW` is absent:
  - leave zh-TW columns at defaults,
  - preserve the current success response shape except for omitting or emptying the zh-TW key.

### Read Path

- `GET /v1/stocks/{ticker}?locale=zh-TW`
  - if `r2_detail_zh_tw_key != ''`, download and return the zh-TW detail artifact.
  - else if `summary_json_zh_tw` is present and not `'{}'`, return that summary payload.
  - else return EN fallback (`summary_json` when no EN R2 key, otherwise current EN behavior).
- `GET /v1/stocks?ticker...&locale=zh-TW`
  - use `summary_json_zh_tw` when it is not empty / not `'{}'`,
  - otherwise keep EN summary behavior.
- Unsupported locale values should not silently invent new semantics. The safest behavior is to treat anything other than exact `zh-TW` as EN/default behavior.

## Code-Generation And Schema Notes

- `be/turso/schema.sql` must be updated alongside the migration so future dumps and local codegen stay aligned.
- `be/turso/query/stocks.sql` needs write-column updates only for `UpsertPublishedStockDetail`; read queries remain `SELECT *`.
- `be/sqlc.yaml` already points to `turso/schema.sql` plus `turso/query`, so `make gen/sqlc` is the correct regeneration path.
- sqlc output files that will change after regeneration:
  - `be/lib/app/turso_models/models.go`
  - `be/lib/app/turso_models/stocks.sql.go`

## Testing Strategy

- The repository currently has no backend `_test.go` files, but `go test ./...` is already the canonical test command.
- Phase execution should add targeted handler tests rather than relying only on manual cURL checks.
- The highest-signal automated coverage is:
  - publish handler with EN-only payload,
  - publish handler with EN + zh-TW payload,
  - detail handler locale selection and fallback order,
  - list handler locale summary selection and fallback.
- If direct `*turso_models.Queries` construction makes handler tests awkward, introduce small package-local interfaces in `be/lib/app/stocks` for the methods each handler actually uses. That keeps tests local to the package and avoids spinning up a real database.

## Risks And Pitfalls

- The current handlers depend on concrete `*turso_models.Queries`; without a seam, tests may be expensive or under-specified.
- SQLite migration changes must recreate the `trg_published_stock_details_touch_updated_at` trigger in both up/down paths.
- Returning zh-TW summary JSON from detail fallback is intentionally partial data; callers must tolerate summary-only fallback when no zh-TW detail artifact exists.
- `summary_json_zh_tw` should be treated as empty when it is `''`, `'{}'`, or only whitespace around `'{}'`.
- Do not change report markdown APIs in this phase. NotebookLM context mentions future API work for bilingual markdown reports; that remains out of scope here.

## Validation Architecture

### Automated

- `cd be && go test ./...` is the quick and full-suite command for this phase.
- Handler tests should be table-driven and run without network dependencies.
- Acceptance checks can also use grep/file presence for:
  - new schema columns,
  - zh-TW R2 key helper,
  - publish request / response fields,
  - `locale=zh-TW` branching in detail and list handlers.

### Manual

- Optional smoke checks after implementation:
  1. `POST /v1/stocks/{ticker}/reports` with EN-only payload still returns `201`.
  2. `POST /v1/stocks/{ticker}/reports` with `stockDetailZhTW` persists and returns a zh-TW key.
  3. `GET /v1/stocks/{ticker}?locale=zh-TW` returns zh-TW detail or zh-TW summary fallback.
  4. `GET /v1/stocks?locale=zh-TW` returns zh-TW summaries where available and EN elsewhere.

## Recommended Plan Split

- Plan 01: persistence + publish path.
- Plan 02: locale-aware read path + automated tests.

This keeps wave 1 focused on schema/contracts and wave 2 focused on serving behavior and verification.
