---
phase: 04-historical-revision-ledger-mockup
verified: 2026-03-24T00:00:00Z
status: human_needed
score: 6/6 must-haves verified
human_verification:
  - test: "Open TSM stock detail page and confirm latest revision auto-opens on load"
    expected: "The most recent revision (earnings-refresh, Jan 15 2026) is pre-selected and its snapshot is displayed in the right panel without any user interaction"
    why_human: "Auto-selection depends on runtime state initialization — cannot verify `useState` default resolution without rendering"
  - test: "Enter compare mode then exit it; confirm base selection is preserved"
    expected: "After clicking 'add compare' on a non-base revision then clicking 'exit compare', the original base revision remains selected in the snapshot panel"
    why_human: "State preservation across compare transitions is a runtime behavior that requires browser interaction to confirm"
  - test: "Open SoFi stock detail page and confirm explicit empty state renders"
    expected: "The history section shows the 'No Structured History' empty state panel with descriptive copy, not an empty list or blank area"
    why_human: "Conditional rendering of EmptyHistoryState depends on runtime data path through the component"
  - test: "Open ADBE stock detail page and confirm compare affordances are inactive"
    expected: "No 'add compare' buttons appear below the single revision row because canCompare evaluates to false (only 1 revision)"
    why_human: "canCompare guard logic depends on runtime array length check"
  - test: "On a narrow viewport (below md breakpoint), enter compare mode and confirm layout stacks vertically"
    expected: "The two CompareRevisionCards stack vertically without horizontal overflow or cropping"
    why_human: "Responsive grid collapse from md:grid-cols-2 to single-column requires viewport resizing to verify"
  - test: "Confirm keyboard focus rings are visible when tabbing through revision rows and compare buttons"
    expected: "Each interactive element (revision row buttons, add/clear compare buttons, exit compare button) shows a visible focus ring matching the design token on keyboard focus"
    why_human: "Focus-visible CSS behavior requires keyboard interaction in a browser to verify"
---

# Phase 04: Historical Revision Ledger Mockup — Verification Report

**Phase Goal:** Build a frontend-only historical revision ledger mockup inside the stock detail page so the user can manually review and tune the visual direction before later phases lock the interaction contract, data model, and backend API shape.
**Verified:** 2026-03-24
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The old text-only History block is replaced by a revision-ledger mockup when structured historical mock data exists | VERIFIED | `HistoricalRevisionLedger` renders from `reports` prop when non-null; falls through to `LegacyHistory` only when `reports` is undefined (`historical-revision-ledger.tsx` lines 23-25) |
| 2 | Revision rows are sorted by `publishedAtMs` descending and the latest revision auto-opens by default | VERIFIED | `sortedReports` sorts descending (line 18); `resolvedSelectedId` defaults to `sortedReports[0].reportId` when `selectedId` is null (lines 31-34) |
| 3 | The mockup explicitly handles no-history, single-revision, and many-revision states | VERIFIED | `EmptyHistoryState` returned when `sortedReports.length === 0` (line 27); single-revision copy path at lines 238-246; many-revision full ledger for length > 1 |
| 4 | Compare mode supports exactly two revisions and preserves the base selection when compare exits or one side is cleared | VERIFIED | `compareId` is a single independent state variable; `handleExitCompare` and `handleClearCompare` both call `setCompareId(null)` only — `selectedId` (base) is never touched |
| 5 | The mockup remains inside the existing stock detail page and uses local mock data only | VERIFIED | `HistoricalRevisionLedger` is rendered inside `ResearchSection` at line 361 of `stock-detail-page.tsx`; data comes from `stock.historicalReports ?? mockStock?.historicalReports` with no fetch or API call |
| 6 | Keyboard interaction is supported for revision selection and compare flow | VERIFIED | All interactive elements use `<button type="button">` with `focus-visible:ring-2 focus-visible:ring-[var(--accent-copper)]` — revision rows have `aria-pressed`, ledger list has `role="list"` with `aria-label`, trend SVG has `aria-label` |

