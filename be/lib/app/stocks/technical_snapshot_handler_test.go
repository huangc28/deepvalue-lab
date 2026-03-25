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

type fakeTechnicalSnapshotQueries struct {
	row      turso_models.TechnicalSnapshot
	err      error
	lastArgs turso_models.GetTechnicalSnapshotByTickerAndReportIDParams
}

func (f *fakeTechnicalSnapshotQueries) GetTechnicalSnapshotByTickerAndReportID(
	_ context.Context,
	arg turso_models.GetTechnicalSnapshotByTickerAndReportIDParams,
) (turso_models.TechnicalSnapshot, error) {
	f.lastArgs = arg
	return f.row, f.err
}

func TestTechnicalSnapshotHandler_PendingState(t *testing.T) {
	handler := &TechnicalSnapshotHandler{
		queries: &fakeTechnicalSnapshotQueries{
			row: turso_models.TechnicalSnapshot{
				Ticker:      "TSM",
				ReportID:    "r1",
				Status:      "pending",
				UpdatedAtMs: 123,
			},
		},
		r2Client: &fakeDetailStorage{dataByKey: map[string][]byte{}},
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(http.MethodGet, "/v1/stocks/tsm/reports/r1/technical-snapshot", nil),
		map[string]string{"ticker": "tsm", "reportId": "r1"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
	}
	if compactJSON(t, rec.Body.String()) != compactJSON(t, `{"ticker":"TSM","reportId":"r1","status":"pending","updatedAtMs":123}`) {
		t.Fatalf("unexpected body: %s", rec.Body.String())
	}
}

func TestTechnicalSnapshotHandler_ReadyLocaleFallback(t *testing.T) {
	tests := []struct {
		name            string
		url             string
		row             turso_models.TechnicalSnapshot
		dataByKey       map[string][]byte
		wantBody        string
		wantKey         string
		wantStatus      int
		wantQueryTicker string
		wantQueryReport string
	}{
		{
			name: "zh-TW prefers zh-TW snapshot",
			url:  "/v1/stocks/tsm/reports/r1/technical-snapshot?locale=zh-TW",
			row: turso_models.TechnicalSnapshot{
				Ticker:            "TSM",
				ReportID:          "r1",
				Status:            "ready",
				Source:            "polygon",
				Provider:          "polygon",
				R2SnapshotKey:     "en.json",
				R2SnapshotZhTwKey: "zh.json",
				UpdatedAtMs:       321,
			},
			dataByKey:       map[string][]byte{"zh.json": []byte(`{"status":"ready","snapshot":{"source":"zh"}}`)},
			wantBody:        `{"ticker":"TSM","reportId":"r1","status":"ready","source":"polygon","provider":"polygon","updatedAtMs":321,"snapshot":{"status":"ready","snapshot":{"source":"zh"}}}`,
			wantKey:         "zh.json",
			wantStatus:      http.StatusOK,
			wantQueryTicker: "TSM",
			wantQueryReport: "r1",
		},
		{
			name: "zh-TW falls back to en snapshot",
			url:  "/v1/stocks/tsm/reports/r1/technical-snapshot?locale=zh-TW",
			row: turso_models.TechnicalSnapshot{
				Ticker:        "TSM",
				ReportID:      "r1",
				Status:        "ready",
				Source:        "polygon",
				Provider:      "polygon",
				R2SnapshotKey: "en.json",
				UpdatedAtMs:   654,
			},
			dataByKey:       map[string][]byte{"en.json": []byte(`{"status":"ready","snapshot":{"source":"en"}}`)},
			wantBody:        `{"ticker":"TSM","reportId":"r1","status":"ready","source":"polygon","provider":"polygon","updatedAtMs":654,"localeHasFallback":true,"snapshot":{"status":"ready","snapshot":{"source":"en"}}}`,
			wantKey:         "en.json",
			wantStatus:      http.StatusOK,
			wantQueryTicker: "TSM",
			wantQueryReport: "r1",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			queries := &fakeTechnicalSnapshotQueries{row: tt.row}
			storage := &fakeDetailStorage{dataByKey: tt.dataByKey}
			handler := &TechnicalSnapshotHandler{
				queries:  queries,
				r2Client: storage,
				logger:   zap.NewNop(),
			}

			req := withURLParams(
				httptest.NewRequest(http.MethodGet, tt.url, nil),
				map[string]string{"ticker": "tsm", "reportId": "r1"},
			)
			rec := httptest.NewRecorder()

			handler.Handle(rec, req)

			if rec.Code != tt.wantStatus {
				t.Fatalf("expected status %d, got %d body=%s", tt.wantStatus, rec.Code, rec.Body.String())
			}
			if compactJSON(t, rec.Body.String()) != compactJSON(t, tt.wantBody) {
				t.Fatalf("expected body %s, got %s", tt.wantBody, rec.Body.String())
			}
			if storage.lastKey != tt.wantKey {
				t.Fatalf("expected key %q, got %q", tt.wantKey, storage.lastKey)
			}
			if queries.lastArgs.Ticker != tt.wantQueryTicker || queries.lastArgs.ReportID != tt.wantQueryReport {
				t.Fatalf("unexpected query args: %+v", queries.lastArgs)
			}
		})
	}
}

func TestTechnicalSnapshotHandlerNotFound(t *testing.T) {
	handler := &TechnicalSnapshotHandler{
		queries:  &fakeTechnicalSnapshotQueries{err: sql.ErrNoRows},
		r2Client: &fakeDetailStorage{dataByKey: map[string][]byte{}},
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(http.MethodGet, "/v1/stocks/tsm/reports/missing/technical-snapshot", nil),
		map[string]string{"ticker": "tsm", "reportId": "missing"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d body=%s", rec.Code, rec.Body.String())
	}
}
