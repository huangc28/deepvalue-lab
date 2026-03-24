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

type fakeReportDetailQueries struct {
	row      turso_models.StockReport
	err      error
	lastArgs turso_models.GetStockReportByTickerAndIDParams
}

func (f *fakeReportDetailQueries) GetStockReportByTickerAndID(
	_ context.Context,
	arg turso_models.GetStockReportByTickerAndIDParams,
) (turso_models.StockReport, error) {
	f.lastArgs = arg
	return f.row, f.err
}

func TestReportDetailHandlerLocaleSelection(t *testing.T) {
	tests := []struct {
		name       string
		url        string
		row        turso_models.StockReport
		dataByKey  map[string][]byte
		wantBody   string
		wantKey    string
		wantStatus int
	}{
		{
			name: "locale=zh-TW prefers zh-TW detail key",
			url:  "/v1/stocks/tsm/reports/r1?locale=zh-TW",
			row: turso_models.StockReport{
				ID:              "r1",
				Ticker:          "TSM",
				R2DetailKey:     "en.json",
				R2DetailZhTwKey: "zh.json",
			},
			dataByKey:  map[string][]byte{"zh.json": []byte(`{"summary":"zh-detail"}`)},
			wantBody:   `{"summary":"zh-detail"}`,
			wantKey:    "zh.json",
			wantStatus: http.StatusOK,
		},
		{
			name: "locale=zh-TW falls back to en detail key",
			url:  "/v1/stocks/tsm/reports/r1?locale=zh-TW",
			row: turso_models.StockReport{
				ID:          "r1",
				Ticker:      "TSM",
				R2DetailKey: "en.json",
			},
			dataByKey:  map[string][]byte{"en.json": []byte(`{"summary":"en-detail"}`)},
			wantBody:   `{"summary":"en-detail"}`,
			wantKey:    "en.json",
			wantStatus: http.StatusOK,
		},
		{
			name: "default locale uses en detail key",
			url:  "/v1/stocks/tsm/reports/r1",
			row: turso_models.StockReport{
				ID:          "r1",
				Ticker:      "TSM",
				R2DetailKey: "en.json",
			},
			dataByKey:  map[string][]byte{"en.json": []byte(`{"summary":"en-detail"}`)},
			wantBody:   `{"summary":"en-detail"}`,
			wantKey:    "en.json",
			wantStatus: http.StatusOK,
		},
		{
			name: "missing detail keys returns 404",
			url:  "/v1/stocks/tsm/reports/r1?locale=zh-TW",
			row: turso_models.StockReport{
				ID:     "r1",
				Ticker: "TSM",
			},
			dataByKey:  map[string][]byte{},
			wantBody:   `{"error":"stock report detail not found"}`,
			wantKey:    "",
			wantStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			queries := &fakeReportDetailQueries{row: tt.row}
			storage := &fakeDetailStorage{dataByKey: tt.dataByKey}
			handler := &ReportDetailHandler{
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
				t.Fatalf("expected download key %q, got %q", tt.wantKey, storage.lastKey)
			}
			if queries.lastArgs.Ticker != "TSM" || queries.lastArgs.ID != "r1" {
				t.Fatalf("unexpected query args: %+v", queries.lastArgs)
			}
		})
	}
}

func TestReportDetailHandlerNotFound(t *testing.T) {
	handler := &ReportDetailHandler{
		queries:  &fakeReportDetailQueries{err: sql.ErrNoRows},
		r2Client: &fakeDetailStorage{dataByKey: map[string][]byte{}},
		logger:   zap.NewNop(),
	}

	req := withURLParams(
		httptest.NewRequest(http.MethodGet, "/v1/stocks/tsm/reports/missing", nil),
		map[string]string{"ticker": "tsm", "reportId": "missing"},
	)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d body=%s", rec.Code, rec.Body.String())
	}
	if compactJSON(t, rec.Body.String()) != compactJSON(t, `{"error":"not found"}`) {
		t.Fatalf("unexpected body: %s", rec.Body.String())
	}
}
