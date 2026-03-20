# DeepValue Lab Analysis Publish Architecture

Date: 2026-03-17
Updated: 2026-03-20
Status: Implementation Aligned

---

## Context

DeepValue Lab needs a durable way to show the latest stock analysis inside the web app without moving the full research workflow into the web app backend.

The intended operating model is:

- the web app consumes published stock analysis results
- the substantive analysis is performed by a local AI agent
- the backend acts as a publish and retrieval layer, not as the primary analysis engine

## Core Decision

Separate local AI analysis from the backend publish path.

The architecture is:

- local AI agent generates the analysis report and the structured stock payload
- backend API receives published analysis results
- full report artifacts are stored in Cloudflare R2
- the latest published structured stock state is stored in sqlite
- the web app reads published data directly and does not parse markdown during the read path

This keeps the research workflow flexible while giving the web app a stable, fast data interface.

## Implementation Scope (V1)

In scope:

- Cloudflare R2 integration for raw markdown artifact storage
- Three new domain-specific SQLite tables: `subscriptions`, `stock_reports`, `published_stock_details`
- Five API endpoints (see below)
- First-publish auto-subscribe behavior on `POST /v1/stocks/:ticker/reports`

Explicitly deferred:

- Auth (single-user, no auth in V1)
- Daily lightweight price refresh scheduler
- Provider usage APIs for token-budget measurement
- Parallel or subagent-based bulk refresh
- Event-driven triggers (earnings, price-move)

The existing generic `documents` table is not used for the stock domain. Stock tables are purpose-built and separate.

---

## API Contract

### `GET /v1/stocks`

Returns all active subscriptions with their latest published summary.

Locale behavior:

- default behavior returns the published English summary
- `?locale=zh-TW` returns the published zh-TW summary when available and otherwise falls back to the English summary

Response `200`:
```json
{
  "stocks": [
    {
      "id": "TSM",
      "ticker": "TSM",
      "companyName": "Taiwan Semiconductor Manufacturing",
      "currentPrice": 185.30,
      "valuationStatus": "cheap",
      "newsImpactStatus": "improving",
      "thesisStatus": "intact",
      "technicalEntryStatus": "favorable",
      "actionState": "strong accumulation",
      "dashboardBucket": "now-actionable",
      "baseFairValue": 220.0,
      "bearFairValue": 160.0,
      "bullFairValue": 280.0,
      "discountToBase": -15.8,
      "businessType": "Foundry",
      "summary": "...",
      "lastUpdated": "2026-03-18T10:00:00Z"
    }
  ]
}
```

### `GET /v1/stocks/:ticker`

Returns the latest published `StockDetail` payload for a single ticker.

Locale behavior:

- default behavior returns the published English detail payload
- `?locale=zh-TW` fallback order is:
  1. published zh-TW detail artifact
  2. published zh-TW summary JSON
  3. published English detail artifact
  4. published English summary JSON

Important note:

- the backend read path now supports separate locale-specific zh-TW detail storage
- older docs that describe a single embedded bilingual payload are stale relative to current backend behavior

Response `200`: full `StockDetail` JSON object
Response `404`: `{ "error": "not found" }`

### `GET /v1/stocks/:ticker/reports`

Returns report version metadata for a ticker. Does not include the full `StockDetail` payload or markdown content.

Response `200`:
```json
{
  "reports": [
    {
      "id": "TSM-20260318-abc123",
      "ticker": "TSM",
      "publishedAtMs": 1742300000000,
      "r2Key": "reports/TSM/20260318/TSM-20260318-abc123.md",
      "provenance": "claude-sonnet-4-6"
    }
  ]
}
```

### `POST /v1/subscriptions`

Creates or reactivates a watchlist subscription for a ticker.

Request body:
```json
{ "ticker": "AVGO" }
```

Response `201`: `{ "ticker": "AVGO", "status": "active" }`
Response `200`: same shape if already subscribed (idempotent)

### `POST /v1/stocks/:ticker/reports`

Publishes a new analysis result. Uploads the markdown artifact to R2, inserts a record in `stock_reports`, upserts the `StockDetail` payload in `published_stock_details`, and auto-subscribes the ticker if not already subscribed.

Request body:
```json
{
  "report": {
    "markdown": "# TSM Analysis\n...",
    "provenance": "claude-sonnet-4-6"
  },
  "stockDetail": {
    ...StockDetail JSON (mirrors web/src/types/stocks.ts)...
  },
  "stockDetailZhTW": {
    ...optional zh-TW StockDetail JSON...
  }
}
```

Publish behavior:

- `report.markdown` is required
- `stockDetail` is required
- `stockDetailZhTW` is optional
- when `stockDetailZhTW` is present, the backend uploads a separate zh-TW detail artifact and stores zh-TW summary metadata beside the English payload

Response `201`:
```json
{
  "reportId": "TSM-20260318-abc123",
  "r2ReportKey": "reports/TSM/20260318/TSM-20260318-abc123.md",
  "r2DetailKey": "reports/TSM/20260318/TSM-20260318-abc123.json",
  "r2DetailZhTWKey": "reports/TSM/20260318/TSM-20260318-abc123.zh-TW.json",
  "ticker": "TSM",
  "publishedAtMs": 1742300000000
}
```

Response `422` if `stockDetail` or `stockDetailZhTW` fails validation.

---

## Data Model

Three domain-specific tables. These are separate from the existing `documents` table.

### `subscriptions`

```sql
CREATE TABLE subscriptions (
  ticker      TEXT PRIMARY KEY,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);
```

### `stock_reports`

