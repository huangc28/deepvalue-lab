package stocks

import (
	"context"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
)

type fakeUpsertTechnicalSnapshotQueries struct {
	reportRow                    turso_models.StockReport
	reportErr                    error
	lastReportArgs               turso_models.GetStockReportByTickerAndIDParams
	upsertTechnicalSnapshotCalls []turso_models.UpsertTechnicalSnapshotParams
}

func (f *fakeUpsertTechnicalSnapshotQueries) GetStockReportByTickerAndID(
	_ context.Context,
	arg turso_models.GetStockReportByTickerAndIDParams,
) (turso_models.StockReport, error) {
	f.lastReportArgs = arg
	return f.reportRow, f.reportErr
}

func (f *fakeUpsertTechnicalSnapshotQueries) UpsertTechnicalSnapshot(
	_ context.Context,
	arg turso_models.UpsertTechnicalSnapshotParams,
) error {
	f.upsertTechnicalSnapshotCalls = append(f.upsertTechnicalSnapshotCalls, arg)
	return nil
}

func TestUpsertTechnicalSnapshotHandlerReadyUploadsArtifacts(t *testing.T) {
	queries := &fakeUpsertTechnicalSnapshotQueries{
		reportRow: turso_models.StockReport{
			ID:            "TSM-20260325-abcd1234",
			Ticker:        "TSM",
			PublishedAtMs: 1742860800000,
		},
	}
	storage := newFakePublishStorage()
	handler := &UpsertTechnicalSnapshotHandler{
		queries:  queries,
		r2Client: storage,
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(
			http.MethodPost,
			"/v1/stocks/tsm/reports/TSM-20260325-abcd1234/technical-snapshot",
			mustJSONBody(t, map[string]any{
				"status":       "ready",
				"source":       "polygon",
				"provider":     "polygon",
				"snapshot":     map[string]any{"status": "ready", "snapshot": map[string]any{"seriesByRange": map[string]any{"1Y": []any{}}}},
				"snapshotZhTW": map[string]any{"status": "ready", "snapshot": map[string]any{"seriesByRange": map[string]any{"1Y": []any{}}}},
			}),
		),
		map[string]string{"ticker": "tsm", "reportId": "TSM-20260325-abcd1234"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", rec.Code, rec.Body.String())
	}
	if len(queries.upsertTechnicalSnapshotCalls) != 1 {
		t.Fatalf("expected 1 upsert call, got %d", len(queries.upsertTechnicalSnapshotCalls))
	}

	arg := queries.upsertTechnicalSnapshotCalls[0]
	if arg.Status != "ready" || arg.Source != "polygon" || arg.Provider != "polygon" {
		t.Fatalf("unexpected upsert args: %+v", arg)
	}
	if arg.R2SnapshotKey == "" || arg.R2SnapshotZhTwKey == "" {
		t.Fatalf("expected both snapshot keys, got %+v", arg)
	}
	if len(storage.jsonUploads) != 2 {
		t.Fatalf("expected 2 uploaded json artifacts, got %d", len(storage.jsonUploads))
	}
}

func TestUpsertTechnicalSnapshotHandlerPendingDoesNotRequireSnapshot(t *testing.T) {
	queries := &fakeUpsertTechnicalSnapshotQueries{
		reportRow: turso_models.StockReport{
			ID:            "TSM-20260325-abcd1234",
			Ticker:        "TSM",
			PublishedAtMs: 1742860800000,
		},
	}
	storage := newFakePublishStorage()
	handler := &UpsertTechnicalSnapshotHandler{
		queries:  queries,
		r2Client: storage,
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(
			http.MethodPost,
			"/v1/stocks/tsm/reports/TSM-20260325-abcd1234/technical-snapshot",
			mustJSONBody(t, map[string]any{
				"status":   "pending",
				"source":   "polygon",
				"provider": "polygon",
			}),
		),
		map[string]string{"ticker": "tsm", "reportId": "TSM-20260325-abcd1234"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", rec.Code, rec.Body.String())
	}
	if len(queries.upsertTechnicalSnapshotCalls) != 1 {
		t.Fatalf("expected 1 upsert call, got %d", len(queries.upsertTechnicalSnapshotCalls))
	}
	if len(storage.jsonUploads) != 0 {
		t.Fatalf("expected no uploads for pending snapshot, got %d", len(storage.jsonUploads))
	}
}

func TestUpsertTechnicalSnapshotHandlerRequiresSnapshotForReady(t *testing.T) {
	handler := &UpsertTechnicalSnapshotHandler{
		queries:  &fakeUpsertTechnicalSnapshotQueries{},
		r2Client: newFakePublishStorage(),
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(
			http.MethodPost,
			"/v1/stocks/tsm/reports/r1/technical-snapshot",
			mustJSONBody(t, map[string]any{"status": "ready"}),
		),
		map[string]string{"ticker": "tsm", "reportId": "r1"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422, got %d body=%s", rec.Code, rec.Body.String())
	}
}

func TestUpsertTechnicalSnapshotHandlerReportNotFound(t *testing.T) {
	handler := &UpsertTechnicalSnapshotHandler{
		queries:  &fakeUpsertTechnicalSnapshotQueries{reportErr: sql.ErrNoRows},
		r2Client: newFakePublishStorage(),
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(
			http.MethodPost,
			"/v1/stocks/tsm/reports/r1/technical-snapshot",
			mustJSONBody(t, map[string]any{"status": "pending"}),
		),
		map[string]string{"ticker": "tsm", "reportId": "r1"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d body=%s", rec.Code, rec.Body.String())
	}
}
