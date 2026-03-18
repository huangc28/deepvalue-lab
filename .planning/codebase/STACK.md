# Technology Stack

**Analysis Date:** 2026-03-19

## Languages

**Primary:**
- Go 1.25.0 - Backend server and CLI tools (`be/cmd/`, `be/lib/`)
- TypeScript 5.9.3 - Web frontend (`web/src/`)
- SQL (SQLite) - Turso database schema and queries (`be/turso/`)

**Secondary:**
- JavaScript/ESM - React component runtime (via TypeScript JSX)

## Runtime

**Environment:**
- Go 1.25.0 for backend (specified in `/Users/huangchihan/develop/profound-stock/be/go.mod`)
- Node.js (via pnpm) for frontend bundling (specified in `/Users/huangchihan/develop/profound-stock/web/package.json`)

**Package Manager:**
- Go: Native `go mod` system with `go.mod` and `go.sum` lockfiles
- Node: pnpm (type: "module" ES2023 target)
- Lockfile: `/Users/huangchihan/develop/profound-stock/web/pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- go.uber.org/fx 1.24.0 - Dependency injection framework for backend
- React 19.2.4 - Frontend UI framework
- TanStack Router 1.167.3 - Frontend client-side routing (`web/src/router.ts`)

**HTTP & Routing:**
- go-chi/chi/v5 5.2.3 - HTTP router and middleware (`be/lib/router/`, `be/lib/http/server.go`)
- go-chi/render 1.0.3 - HTTP response rendering

**Database & ORM:**
- sqlc - SQL code generation for Turso (`be/sqlc.yaml` generates `be/lib/app/turso_models/`)
- jmoiron/sqlx 1.4.0 - SQL wrapper for query execution
- tursodatabase/libsql-client-go - Turso SQLite client

**Testing:**
- Go: Standard testing library (Makefile target: `make test`)
- Frontend: Not configured (no test runner detected)

**Build/Dev:**
- Vite 8.0.0 - Frontend bundler and dev server (`web/vite.config.ts`)
- TypeScript (tsc) - Compilation before Vite build (`web/package.json` build script: `tsc -b && vite build`)
- Tailwind CSS 4.2.1 - Utility CSS framework (`@tailwindcss/vite` plugin)
- ESLint 9.39.4 - Linting (config: `web/`)
- Prettier 3.8.1 - Code formatting

## Key Dependencies

**Critical:**
- github.com/redis/go-redis/v9 9.17.2 - Redis client for caching (`be/cache/redis.go`)
- github.com/aws/aws-sdk-go-v2 1.41.4 - AWS SDK (for R2 storage via S3-compatible API)
- github.com/aws/aws-sdk-go-v2/service/s3 1.97.1 - S3 client for Cloudflare R2 object storage (`be/lib/pkg/r2/client.go`)
- go.uber.org/zap 1.27.1 - Structured logging (`be/lib/logs/logs.go`)

**Infrastructure:**
- pressly/goose/v3 3.27.0 - Database migration tool for Turso
- jackc/pgx/v5 5.8.0 - PostgreSQL driver (included but may be legacy; Turso SQLite is active)
- spf13/viper 1.21.0 - Configuration management and env var binding (`be/config/config.go`)

## Configuration

**Environment:**
- Viper (spf13/viper) handles all backend configuration from environment variables
- Environment variables are automatically loaded with snake_case conversion
- `.env` file support (included in Makefile: `-include .env`)
- Backend config location: `be/config/config.go`
- Key env vars (from `be/.env.example`):
  - `APP_PORT` - Server listen port (default: 9000 in .env.example, 8080 in config defaults)
  - `LOG_LEVEL` - Logging level for zap (default: info)
  - `TURSO_SQLITE_DSN` - Turso database connection string
  - `TURSO_SQLITE_TOKEN` - Turso auth token
  - `TURSO_SQLITE_PATH` - Fallback local SQLite path
  - `TURSO_SQLITE_DRIVER` - Driver selection (default: libsql)
  - `REDIS_URL` - Redis connection URL (optional, empty string disables caching)
  - `PG_URL` - PostgreSQL URL (included but appears unused with active Turso setup)
  - `R2_ACCOUNT_ID` - Cloudflare R2 account ID
  - `R2_BUCKET` - R2 bucket name
  - `R2_ACCESS_KEY_ID` - R2 API access key
  - `R2_SECRET_ACCESS_KEY` - R2 API secret key
  - `R2_PUBLIC_BASE_URL` - R2 public CDN URL for downloaded reports

**Build:**
- Web: `web/tsconfig.json`, `web/tsconfig.app.json`, `web/tsconfig.node.json` - TypeScript compilation config
- Web: `web/vite.config.ts` - Vite bundler config with React and Tailwind plugins
- Web: `web/.eslintrc.cjs` (implied) and Prettier config - Linting and formatting
- Backend: No explicit build config file; uses Go toolchain defaults

## Platform Requirements

**Development:**
- Go 1.25.0
- Node.js (version not pinned; compatible with pnpm)
- pnpm (package manager; version not specified in lockfile metadata)
- Docker (for containerized builds/deployment)

**Production:**
- Docker container running backend server (multi-stage build from `be/Dockerfile`)
- Base image: `golang:1.24.7` (builder) → `gcr.io/distroless/static-debian12` (runtime)
- Port: 8080 (exposed in Dockerfile)
- Azure Container Apps support (Makefile targets in `be/Makefile`)

---

*Stack analysis: 2026-03-19*
