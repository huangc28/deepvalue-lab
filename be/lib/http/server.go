package http

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"go.uber.org/fx"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

func NewServer(lc fx.Lifecycle, cfg *config.Config, mux *chi.Mux, logger *zap.Logger) *http.Server {
	server := &http.Server{
		Addr:              ":" + strconv.Itoa(cfg.AppPort),
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go func() {
				logger.Info("starting http server", zap.Int("port", cfg.AppPort), zap.String("env", cfg.AppEnv))
				if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
					logger.Fatal("http server failed", zap.Error(err))
				}
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			logger.Info("shutting down http server")
			return server.Shutdown(ctx)
		},
	})

	return server
}

var Module = fx.Provide(NewServer)
