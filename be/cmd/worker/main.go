package main

import (
	"context"

	"go.uber.org/fx"
	"go.uber.org/zap"

	"github.com/huangchihan/deepvalue-lab-be/config"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/stocks"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	"github.com/huangchihan/deepvalue-lab-be/lib/logs"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/massive"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/rabbitmq"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/sqlite"
)

func main() {
	fx.New(
		fx.Provide(
			config.NewViper,
			config.NewConfig,
			logs.NewLogger,
			sqlite.NewClient,
			provideTursoQueries,
		),
		r2.Module,
		massive.Module,
		rabbitmq.Module,
		fx.Invoke(runWorker),
	).Run()
}

func provideTursoQueries(client *sqlite.Client) *turso_models.Queries {
	return turso_models.New(client.DB)
}

func runWorker(
	lc fx.Lifecycle,
	massiveClient *massive.Client,
	consumer *rabbitmq.Consumer,
	queries *turso_models.Queries,
	r2Client *r2.Client,
	logger *zap.Logger,
) {
	worker := stocks.NewTechnicalSnapshotWorker(massiveClient, consumer, queries, r2Client, logger)

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			go func() {
				if err := worker.Start(context.Background()); err != nil {
					logger.Error("technical snapshot worker stopped", zap.Error(err))
				}
			}()
			return nil
		},
	})
}
