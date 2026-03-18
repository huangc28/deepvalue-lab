package logs

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

func NewLogger(cfg config.Config) (*zap.Logger, error) {
	level := zapcore.InfoLevel
	if err := level.Set(cfg.LogLevel); err != nil {
		level = zapcore.InfoLevel
	}

	zcfg := zap.NewProductionConfig()
	zcfg.Level = zap.NewAtomicLevelAt(level)
	return zcfg.Build()
}
