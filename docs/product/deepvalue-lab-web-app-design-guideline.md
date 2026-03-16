# DeepValue Lab Web App Design Guideline

Purpose:
- define a shared UI / UX direction for the DeepValue Lab web app MVP
- keep the product focused on decision support rather than raw data display
- provide a reference for wireframes, visual design, and implementation

Date:
- 2026-03-16

## Product Positioning

DeepValue Lab is a personal value-investing research tool with timing assistance.

The app should help the user answer four questions for each stock:
- is the stock cheap, fair, or rich right now
- has recent news changed the valuation model
- is the current market price a good entry zone
- is the original thesis intact, weakening, or broken

The product is not a broker interface, a social feed, or a generic market dashboard.
It should feel like a research cockpit for making better stock decisions.

## Core UX Principle

The UI should optimize for this user question:
- what do I need to look at now, and what should I do next

This leads to four design rules:
- show judgment before showing raw data
- show changes before showing static information
- show decision priority before showing full coverage
- keep valuation first and technicals second

## Primary User Need

The user is not primarily looking for more information.
The user is looking for faster decision clarity.

The app should make it easy to answer:
- which stocks are worth reviewing now
- which stocks are actually undervalued versus just falling
- whether news changed the model or is just noise
- whether the current setup is actionable, not only interesting

## Information Hierarchy

Across the app, the information hierarchy should be:

1. action state
2. price versus fair value
3. thesis status
4. news impact on the model
5. entry timing status
6. supporting detail and history

This hierarchy should be consistent in cards, tables, and detail pages.

## Decision States

The product should use a small, stable set of decision-oriented states.

Recommended statuses:

- valuation: `cheap` / `fair` / `rich`
- news impact: `improving` / `unchanged` / `deteriorating`
- thesis: `intact` / `watch` / `broken`
- technical entry: `favorable` / `neutral` / `stretched`
- action state: `strong accumulation` / `watch for confirmation` / `fairly valued` / `trim zone` / `thesis at risk`

For dashboard grouping, recommended buckets are:
- `Now Actionable`
- `Needs Review`
- `At Risk`

Meaning of `Needs Review`:
- the stock has new information or a changed setup that deserves renewed analysis
- it is not automatically bullish or bearish
- it signals that the prior conclusion may no longer be reliable

If a more explicit label is preferred later, alternatives include:
- `Recheck Now`
- `Thesis Review`
- `待複核`
- `需重看`

## Dashboard Strategy

The dashboard should be a decision dashboard, not a spreadsheet homepage.

The primary goal of the dashboard is:
- help the user identify which stocks deserve attention first

The dashboard should support two views backed by the same data:
- `Cards View` for scanning, prioritizing, and daily review
- `Table View` for comparison, sorting, and efficient batch review

These are two views of the same watchlist, not two separate products.

Shared controls across both views:
- search by ticker or company name
- filters for `cheap`, `thesis intact`, `favorable entry`, `needs review`, and similar states
- sorting such as `most actionable`, `largest discount`, `recently changed`
- click through to a shared stock detail page

### Cards View

Cards View should be the default homepage experience.

Why:
- better expresses priority and state
- easier to scan for opportunities
- more natural on mobile and tablet
- better aligned with decision-first UX

Each company card should show:
- company name and ticker
- current price
- base fair value
- discount or premium percentage
- valuation status
- thesis status
- entry status
- action state
- one-line decision summary
- last updated time

Recommended card structure:
- header: company, ticker, action badge
- core value block: price, fair value, discount or premium
- status row: valuation, thesis, entry
- decision summary: one short sentence
- footer: news impact and last updated

The card should answer:
- is this stock worth clicking into right now

### Table View

Table View should be available as a secondary mode for power use.

Use Table View when the user wants to:
- compare many names quickly
- sort by valuation gap or update time
- scan multiple fields at once

Recommended columns:
- ticker
- company
- current price
- bear / base / bull or base fair value
- discount or premium percentage
- news impact
- thesis
- technical entry
- action state
- last updated

