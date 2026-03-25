package stocks

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type TechnicalSnapshotHandler struct {
	queries  technicalSnapshotQueries
	r2Client detailStorage
	logger   *zap.Logger
}

func NewTechnicalSnapshotHandler(queries *turso_models.Queries, r2Client *r2.Client, logger *zap.Logger) *TechnicalSnapshotHandler {
	return &TechnicalSnapshotHandler{queries: queries, r2Client: r2Client, logger: logger}
}

type technicalSnapshotQueries interface {
	GetTechnicalSnapshotByTickerAndReportID(ctx context.Context, arg turso_models.GetTechnicalSnapshotByTickerAndReportIDParams) (turso_models.TechnicalSnapshot, error)
}

type technicalSnapshotResponse struct {
	Ticker            string          `json:"ticker"`
	ReportID          string          `json:"reportId"`
	Status            string          `json:"status"`
	Source            string          `json:"source,omitempty"`
	Provider          string          `json:"provider,omitempty"`
	UpdatedAtMs       int64           `json:"updatedAtMs"`
	LocaleHasFallback bool            `json:"localeHasFallback,omitempty"`
	Error             string          `json:"error,omitempty"`
	Snapshot          json.RawMessage `json:"snapshot,omitempty"`
}

func (h *TechnicalSnapshotHandler) RegisterRoute(r *chi.Mux) {
	r.Get("/v1/stocks/{ticker}/reports/{reportId}/technical-snapshot", h.Handle)
}

func (h *TechnicalSnapshotHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))
	reportID := chi.URLParam(r, "reportId")

	row, err := h.queries.GetTechnicalSnapshotByTickerAndReportID(
		r.Context(),
		turso_models.GetTechnicalSnapshotByTickerAndReportIDParams{
			Ticker:   ticker,
			ReportID: reportID,
		},
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			render.ChiErr(w, r, http.StatusNotFound, errors.New("not found"))
			return
		}
		h.logger.Error("get technical snapshot", zap.String("ticker", ticker), zap.String("report_id", reportID), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	resp := technicalSnapshotResponse{
		Ticker:      row.Ticker,
		ReportID:    row.ReportID,
		Status:      row.Status,
		Source:      row.Source,
		Provider:    row.Provider,
		UpdatedAtMs: row.UpdatedAtMs,
	}

	if row.Status == "failed" && strings.TrimSpace(row.ErrorMessage) != "" {
		resp.Error = row.ErrorMessage
	}

	if row.Status != "ready" {
		render.ChiJSON(w, r, http.StatusOK, resp)
		return
	}

	key, localeHasFallback := resolveTechnicalSnapshotKey(r, row)
	resp.LocaleHasFallback = localeHasFallback
	if key == "" {
		render.ChiJSON(w, r, http.StatusOK, resp)
		return
	}

	data, err := h.r2Client.Download(r.Context(), key)
	if err != nil {
		h.logger.Error("download technical snapshot from r2",
			zap.String("ticker", ticker),
			zap.String("report_id", reportID),
			zap.String("key", key),
			zap.Error(err),
		)
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to fetch technical snapshot"))
		return
	}

	resp.Snapshot = json.RawMessage(data)
	render.ChiJSON(w, r, http.StatusOK, resp)
}

func resolveTechnicalSnapshotKey(r *http.Request, row turso_models.TechnicalSnapshot) (string, bool) {
	if isZhTWLocale(r) {
		if row.R2SnapshotZhTwKey != "" {
			return row.R2SnapshotZhTwKey, false
		}
		if row.R2SnapshotKey != "" {
			return row.R2SnapshotKey, true
		}
		return "", false
	}

	return row.R2SnapshotKey, false
}
