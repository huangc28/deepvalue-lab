# External Integrations

**Analysis Date:** 2026-03-19

## APIs & External Services

**Stock Data & Financial:**
- Yahoo Finance API - Referenced in `web/src/data/mock-stocks.ts` (query1.finance.yahoo.com)
- Nasdaq.com API - Referenced in mock data (`api.nasdaq.com/api/quote`)
- SEC EDGAR - Referenced in mock data for historical filings and 10-K documents
- Stooq.com - Referenced for historical price data (`stooq.com/q/d/l/`)
- Investor Relations sites - Referenced for company earnings and fundamentals (e.g., investor.tsmc.com, investors.broadcom.com)
- Status: Currently mock data only; no active API clients in code (web frontend uses local mock data in `web/src/data/mock-stocks.ts`)

## Data Storage

**Databases:**
- Turso (SQLite)
  - Connection: Environment variables `TURSO_SQLITE_DSN` or `TURSO_SQLITE_PATH`
  - Auth: `TURSO_SQLITE_TOKEN`
  - Client: `tursodatabase/libsql-client-go` (`be/lib/pkg/sqlite/client.go`)
  - Driver: libsql (default)
  - Code generation: sqlc via `be/sqlc.yaml` → `be/lib/app/turso_models/` queries
  - Migrations: Goose v3 (`be/turso/migrations/`) with Makefile targets

- PostgreSQL (included but appears inactive)
  - Connection: `PG_URL` environment variable
  - Client: `jackc/pgx/v5`
  - Status: Dependency present but no active usage in codebase

**File Storage:**
- Cloudflare R2 (S3-compatible object storage)
  - Service: R2 bucket via AWS SDK v2 S3 API
  - Auth: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
  - Endpoint: `https://{ACCOUNT_ID}.r2.cloudflarestorage.com`
  - Purpose: Store full stock analysis reports (markdown) and StockDetail JSON artifacts
  - Client: `be/lib/pkg/r2/client.go` (custom wrapper around S3 client)
  - Upload methods: `UploadMarkdown()`, `UploadJSON()`
  - Download: `Download()` method
  - Key format:
    - Reports: `reports/{ticker}/{YYYYMMDD}/{reportID}.md`
    - Details: `reports/{ticker}/{YYYYMMDD}/{reportID}.json`
  - Public CDN: `R2_PUBLIC_BASE_URL` for served report URLs

**Caching:**
- Redis
  - Connection: `REDIS_URL` environment variable (optional)
  - Client: `github.com/redis/go-redis/v9`
  - Status: Optional; graceful fallback if not configured (returns nil if empty URL)
  - Implementation: `be/cache/redis.go` with URL parsing

## Authentication & Identity

**Auth Provider:**
- None detected. No auth service integration in codebase.
- Status: Frontend-only mockup (no real authentication layer)

## Monitoring & Observability

**Error Tracking:**
- Not detected. No error tracking service (Sentry, Rollbar, etc.)

**Logs:**
- Structured logging via Uber Zap (`go.uber.org/zap`)
- Configuration: `be/lib/logs/logs.go`
- Log levels: Configurable via `LOG_LEVEL` environment variable (default: info)
- Format: JSON production output (uses `zap.NewProductionConfig()`)
- Sampling: Zap production defaults enabled

## CI/CD & Deployment

**Hosting:**
- Azure Container Apps (primary deployment target)
  - Makefile target: `make deploy/containerapp`
  - Requires: `ACR_IMAGE`, `AZURE_RESOURCE_GROUP`, `AZURE_LOCATION`, `AZURE_CONTAINERAPPS_ENV`
  - Uses: `az containerapp up` command
- Docker containerization for portable deployment

**CI Pipeline:**
- Not detected. No GitHub Actions, GitLab CI, or other CI service configuration found.
- Manual deployment via Makefile

## Environment Configuration

**Required env vars:**
- `TURSO_SQLITE_DSN` or `TURSO_SQLITE_PATH` - Database connection (one of these required for active database)
- `TURSO_SQLITE_TOKEN` - Database authentication
- `R2_ACCOUNT_ID` - Cloudflare R2 account ID (required for file storage)
- `R2_BUCKET` - R2 bucket name (required for file storage)
- `R2_ACCESS_KEY_ID` - R2 credentials (required for file storage)
- `R2_SECRET_ACCESS_KEY` - R2 credentials (required for file storage)

**Optional env vars:**
- `REDIS_URL` - Redis connection (enables caching if provided)
- `PG_URL` - PostgreSQL URL (legacy, appears unused)
- `APP_PORT` - Server port (default: 8080)
- `LOG_LEVEL` - Logging verbosity (default: info)
- `R2_PUBLIC_BASE_URL` - CDN URL for public report access

**Secrets location:**
- Backend: Environment variables or `.env` file (not committed; use `.env.example` as template)
- Frontend: No secrets required (mock data only)

## Webhooks & Callbacks

**Incoming:**
- Not detected. No webhook listeners in codebase.

**Outgoing:**
- Stock publish handler (`be/lib/app/stocks/publish_handler.go`) - Uploads analysis results to R2 but no outbound webhooks to external services detected

## Database Schema & Models

**Turso SQLite Tables (generated via sqlc):**
- Location: `be/turso/` - migrations, schema, and queries
- Generated Go models: `be/lib/app/turso_models/` (auto-generated from sqlc)
- Migration tool: Goose v3 (`be/turso/migrations/`)
- Query location: `be/turso/query/` (SQL files for code generation)
- Schema storage: `be/turso/schema.sql`

---

*Integration audit: 2026-03-19*
