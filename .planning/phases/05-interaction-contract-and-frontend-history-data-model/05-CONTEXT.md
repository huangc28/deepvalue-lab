# Phase 5: Interaction Contract And Frontend History Data Model - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Lock the frontend history data contract and interaction rules so Phase 6 (backend) and Phase 7 (API integration) have a stable, unambiguous target to implement against.

Scope:
- Split the mockup-era fat `HistoricalReport` type into `HistoricalReportSummary` and `HistoricalReportDetail`
- Update `HistoricalRevisionLedger` and all sub-components to use the new types
- Lock the compare delta direction convention as a named rule
- Surface locale fallback explicitly in selected-revision and compare states
- Update mock data to conform to the new type shapes
- No new UI features, no backend changes, no API integration

</domain>

<decisions>
## Implementation Decisions

### Type split
- Split `HistoricalReport` into two types:
  - `HistoricalReportSummary` — used for ledger list rows (left column). Contains: `reportId`, `publishedAtMs`, `provenance`, `valuationStatus`, `thesisStatus`, `technicalEntryStatus`, `currentPrice`, `bearFairValue`, `baseFairValue`, `bullFairValue`, `summary: LocalizedText`, `latest?: boolean`, and a locale fallback metadata field (see below).
  - `HistoricalReportDetail` — used for snapshot and compare panels (right column). Extends or embeds Summary fields and adds: `currentPriceImpliesBrief: LocalizedText`, `currentPriceImplies: LocalizedText`, `changeSummary: LocalizedText`, `monitorNext: LocalizedText[]`.
- `HistoricalRevisionLedger` receives `reports: HistoricalReportSummary[]` for the list.
- The snapshot and compare panels receive `HistoricalReportDetail` for the selected/compare revision.
- Phase 5 continues to use mock data — both summary and detail are pre-loaded. Async detail loading is deferred to Phase 7.

### `publishedAtMs` as canonical timestamp
- `publishedAtMs` is the single source of truth for revision identity, sort order, and display date.
- No secondary date fields on either type.

### Locale fallback labeling
- When any `LocalizedText` field in a revision falls back from zh-TW to EN, a single line at the top of the card (SelectedRevisionCard or CompareRevisionCard) reads something like "部分內容以英文顯示" or "Shown in English".
- One indicator per card, not one per field — keeps the visual clean.
- The indicator is only shown when the active locale is zh-TW and at least one field is a fallback. In EN locale it is always hidden.
- Implementation: add a `localeHasFallback: boolean` field to `HistoricalReportSummary` (computed from the mock data, and later from the API response). The component reads this flag instead of inspecting individual text fields at render time.

### Compare delta direction convention
- Delta = **newer revision value − older revision value**.
- "Base" = the more recently published revision (higher `publishedAtMs`). "Compare" = the older revision (lower `publishedAtMs`).
- This is enforced by the component: before computing deltas, sort the two revisions by `publishedAtMs` and assign base/compare accordingly, regardless of which one the user clicked first.
- Positive delta means the metric is higher in the newer revision than in the older one.
- This convention must be documented in a comment near `CompareMetricDiff` so Phase 6 backend and Phase 7 integration agents can verify alignment.

### Detail loading
- Phase 5 keeps mock data pre-loaded. Component interface does not add `detailLoading` or `selectedDetail` props yet.
- Async loading contract is deferred to Phase 7.

### Claude's Discretion
- Exact field grouping inside `HistoricalReportDetail` (whether it extends Summary or wraps it)
- Exact wording of the locale fallback indicator string and its visual treatment (subtle muted text, consistent with existing panel chrome)
- Whether `localeHasFallback` is computed in mock data manually or via a utility function

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone spec
- `web/docs/historical-analysis-reports-prd.md` — milestone-level behavior, UX rules, API shape expectations for Phases 6 and 7

### Current type definitions and mock data
- `web/src/types/stocks.ts` — current `HistoricalReport` fat type to be split; `StockDetail.historicalReports` field to be updated
- `web/src/data/mock-stocks.ts` — mock data source that must be updated to match new summary/detail types

### Phase 4 component output
- `web/src/components/detail/historical-revision-ledger.tsx` — the component to be updated; contains `HistoricalRevisionLedger`, `ComparePanel`, `CompareMetricDiff`, `SelectedRevisionCard`, `RevisionTrend`

### i18n
- `web/src/i18n/messages.ts` — locale strings; may need a new key for the fallback indicator label

### Phase 4 decisions reference
- `.planning/phases/04-historical-revision-ledger-mockup/04-CONTEXT.md` — locked interaction model (compare mode rules, visual direction, stop gate)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `HistoricalRevisionLedger` — already split into sub-components (`ComparePanel`, `CompareMetricDiff`, `SelectedRevisionCard`, `RevisionTrend`); type surgery can be applied sub-component by sub-component
- `useI18n()` hook exposes `locale` — sufficient to determine when fallback labeling applies
- `text(localizedText)` utility — returns the resolved string; does not currently expose whether a fallback occurred

### Established Patterns
- `LocalizedText` is the canonical bilingual field type; all user-facing text uses it
- Status badges, panel chrome, and chip components already exist and should not change in this phase
- Mock data lives in `web/src/data/mock-stocks.ts`; the `historicalReports` array was introduced in Phase 4

### Integration Points
- `StockDetail.historicalReports?: HistoricalReport[]` — needs to become `historicalReports?: HistoricalReportSummary[]` plus a separate `historicalReportDetails?: Record<string, HistoricalReportDetail>` lookup, or an equivalent structure that lets Phase 7 slot in API calls without restructuring the page
- `web/src/pages/stock-detail-page.tsx` passes `historicalReports` down to `HistoricalRevisionLedger` — props will change in this phase

</code_context>

<specifics>
## Specific Ideas

- The `localeHasFallback` flag on `HistoricalReportSummary` is the cleanest way to avoid inspecting every `LocalizedText` field at render time — compute it once at the data layer (mock or API response)
- Delta direction convention comment near `CompareMetricDiff`: "base = newer (higher publishedAtMs), compare = older; delta = base − compare; positive = metric rose since previous revision"

</specifics>

<deferred>
## Deferred Ideas

- Async detail loading (`detailLoading`, `selectedDetail` props) — Phase 7
- Skeleton loading state for snapshot/compare panel — Phase 7
- Raw markdown / original report access — v1.2+ per REQUIREMENTS.md

</deferred>

---

*Phase: 05-interaction-contract-and-frontend-history-data-model*
*Context gathered: 2026-03-24*
