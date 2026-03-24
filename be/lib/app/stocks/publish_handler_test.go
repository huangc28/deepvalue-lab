package stocks

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
)

type fakePublishQueries struct {
	insertStockReportCalls          []turso_models.InsertStockReportParams
	upsertPublishedStockDetailCalls []turso_models.UpsertPublishedStockDetailParams
	upsertSubscriptionCalls         []turso_models.UpsertSubscriptionParams
}

func (f *fakePublishQueries) InsertStockReport(_ context.Context, arg turso_models.InsertStockReportParams) error {
	f.insertStockReportCalls = append(f.insertStockReportCalls, arg)
	return nil
}

func (f *fakePublishQueries) UpsertPublishedStockDetail(_ context.Context, arg turso_models.UpsertPublishedStockDetailParams) error {
	f.upsertPublishedStockDetailCalls = append(f.upsertPublishedStockDetailCalls, arg)
	return nil
}

func (f *fakePublishQueries) UpsertSubscription(_ context.Context, arg turso_models.UpsertSubscriptionParams) error {
	f.upsertSubscriptionCalls = append(f.upsertSubscriptionCalls, arg)
	return nil
}

type fakePublishStorage struct {
	markdownUploads map[string]string
	jsonUploads     map[string][]byte
}

func newFakePublishStorage() *fakePublishStorage {
	return &fakePublishStorage{
		markdownUploads: make(map[string]string),
		jsonUploads:     make(map[string][]byte),
	}
}

func (f *fakePublishStorage) UploadMarkdown(_ context.Context, key, content string) error {
	f.markdownUploads[key] = content
	return nil
}

func (f *fakePublishStorage) UploadJSON(_ context.Context, key string, data []byte) error {
	f.jsonUploads[key] = append([]byte(nil), data...)
	return nil
}

func TestPublishHandler_ENOnlyKeepsZhTWDefaults(t *testing.T) {
	queries := &fakePublishQueries{}
	storage := newFakePublishStorage()
	handler := &PublishHandler{
		queries:  queries,
		r2Client: storage,
		logger:   zap.NewNop(),
	}

	body := map[string]any{
		"report": map[string]any{
			"markdown":   "# report",
			"provenance": "unit-test",
		},
		"stockDetail": sampleStockDetail("AMD", "Advanced Micro Devices", "Chip designer"),
	}

	req := httptest.NewRequest(http.MethodPost, "/v1/stocks/amd/reports", mustJSONBody(t, body))
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", rec.Code, rec.Body.String())
	}
	if len(queries.upsertPublishedStockDetailCalls) != 1 {
		t.Fatalf("expected 1 upsert call, got %d", len(queries.upsertPublishedStockDetailCalls))
	}
	if len(queries.insertStockReportCalls) != 1 {
		t.Fatalf("expected 1 insert call, got %d", len(queries.insertStockReportCalls))
	}

	insertArg := queries.insertStockReportCalls[0]
	if insertArg.R2DetailKey == "" {
		t.Fatal("expected en detail key to be set on stock_reports insert")
	}
	if insertArg.R2DetailZhTwKey != "" {
		t.Fatalf("expected empty zh-TW detail key, got %q", insertArg.R2DetailZhTwKey)
	}
	if insertArg.SummaryJson == "{}" {
		t.Fatal("expected summary json to be populated on stock_reports insert")
	}
	if insertArg.SummaryJsonZhTw != "{}" {
		t.Fatalf("expected default zh-TW summary json, got %q", insertArg.SummaryJsonZhTw)
	}

	var resp struct {
		R2DetailZhTWKey string `json:"r2DetailZhTWKey"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if resp.R2DetailZhTWKey != "" {
		t.Fatalf("expected empty response zh-TW detail key, got %q", resp.R2DetailZhTWKey)
	}
}

func TestPublishHandler_BilingualRequestPersistsZhTWArtifact(t *testing.T) {
	queries := &fakePublishQueries{}
	storage := newFakePublishStorage()
	handler := &PublishHandler{
		queries:  queries,
		r2Client: storage,
		logger:   zap.NewNop(),
	}

	body := map[string]any{
		"report": map[string]any{
			"markdown":   "# report",
			"provenance": "unit-test",
		},
		"stockDetail":     sampleStockDetail("TSM", "Taiwan Semiconductor", "Foundry"),
		"stockDetailZhTW": sampleStockDetail("TSM", "台積電", "晶圓代工"),
	}

	req := httptest.NewRequest(http.MethodPost, "/v1/stocks/tsm/reports", mustJSONBody(t, body))
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", rec.Code, rec.Body.String())
	}
	if len(queries.upsertPublishedStockDetailCalls) != 1 {
		t.Fatalf("expected 1 upsert call, got %d", len(queries.upsertPublishedStockDetailCalls))
	}
	if len(queries.insertStockReportCalls) != 1 {
		t.Fatalf("expected 1 insert call, got %d", len(queries.insertStockReportCalls))
	}

	insertArg := queries.insertStockReportCalls[0]
	if insertArg.R2DetailKey == "" {
		t.Fatal("expected en detail key to be set")
	}
	if insertArg.R2DetailZhTwKey == "" {
		t.Fatal("expected zh-TW detail key to be set")
	}
	if insertArg.SummaryJson == "{}" {
		t.Fatal("expected en summary json to be populated")
	}
	if insertArg.SummaryJsonZhTw == "{}" {
		t.Fatal("expected zh-TW summary json to be populated")
	}
	if len(storage.jsonUploads) != 2 {
		t.Fatalf("expected 2 json uploads, got %d", len(storage.jsonUploads))
	}

	var resp struct {
		R2DetailZhTWKey string `json:"r2DetailZhTWKey"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if resp.R2DetailZhTWKey == "" {
		t.Fatal("expected response zh-TW detail key")
	}
}

