-- name: UpsertSubscription :exec
INSERT INTO subscriptions (ticker, status)
VALUES (?, ?)
ON CONFLICT(ticker) DO UPDATE SET
  status = excluded.status,
  updated_at_ms = (unixepoch('now') * 1000);

-- name: GetSubscription :one
SELECT * FROM subscriptions
WHERE ticker = ?
LIMIT 1;

-- name: ListActiveSubscriptions :many
SELECT * FROM subscriptions
WHERE status = 'active'
ORDER BY ticker ASC;

-- name: InsertStockReport :exec
INSERT INTO stock_reports (
  id,
  ticker,
  r2_key,
  r2_detail_key,
  r2_detail_zh_tw_key,
  summary_json,
  summary_json_zh_tw,
  provenance,
  published_at_ms
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: ListStockReportsByTicker :many
SELECT * FROM stock_reports
WHERE ticker = ?
  AND summary_json != '{}'
  AND r2_detail_key != ''
ORDER BY published_at_ms DESC;

-- name: GetStockReportByTickerAndID :one
SELECT * FROM stock_reports
WHERE ticker = ? AND id = ?
LIMIT 1;

-- name: UpsertTechnicalSnapshot :exec
INSERT INTO technical_snapshots (
  ticker,
  report_id,
  status,
  source,
  provider,
  r2_snapshot_key,
  r2_snapshot_zh_tw_key,
  error_message,
  published_at_ms
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(ticker, report_id) DO UPDATE SET
  status                = excluded.status,
  source                = excluded.source,
  provider              = excluded.provider,
  r2_snapshot_key       = excluded.r2_snapshot_key,
  r2_snapshot_zh_tw_key = excluded.r2_snapshot_zh_tw_key,
  error_message         = excluded.error_message,
  published_at_ms       = excluded.published_at_ms,
  updated_at_ms         = (unixepoch('now') * 1000);

-- name: GetTechnicalSnapshotByTickerAndReportID :one
SELECT * FROM technical_snapshots
WHERE ticker = ? AND report_id = ?
LIMIT 1;

-- name: UpsertPublishedStockDetail :exec
INSERT INTO published_stock_details (
  ticker,
  report_id,
  r2_report_key,
  r2_detail_key,
  r2_detail_zh_tw_key,
  summary_json,
  summary_json_zh_tw,
  published_at_ms
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(ticker) DO UPDATE SET
  report_id          = excluded.report_id,
  r2_report_key      = excluded.r2_report_key,
  r2_detail_key      = excluded.r2_detail_key,
  r2_detail_zh_tw_key = excluded.r2_detail_zh_tw_key,
  summary_json       = excluded.summary_json,
  summary_json_zh_tw = excluded.summary_json_zh_tw,
  published_at_ms    = excluded.published_at_ms,
  updated_at_ms      = (unixepoch('now') * 1000);

-- name: GetPublishedStockDetail :one
SELECT * FROM published_stock_details
WHERE ticker = ?
LIMIT 1;

-- name: ListPublishedStockDetails :many
SELECT * FROM published_stock_details
ORDER BY updated_at_ms DESC;
