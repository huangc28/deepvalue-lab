package fx

import (
	"go.uber.org/fx"

	"github.com/huangchihan/deepvalue-lab-be/cache"
	"github.com/huangchihan/deepvalue-lab-be/config"
	"github.com/huangchihan/deepvalue-lab-be/db"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/turso_models"
	httpserver "github.com/huangchihan/deepvalue-lab-be/lib/http"
	"github.com/huangchihan/deepvalue-lab-be/lib/logs"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/r2"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/rabbitmq"
	"github.com/huangchihan/deepvalue-lab-be/lib/pkg/sqlite"
)

var CoreAppOptions = fx.Options(
	fx.Provide(
		config.NewViper,
		config.NewConfig,
		logs.NewLogger,
		db.NewSQLXPostgresDB,
		cache.NewRedis,
		sqlite.NewClient,
		provideTursoQueries,
	),
	r2.Module,
	rabbitmq.Module,
	httpserver.Module,
)

func provideTursoQueries(client *sqlite.Client) *turso_models.Queries {
	return turso_models.New(client.DB)
}