func TestPublishHandler_InvalidStockDetailZhTWReturns422(t *testing.T) {
	queries := &fakePublishQueries{}
	storage := newFakePublishStorage()
	handler := &PublishHandler{
		queries:  queries,
		r2Client: storage,
		logger:   zap.NewNop(),
	}

	reqBody := []byte(`{"report":{"markdown":"# report","provenance":"unit-test"},"stockDetail":{"id":"amd","ticker":"AMD","companyName":"AMD","businessType":"Chip designer","currentPrice":100,"baseFairValue":120,"bearFairValue":80,"bullFairValue":150,"summary":"Strong outlook"},"stockDetailZhTW":"bad"}`)
	req := httptest.NewRequest(http.MethodPost, "/v1/stocks/amd/reports", bytes.NewReader(reqBody))
	rec := httptest.NewRecorder()

	handler.Handle(rec, req)

	if rec.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422, got %d body=%s", rec.Code, rec.Body.String())
	}
	if len(queries.insertStockReportCalls) != 0 {
		t.Fatalf("expected no report insert, got %d insert calls", len(queries.insertStockReportCalls))
	}
	if len(queries.upsertPublishedStockDetailCalls) != 0 {
		t.Fatalf("expected no persistence, got %d upsert calls", len(queries.upsertPublishedStockDetailCalls))
	}
}

func mustJSONBody(t *testing.T, v any) *bytes.Reader {
	t.Helper()
	data, err := json.Marshal(v)
	if err != nil {
		t.Fatalf("marshal body: %v", err)
	}
	return bytes.NewReader(data)
}

func sampleStockDetail(ticker, companyName, businessType string) map[string]any {
	return map[string]any{
		"id":                   strings.ToLower(ticker),
		"ticker":               ticker,
		"companyName":          companyName,
		"businessType":         businessType,
		"currentPrice":         100,
		"valuationStatus":      "fair",
		"newsImpactStatus":     "neutral",
		"thesisStatus":         "intact",
		"technicalEntryStatus": "neutral",
		"actionState":          "watch",
		"dashboardBucket":      "core",
		"baseFairValue":        120,
		"bearFairValue":        80,
		"bullFairValue":        150,
		"discountToBase":       -16.7,
		"summary":              "Structured summary",
		"lastUpdated":          "2026-03-20",
	}
}
