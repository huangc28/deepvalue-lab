# Phase 07: Frontend API Integration For Historical Reports - Research

**Researched:** 2026-03-24
**Domain:** React frontend integration of historical report summary/detail APIs
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Implementation Decisions

### Live data source and mock fallback boundary
- **D-01:** Phase 7 must stop mixing live latest-detail data with mock historical data. If the page is rendering a live `StockDetail`, the history surface must read from the live `/reports` APIs instead of falling back to `mockStock.historicalReports`.
- **D-02:** Mock historical data remains acceptable only when the entire stock detail page is already using mock fallback because the live latest-detail request is unavailable.
- **D-03:** The latest stock detail endpoint remains the production source for hero, thesis, pricing, and other latest-only sections. Historical APIs augment the `History` section; they do not replace `useStock(...)`.

### Detail loading and cache model
- **D-04:** Load the revision list first, then fetch historical detail lazily per `reportId` for the selected revision and any compare target.
- **D-05:** Cache loaded historical details by `reportId` so reselection and compare toggles reuse prior responses instead of re-fetching.
- **D-06:** Do not prefetch every historical detail payload on first render. The first paint should prioritize latest detail plus revision summaries, then fetch only the detail records needed for the active selection/compare state.

### History section states and failure behavior
- **D-07:** The history surface gets its own loading, empty, and error states. A failure in `/reports` or `/reports/{reportId}` must not collapse the whole stock detail page when the latest detail is otherwise available.
- **D-08:** Empty history is driven by an empty live reports response, not by the old legacy text list.
- **D-09:** If compare-mode detail loading fails for one side, preserve the selected base revision and show a local compare-side failure state rather than clearing the whole history UI.

### Locale fallback propagation
- **D-10:** Preserve the Phase 5 `localeHasFallback` behavior as the single source for fallback labeling in selected and compare cards.
- **D-11:** Historical detail responses should be merged onto the corresponding summary row so the frontend keeps `localeHasFallback`, `latest`, `provenance`, and status metadata without requiring a backend detail-contract change.
- **D-12:** Mixed-locale compare labeling stays per card: each selected/compare card shows the fallback indicator independently when the active locale is `zh-TW` and that revision fell back to English.

### the agent's Discretion
- The exact React Query hook split between report-list and report-detail hooks
- Whether selected-detail fetches are keyed directly by `selectedId`/`compareId` or by a small derived query helper
- Exact loading skeleton and inline error copy, as long as the existing dark research-cockpit language is preserved

## Deferred Ideas

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INTH-01 | Frontend revision ledger consumes live historical report APIs without regressing the current latest stock detail experience | Separate history queries from `useStock`, keep latest page contract unchanged, and isolate history loading/error state to the `History` section |
| INTH-02 | Live revision ledger handles mixed-locale compare and explicit fallback labels correctly | Merge detail payloads onto summary rows, preserve backend-provided `localeHasFallback`, and render per-card fallback state in selected and compare modes |
</phase_requirements>

## Summary

Phase 7 should be planned as a frontend orchestration phase, not a backend-contract phase. The repository already exposes the two APIs this feature needs: `GET /v1/stocks/{ticker}/reports` returns frontend-aligned historical summaries, and `GET /v1/stocks/{ticker}/reports/{reportId}` returns the structured historical detail payload for one revision. The frontend work is to stop mixing live latest data with mock history, add summary/detail query hooks, and preserve the current latest-detail path untouched.

The clean implementation shape is: keep `useStock(ticker, locale)` as the page-level source for the latest stock detail, load the history revision list separately, lazily fetch only the selected and compare details, and merge each fetched detail payload onto its summary row before giving it to `HistoricalRevisionLedger`. That preserves `localeHasFallback`, `latest`, `provenance`, and status badges without reopening the backend contract.

Repo truth also resolves a stale second-brain mismatch: older NotebookLM notes still described `/reports` as metadata-only and implied summary fallback during detail reads. The current codebase does not work that way. The list API already returns summary rows, and historical detail locale behavior is `zh-TW detail -> EN detail -> 404`. Plan against the repository, not the stale notebook note.

**Primary recommendation:** Add dedicated TanStack Query hooks for report summaries and per-report details, keep the latest detail query independent, and make the `History` section degrade locally instead of failing the page.

## Project Constraints (from CLAUDE.md)

