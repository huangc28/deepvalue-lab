package stocks

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type ReportsListHandler struct {
	queries *turso_models.Queries
	logger  *zap.Logger
}

func NewReportsListHandler(queries *turso_models.Queries, logger *zap.Logger) *ReportsListHandler {
	return &ReportsListHandler{queries: queries, logger: logger}
}

func (h *ReportsListHandler) RegisterRoute(r *chi.Mux) {
	r.Get("/v1/stocks/{ticker}/reports", h.Handle)
}

func (h *ReportsListHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))

	rows, err := h.queries.ListStockReportsByTicker(r.Context(), ticker)
	if err != nil {
		h.logger.Error("list stock reports", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	type reportMeta struct {
		ID            string `json:"id"`
		Ticker        string `json:"ticker"`
		R2Key         string `json:"r2Key"`
		Provenance    string `json:"provenance"`
		PublishedAtMs int64  `json:"publishedAtMs"`
	}

	reports := make([]reportMeta, 0, len(rows))
	for _, row := range rows {
		reports = append(reports, reportMeta{
			ID:            row.ID,
			Ticker:        row.Ticker,
			R2Key:         row.R2Key,
			Provenance:    row.Provenance,
			PublishedAtMs: row.PublishedAtMs,
		})
	}

	render.ChiJSON(w, r, http.StatusOK, map[string]any{"reports": reports})
}
