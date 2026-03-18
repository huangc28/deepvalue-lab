-- +goose Up
-- +goose StatementBegin
CREATE TABLE subscriptions (
  ticker        TEXT PRIMARY KEY,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TRIGGER trg_subscriptions_touch_updated_at
AFTER UPDATE ON subscriptions
FOR EACH ROW
BEGIN
  UPDATE subscriptions
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE ticker = NEW.ticker;
END;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE stock_reports (
  id              TEXT PRIMARY KEY,
  ticker          TEXT NOT NULL,
  r2_key          TEXT NOT NULL,
  provenance      TEXT NOT NULL DEFAULT '',
  published_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  created_at_ms   INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE INDEX idx_stock_reports_ticker_published
  ON stock_reports(ticker, published_at_ms DESC);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE published_stock_details (
  ticker          TEXT PRIMARY KEY,
  report_id       TEXT NOT NULL,
  stock_detail    TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(stock_detail)),
  published_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms   INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TRIGGER trg_published_stock_details_touch_updated_at
AFTER UPDATE ON published_stock_details
FOR EACH ROW
BEGIN
  UPDATE published_stock_details
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE ticker = NEW.ticker;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS published_stock_details;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE IF EXISTS stock_reports;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE IF EXISTS subscriptions;
-- +goose StatementEnd