- Query NotebookLM before non-trivial work; use the repository as the source of truth when they disagree.
- After a validated non-trivial change, write a concise durable update back to NotebookLM.
- Do not store secrets, credentials, cookies, or tokens in NotebookLM.
- Optimize the UI for decision usefulness and preserve auditability.
- Do not turn the product into a broker UI or terminal cosplay.
- Keep internal enums stable in English and localize only at render time.
- Frontend validation expectation: `cd web && pnpm lint && pnpm build`.
- Backend validation expectation if backend files are touched: `cd be && go build ./... && go test ./...`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | repo `19.2.4`; npm current `19.2.4` published 2026-01-26 | UI state and rendering | Already shipped in the app; no Phase 7 reason to change framework |
| `@tanstack/react-query` | repo `5.91.0`; npm current `5.95.2` published 2026-03-23 | Fetching, caching, lazy dependent detail queries | Already the app’s data layer and the right fit for per-key cached detail fetches |
| `@tanstack/react-router` | repo `1.167.3`; npm current `1.168.3` published 2026-03-23 | Route-scoped page rendering | Already owns page routing; no Phase 7 routing change needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | repo `5.9.3`; npm current `6.0.2` published 2026-03-23 | Type-safe summary/detail merge and hook contracts | Use existing repo pin; do not upgrade in this phase |
| Vite | repo `8.0.0`; npm current `8.0.2` published 2026-03-23 | Local dev server and `/v1` proxy to backend | Needed for live manual smoke once backend is running |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Existing TanStack Query hooks | SWR or hand-rolled fetch state | Unnecessary churn; loses consistency with the repo’s existing cache model |
| Separate history queries | Expanding `GET /v1/stocks/{ticker}` to include history | Reopens backend scope and violates the locked latest/history boundary |
| Lazy selected/compare detail loading | Prefetch all detail payloads | Simpler UI code, but violates D-06 and increases first-load cost |

**Installation:**
```bash
cd web && pnpm install
```

**Version verification:** Registry checks run during research.
```bash
npm view react version
npm view @tanstack/react-query version
npm view @tanstack/react-router version
npm view vite version
npm view typescript version
```

## Architecture Patterns

### Recommended Project Structure
```text
web/src/
├── lib/api.ts                         # Add /reports and /reports/{reportId} client functions
├── lib/queries.ts                     # Add history summary/detail hooks
├── pages/stock-detail-page.tsx        # Orchestrate latest query + history queries + fallback boundary
├── components/detail/historical-revision-ledger.tsx
│                                       # Stay presentation-first; accept explicit section state
└── types/stocks.ts                    # Keep current summary/detail types; no backend-contract churn
```

### Pattern 1: Keep Latest Detail Independent From History
**What:** The existing latest stock detail query remains the page-level source for hero and current-decision sections. History is a separate query cluster used only by the `History` section.
**When to use:** Always. This is a locked decision, not an option.
**Example:**
```tsx
// Source: repo contract + TanStack dependent query docs
const { data: liveStock, isLoading, error } = useStock(ticker, locale)
const mockStock = getStockByTicker(ticker)
const stock = liveStock ?? mockStock
const useMockHistory = !liveStock && !!mockStock

const reportsQuery = useStockReports(ticker, locale, {
  enabled: !!liveStock && !useMockHistory,
})
```

### Pattern 2: Summary First, Detail Lazy, Merge At The Frontend
**What:** Fetch revision summaries first, then fetch the selected and compare details lazily. When detail arrives, merge it onto the matching summary row so the UI receives a full `HistoricalReportDetail`.
**When to use:** For the selected revision and the optional compare revision.
**Example:**
```ts
// Source: repo types + backend contract files
function mergeHistoricalDetail(
  summary: HistoricalReportSummary,
  detail: StockDetail,
): HistoricalReportDetail {
  return {
    ...summary,
    currentPriceImpliesBrief:
      detail.currentPriceImpliesBrief ?? detail.currentPriceImplies,
    currentPriceImplies: detail.currentPriceImplies,
    changeSummary: detail.provisionalConclusion ?? detail.summary,
    monitorNext: detail.monitorNext,
  }
}
```

