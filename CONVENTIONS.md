# DeepValue Lab — Coding Conventions

Source of truth for project structure and coding patterns. Update this file when patterns change.

---

## 1. Project Structure

```
deep-value/
├── be/                          # Go backend
│   ├── cmd/
│   │   ├── server/              # HTTP server entry point
│   │   ├── migrate/             # Database migration runner
│   │   └── worker/              # Background job consumer
│   ├── lib/
│   │   ├── app/
│   │   │   ├── fx/              # FX dependency injection modules
│   │   │   ├── health/          # Health check handler
│   │   │   ├── stocks/          # Stock domain handlers + workers
│   │   │   ├── subscriptions/   # Subscription domain
│   │   │   └── turso_models/    # SQLC-generated models & queries
│   │   ├── http/                # HTTP server setup
│   │   ├── logs/                # Zap logger config
│   │   ├── pkg/                 # Shared infra packages (r2, rabbitmq, indicators)
│   │   └── router/              # Chi router + middleware
│   ├── db/                      # DB transaction utilities
│   ├── turso/
│   │   ├── schema.sql           # Authoritative table definitions
│   │   ├── migrations/          # Goose migration files
│   │   └── query/               # SQLC query SQL files
│   └── config/                  # Viper config
│
├── web/                         # React/TypeScript frontend
│   └── src/
│       ├── components/
│       │   ├── app-shell.tsx
│       │   ├── dashboard/       # Dashboard-specific components
│       │   ├── detail/          # Stock detail-specific components
│       │   └── ui/              # Shared UI primitives
│       ├── pages/               # Route-target page components
│       ├── types/               # TypeScript type definitions
│       ├── i18n/                # Locale context, messages, utils
│       ├── lib/                 # api.ts, queries.ts, cx.ts
│       ├── data/                # Mock data (typed)
│       ├── router.ts            # TanStack Router config
│       └── main.tsx
│
├── research/archive/YYYY/MM/DD/ # Time-stamped stock analysis reports
├── AGENTS.md                    # Agent instructions (Codex)
├── CLAUDE.md                    # Agent instructions (Claude)
└── CONVENTIONS.md               # This file
```

---

## 2. Backend (Go)

### File Naming
- Handlers: `{verb}_handler.go` (e.g., `list_handler.go`, `publish_handler.go`)
- Workers: `{name}_worker.go`
- Jobs: `{name}_job.go`
- Tests: `{file}_test.go` in same package

### Dependency Injection (Uber FX)
- Infrastructure wired in `lib/app/fx/core.go` via `var CoreAppOptions = fx.Options(...)`
- Handlers registered in `cmd/server/main.go` via `router.AsRoute(handler.New...)`
- Use `fx.In` struct for constructors with many dependencies:

```go
type NewPublishHandlerParams struct {
    fx.In
    Queries   *turso_models.Queries
    R2Client  *r2.Client
    Publisher *rabbitmq.Publisher
    Logger    *zap.Logger
}
```

### Handler Pattern
Every handler implements:
```go
type Handler interface {
    RegisterRoute(r *chi.Mux)
    Handle(w http.ResponseWriter, r *http.Request)
}
```

Each handler defines its own narrow query interface (interface segregation):
```go
type listQueries interface {
    ListPublishedStockDetails(ctx context.Context) ([]turso_models.PublishedStockDetail, error)
}

type ListHandler struct {
    queries listQueries
    logger  *zap.Logger
}

func NewListHandler(queries *turso_models.Queries, logger *zap.Logger) *ListHandler {
    return &ListHandler{queries: queries, logger: logger}
}

func (h *ListHandler) RegisterRoute(r *chi.Mux) {
    r.Get("/v1/stocks", h.Handle)
}
```

### HTTP Responses
```go
render.ChiJSON(w, r, http.StatusOK, map[string]any{"stocks": stocks})
render.ChiErr(w, r, http.StatusBadRequest, err)
```

| Status | When |
|--------|------|
| 200 | Successful fetch |
| 201 | Resource created |
| 400 | Malformed JSON / missing params |
| 404 | Resource not found |
| 422 | Validation failed |
| 500 | Server fault |
| 503 | Infrastructure dependency failed |

