package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"go.uber.org/fx"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/config"
	appfx "github.com/huangchihan/deepvalue-lab-be/lib/app/fx"
	healthapp "github.com/huangchihan/deepvalue-lab-be/lib/app/health"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/stocks"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/subscriptions"
	"github.com/huangchihan/deepvalue-lab-be/lib/router"
	routerfx "github.com/huangchihan/deepvalue-lab-be/lib/router/fx"
)

func main() {
	var (
		cfg    config.Config
		logger *zap.Logger
		mux    *chi.Mux
	)

	app := fx.New(
		appfx.CoreAppOptions,
		routerfx.CoreRouterOptions,
		router.AsRoute(healthapp.NewHandler),
		router.AsRoute(stocks.NewListHandler),
		router.AsRoute(stocks.NewDetailHandler),
		router.AsRoute(stocks.NewReportsListHandler),
		router.AsRoute(stocks.NewPublishHandler),
		router.AsRoute(subscriptions.NewCreateHandler),
		fx.Populate(&cfg, &logger, &mux),
	)

	startCtx, startCancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer startCancel()

	if err := app.Start(startCtx); err != nil {
		log.Fatalf("start fx app: %v", err)
	}
	defer func() {
		stopCtx, stopCancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer stopCancel()
		_ = app.Stop(stopCtx)
	}()

	if logger != nil {
		defer func() {
			_ = logger.Sync()
		}()
	}

	server := &http.Server{
		Addr:              ":" + strconv.Itoa(cfg.AppPort),
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	errCh := make(chan error, 1)
	go func() {
		if logger != nil {
			logger.Info("starting http server", zap.Int("port", cfg.AppPort), zap.String("env", cfg.AppEnv))
		}

		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errCh:
		if logger != nil {
			logger.Fatal("http server failed", zap.Error(err))
		}
		log.Fatalf("http server failed: %v", err)
	case sig := <-sigCh:
		if logger != nil {
			logger.Info("shutting down", zap.String("signal", sig.String()))
		}
	}

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil && logger != nil {
		logger.Warn("http server shutdown returned error", zap.Error(err))
	}
}
