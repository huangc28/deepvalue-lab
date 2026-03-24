# Historical Analysis Reports PRD

- Feature: Historical Analysis Reports
- Product: DeepValue Lab Web
- Version: v0.1
- Date: 2026-03-21

## 1. Background

DeepValue Lab's stock detail page currently presents the latest analysis well enough for a decision-first workflow, but historical context is still shallow. The current `History` section behaves more like a text note list than a real analysis revision system.

This feature is intended to turn historical analysis reports into an auditable, comparable judgment history. The goal is not to build a document archive first. The goal is to help the user understand how the case changed over time, why it changed, and whether the change came from price movement, thesis change, or updated assumptions.

## 2. Problem Statement

The current experience does not let the user quickly answer:

- How the valuation call changed across revisions
- Whether thesis status, technical status, or news-to-model translation actually changed
- Whether fair value moved because the business view changed or because the market price moved
- Which report was a routine refresh versus an earnings- or news-driven revision

## 3. Product Goals

- Let the user browse historical analysis revisions from within the stock detail page
- Let the user inspect a structured snapshot for a selected historical revision
- Let the user compare two historical revisions side by side
- Preserve DeepValue's decision-first, audit-trail-second reading flow
- Validate the UI visually with a frontend-only mockup before locking the backend contract

## 4. Non-Goals

- No full markdown editor in the initial versions
- No full-text search in the initial versions
- No cross-stock historical comparison in the initial versions
- No collaboration, comments, or annotation system

## 5. Target Users

- Primary: the author using DeepValue Lab to review valuation, thesis, and timing changes over time
- Secondary: the author revisiting a stock after earnings or major news to understand what changed since the last review

## 6. Core Use Cases

- The user wants to see whether the last three analyses changed the stock from cheap to fair to rich, or whether the call stayed the same
- The user wants to open a prior revision and inspect the structured snapshot for that point in time
- The user wants to compare two revisions and identify the key deltas
- The user wants to distinguish between scheduled monitoring updates and higher-signal revisions such as earnings refreshes or news-driven reviews

## 7. Experience Principles

- History should behave like a revision ledger, not a plain archive list
- The default view should surface decision-useful summary data, not long-form prose
- Comparison should focus on judgment deltas, not raw document diffs
- The visual language should remain consistent with the existing dark, mono-first research cockpit
- All interactions should be keyboard-accessible with visible focus states
- The latest revision should be the default entry point and should open automatically
- Locale fallback should be visible to the user when a revision is shown in a fallback language

## 8. Scope and Phases

### Phase 1: Frontend Mockup

Build a frontend-only mockup in the stock detail page using local mock data.

Includes:

- Revision list
- Selected revision snapshot panel
- Compare mode mockup
- Small trend visualization showing at least current price and base fair value over time
- Explicit one-revision, multi-revision, and empty states
- Default selection and compare-mode entry/exit behavior

This phase is explicitly visual-first. It should not depend on live backend APIs.

### Phase 2: Visual Refinement and Interaction Contract

Iterate on the mockup after review.

Focus areas:

- Information density
- Compare-mode field selection
- Mobile layout
- Badge hierarchy and color behavior
- Whether the trend visualization should remain a rail or expand into a chart
- Latest-first selection behavior
- Compare-mode interaction model
- Locale fallback labeling

This phase should end with a stable UX contract for frontend implementation.

### Phase 3: Frontend Data Contract and Component Refactor

Replace the current string-based history representation with structured historical report models.

Includes:

- New historical report summary/detail types
- Dedicated components for revision list, selected snapshot, and compare mode
- Loading, empty, and error states for future API-backed behavior
- Canonical timestamp field and formatting rules
- Locale-resolution rules for list rows, snapshot view, and compare mode

This phase should end with a stable data and state contract for API integration.

### Phase 4: API Integration

Integrate the UI with backend historical report endpoints.

Required API support:

- `GET /v1/stocks/{ticker}/reports` for revision list data
- `GET /v1/stocks/{ticker}/reports/{reportId}` for a structured historical detail snapshot

Locale behavior should follow the existing fallback rule: use exact `locale=zh-TW` when available, otherwise fall back to English. The UI must label fallback content clearly when a revision is not available in the requested locale.

This phase requires historical per-report summary persistence. The revision list must not depend on request-time fan-out reads across all historical R2 detail artifacts.

### Phase 5: Optional Original Report Access

Add access to the raw markdown or original report artifact if still useful after the structured history experience is working.

Possible options:

- Inline markdown viewer
- Open original report in a dedicated surface
- Signed URL to the stored artifact

## 9. Functional Requirements

- The stock detail page must show a historical revision list
- The revision list must be sorted by `publishedAtMs` descending
- The latest revision must be auto-selected by default
- Each revision must display at least:
  - publish date and time
  - provenance
  - valuation status
  - thesis status
  - technical entry status
  - current price
  - bear, base, and bull fair values
