# Phase 5: Interaction Contract And Frontend History Data Model - Research

**Researched:** 2026-03-24
**Domain:** TypeScript type system, React component prop contracts, i18n locale fallback, mock data patterns
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Type split**
- Split `HistoricalReport` into two types:
  - `HistoricalReportSummary` — used for ledger list rows (left column). Contains: `reportId`, `publishedAtMs`, `provenance`, `valuationStatus`, `thesisStatus`, `technicalEntryStatus`, `currentPrice`, `bearFairValue`, `baseFairValue`, `bullFairValue`, `summary: LocalizedText`, `latest?: boolean`, and a locale fallback metadata field.
  - `HistoricalReportDetail` — used for snapshot and compare panels (right column). Extends or embeds Summary fields and adds: `currentPriceImpliesBrief: LocalizedText`, `currentPriceImplies: LocalizedText`, `changeSummary: LocalizedText`, `monitorNext: LocalizedText[]`.
- `HistoricalRevisionLedger` receives `reports: HistoricalReportSummary[]` for the list.
- Snapshot and compare panels receive `HistoricalReportDetail` for the selected/compare revision.
- Phase 5 continues to use mock data — both summary and detail are pre-loaded. Async detail loading is deferred to Phase 7.

**`publishedAtMs` as canonical timestamp**
- `publishedAtMs` is the single source of truth for revision identity, sort order, and display date.
- No secondary date fields on either type.

**Locale fallback labeling**
- When any `LocalizedText` field in a revision falls back from zh-TW to EN, a single line at the top of the card reads "部分內容以英文顯示" or "Shown in English".
- One indicator per card, not one per field.
- The indicator is only shown when the active locale is zh-TW and at least one field is a fallback. In EN locale it is always hidden.
- Implementation: add a `localeHasFallback: boolean` field to `HistoricalReportSummary`. The component reads this flag instead of inspecting individual text fields at render time.

**Compare delta direction convention**
- Delta = **newer revision value − older revision value**.
- "Base" = the more recently published revision (higher `publishedAtMs`). "Compare" = the older revision (lower `publishedAtMs`).
- This is enforced by the component: before computing deltas, sort the two revisions by `publishedAtMs` and assign base/compare accordingly, regardless of which one the user clicked first.
- Positive delta means the metric is higher in the newer revision.
- This convention must be documented in a comment near `CompareMetricDiff`.

**Detail loading**
- Phase 5 keeps mock data pre-loaded. Component interface does not add `detailLoading` or `selectedDetail` props yet.
- Async loading contract is deferred to Phase 7.

### Claude's Discretion
- Exact field grouping inside `HistoricalReportDetail` (whether it extends Summary or wraps it)
- Exact wording of the locale fallback indicator string and its visual treatment (subtle muted text, consistent with existing panel chrome)
- Whether `localeHasFallback` is computed in mock data manually or via a utility function

### Deferred Ideas (OUT OF SCOPE)
- Async detail loading (`detailLoading`, `selectedDetail` props) — Phase 7
- Skeleton loading state for snapshot/compare panel — Phase 7
- Raw markdown / original report access — v1.2+ per REQUIREMENTS.md
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FEH-01 | Frontend history surfaces use structured historical summary/detail types with canonical `publishedAtMs` | Type split design, StockDetail integration pattern, mock data migration approach |
| FEH-02 | Frontend labels locale fallback explicitly in single-revision and compare views | `localeHasFallback` flag design, i18n message key strategy, component injection point |
</phase_requirements>

---

## Summary

Phase 5 is a TypeScript type surgery and component wiring phase with no new UI features. The fat `HistoricalReport` type used in Phase 4 conflates list-row fields with detail-panel fields. Splitting it into `HistoricalReportSummary` and `HistoricalReportDetail` creates a stable interface boundary that Phase 6 (backend) and Phase 7 (API integration) can implement against without further frontend restructuring.

The current code in `historical-revision-ledger.tsx` passes a single `HistoricalReport` type into all sub-components: `HistoricalRevisionLedger` (list), `SelectedRevisionCard` (snapshot panel), `CompareRevisionCard` and `CompareMetricDiff` (compare panel). The type split requires updating each sub-component's props independently. `HistoricalRevisionLedger` moves to `HistoricalReportSummary[]` for the list. The detail panels move to `HistoricalReportDetail`. The parent component resolves the selected/compare detail objects from a pre-loaded detail lookup that mirrors the future API shape.

