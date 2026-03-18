# Codebase Structure

**Analysis Date:** 2026-03-19

## Directory Layout

```
profound-stock/
├── be/                        # Go backend
│   ├── cmd/
│   │   ├── server/           # HTTP server entry point
│   │   └── migrate/          # Database migration entry point
│   ├── lib/
│   │   ├── app/              # Application/handler layer
│   │   │   ├── fx/           # Fx module config
│   │   │   ├── health/       # Health check handler
│   │   │   ├── stocks/       # Stock handlers (list, detail, publish, reports)
│   │   │   ├── subscriptions/# Subscription handlers
│   │   │   └── turso_models/ # sqlc-generated query models
│   │   ├── http/             # HTTP server setup (Fx lifecycle)
│   │   ├── logs/             # Logger initialization
│   │   ├── pkg/              # Utility packages
│   │   │   ├── r2/           # Cloudflare R2 client
│   │   │   ├── render/       # Response rendering helpers
│   │   │   └── sqlite/       # Turso SQLite connection
│   │   ├── interfaces/       # Interface definitions
│   │   └── router/           # Route registration (chi mux + Fx)
│   │       └── fx/           # Router Fx config
│   ├── config/               # Configuration/environment parsing
│   ├── cache/                # Redis client
│   ├── db/                   # PostgreSQL connection (optional)
│   ├── turso/                # Turso database schema & queries
│   │   ├── migrations/       # Goose migration files
│   │   └── query/            # SQL query definitions (.sql)
│   ├── azure/                # Azure client (unused currently)
│   ├── go.mod                # Go module definition
│   ├── go.sum                # Go dependency checksums
│   ├── Makefile              # Build targets
│   ├── Dockerfile            # Container image
│   └── .env.example          # Environment template
│
├── web/                       # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (dashboard, detail routes)
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/           # Base UI primitives (panel, badge, metric block, etc)
│   │   │   ├── dashboard/    # Dashboard-specific components (card, table)
│   │   │   └── detail/       # Detail page components (scenario, expectation bridge)
│   │   ├── types/            # TypeScript type definitions (stocks, valuation, etc)
│   │   ├── data/             # Mock data (currently: mock-stocks.ts)
│   │   ├── lib/              # Utility functions and helpers
│   │   ├── i18n/             # Internationalization (en, zh-TW)
│   │   ├── router.ts         # TanStack Router definition
│   │   ├── main.tsx          # React entry point
│   │   └── index.css         # Tailwind CSS imports
│   ├── public/               # Static assets
│   ├── dist/                 # Built output (generated)
│   ├── package.json          # npm/pnpm dependencies
│   └── tsconfig.json         # TypeScript configuration
│
├── docs/                      # Documentation
│   ├── research/             # Research references
│   ├── analysis/             # Analysis documents
│   ├── notebooklm/           # NotebookLM references
│   └── product/              # Product direction docs
│
├── research/                  # Stock research archive
│   ├── archive/              # Time-stamped reports
│   │   └── 2026/
│   │       ├── 03/
│   │       │   ├── 16/       # Date-based subdirectories
│   │       │   ├── 17/
│   │       │   └── 18/
│   │   └── templates/        # Report templates
│
├── .agents/                   # Agent skill definitions
│   └── skills/
│       ├── deepvalue-stock-analysis/  # Stock analysis skill
│       └── nlm-skill/                 # NotebookLM workflow skill
│
├── .planning/                 # Planning documents (this location)
│   └── codebase/             # Architecture/structure analysis
│
└── CLAUDE.md                  # Claude project instructions
```

## Directory Purposes

**`be/cmd/`:**
- Purpose: Application entry points (executable commands)
- Contains: `server/main.go` (HTTP server), `migrate/main.go` (database migrations)
- Key files: Each subdirectory has its own `main.go` with `func main()`

