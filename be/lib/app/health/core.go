package health

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/render"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/sqlite"
)

type Handler struct {
	sqlite *sqlite.Client
	r2     *r2.Client
}

func NewHandler(sq *sqlite.Client, r2c *r2.Client) *Handler {
	return &Handler{sqlite: sq, r2: r2c}
}

func (h *Handler) RegisterRoute(r *chi.Mux) {
	r.Get("/", h.Handle)
	r.Get("/health", h.Health)
}

func (h *Handler) Handle(w http.ResponseWriter, r *http.Request) {
	render.ChiJSON(w, r, http.StatusOK, map[string]any{
		"ok": true,
	})
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	allOK := true
	services := map[string]any{}

	if err := h.sqlite.Ping(ctx); err != nil {
		allOK = false
		services["turso_sqlite"] = map[string]any{"status": "error", "message": err.Error()}
	} else {
		services["turso_sqlite"] = map[string]any{"status": "ok"}
	}

	if err := h.r2.Ping(ctx); err != nil {
		allOK = false
		services["r2"] = map[string]any{"status": "error", "message": err.Error()}
	} else {
		services["r2"] = map[string]any{"status": "ok"}
	}

	status := http.StatusOK
	if !allOK {
		status = http.StatusServiceUnavailable
	}

	render.ChiJSON(w, r, status, map[string]any{
		"ok":       allOK,
		"services": services,
	})
}
