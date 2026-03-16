# DeepValue Lab FE Mockup Checklist

Purpose:
- track implementation progress for the frontend-only DeepValue Lab mockup
- keep the team aligned on scope and order of work

Date:
- 2026-03-16

## Phase 0: Foundation Decisions

- [x] Align on product direction for a decision-support stock research app
- [x] Align on cards plus table dashboard strategy
- [x] Align on detail page information hierarchy
- [x] Align on client-side rendering for mockup phase
- [x] Align on `React + TypeScript + Vite + TanStack Router + Tailwind CSS`
- [x] Write web app design guideline
- [x] Write visual style direction
- [x] Write FE mockup PRD

## Phase 1: Project Setup

- [x] Initialize frontend project scaffold
- [x] Configure TypeScript
- [x] Configure Tailwind CSS
- [x] Configure TanStack Router
- [x] Define base layout shell
- [x] Define route structure for dashboard and stock detail pages
- [x] Set up linting and formatting if desired for the frontend workspace

## Phase 2: Mock Data Model

- [x] Create local mock stock dataset
- [x] Define stock summary type
- [x] Define stock detail type
- [x] Include at least 6 to 8 realistic stock examples
- [x] Ensure mock data covers multiple action states
- [x] Ensure mock data covers multiple thesis and entry conditions
- [x] Add example history and news-to-model data

## Phase 3: Shared UI Primitives

- [x] Build page container and section shell primitives
- [x] Build reusable badge or status chip component
- [x] Build metric block component for price and fair value display
- [x] Build filter chip component
- [x] Build segmented toggle for `Cards | Table`
- [x] Build top navigation/search area
- [ ] Build empty-state and no-results patterns

## Phase 4: Dashboard

- [x] Build dashboard page layout
- [x] Build decision summary strip
- [x] Build filter and sort controls
- [x] Build right-side insight rail or secondary insights section
- [x] Implement cards view as the default dashboard mode
- [x] Implement table view as the secondary dashboard mode
- [x] Ensure cards and table use the same underlying data
- [x] Ensure clicking a card or row navigates to the same detail page

## Phase 5: Company Card Design

- [x] Build company card component
- [x] Show company name and ticker
- [x] Show business type visibly on the card
- [x] Show current price and base fair value
- [x] Show discount or premium percentage
- [x] Show valuation, thesis, and entry statuses
- [x] Show action state prominently
- [x] Show one-line decision summary
- [x] Show last updated information
- [x] Validate that the card can be scanned quickly

## Phase 6: Table View Design

- [x] Build watchlist table component
- [x] Add key columns for price, valuation, news, thesis, entry, and action
- [x] Add sorting behavior
- [x] Ensure the table remains readable at desktop widths
- [ ] Define reduced behavior for smaller screens

## Phase 7: Stock Detail Page

- [x] Build top-of-page hero summary
- [x] Build `Decision` section
- [x] Build `Business Classification` section
- [x] Build `Valuation` section
- [x] Build `Thesis` section
- [x] Build `Variant Perception` section
- [x] Build `Valuation Lens` section
- [x] Build `Current Valuation Snapshot` section
- [x] Build `News to Model` section
- [x] Build auditable `Bear / Base / Bull` scenario cards
- [x] Build `What The Current Price Implies` section
- [x] Build `Entry Timing` section
- [x] Build `Thesis Status` section
- [x] Build `Risks and Catalysts` section
- [x] Build `What To Monitor Next` section
- [x] Build `Sources Used` section
- [x] Build `History` section
- [x] Ensure the first screen explains the current conclusion clearly
- [x] Ensure valuation appears before technical entry in the reading order
- [x] Ensure the page supports both quick scanning and analytical auditability

## Phase 8: Interaction And State

- [x] Implement search behavior
- [ ] Implement filters such as `cheap`, `thesis intact`, and `favorable entry`
- [x] Implement sorting options such as `most actionable` and `largest discount`
- [x] Implement `Cards | Table` view toggle
- [x] Preserve filter and sort state while switching views
- [x] Use route params or search params where appropriate
- [x] Highlight changed or review-worthy items clearly

## Phase 9: Responsive Review

- [ ] Validate 3-column card grid on desktop
- [ ] Validate 2-column card grid on tablet
- [ ] Validate 1-column card stack on mobile
- [ ] Ensure dashboard controls remain usable on smaller screens
- [ ] Ensure detail page hero remains readable on mobile
- [ ] Decide whether insight rail collapses or moves below content on small screens

## Phase 10: UX Review

- [x] Confirm dashboard feels like a decision dashboard, not a spreadsheet homepage
- [x] Confirm cards are the strongest default entry point
- [x] Confirm table view is useful without becoming visually dominant
- [x] Confirm business type is visible early enough to frame valuation context
- [x] Confirm variant perception is explicit, not implied
- [x] Confirm valuation lens is visible and understandable
- [x] Confirm bear / base / bull are more than three target prices
- [x] Confirm the page explains what the current price implies
- [x] Confirm technicals remain supporting information
- [x] Confirm news is presented as model impact, not headline feed
- [x] Confirm sources and monitor-next items are first-class content, not hidden metadata
- [x] Confirm the interface answers `what changed` and `what should I do next`

## Phase 11: Handoff Readiness

- [ ] Review PRD against implemented pages
- [ ] Review design guideline against implemented hierarchy and states
- [ ] Capture screenshots or a demo for review
- [ ] List gaps, follow-ups, and deferred backend-dependent work