**`be/lib/app/`:**
- Purpose: Application business logic and HTTP handlers
- Contains: Handler implementations organized by feature (health, stocks, subscriptions)
- Key files: `*_handler.go` files implement Handler interface

**`be/lib/router/`:**
- Purpose: HTTP routing setup via chi mux and Fx integration
- Contains: Route registration logic, Handler interface definition
- Key files: `be/lib/router/core.go` defines Handler interface and Mux provider

**`be/lib/http/`:**
- Purpose: HTTP server initialization with Fx lifecycle hooks
- Contains: Server startup, TLS config, graceful shutdown
- Key files: `be/lib/http/server.go` creates and manages *http.Server

**`be/config/`:**
- Purpose: Configuration and environment variable parsing
- Contains: Viper setup, Config struct definition
- Key files: `be/config/config.go` with NewViper() and NewConfig()

**`be/turso/`:**
- Purpose: Database schema and query definitions for Turso SQLite
- Contains: Goose migration files, SQL query definitions, sqlc-generated Go code
- Key files: `be/turso/query/*.sql` (source), `be/lib/app/turso_models/*.go` (generated)

**`web/src/pages/`:**
- Purpose: Page-level React components (routable screens)
- Contains: DashboardPage, StockDetailPage
- Key files: `dashboard-page.tsx` (main watchlist), `stock-detail-route-page.tsx` (research detail)

**`web/src/components/`:**
- Purpose: Reusable React components organized by context
- Contains: UI primitives (panel, badge, metric), domain components (company card, scenario)
- Key files: Structured into `ui/`, `dashboard/`, `detail/` subdirectories

**`web/src/types/`:**
- Purpose: Shared TypeScript type definitions
- Contains: Stock data models (StockSummary, StockDetail, Scenario, etc)
- Key files: `stocks.ts` with all domain types

**`web/src/i18n/`:**
- Purpose: Internationalization support
- Contains: Locale messages, provider, context, utilities
- Key files: Message files for `en` and `zh-TW`, context provider

**`research/archive/`:**
- Purpose: Timestamped stock research reports
- Contains: Date-organized markdown reports (`YYYY/MM/DD/`) and full JSON details
- Key files: Report naming convention is `{ticker}-analysis.md` and `{ticker}-detail.json`

## Key File Locations

**Entry Points:**
- `be/cmd/server/main.go`: Backend HTTP server startup
- `be/cmd/migrate/main.go`: Database migration runner
- `web/src/main.tsx`: React app initialization
- `web/src/router.ts`: Route tree definition (TanStack Router)

**Configuration:**
- `be/config/config.go`: Config struct and Viper setup
- `web/package.json`: Frontend build config and dependencies
- `be/go.mod`: Go dependencies

**Core Logic:**
- `be/lib/app/stocks/list_handler.go`: GET /v1/stocks
- `be/lib/app/stocks/detail_handler.go`: GET /v1/stocks/{ticker}
- `be/lib/router/core.go`: Handler interface and Mux provider

**Data Layer:**
- `be/lib/pkg/r2/client.go`: Cloudflare R2 object storage client
- `be/lib/app/turso_models/db.go`: sqlc-generated query wrapper
- `be/cache/redis.go`: Redis cache initialization
- `be/db/db.go`: PostgreSQL connection (optional)

**Frontend Components:**
- `web/src/components/app-shell.tsx`: Root layout with header
- `web/src/pages/dashboard-page.tsx`: Main watchlist page
- `web/src/pages/stock-detail-route-page.tsx`: Detail page wrapper
- `web/src/data/mock-stocks.ts`: Mock stock data (~84KB)

**Types & Data Models:**
- `web/src/types/stocks.ts`: All stock-related TypeScript interfaces
- `be/turso/query/`: SQL query definitions (source of sqlc generation)

## Naming Conventions

