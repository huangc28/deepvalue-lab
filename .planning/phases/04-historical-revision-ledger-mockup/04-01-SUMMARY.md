---
phase: 04-historical-revision-ledger-mockup
plan: 01
subsystem: ui
tags: [react, typescript, mock-data, revision-ledger, compare-mode, svg, i18n]

# Dependency graph
requires: []
provides:
  - Historical revision ledger mockup integrated into the stock detail page
  - Structured HistoricalReport mock data for TSM (4 revisions), ADBE (1 revision), and SoFi (empty)
  - Compare mode with exactly-two-revision selection, base preservation, and metric diff view
  - Revision trend SVG rail with selected and compare highlight markers
  - Empty, single-revision, and many-revision explicit states

affects: [05-revision-ledger-api, 06-historical-data-backend]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - HistoricalReport mock shape with publishedAtMs, provenance, valuationStatus, thesisStatus, technicalEntryStatus, bear/base/bull fair values, changeSummary
    - Compare mode state with selectedId (base) and compareId (target) — two independent state variables
    - Base selection preserved on compare exit by only clearing compareId, never touching selectedId
    - Revision trend SVG with ring markers on selected/compare nodes
    - CompareMetricDiff showing base values and signed numeric deltas

key-files:
  created: []
  modified:
    - web/src/data/mock-stocks.ts
    - web/src/types/stocks.ts
    - web/src/components/detail/historical-revision-ledger.tsx
    - web/src/i18n/messages.ts

key-decisions:
  - "Compare mode uses two independent state variables (selectedId, compareId) rather than a mode enum — simpler and preserves base naturally"
  - "CompareMetricDiff shows signed currency diff rather than percentages — cleaner for absolute price levels"
  - "Trend SVG highlight uses ring circle overlay (r=11) rather than fill change — preserves color coding while marking selection"
  - "Add-compare buttons are disabled (not hidden) when already in compare mode — preserves affordance visibility"
  - "ADBE mock data uses plain string type-compatible with LocalizedText (string | Record<Locale, string>) — acceptable for single-locale single-revision placeholder"

patterns-established:
  - "RevisionLedger pattern: sortedReports (latest-first) + selectedId + compareId drives all UI states"
  - "Exit compare = clear compareId only; base selection (selectedId) untouched"
  - "Chip tone=positive for compare-target marker (green); tone=accent for latest (blue); tone=neutral for selected"

requirements-completed: [HIST-01, HIST-02, HIST-03, HIST-04, HIST-05]

# Metrics
duration: 15min
completed: 2026-03-24
---

# Phase 04 Plan 01: Historical Revision Ledger Mockup Summary

**Frontend-only revision ledger with latest-first list, selected snapshot, compare mode with metric diff, SVG trend rail, and explicit empty/single/many states — all from local mock data with no backend dependency.**

## Performance

- **Duration:** ~15 min (task 3 execution; tasks 1-2 completed in prior session)
- **Started:** 2026-03-24T00:00:00Z
- **Completed:** 2026-03-24T09:40:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- TSM seeded with 4 meaningful historical revisions (manual → news-refresh → scheduled-monitor → earnings-refresh), ADBE with 1 (single-revision state), SoFi with 0 (empty state)
- Revision ledger replaces plain text history with a structured selectable list — latest auto-opens, selection drives a full snapshot card
- Compare mode: add/clear compare on any non-base revision, side-by-side CompareRevisionCard layout (stacks on mobile), CompareMetricDiff shows signed deltas, exit preserves base selection
- Trend SVG highlights the selected and compare nodes with ring markers so their position is visible without leaving the ledger

## Task Commits

Each task was committed atomically:

1. **Task 1: Structured historical mock data** - `6addc79` (feat — prior session)
2. **Task 2: Revision ledger UI and snapshot view** - `b082c47` (feat — prior session)
3. **Task 3: Compare mode, trend highlights, keyboard-ready behavior** - `bc30396` (feat)

## Files Created/Modified

- `web/src/types/stocks.ts` - HistoricalReport interface (publishedAtMs, provenance, changeSummary, latest)
- `web/src/data/mock-stocks.ts` - tsmHistoricalReports (4), adbeHistoricalReports (1), sofiHistoricalReports (0)
- `web/src/components/detail/historical-revision-ledger.tsx` - Full revision ledger with compare mode, ComparePanel, CompareMetricDiff, DiffMetric, trend highlights
- `web/src/i18n/messages.ts` - All history/revision/compare UI strings in both EN and zh-TW

## Decisions Made

- Compare mode uses two independent state variables (`selectedId` + `compareId`) rather than a mode enum — simpler design, base preservation is structural rather than conditional
- `CompareMetricDiff` shows signed currency deltas (e.g. +$20, -$14) rather than percentages — cleaner at the absolute price levels this data lives in
- Trend SVG uses ring overlay circles (separate `<circle>` with fill=none, stroke) rather than changing fill color — preserves the color-coding scheme while clearly marking selection position
- "Add compare" buttons are disabled (not hidden) when already in compare mode — keeps the affordance visible so users understand the interaction model

## Deviations from Plan

None - plan executed as specified. The `--signal-danger-soft` CSS token was used in place of a non-existent `--signal-negative-soft` token (auto-fix Rule 1, discovered and resolved during implementation).

## Issues Encountered

- `--signal-negative-soft` CSS variable did not exist in the token set. Used `--signal-danger-soft` instead, which is the correct semantic token for negative/decline indicators in this design system.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The mockup is complete and ready for manual visual review
- Compare mode, trend highlighting, and all three history states (empty/single/many) are exercisable from the existing mock stock pages
- Phase 5+ (backend API, real historical data) can use this mockup as the interaction contract reference

---
*Phase: 04-historical-revision-ledger-mockup*
*Completed: 2026-03-24*
