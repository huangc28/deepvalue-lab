package stocks

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type DetailHandler struct {
	queries *turso_models.Queries
	logger  *zap.Logger
}

func NewDetailHandler(queries *turso_models.Queries, logger *zap.Logger) *DetailHandler {
	return &DetailHandler{queries: queries, logger: logger}
}

func (h *DetailHandler) RegisterRoute(r *chi.Mux) {
	r.Get("/v1/stocks/{ticker}", h.Handle)
}

func (h *DetailHandler) Handle(w http.ResponseWriter, r *http.Request) {
	ticker := strings.ToUpper(chi.URLParam(r, "ticker"))

	row, err := h.queries.GetPublishedStockDetail(r.Context(), ticker)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			render.ChiErr(w, r, http.StatusNotFound, errors.New("not found"))
			return
		}
		h.logger.Error("get published stock detail", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	render.ChiJSON(w, r, http.StatusOK, json.RawMessage(row.StockDetail))
}
