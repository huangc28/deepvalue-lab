# Report-to-UI Transform Rules

Date: 2026-04-15

When converting a raw markdown analysis report (from research/archive/) into the structured JSON that the stock detail page consumes (StockDetail in web/src/types/stocks.ts), apply these rules.

## 0. Reader Orientation

The hero is the first-stop surface for non-specialist readers.

Rules:

- `summary` and `currentPriceImpliesBrief` should preserve the report's `Quick Take For General Readers` orientation
- prefer plain-language wording over analyst shorthand in hero-facing text
- avoid unexplained acronyms in hero-facing text unless the acronym is more familiar than the fully written term
- the reader should be able to understand the core call from the hero before opening scenario details

## 1. Scenario Key Metrics

Extract from the Bear/Base/Bull tables in the report:

Field               | Source in report
keyMetrics.revenue  | "FY revenue" row
keyMetrics.eps      | "Non-GAAP EPS" row
keyMetrics.targetPE | "Target P/E" row

Format: short tokens like $46.5B, $6.56, 28x. No prose. These appear in a compact metrics row inside each scenario card alongside the fair value.

The operatingAssumption, valuationAssumption, fairValue, and whatMustBeTrue fields remain as prose extracted from the report sections 7/8/9.

## 2. Current Price Implies — Brief vs Full

The report section "What The Current Price Implies" produces two fields:

currentPriceImplies: the full paragraph, used in the Pricing Context section
currentPriceImpliesBrief: a single sentence (max ~25 words) summarizing the pricing thesis, used in the hero card

Example brief: "Market prices in full consensus ~34% growth and AI GPU doubling with no re-rating — no upside surprise baked in."

Rule: lead with what the market IS pricing, end with what it is NOT pricing.
Prefer plain-language wording over compressed analyst shorthand because this field sits in the hero.

## 3. Current Price Implied Facts

Extract from the "What The Current Price Implies" section. Each fact becomes a FactItem:

label: short noun phrase (2-3 words), e.g. "Revenue Growth", "AI GPU Revenue", "Forward Multiple"
value: compact data-first format, e.g. "~+34% ($34.6B → $46.5B)", "~29x P/E — execution, not NVIDIA premium"

Rule: numbers first, context second. Use → for transitions, — for qualifiers. No full sentences.

## 4. Hero Metrics Layout

The hero shows 4 metric blocks:

Position | Field            | Logic
1        | Current Price    | $${currentPrice}
2        | Fair Value Range | $${bearFairValue} - $${bullFairValue}
3        | Premium/Discount | Dynamic label: "Premium To Base" when discountToBase > 0, "Discount To Base" when negative. Color: red for premium, green for discount.
4        | Upside/Downside  | Calculated: +${bullUpside}% / -${bearDownside}% from current price to bull and bear fair values.

The action state ("needs review", "strong accumulation", etc.) is shown only as a badge, not as a metric block.

## 5. News-To-Model Compact Format

Each NewsToModelItem renders as a single-line card (not 4 stacked rows):

Default: event text + scenario tag (right-aligned pill)
On click/expand: model variable + impact detail

The event, modelVariableChanged, impact, and affectedScenario fields from the report section "News-To-Model" map 1:1. No reformatting needed — the UI handles density.

## 6. Section Reading Order

The detail page renders sections in this order:
  Hero (summary, badges, metrics, variant perception, price implies brief; should work as a 30-second read for a non-specialist reader)
  Scenario Model (Bear/Base/Bull with key metrics)
  Current Valuation Snapshot (market cap, EV, multiples, balance sheet)
  Pricing Context (full price implies + expectation bridge + rail)
  Entry Timing (technical status)
  Provisional Conclusion
  Valuation Context (lens only — no business classification card, already in hero)
  Thesis
  News-To-Model (compact expandable cards)
  Thesis Status
  Risks and Catalysts
  Monitor Next + Sources (side by side)
  History

## 7. Fields That Are Computed, Not Extracted

These fields are calculated during transform, not pulled from report text:

discountToBase: ((currentPrice - baseFairValue) / baseFairValue) * 100
dashboardBucket: derived from actionState
Upside/downside percentages: derived from currentPrice vs bull/bear fair values
nearestScenario: derived from which fair value is closest to current price
