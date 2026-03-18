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
	reportID := fmt.Sprintf("%s-%s-%s", ticker, now.Format("20060102"), shortID())
	r2Key := r2.ReportKey(ticker, now.Format("20060102"), reportID)
	publishedAtMs := now.UnixMilli()

	if err := h.r2Client.UploadMarkdown(r.Context(), r2Key, req.Report.Markdown); err != nil {
		h.logger.Error("upload markdown to r2", zap.String("key", r2Key), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to upload report artifact"))
		return
	}

	if err := h.queries.InsertStockReport(r.Context(), turso_models.InsertStockReportParams{
		ID:            reportID,
		Ticker:        ticker,
		R2Key:         r2Key,
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
		StockDetail:   string(req.StockDetail),
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
		"r2Key":         r2Key,
		"ticker":        ticker,
		"publishedAtMs": publishedAtMs,
	})
}

func shortID() string {
	b := make([]byte, 4)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}
