package stocks

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
)

type fakeReportsListQueries struct {
	rows []turso_models.StockReport
	err  error
}

func (f *fakeReportsListQueries) ListStockReportsByTicker(_ context.Context, _ string) ([]turso_models.StockReport, error) {
	return f.rows, f.err
}

func TestReportsListHandlerHistoricalSummaryContract(t *testing.T) {
	rows := []turso_models.StockReport{
		{
			ID:              "TSM-20260324-new",
			Ticker:          "TSM",
			R2Key:           "reports/TSM/20260324/TSM-20260324-new.md",
			R2DetailKey:     "reports/TSM/20260324/TSM-20260324-new.json",
			R2DetailZhTwKey: "reports/TSM/20260324/TSM-20260324-new.zh-TW.json",
			SummaryJson:     sampleSummaryJSON(t, "TSM", "fair", "intact", "neutral", 188.4, 165, 220, 280, "EN latest"),
			SummaryJsonZhTw: sampleSummaryJSON(t, "TSM", "fair", "intact", "neutral", 188.4, 165, 220, 280, map[string]string{"zh-TW": "ZH latest", "en": "EN latest"}),
			Provenance:      "earnings-refresh",
			PublishedAtMs:   200,
		},
		{
			ID:              "TSM-20260320-old",
			Ticker:          "TSM",
			R2Key:           "reports/TSM/20260320/TSM-20260320-old.md",
			R2DetailKey:     "reports/TSM/20260320/TSM-20260320-old.json",
			SummaryJson:     sampleSummaryJSON(t, "TSM", "cheap", "watch", "favorable", 180.2, 150, 210, 270, "EN fallback"),
			SummaryJsonZhTw: "{}",
			Provenance:      "manual",
			PublishedAtMs:   100,
		},
	}

	tests := []struct {
		name               string
		url                string
		wantSummary        []string
		wantLocaleFallback []bool
	}{
		{
			name:               "default locale returns en summaries with no fallback flag",
			url:                "/v1/stocks/TSM/reports",
			wantSummary:        []string{`"EN latest"`, `"EN fallback"`},
			wantLocaleFallback: []bool{false, false},
		},
		{
			name:               "locale=zh-TW uses zh-TW summary when present and falls back for en-only rows",
			url:                "/v1/stocks/TSM/reports?locale=zh-TW",
			wantSummary:        []string{`{"en":"EN latest","zh-TW":"ZH latest"}`, `"EN fallback"`},
			wantLocaleFallback: []bool{false, true},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler := &ReportsListHandler{
				queries: &fakeReportsListQueries{rows: rows},
				logger:  zap.NewNop(),
			}

			req := withURLParams(
				httptest.NewRequest(http.MethodGet, tt.url, nil),
				map[string]string{"ticker": "TSM"},
			)
			rec := httptest.NewRecorder()

			handler.Handle(rec, req)

			if rec.Code != http.StatusOK {
				t.Fatalf("expected 200, got %d body=%s", rec.Code, rec.Body.String())
			}

			if strings.Contains(rec.Body.String(), "r2Key") || strings.Contains(rec.Body.String(), "r2DetailKey") || strings.Contains(rec.Body.String(), "r2DetailZhTwKey") {
				t.Fatalf("response leaked raw storage keys: %s", rec.Body.String())
			}

			var resp struct {
				Reports []struct {
					ReportID             string          `json:"reportId"`
					PublishedAtMs        int64           `json:"publishedAtMs"`
					Provenance           string          `json:"provenance"`
					ValuationStatus      string          `json:"valuationStatus"`
					ThesisStatus         string          `json:"thesisStatus"`
					TechnicalEntryStatus string          `json:"technicalEntryStatus"`
					CurrentPrice         float64         `json:"currentPrice"`
					BearFairValue        float64         `json:"bearFairValue"`
					BaseFairValue        float64         `json:"baseFairValue"`
					BullFairValue        float64         `json:"bullFairValue"`
					Summary              json.RawMessage `json:"summary"`
					LocaleHasFallback    bool            `json:"localeHasFallback"`
					Latest               bool            `json:"latest"`
				} `json:"reports"`
			}
			if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
				t.Fatalf("decode response: %v", err)
			}

			if len(resp.Reports) != 2 {
				t.Fatalf("expected 2 reports, got %d", len(resp.Reports))
			}

			for i, report := range resp.Reports {
				if compactJSON(t, string(report.Summary)) != compactJSON(t, tt.wantSummary[i]) {
					t.Fatalf("report %d summary: expected %s, got %s", i, tt.wantSummary[i], string(report.Summary))
				}
				if report.LocaleHasFallback != tt.wantLocaleFallback[i] {
					t.Fatalf("report %d localeHasFallback: expected %t, got %t", i, tt.wantLocaleFallback[i], report.LocaleHasFallback)
				}
			}

			if !resp.Reports[0].Latest {
				t.Fatal("expected first report to be marked latest")
			}
			if resp.Reports[1].Latest {
				t.Fatal("expected later reports to omit latest flag")
			}
		})
	}
}

func sampleSummaryJSON(
	t *testing.T,
	ticker, valuationStatus, thesisStatus, technicalEntryStatus string,
	currentPrice, bearFairValue, baseFairValue, bullFairValue float64,
	summary any,
) string {
	t.Helper()

	raw, err := json.Marshal(map[string]any{
		"id":                   strings.ToLower(ticker),
		"ticker":               ticker,
		"companyName":          ticker + " Inc.",
		"businessType":         "Semis",
		"currentPrice":         currentPrice,
		"valuationStatus":      valuationStatus,
		"newsImpactStatus":     "unchanged",
		"thesisStatus":         thesisStatus,
		"technicalEntryStatus": technicalEntryStatus,
		"actionState":          "watch for confirmation",
		"dashboardBucket":      "needs-review",
		"baseFairValue":        baseFairValue,
		"bearFairValue":        bearFairValue,
		"bullFairValue":        bullFairValue,
		"discountToBase":       -10.0,
		"summary":              summary,
		"lastUpdated":          "2026-03-24",
	})
	if err != nil {
		t.Fatalf("marshal summary json: %v", err)
	}

	return string(raw)
}

func withURLParams(req *http.Request, params map[string]string) *http.Request {
	rctx := chi.NewRouteContext()
	for key, value := range params {
		rctx.URLParams.Add(key, value)
	}
	return req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
}
