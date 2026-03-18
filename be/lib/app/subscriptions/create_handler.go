package subscriptions

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
)

type CreateHandler struct {
	queries *turso_models.Queries
	logger  *zap.Logger
}

func NewCreateHandler(queries *turso_models.Queries, logger *zap.Logger) *CreateHandler {
	return &CreateHandler{queries: queries, logger: logger}
}

func (h *CreateHandler) RegisterRoute(r *chi.Mux) {
	r.Post("/v1/subscriptions", h.Handle)
}

type createRequest struct {
	Ticker string `json:"ticker"`
}

func (h *CreateHandler) Handle(w http.ResponseWriter, r *http.Request) {
	var req createRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		render.ChiErr(w, r, http.StatusBadRequest, fmt.Errorf("invalid request body: %w", err))
		return
	}

	ticker := strings.ToUpper(strings.TrimSpace(req.Ticker))
	if ticker == "" {
		render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("ticker is required"))
		return
	}

	existing, _ := h.queries.GetSubscription(r.Context(), ticker)

	if err := h.queries.UpsertSubscription(r.Context(), turso_models.UpsertSubscriptionParams{
		Ticker: ticker,
		Status: "active",
	}); err != nil {
		h.logger.Error("upsert subscription", zap.String("ticker", ticker), zap.Error(err))
		render.ChiErr(w, r, http.StatusInternalServerError, err)
		return
	}

	status := http.StatusCreated
	if existing.Ticker == ticker {
		status = http.StatusOK
	}

	render.ChiJSON(w, r, status, map[string]any{
		"ticker": ticker,
		"status": "active",
	})
}
