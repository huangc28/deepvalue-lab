---
phase: 03-add-zh-tw-stockdetail-json-support-to-backend-api
plan: 02
subsystem: api
tags: [backend, zh-TW, locale, detail-api, list-api, testing]

requires:
  - phase: 03-add-zh-tw-stockdetail-json-support-to-backend-api plan 01
    provides: zh-TW detail and summary persistence fields plus publish contract
provides:
  - Locale-aware detail endpoint with zh-TW preference and EN fallback
  - Locale-aware list endpoint with per-row zh-TW summary selection
  - Shared locale helper for exact zh-TW detection
  - Automated handler tests covering locale selection and fallback order
affects: [frontend locale reads, stock detail API consumers]

tech-stack:
  added: []
  patterns:
    - Exact `locale=zh-TW` opt-in with EN as the default path
    - Fallback order: zh-TW R2 detail -> zh-TW summary -> EN detail/summary

key-files:
  created:
    - be/lib/app/stocks/locale.go
    - be/lib/app/stocks/detail_handler_test.go
    - be/lib/app/stocks/list_handler_test.go
  modified:
    - be/lib/app/stocks/detail_handler.go
    - be/lib/app/stocks/list_handler.go

key-decisions:
  - "Only exact `zh-TW` activates localized reads in this phase; all other locales remain EN/default"
  - "Download errors do not silently fall through to another locale artifact"
  - "summary_json_zh_tw treats `''`, `'{}'`, and `null` as empty locale data"

patterns-established:
  - "Handler tests use package-local interfaces and fakes instead of real Turso/R2 dependencies"
  - "List endpoint applies locale fallback per row rather than all-or-nothing"

requirements-completed: [PH3-DETAIL, PH3-LIST, PH3-BACKCOMPAT]

duration: 8min
completed: 2026-03-20
---

# Phase 03 Plan 02 Summary

**Stock detail and stock list APIs now honor `?locale=zh-TW`, returning zh-TW detail/summary data when available and falling back cleanly to existing EN behavior**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-20T22:10:00+0800
- **Completed:** 2026-03-20T22:17:13+0800
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added shared locale parsing and summary-emptiness helpers in the stocks package
- Updated `GET /v1/stocks/{ticker}` to prefer zh-TW detail, then zh-TW summary, then EN fallback
- Updated `GET /v1/stocks` to return zh-TW summaries per row where available
- Added tests proving zh-TW selection and EN fallback behavior

## Task Commits

1. **Task 1: Add shared locale parsing and zh-TW fallback logic to detail and list handlers** - `2bdafb9` (feat)
2. **Task 2: Add automated handler tests for zh-TW selection and backward-compatible EN fallback** - `2bdafb9` (feat)

## Files Created/Modified

- `be/lib/app/stocks/locale.go` - Shared `zh-TW` locale detection and summary emptiness helper
- `be/lib/app/stocks/detail_handler.go` - Locale-aware detail read path and explicit selected-key download handling
- `be/lib/app/stocks/list_handler.go` - Per-row zh-TW summary selection
- `be/lib/app/stocks/detail_handler_test.go` - Detail handler coverage for zh-TW preference and EN fallback
- `be/lib/app/stocks/list_handler_test.go` - List handler coverage for zh-TW and default locale behavior

## Decisions Made

- Limited locale branching to exact `zh-TW` for this phase to avoid inventing generic i18n semantics too early
- Kept the response envelopes unchanged so frontend callers only need to add the query parameter
- Used package-local interfaces for handler tests so production constructors can still accept concrete Turso/R2 dependencies

## Deviations from Plan

None - plan executed as intended.

## Issues Encountered

- A transient `.git/index.lock` prevented the first commit attempt in this session. Retried safely after confirming the lock file was gone; no code changes were lost.

## User Setup Required

None.

## Next Phase Readiness

- Backend can now serve zh-TW StockDetail JSON to any locale-aware frontend caller
- The remaining work for localization is on the frontend/rendering side, not the backend API storage/read path

---
*Phase: 03-add-zh-tw-stockdetail-json-support-to-backend-api*
*Completed: 2026-03-20*