The locale fallback indicator is a single boolean flag (`localeHasFallback`) on `HistoricalReportSummary`. This is more reliable than inspecting individual `LocalizedText` fields at render time, and it makes the future API transition straightforward because the API response can compute and return the same flag. The existing `text()` utility resolves `LocalizedText` to a string but does not expose fallback status — that gap is intentionally closed at the data layer rather than the render layer.

**Primary recommendation:** Perform the type split in `stocks.ts`, update mock data in `mock-stocks.ts` to match both new shapes, then update sub-components one at a time starting with the list (summary-only change) before moving to detail panels.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | project version (5.x) | Type definitions for Summary/Detail split | Already in use; all types live in `web/src/types/stocks.ts` |
| React | project version (18.x) | Component prop type contracts | Already in use |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `useI18n()` hook | project internal | Expose `locale` for fallback indicator logic | Already used in `historical-revision-ledger.tsx`; sufficient for determining when to render the fallback label |

**No new npm packages are needed for this phase.** All work is type-level and component-level changes within the existing codebase.

## Architecture Patterns

### Recommended Project Structure

No new directories or files required. All changes are surgical:

```
web/src/
├── types/stocks.ts                           # Add HistoricalReportSummary, HistoricalReportDetail; remove HistoricalReport or alias it for backward compat
├── data/mock-stocks.ts                       # Update tsmHistoricalReports and adbeHistoricalReports to new shapes; add detail lookup map
├── components/detail/
│   └── historical-revision-ledger.tsx        # Update all sub-component prop types
├── pages/stock-detail-page.tsx               # Update historicalReports prop type and detail lookup wiring
└── i18n/messages.ts                          # Add one new key for locale fallback indicator label
```

### Pattern 1: Summary/Detail Type Split

**What:** `HistoricalReportSummary` carries only the fields needed to render a list row. `HistoricalReportDetail` carries the full snapshot — either by extending Summary or embedding it. The split matches the PRD's recommended data model.

**When to use:** Whenever list and detail have different data requirements and will be fetched separately in the future (here: `GET /reports` vs `GET /reports/{id}`).

**Example — type definitions:**
```typescript
// web/src/types/stocks.ts

export interface HistoricalReportSummary {
  reportId: string
  publishedAtMs: number
  provenance: HistoricalReportProvenance
  valuationStatus: ValuationStatus
  thesisStatus: ThesisStatus
  technicalEntryStatus: TechnicalEntryStatus
  currentPrice: number
  bearFairValue: number
  baseFairValue: number
  bullFairValue: number
  summary: LocalizedText
  localeHasFallback: boolean   // computed at data layer; true when zh-TW content is unavailable for any field
  latest?: boolean
}

export interface HistoricalReportDetail extends HistoricalReportSummary {
  currentPriceImpliesBrief: LocalizedText
  currentPriceImplies: LocalizedText
  changeSummary: LocalizedText
  monitorNext: LocalizedText[]
}
```

**Why extend rather than wrap:** Extending avoids double-indirection (`detail.summary.summary`) and keeps the component props simple — a `HistoricalReportDetail` is also assignable to `HistoricalReportSummary`, which makes it usable anywhere a summary is expected without casting.

### Pattern 2: Detail Lookup Map on StockDetail

**What:** `StockDetail.historicalReports` becomes `HistoricalReportSummary[]`. A parallel `historicalReportDetails` field holds a `Record<string, HistoricalReportDetail>` keyed by `reportId`. This separates list data from detail data without requiring a new component API in Phase 5.

**When to use:** Whenever list and detail will be loaded separately in a future phase. The map shape directly mirrors what Phase 7 API integration will slot into.

**Example — StockDetail update:**
```typescript
// web/src/types/stocks.ts
export interface StockDetail extends StockSummary {
  // ... existing fields ...
  historicalReports?: HistoricalReportSummary[]
  historicalReportDetails?: Record<string, HistoricalReportDetail>
}
```

**Example — component usage in HistoricalRevisionLedger:**
```typescript
// Parent resolves detail objects from the lookup before passing them to detail panels
const selectedDetail = props.reportDetails?.[resolvedSelectedId] ?? null
const compareDetail = resolvedCompareId
  ? (props.reportDetails?.[resolvedCompareId] ?? null)
  : null
```

### Pattern 3: Delta Direction Enforcement in CompareMetricDiff

**What:** Before computing deltas, the component sorts the two incoming `HistoricalReportDetail` objects by `publishedAtMs` and assigns the higher-timestamp one as `newer` (base) and the lower-timestamp one as `older` (compare). The caller does not need to guarantee order.

