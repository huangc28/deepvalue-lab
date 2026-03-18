package fx

import (
	"go.uber.org/fx"

	"github.com/huangchihan/deepvalue-lab-be/cache"
	"github.com/huangchihan/deepvalue-lab-be/config"
	"github.com/huangchihan/deepvalue-lab-be/db"
	"github.com/huangchihan/deepvalue-lab-be/lib/logs"
)

var CoreAppOptions = fx.Options(
	fx.Provide(
		config.NewViper,
		config.NewConfig,
		logs.NewLogger,
		db.NewSQLXPostgresDB,
		cache.NewRedis,
	),
)
