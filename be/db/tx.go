package db

import (
	"context"
	"errors"

	"github.com/jmoiron/sqlx"
)

func InTx(ctx context.Context, db *sqlx.DB, fn func(*sqlx.Tx) error) error {
	if db == nil {
		return errors.New("postgres client is not configured")
	}

	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}

	if err := fn(tx); err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}
