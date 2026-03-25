package stocks

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
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

type UpsertTechnicalSnapshotHandler struct {
	queries  upsertTechnicalSnapshotQueries
	r2Client publishStorage
	logger   *zap.Logger
}

func NewUpsertTechnicalSnapshotHandler(queries *turso_models.Queries, r2Client *r2.Client, logger *zap.Logger) *UpsertTechnicalSnapshotHandler {
	return &UpsertTechnicalSnapshotHandler{queries: queries, r2Client: r2Client, logger: logger}
}

type upsertTechnicalSnapshotQueries interface {
	GetStockReportByTickerAndID(ctx context.Context, arg turso_models.GetStockReportByTickerAndIDParams) (turso_models.StockReport, error)
	UpsertTechnicalSnapshot(ctx context.Context, arg turso_models.UpsertTechnicalSnapshotParams) error
}

type upsertTechnicalSnapshotRequest struct {
	Status       string          `json:"status"`
	Source       string          `json:"source"`
	Provider     string          `json:"provider"`
	ErrorMessage string          `json:"errorMessage"`
	Snapshot     json.RawMessage `json:"snapshot"`
	SnapshotZhTW json.RawMessage `json:"snapshotZhTW"`
}

func (h *UpsertTechnicalSnapshotHandler) RegisterRoute(r *chi.Mux) {
	r.Post("/v1/stocks/{ticker}/reports/{reportId}/technical-snapshot", h.Handle)
}

func (h *UpsertTechnicalSnapshotHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))
	reportID := chi.URLParam(r, "reportId")

	var req upsertTechnicalSnapshotRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		render.ChiErr(w, r, http.StatusBadRequest, fmt.Errorf("invalid request body: %w", err))
		return
	}

	if !isValidTechnicalSnapshotState(req.Status) {
		render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("status must be one of pending, ready, failed"))
		return
	}
	if req.Status == "ready" && !hasJSONPayload(req.Snapshot) {
		render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("snapshot is required when status=ready"))
		return
	}

	report, err := h.queries.GetStockReportByTickerAndID(
		r.Context(),
		turso_models.GetStockReportByTickerAndIDParams{
			Ticker: ticker,
			ID:     reportID,
		},
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			render.ChiErr(w, r, http.StatusNotFound, errors.New("not found"))
			return
		}
		h.logger.Error("get stock report for technical snapshot upsert", zap.String("ticker", ticker), zap.String("report_id", reportID), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	dateStr := time.UnixMilli(report.PublishedAtMs).UTC().Format("20060102")
	r2SnapshotKey := ""
	r2SnapshotZhTWKey := ""

	if req.Status == "ready" {
		r2SnapshotKey = r2.TechnicalSnapshotKey(ticker, dateStr, reportID)
		if err := h.r2Client.UploadJSON(r.Context(), r2SnapshotKey, req.Snapshot); err != nil {
			h.logger.Error("upload technical snapshot json to r2", zap.String("key", r2SnapshotKey), zap.Error(err))
			render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to upload technical snapshot artifact"))
			return
		}

		if hasJSONPayload(req.SnapshotZhTW) {
			r2SnapshotZhTWKey = r2.TechnicalSnapshotKeyZhTW(ticker, dateStr, reportID)
			if err := h.r2Client.UploadJSON(r.Context(), r2SnapshotZhTWKey, req.SnapshotZhTW); err != nil {
				h.logger.Error("upload zh-TW technical snapshot json to r2", zap.String("key", r2SnapshotZhTWKey), zap.Error(err))
				render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to upload zh-TW technical snapshot artifact"))
				return
			}
		}
	}

	if err := h.queries.UpsertTechnicalSnapshot(r.Context(), turso_models.UpsertTechnicalSnapshotParams{
		Ticker:            ticker,
		ReportID:          reportID,
		Status:            req.Status,
		Source:            req.Source,
		Provider:          req.Provider,
		R2SnapshotKey:     r2SnapshotKey,
		R2SnapshotZhTwKey: r2SnapshotZhTWKey,
		ErrorMessage:      req.ErrorMessage,
		PublishedAtMs:     report.PublishedAtMs,
	}); err != nil {
		h.logger.Error("upsert technical snapshot", zap.String("ticker", ticker), zap.String("report_id", reportID), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	render.ChiJSON(w, r, http.StatusCreated, map[string]any{
		"ticker":            ticker,
		"reportId":          reportID,
		"status":            req.Status,
		"source":            req.Source,
		"provider":          req.Provider,
		"r2SnapshotKey":     r2SnapshotKey,
		"r2SnapshotZhTWKey": r2SnapshotZhTWKey,
	})
}

func isValidTechnicalSnapshotState(value string) bool {
	switch value {
	case "pending", "ready", "failed":
		return true
	default:
		return false
	}
}