### Pattern 3: Use Dependent Queries With `enabled`
**What:** Detail queries should not run until the summary list resolves a concrete `reportId`. TanStack Query’s `enabled` option is the standard dependent-query control.
**When to use:** Selected detail and compare detail fetches.
**Example:**
```tsx
// Source: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
const selectedDetailQuery = useQuery({
  queryKey: ['stock-report-detail', ticker, selectedId, locale],
  queryFn: () => fetchStockReportDetail(ticker, selectedId!, locale),
  enabled: Boolean(selectedId),
  staleTime: 5 * 60 * 1000,
})

const compareDetailQuery = useQuery({
  queryKey: ['stock-report-detail', ticker, compareId, locale],
  queryFn: () => fetchStockReportDetail(ticker, compareId!, locale),
  enabled: Boolean(compareId),
  staleTime: 5 * 60 * 1000,
})
```

### Pattern 4: Section-Level Degradation
**What:** History list failure, selected-detail failure, and compare-detail failure must render as local states inside the `History` section instead of throwing page-level errors.
**When to use:** Any failure from `/reports` or `/reports/{reportId}` when `useStock` succeeded.
**Example:**
```tsx
// Source: repo page fallback boundary + locked D-07/D-09 decisions
<HistoricalRevisionLedger
  reports={resolvedReports}
  reportDetails={resolvedDetails}
  legacyItems={historyItems}
  listState={reportsQueryState}
  selectedDetailState={selectedDetailState}
  compareDetailState={compareDetailState}
/>
```

### Anti-Patterns to Avoid
- **Live latest + mock history mixing:** The current page does this today; Phase 7 must remove it.
- **Putting history on the page error boundary:** Violates D-07 and regresses the latest-detail experience.
- **Dropping summary metadata after detail fetch:** Detail payloads do not carry `localeHasFallback`, `latest`, or `provenance`; merge instead of replace.
- **Inferring fallback by inspecting strings at render time:** Use backend `localeHasFallback` from the summary row.
- **Prefetching every historical detail on first paint:** TanStack docs note dependent queries create waterfalls; here the locked decision is to limit that waterfall to selected/compare only, not every revision.
- **Changing latest-detail backend contracts in this phase:** Out of scope unless a proven blocker appears.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-report detail cache | Manual `useState` map + custom dedupe | TanStack Query keyed cache | Existing stack already gives cache reuse by `queryKey` |
| Locale fallback detection | UI-side string inspection | Backend `localeHasFallback` on the summary row | Phase 5 and 6 already locked this contract |
| Compare delta ordering | Ad hoc click-order logic | Existing `CompareMetricDiff` publishedAt sort rule | Phase 5 already fixed delta semantics |
| Latest row marking | Client-side latest inference from arbitrary data | Backend `latest` flag plus desc list order | Contract is already verified in Phase 6 |
| Empty/error shell styling | New one-off layout system | Existing panel chrome plus local history states | Keeps the dark research-cockpit language consistent |

**Key insight:** This phase is wiring and state orchestration. Custom caching, locale logic, or contract reshaping would only duplicate behavior the repo already owns.

## Common Pitfalls

### Pitfall 1: Mixing Live Latest Detail With Mock History
**What goes wrong:** The page shows a live latest stock with mock historical revisions.
**Why it happens:** `stock-detail-page.tsx` currently falls back to `mockStock.historicalReports` and `mockStock.historicalReportDetails` even when `liveStock` exists.
**How to avoid:** Gate mock history behind `!liveStock`; once the page is live, history must also be live.
**Warning signs:** A live stock page shows mock report IDs like `tsm-20260316-full-review` even when the backend reports API errors or returns empty.

### Pitfall 2: Replacing Summary Rows With Raw Detail Payloads
**What goes wrong:** Fallback badges, provenance chips, or `latest` markers disappear in selected/compare cards.
**Why it happens:** `/reports/{reportId}` returns the historical `StockDetail` payload, not the full `HistoricalReportDetail` UI contract.
**How to avoid:** Merge detail onto the matching summary row.
**Warning signs:** `localeHasFallback` becomes inaccessible after detail loads.

### Pitfall 3: Collapsing The Whole Page On History Failure
**What goes wrong:** A list or compare-detail failure replaces the entire stock page with the generic `ErrorState`.
**Why it happens:** The page currently has only a page-level loading/error model.
**How to avoid:** Keep `useStock` as the page boundary and add local history states.
**Warning signs:** `/reports` 500s make hero, scenarios, and latest thesis disappear.

