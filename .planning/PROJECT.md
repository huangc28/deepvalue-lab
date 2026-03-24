# DeepValue Lab — Historical Analysis Reports

## What This Is

DeepValue Lab is a personal web research cockpit for decision-first stock analysis. This milestone extends the stock detail experience so the user can review how a case changed over time, starting with a frontend-only historical revision ledger mockup and later adding stable historical report APIs.

## Core Value

A stock detail page should show not only the latest judgment, but how that judgment changed over time and why.

## Requirements

### Validated

- ✓ Every stock analysis produces a zh-TW report alongside the English report — Phase 2
- ✓ StockDetail JSON is bilingual with `LocalizedText` fields for user-facing content — Phase 2
- ✓ Backend publish/list/detail flows support exact `locale=zh-TW` with English fallback where implemented — Phase 3

### Validated

- ✓ User can browse a latest-first historical revision ledger inside the stock detail page — Validated in Phase 04: historical-revision-ledger-mockup
- ✓ User can inspect the currently selected historical revision and compare two revisions side by side — Validated in Phase 04: historical-revision-ledger-mockup

### Active

- [ ] Historical reports are eventually served through stable summary/detail APIs without request-time fan-out across all report artifacts

### Out of Scope

- Raw markdown viewer or original-report access — deferred until the revision ledger proves useful
- Cross-stock historical comparison — this milestone is single-stock only
- Comparing more than two revisions at once — keep the first interaction model simple
- Generic locale framework beyond existing exact `locale=zh-TW` support — not needed for this milestone

## Context

- The web app already has a stock detail page with a decision-first reading order and a placeholder `History` section
- The frontend stack is React, TypeScript, Vite, TanStack Router, and Tailwind CSS
- The backend already stores latest published stock detail plus a report metadata list, but it does not yet expose a historical detail read model
- `web/docs/historical-analysis-reports-prd.md` is the milestone-level product spec and source for the historical reports behavior
- The user explicitly wants a visual-first workflow: build the Phase 4 mockup, stop, review and manually adjust the UI, then continue with later phases

## Constraints

- **Execution strategy**: Stop after Phase 4 — do not auto-continue into later phases before visual review
- **Product surface**: Historical reports stay inside the existing stock detail page for the first phase — no new route
- **Interaction scope**: Compare mode is exactly two revisions, not more
- **API timing**: Phase 4 must use local mock data only — no live historical API dependency
- **Continuity**: Existing latest stock detail flow must remain the production reference path until later integration phases land

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start this as a new milestone instead of extending the old zh-TW milestone | The historical reports feature has a different product goal and different delivery path | — Pending |
| Build a frontend-only mockup first | The user wants to see and manually tune the visual before locking data/API decisions | ✓ Complete — mockup approved after visual review |
| Keep historical reports inside the stock detail page initially | Preserves current reading flow and reduces navigation complexity | ✓ Confirmed — all Phase 4 components live inside stock-detail-page.tsx |
| Stop execution after Phase 4 | Prevents frontend/data/API contracts from hardening before the user reviews the mockup | ✓ Honored — Phase 4 complete, proceeding to Phase 5 after approval |
| Defer raw markdown viewer | Revision ledger and historical compare are the milestone priority | — Pending |

---
*Last updated: 2026-03-24 after Phase 04 completion — revision ledger mockup approved*
