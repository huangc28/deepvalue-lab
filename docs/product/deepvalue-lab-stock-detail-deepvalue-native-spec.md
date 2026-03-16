# DeepValue Lab Stock Detail DeepValue-Native Spec

Purpose:
- define a stock detail page structure that fully reflects the DeepValue Lab analysis method
- turn the current design discussion into a UI specification that preserves both speed and analytical auditability

Date:
- 2026-03-16

Status:
- draft

## Why This Spec Exists

The current product direction is strong on decision visibility:
- cheap / fair / rich
- thesis status
- technical entry status
- action state

However, DeepValue Lab is not only a decision dashboard.
It is a valuation-first analysis method with explicit reasoning steps.

This spec fills the gap between:
- a useful stock dashboard
- a DeepValue-native analysis interface

## Core Design Goal

The stock detail page must do two jobs at once:
- help the user understand the conclusion quickly
- let the user audit how that conclusion was reached

In product terms:
- top of page = decision clarity
- rest of page = analytical audit trail

## Page Principle

The page should follow this logic:

1. what is the current call
2. why the market may be wrong
3. what valuation framework is being used
4. what assumptions drive bear / base / bull
5. what the current price already implies
6. whether the thesis is still intact
7. whether entry timing is favorable now
8. what to monitor next
9. what sources support the analysis

This ordering reflects the DeepValue Lab method better than a generic company-profile layout.

## Required Top-Level Sections

The stock detail page should use this section order:

1. Hero Summary
2. Decision
3. Business Classification
4. Thesis
5. Variant Perception
6. Valuation Lens
7. Current Valuation Snapshot
8. Recent News And News-To-Model Translation
9. Bear / Base / Bull Scenarios
10. What The Current Price Implies
11. Thesis Status
12. Technical Entry Status
13. What To Monitor Next
14. Sources Used
15. History

This order is intentionally close to the DeepValue Lab report contract.

## 1. Hero Summary

The hero should answer the current decision state in one screen.

Required content:
- company name
- ticker
- business type
- current price
- fair value range
- discount or premium versus base fair value
- action state
- valuation status
- thesis status
- news impact status
- technical entry status
- one-sentence decision summary
- last updated

Recommended layout:
- left: company identity and business type
- center: price, fair value, discount or premium
- right: action badge and key statuses
- bottom: one-sentence conclusion

The hero should answer:
- what is the current call on this stock

## 2. Decision

This section is a short decision memo, not a full report.

Required blocks:
- `Current Call`
- `Next Step`
- `Why It Matters`

Example content:
- Current Call: cheap versus base value, but timing still neutral
- Next Step: wait for a more favorable entry or a confirming update
- Why It Matters: the price implies muted growth while the base case still supports upside

This section should be easy to read in under 20 seconds.

## 3. Business Classification

This section must be visible in the product, not hidden as metadata.

Required content:
- company type classification
- why that classification changes the valuation method

Example labels:
- mature compounder
- cyclical
- semicap
- high-growth platform
- capital-intensive hybrid
- pre-commercial

Recommended UI:
- a compact classification card with a short explanation

Reason:
- DeepValue Lab chooses valuation method from business type
- without this, the rest of the analysis feels arbitrary

## 4. Thesis

This section should present the investment case clearly, without bloated prose.

Required content:
- one top-line thesis statement
- 3 to 5 supporting thesis bullets
- each bullet can carry a status if useful

Recommended UI:
- top thesis summary line
- below it, a structured bullet list with short explanations

The section should answer:
- what the investor is really betting on

## 5. Variant Perception

This is currently underrepresented in the discussed design and must be made explicit.

Required content:
- where the market may be too optimistic or too pessimistic
- what mismatch between price and reality is being evaluated

Recommended UI:
- a highlighted card titled `Why This May Be Mispriced`
- 1 to 3 bullets

This section should answer:
- what is the non-consensus angle here

If this section is missing, the page becomes a summary instead of an investment case.

## 6. Valuation Lens

This section should explain the analytical framework, not only the output.

Required content:
- primary valuation lens
- optional secondary cross-check
- why this framework fits this business type
- why obvious alternatives are less useful if relevant

Recommended UI:
- left column: primary lens and cross-check
- right column: short rationale

Example:
- Primary lens: forward P/E
- Cross-check: FCF yield
- Why it fits: mature, cash-generative business with stable unit economics

This section should answer:
- how are we valuing this business and why

## 7. Current Valuation Snapshot

This section anchors the user in the current market setup.

Required content:
- current price
- market cap and/or enterprise value if relevant
- key multiples
- balance sheet context if relevant

Recommended UI:
- metric cards for core numbers
- small supporting notes underneath for balance sheet or leverage context

This section should answer:
- what does the stock look like right now on a market basis