### Pitfall 4: Fetching Detail Too Early Or Too Often
**What goes wrong:** The page issues unnecessary detail requests for every revision, or refetches the same revision repeatedly.
**Why it happens:** Missing `enabled` guards or unstable query keys.
**How to avoid:** Use `['stock-report-detail', ticker, reportId, locale]` keys and `enabled: Boolean(reportId)`.
**Warning signs:** Network panel shows detail fetches for non-selected rows on initial render.

### Pitfall 5: Compare-Side Error Clears Base Selection
**What goes wrong:** A failed compare fetch exits compare mode or loses the selected base revision.
**Why it happens:** Compare state is coupled to detail success.
**How to avoid:** Treat compare fetch failure as a local right-card state only.
**Warning signs:** Adding compare on a bad `reportId` resets the left-side base revision.

## Code Examples

Verified patterns from repo truth and official sources:

### Add History Client Endpoints
```ts
// Source: repo API style in web/src/lib/api.ts + backend routes
export async function fetchStockReports(
  ticker: string,
  locale: Locale,
): Promise<HistoricalReportSummary[]> {
  const encodedTicker = encodeURIComponent(ticker)
  const suffix = locale === 'zh-TW' ? '?locale=zh-TW' : ''
  const data = await fetchJson<{ reports: HistoricalReportSummary[] }>(
    `${API_URL}/v1/stocks/${encodedTicker}/reports${suffix}`,
  )
  return data.reports
}

export async function fetchStockReportDetail(
  ticker: string,
  reportId: string,
  locale: Locale,
): Promise<StockDetail> {
  const encodedTicker = encodeURIComponent(ticker)
  const encodedReportId = encodeURIComponent(reportId)
  const suffix = locale === 'zh-TW' ? '?locale=zh-TW' : ''
  return fetchJson<StockDetail>(
    `${API_URL}/v1/stocks/${encodedTicker}/reports/${encodedReportId}${suffix}`,
  )
}
```

### Orchestrate Selected And Compare Detail Queries
```tsx
// Source: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
const selectedId = resolvedSelectedIdFromReports(reportsQuery.data)
const compareId = compareSelection

const selectedDetailQuery = useStockReportDetail(ticker, selectedId, locale, {
  enabled: Boolean(selectedId),
})

const compareDetailQuery = useStockReportDetail(ticker, compareId, locale, {
  enabled: Boolean(compareId),
})
```

### Preserve Compare Delta Semantics
```tsx
// Source: web/src/components/detail/historical-revision-ledger.tsx
const [newer, older] =
  base.publishedAtMs >= compare.publishedAtMs
    ? [base, compare]
    : [compare, base]

const baseDiff = newer.baseFairValue - older.baseFairValue
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Mock history or legacy text list inside `StockDetailPage` | Structured revision ledger UI with summary/detail types | Phase 4-5, completed 2026-03-24 | Frontend contract is already ready for API wiring |
| `/v1/stocks/{ticker}/reports` as metadata-only | `/v1/stocks/{ticker}/reports` returns frontend-aligned summary rows | Phase 6, completed 2026-03-24 | Frontend can render the list directly without R2-key knowledge |
| Historical detail assumed to fall back to summary JSON | Historical detail is `zh-TW detail -> EN detail -> 404` | Phase 6 verification on 2026-03-24 | Frontend must merge summary metadata onto detail payloads |
| Page-level mock fallback for history | Live history section with local section states and mock history only when whole page is mock | Phase 7 target | Removes live/mock inconsistency without changing latest-detail UX |

**Deprecated/outdated:**
- Older NotebookLM notes describing `/reports` as metadata-only: outdated, contradicted by current repo files and Phase 6 verification.
- Older NotebookLM notes implying summary fallback during historical detail reads: outdated, contradicted by `report_detail_handler.go` and verification.

## Open Questions

1. **What exact inline copy should history loading/error states use?**
   - What we know: the dark research-cockpit language should stay intact, and section-level states are required.
   - What's unclear: the precise EN/zh-TW copy for list-failure, selected-detail loading, and compare-side failure.
   - Recommendation: keep this as a small UI-copy decision inside planning; it is not a contract blocker.

2. **Should the ledger component own async-state rendering or should the page pre-resolve it?**
   - What we know: the component is currently presentation-first and assumes fully resolved data.
   - What's unclear: whether to extend `HistoricalRevisionLedger` props with explicit query-state props or wrap it with a thin container.
   - Recommendation: prefer a thin container in `stock-detail-page.tsx` unless prop growth becomes unwieldy; avoid moving fetch logic into the ledger component itself.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Frontend build/dev | ✓ | `v22.22.1` | — |
| pnpm | Frontend install/lint/build | ✓ | `10.23.0` | `npm` possible, but repo lockfile is pnpm-first |
| Go | Backend contract verification / local backend work | ✓ | `go1.25.4` | — |
| Local backend API on `http://localhost:8080` | Live manual smoke of `/v1/stocks/*` through Vite proxy | ✗ | — | Start backend before E2E manual verification |

