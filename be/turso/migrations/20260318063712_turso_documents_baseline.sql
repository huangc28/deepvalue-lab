-- +goose Up
-- +goose StatementBegin
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  payload TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(payload)),
  title TEXT GENERATED ALWAYS AS (json_extract(payload, '$.title')) STORED,
  created_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  updated_at_ms INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
  deleted_at_ms INTEGER NULL,
  CHECK (json_type(payload) = 'object')
);

CREATE INDEX idx_documents_status_updated
  ON documents(status, updated_at_ms DESC);

CREATE INDEX idx_documents_created_at
  ON documents(created_at_ms DESC);

CREATE TRIGGER trg_documents_touch_updated_at
AFTER UPDATE ON documents
FOR EACH ROW
BEGIN
  UPDATE documents
  SET updated_at_ms = (unixepoch('now') * 1000)
  WHERE id = NEW.id;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS trg_documents_touch_updated_at;
DROP INDEX IF EXISTS idx_documents_created_at;
DROP INDEX IF EXISTS idx_documents_status_updated;
DROP TABLE IF EXISTS documents;
-- +goose StatementEnd
