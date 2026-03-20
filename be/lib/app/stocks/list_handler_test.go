package stocks

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
)

type fakeListQueries struct {
	rows []turso_models.PublishedStockDetail
	err  error
}

func (f *fakeListQueries) ListPublishedStockDetails(_ context.Context) ([]turso_models.PublishedStockDetail, error) {
	return f.rows, f.err
}

func TestListHandlerLocaleSelection(t *testing.T) {
	rows := []turso_models.PublishedStockDetail{
		{Ticker: "TSM", SummaryJson: `{"ticker":"TSM","summary":"en-1"}`, SummaryJsonZhTw: `{"ticker":"TSM","summary":"zh-1"}`},
		{Ticker: "AMD", SummaryJson: `{"ticker":"AMD","summary":"en-2"}`, SummaryJsonZhTw: `{}`},
	}

	tests := []struct {
		name      string
		url       string
		wantStock []string
	}{
		{
			name:      "locale=zh-TW returns zh-TW summary when available",
			url:       "/v1/stocks?locale=zh-TW",
			wantStock: []string{`{"ticker":"TSM","summary":"zh-1"}`, `{"ticker":"AMD","summary":"en-2"}`},
		},
		{
			name:      "default locale returns en summaries",
			url:       "/v1/stocks",
			wantStock: []string{`{"ticker":"TSM","summary":"en-1"}`, `{"ticker":"AMD","summary":"en-2"}`},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler := &ListHandler{
				queries: &fakeListQueries{rows: rows},
				logger:  zap.NewNop(),
			}

			req := httptest.NewRequest(http.MethodGet, tt.url, nil)
			rec := httptest.NewRecorder()

			handler.Handle(rec, req)

			if rec.Code != http.StatusOK {
				t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
			}

			var resp struct {
				Stocks []json.RawMessage `json:"stocks"`
			}
			if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
				t.Fatalf("decode response: %v", err)
			}
			if len(resp.Stocks) != len(tt.wantStock) {
				t.Fatalf("expected %d stocks, got %d", len(tt.wantStock), len(resp.Stocks))
			}
			for i := range tt.wantStock {
				if compactJSON(t, string(resp.Stocks[i])) != compactJSON(t, tt.wantStock[i]) {
					t.Fatalf("stock %d: expected %s, got %s", i, tt.wantStock[i], string(resp.Stocks[i]))
				}
			}
		})
	}
}
