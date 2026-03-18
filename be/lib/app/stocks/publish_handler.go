package stocks

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type PublishHandler struct {
	queries  *turso_models.Queries
	r2Client *r2.Client
	logger   *zap.Logger
}

func NewPublishHandler(queries *turso_models.Queries, r2Client *r2.Client, logger *zap.Logger) *PublishHandler {
	return &PublishHandler{queries: queries, r2Client: r2Client, logger: logger}
}

func (h *PublishHandler) RegisterRoute(r *chi.Mux) {
	r.Post("/v1/stocks/{ticker}/reports", h.Handle)
}

type publishRequest struct {
	Report      reportInput     `json:"report"`
	StockDetail json.RawMessage `json:"stockDetail"`
}

type reportInput struct {
	Markdown   string `json:"markdown"`
	Provenance string `json:"provenance"`
}

// minStockDetail contains only the fields we validate are present.
type minStockDetail struct {
	Ticker       string  `json:"ticker"`
	CompanyName  string  `json:"companyName"`
	CurrentPrice float64 `json:"currentPrice"`
	BaseFairValue float64 `json:"baseFairValue"`
	BearFairValue float64 `json:"bearFairValue"`
	BullFairValue float64 `json:"bullFairValue"`
}

// summaryFields mirrors StockSummary from the frontend type system.
// LocalizedText fields use json.RawMessage to pass through without interpretation.
type summaryFields struct {
	ID                   string          `json:"id"`
	Ticker               string          `json:"ticker"`
	CompanyName          string          `json:"companyName"`
	BusinessType         json.RawMessage `json:"businessType"`
	CurrentPrice         float64         `json:"currentPrice"`
	ValuationStatus      string          `json:"valuationStatus"`
	NewsImpactStatus     string          `json:"newsImpactStatus"`
	ThesisStatus         string          `json:"thesisStatus"`
	TechnicalEntryStatus string          `json:"technicalEntryStatus"`
	ActionState          string          `json:"actionState"`
	DashboardBucket      string          `json:"dashboardBucket"`
	BaseFairValue        float64         `json:"baseFairValue"`
	BearFairValue        float64         `json:"bearFairValue"`
	BullFairValue        float64         `json:"bullFairValue"`
	DiscountToBase       float64         `json:"discountToBase"`
	Summary              json.RawMessage `json:"summary"`
	LastUpdated          string          `json:"lastUpdated"`
}

func (h *PublishHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))

	var req publishRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		render.ChiErr(w, r, http.StatusBadRequest, fmt.Errorf("invalid request body: %w", err))
		return
	}

	if strings.TrimSpace(req.Report.Markdown) == "" {
		render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("report.markdown is required"))
		return
	}

	var detail minStockDetail
	if err := json.Unmarshal(req.StockDetail, &detail); err != nil {
		render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("stockDetail is invalid JSON: %w", err))
		return
	}
	if detail.Ticker == "" || detail.CompanyName == "" || detail.CurrentPrice == 0 {
		render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("stockDetail missing required fields: ticker, companyName, currentPrice"))
		return
	}

	now := time.Now().UTC()
	dateStr := now.Format("20060102")
	reportID := fmt.Sprintf("%s-%s-%s", ticker, dateStr, shortID())
	r2ReportKey := r2.ReportKey(ticker, dateStr, reportID)
	r2DetailKey := r2.DetailKey(ticker, dateStr, reportID)
	publishedAtMs := now.UnixMilli()

	// Upload markdown report to R2.
	if err := h.r2Client.UploadMarkdown(r.Context(), r2ReportKey, req.Report.Markdown); err != nil {
		h.logger.Error("upload markdown to r2", zap.String("key", r2ReportKey), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to upload report artifact"))
		return
	}

	// Upload full StockDetail JSON to R2.
	if err := h.r2Client.UploadJSON(r.Context(), r2DetailKey, req.StockDetail); err != nil {
		h.logger.Error("upload detail json to r2", zap.String("key", r2DetailKey), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to upload detail artifact"))
		return
	}

	// Extract summary fields for Turso.
	var sf summaryFields
	if err := json.Unmarshal(req.StockDetail, &sf); err != nil {
		h.logger.Error("extract summary fields", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to extract summary"))
		return
	}
	summaryJSON, err := json.Marshal(sf)
	if err != nil {
		h.logger.Error("marshal summary", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to marshal summary"))
		return
	}

	if err := h.queries.InsertStockReport(r.Context(), turso_models.InsertStockReportParams{
		ID:            reportID,
		Ticker:        ticker,
		R2Key:         r2ReportKey,
		Provenance:    req.Report.Provenance,
		PublishedAtMs: publishedAtMs,
	}); err != nil {
		h.logger.Error("insert stock report", zap.String("id", reportID), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	if err := h.queries.UpsertPublishedStockDetail(r.Context(), turso_models.UpsertPublishedStockDetailParams{
		Ticker:        ticker,
		ReportID:      reportID,
		R2ReportKey:   r2ReportKey,
		R2DetailKey:   r2DetailKey,
		SummaryJson:   string(summaryJSON),
		PublishedAtMs: publishedAtMs,
	}); err != nil {
		h.logger.Error("upsert published stock detail", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	if err := h.queries.UpsertSubscription(r.Context(), turso_models.UpsertSubscriptionParams{
		Ticker: ticker,
		Status: "active",
	}); err != nil {
		h.logger.Error("upsert subscription", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	render.ChiJSON(w, r, http.StatusCreated, map[string]any{
		"reportId":      reportID,
		"r2ReportKey":   r2ReportKey,
		"r2DetailKey":   r2DetailKey,
		"ticker":        ticker,
		"publishedAtMs": publishedAtMs,
	})
}

func shortID() string {
	b := make([]byte, 4)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}
