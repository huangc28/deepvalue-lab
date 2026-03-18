package main

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	"github.com/pressly/goose/v3"
	"github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "Usage: migrate <command> [args]")
		fmt.Fprintln(os.Stderr, "Commands: up, down, status, version, reset")
		os.Exit(1)
	}

	dsn := strings.TrimSpace(os.Getenv("TURSO_SQLITE_DSN"))
	token := strings.TrimSpace(os.Getenv("TURSO_SQLITE_TOKEN"))

	if dsn == "" {
		fmt.Fprintln(os.Stderr, "Error: TURSO_SQLITE_DSN is required")
		os.Exit(1)
	}

	opts := []libsql.Option{}
	if token != "" {
		opts = append(opts, libsql.WithAuthToken(token))
	}

	connector, err := libsql.NewConnector(dsn, opts...)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: failed to create libsql connector: %v\n", err)
		os.Exit(1)
	}

	db := sql.OpenDB(connector)
	defer db.Close()

	if err := goose.SetDialect("sqlite3"); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	command := os.Args[1]
	args := os.Args[2:]

	if err := goose.Run(command, db, "turso/migrations", args...); err != nil {
		fmt.Fprintf(os.Stderr, "Error: goose %s: %v\n", command, err)
		os.Exit(1)
	}
}
