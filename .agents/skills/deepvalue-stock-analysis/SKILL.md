---
name: deepvalue-stock-analysis
description: Analyze a public company using the DeepValue Lab methodology for stock research. Use when the user asks to analyze a stock, update a company thesis, review whether a stock is cheap/fair/rich, translate recent news into valuation model changes, judge whether the thesis is intact/watch/broken, or evaluate technical entry timing as a support layer after valuation.
---

# DeepValue Stock Analysis

Use this skill to produce a DeepValue Lab quality stock analysis report.

This skill is for analysis quality and execution consistency. It is not a generic stock-summary skill.

## Load The Method First

Before doing substantive company analysis, read these methodology documents:

- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-stock-analysis-standard.md`
- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-report-contract.md`
- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-agent-execution-sop.md`
- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-valuation-framework.md`
- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-technicals-guide.md`
- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-report-to-ui-transform.md`
- `.agents/skills/deepvalue-stock-analysis/docs/deepvalue-lab-persistence-policy.md`

## Required Workflow

Follow this workflow in order:

1. Read the methodology docs in .agents/skills/deepvalue-stock-analysis/docs/ first.
2. Read `research/cases/_index.md` to find prior cases with similar business type. Read the relevant case files for modeling context.
3. Classify the business before choosing valuation metrics.
4. Verify fresh current facts from official and current sources.
5. Build the economic picture: revenue drivers, margin drivers, cash flow drivers, valuation drivers, and key risks.
6. Translate recent news into model changes.
7. Build bear / base / bull scenarios.
8. Explain what the current price implies.
9. Determine thesis status.
10. Determine technical entry status.
11. Write the report using the required contract.
12. Generate the EN `StockDetail` JSON from the report.
13. Generate the zh-TW `StockDetail` JSON by translating prose fields from the EN JSON.
14. Save all three artifacts to the research archive.
15. Write a case entry to `research/cases/<TICKER>.md` using the template in `research/cases/_TEMPLATE.md`. Update the index table in `research/cases/_index.md`.
16. Perform a completion check before finishing.
17. Perform a benchmark quality check before finishing.

## Source Rule

Use current sources for:

- price
- latest earnings release
- latest annual or quarterly filing
- latest guidance
- recent material company or industry news

Prefer official company filings, official investor-relations releases, and other primary sources.

## Output Contract

The report must include all of these sections in this order:

1. Business Classification
2. Thesis
3. Variant Perception
4. Valuation Lens
5. Current Valuation Snapshot
6. Recent News And News-To-Model Translation
7. Bear Case
8. Base Case
9. Bull Case
10. What The Current Price Implies
11. Provisional Conclusion
12. Thesis Status
13. Technical Entry Status
14. What To Monitor Next
15. Sources Used

If a required section is missing, the analysis is incomplete.

## Judgment Style Rule

The report should include professional judgment, not just neutral description.

This means:

- make a clear, evidence-based call on where the market may be misreading the setup
- state what you personally judge to be the key underwriting risk or key hidden support in the current price
- keep the tone like a buy-side memo: direct, grounded, and conditional

This does not mean:

- exaggerating certainty
- using dramatic language unsupported by the sources
- turning opinion into a substitute for valuation work

The best places for this judgment are usually:

- Variant Perception
- What The Current Price Implies
- Provisional Conclusion
- Thesis Status

## Cross-Check Rule

After choosing the primary valuation lens, add a secondary valuation cross-check when it improves decision usefulness.

Examples:

- mature compounder: primary `forward P/E`, cross-check `FCF yield`
- high-growth platform: primary `forward EV/sales`, cross-check `forward P/E` or `FCF yield`
- capital-intensive hybrid: primary `EV/EBIT` or `EV/EBITDA`, cross-check `P/E` or normalized `FCF`

Rules:

- the primary lens must still be chosen by business type
- the cross-check must not replace the primary lens
- use the cross-check to help investors judge how demanding the current valuation is from a second angle
- if a common cross-check is not useful because of SBC, dilution, tax effects, capex distortion, cyclicality, or accounting noise, say so explicitly instead of forcing it into the report

Preferred placement:

- mention the cross-check in `Valuation Lens`
- include the relevant number in `Current Valuation Snapshot`
- use it only as supporting evidence in the conclusion, not as the main driver unless the business type truly fits it

## Technicals Rule

Use technicals only as an execution layer after valuation is established.

Current default framework:

- RSI plus EMA for momentum and momentum-turn confirmation
- MRC-compatible logic for price stretch versus mean

Do not use technicals to prove intrinsic value.

Technical entry status must be one of:

- favorable
- neutral
- stretched

## Structured Data Generation

After writing the markdown report, generate two `StockDetail` JSON files — one in English, one in Traditional Chinese.

The type definition lives at `web/src/types/stocks.ts`. All `LocalizedText` fields are plain `string` in each JSON file. The EN JSON contains English strings; the zh-TW JSON contains Traditional Chinese strings. Do not use `{ en, 'zh-TW' }` bilingual objects.

