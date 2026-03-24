---
phase: 05-interaction-contract-and-frontend-history-data-model
verified: 2026-03-24T11:10:00Z
status: human_needed
score: 11/11 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 10/11
  gaps_closed:
    - "Mock data compiles with the new type shapes — TSM entry 1 localeHasFallback fixed from incorrect computeLocaleHasFallback call to direct false literal"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Open stock detail page for ADBE, switch locale to zh-TW, view the single revision card"
    expected: "Locale fallback indicator ('部分內容以英文顯示') appears at the top of the card, above the provenance chips"
    why_human: "Visual position and rendering requires browser inspection"
  - test: "Open stock detail page for TSM, switch locale to zh-TW, select revision 1 (tsm-20260115-init, Jan 15 2026)"
    expected: "No locale fallback indicator appears — TSM revision 1 is now correctly marked localeHasFallback: false"
    why_human: "UI rendering and absence-of-indicator correctness requires browser inspection"
  - test: "Open stock detail page for TSM, switch locale to zh-TW, enter compare mode between any two revisions"
    expected: "No locale fallback indicator appears on either CompareRevisionCard (all TSM revisions are fully bilingual)"
    why_human: "Requires multi-step UI interaction to trigger compare mode"
---

# Phase 5: Interaction Contract and Frontend History Data Model — Verification Report

**Phase Goal:** Define the stable summary/detail interaction contract and update the frontend history data model so that history components consume typed report summaries and details with locale fallback labeling and enforced compare delta direction.
**Verified:** 2026-03-24T11:10:00Z
**Status:** human_needed — all automated checks pass, gap closed
**Re-verification:** Yes — after gap closure (previous status: gaps_found, score 10/11)

## Re-verification Summary

The single gap from initial verification has been resolved. `web/src/data/mock-stocks.ts` TSM entry 1 (`tsm-20260115-init`) previously had `localeHasFallback: true` at runtime due to misuse of `computeLocaleHasFallback` (called with a plain string literal). The fix replaced lines 31–35 with `localeHasFallback: false` directly, consistent with the comment on line 30 and matching TSM entries 2–4. The `computeLocaleHasFallback` function is still defined and still correctly used for the ADBE entry (which passes actual string fields and evaluates to `true`). Build passes with zero errors.

No regressions detected — all 10 previously-passing truths remain intact.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | HistoricalReportSummary contains exactly the fields needed for ledger list rows | VERIFIED | `interface HistoricalReportSummary` defined in stocks.ts with all 13 specified fields |
| 2 | HistoricalReportDetail extends HistoricalReportSummary with detail-panel fields | VERIFIED | `interface HistoricalReportDetail extends HistoricalReportSummary` in stocks.ts with 4 detail fields |
| 3 | StockDetail uses HistoricalReportSummary[] for historicalReports and Record<string, HistoricalReportDetail> for historicalReportDetails | VERIFIED | stocks.ts — both fields present with correct types |
| 4 | publishedAtMs is the only timestamp field on both types | VERIFIED | Single `publishedAtMs` declaration on Summary, inherited by Detail via extends |
| 5 | localeHasFallback boolean exists on HistoricalReportSummary | VERIFIED | `localeHasFallback: boolean` on HistoricalReportSummary |
| 6 | Mock data compiles with the new type shapes | VERIFIED | Build exits 0; TSM entry 1 now has `localeHasFallback: false` directly (gap closed); ADBE correctly uses `computeLocaleHasFallback` with actual string fields yielding `true` |
| 7 | HistoricalRevisionLedger receives HistoricalReportSummary[] for list and Record<string, HistoricalReportDetail> for detail lookup | VERIFIED | ledger.tsx prop interface — `reports?: HistoricalReportSummary[]`, `reportDetails?: Record<string, HistoricalReportDetail>` |
| 8 | SelectedRevisionCard and CompareRevisionCard accept HistoricalReportDetail | VERIFIED | ledger.tsx — both sub-components take `report: HistoricalReportDetail` |
| 9 | RevisionTrend accepts HistoricalReportSummary[] | VERIFIED | ledger.tsx — `reports: HistoricalReportSummary[]` |
| 10 | CompareMetricDiff enforces delta direction by sorting on publishedAtMs regardless of argument order | VERIFIED | ledger.tsx lines 407–415 — convention comment + `const [newer, older] = base.publishedAtMs >= compare.publishedAtMs ? [base, compare] : [compare, base]` |
| 11 | stock-detail-page passes both historicalReports and historicalReportDetails to HistoricalRevisionLedger | VERIFIED | stock-detail-page.tsx line 63 declares `historicalReportDetails`; line 364 passes `reportDetails={historicalReportDetails}` |

