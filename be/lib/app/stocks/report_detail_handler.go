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

type ReportDetailHandler struct {
	queries  reportDetailQueries
	r2Client detailStorage
	logger   *zap.Logger
}

func NewReportDetailHandler(queries *turso_models.Queries, r2Client *r2.Client, logger *zap.Logger) *ReportDetailHandler {
	return &ReportDetailHandler{queries: queries, r2Client: r2Client, logger: logger}
}

type reportDetailQueries interface {
	GetStockReportByTickerAndID(ctx context.Context, arg turso_models.GetStockReportByTickerAndIDParams) (turso_models.StockReport, error)
}

func (h *ReportDetailHandler) RegisterRoute(r *chi.Mux) {
	r.Get("/v1/stocks/{ticker}/reports/{reportId}", h.Handle)
}

func (h *ReportDetailHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))
	reportID := chi.URLParam(r, "reportId")

	row, err := h.queries.GetStockReportByTickerAndID(r.Context(), turso_models.GetStockReportByTickerAndIDParams{
		Ticker: ticker,
		ID:     reportID,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			render.ChiErr(w, r, http.StatusNotFound, errors.New("not found"))
			return
		}
		h.logger.Error("get stock report detail", zap.String("ticker", ticker), zap.String("report_id", reportID), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	key := row.R2DetailKey
	if isZhTWLocale(r) && row.R2DetailZhTwKey != "" {
		key = row.R2DetailZhTwKey
	}

	if key == "" {
		render.ChiErr(w, r, http.StatusNotFound, errors.New("stock report detail not found"))
		return
	}

	data, err := h.r2Client.Download(r.Context(), key)
	if err != nil {
		h.logger.Error("download stock report detail from r2",
			zap.String("ticker", ticker),
			zap.String("report_id", reportID),
			zap.String("key", key),
			zap.Error(err),
		)
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to fetch stock report detail"))
		return
	}

	render.ChiJSON(w, r, http.StatusOK, json.RawMessage(data))
}