**Score:** 6/6 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `web/src/pages/stock-detail-page.tsx` | Historical revision ledger mockup integrated into the stock detail page | VERIFIED | Imports `HistoricalRevisionLedger`, passes `reports={historicalReports}` and `legacyItems={historyItems}` inside the History `ResearchSection` |
| `web/src/data/mock-stocks.ts` | Historical mock data for empty, single, and many-revision cases | VERIFIED | `tsmHistoricalReports` (4 revisions), `adbeHistoricalReports` (1 revision), `sofiHistoricalReports` (0 revisions) — all wired via `historicalReports` field on the respective `StockDetail` objects |
| `web/src/types/stocks.ts` | Temporary structured mock history shape for Phase 4 | VERIFIED | `HistoricalReport` interface at lines 67-84 contains `publishedAtMs`, `provenance`, `valuationStatus`, `thesisStatus`, `technicalEntryStatus`, `bearFairValue`, `baseFairValue`, `bullFairValue`, `changeSummary`, `latest`, and all other required fields |
| `web/src/components/detail/historical-revision-ledger.tsx` | Full ledger with compare mode, trend SVG, and all three history states | VERIFIED | 851-line file with `HistoricalRevisionLedger`, `ComparePanel`, `CompareRevisionCard`, `CompareMetricDiff`, `SelectedRevisionCard`, `RevisionTrend`, `EmptyHistoryState`, `LegacyHistory` — fully implemented, no stubs |
| `web/src/i18n/messages.ts` | All revision-ledger UI strings localized in EN and zh-TW | VERIFIED | All 25+ history/revision/compare keys present in both locales — `historyLedgerLabel`, `historyLatest`, `historySelected`, `historyCompareTarget`, `historyCompareMode`, `historyExitCompare`, `historyEmptyLabel`, `historyTrendLabel`, `revisionProvenance`, and all others |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `web/src/data/mock-stocks.ts` | `web/src/pages/stock-detail-page.tsx` | `stock.historicalReports` → `HistoricalRevisionLedger reports=` prop | WIRED | `historicalReports` field set on TSM, ADBE, and SoFi mock objects; consumed at `stock-detail-page.tsx` line 62 and passed to ledger at line 362 |
| `web/src/pages/stock-detail-page.tsx` | `web/src/i18n/messages.ts` | `useI18n()` hook — `m.detail.history*` keys used in component | WIRED | Ledger component accesses 25+ `m.detail` history keys through the shared `useI18n()` hook; both EN and zh-TW translations confirmed present |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| HIST-01 | 04-01-PLAN.md | User can browse a latest-first historical revision ledger within the stock detail page | SATISFIED | `sortedReports` sorted descending by `publishedAtMs`; rendered as selectable list in stock detail page History section |
| HIST-02 | 04-01-PLAN.md | User lands on the latest historical revision by default and can inspect a selected revision snapshot | SATISFIED | `resolvedSelectedId` defaults to `sortedReports[0].reportId`; `SelectedRevisionCard` renders full snapshot for selected report |
| HIST-03 | 04-01-PLAN.md | User can compare exactly two historical revisions side by side | SATISFIED | `compareId` state variable; `ComparePanel` with `CompareRevisionCard` side-by-side layout (`md:grid-cols-2`); `CompareMetricDiff` shows signed deltas; exactly one base + one compare at a time |
| HIST-04 | 04-01-PLAN.md | The history UI handles no-history, single-revision, and many-revision states explicitly | SATISFIED | `EmptyHistoryState` (SoFi), single-revision heading/description path (ADBE), many-revision full ledger (TSM); all three cases seeded in mock data |
| HIST-05 | 04-01-PLAN.md | The revision ledger supports visible focus states, keyboard navigation, and clear selected/latest/compare-selected markers | SATISFIED | `focus-visible:ring-2` on all interactive buttons; `aria-pressed` on revision rows; `role="list"` + `role="listitem"`; chip markers for latest/selected/compare-target states |

No orphaned HIST requirements — all five IDs claimed in `04-01-PLAN.md` and all five confirmed present in `REQUIREMENTS.md` with Phase 4 mapping.

---

## Anti-Patterns Found

No anti-patterns detected in `historical-revision-ledger.tsx`.

- No TODO/FIXME/PLACEHOLDER comments
- No `return null`, `return {}`, or empty implementations
- No console.log-only handlers
- No stub patterns

---

## Human Verification Required

### 1. Latest Revision Auto-Opens

**Test:** Open the TSM stock detail page in a browser without any prior interaction.
**Expected:** The most recent revision (labeled "earnings-refresh", Jan 15 2026) is pre-selected and its full snapshot card is displayed in the right panel immediately on load.
**Why human:** `useState` default resolution via `resolvedSelectedId = selectedId ?? sortedReports[0].reportId` requires a rendered React tree to confirm.

### 2. Base Selection Preserved Across Compare Transitions

**Test:** On the TSM page, click "add compare" on a non-latest revision to enter compare mode, then click "exit compare".
**Expected:** After exiting compare mode, the originally selected base revision is still shown in the snapshot panel — the selection did not reset.
**Why human:** State preservation is structural (`setCompareId(null)` only) but requires runtime state tracking to confirm.

### 3. Empty State Renders for SoFi

**Test:** Open the SoFi stock detail page and scroll to the History section.
**Expected:** The "No Structured History" panel with descriptive copy is displayed — not a blank area, not a list of zero items.
**Why human:** Conditional `sortedReports.length === 0` branch requires rendered output to confirm.

### 4. Single-Revision State: Compare Affordances Absent for ADBE

**Test:** Open the ADBE stock detail page and inspect the History section.
**Expected:** Only one revision row is shown, and no "add compare" button appears on that row — because `canCompare` is false when `sortedReports.length <= 1`.
**Why human:** The `canCompare && !isBase` guard at line 193 requires runtime evaluation of array length.

### 5. Mobile Compare Layout Stacks Vertically

**Test:** On a viewport narrower than 768px (below Tailwind `md` breakpoint), enter compare mode on the TSM page.
**Expected:** The two `CompareRevisionCard` elements stack vertically in a single column without horizontal overflow or cropping.
**Why human:** Responsive grid collapse from `md:grid-cols-2` to single-column requires viewport resizing to verify visually.

### 6. Keyboard Focus Rings Visible

**Test:** Tab through the revision ledger using only a keyboard on the TSM page.
**Expected:** Each revision row button, "add compare" button, "clear compare" button, and "exit compare" button shows a clearly visible focus ring (copper accent color per design tokens) when focused.
**Why human:** `focus-visible` CSS behavior depends on browser keyboard interaction to activate.

---

## Summary

All six observable truths are verified at code level. The three required artifacts are substantive and fully wired. Both key links (mock data to page, page to i18n) are confirmed connected. All five HIST requirements are satisfied by the implementation. No anti-patterns or stubs were found in any modified file.

The remaining items are all runtime/visual behaviors that require a browser rendering the component to confirm. The automated evidence is strong: the logic is structurally correct, the data is seeded, the component is wired, and the i18n is complete in both locales.

---

_Verified: 2026-03-24_
_Verifier: Claude (gsd-verifier)_
