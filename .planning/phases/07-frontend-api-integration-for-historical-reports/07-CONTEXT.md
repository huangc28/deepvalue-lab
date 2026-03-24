# Phase 7: Frontend API Integration For Historical Reports - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Connect the existing historical revision ledger UI to the live backend historical report APIs without changing the current stock-detail reading order or regressing the latest-detail path.

Scope:
- fetch revision summaries from `GET /v1/stocks/{ticker}/reports`
- fetch structured historical details from `GET /v1/stocks/{ticker}/reports/{reportId}`
- support selected-revision and compare mode with live data
- preserve the current latest stock detail fetch via `GET /v1/stocks/{ticker}`
- add section-level loading, empty, and error handling for the history surface

Out of scope:
- new backend contract work unless the frontend hits a proven blocker
- raw markdown/original report access
- new history features beyond the existing Phase 4 and Phase 5 interaction contract

</domain>

<decisions>
## Implementation Decisions

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product and requirements
- `web/docs/historical-analysis-reports-prd.md` — milestone behavior, required API usage, compare rules, fallback expectations
- `.planning/REQUIREMENTS.md` — `INTH-01` and `INTH-02`, plus the milestone out-of-scope guardrails
- `.planning/ROADMAP.md` — Phase 7 goal, success criteria, and dependency chain

### Locked prior decisions
- `.planning/phases/04-historical-revision-ledger-mockup/04-CONTEXT.md` — locked revision-ledger interaction model and visual direction
- `.planning/phases/05-interaction-contract-and-frontend-history-data-model/05-CONTEXT.md` — locked summary/detail split, compare delta convention, and locale fallback labeling
- `.planning/phases/06-historical-report-read-model-and-backend-apis/06-02-SUMMARY.md` — repo-truth summary API contract for `/v1/stocks/{ticker}/reports`
- `.planning/phases/06-historical-report-read-model-and-backend-apis/06-03-SUMMARY.md` — repo-truth detail API contract for `/v1/stocks/{ticker}/reports/{reportId}`
- `.planning/phases/06-historical-report-read-model-and-backend-apis/06-VERIFICATION.md` — verified Phase 6 behavior and the NotebookLM mismatch resolved in favor of repo truth

### Frontend integration points
- `web/src/pages/stock-detail-page.tsx` — current latest-detail fetch path and current mock-history fallback that Phase 7 must replace
- `web/src/components/detail/historical-revision-ledger.tsx` — existing selection, compare, and fallback-label rendering contract
- `web/src/lib/api.ts` — current API client surface; missing historical report endpoints
- `web/src/lib/queries.ts` — current React Query hooks; Phase 7 will add report-list/detail query hooks here or alongside it
- `web/src/types/stocks.ts` — frontend history summary/detail types and the `historicalReportDetails` lookup shape
- `web/src/i18n/messages.ts` — existing history labels, compare copy, and fallback-indicator strings

### Backend contracts
- `be/lib/app/stocks/reports_list_handler.go` — live historical summary endpoint
- `be/lib/app/stocks/history_summary_contract.go` — locale-aware summary shaping and `localeHasFallback`
- `be/lib/app/stocks/report_detail_handler.go` — live historical detail endpoint and locale resolution behavior

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `HistoricalRevisionLedger` already owns the selected-vs-compare interaction model and only needs live `reports` plus `reportDetails` data wired into it
- `useStock(...)` and the existing stock detail page already separate page-level loading and 404 handling for the latest detail path
- React Query is already in use for stock list/detail reads, so historical summaries/details can follow the same fetch-and-cache pattern

### Established Patterns
- Latest detail remains a dedicated fetch (`GET /v1/stocks/{ticker}`) and should stay independent from historical reads
- The page already prefers live backend data and only falls back to mocks when no live stock is available
- Locale fallback indicators are rendered from a boolean metadata field, not by inspecting every localized field at render time

### Integration Points
- `web/src/lib/api.ts` currently exposes only latest stock list/detail requests; Phase 7 needs new historical report client functions
- `web/src/pages/stock-detail-page.tsx` currently derives `historicalReports` and `historicalReportDetails` from live payload-or-mock payload, which causes live latest detail to coexist with mock history
- Backend APIs for both history summary and detail are already available, so Phase 7 should treat frontend wiring as the main work rather than reopening backend scope

</code_context>

<specifics>
## Specific Ideas

- Repo truth overrides stale NotebookLM notes here: older second-brain material still described `/v1/stocks/{ticker}/reports` as metadata-only and implied summary fallback on detail reads, but the current repository already serves frontend-aligned summaries and historical detail uses `zh-TW detail -> EN detail -> 404`.
- The cleanest frontend shape is to keep summary rows authoritative for list metadata (`latest`, `provenance`, `localeHasFallback`) and merge each fetched detail payload onto that summary row to build `HistoricalReportDetail`.
- Section-level degradation matters more than page-level purity in this phase: if history APIs fail, the rest of the live stock detail page should still read normally.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-frontend-api-integration-for-historical-reports*
*Context gathered: 2026-03-24*
