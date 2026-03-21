# DeepValue Lab FE Locale API Integration PRD

Date:
- 2026-03-21

Status:
- approved for phased implementation

## Summary

Add locale-aware frontend reads for backend-backed stock analysis content, with `zh-TW` as the first non-English locale.

This PRD covers:
- feasibility of fetching localized structured analysis data from the backend
- required frontend integration changes
- backend contract risks that affect the detail page
- a phased delivery plan

The intended read path is:
- dashboard uses `GET /v1/stocks?locale=zh-TW`
- stock detail uses `GET /v1/stocks/{ticker}?locale=zh-TW`
- frontend renders the returned `StockSummary` / `StockDetail` JSON directly
- frontend does not parse markdown reports on the read path

Approved decisions:
- backend detail endpoint should guarantee a full `StockDetail` shape
- zh-TW UI may render English research content as an acceptable fallback when zh-TW detail is unavailable
- delivery order is dashboard first, detail second

## Problem

The current frontend already reads stock data from backend APIs, but the locale is not yet part of the request path or React Query cache key.

The backend now supports locale-aware stock analysis reads, but the frontend has not yet been wired to use locale-specific API requests.

As a result:
- switching the UI locale does not trigger a backend refetch
- the dashboard and detail page can reuse stale English cache entries after a locale switch
- the app does not yet prove the real publish/read workflow for `zh-TW` structured analysis data

## Goals

- Fetch dashboard summary data from the backend using the active frontend locale.
- Fetch stock detail data from the backend using the active frontend locale.
- Render zh-TW structured analysis content when it exists.
- Preserve current UI chrome localization and current status-badge behavior.
- Keep the migration incremental and low-risk, without forcing an immediate rewrite of all existing components.

## Non-Goals

- Reading or parsing markdown reports in the frontend
- Building a generic multi-locale framework beyond `en` and `zh-TW`
- Changing the DeepValue detail-page reading order
- Introducing SSR or server components
- Reworking the publish workflow

## Current State

### Backend

Current backend behavior is locale-aware:

- `GET /v1/stocks?locale=zh-TW` returns zh-TW summaries when available, otherwise English summaries.
- `GET /v1/stocks/{ticker}?locale=zh-TW` currently uses fallback order:
  1. zh-TW detail artifact
  2. zh-TW summary JSON
  3. English detail artifact
  4. English summary JSON
- Locale opt-in is exact query value `locale=zh-TW`.

### Frontend

Current frontend behavior:

- uses React + TypeScript + Vite + TanStack Router + React Query
- has a locale provider with `en` / `zh-TW`
- stores locale in localStorage
- uses `LocalizedText = string | Record<Locale, string>`
- resolves text via `text()` and `flattenLocalizedText()`
- already fetches dashboard/detail data from backend APIs
- does not append locale query params today
- keys React Query data only by `['stocks']` and `['stocks', ticker]`
- still keeps legacy mock data in the repo for UI development, but not as the intended production read path

### Important Compatibility Observation

The frontend text model is more permissive than the backend payload model:

- current UI can already render plain strings
- current UI can also render bilingual objects from legacy mock data

This is good news.

It means the frontend can migrate to locale-resolved backend payloads without a full component rewrite, as long as fetch/query behavior is updated.

## Feasibility Assessment

### Overall

The integration is feasible and should be moderate effort.

Dashboard integration is straightforward.
Detail-page integration is feasible, but there is one important backend contract risk that should be resolved explicitly.

### What Makes This Feasible

- Existing frontend components already accept `string` as valid `LocalizedText`.
- Status enums remain stable in English, so badge and label mapping does not need a new locale model.
- Search behavior can continue working because `flattenLocalizedText()` already handles strings.
- React Query is already in place, so locale-aware refetching is a natural extension of the existing data layer.

### Primary Risk

The current backend detail fallback can return a summary-shaped payload for the detail endpoint.

Specifically:
- `GET /v1/stocks/{ticker}?locale=zh-TW` may return `summary_json_zh_tw` when `r2_detail_zh_tw_key` is absent
- `summary_json_zh_tw` is not a full `StockDetail`
- the current detail page assumes a complete `StockDetail`

Impact:
- dashboard/list view is safe because it expects summaries
- detail page is at risk of runtime breakage if the backend returns summary-only JSON for a detail request

This is the main issue that must be addressed before calling the full detail integration production-safe.

## Recommendation

Use a two-part rollout.