**When to use:** Any time the compare panel may receive arguments in either order (user clicks revision A first, then B, or B first, then A).

**Example — delta enforcement comment block:**
```typescript
// CompareMetricDiff delta direction convention:
//   base   = the more recently published revision (higher publishedAtMs)
//   compare = the older revision (lower publishedAtMs)
//   delta   = base − compare (positive means metric rose since the previous revision)
// This component enforces order regardless of which argument was passed as base/compare.
const [newer, older] =
  base.publishedAtMs >= compare.publishedAtMs
    ? [base, compare]
    : [compare, base]

const priceDiff = newer.currentPrice - older.currentPrice
const baseDiff  = newer.baseFairValue - older.baseFairValue
const bearDiff  = newer.bearFairValue - older.bearFairValue
const bullDiff  = newer.bullFairValue - older.bullFairValue
```

### Pattern 4: Locale Fallback Indicator Injection

**What:** `SelectedRevisionCard` and `CompareRevisionCard` read `report.localeHasFallback` and the current `locale` from `useI18n()`. They render a single muted indicator line at the top of the card only when `locale === 'zh-TW' && report.localeHasFallback`.

**When to use:** Anywhere a detail card renders `LocalizedText` fields that may resolve to their EN fallback.

**Example — indicator in SelectedRevisionCard:**
```typescript
const { locale, m } = useI18n()
const showFallbackIndicator = locale === 'zh-TW' && report.localeHasFallback

// At the top of the card, before other content:
{showFallbackIndicator ? (
  <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
    {m.detail.historyLocaleFallbackIndicator}
  </p>
) : null}
```

**i18n message key to add:**
```typescript
// In both en and zh-TW branches of messages.ts, under detail:
historyLocaleFallbackIndicator: 'Shown in English'  // en
historyLocaleFallbackIndicator: '部分內容以英文顯示'  // zh-TW
```

### Pattern 5: localeHasFallback Computation in Mock Data

**What:** For Phase 5, `localeHasFallback` is set manually on each mock object. TSM revisions all have bilingual `LocalizedText` objects, so `localeHasFallback: false`. The ADBE revision uses plain English strings (not `Record<Locale, string>`), so `localeHasFallback: true`.

**Implementation note:** `LocalizedText = string | Record<Locale, string>`. A plain `string` type means only EN content exists — this is the fallback case. A `Record<Locale, string>` with both `en` and `zh-TW` populated means no fallback.

**Optional utility — compute at data layer, not at render time:**
```typescript
function computeLocaleHasFallback(fields: LocalizedText[]): boolean {
  return fields.some((field) => typeof field === 'string')
}
```

This utility can be used when building mock summary objects and later when transforming API responses in Phase 7.

### Anti-Patterns to Avoid

- **Checking `typeof field === 'string'` inside render functions:** This spreads locale-awareness across every component that renders a `LocalizedText`. The `localeHasFallback` flag centralizes this at the data layer.
- **Passing a full `HistoricalReport` (fat type) into both list rows and detail panels:** This is the Phase 4 pattern being replaced. The list only needs summary fields; passing detail fields into list rows couples them unnecessarily.
- **Modifying the component API to add `detailLoading` or `selectedDetail` props:** This is explicitly deferred to Phase 7. Phase 5 keeps the component interface stable and pre-loads all detail objects from the mock lookup.
- **Deleting `HistoricalReport` without checking downstream consumers:** Confirm whether `HistoricalReport` is referenced anywhere outside `mock-stocks.ts` and `historical-revision-ledger.tsx` before removing it. An alias `type HistoricalReport = HistoricalReportDetail` may be needed as a transitional shim.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting which `LocalizedText` fields resolved via fallback | Per-field runtime inspection in each component | `localeHasFallback: boolean` flag set at the data layer | Inspecting `typeof field === 'string'` in every render function creates maintenance burden and is fragile if `LocalizedText` type evolves |
| Compare order enforcement | Caller-side sorting before passing props | Delta direction enforcement inside `CompareMetricDiff` | The component is the right place to enforce the convention — it can't be violated by call-site mistakes, and the convention comment lives near the logic it documents |

**Key insight:** In this phase all complexity is at the type-level. The hard work is making the type definitions stable enough that Phase 6 and Phase 7 agents can target them without renegotiating the contract.

## Common Pitfalls