### Report-to-StockDetail Field Mapping

**StockSummary fields (always required):**

| Field | Source |
|---|---|
| `id` | lowercase ticker |
| `ticker` | ticker symbol |
| `companyName` | full company name |
| `businessType` | from Business Classification section |
| `currentPrice` | verified current price (number) |
| `valuationStatus` | derived: `'cheap'` if price < bear fair value × 1.1, `'rich'` if price > bull fair value × 0.9, else `'fair'` |
| `newsImpactStatus` | net direction of news-to-model items: `'improving'` / `'unchanged'` / `'deteriorating'` |
| `thesisStatus` | from Thesis Status section: `'intact'` / `'watch'` / `'broken'` |
| `technicalEntryStatus` | from Technical Entry Status section: `'favorable'` / `'neutral'` / `'stretched'` |
| `actionState` | derived from valuation + thesis + technical status combination |
| `dashboardBucket` | derived from actionState |
| `baseFairValue` | base case fair value (number) |
| `bearFairValue` | bear case fair value (number) |
| `bullFairValue` | bull case fair value (number) |
| `discountToBase` | computed: `((currentPrice - baseFairValue) / baseFairValue) * 100` |
| `summary` | 1-2 sentence decision summary from Provisional Conclusion |
| `lastUpdated` | analysis date (YYYY-MM-DD) |

**StockDetail fields:**

| Field | Source |
|---|---|
| `thesisStatement` | from Thesis section — the core thesis sentence |
| `thesisBullets` | from Thesis section — supporting bullet points |
| `variantPerception` | from Variant Perception section |
| `valuationLens` | `{ primary, crossCheck, rationale }` from Valuation Lens section |
| `currentValuationSnapshot` | `{ marketCap?, enterpriseValue?, multiples[], balanceSheetNote? }` from Current Valuation Snapshot |
| `newsToModel` | array of `{ event, modelVariableChanged, impact, affectedScenario }` from News-To-Model section |
| `scenarios` | array of 3 `{ label, keyMetrics?: { revenue, eps, targetPE }, operatingAssumption, valuationAssumption, fairValue, whatMustBeTrue }` |
| `currentPriceImplies` | full paragraph from What The Current Price Implies |
| `currentPriceImpliesBrief` | single sentence (max ~25 words) summary for hero card |
| `currentPriceImpliedFacts` | array of `{ label, value }` — implied EPS, revenue, margin, multiple facts |
| `provisionalConclusion` | from Provisional Conclusion section |
| `technicalCommentary` | prose summary from Technical Entry Status |
| `technicalSignals` | array of `{ label, value }` — RSI, EMA, support/resistance levels |
| `risks` | from risk items in the report |
| `catalysts` | from catalyst items in the report |
| `monitorNext` | from What To Monitor Next section |
| `sourcesUsed` | array of `{ label, url? }` from Sources Used |
| `history` | array with at least one entry for this analysis date |

### Scenario Key Metrics Extraction

Extract from Bear/Base/Bull tables in the report:

| Field | Source in report |
|---|---|
| `keyMetrics.revenue` | FY revenue row — format as short token like `$46.5B` |
| `keyMetrics.eps` | Non-GAAP EPS row — format like `$6.56` |
| `keyMetrics.targetPE` | Target P/E row — format like `28x` |

### zh-TW JSON Production

Generate the zh-TW `StockDetail` JSON by translating prose fields from the EN JSON. Do not write a separate zh-TW markdown report.

**Translate** (different in each JSON):
- `businessType`, `summary`
- `thesisStatement`, `thesisBullets[]`
- `variantPerception`
- `valuationLens.primary`, `.crossCheck`, `.rationale`
- `currentValuationSnapshot.marketCap`, `.enterpriseValue`, `.multiples[]`, `.balanceSheetNote`
- `newsToModel[].event`, `.modelVariableChanged`, `.impact`, `.affectedScenario`
- `scenario[].operatingAssumption`, `.valuationAssumption`, `.fairValue`, `.whatMustBeTrue`
- `currentPriceImplies`, `currentPriceImpliesBrief`
- `currentPriceImpliedFacts[].label`, `.value`
- `provisionalConclusion`
- `technicalCommentary`
- `technicalSignals[].label`, `.value`
- `risks[]`, `catalysts[]`, `monitorNext[]`
- `sourcesUsed[].label`
- `history[]`

**Copy as-is** (identical in both JSONs):
- `id`, `ticker`, `companyName`, `lastUpdated`
- `currentPrice`, `baseFairValue`, `bearFairValue`, `bullFairValue`, `discountToBase`
- `valuationStatus`, `newsImpactStatus`, `thesisStatus`, `technicalEntryStatus`, `actionState`, `dashboardBucket`
- `scenario[].label`, `scenario[].keyMetrics.*`
- `sourcesUsed[].url`

