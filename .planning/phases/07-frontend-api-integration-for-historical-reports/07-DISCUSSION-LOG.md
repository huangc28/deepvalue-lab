# Phase 7: Frontend API Integration For Historical Reports - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 07-frontend-api-integration-for-historical-reports
**Areas discussed:** live history source boundary, historical detail loading, history failure behavior, locale fallback propagation

---

## Live History Source Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Live history APIs when live stock detail exists | Use `/v1/stocks/{ticker}/reports` and `/reports/{reportId}` for the history section whenever the page is already rendering live stock detail | ✓ |
| Mixed live latest + mock history | Keep current behavior where live latest detail can coexist with `mockStock.historicalReports` | |
| Expand latest-detail endpoint | Add history payloads to `GET /v1/stocks/{ticker}` instead of using the Phase 6 historical endpoints | |

**User's choice:** Defaulted to the recommended live history API path to preserve repo-truth contracts and avoid showing fake history beside live latest detail.
**Notes:** Selected automatically to keep `$gsd-next` zero-friction in execute mode.

---

## Historical Detail Loading

| Option | Description | Selected |
|--------|-------------|----------|
| Lazy per-report fetch with cache | Load summary rows first, then fetch selected/compare detail payloads on demand and cache by `reportId` | ✓ |
| Prefetch all historical details | After list load, fetch every report detail immediately so compare mode is instant | |
| Preloaded detail map only | Keep expecting all detail data to arrive upfront from mocks or a future single payload | |

**User's choice:** Defaulted to lazy per-report fetching with cache.
**Notes:** This matches the existing `HistoricalRevisionLedger` contract and avoids front-loading every historical detail request.

---

## History Failure Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Section-level loading and error states | Keep the latest stock detail page usable and degrade only the history area when historical APIs fail | ✓ |
| Whole-page failure | Treat history API failures as fatal for the entire stock detail page | |
| Silent mock fallback on failure | Hide live API failures by reusing mock history when live history fetches fail | |

**User's choice:** Defaulted to section-level degradation.
**Notes:** This best fits the phase goal of preserving the current latest detail experience while wiring live history.

---

## Locale Fallback Propagation

| Option | Description | Selected |
|--------|-------------|----------|
| Carry summary fallback metadata into detail cards | Merge detail payloads with their summary row so `localeHasFallback` keeps driving selected/compare labels | ✓ |
| Add new backend detail flag first | Change the detail endpoint to expose fallback metadata explicitly before frontend work proceeds | |
| Infer fallback by field inspection | Detect fallback by examining localized detail fields at render time | |

**User's choice:** Defaulted to carrying summary fallback metadata into merged detail models.
**Notes:** This preserves the Phase 5 contract and avoids reopening Phase 6 backend scope without evidence of a blocker.

---

## the agent's Discretion

- Exact query-key structure for history list vs detail hooks
- Exact skeleton/error copy for history-specific states

## Deferred Ideas

None.