### Pitfall 1: Type Drift Between Summary and Detail
**What goes wrong:** `HistoricalReportDetail` and `HistoricalReportSummary` diverge in naming or field order as each is modified independently, causing Phase 7 to need reconciliation work.
**Why it happens:** Detail fields are added to Summary by accident, or Summary fields are removed from Detail.
**How to avoid:** Make `HistoricalReportDetail` explicitly extend `HistoricalReportSummary` (interface extension). TypeScript will enforce that all Summary fields remain present on Detail.
**Warning signs:** A component that accepts `HistoricalReportSummary` cannot receive a `HistoricalReportDetail` — type error means extension was broken.

### Pitfall 2: Mock Data Shape Mismatch
**What goes wrong:** `tsmHistoricalReports` and `adbeHistoricalReports` are typed as `HistoricalReport[]` (Phase 4 fat type). After the split, the mock arrays must be updated to the new shape or TypeScript compilation fails.
**Why it happens:** Mock data update is forgotten when types are changed first.
**How to avoid:** Update mock data in the same task/commit as the type definitions. TypeScript will surface all assignment errors immediately.
**Warning signs:** `pnpm build` or `pnpm lint` errors in `mock-stocks.ts` pointing to missing fields.

### Pitfall 3: adbeHistoricalReports Uses Plain String Fields
**What goes wrong:** The ADBE mock data uses plain English strings (not `Record<Locale, string>`) for `summary`, `currentPriceImpliesBrief`, etc. After the type split, these fields must remain valid `LocalizedText` while `localeHasFallback` is set to `true` to signal the fallback condition.
**Why it happens:** The ADBE mock was intentionally created as an English-only single-revision case in Phase 4 to test the single-revision state.
**How to avoid:** Keep the plain string fields as-is (they are valid `LocalizedText`) and explicitly set `localeHasFallback: true` on the ADBE mock summary. This becomes the test case that validates the fallback indicator rendering.
**Warning signs:** Fallback indicator not appearing when browsing ADBE in zh-TW locale.

### Pitfall 4: Compare Delta Bug — Argument Order Dependence
**What goes wrong:** `CompareMetricDiff` currently receives `base` and `compare` from the caller without enforcing which is newer. If the user clicks the older revision first (making it `selectedId`) and the newer revision second (making it `compareId`), the delta signs flip.
**Why it happens:** Phase 4 `ComparePanel` passes `baseReport={selectedReport}` and `compareReport={compareReport}` without sorting by `publishedAtMs`. The calling code does not guarantee newer-first order.
**How to avoid:** Enforce sorting inside `CompareMetricDiff` (Pattern 3 above). The component should be the single source of truth for delta direction — callers are not required to guarantee order.
**Warning signs:** A positive price diff (stock went up) shows as negative in the diff row.

### Pitfall 5: StockDetail.historicalReports Type Change Breaks the Live API Path
**What goes wrong:** `stock-detail-page.tsx` uses `stock.historicalReports` which may come from the live API (`liveStock`) or from mock. The live API currently returns `HistoricalReport[]` (if it returns anything) — changing the type to `HistoricalReportSummary[]` may break runtime shape assumptions.
**Why it happens:** The live API is not returning historical reports yet (backend not built). But the TypeScript type on `StockDetail` affects the compile-time contract.
**How to avoid:** Since the backend does not yet return `historicalReports`, the type change is safe. Confirm that no backend client code constructs `HistoricalReport` objects for the response before changing the field type.
**Warning signs:** TypeScript errors in API response transformation code (if any exists) after the type rename.

## Code Examples

### Type Definitions (Final Shape)

```typescript
// web/src/types/stocks.ts

export interface HistoricalReportSummary {
  reportId: string
  publishedAtMs: number
  provenance: HistoricalReportProvenance
  valuationStatus: ValuationStatus
  thesisStatus: ThesisStatus
  technicalEntryStatus: TechnicalEntryStatus
  currentPrice: number
  bearFairValue: number
  baseFairValue: number
  bullFairValue: number
  summary: LocalizedText
  localeHasFallback: boolean
  latest?: boolean
}

export interface HistoricalReportDetail extends HistoricalReportSummary {
  currentPriceImpliesBrief: LocalizedText
  currentPriceImplies: LocalizedText
  changeSummary: LocalizedText
  monitorNext: LocalizedText[]
}

// Keep HistoricalReport as a type alias for the detail shape to prevent
// breaking any code not yet updated. Remove after full migration.
export type HistoricalReport = HistoricalReportDetail

export interface StockDetail extends StockSummary {
  // ... existing fields unchanged ...
  historicalReports?: HistoricalReportSummary[]
  historicalReportDetails?: Record<string, HistoricalReportDetail>
}
```