**zh-TW translation rules** (from report contract Section 8.5):
- Open each prose field with a plain-language lead before technical detail
- Explain acronyms on first use (e.g., 每股盈利（EPS）)
- Retain financial jargon — do not replace with simplified terms
- Apply light simplification: clearer sentences, shorter constructions
- Retain all numerical data unchanged

### Computed Fields

These fields are calculated during transform, not pulled from report text:

- `discountToBase`: `((currentPrice - baseFairValue) / baseFairValue) * 100`
- `dashboardBucket`: derived from `actionState`
- Upside/downside percentages: derived from `currentPrice` vs bull/bear fair values

### Save To Research Archive

After generating all three artifacts, save them to the local research archive:

1. Write the English markdown report to `research/archive/YYYY/MM/DD/<TICKER>.analysis.md`.
2. Write the EN `StockDetail` JSON to `research/archive/YYYY/MM/DD/<TICKER>.stock-detail.json`.
3. Write the zh-TW `StockDetail` JSON to `research/archive/YYYY/MM/DD/<TICKER>.stock-detail-zh-TW.json`.

Use the analysis date for the path. Create intermediate directories if they do not exist.

This step is mandatory for every substantial analysis. The archive is the source of truth for historical reproducibility.

### Output and Publish

After generating both `StockDetail` JSONs:

1. Ask the user whether to publish to the backend.
2. If the user confirms, use the helper at `references/publish_stock_analysis.py` instead of hand-building the request body.
3. Call it with absolute artifact paths. Example:
   ```bash
   python3 .agents/skills/deepvalue-stock-analysis/references/publish_stock_analysis.py \
     --ticker VST \
     --report /abs/path/research/archive/YYYY/MM/DD/VST-analysis.md \
     --detail /abs/path/research/archive/YYYY/MM/DD/VST-stock-detail.json \
     --detail-zh /abs/path/research/archive/YYYY/MM/DD/VST-stock-detail-zh-TW.json \
     --base-url http://localhost:9000 \
     --provenance <agent>
   ```
   Set `--provenance` to reflect the actual agent running the analysis:
   - Gemini CLI → `gemini-2.5-pro`
   - Codex CLI → `codex-gpt-5`
   - Claude Code → `claude-sonnet`
4. Use `--payload` first if you need to inspect the JSON request before sending it.
5. Verify the response is `201` and includes `reportId`, `r2ReportKey`, `r2DetailKey`, and, when zh-TW JSON is sent, `r2DetailZhTWKey`.
4. If the user declines, skip publish. The report and structured data remain in the conversation only.

Do not publish automatically. Always ask first.

Notes:

- The helper defaults to `http://localhost:9000`.
- Override `--base-url` only if the user's backend runs somewhere else.

### Validation

After generating the structured data:

- Verify the object satisfies the `StockDetail` interface (all required fields present)
- Verify fair values in scenarios match the summary-level `bearFairValue` / `baseFairValue` / `bullFairValue`
- Verify `discountToBase` is correctly computed
- If published, verify the `201` response from the backend

## Guardrails

Do not:

- write the report from memory without loading the local methodology docs
- summarize news without changing the model
- stop at valuation only
- stop at business quality only
- use the wrong valuation method for the business type
- present fair values that cannot be audited from the stated assumptions
- model only upside drivers while leaving the main multiple-capping risks outside the worksheet
- use body claims that are not backed by the listed sources
- omit thesis status
- omit technical entry status
- conclude based on company quality without tying it to price versus value

## Completion Check

Before finishing, verify that the report includes:

- thesis
- variant perception
- valuation lens
- current valuation snapshot
- news-to-model
- bear case
- base case
- bull case
- current price implication
- provisional conclusion
- thesis status
- technical entry status
- monitoring section
- sources

If any of these are missing, keep working.

Also verify that:

- the EN `StockDetail` JSON was generated
- the zh-TW `StockDetail` JSON was generated
- all three artifacts were saved to `research/archive/YYYY/MM/DD/`
- the user was asked whether to publish to the backend
- if published, the backend returned `201` with valid `reportId` and R2 keys

Then check whether the report meets the DeepValue Lab benchmark quality bar.

Minimum benchmark questions:

- Is this at least as decision-useful and auditable as the internal AMAT-style benchmark?
- Does the valuation method match the company type cleanly?
- Are the main downside and multiple-capping variables modeled, not just mentioned later?
- Can another agent reproduce the scenario outputs from the stated assumptions?
- Are all material claims in the body covered by `Sources Used`?

If any answer is no, the report is below standard even if all sections are present.

## Persistence Rule

Default behavior:

- full report belongs in the archive when persistence is needed
- second brain writeback is selective, not automatic

Write into second brain only if:

- the user explicitly asks
- the analysis adds durable reusable insight
- the analysis introduces a new company type or valuation method
- the analysis materially changes a standing framework or thesis
