# Roadmap: DeepValue Lab — Historical Analysis Reports

## Overview

This milestone adds historical analysis report review to the stock detail page. Delivery is intentionally staged: first build a frontend-only revision ledger mockup, stop for visual review, then continue with data-contract, backend read-model, and frontend API integration phases after the user approves the direction.

## Phases

**Phase Numbering:**
- Integer phases continue from the previous milestone
- This milestone starts at Phase 4
- Decimal phases remain reserved for urgent insertions

- [x] **Phase 4: Historical Revision Ledger Mockup** - Build a frontend-only historical revision ledger mockup inside the stock detail page using local mock data (completed 2026-03-24)
- [x] **Phase 5: Interaction Contract And Frontend History Data Model** - Lock the post-review interaction contract and move the frontend history UI onto structured summary/detail types (completed 2026-03-24)
- [x] **Phase 6: Historical Report Read Model And Backend APIs** - Add persisted historical summary data plus historical detail read APIs (completed 2026-03-24)
- [ ] **Phase 7: Frontend API Integration For Historical Reports** - Connect the revision ledger and compare flows to live APIs without regressing the current stock detail path

## Phase Details

### Phase 4: Historical Revision Ledger Mockup
**Goal**: The stock detail page renders a visual-first historical revision ledger mockup that can be manually reviewed and adjusted before any backend contract work continues
**Depends on**: Phase 3
**Requirements**: HIST-01, HIST-02, HIST-03, HIST-04, HIST-05
**Success Criteria** (what must be TRUE):
  1. The stock detail page replaces the old text-only history block with a revision ledger mockup rendered from local mock data
  2. The mockup explicitly handles no-history, single-revision, and many-revision states
  3. Latest revision is shown first, auto-selected, and visually marked as latest
  4. Compare mode supports exactly two revisions and can be entered, exited, and partially cleared without losing the base selection
  5. The mockup is usable on desktop and mobile, and keyboard interaction works for selection and compare flow
**Plans**: 1 plan

Plans:
- [ ] 04-01-PLAN.md — Seed structured historical mock data, replace the stock detail History block with a revision ledger mockup, and add compare/trend states for manual UI review

### Phase 5: Interaction Contract And Frontend History Data Model
**Goal**: The frontend history experience uses a stable interaction contract and structured history types, ready for API integration after the Phase 4 review
**Depends on**: Phase 4
**Requirements**: FEH-01, FEH-02
**Success Criteria** (what must be TRUE):
  1. Frontend history uses explicit summary/detail types rather than a temporary mock-only shape
  2. `publishedAtMs` is the canonical historical timestamp used for sorting and display
  3. Locale fallback is surfaced clearly in both selected-revision and compare states
  4. The compare flow and delta-summary rules are fixed and no longer depend on mockup-only assumptions
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md — Define HistoricalReportSummary/Detail types and migrate mock data to new shapes
- [ ] 05-02-PLAN.md — Update all history components to new types, add locale fallback indicator, enforce delta direction convention

### Phase 6: Historical Report Read Model And Backend APIs
**Goal**: Historical report data can be read efficiently through stable summary and detail APIs without relying on per-request fan-out across all report artifacts
**Depends on**: Phase 5
**Requirements**: APIH-01, APIH-02, APIH-03
**Success Criteria** (what must be TRUE):
  1. Historical per-report summary data is persisted for revision-list reads
  2. `GET /v1/stocks/{ticker}/reports` returns all required summary fields in descending `publishedAtMs` order
  3. `GET /v1/stocks/{ticker}/reports/{reportId}` returns locale-aware structured historical detail for a single revision
  4. Historical list reads do not require request-time fan-out across all detail artifacts
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Extend `stock_reports` into the historical read model and persist summary/detail metadata at publish time
- [x] 06-02-PLAN.md — Replace metadata-only `/reports` responses with frontend-aligned historical summaries
- [x] 06-03-PLAN.md — Add locale-aware `/v1/stocks/{ticker}/reports/{reportId}` detail reads and route registration

### Phase 7: Frontend API Integration For Historical Reports
**Goal**: The stock detail page consumes live historical report APIs for revision list, selected snapshot, and compare mode while preserving the current latest detail experience
**Depends on**: Phase 6
**Requirements**: INTH-01, INTH-02
**Success Criteria** (what must be TRUE):
  1. The revision ledger renders from live API data instead of local mock data
  2. Compare mode loads two historical detail payloads reliably
  3. Mixed-locale fallback behavior is clearly labeled and usable
  4. Current stock detail latest path does not regress
**Plans**: 0 plans yet — start only after Phase 4 review

## Progress

**Execution Order:**
Phases execute in numeric order: 4 → 5 → 6 → 7

**Execution strategy note:** The Phase 4 review gate has been cleared; phases 5 and 6 are complete and phase 7 is the next planned implementation step.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Historical Revision Ledger Mockup | 1/1 | Complete   | 2026-03-24 |
| 5. Interaction Contract And Frontend History Data Model | 2/2 | Complete   | 2026-03-24 |
| 6. Historical Report Read Model And Backend APIs | 3/3 | Complete   | 2026-03-24 |
| 7. Frontend API Integration For Historical Reports | 0/0 | Planned | — |