### Error Handling
```go
if err != nil {
    h.logger.Error("operation_name", zap.String("ticker", ticker), zap.Error(err))
    render.ChiErr(w, r, http.StatusInternalServerError, fmt.Errorf("user-facing message: %w", err))
    return
}

if errors.Is(err, sql.ErrNoRows) {
    render.ChiErr(w, r, http.StatusNotFound, errors.New("not found"))
    return
}
```

### Validation
Use `github.com/go-playground/validator/v10` to validate any struct that represents external input — HTTP request bodies and message queue payloads. Do not validate internal domain structs; trust the Go type system for those.

Declare a package-level validator. Add `validate` struct tags alongside `json` tags on request structs.

```go
var validate = validator.New()

type publishRequest struct {
    Ticker       string          `json:"ticker"       validate:"required"`
    CurrentPrice float64         `json:"currentPrice" validate:"required,gt=0"`
    Report       json.RawMessage `json:"report"       validate:"required"`
}

// In handler — validate after decode, before any business logic
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    render.ChiErr(w, r, http.StatusBadRequest, fmt.Errorf("invalid JSON: %w", err))
    return
}
if err := validate.Struct(req); err != nil {
    render.ChiErr(w, r, http.StatusUnprocessableEntity, fmt.Errorf("validation failed: %w", err))
    return
}
```

Common tags: `required`, `gt=0`, `gte=0`, `oneof=cheap fair rich`, `min=1`, `max=500`.

### Logging (Uber Zap)
```go
logger.Error("operation_name", zap.String("key", value), zap.Error(err))
logger.Info("operation_successful", zap.Int("count", len(rows)))
logger.Warn("operation_degraded", zap.String("reason", "fallback used"))
```

### Internationalization
- Locale from query param: `r.URL.Query().Get("locale") == "zh-TW"`
- Content stored pre-translated in DB (`summary_json`, `summary_json_zh_tw` columns)
- Fallback check:
```go
func hasNonEmptySummaryJSON(raw string) bool {
    trimmed := strings.TrimSpace(raw)
    return trimmed != "" && trimmed != "{}" && trimmed != "null"
}
```

### Database (Turso / SQLC)
- Schema: `turso/schema.sql` (authoritative)
- Migrations: `turso/migrations/` (Goose)
- Queries: `turso/query/*.sql` → SQLC generates `lib/app/turso_models/`
- Timestamps: `int64` milliseconds (`unixepoch('now') * 1000`)
- Column naming: `published_at_ms`, `created_at_ms`, `updated_at_ms`

### Testing
Use interface-based fakes — no mocking frameworks:
```go
type fakePublishQueries struct {
    insertStockReportCalls []turso_models.InsertStockReportParams
}

func (f *fakePublishQueries) InsertStockReport(_ context.Context, arg turso_models.InsertStockReportParams) error {
    f.insertStockReportCalls = append(f.insertStockReportCalls, arg)
    return nil
}
```
Use `httptest.NewRequest()` and `httptest.ResponseRecorder` for HTTP-level tests.

### Middleware
Applied globally in `lib/router/core.go`. No per-handler middleware.
- CORS: allows `localhost:*` and `*.value-deck.com`
- `middleware.RequestID`, `RealIP`, `Recoverer`, `Heartbeat("/ping")`

---

## 3. Frontend (React / TypeScript)

### File Naming
- Components: kebab-case `.tsx` (e.g., `company-card.tsx`)
- Pages: `{name}-page.tsx`
- Types: `types/{domain}.ts`
- One named export per file; export name matches filename stem

### TypeScript
- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- Status values as discriminated literal unions:
```typescript
export type ValuationStatus = 'cheap' | 'fair' | 'rich'
export type ThesisStatus = 'intact' | 'watch' | 'broken'
export type TechnicalEntryStatus = 'favorable' | 'neutral' | 'stretched'
```
- Localized fields: `LocalizedText = string | Record<Locale, string>`

### Internationalization
```typescript
export type Locale = 'en' | 'zh-TW'
export type LocalizedText = string | Record<Locale, string>

const { locale, m, text } = useI18n()

<span>{m.dashboard.heroTitle}</span>   // UI string from messages
<p>{text(stock.summary)}</p>           // resolve LocalizedText → string
```
- `text()` falls back to English if locale key missing
- Locale persisted in `localStorage` key `deepvalue-lab.locale`
- Internal enums stay English; only UI labels are localized

