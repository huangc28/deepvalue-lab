package stocks

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type ListHandler struct {
	queries *turso_models.Queries
	logger  *zap.Logger
}

func NewListHandler(queries *turso_models.Queries, logger *zap.Logger) *ListHandler {
	return &ListHandler{queries: queries, logger: logger}
}

func (h *ListHandler) RegisterRoute(r *chi.Mux) {
	r.Get("/v1/stocks", h.Handle)
}

func (h *ListHandler) Handle(w http.ResponseWriter, r *http.Request) {
	rows, err := h.queries.ListPublishedStockDetails(r.Context())
	if err != nil {
		h.logger.Error("list published stock details", zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	stocks := make([]json.RawMessage, 0, len(rows))
	for _, row := range rows {
		stocks = append(stocks, json.RawMessage(row.SummaryJson))
	}

	render.ChiJSON(w, r, http.StatusOK, map[string]any{"stocks": stocks})
}
