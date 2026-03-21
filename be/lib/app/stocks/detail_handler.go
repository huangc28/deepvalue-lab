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

type DetailHandler struct {
	queries  detailQueries
	r2Client detailStorage
	logger   *zap.Logger
}

func NewDetailHandler(queries *turso_models.Queries, r2Client *r2.Client, logger *zap.Logger) *DetailHandler {
	return &DetailHandler{queries: queries, r2Client: r2Client, logger: logger}
}

type detailQueries interface {
	GetPublishedStockDetail(ctx context.Context, ticker string) (turso_models.PublishedStockDetail, error)
}

type detailStorage interface {
	Download(ctx context.Context, key string) ([]byte, error)
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

	key := row.R2DetailKey
	if isZhTWLocale(r) && row.R2DetailZhTwKey != "" {
		key = row.R2DetailZhTwKey
	}

	if key == "" {
		render.ChiErr(w, r, http.StatusNotFound, errors.New("stock detail not found"))
		return
	}

	h.respondWithR2Detail(w, r, ticker, key)
}

func (h *DetailHandler) respondWithR2Detail(w http.ResponseWriter, r *http.Request, ticker, key string) {
	data, err := h.r2Client.Download(r.Context(), key)
	if err != nil {
		h.logger.Error("download detail from r2",
			zap.String("ticker", ticker),
			zap.String("key", key),
			zap.Error(err),
		)
		render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("failed to fetch stock detail"))
		return
	}

	render.ChiJSON(w, r, http.StatusOK, json.RawMessage(data))
}