### Routing (TanStack Router)
```typescript
const stockDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/stocks/$ticker',
    component: StockDetailRoutePage,
})

<Link to="/stocks/$ticker" params={{ ticker: stock.ticker }}>...</Link>
```

### Data Fetching (React Query)
```typescript
// lib/api.ts — plain async fetch functions
export async function fetchStocks(locale: Locale): Promise<StockSummary[]> { ... }

// lib/queries.ts — React Query hooks
export function useStocks(locale: Locale) {
    return useQuery({
        queryKey: ['stocks', locale],
        queryFn: () => fetchStocks(locale),
        staleTime: 5 * 60 * 1000,
    })
}
```
Query key convention: `['stocks', locale]`, `['stocks', ticker, locale]`, `['stock-reports', ticker, locale]`

### Component Composition
UI primitives live in `components/ui/`. Compose with Panel:
```tsx
<Panel className="...">
    <PanelChrome label="label.ts" status={stock.lastUpdated} />
    <PanelBody className="space-y-6">
        {/* content */}
    </PanelBody>
</Panel>
```

### Status Badge System
Map status enum → tone → CSS class:
```typescript
type StatusTone = 'positive' | 'neutral' | 'watch' | 'risk' | 'accent'

const valuationTone: Record<ValuationStatus, StatusTone> = {
    cheap: 'positive',
    fair: 'neutral',
    rich: 'risk',
}
```

### Styling
- Tailwind utility classes + CSS custom properties for design tokens
- Design tokens defined in `src/index.css`:
  - Text: `--ink-primary`, `--ink-secondary`, `--ink-muted`
  - Surfaces: `--surface-panel`, `--surface-muted`
  - Borders: `--line-subtle`, `--line-strong`
  - Signals: `--signal-positive-soft`, `--signal-watch-soft`, `--signal-danger-soft`
- Usage: `className="text-[var(--ink-primary)] bg-[var(--surface-panel)]"`

### Classname Utility
```typescript
import { cx } from '@/lib/cx'

className={cx('base', isActive && 'active', condition && 'extra')}
```

### Error & Loading States
```tsx
if (isLoading) return <LoadingState label="value-deck://watchlist" />
if (error) return <ErrorState label="value-deck://watchlist" />
```

---

## 4. Shared Conventions

### API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/stocks` | List all published summaries |
| GET | `/v1/stocks?locale=zh-TW` | zh-TW summaries |
| GET | `/v1/stocks/{ticker}` | Stock detail |
| GET | `/v1/stocks/{ticker}?locale=zh-TW` | zh-TW detail |
| POST | `/v1/stocks/{ticker}/reports` | Publish report + structured detail |
| GET | `/v1/stocks/{ticker}/reports` | Report metadata only |

### Identifiers
- Report ID: `{TICKER}-{YYYYMMDD}-{shortID}` (e.g., `TSM-20260315-a1b2c3d4`)
- R2 markdown: `reports/{ticker}/{date}/{reportId}.md`
- R2 detail: `details/{ticker}/{date}/{reportId}.json`
- R2 detail zh-TW: `details/{ticker}/{date}/{reportId}.zh-TW.json`

### Timestamps
- Stored as milliseconds since epoch (`int64`)
- DB columns: `*_at_ms`
- Go: `time.Now().UTC().UnixMilli()`
- TS: `publishedAtMs: number` → `new Date(publishedAtMs)`

### JSON Passthrough Pattern
Backend stores pre-serialized JSON in DB and passes through as `json.RawMessage`. Frontend receives it already parsed as `LocalizedText`.

### Null / Empty Handling
- DB defaults: `DEFAULT ''` or `DEFAULT '{}'` — no NULL for optional fields
- TS: optional fields use `?`, conditional render with `{field && <Component />}`

---

## 5. Validation Checklist

Run before marking any task complete:

```bash
# Frontend
cd web && pnpm format && pnpm lint && pnpm build

# Backend
cd be && go build ./... && go test ./...
```
