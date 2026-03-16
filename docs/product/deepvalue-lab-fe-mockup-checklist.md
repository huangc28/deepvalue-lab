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

- [ ] Build page container and section shell primitives
- [ ] Build reusable badge or status chip component
- [ ] Build metric block component for price and fair value display
- [ ] Build filter chip component
- [ ] Build segmented toggle for `Cards | Table`
- [ ] Build top navigation/search area
- [ ] Build empty-state and no-results patterns

## Phase 4: Dashboard

- [ ] Build dashboard page layout
- [ ] Build decision summary strip
- [ ] Build filter and sort controls
- [ ] Build right-side insight rail or secondary insights section
- [ ] Implement cards view as the default dashboard mode
- [ ] Implement table view as the secondary dashboard mode
- [ ] Ensure cards and table use the same underlying data
- [ ] Ensure clicking a card or row navigates to the same detail page

## Phase 5: Company Card Design

- [ ] Build company card component
- [ ] Show company name and ticker
- [ ] Show business type visibly on the card
- [ ] Show current price and base fair value
- [ ] Show discount or premium percentage
- [ ] Show valuation, thesis, and entry statuses
- [ ] Show action state prominently
- [ ] Show one-line decision summary
- [ ] Show last updated information
- [ ] Validate that the card can be scanned quickly

## Phase 6: Table View Design

- [ ] Build watchlist table component
- [ ] Add key columns for price, valuation, news, thesis, entry, and action
- [ ] Add sorting behavior
- [ ] Ensure the table remains readable at desktop widths
- [ ] Define reduced behavior for smaller screens

## Phase 7: Stock Detail Page

- [ ] Build top-of-page hero summary
- [ ] Build `Decision` section
- [ ] Build `Business Classification` section
- [ ] Build `Valuation` section
- [ ] Build `Thesis` section
- [ ] Build `Variant Perception` section
- [ ] Build `Valuation Lens` section
- [ ] Build `Current Valuation Snapshot` section
- [ ] Build `News to Model` section
- [ ] Build auditable `Bear / Base / Bull` scenario cards
- [ ] Build `What The Current Price Implies` section
- [ ] Build `Entry Timing` section
- [ ] Build `Thesis Status` section
- [ ] Build `Risks and Catalysts` section
- [ ] Build `What To Monitor Next` section
- [ ] Build `Sources Used` section
- [ ] Build `History` section
- [ ] Ensure the first screen explains the current conclusion clearly
- [ ] Ensure valuation appears before technical entry in the reading order
- [ ] Ensure the page supports both quick scanning and analytical auditability

## Phase 8: Interaction And State

- [ ] Implement search behavior
- [ ] Implement filters such as `cheap`, `thesis intact`, and `favorable entry`
- [ ] Implement sorting options such as `most actionable` and `largest discount`
- [ ] Implement `Cards | Table` view toggle
- [ ] Preserve filter and sort state while switching views
- [ ] Use route params or search params where appropriate
- [ ] Highlight changed or review-worthy items clearly

## Phase 9: Responsive Review

- [ ] Validate 3-column card grid on desktop
- [ ] Validate 2-column card grid on tablet
- [ ] Validate 1-column card stack on mobile
- [ ] Ensure dashboard controls remain usable on smaller screens
- [ ] Ensure detail page hero remains readable on mobile
- [ ] Decide whether insight rail collapses or moves below content on small screens

## Phase 10: UX Review

- [ ] Confirm dashboard feels like a decision dashboard, not a spreadsheet homepage
- [ ] Confirm cards are the strongest default entry point
- [ ] Confirm table view is useful without becoming visually dominant
- [ ] Confirm business type is visible early enough to frame valuation context
- [ ] Confirm variant perception is explicit, not implied
- [ ] Confirm valuation lens is visible and understandable
- [ ] Confirm bear / base / bull are more than three target prices
- [ ] Confirm the page explains what the current price implies
- [ ] Confirm technicals remain supporting information
- [ ] Confirm news is presented as model impact, not headline feed
- [ ] Confirm sources and monitor-next items are first-class content, not hidden metadata
- [ ] Confirm the interface answers `what changed` and `what should I do next`

## Phase 11: Handoff Readiness

- [ ] Review PRD against implemented pages
- [ ] Review design guideline against implemented hierarchy and states
- [ ] Capture screenshots or a demo for review
- [ ] List gaps, follow-ups, and deferred backend-dependent work
