-- +goose Up
-- +goose StatementBegin
CREATE TABLE published_stock_details_new (
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

INSERT INTO published_stock_details_new (
  ticker,
  report_id,
  r2_report_key,
  r2_detail_key,
  r2_detail_zh_tw_key,
  summary_json,
  summary_json_zh_tw,
  published_at_ms,
  updated_at_ms
)
SELECT
  ticker,
  report_id,
  r2_report_key,
  r2_detail_key,
  '',
  summary_json,
  '{}',
  published_at_ms,
  updated_at_ms
FROM published_stock_details;

DROP TABLE published_stock_details;

ALTER TABLE published_stock_details_new RENAME TO published_stock_details;

CREATE TRIGGER trg_published_stock_details_touch_updated_at
AFTER UPDATE ON published_stock_details FOR EACH ROW
BEGIN
  UPDATE published_stock_details
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE ticker = NEW.ticker;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
CREATE TABLE published_stock_details_old (
  ticker          TEXT PRIMARY KEY,
  report_id       TEXT NOT NULL,
  r2_report_key   TEXT NOT NULL DEFAULT '',
  r2_detail_key   TEXT NOT NULL DEFAULT '',
  summary_json    TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(summary_json)),
  published_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms   INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
);

INSERT INTO published_stock_details_old (
  ticker,
  report_id,
  r2_report_key,
  r2_detail_key,
  summary_json,
  published_at_ms,
  updated_at_ms
)
SELECT
  ticker,
  report_id,
  r2_report_key,
  r2_detail_key,
  summary_json,
  published_at_ms,
  updated_at_ms
FROM published_stock_details;

DROP TABLE published_stock_details;

ALTER TABLE published_stock_details_old RENAME TO published_stock_details;

CREATE TRIGGER trg_published_stock_details_touch_updated_at
AFTER UPDATE ON published_stock_details FOR EACH ROW
BEGIN
  UPDATE published_stock_details
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE ticker = NEW.ticker;
END;
-- +goose StatementEnd
