package stocks

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
)

type fakeDetailQueries struct {
	row turso_models.PublishedStockDetail
	err error
}

func (f *fakeDetailQueries) GetPublishedStockDetail(_ context.Context, _ string) (turso_models.PublishedStockDetail, error) {
	return f.row, f.err
}

type fakeDetailStorage struct {
	dataByKey map[string][]byte
	lastKey   string
	err       error
}

func (f *fakeDetailStorage) Download(_ context.Context, key string) ([]byte, error) {
	f.lastKey = key
	if f.err != nil {
		return nil, f.err
	}
	return f.dataByKey[key], nil
}

func TestDetailHandlerLocaleSelection(t *testing.T) {
	tests := []struct {
		name       string
		url        string
		row        turso_models.PublishedStockDetail
		dataByKey  map[string][]byte
		wantBody   string
		wantKey    string
		wantStatus int
	}{
		{
			name:       "locale=zh-TW prefers zh-TW detail artifact",
			url:        "/v1/stocks/TSM?locale=zh-TW",
			row:        turso_models.PublishedStockDetail{Ticker: "TSM", R2DetailKey: "en.json", R2DetailZhTwKey: "zh.json", SummaryJson: `{"summary":"en"}`, SummaryJsonZhTw: `{"summary":"zh"}`},
			dataByKey:  map[string][]byte{"zh.json": []byte(`{"summary":"zh-detail"}`)},
			wantBody:   `{"summary":"zh-detail"}`,
			wantKey:    "zh.json",
			wantStatus: http.StatusOK,
		},
		{
			name:       "locale=zh-TW falls back to en detail when zh-TW detail is unavailable",
			url:        "/v1/stocks/TSM?locale=zh-TW",
			row:        turso_models.PublishedStockDetail{Ticker: "TSM", R2DetailKey: "en.json", SummaryJson: `{"summary":"en"}`, SummaryJsonZhTw: `{"summary":"zh-summary"}`},
			dataByKey:  map[string][]byte{"en.json": []byte(`{"summary":"en-detail"}`)},
			wantBody:   `{"summary":"en-detail"}`,
			wantKey:    "en.json",
			wantStatus: http.StatusOK,
		},
		{
			name:       "locale=zh-TW returns not found when no detail artifact exists",
			url:        "/v1/stocks/TSM?locale=zh-TW",
			row:        turso_models.PublishedStockDetail{Ticker: "TSM", SummaryJson: `{"summary":"en-summary"}`},
			dataByKey:  map[string][]byte{},
			wantBody:   `{"error":"stock detail not found"}`,
			wantKey:    "",
			wantStatus: http.StatusNotFound,
		},
		{
			name:       "default locale keeps en detail behavior",
			url:        "/v1/stocks/TSM",
			row:        turso_models.PublishedStockDetail{Ticker: "TSM", R2DetailKey: "en.json", SummaryJson: `{"summary":"en-summary"}`},
			dataByKey:  map[string][]byte{"en.json": []byte(`{"summary":"en-detail"}`)},
			wantBody:   `{"summary":"en-detail"}`,
			wantKey:    "en.json",
			wantStatus: http.StatusOK,
		},
		{
			name:       "default locale returns not found when en detail is unavailable",
			url:        "/v1/stocks/TSM",
			row:        turso_models.PublishedStockDetail{Ticker: "TSM", SummaryJson: `{"summary":"en-summary"}`},
			dataByKey:  map[string][]byte{},
			wantBody:   `{"error":"stock detail not found"}`,
			wantKey:    "",
			wantStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler := &DetailHandler{
				queries:  &fakeDetailQueries{row: tt.row},
				r2Client: &fakeDetailStorage{dataByKey: tt.dataByKey},
				logger:   zap.NewNop(),
			}

			req := httptest.NewRequest(http.MethodGet, tt.url, nil)
			rec := httptest.NewRecorder()

			handler.Handle(rec, req)

			if rec.Code != tt.wantStatus {
				t.Fatalf("expected status %d, got %d body=%s", tt.wantStatus, rec.Code, rec.Body.String())
			}

			if compactJSON(t, rec.Body.String()) != compactJSON(t, tt.wantBody) {
				t.Fatalf("expected body %s, got %s", tt.wantBody, rec.Body.String())
			}

			storage := handler.r2Client.(*fakeDetailStorage)
			if storage.lastKey != tt.wantKey {
				t.Fatalf("expected download key %q, got %q", tt.wantKey, storage.lastKey)
			}
		})
	}
}

func TestDetailHandlerNotFound(t *testing.T) {
	handler := &DetailHandler{
		queries:  &fakeDetailQueries{err: sql.ErrNoRows},
		r2Client: &fakeDetailStorage{dataByKey: map[string][]byte{}},
		logger:   zap.NewNop(),
	}

	req := httptest.NewRequest(http.MethodGet, "/v1/stocks/TSM", nil)
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", rec.Code)
	}
}

func compactJSON(t *testing.T, raw string) string {
	t.Helper()
	var v any
	if err := json.Unmarshal([]byte(raw), &v); err != nil {
		t.Fatalf("unmarshal json: %v", err)
	}
	data, err := json.Marshal(v)
	if err != nil {
		t.Fatalf("marshal json: %v", err)
	}
	return string(data)
}
