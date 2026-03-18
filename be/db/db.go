package db

import (
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"

	"github.com/huangchihan/deepvalue-lab-be/config"
)

func NewSQLXPostgresDB(cfg config.Config) (*sqlx.DB, error) {
	if cfg.PGURL == "" {
		return nil, nil
	}

	return sqlx.Open("pgx", cfg.PGURL)
}