### Recommendation A: Preferred Contract

Adjust the backend detail endpoint so that `GET /v1/stocks/{ticker}` always returns a full `StockDetail` shape.

Recommended fallback order for detail reads:
- zh-TW detail
- English detail
- error if no detail exists

Do not return summary JSON from the detail endpoint.

Why this is preferred:
- clean API contract
- simpler frontend
- easier runtime validation
- avoids mixed assumptions between list and detail endpoints

### Recommendation B: Frontend Fallback If Backend Contract Stays As-Is

If backend behavior is intentionally kept as-is, the frontend must harden its detail fetch path:

- request locale-specific detail
- validate whether the payload is a complete renderable `StockDetail`
- if the zh-TW payload is summary-only or incomplete, fetch English detail immediately
- only show a controlled error state if English detail is also unavailable or invalid

This path is feasible, but it makes the frontend responsible for repairing an ambiguous backend contract.

Recommendation:
- use Recommendation A if backend changes are acceptable
- only use Recommendation B as a temporary compatibility bridge

Decision:
- adopt Recommendation A as the target contract
- Recommendation B remains an optional temporary bridge only if sequencing requires it

## Proposed Product Behavior

### Dashboard

When locale is `en`:
- frontend calls `GET /v1/stocks`
- render English summaries

When locale is `zh-TW`:
- frontend calls `GET /v1/stocks?locale=zh-TW`
- render zh-TW summaries where available
- render English summaries for stocks that do not yet have zh-TW localized content

This behavior is consistent with current backend list semantics and is acceptable for MVP.

### Stock Detail

When locale is `en`:
- frontend calls `GET /v1/stocks/{ticker}`
- render English detail

When locale is `zh-TW`:
- frontend calls `GET /v1/stocks/{ticker}?locale=zh-TW`
- render zh-TW detail when available
- if zh-TW detail is unavailable, render English detail under zh-TW UI chrome

Important note:
- the product should allow English research content inside a zh-TW shell as a valid fallback
- but the detail endpoint should still return a full detail payload, not summary-only data

Approved product decision:
- fallback to English detail content is acceptable
- fallback to summary-only payload is not acceptable for the detail page

## Frontend Requirements

### 1. Locale-Aware API Layer

Update API helpers so locale becomes an explicit input:

- `fetchStocks(locale)`
- `fetchStock(ticker, locale)`

Rules:
- append `?locale=zh-TW` only when locale is `zh-TW`
- keep English requests as the current default path

### 2. Locale-Aware Query Keys

React Query keys must include locale.

Examples:
- `['stocks', locale]`
- `['stocks', ticker, locale]`

Without this:
- locale switches will reuse stale English query results
- UI chrome will switch but research content will not

### 3. Runtime Shape Validation For Detail Reads

The frontend should not blindly trust the detail response until the contract is hardened.

Validation must cover every field the current detail page dereferences, not just a small top-level subset.

Minimum render-safe validation:
- `ticker`
- `companyName`
- `businessType`
- `summary`
- `lastUpdated`
- `actionState`
- `valuationStatus`
- `thesisStatus`
- `technicalEntryStatus`
- `currentPrice`
- `bearFairValue`
- `baseFairValue`
- `bullFairValue`
- `discountToBase`
- `variantPerception`
- `currentPriceImplies`
- `scenarios`
- `valuationLens.primary`
- `valuationLens.crossCheck`
- `valuationLens.rationale`
- `currentValuationSnapshot.multiples`
- `newsToModel`
- `thesisStatement`
- `thesisBullets`
- `risks`
- `catalysts`
- `monitorNext`
- `sourcesUsed`
- `history`

Nested arrays and objects must also be validated as renderable shapes, not just checked for presence.

If validation fails:
- if the attempted locale was `zh-TW`, do a second English-detail fetch as fallback
- only show a controlled error state if the English detail fetch is missing or still fails validation

### 4. Keep Current Component Contract Where Possible

Most components should continue to consume the existing `StockSummary` and `StockDetail` interfaces.

This avoids a large render-layer rewrite.

Because `LocalizedText` already accepts `string`, existing `text()` helpers remain compatible.

### 5. Mock Data Transition

The frontend should not treat `mockStocks` as the runtime source of truth for dashboard/detail pages.

Recommended transition:
- keep mock data only for isolated UI development if needed
- production routes should continue reading from backend APIs

## Backend Dependency

### Required For Clean Rollout

One backend decision is required:

- should `GET /v1/stocks/{ticker}` guarantee full detail shape only?

Recommended answer:
- yes

Approved answer:
- yes

If yes, implement:
- detail route never returns summary JSON
- detail route falls back from zh-TW detail to English detail, not to summary

### Optional But Helpful

- explicit response header or field indicating resolved locale when the product later wants an in-UI fallback indicator
- explicit contract docs that distinguish list summary shape from detail shape

These are helpful but not required for the first FE integration pass.

## UX Considerations

- Locale switching should refetch data automatically without requiring manual page reload.
- It is acceptable for zh-TW users to see English research content when zh-TW detail is unavailable.
- UI chrome should remain fully localized even when research content falls back to English.
- Existing CJK typography switch should remain in place for `zh-TW`.

## Delivery Plan

### Phase 1: Dashboard API Locale Integration

Scope:
- add locale-aware `fetchStocks`
- include locale in list query keys
- render backend summaries on dashboard

Success criteria:
- dashboard locale switch changes API request behavior
- zh-TW dashboard renders localized summaries where available
- English fallback summaries still render correctly

Risk:
- low

Implementation target:
- this is the approved first execution phase
- a follow-on agent may implement this phase immediately without waiting for Phase 2

File-level change scope:
- `web/src/lib/api.ts`
  - add locale-aware list fetch helper
  - append `?locale=zh-TW` only when locale is `zh-TW`
- `web/src/lib/queries.ts`
  - include locale in the dashboard query key
  - pass locale into the list fetch helper
- `web/src/pages/dashboard-page.tsx`
  - read the active locale from i18n context
  - call the locale-aware dashboard query
- `web/src/components/dashboard/company-card.tsx`
  - expected to work unchanged unless an integration bug is found
- `web/src/components/dashboard/watchlist-table.tsx`
  - expected to work unchanged unless an integration bug is found

Out of scope for Phase 1:
- stock detail route changes
- detail endpoint fallback repair logic
- backend contract changes
- removal of all mock-data files

Implementation notes:
- keep the existing `StockSummary` component contract
- do not introduce a new i18n abstraction for analysis content
- do not parse markdown or fetch report bodies
- locale switching must cause React Query to refetch, not just rerender labels

Phase 1 acceptance checklist:
- dashboard requests `GET /v1/stocks` when locale is `en`
- dashboard requests `GET /v1/stocks?locale=zh-TW` when locale is `zh-TW`
- query key includes locale, so locale switches invalidate the old result set
- zh-TW dashboard renders localized summary fields when available
- stocks without zh-TW summary still render via English fallback
- dashboard search still works against returned data
- automated tests or network assertions verify the request URL in both locales
- automated tests or network assertions verify locale-specific query keys and prevent cross-locale cache reuse
- `pnpm build` passes
- `pnpm lint` passes

### Phase 2: Detail API Contract Hardening

Scope:
- implement the approved backend detail-route fallback contract
- remove summary-payload fallback from the detail endpoint

Success criteria:
- detail route always produces a full renderable `StockDetail`
- no summary-shaped payload reaches the detail page render path unhandled

Risk:
- medium

Backend requirement:
- `GET /v1/stocks/{ticker}` must guarantee a full `StockDetail` response shape
- remove summary-payload fallback from the detail endpoint
- preferred fallback order becomes:
  1. zh-TW detail
  2. English detail
  3. not found or explicit error when no detail exists

Temporary exception policy:
- a frontend validation-and-refetch bridge is allowed only as a short-lived sequencing exception
- that bridge does not count as Phase 2 completion
- if used, it should be removed once the backend contract above is deployed

Phase 2 acceptance checklist:
- detail endpoint never returns summary-only JSON
- zh-TW detail read falls back to English detail, not zh-TW summary
- existing English detail read behavior remains intact
- backend tests cover the new fallback contract

### Phase 3: Detail Page Locale Integration

Scope:
- add locale-aware `fetchStock`
- include locale in detail query keys
- render locale-specific detail data

Success criteria:
- zh-TW detail renders when published
- English detail renders as controlled fallback when zh-TW detail does not exist
- locale switch causes refetch and rerender

Risk:
- medium

Hard blocker:
- do not mark this phase complete until Phase 2 contract hardening is finished, unless a temporary frontend validation/fallback bridge is explicitly approved

File-level change scope:
- `web/src/lib/api.ts`
  - add locale-aware detail fetch helper