```sql
CREATE TABLE stock_reports (
  id            TEXT PRIMARY KEY,
  ticker        TEXT NOT NULL,
  r2_key        TEXT NOT NULL,
  provenance    TEXT NOT NULL DEFAULT '',
  published_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  created_at_ms   INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

CREATE INDEX idx_stock_reports_ticker_published
  ON stock_reports(ticker, published_at_ms DESC);
```

### `published_stock_details`

```sql
CREATE TABLE published_stock_details (
  ticker               TEXT PRIMARY KEY,
  report_id            TEXT NOT NULL,
  r2_report_key        TEXT NOT NULL DEFAULT '',
  r2_detail_key        TEXT NOT NULL DEFAULT '',
  r2_detail_zh_tw_key  TEXT NOT NULL DEFAULT '',
  summary_json         TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json)),
  summary_json_zh_tw   TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw)),
  published_at_ms      INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms        INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

CREATE TRIGGER trg_published_stock_details_touch_updated_at
AFTER UPDATE ON published_stock_details
FOR EACH ROW
BEGIN
  UPDATE published_stock_details
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE ticker = NEW.ticker;
END;
```

---

## Skill Workflow

The local analysis workflow centers on `deepvalue-stock-analysis` skill.

Publish behavior:

1. skill generates the markdown report
2. skill generates the English `StockDetail` JSON payload
3. skill generates the zh-TW `StockDetail` JSON payload
4. skill asks whether to publish to the backend
5. if yes, `POST /v1/stocks/:ticker/reports` with `report`, `stockDetail`, and optional `stockDetailZhTW`
6. publish does **not** directly update `web/src/data/mock-stocks.ts`

---

## Bulk Refresh (future skill)

Create a dedicated refresh skill that iterates through all subscribed tickers sequentially.

V1 defaults:

- sequential queue only, no subagent fan-out
- configurable weekly budget threshold
- stop the batch when remaining budget falls below 30 percent
- budget control is manual configuration, not provider-side usage APIs

---

## Deferred Decisions

- provider usage APIs for real token-budget measurement
- parallel or subagent-based bulk refresh
- event-driven triggers (earnings, price-move initiated refresh)
- automated news qualification before re-analysis
- daily lightweight price refresh scheduler

---

## Implementation Checklist

### Phase 1 — SQLite Schema ✅

- [x] Add migration file `be/turso/migrations/20260318065637_stock_domain.sql` with the three tables
- [x] Add follow-up migrations `20260318100726_stock_detail_to_r2.sql` and `20260320220959_published_stock_details_zh_tw_locale.sql` to align published detail storage with current R2-backed and zh-TW locale-aware behavior
- [x] Run migration against Turso dev DB (`make migrate/up`, status confirmed Applied)
- [x] Add sqlc queries under `be/turso/query/stocks.sql`
- [x] Regenerate sqlc models (`make gen/sqlc` — `stocks.sql.go` generated, `go build` passes)

Queries implemented:

- `subscriptions`: `UpsertSubscription`, `GetSubscription`, `ListActiveSubscriptions`
- `stock_reports`: `InsertStockReport`, `ListStockReportsByTicker`
- `published_stock_details`: `UpsertPublishedStockDetail`, `GetPublishedStockDetail`, `ListPublishedStockDetails`

### Phase 2 — Cloudflare R2 Integration ✅

- [x] Add R2 config keys to `be/config/config.go` (`r2_account_id`, `r2_bucket`, `r2_access_key_id`, `r2_secret_access_key`, `r2_public_base_url`)
- [x] Add R2 client under `be/lib/pkg/r2/client.go` using `aws-sdk-go-v2/service/s3`
- [x] Wire R2 client + sqlite client + turso_models Queries into Fx (`lib/app/fx/core.go`)
- [x] Implement `UploadMarkdown(ctx, key, content string) error`
- [x] R2 key helper `ReportKey(ticker, date, reportID)` → `reports/{ticker}/{YYYYMMDD}/{id}.md`

### Phase 3 — API Handlers ✅

- [x] `be/lib/app/stocks/list_handler.go` — `GET /v1/stocks`
- [x] `be/lib/app/stocks/detail_handler.go` — `GET /v1/stocks/{ticker}`
- [x] `be/lib/app/stocks/reports_list_handler.go` — `GET /v1/stocks/{ticker}/reports`
- [x] `be/lib/app/stocks/publish_handler.go` — `POST /v1/stocks/{ticker}/reports`
- [x] `be/lib/app/subscriptions/create_handler.go` — `POST /v1/subscriptions`
- [x] All handlers registered in `cmd/server/main.go`

### Phase 4 — Fx Wiring ✅

- [x] sqlite client, turso_models Queries, R2 client provided in `lib/app/fx/core.go` (done in Phase 2)
- [x] All handlers registered via `router.AsRoute` in `cmd/server/main.go`

### Phase 5 — Validation ✅

- [x] `go build ./...` passes
- [x] `GET /v1/stocks` returns empty array on fresh DB (not 500)
- [x] `POST /v1/subscriptions` creates subscription → `{"ticker":"TSM","status":"active"}`
- [x] `POST /v1/stocks/TSM/reports` uploads to R2 and populates DB → returns `reportId`, `r2Key`
- [x] `GET /v1/stocks` returns TSM summary after publish (`stocks` length = 1)
- [x] `GET /v1/stocks/TSM` returns full `StockDetail` after publish
- [x] `GET /v1/stocks/TSM/reports` returns one report metadata entry
- [x] Second publish to TSM creates a second `stock_reports` row (count = 2) and updates `published_stock_details` (currentPrice updated)
- [x] `GET /v1/stocks/UNKNOWN` returns `404`
