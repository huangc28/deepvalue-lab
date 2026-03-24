# Phase 4: Historical Revision Ledger Mockup - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning
**Source:** milestone PRD + implementation planning

<domain>
## Phase Boundary

This phase is frontend only. It upgrades the stock detail page `History` section from a simple text list into a historical revision ledger mockup rendered from local mock data.

Scope:
- stock detail page only
- local mock data only
- no backend, schema, or API changes
- no new route
- stop after this phase so the user can manually review and tune the UI before later phases proceed

</domain>

<decisions>
## Implementation Decisions

### Product surface
- Keep the feature inside the existing stock detail page where `History` already appears
- Replace the old text-only history presentation with a revision ledger mockup when structured historical mock data exists
- Show an explicit empty state when no historical revisions exist

### Interaction model
- Sort revisions by `publishedAtMs` descending
- Auto-select the latest revision on entry
- Compare mode supports exactly two revisions
- If only one revision exists, do not show active compare affordances
- Exiting compare mode returns to the base selected revision
- Clearing one side of compare preserves the base selected revision

### Mock data scope
- Use local mock data only
- At least one stock must include four or more historical revisions
- At least one stock should exercise the empty or single-revision state
- Keep current production/latest stock detail path intact; this phase introduces mock historical revision data beside it

### Visual direction
- Preserve the existing dark, mono-first DeepValue research cockpit language
- The revision ledger must clearly mark latest, selected, and compare-selected states
- Trend visualization is a supporting layer only; it should help explain price move vs fair value revision, not dominate the page
- Mobile compare mode stacks revisions vertically

### Stop gate
- Do not continue into interaction-contract, backend, or API-integration phases after this phase
- This phase exists specifically for manual UI review and adjustment

### Claude's Discretion
- Exact component split, as long as the mockup stays easy to tune after delivery
- Exact presentation of the trend view, as long as it supports the revision narrative
- Whether mock historical data lives inside `mock-stocks.ts` or a dedicated frontend mock module

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone spec
- `web/docs/historical-analysis-reports-prd.md` — milestone-level behavior, UX rules, and later-phase API/data expectations

### Current stock detail UI
- `web/src/pages/stock-detail-page.tsx` — existing History section location and overall stock detail reading order
- `web/src/components/ui/panel.tsx` — panel shell used throughout the detail page
- `web/src/components/ui/status-badge.tsx` — established badge language for valuation/thesis/technical states
- `web/src/index.css` — current dark mono-first visual tokens and typography

### Current frontend data shape
- `web/src/types/stocks.ts` — current `StockDetail` shape, including `history: LocalizedText[]`
- `web/src/data/mock-stocks.ts` — current stock mock data source
- `web/src/i18n/messages.ts` — localized UI chrome strings for stock detail sections

### Supporting detail-page patterns
- `web/src/components/detail/expectation-bridge.tsx` — reference for compact analytical visualization
- `web/src/components/detail/scenario-card.tsx` — reference for dense decision-focused card layout

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The stock detail page already has a dedicated `History` section shell, so the new mockup can replace content without changing page architecture
- Status badges and panel primitives already match the desired research-cockpit visual language
- The app already uses local mock stock data, so adding local historical revision data fits the current frontend-only mode

### Established Patterns
- Detail pages use panel sections with a file-style chrome label and dense analytical content
- Existing UI emphasizes latest decision state first, then deeper audit trail
- UI chrome is already localized through `web/src/i18n/messages.ts`

### Integration Points
- `StockDetail.history` is currently a plain text list and is insufficient for this feature
- The new mockup should introduce a temporary structured historical mock shape without forcing final API decisions in this phase
- The new UI must coexist with the current latest stock detail rendering instead of replacing the whole page model

</code_context>

<specifics>
## Specific Ideas

- Seed one reference stock with 4+ revisions showing meaningful shifts in valuation/fair value/current-price context
- Include a compact "what changed since previous revision" summary in the selected snapshot, not just inside the trend view
- Reuse existing badge colors and panel styling so the mockup feels native to the current app

</specifics>

<deferred>
## Deferred Ideas

- Stable frontend historical summary/detail types
- Historical report API contracts and backend read model
- Locale fallback metadata sourced from real APIs
- Raw markdown/original report access

</deferred>

---

*Phase: 04-historical-revision-ledger-mockup*
*Context gathered: 2026-03-21*