### HistoricalRevisionLedger Props Update

```typescript
// web/src/components/detail/historical-revision-ledger.tsx

export function HistoricalRevisionLedger({
  reports,
  reportDetails,
  legacyItems,
}: {
  reports?: HistoricalReportSummary[]
  reportDetails?: Record<string, HistoricalReportDetail>
  legacyItems: LocalizedText[]
}) {
  // ...
  const selectedDetail = reportDetails?.[resolvedSelectedId] ?? null
  const compareDetail = resolvedCompareId
    ? (reportDetails?.[resolvedCompareId] ?? null)
    : null

  // Pass selectedDetail (HistoricalReportDetail | null) to SelectedRevisionCard
  // Pass compareDetail (HistoricalReportDetail | null) to ComparePanel
}
```

### stock-detail-page.tsx Wiring Update

```typescript
// web/src/pages/stock-detail-page.tsx

// Existing:
const historicalReports = stock.historicalReports ?? mockStock?.historicalReports

// Add:
const historicalReportDetails =
  stock.historicalReportDetails ?? mockStock?.historicalReportDetails

// In JSX:
<HistoricalRevisionLedger
  reports={historicalReports}
  reportDetails={historicalReportDetails}
  legacyItems={historyItems}
/>
```

### RevisionTrend Props Update

```typescript
// RevisionTrend currently accepts HistoricalReport[] — update to HistoricalReportSummary[]
// The component only uses: reportId, publishedAtMs, currentPrice, baseFairValue
// All four fields are present on HistoricalReportSummary — no other changes needed.
function RevisionTrend({
  reports,
  selectedId,
  compareId,
}: {
  reports: HistoricalReportSummary[]
  selectedId: string | null
  compareId: string | null
})
```

### Mock Data Structure After Split

```typescript
// web/src/data/mock-stocks.ts

import type { HistoricalReportDetail, HistoricalReportSummary } from '../types/stocks'

// Summaries: list-only fields + localeHasFallback
const tsmHistoricalSummaries: HistoricalReportSummary[] = [
  {
    reportId: 'tsm-20260115-init',
    publishedAtMs: Date.UTC(2026, 0, 15),
    provenance: 'manual',
    valuationStatus: 'cheap',
    thesisStatus: 'intact',
    technicalEntryStatus: 'favorable',
    currentPrice: 287,
    bearFairValue: 252,
    baseFairValue: 355,
    bullFairValue: 428,
    summary: { en: '...', 'zh-TW': '...' },
    localeHasFallback: false,
    // latest not set — only the most recent has latest: true
  },
  // ... other summaries ...
]

// Details: keyed lookup for snapshot/compare panels
const tsmHistoricalDetails: Record<string, HistoricalReportDetail> = {
  'tsm-20260115-init': {
    ...tsmHistoricalSummaries[0],
    currentPriceImpliesBrief: { en: '...', 'zh-TW': '...' },
    currentPriceImplies: { en: '...', 'zh-TW': '...' },
    changeSummary: { en: '...', 'zh-TW': '...' },
    monitorNext: [{ en: '...', 'zh-TW': '...' }, { en: '...', 'zh-TW': '...' }],
  },
  // ... other details ...
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Fat `HistoricalReport` type (all fields on one interface) | `HistoricalReportSummary` + `HistoricalReportDetail` split | Phase 5 (this phase) | Enables independent list and detail loading in Phase 7; gives Phase 6 a stable API response target |
| `LocalizedText` fallback detection at render time | `localeHasFallback: boolean` flag on summary, set at data layer | Phase 5 (this phase) | Moves locale awareness out of individual components; future API can return same flag |
| `CompareMetricDiff` assumes caller guarantees base=newer | `CompareMetricDiff` enforces delta direction internally | Phase 5 (this phase) | Eliminates class of delta-sign bugs; convention documented near the code |

**Deprecated/outdated:**
- `HistoricalReport` fat type: used as a transitional alias only; downstream agents should target `HistoricalReportSummary` or `HistoricalReportDetail` directly.

## Open Questions

1. **Should the HistoricalReport alias be kept or removed immediately?**
   - What we know: `HistoricalReport` is imported by `historical-revision-ledger.tsx` and `mock-stocks.ts`. Removing it requires updating both files in the same pass.
   - What's unclear: Whether any other file imports `HistoricalReport`.
   - Recommendation: Grep for `HistoricalReport` imports before deciding. If only those two files use it, remove the alias and do the full migration in one pass. If more files use it, keep the alias until all are updated.

2. **Should `localeHasFallback` be computed via a utility function or set manually?**
   - What we know: The CONTEXT.md leaves this to Claude's discretion.
   - Recommendation: For Phase 5 mock data, compute it via a small utility function `computeLocaleHasFallback(fields: LocalizedText[]): boolean` — this documents the intent and will be reusable in Phase 7 when transforming API responses. Keep it close to the data layer (in `mock-stocks.ts` or a small helper), not inside components.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No dedicated test framework detected in web/ — validation is via TypeScript compiler and build |
| Config file | `web/tsconfig.json`, `web/vite.config.ts` |
| Quick run command | `cd web && pnpm build` |
| Full suite command | `cd web && pnpm lint && pnpm build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FEH-01 | `HistoricalReportSummary` and `HistoricalReportDetail` types exist and are used correctly by all components | compile-time (TypeScript) | `cd web && pnpm build` | ✅ (types/stocks.ts exists; will be updated) |
| FEH-01 | `StockDetail.historicalReports` is `HistoricalReportSummary[]` (not fat type) | compile-time (TypeScript) | `cd web && pnpm build` | ✅ |
| FEH-02 | Locale fallback indicator renders in `SelectedRevisionCard` when `localeHasFallback: true` and locale is zh-TW | manual visual | Open ADBE detail page in zh-TW locale | ❌ (no automated test) |
| FEH-02 | Locale fallback indicator hidden in EN locale even when `localeHasFallback: true` | manual visual | Open ADBE detail page in EN locale | ❌ (no automated test) |
| FEH-02 | Locale fallback indicator renders in `CompareRevisionCard` for the ADBE compare side | manual visual | Compare TSM revision vs EN-only mock (if available) | ❌ (no automated test) |

