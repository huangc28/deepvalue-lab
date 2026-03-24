# Architecture

**Analysis Date:** 2026-03-19

## Pattern Overview

**Overall:** Modular layered architecture with dependency injection (DI) framework for backend; client-driven data frontend.

**Key Characteristics:**
- Backend uses Uber Fx (Go dependency injection framework) for lifecycle and module composition
- Handler-based HTTP routing with chi mux
- Monolithic database queries via sqlc-generated Turso SQLite client
- Frontend is React + TanStack Router with local mock data (no backend integration yet)
- Multi-layer data persistence: Turso SQLite for metadata, Cloudflare R2 for full reports
- Research archive is disk-based (YYYY/MM/DD structure in `research/archive/`)

## Layers

**Configuration & Infrastructure:**
- Purpose: Provides runtime configuration and logging setup
- Location: `be/config/`, `be/lib/logs/`
- Contains: Config struct with Viper binding, structured logging via zap
- Depends on: Environment variables, `config.Config` injected via Fx
- Used by: All application code

**Data Access & Persistence:**
- Purpose: Database queries, file storage, caching infrastructure
- Location: `be/db/`, `be/cache/`, `be/lib/pkg/sqlite/`, `be/lib/pkg/r2/`, `be/turso/`
- Contains: PostgreSQL connection (optional), Redis client (optional), Turso SQLite client, R2 object storage client
- Depends on: `config.Config`, external database/storage credentials
- Used by: Application handlers

**HTTP Server & Routing:**
- Purpose: HTTP request handling, route registration, middleware
- Location: `be/lib/http/`, `be/lib/router/`
- Contains: `*http.Server` with chi mux, route registration via Handler interface, lifecycle hooks (Fx)
- Depends on: Logger, configuration, chi mux
- Used by: All HTTP handlers, main Fx app

**Application/Handler Layer:**
- Purpose: Business logic for specific features, route implementation
- Location: `be/lib/app/health/`, `be/lib/app/stocks/`, `be/lib/app/subscriptions/`
- Contains: Handler implementations (health check, stock list/detail, reports, subscriptions)
- Depends on: Database queries, logger, R2 client, render utilities
- Used by: Router registration

**Rendering/Response Layer:**
- Purpose: Standardized HTTP response marshaling
- Location: `be/lib/pkg/render/`
- Contains: JSON and error response helpers
- Depends on: chi mux, http package
- Used by: Handlers

**Frontend Layer (Web):**
- Purpose: React UI for dashboard and stock research
- Location: `web/src/`
- Contains: Pages, components, data layer, i18n, types, routing
- Depends on: React, TanStack Router, local mock data, Tailwind CSS
- Used by: End users

## Data Flow

**Stock List Request:**

1. Browser requests `GET /v1/stocks`
2. chi router matches route to `ListHandler.Handle()`
3. Handler calls `queries.ListPublishedStockDetails(ctx)` → executes SQL against Turso
4. Database returns rows with `SummaryJson` (small JSON blobs stored in database)
5. Handler marshals `SummaryJson` into response, returns `200 OK` with array of stocks
6. Browser renders dashboard with card/table view from response

**Stock Detail Request:**

1. Browser requests `GET /v1/stocks/{ticker}`
2. Router extracts ticker, passes to `DetailHandler.Handle()`
3. Handler queries Turso for stock metadata including `R2DetailKey` and optional `R2DetailZhTwKey`
4. For `?locale=zh-TW`, handler prefers `R2DetailZhTwKey`; otherwise it uses `R2DetailKey`
5. If a usable detail key exists, handler downloads full detail JSON from R2
6. If no usable detail key exists, handler returns `404` rather than falling back to summary JSON
7. Frontend renders the multi-section detail page only from full `StockDetail` payloads

**State Management:**

- Backend: Stateless handlers, request-scoped context
- Frontend: React component state (useState) for filters, sorting, view mode
- Data persistence: Turso SQLite (schema + small summaries), R2 (full reports)
- Cache: Redis (optional, credentials-based enablement)

## Key Abstractions

**Handler Interface:**
- Purpose: Standardizes HTTP endpoint implementation
- Location: `be/lib/router/core.go`
- Pattern: Each handler implements `RegisterRoute()` and `Handle()` methods
- Examples: `ListHandler`, `DetailHandler`, `HealthHandler` in `be/lib/app/*/`
- Pattern: Annotations-based dependency injection via Fx tags

**Fx Module Composition:**
- Purpose: Assembles application services, manages lifecycle (start/stop)
- Location: `be/lib/app/fx/core.go`, `be/lib/router/fx/options.go`
- Pattern: `CoreAppOptions` provides config, logger, DB, cache, R2; `CoreRouterOptions` provides chi mux
- Dependency graph: Config → Logger, DB, Redis, Turso, R2; Router collects all handlers via group annotation

**Query Model (sqlc):**
- Purpose: Type-safe SQL query execution
- Location: `be/lib/app/turso_models/` (generated), `be/turso/query/` (SQL source)
- Pattern: sqlc generates `Queries` struct with methods for each `.sql` file query
- Examples: `ListPublishedStockDetails`, `GetPublishedStockDetail`

**Stock Data Types:**
- Purpose: Standardize stock entity shape across frontend/backend
- Location: `web/src/types/stocks.ts`
- Includes: `StockSummary` (dashboard-visible), `StockDetail` (full research)
- Pattern: Both use `LocalizedText` (object with `en` and `zh-TW` keys)

## Entry Points

**Backend Server:**
- Location: `be/cmd/server/main.go`
- Triggers: `go run ./cmd/server` or Docker container startup
- Responsibilities: Assembles Fx app with all modules, wires routes, starts HTTP server

**Database Migrations:**
- Location: `be/cmd/migrate/main.go`
- Triggers: Manual run before deployment
- Responsibilities: Runs Goose migrations against Turso

**Frontend:**
- Location: `web/src/main.tsx`
- Triggers: `pnpm dev` or browser load of built app
- Responsibilities: Initializes React root, wraps app in i18n/router providers, renders `AppShell`

**Router (Web):**
- Location: `web/src/router.ts`
- Contains: TanStack Router tree with root, dashboard, stock detail routes
- Used by: `AppShell` via `<RouterProvider>` and `<Outlet />`

## Error Handling

**Strategy:** Handlers catch errors and return HTTP status codes with `render.ChiErr()`

**Patterns:**
- `sql.ErrNoRows` → 404 Not Found
- Generic database errors → 500 Internal Server Error with logged error details
- Validation errors → 400 Bad Request (not yet implemented in current handlers)
- Logger includes request context (ticker, key, error message) for debugging

**Frontend:** Currently no error handling for API failures (mock data is always available)

## Cross-Cutting Concerns

**Logging:**
- Framework: `go.uber.org/zap` (structured logging)
- Pattern: Injected into handlers, handlers log errors with context (ticker, operation name, error)
- Example: `h.logger.Error("get published stock detail", zap.String("ticker", ticker), zap.Error(err))`

**Validation:**
- Backend: URL parameter validation via chi path extraction (uppercase ticker)
- Frontend: None at component level (all mock data assumed valid)
- Pattern: Handlers validate inputs before database calls

**Authentication:**
- Current: None implemented
- Future: Likely header-based or session-based (auth layer not yet added)

**Configuration:**
- Framework: `github.com/spf13/viper`
- Pattern: Env vars override defaults, structured into typed `Config` struct
- Sensitive data: AWS credentials, database URLs, R2 secrets loaded from `.env`