**Missing dependencies with no fallback:**
- Local backend process for live manual smoke is currently down. Static lint/build still works, but true API-integration verification needs the backend started.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No frontend behavior test runner detected; current automated validation is ESLint 9.39.4 + TypeScript 5.9.3 + Vite 8.0.0 |
| Config file | `web/eslint.config.js`, `web/tsconfig.json`, `web/vite.config.ts` |
| Quick run command | `cd web && pnpm lint` |
| Full suite command | `cd web && pnpm lint && pnpm build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTH-01 | Live history list/detail wiring does not regress current latest-detail page behavior | static + manual integration | `cd web && pnpm lint && pnpm build` | ❌ Wave 0 |
| INTH-02 | Mixed-locale selected/compare states show correct fallback labels per card | manual-only today | `—` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `cd web && pnpm lint`
- **Per wave merge:** `cd web && pnpm lint && pnpm build`
- **Phase gate:** `cd web && pnpm lint && pnpm build`, then manual live smoke with backend running on `localhost:8080`

### Wave 0 Gaps
- [ ] `web/src/pages/stock-detail-page.test.tsx` — verify live latest path does not fall back to mock history when live stock exists
- [ ] `web/src/components/detail/historical-revision-ledger.test.tsx` — verify selected/compare loading, empty, and compare-side error states
- [ ] Frontend test framework install and config — Vitest + React Testing Library are not present in the repo today

## Sources

### Primary (HIGH confidence)
- Repository files:
  - `.planning/phases/07-frontend-api-integration-for-historical-reports/07-CONTEXT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/STATE.md`
  - `.planning/ROADMAP.md`
  - `.planning/phases/05-interaction-contract-and-frontend-history-data-model/05-CONTEXT.md`
  - `.planning/phases/06-historical-report-read-model-and-backend-apis/06-02-SUMMARY.md`
  - `.planning/phases/06-historical-report-read-model-and-backend-apis/06-03-SUMMARY.md`
  - `.planning/phases/06-historical-report-read-model-and-backend-apis/06-VERIFICATION.md`
  - `web/docs/historical-analysis-reports-prd.md`
  - `web/src/pages/stock-detail-page.tsx`
  - `web/src/components/detail/historical-revision-ledger.tsx`
  - `web/src/lib/api.ts`
  - `web/src/lib/queries.ts`
  - `web/src/types/stocks.ts`
  - `web/src/data/mock-stocks.ts`
  - `web/src/i18n/messages.ts`
  - `web/package.json`
  - `web/vite.config.ts`
  - `be/lib/app/stocks/reports_list_handler.go`
  - `be/lib/app/stocks/history_summary_contract.go`
  - `be/lib/app/stocks/report_detail_handler.go`
- Official docs:
  - `https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries`
  - `https://tanstack.com/query/v5/docs/framework/react/reference/useQuery`
- Registry verification:
  - `npm view react version`
  - `npm view @tanstack/react-query version`
  - `npm view @tanstack/react-router version`
  - `npm view vite version`
  - `npm view typescript version`

### Secondary (MEDIUM confidence)
- NotebookLM project notebook query for prior architecture notes and mismatch discovery, verified against repo files

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - repo pins, lockfile, runtime availability, and npm registry checks all agree
- Architecture: HIGH - phase decisions, current code, and backend verification artifacts align cleanly
- Pitfalls: HIGH - each pitfall maps to an existing code path or a locked phase decision

**Research date:** 2026-03-24
**Valid until:** 2026-04-07
