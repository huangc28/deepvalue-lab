-- name: GetDocumentByID :one
SELECT * FROM documents
WHERE id = ?
LIMIT 1;

-- name: ListDocumentsRecent :many
SELECT * FROM documents
WHERE deleted_at_ms IS NULL
ORDER BY updated_at_ms DESC
LIMIT ?;

-- name: UpsertDocument :exec
INSERT INTO documents (id, status, payload)
VALUES (?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
  status = excluded.status,
  payload = excluded.payload,
  deleted_at_ms = NULL;

-- name: DeleteDocumentByID :exec
DELETE FROM documents
WHERE id = ?;
