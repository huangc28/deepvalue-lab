package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/huangchihan/deepvalue-lab-be/config"
	"github.com/jmoiron/sqlx"
	"github.com/jmoiron/sqlx/reflectx"
	"github.com/tursodatabase/libsql-client-go/libsql"
	"go.uber.org/fx"
)

type Client struct {
	DB      *sqlx.DB
	Enabled bool
	Err     error
}

func NewClient(lc fx.Lifecycle, cfg *config.Config) *Client {
	dsn := strings.TrimSpace(cfg.TursoSQLite.DSN)
	if dsn == "" {
		dsn = strings.TrimSpace(cfg.TursoSQLite.Path)
	}

	if dsn == "" {
		return &Client{Enabled: false}
	}

	driver := strings.TrimSpace(cfg.TursoSQLite.Driver)
	if driver == "" {
		driver = "libsql"
	}

	var (
		err error
		db  *sqlx.DB
	)

	if driver == "libsql" {
		opts := []libsql.Option{}
		if strings.TrimSpace(cfg.TursoSQLite.Token) != "" {
			opts = append(opts, libsql.WithAuthToken(cfg.TursoSQLite.Token))
		}

		conn, connErr := libsql.NewConnector(dsn, opts...)
		if connErr != nil {
			return &Client{Enabled: true, Err: connErr}
		}
		db = sqlx.NewDb(sql.OpenDB(conn), driver)
	} else {
		db, err = sqlx.Open(driver, dsn)
	}

	if err != nil {
		return &Client{Enabled: true, Err: err}
	}

	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	db.SetConnMaxLifetime(1 * time.Minute)
	db.Mapper = reflectx.NewMapperFunc("json", strings.ToLower)

	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			return db.Close()
		},
	})

	return &Client{DB: db, Enabled: true}
}

func (c *Client) Ping(ctx context.Context) error {
	if !c.Enabled {
		return nil
	}
	if c.Err != nil {
		return c.Err
	}
	if c.DB == nil {
		return fmt.Errorf("sqlite not initialized")
	}
	return c.DB.PingContext(ctx)
}
