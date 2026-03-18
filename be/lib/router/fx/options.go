package fx

import (
	"go.uber.org/fx"

	"github.com/huangchihan/deepvalue-lab-be/lib/router"
)

var CoreRouterOptions = fx.Options(
	fx.Provide(router.NewMux),
)
