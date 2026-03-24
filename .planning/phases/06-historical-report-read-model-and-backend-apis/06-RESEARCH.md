# Phase 6: Historical Report Read Model And Backend APIs - Research

**Researched:** 2026-03-24
**Domain:** Go HTTP handlers, Turso/sqlc read models, R2-backed detail retrieval, locale-aware historical API design
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from roadmap, requirements, prior phases, and repo state)

### Locked Decisions

- Historical list reads must use persisted per-report summary data and must not fan out across all historical R2 detail artifacts at request time.
- Historical detail reads must use a stable `reportId` contract and return one structured historical `StockDetail` payload per request.
- `publishedAtMs` remains the canonical historical timestamp and the list must return rows in descending `publishedAtMs` order.
- Phase 5 frontend contract is already locked:
  - `HistoricalReportSummary` is the list-row shape.
  - `HistoricalReportDetail` is the selected/compare payload shape.
  - `localeHasFallback` is the summary/detail-level locale signal the frontend expects.
- Locale opt-in remains exact `locale=zh-TW`; no generic locale framework is introduced in this phase.
- Latest stock detail flow (`GET /v1/stocks/{ticker}` backed by `published_stock_details`) remains the production reference path and must not regress.
- Raw markdown/original report access stays deferred to v1.2+ and must not be introduced in this phase.

### Important Repo-Truth Mismatch

- Older planning notes and some second-brain summaries describe latest-detail locale fallback as `zh-TW detail -> zh-TW summary -> EN detail -> EN summary`.
- The repository implementation in `be/lib/app/stocks/detail_handler.go` currently does **not** fall back to summary JSON on detail reads. It does:
  - `zh-TW detail` when `r2_detail_zh_tw_key` exists
  - otherwise `EN detail`
  - otherwise `404`
- Phase 6 planning should follow the repository behavior unless the code is intentionally changed later.

### Claude's Discretion

- Whether to extend `stock_reports` or introduce a new historical-summary table
- Whether to share DTO/JSON parsing helpers across publish/list/detail handlers
- Exact migration suffix and handler/helper filenames
- Exact warning/skip behavior for legacy pre-Phase-6 report rows that lack persisted historical summary/detail metadata

### Deferred Ideas (OUT OF SCOPE)

- `GET /v1/stocks/{ticker}/reports/{reportId}/markdown`
- Signed URLs or raw artifact viewers
- Generic locale expansion beyond `zh-TW`
- Frontend integration and async compare loading states (Phase 7)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| APIH-01 | Backend persists historical per-report summary data for performant revision list reads | Storage recommendation adds summary/detail metadata to each `stock_reports` row at publish time |
| APIH-02 | `GET /v1/stocks/{ticker}/reports` returns summary fields sorted by `publishedAtMs` descending | Handler contract recommendation maps stored summary JSON into Phase 5 `HistoricalReportSummary`-shaped responses |
| APIH-03 | `GET /v1/stocks/{ticker}/reports/{reportId}` returns locale-aware structured historical detail for a single revision | New query + handler recommendation resolves exact row by `ticker` + `reportId`, then downloads one locale-aware R2 detail artifact |
</phase_requirements>

---

## Summary

Phase 6 should evolve the current `stock_reports` table from metadata-only history into the historical read model. That is the smallest change that satisfies all three API requirements without introducing a second historical table or forcing runtime joins across unrelated data. `stock_reports` already has one row per published report and already drives `GET /v1/stocks/{ticker}/reports`; it is therefore the right place to persist per-report detail keys and per-report summary JSON for each revision.

The recommended shape is to add these columns to `stock_reports`:

- `r2_detail_key TEXT NOT NULL DEFAULT ''`
- `r2_detail_zh_tw_key TEXT NOT NULL DEFAULT ''`
- `summary_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json))`
- `summary_json_zh_tw TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw))`

This keeps the latest-only `published_stock_details` table unchanged for `GET /v1/stocks` and `GET /v1/stocks/{ticker}`, while giving Phase 6 a dedicated per-report read model for the historical APIs.

**Primary recommendation:** Extend `stock_reports`, update publish-time persistence to write the extra columns, then implement two read surfaces:

1. `GET /v1/stocks/{ticker}/reports`
   - build a frontend-aligned `HistoricalReportSummary` response from stored summary JSON
   - use `localeHasFallback` as the locale contract instead of exposing R2 keys
   - mark the first row `latest: true`

2. `GET /v1/stocks/{ticker}/reports/{reportId}`
   - resolve exactly one `stock_reports` row by `ticker + reportId`
   - use exact `locale=zh-TW` behavior identical to current latest-detail implementation:
     - zh-TW detail key when present
     - otherwise EN detail key
     - otherwise `404`

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Go stdlib + chi | project current | HTTP handler layer for `/v1/stocks/...` routes | Existing stock endpoints already use this stack |
| sqlc + SQLite/Turso | project current | Typed query layer and schema generation | Existing stock domain already uses `be/turso/query/stocks.sql` and generated `turso_models` |
| Cloudflare R2 client | project current | Historical detail artifact storage/read path | Existing latest-detail and publish flows already rely on it |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `go test` | project current | Handler/unit verification | Primary automated verification for this phase |
| `make gen/sqlc` | project current | Regenerate typed query code after schema/query changes | Required whenever `be/turso/query/stocks.sql` changes |

No new external packages are needed for this phase.

## Architecture Patterns

### Pattern 1: Extend `stock_reports` Into the Historical Read Model

**What:** Add per-report detail keys and summary JSON columns directly to `stock_reports`.

