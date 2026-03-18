package main

import (
	"net/http"

	"go.uber.org/fx"

	appfx "github.com/huangchihan/deepvalue-lab-be/lib/app/fx"
	healthapp "github.com/huangchihan/deepvalue-lab-be/lib/app/health"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/stocks"
	"github.com/huangchihan/deepvalue-lab-be/lib/app/subscriptions"
	"github.com/huangchihan/deepvalue-lab-be/lib/router"
	routerfx "github.com/huangchihan/deepvalue-lab-be/lib/router/fx"
)

func main() {
	fx.New(
		appfx.CoreAppOptions,
		routerfx.CoreRouterOptions,
		router.AsRoute(healthapp.NewHandler),
		router.AsRoute(stocks.NewListHandler),
		router.AsRoute(stocks.NewDetailHandler),
		router.AsRoute(stocks.NewReportsListHandler),
		router.AsRoute(stocks.NewPublishHandler),
		router.AsRoute(subscriptions.NewCreateHandler),
		fx.Invoke(func(*http.Server) {}),
	).Run()
}