**Score: 11/11 truths verified**

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `web/src/types/stocks.ts` | HistoricalReportSummary, HistoricalReportDetail interfaces, updated StockDetail | VERIFIED | Both interfaces defined, alias preserved, StockDetail updated |
| `web/src/data/mock-stocks.ts` | Mock data split into summary arrays and detail lookup maps | VERIFIED | All 6 variables exist; all localeHasFallback values are semantically correct |
| `web/src/components/detail/historical-revision-ledger.tsx` | Updated prop types, locale fallback indicator, delta enforcement | VERIFIED | All sub-components updated; fallback in SelectedRevisionCard + CompareRevisionCard; delta sorting enforced |
| `web/src/pages/stock-detail-page.tsx` | Updated wiring passing reportDetails prop | VERIFIED | Lines 63 and 364 |
| `web/src/i18n/messages.ts` | historyLocaleFallbackIndicator in both locales | VERIFIED | en: 'Shown in English', zh-TW: '部分內容以英文顯示' |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| web/src/data/mock-stocks.ts | web/src/types/stocks.ts | `import type { HistoricalReportDetail, HistoricalReportSummary }` | WIRED | mock-stocks.ts lines 3–4 |
| web/src/components/detail/historical-revision-ledger.tsx | web/src/types/stocks.ts | `import type { HistoricalReportSummary, HistoricalReportDetail }` | WIRED | ledger.tsx lines 7–8 |
| web/src/pages/stock-detail-page.tsx | web/src/components/detail/historical-revision-ledger.tsx | `reportDetails=` prop | WIRED | stock-detail-page.tsx line 364 |
| web/src/components/detail/historical-revision-ledger.tsx | web/src/i18n/messages.ts | `m.detail.historyLocaleFallbackIndicator` | WIRED | ledger.tsx lines 334 and 503 |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FEH-01 | 05-01, 05-02 | Frontend history surfaces use structured historical summary/detail types with canonical `publishedAtMs` | SATISFIED | HistoricalReportSummary/Detail in stocks.ts; all components consume typed props; publishedAtMs is the single canonical timestamp |
| FEH-02 | 05-02 | Frontend labels locale fallback explicitly in single-revision and compare views | SATISFIED | `showFallbackIndicator` logic in SelectedRevisionCard (line 497) and CompareRevisionCard (line 328); i18n key in both locales |

No orphaned requirements — only FEH-01 and FEH-02 are mapped to Phase 5 in REQUIREMENTS.md.

### Anti-Patterns Found

None — the `computeLocaleHasFallback` misuse that was flagged in the initial verification has been corrected.

### Human Verification Required

#### 1. ADBE — Locale Fallback Indicator (Happy Path)

**Test:** Open the stock detail page for ADBE, switch the locale to zh-TW, view the single revision card.
**Expected:** The indicator `'部分內容以英文顯示'` appears at the very top of the card, before the provenance chips.
**Why human:** Visual position requires browser inspection.

#### 2. TSM Revision 1 — Locale Fallback Indicator Absent (Gap Regression Check)

**Test:** Open the stock detail page for TSM, switch the locale to zh-TW, click on the January 15 2026 revision in the ledger.
**Expected:** No locale fallback indicator appears — TSM revision 1 is now correctly marked `localeHasFallback: false`.
**Why human:** Absence of an indicator requires browser inspection to confirm the fix took effect at runtime.

#### 3. TSM Compare Mode — No Fallback Indicator

**Test:** Open TSM stock detail page, switch locale to zh-TW, enter compare mode between any two TSM revisions.
**Expected:** No locale fallback indicator on either CompareRevisionCard (all TSM revisions are fully bilingual).
**Why human:** Requires multi-step UI interaction to trigger compare mode.

### Gaps Summary

All gaps from initial verification are closed. The phase has achieved its goal: the `HistoricalReportSummary` / `HistoricalReportDetail` type contract is correctly defined and all components consume it, `CompareMetricDiff` enforces delta direction with a documented convention, the locale fallback indicator renders in both card contexts, and all mock data has semantically correct `localeHasFallback` values. Build and lint pass with zero errors.

Remaining items are human-only UI validation tasks — no automated gaps remain.

---

_Verified: 2026-03-24T11:10:00Z_
_Verifier: Claude (gsd-verifier)_