The table should remain compact, sortable, and easy to scan.
It should not become the primary storytelling surface.

## Stock Detail Page

The detail page should start with the current conclusion, not the company description.

Top-of-page hero content:
- company name and ticker
- current price
- fair value range
- discount or premium versus base fair value
- action state
- thesis status
- news impact status
- entry status
- one-sentence decision summary
- last updated time

Recommended section order:

1. `Decision`
2. `Valuation`
3. `Thesis`
4. `News to Model`
5. `Entry Timing`
6. `Risks and Catalysts`
7. `History`

### Decision

This section should provide:
- one concise conclusion
- one explicit next step

Example:
- cheap versus base value, thesis intact, but entry still neutral
- wait for pullback into a favorable zone before adding

### Valuation

This section should show:
- bear, base, and bull fair values
- current price location within that range
- implied upside or downside
- the core assumptions behind the model
- last update time for the valuation

### Thesis

This section should not be a long essay by default.
It should present the thesis as a short set of key claims, each with status.

Recommended pattern:
- 3 to 5 thesis bullets
- each bullet can be marked `intact`, `watch`, or `broken`

This helps the user see exactly which part of the thesis weakened.

### News to Model

This section should not be a generic news feed.
Only show news that affects the model or thesis.

Each item should translate:
- what happened
- what changed in the model
- impact on fair value, thesis, or both

The interface should favor interpretation over headline volume.

### Entry Timing

Technicals should support valuation, not replace it.

This section should:
- summarize entry quality as `favorable`, `neutral`, or `stretched`
- optionally show RSI, EMA, MRC, or similar support metrics
- include a supporting chart if useful

The chart should be visually subordinate to the decision and valuation sections.

## Interaction Guidelines

Important interaction behavior:
- filters must persist when switching between cards and table
- sort logic should remain consistent across views
- any state change should be clearly highlighted
- recently changed items should be easy to isolate
- click behavior should be predictable in both views

High-value interaction patterns:
- `changed since last review`
- `new combo alerts`
- `fair value revised`
- `thesis downgraded`
- `entry improved`

These change-based cues are often more valuable than static snapshots.

## Content Rules

The app should avoid overwhelming the user with undifferentiated data.

Content rules:
- do not surface news unless it changes the model or thesis
- do not let technical charts dominate first-screen attention
- do not force the user to infer the action state from multiple fields
- do not overuse dense tables where cards or grouped sections are clearer
- do not present valuation without thesis context

Every screen should answer:
- so what

## Visual Direction

The visual language should feel serious, focused, and durable.

Design intent:
- research cockpit, not trading casino
- high information density with clean hierarchy
- strong typography and restrained semantic color use

Recommended visual traits:
- neutral light background or warm off-white foundation
- dark ink or graphite text colors
- restrained green, amber, and red for semantic states
- generous spacing between section groups
- tabular numerals for prices and percentages
- stable badge styles for repeated status systems

Status colors should be disciplined and reusable:
- `cheap` and `intact`: calm green family
- `fair` and neutral states: gray or slate family
- `watch`: amber family
- `rich`, `broken`, and `thesis at risk`: muted red family

Avoid:
- noisy gradients or flashy trading-app aesthetics
- over-bright charts
- too many competing badge colors
- excessive card decorations that reduce readability

## Responsive Behavior

Recommended responsive behavior:
- desktop: cards in a 3-column grid
- tablet: cards in a 2-column grid
- mobile: single-column stacked cards

Cards View should remain first-class on mobile.
Table View can become a simplified list or horizontally scrollable comparison surface.

The detail page should keep the hero summary visible early on mobile without making the screen feel crowded.

## Success Criteria

The design is successful if the user can do these things quickly:
- identify which stock deserves deeper review
- tell whether the stock is cheap, fair, or rich
- understand whether the thesis is intact
- understand whether recent news changed the model
- know whether current conditions are actionable
- know what to do next without assembling the answer manually

## Design Summary

In one sentence:

DeepValue Lab should help the user decide which stock is worth attention now, why it matters, and what action makes sense next.