### Sampling Rate
- **Per task commit:** `cd web && pnpm build` — TypeScript compilation must pass with zero errors
- **Per wave merge:** `cd web && pnpm lint && pnpm build`
- **Phase gate:** Full build green + manual visual review of fallback indicator in both locales before `/gsd:verify-work`

### Wave 0 Gaps
- No automated test files exist for these behaviors — FEH-02 visual behavior requires manual browser verification. This is acceptable for Phase 5 given all changes are type-level and visual; no automated test infrastructure gaps block implementation.

*(FEH-01 is fully covered by TypeScript compilation. FEH-02 requires manual browser review — this is by design for a visual indicator feature in a mock-data phase.)*

## Sources

### Primary (HIGH confidence)
- `/Users/huangchihan/develop/deep-value/web/src/types/stocks.ts` — current `HistoricalReport` fat type, `StockDetail.historicalReports` field
- `/Users/huangchihan/develop/deep-value/web/src/components/detail/historical-revision-ledger.tsx` — all sub-components, current prop contracts, delta computation logic
- `/Users/huangchihan/develop/deep-value/web/src/data/mock-stocks.ts` — `tsmHistoricalReports` and `adbeHistoricalReports` shapes
- `/Users/huangchihan/develop/deep-value/web/src/i18n/messages.ts` — existing history-related message keys in both locales
- `/Users/huangchihan/develop/deep-value/web/src/i18n/types.ts` — `LocalizedText = string | Record<Locale, string>` definition
- `/Users/huangchihan/develop/deep-value/web/docs/historical-analysis-reports-prd.md` — PRD recommended data model (HistoricalReportSummary fields, HistoricalReportDetail as full StockDetail)
- `.planning/phases/05-interaction-contract-and-frontend-history-data-model/05-CONTEXT.md` — locked decisions for this phase

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md` — FEH-01 and FEH-02 requirement definitions
- `.planning/phases/04-historical-revision-ledger-mockup/04-CONTEXT.md` — Phase 4 interaction model decisions (compare mode rules, stop gate)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all technology is already in use in the project
- Architecture: HIGH — type split design is read directly from CONTEXT.md and current code
- Pitfalls: HIGH — sourced from direct code inspection of the current implementation
- Validation approach: HIGH — TypeScript build is the primary gate; manual browser review for FEH-02 visual behavior

**Research date:** 2026-03-24
**Valid until:** Stable indefinitely — this is a type-level change with no external dependencies
