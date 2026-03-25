-- +goose Up
-- +goose StatementBegin
CREATE TABLE technical_snapshots (
  ticker               TEXT NOT NULL,
  report_id            TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'failed')),
  source               TEXT NOT NULL DEFAULT '',
  provider             TEXT NOT NULL DEFAULT '',
  r2_snapshot_key      TEXT NOT NULL DEFAULT '',
  r2_snapshot_zh_tw_key TEXT NOT NULL DEFAULT '',
  error_message        TEXT NOT NULL DEFAULT '',
  published_at_ms      INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms        INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  PRIMARY KEY (ticker, report_id)
);

CREATE INDEX idx_technical_snapshots_report
  ON technical_snapshots(report_id);

CREATE TRIGGER trg_technical_snapshots_touch_updated_at
AFTER UPDATE ON technical_snapshots
FOR EACH ROW
BEGIN
  UPDATE technical_snapshots
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE ticker = NEW.ticker AND report_id = NEW.report_id;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS trg_technical_snapshots_touch_updated_at;
DROP INDEX IF EXISTS idx_technical_snapshots_report;
DROP TABLE IF EXISTS technical_snapshots;
-- +goose StatementEnd
