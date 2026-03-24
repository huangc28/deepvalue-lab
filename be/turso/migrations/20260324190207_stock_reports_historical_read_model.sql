-- +goose Up
-- +goose StatementBegin
CREATE TABLE stock_reports_new (
  id                  TEXT PRIMARY KEY,
  ticker              TEXT NOT NULL,
  r2_key              TEXT NOT NULL,
  r2_detail_key       TEXT NOT NULL DEFAULT '',
  r2_detail_zh_tw_key TEXT NOT NULL DEFAULT '',
  summary_json        TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json)),
  summary_json_zh_tw  TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json_zh_tw)),
  provenance          TEXT NOT NULL DEFAULT '',
  published_at_ms     INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  created_at_ms       INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

INSERT INTO stock_reports_new (
  id,
  ticker,
  r2_key,
  r2_detail_key,
  r2_detail_zh_tw_key,
  summary_json,
  summary_json_zh_tw,
  provenance,
  published_at_ms,
  created_at_ms
)
SELECT
  sr.id,
  sr.ticker,
  sr.r2_key,
  COALESCE(psd.r2_detail_key, ''),
  COALESCE(psd.r2_detail_zh_tw_key, ''),
  COALESCE(psd.summary_json, '{}'),
  COALESCE(psd.summary_json_zh_tw, '{}'),
  sr.provenance,
  sr.published_at_ms,
  sr.created_at_ms
FROM stock_reports sr
LEFT JOIN published_stock_details psd
  ON psd.report_id = sr.id
 AND psd.ticker = sr.ticker;

DROP TABLE stock_reports;

ALTER TABLE stock_reports_new RENAME TO stock_reports;

CREATE INDEX idx_stock_reports_ticker_published
  ON stock_reports(ticker, published_at_ms DESC);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
CREATE TABLE stock_reports_old (
  id              TEXT PRIMARY KEY,
  ticker          TEXT NOT NULL,
  r2_key          TEXT NOT NULL,
  provenance      TEXT NOT NULL DEFAULT '',
  published_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  created_at_ms   INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

INSERT INTO stock_reports_old (
  id,
  ticker,
  r2_key,
  provenance,
  published_at_ms,
  created_at_ms
)
SELECT
  id,
  ticker,
  r2_key,
  provenance,
  published_at_ms,
  created_at_ms
FROM stock_reports;

DROP TABLE stock_reports;

ALTER TABLE stock_reports_old RENAME TO stock_reports;

CREATE INDEX idx_stock_reports_ticker_published
  ON stock_reports(ticker, published_at_ms DESC);
-- +goose StatementEnd