- `web/src/lib/queries.ts`
  - include locale in the detail query key
  - pass locale into the detail fetch helper
- `web/src/pages/stock-detail-page.tsx`
  - read active locale from i18n context through the query path
  - rely on locale-aware detail fetch
- only add a temporary runtime guard in the data layer if backend rollout lags and the exception is explicitly approved

Implementation notes:
- keep the current `StockDetail` render contract
- allow zh-TW shell plus English research-body fallback
- avoid component rewrites unless an actual payload-shape issue appears

Phase 3 acceptance checklist:
- detail page requests `GET /v1/stocks/{ticker}` when locale is `en`
- detail page requests `GET /v1/stocks/{ticker}?locale=zh-TW` when locale is `zh-TW`
- zh-TW detail renders when published
- English detail renders as fallback when zh-TW detail is unavailable
- locale switching refetches detail data
- detail page does not crash on locale fallback cases
- automated tests or network assertions verify locale-specific request URLs for detail reads
- automated tests or network assertions verify locale-scoped detail query keys and prevent cache leakage across locales
- if a temporary frontend bridge exists, tests verify `zh-TW` invalid/missing detail refetches English detail before showing an error
- `pnpm build` passes
- `pnpm lint` passes

### Phase 4: Cleanup

Scope:
- reduce or isolate mock-data dependence
- document final FE/BE contract
- remove temporary frontend repair logic if backend contract has been cleaned up

## Acceptance Criteria

- Switching locale to `zh-TW` changes dashboard API requests to `?locale=zh-TW`.
- Switching locale to `zh-TW` changes detail API requests to `?locale=zh-TW`.
- Dashboard renders zh-TW summaries when available.
- Detail page renders zh-TW detail when available.
- Detail page does not crash when zh-TW detail is unavailable.
- English fallback behavior is deterministic and consistent.
- Query caching does not leak English results into zh-TW state, or vice versa.
- No frontend code parses markdown report bodies on the read path.

## Risks

### Risk 1: Ambiguous Detail Contract

The detail route may return summary JSON today.

Mitigation:
- change backend contract, or
- as a temporary exception only, add frontend runtime validation plus fallback fetch

### Risk 2: Locale Switch Does Not Refetch Data

Current query keys do not include locale.

Mitigation:
- include locale in all stock query keys

### Risk 3: Mixed Content Expectations

Users may expect fully localized detail content when only summary-level localization exists.

Mitigation:
- treat English research under zh-TW shell as acceptable fallback
- optionally add a small future indicator for “English content fallback”

### Risk 4: Mock Data And Real API Drift

Local mock data may continue to mask runtime issues.

Mitigation:
- keep route rendering on backend data and avoid reintroducing mock-only assumptions into production paths

## Open Questions

Resolved:

1. Backend detail endpoint should be tightened so it always returns full `StockDetail` shape and never summary JSON.
2. When zh-TW detail is unavailable, English-content fallback inside zh-TW UI is acceptable.
3. Delivery should be dashboard first, then detail after contract hardening.

## Agent Pickup Notes

This document is intended to be sufficient for a follow-on AI agent.

Current approved execution order:
1. implement Phase 1 dashboard locale-aware API integration
2. stop and hand off if Phase 2 backend contract work is not part of the same task
3. only begin Phase 3 detail integration after Phase 2 is complete

What the next agent should assume:
- backend list endpoint is ready for frontend locale integration now
- backend detail endpoint is not yet safe enough to assume full detail under all locale fallback paths
- English-content fallback inside zh-TW UI is product-approved

What the next agent should not assume:
- that the detail endpoint can safely return summary JSON to the detail page
- that mock bilingual objects remain the long-term source of truth
- that locale switching is only a presentation concern; it must affect fetch and query-key behavior
- that a temporary FE bridge means the backend contract has been completed

Recommended first task for the next agent:
- implement Phase 1 only
- verify locale-aware dashboard fetches in the browser or through network inspection
- leave detail-page integration untouched unless backend contract work is also included

## Proposed Decision

Proceed with the feature.

Decision framing:
- dashboard locale-aware API integration is ready now
- detail-page locale-aware integration is ready after the approved backend contract is implemented

Approved implementation framing:
- build Phase 1 dashboard integration first
- treat Phase 2 backend contract hardening as the gate for Phase 3 detail integration

Recommended implementation policy:
- ship dashboard first if fast progress is preferred
- do not ship detail-page locale integration as “done” until the summary-vs-detail contract risk is resolved
