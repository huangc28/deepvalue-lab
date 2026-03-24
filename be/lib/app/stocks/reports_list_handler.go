package stocks

import (
	"context"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type ReportsListHandler struct {
	queries reportsListQueries
	logger  *zap.Logger
}

func NewReportsListHandler(queries *turso_models.Queries, logger *zap.Logger) *ReportsListHandler {
	return &ReportsListHandler{queries: queries, logger: logger}
}

type reportsListQueries interface {
	ListStockReportsByTicker(ctx context.Context, ticker string) ([]turso_models.StockReport, error)
}

func (h *ReportsListHandler) RegisterRoute(r *chi.Mux) {
	r.Get("/v1/stocks/{ticker}/reports", h.Handle)
}

func (h *ReportsListHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))
	useZhTW := isZhTWLocale(r)

	rows, err := h.queries.ListStockReportsByTicker(r.Context(), ticker)
	if err != nil {
		h.logger.Error("list stock reports", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	reports := make([]historicalReportSummaryResponse, 0, len(rows))
	for i, row := range rows {
		report, buildErr := buildHistoricalReportSummary(row, useZhTW, i == 0)
		if buildErr != nil {
			h.logger.Error("build historical report summary", zap.String("ticker", ticker), zap.String("report_id", row.ID), zap.Error(buildErr))
			render.ChiErr(w, r, http.StatusInternalServerError, buildErr)
			return
		}
		reports = append(reports, report)
	}

	render.ChiJSON(w, r, http.StatusOK, map[string]any{"reports": reports})
}