- The latest revision must be visually identified with a clear latest marker
- The user must be able to select a revision and view its snapshot
- If only one revision exists, the UI must still render the selected snapshot state without compare affordances
- The user must be able to select two revisions and enter compare mode
- Compare mode must be driven by two historical detail payloads, not by summary-only list data
- Compare mode must show at least:
  - current price
  - bear/base/bull fair values
  - valuation status
  - thesis status
  - technical entry status
  - current price implies
  - monitor next
- The user must be able to exit compare mode and return to the last selected single-revision state
- The user must be able to clear one side of a comparison without losing the base selected revision
- The UI must identify the latest revision clearly
- The UI must fall back to English content when `zh-TW` content is unavailable
- The UI must label when a specific revision is displayed in fallback English because `zh-TW` content is unavailable
- The UI must have an empty state when no historical reports exist
- The revision list must support keyboard navigation with visible focus state, selection, compare add/remove, and compare toggle behavior

## 10. Recommended Information Architecture

- Revision List
- Selected Snapshot
- Compare Mode
- Trend Visualization
- Optional Original Report Access

## 11. Recommended Data Model

### HistoricalReportSummary

- `reportId`
- `publishedAtMs`
- `provenance`
- `availableLocales`
- `resolvedLocale`
- `isLocaleFallback`
- `valuationStatus`
- `thesisStatus`
- `technicalEntryStatus`
- `currentPrice`
- `bearFairValue`
- `baseFairValue`
- `bullFairValue`
- `summary`
- `currentPriceImpliesBrief`
- `latest`

### HistoricalReportDetail

- Full `StockDetail` payload for a specific historical revision

### Provenance Enum

The revision list must use a fixed provenance taxonomy for consistent labels, badges, and filtering. Initial recommended enum:

- `manual`
- `scheduled-monitor`
- `earnings-refresh`
- `news-refresh`
- `thesis-refresh`

## 12. API Requirements

### `GET /v1/stocks/{ticker}/reports`

Returns revision summaries for list view.

Requirements:

- Must return persisted per-report summary fields, not metadata only
- Must expose `publishedAtMs` as the canonical timestamp
- Must return `availableLocales`, `resolvedLocale`, and `isLocaleFallback` or equivalent locale metadata
- Must not expose raw storage implementation details such as internal R2 keys as the primary user-facing access contract

### `GET /v1/stocks/{ticker}/reports/{reportId}`

Returns structured detail for a specific historical revision.

Requirements:

- Must resolve a historical detail artifact by `reportId`
- Must support locale fallback consistent with the latest-detail experience
- Must allow compare mode to load two historical revisions efficiently
- The implementation must not rely on brittle request-time key guessing unless that convention is explicitly adopted and documented as part of the backend contract

### `GET /v1/stocks/{ticker}/reports/{reportId}/markdown`

Optional, not part of MVP.

## 13. UX and UI Requirements

- Preserve the existing dark, quiet, research-cockpit visual language
- Show strong selected, hover, and focus states in the revision list
- Keep compare mode focused and decision-useful rather than turning it into an oversized data grid
- On mobile, compare mode may stack revisions vertically instead of using a side-by-side layout
- Use the chart as a supporting layer, not as the primary storytelling surface
- The trend visualization must clarify whether the change is driven by market price movement, fair value revision, or both
- The default non-compare state must answer "what changed since last time?" within the snapshot area, not only inside the chart
- Mixed-locale compare states must be labeled per side so the user can see when one revision is rendered via fallback
- Keyboard behavior must include:
  - moving through revisions
  - selecting the active revision
  - adding/removing a revision for comparison
  - entering and exiting compare mode

## 14. Success Metrics

- The user can answer "What changed most between the latest analysis and the previous one?" within 10 seconds
- The user can answer "Has fair value moved up, down, or stayed flat over time?" within 15 seconds
- The user can review historical judgment changes without leaving the stock detail page

## 15. Acceptance Criteria

- The mockup includes revision list, selected snapshot, and compare mode
- At least one stock has four or more mock historical revisions
- Both English and Traditional Chinese UI chrome render correctly
- The feature works on desktop and mobile layouts
- Keyboard interaction supports revision selection and compare-mode toggle
- The API-backed version can load both the revision list and an individual historical detail snapshot
- The latest revision is shown first and is auto-opened by default
- The one-revision state is handled cleanly without dead compare controls
- Compare mode can be entered, exited, and partially cleared without losing context
- Fallback-language revisions are labeled clearly in both single-revision and compare views
- The trend visualization helps distinguish price movement from fair value revision
- The revision list endpoint is backed by persisted historical summary data rather than per-request fan-out reads across all reports

## 16. Risks and Dependencies

- The current backend only exposes report metadata list data, not structured historical detail by report ID
- Historical per-report summary persistence does not exist yet and must be added for a performant list API
- Historical detail lookup by `reportId` is not yet an implemented backend contract
- If provenance values drift, the history UI will become inconsistent and harder to scan
- If locale metadata is missing per revision, compare mode can become confusing in mixed-language states

## 17. Open Questions

- Should compare mode allow only two revisions or more than two?
- Does raw markdown need to be embedded in the web UI at all?
- Should the trend view include only base fair value, or also bear and bull ranges?
- Should the backend persist historical detail keys explicitly, or should `reportId` remain derivable into stable artifact keys by contract?
