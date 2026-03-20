---
phase: 03-add-zh-tw-stockdetail-json-support-to-backend-api
plan: 01
subsystem: api
tags: [backend, zh-TW, publish, sqlite, sqlc, r2]

requires:
  - phase: 02-skill-output
    provides: bilingual StockDetail JSON and zh-TW artifact contract
provides:
  - Optional zh-TW StockDetail publish payload on the backend
  - zh-TW detail key and zh-TW summary persistence in published_stock_details
  - Locale-specific R2 key helper for zh-TW StockDetail artifacts
  - Publish-path automated tests for EN-only and bilingual requests
affects: [03-02 locale reads, backend publish contract, Turso schema]

tech-stack:
  added: []
  patterns:
    - Optional locale payloads with safe default persistence columns
    - R2 locale artifacts use explicit suffix helpers instead of inline string concatenation

key-files:
  created:
    - be/turso/migrations/20260320220959_published_stock_details_zh_tw_locale.sql
    - be/lib/app/stocks/publish_handler_test.go
  modified:
    - be/turso/schema.sql
    - be/turso/query/stocks.sql
    - be/lib/app/turso_models/models.go
    - be/lib/app/turso_models/stocks.sql.go
    - be/lib/pkg/r2/client.go
    - be/lib/app/stocks/publish_handler.go

key-decisions:
  - "stockDetailZhTW stays optional so existing EN-only publish callers remain valid"
  - "zh-TW detail artifacts use a dedicated `.zh-TW.json` suffix rather than overloading the EN key"
  - "Repo schema.sql remains the canonical full schema, not a live-DB subset dump"

patterns-established:
  - "Publish path validates EN payloads as required and validates zh-TW payloads only when provided"
  - "PublishedStockDetail stores EN and zh-TW summary/detail pointers side by side"

requirements-completed: [API-01, PH3-STORAGE, PH3-PUBLISH]

duration: 12min
completed: 2026-03-20
---

# Phase 03 Plan 01 Summary

**Backend publish path now accepts optional zh-TW StockDetail JSON, stores locale-specific summary/detail metadata, and writes zh-TW artifacts to R2 with automated coverage for EN-only and bilingual requests**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-20T22:05:00+0800
- **Completed:** 2026-03-20T22:17:13+0800
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Added `r2_detail_zh_tw_key` and `summary_json_zh_tw` to the canonical schema, goose migration, sqlc query, and generated models
- Extended the publish handler to accept optional `stockDetailZhTW`, upload a zh-TW detail artifact, and persist zh-TW summary/detail metadata
- Added publish-path tests covering EN-only, bilingual, and invalid zh-TW payload cases

## Task Commits

1. **Task 1: Add zh-TW persistence columns and regenerate sqlc models** - `fc11ac3` (feat)
2. **Task 2: Extend publish flow to accept optional zh-TW StockDetail payloads and persist zh-TW artifacts** - `fc11ac3` (feat)

## Files Created/Modified

- `be/turso/migrations/20260320220959_published_stock_details_zh_tw_locale.sql` - SQLite migration adding zh-TW detail/summary columns with safe defaults and full rollback
- `be/turso/schema.sql` - Restored canonical schema and added zh-TW publish columns
- `be/turso/query/stocks.sql` - Expanded UpsertPublishedStockDetail to persist zh-TW fields
- `be/lib/app/turso_models/models.go` - sqlc model now exposes zh-TW detail/summary fields
- `be/lib/app/turso_models/stocks.sql.go` - sqlc query code now persists and scans zh-TW fields
- `be/lib/pkg/r2/client.go` - Added `DetailKeyZhTW()`
- `be/lib/app/stocks/publish_handler.go` - Added optional `stockDetailZhTW` handling and zh-TW response key
- `be/lib/app/stocks/publish_handler_test.go` - Tests for EN-only and bilingual publish paths

## Decisions Made

- Kept `stockDetailZhTW` optional to preserve backward compatibility for current EN-only publishers
- Used `"{}"` and empty string defaults for zh-TW columns so pre-existing rows and EN-only publishes do not need backfill
- Reused the same summary extraction struct for EN and zh-TW payloads to keep Turso summary shape identical across locales

## Deviations from Plan

None - plan executed as intended.

## Issues Encountered

- `schema.sql` had been replaced by a live database dump after migration application, which dropped unrelated canonical tables from the repo copy. Restored the full canonical schema while preserving the new zh-TW columns before regenerating sqlc.

## User Setup Required

None - no external configuration required beyond applying the migration already created in this phase.

## Next Phase Readiness

- zh-TW publish data is now persisted and queryable
- Detail/list handlers can now implement locale-aware reads against the new generated fields

---
*Phase: 03-add-zh-tw-stockdetail-json-support-to-backend-api*
*Completed: 2026-03-20*

