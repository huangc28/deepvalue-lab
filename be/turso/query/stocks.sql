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
INSERT INTO stock_reports (id, ticker, r2_key, provenance, published_at_ms)
VALUES (?, ?, ?, ?, ?);

-- name: ListStockReportsByTicker :many
SELECT * FROM stock_reports
WHERE ticker = ?
ORDER BY published_at_ms DESC;

-- name: UpsertPublishedStockDetail :exec
INSERT INTO published_stock_details (ticker, report_id, stock_detail, published_at_ms)
VALUES (?, ?, ?, ?)
ON CONFLICT(ticker) DO UPDATE SET
  report_id       = excluded.report_id,
  stock_detail    = excluded.stock_detail,
  published_at_ms = excluded.published_at_ms,
  updated_at_ms   = (unixepoch('now') * 1000);

-- name: GetPublishedStockDetail :one
SELECT * FROM published_stock_details
WHERE ticker = ?
LIMIT 1;

-- name: ListPublishedStockDetails :many
SELECT * FROM published_stock_details
ORDER BY updated_at_ms DESC;