**Why this is the best fit here:**
- The table already has one row per historical revision.
- The existing list endpoint already depends on it.
- The new detail endpoint also needs a per-report row keyed by `reportId`.
- This avoids an extra historical table plus duplicate writes.

**Recommended columns to add:**
```sql
r2_detail_key        TEXT NOT NULL DEFAULT '',
r2_detail_zh_tw_key  TEXT NOT NULL DEFAULT '',
summary_json         TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json)),
summary_json_zh_tw   TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw))
```

**Publish-time write rule:**
- `InsertStockReport` should persist:
  - markdown R2 key
  - EN detail R2 key
  - optional zh-TW detail R2 key
  - EN summary JSON
  - optional zh-TW summary JSON
  - provenance
  - `publishedAtMs`

**Backfill rule:**
- Migration should backfill the current latest row where `stock_reports.id = published_stock_details.report_id`.
- Older historical rows created before this phase may still lack summary/detail metadata. The list query should exclude rows whose `summary_json = '{}'` or whose EN detail key is empty so the API contract remains stable without request-time artifact scans.

### Pattern 2: Build a Frontend-Aligned Historical Summary Response

**What:** `GET /v1/stocks/{ticker}/reports` should return a response shaped like the Phase 5 frontend contract rather than re-exposing DB metadata.

**Recommended response row shape:**
```json
{
  "reportId": "TSM-20260318-abc123",
  "publishedAtMs": 1742300000000,
  "provenance": "earnings-refresh",
  "valuationStatus": "cheap",
  "thesisStatus": "intact",
  "technicalEntryStatus": "favorable",
  "currentPrice": 185.3,
  "bearFairValue": 160,
  "baseFairValue": 220,
  "bullFairValue": 280,
  "summary": { "en": "...", "zh-TW": "..." },
  "localeHasFallback": false,
  "latest": true
}
```

**Important mapping note:** `summary_json` is currently a `StockSummary`-shaped JSON blob, so the handler must extract only the fields needed by `HistoricalReportSummary` and override `reportId` from the database row. The `id` field inside `summary_json` is the stock identifier, not the report identifier.

### Pattern 3: Reuse Exact Locale Semantics From the Current Detail Handler

**What:** Historical detail reads should match the locale rule already implemented for latest detail reads.

**Rule:**
- default locale: use `r2_detail_key`
- `locale=zh-TW`:
  - use `r2_detail_zh_tw_key` when non-empty
  - otherwise fall back to `r2_detail_key`
  - otherwise return `404`

**Why:** This preserves user-visible consistency and avoids introducing a second locale rule for historical detail.

### Pattern 4: Keep Raw Storage Keys Internal

**What:** Historical list API responses should not expose `r2Key`, `r2DetailKey`, or `r2DetailZhTwKey`.

**Why:** The PRD explicitly says raw storage implementation details should not become the primary public contract. Only the historical detail handler needs those keys internally.

### Pattern 5: Shared Summary Parsing Helper in `be/lib/app/stocks`

**What:** Move or duplicate the `summaryFields` parsing shape out of `publish_handler.go` into a shared package-private helper file so publish/list handlers read the same schema.

**Recommended helper responsibilities:**
- choose EN vs zh-TW summary JSON
- detect `localeHasFallback`
- map `stock_reports` row + chosen summary JSON into a historical summary response
- keep JSON parsing logic out of the handler loop

## Common Pitfalls

### Pitfall 1: Reusing `published_stock_details` for Historical APIs
**What goes wrong:** The handler only ever sees the latest report per ticker and cannot serve historical revisions.
**Avoid by:** Keeping latest-only reads on `published_stock_details` and all historical reads on `stock_reports`.

### Pitfall 2: Returning Metadata-Only Historical Rows
**What goes wrong:** Phase 7 cannot render the revision ledger without re-fetching or inferring summary fields.
**Avoid by:** Returning a `HistoricalReportSummary`-aligned response from `/reports`, not the current `id/ticker/r2Key/provenance/publishedAtMs` metadata-only payload.

### Pitfall 3: Guessing Historical Detail Keys at Request Time
**What goes wrong:** The detail endpoint becomes coupled to R2 path conventions and breaks if naming changes.
**Avoid by:** Persisting detail keys in the DB and resolving them by `ticker + reportId`.

### Pitfall 4: Trusting Older Locale Fallback Notes Over the Repo
**What goes wrong:** Plans or code implement summary fallback for detail reads that the current codebase does not use.
**Avoid by:** Treating `be/lib/app/stocks/detail_handler.go` as the source of truth for detail locale behavior.

## Validation Architecture

### Automated verification surface
- Quick feedback:
  - `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`
- Full phase regression:
  - `cd /Users/huangchihan/develop/deep-value/be && go test ./...`

### What must be covered by tests
- publish handler persists historical summary/detail columns on every insert
- `GET /v1/stocks/{ticker}/reports` returns summary rows in descending `publishedAtMs`
- list response does not expose raw R2 keys
- zh-TW list locale chooses zh-TW summary when present and EN summary plus `localeHasFallback: true` when absent
- `GET /v1/stocks/{ticker}/reports/{reportId}` chooses zh-TW detail key when present, EN detail key otherwise, and `404`s when no detail artifact exists

### Recommended task-to-test mapping
- Storage/query/publish-path changes: focused `publish_handler_test.go`
- Historical list response contract: `reports_list_handler_test.go`
- Historical detail contract: new `report_detail_handler_test.go`

### Nyquist readiness
- This phase can be fully automated with Go unit tests. No manual-only verification is required at planning time.

