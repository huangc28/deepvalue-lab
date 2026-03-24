---
phase: 05-interaction-contract-and-frontend-history-data-model
plan: 02
subsystem: ui
tags: [react, typescript, i18n, history-ledger, locale-fallback]

# Dependency graph
requires:
  - phase: 05-01
    provides: HistoricalReportSummary and HistoricalReportDetail types, mock data split, initial ledger type wiring

provides:
  - Locale fallback indicator in SelectedRevisionCard (visible when locale=zh-TW and localeHasFallback=true)
  - Locale fallback indicator in CompareRevisionCard (same condition)
  - CompareMetricDiff delta direction enforced by publishedAtMs sort with convention comment
  - historyLocaleFallbackIndicator i18n key in both en and zh-TW locales
  - stock-detail-page passes historicalReportDetails as reportDetails prop to HistoricalRevisionLedger

affects: [phase-06-api-integration, phase-07-backend-historical-reports]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Locale fallback indicator: render at top of revision cards when locale=zh-TW and localeHasFallback=true"
    - "Delta direction convention: CompareMetricDiff always sorts newer/older by publishedAtMs regardless of argument order"

key-files:
  created: []
  modified:
    - web/src/components/detail/historical-revision-ledger.tsx
    - web/src/i18n/messages.ts

key-decisions:
  - "Delta direction is enforced by the component (not the caller) — publishedAtMs sorting is structural, not a caller contract"
  - "Locale fallback indicator uses font-mono text-[0.62rem] uppercase tracking style, consistent with existing chip labels"

patterns-established:
  - "showFallbackIndicator = locale === 'zh-TW' && report.localeHasFallback — used in both SelectedRevisionCard and CompareRevisionCard"
  - "CompareMetricDiff: const [newer, older] = base.publishedAtMs >= compare.publishedAtMs ? [base, compare] : [compare, base]"

requirements-completed: [FEH-01, FEH-02]

# Metrics
duration: 15min
completed: 2026-03-24
---

# Phase 05 Plan 02: Interaction Contract and Frontend History Data Model Summary

**Locale fallback indicator added to revision cards with zh-TW/localeHasFallback guard; CompareMetricDiff enforces delta direction by sorting on publishedAtMs with convention comment**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-24T10:25:00Z
- **Completed:** 2026-03-24T10:40:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `showFallbackIndicator` flag and conditional render to `SelectedRevisionCard` — indicator appears at card top when locale is zh-TW and `localeHasFallback` is true
- Added same `showFallbackIndicator` pattern to `CompareRevisionCard` — consistent treatment in both display contexts
- Updated `CompareMetricDiff` to enforce delta direction via `publishedAtMs` sort with a documentation comment block locking the convention
- Added `historyLocaleFallbackIndicator` to both `en` and `zh-TW` locales in messages.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Update HistoricalRevisionLedger and all sub-components to new types with locale fallback and delta enforcement** - `f8fcf3b` (feat)
2. **Task 2: Add i18n key for locale fallback indicator and update stock-detail-page wiring** - `efd5a84` (feat)

**Plan metadata:** (to be committed as docs)

## Files Created/Modified

- `web/src/components/detail/historical-revision-ledger.tsx` - Added locale fallback indicator to SelectedRevisionCard and CompareRevisionCard; updated CompareMetricDiff with newer/older sorting and convention comment
- `web/src/i18n/messages.ts` - Added historyLocaleFallbackIndicator in both locales

## Decisions Made

- Delta direction is enforced by the component (not the caller): `CompareMetricDiff` sorts `base` and `compare` by `publishedAtMs` internally so callers cannot accidentally flip the direction
- Locale fallback indicator uses `font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-muted)]` — matches existing chip label style for visual consistency
- `stock-detail-page.tsx` wiring of `historicalReportDetails` was already complete from Plan 01 — no changes needed there, confirmed and verified

## Deviations from Plan

None - plan executed exactly as written.

The component file already had some Plan 01 changes partially applied (imports, prop types, selectedDetail/compareDetail variables, stock-detail-page wiring). Plan 02 added the missing locale fallback indicator renders and delta direction enforcement.

## Issues Encountered

None — TypeScript compiled clean on first attempt, lint and build passed with zero errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full history data model contract complete: HistoricalReportSummary for list, HistoricalReportDetail for panels
- Locale fallback indicator wired and tested via conditional logic
- Delta direction convention documented and enforced — ready for API integration phase
- All FEH-01 and FEH-02 requirements satisfied

---
*Phase: 05-interaction-contract-and-frontend-history-data-model*
*Completed: 2026-03-24*