## 8. Recent News And News-To-Model Translation

This section must avoid looking like a generic news feed.

Required content for each item:
- what happened
- what changed in the model
- which scenario probability changed, if applicable
- what it means for fair value, thesis, or risk

Recommended UI pattern:
- each update shown as a structured row or card with fixed fields:
  - Event
  - Model Variable Changed
  - Impact
  - Affected Scenario

Allowed model-variable mappings:
- revenue
- margin
- capex
- balance sheet risk
- multiple
- scenario probability
- thesis quality

This section should answer:
- did recent information actually change the underwriting

## 9. Bear / Base / Bull Scenarios

This is one of the most important DeepValue-native sections.

The UI must not reduce this to three target prices only.

Each scenario must show:
- operating assumptions
- valuation assumptions
- fair value or range
- what must be true

Recommended UI:
- three side-by-side scenario cards on desktop
- stacked cards on smaller screens

Each scenario card should include:
- scenario label
- revenue or demand assumption
- margin or profitability assumption
- chosen multiple or valuation assumption
- implied fair value
- confidence note or condition note

If EV-based valuation is used, the UI should make the bridge auditable enough to follow.

This section should answer:
- what assumptions produce the valuation range

## 10. What The Current Price Implies

This section is essential and should be visually prominent.

Required content:
- what expectations appear embedded in the current stock price
- what the market seems to be underwriting on growth, margins, risk, or multiple

Recommended UI:
- a dedicated interpretation block between scenarios and final status sections

Why this placement matters:
- it acts as the bridge between valuation work and the final judgment

This section should answer:
- what does the market already believe

## 11. Thesis Status

This section should remain explicit, not implied.

Required content:
- one of `intact`, `watch`, or `broken`
- explanation of what changed or did not change

Recommended UI:
- status header
- below it, bullets for:
  - what remains true
  - what is weakening
  - what would break the thesis

This section should answer:
- is the original case still valid

## 12. Technical Entry Status

This section should follow valuation and thesis.

Required content:
- one of `favorable`, `neutral`, or `stretched`
- short explanation
- technicals framed as execution support only

Recommended UI:
- summary card with:
  - status
  - brief explanation
  - optional compact chart
  - RSI / EMA / MRC support notes if useful

Important rule:
- the visual weight of this section must stay below valuation and scenario sections

This section should answer:
- is now a good execution zone

## 13. What To Monitor Next

This section is required for decision usefulness.

Required content:
- at least three concrete future facts or checkpoints

Examples:
- next quarter revenue relative to guidance
- margin trajectory
- customer concentration development
- capex discipline
- regulatory or geopolitical developments

Recommended UI:
- checklist-style monitoring list
- each item can optionally include:
  - why it matters
  - what directional outcome would strengthen or weaken the case

This section should answer:
- what would change my conclusion next

## 14. Sources Used

This section should be a first-class part of the interface, not hidden behind an icon.

Required content:
- official and current sources used in the analysis

Recommended UI:
- grouped source list:
  - latest earnings release
  - latest filing
  - investor relations material
  - recent material news

The user should be able to verify major claims without leaving the product confused about provenance.

This section should answer:
- what supports these claims

## 15. History

History is useful, but it should remain below the analysis core.

Recommended content:
- prior fair value updates
- thesis status changes
- news impact changes
- action state changes

Recommended UI:
- chronological timeline

This section should answer:
- what changed over time

## Sidebar Or Sticky Summary

For desktop, the detail page can include a sticky summary rail containing:
- action state
- valuation status
- thesis status
- entry status
- last updated
- quick jump links to sections

This improves navigation without replacing the main content order.

## What Must Be Visible Above The Fold

Before the user scrolls, the page should show:
- current call
- business type
- current price
- fair value range
- valuation status
- thesis status
- entry status
- one-line summary

If the above-the-fold area focuses on charts or generic company description, the page is off-method.

## What Should Never Be Hidden Too Deep

These should never be buried in tabs or accordions by default:
- business classification
- variant perception
- valuation lens
- bear / base / bull assumptions
- what the current price implies
- thesis status
- what to monitor next

These are not optional details.
They are part of the analytical contract.

## Design Implications

This spec implies several changes to the existing design direction:
- add `Business Type` visibly on cards and detail pages
- add explicit `Variant Perception` block
- add explicit `Valuation Lens` block
- expand scenarios from price targets into auditable assumption cards
- add `What The Current Price Implies` as a dedicated section
- promote `What To Monitor Next` and `Sources Used` into formal page modules

These changes make the interface more recognizably DeepValue-native.

## Summary

The stock detail page should not feel like a prettier stock profile.

It should feel like:
- a fast decision memo at the top
- a disciplined investment case underneath
- an auditable DeepValue analysis all the way down
