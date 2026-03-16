# DeepValue Lab FE Mockup PRD

Purpose:
- define the product and delivery scope for the first frontend-only mockup of DeepValue Lab
- align design, routing, and component decisions before implementation
- provide a reference for execution and progress tracking

Date:
- 2026-03-16

Status:
- draft

## Summary

Build the first frontend mockup pages for DeepValue Lab as a decision-support stock research web app.

This phase is intentionally frontend-only.
It should validate page structure, information hierarchy, navigation, interaction patterns, and visual direction before backend work begins.

The first mockup should demonstrate:
- a dashboard with both cards and table views
- a stock detail page
- consistent decision-state language across the app
- a serious, research-focused interface optimized for browsing and review

## Product Goal

Help a self-directed value investor quickly answer:
- is this stock cheap, fair, or rich
- has recent news changed the valuation model
- is the thesis intact, watch, or broken
- is the current price a favorable entry zone
- what should I do next

The app should reduce analysis friction and make the next action clearer.

## Phase Goal

Deliver a clickable frontend mockup that:
- visualizes the app structure and navigation
- proves the cards-plus-table dashboard approach
- proves the decision-first detail page layout
- uses realistic mock data to simulate actual workflows
- is suitable for design review and early product validation

## Non-Goals

This phase does not include:
- backend APIs
- database integration
- authentication
- real market data fetching
- alert scheduler implementation
- persistence of user changes
- SEO optimization
- SSR-specific performance work

## Primary User

Primary user:
- a self-directed investor maintaining a personal watchlist and manually reviewing valuation, thesis, and entry timing

User mindset:
- wants fast decision clarity
- wants to identify which stocks deserve deeper review now
- wants interpretation, not just raw information

## UX Principles

The frontend must follow these principles:
- show judgment before raw data
- show changes before static information
- prioritize action state and price-versus-value
- keep valuation first and technicals second
- make scanning easy without flattening all context into a spreadsheet

## Core Product Decisions

### Dashboard Model

The dashboard should support two views over the same watchlist data:
- `Cards View`
- `Table View`

Decision:
- `Cards View` is the default view
- `Table View` is the comparison mode

Reasoning:
- cards better communicate priority and status
- tables remain useful for dense comparison and sorting

### Detail Page Model

The stock detail page should begin with the current decision state rather than company background.

The user should understand the current conclusion within the first screen.

### Status Language

The app should use these status systems:
- valuation: `cheap` / `fair` / `rich`
- news impact: `improving` / `unchanged` / `deteriorating`
- thesis: `intact` / `watch` / `broken`
- technical entry: `favorable` / `neutral` / `stretched`
- action state: `strong accumulation` / `watch for confirmation` / `fairly valued` / `trim zone` / `thesis at risk`

Dashboard groupings:
- `Now Actionable`
- `Needs Review`
- `At Risk`

## Technical Direction

Frontend stack decision for this phase:
- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS

Rendering strategy:
- client-side rendering only

State strategy:
- local mock data
- route-based and search-param-based UI state where appropriate

Rationale:
- this phase is a high-interaction mockup, not a content site
- the main value is in filters, sorting, view mode switching, and detail navigation
- SSR adds complexity without practical value at this stage
- TanStack Router is a good fit for dashboard state that should map cleanly into the URL

## Mockup Scope

### Page 1: Dashboard

The dashboard should include:
- top navigation
- search
- filter chips
- sort control
- cards/table view toggle
- summary bucket strip
- cards view
- table view
- right-side insight rail or equivalent secondary panel

Cards View should show:
- company name
- ticker
- current price
- base fair value
- discount or premium percentage
- valuation status
- thesis status
- entry status
- action state
- one-line summary
- last updated

Table View should show:
- ticker
- company
- current price
- base fair value or bear/base/bull
- discount or premium percentage
- news impact
- thesis
- entry
- action state
- last updated

### Page 2: Stock Detail

The detail page should include:
- hero decision summary
- valuation section
- thesis section
- news-to-model section
- entry timing section
- risks and catalysts section
- history or timeline section

Top-of-page hero should show:
- company name and ticker
- current price
- fair value range
- discount or premium
- action state
- thesis status
- news impact status
- entry status
- concise decision summary
- last updated

## Data Requirements For Mockup

The mockup should use a realistic local dataset for at least 6 to 8 stocks.

Each stock entry should include enough fields to render both dashboard views and detail page sections:
- id
- ticker
- company name
- business type
- current price
- bear, base, and bull fair values
- valuation status
- news impact status
- thesis status
- technical entry status
- action state
- one-line summary
- last updated
- thesis bullets
- news-to-model notes
- risks
- catalysts
- technical notes
- history items

The mock data should intentionally cover multiple states:
- undervalued and actionable
- undervalued but not yet favorable entry
- fairly valued
- thesis at risk
- recently changed

## Key Flows

The mockup should support these flows:
- open dashboard and identify highest-priority stocks
- filter to a narrower set such as `cheap + thesis intact`
- switch between cards and table without losing context
- open a stock detail page from either view
- understand what changed and what to do next

## Deliverables

Expected outputs for this phase:
- working frontend project scaffold
- dashboard page
- stock detail page
- cards view implementation
- table view implementation
- shared status badge system
- local mock data set
- responsive layout for desktop and mobile
- documentation sufficient for further FE work

## Acceptance Criteria

The phase is successful if:
- the app renders a dashboard and stock detail page with no backend dependency
- the default cards view clearly surfaces actionable stocks first
- the table view supports dense scanning without becoming the primary visual mode
- the detail page leads with a clear decision summary
- filters, sorting, and view toggling are understandable and coherent
- the interface feels like a research cockpit rather than a trading terminal
- the mockup is good enough to review visual hierarchy and user flow before backend work

## Open Questions

Questions to settle during implementation or review:
- whether `Needs Review` should stay as the label or shift to a more explicit term
- whether the right-side insight rail should be always visible or collapse on smaller screens
- how much charting should appear in the mockup versus a simple technical status block
- whether saved views should be represented now or deferred

## Follow-Up After This Phase

Possible next steps after the mockup is approved:
- introduce a more detailed component system
- connect to a lightweight local API or static JSON loading layer
- define backend contract for watchlist and stock detail data
- define alert model and scheduler requirements
- evaluate whether any future pages need SSR or server data loading