**Files:**
- Go handlers: `{feature}_handler.go` (e.g., `list_handler.go`, `detail_handler.go`)
- Go packages: Lowercase, single word or underscore-separated (e.g., `turso_models`, `pkg/r2`)
- React components: PascalCase with `.tsx` extension (e.g., `DashboardPage.tsx`, `CompanyCard.tsx`)
- SQL files: Lowercase with underscores (e.g., `list_published_stock_details.sql`)
- Generated code: Lowercase with `.sql.go` suffix for sqlc output (e.g., `stocks.sql.go`)

**Directories:**
- Backend packages: Lowercase, no hyphens (e.g., `app`, `lib`, `pkg`)
- Frontend directories: Lowercase with hyphens only in CSS files (e.g., `pages`, `components`)
- Archive dates: `YYYY/MM/DD/` structure for research reports

**Functions & Methods:**
- Backend: PascalCase for exported, camelCase for private
- React: PascalCase for components, camelCase for hooks and utilities
- Pattern: Handler methods follow `New{Name}Handler` constructor + `Handle()` receiver

**Constants & Types:**
- Go: SCREAMING_SNAKE_CASE or PascalCase depending on scope
- TypeScript: PascalCase for types, SCREAMING_SNAKE_CASE for constants

## Where to Add New Code

**New Feature (e.g., watchlist management):**
- Primary code: `be/lib/app/{feature}/` (create directory, add handler)
- Handler file: `be/lib/app/{feature}/{action}_handler.go`
- Route registration: Import and register in `be/cmd/server/main.go` via `router.AsRoute()`
- Database queries: Add `.sql` files to `be/turso/query/`, run sqlc to generate Go
- Tests: `be/lib/app/{feature}/*_test.go` (not yet set up)

**New React Component:**
- Implementation: `web/src/components/{context}/{name}.tsx`
- If reusable: Place in `web/src/components/ui/`
- If page-specific: Place in `web/src/components/{feature}/` (e.g., `dashboard/`)
- Types: Export interfaces in `web/src/types/{domain}.ts`
- Import path: Use relative imports (e.g., `../lib/cx`, `../../types/stocks`)

**New Utility/Helper:**
- Backend: `be/lib/pkg/{name}/` for general utilities, feature-specific in `be/lib/app/{feature}/`
- Frontend: `web/src/lib/` for shared functions (e.g., `cx.ts` for classname utils)
- Pattern: Export as named functions, include JSDoc comments

**New Page Route:**
- Route definition: Add to `web/src/router.ts` via `createRoute()` and `addChildren()`
- Page component: `web/src/pages/{route-name}-page.tsx`
- Pattern: Export named `export function {Name}Page()` component

**Database Schema Change:**
- Migration file: Create in `be/turso/migrations/` with Goose naming (e.g., `00003_add_subscriptions_table.sql`)
- Query update: Add/modify `.sql` files in `be/turso/query/`
- Regenerate: Run `sqlc generate` to produce new Go query code
- Update handlers: Modify handlers to use new queries from sqlc output

## Special Directories

**`be/lib/app/turso_models/`:**
- Purpose: sqlc-generated query code (DO NOT EDIT manually)
- Generated: Run `sqlc generate` to regenerate from `be/turso/query/`
- Committed: Yes, to git (generated code is versioned)
- Pattern: Each `.sql` file generates corresponding Go methods on `Queries` struct

**`research/archive/`:**
- Purpose: Timestamped stock analysis reports
- Generated: No (manually written)
- Committed: Yes, to git
- Structure: `YYYY/MM/DD/{ticker}-analysis.md` for full reports
- Secondary: Full JSON details stored in R2 with key format `reports/{ticker}/{YYYYMMDD}/{reportID}.json`

**`web/dist/`:**
- Purpose: Build output
- Generated: Yes, by `pnpm build`
- Committed: No, in `.gitignore`
- Pattern: Contains bundled JS, CSS, HTML from Vite build

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents (this location)
- Generated: By Claude via `/gsd:map-codebase` command
- Committed: Yes, to git (documentation)
- Pattern: UPPERCASE.md files for consistency
