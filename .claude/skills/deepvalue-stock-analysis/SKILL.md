---
name: deepvalue-stock-analysis
description: Analyze a public company using the DeepValue Lab methodology for stock research. Use when the user asks to analyze a stock, update a company thesis, review whether a stock is cheap/fair/rich, translate recent news into valuation model changes, judge whether the thesis is intact/watch/broken, or evaluate technical entry timing as a support layer after valuation.
---

# DeepValue Stock Analysis

Canonical repo skill source:
- `/Users/huangchihan/develop/profound-stock/.agents/skills/deepvalue-stock-analysis/SKILL.md`

Keep this Claude project-scope copy aligned with the canonical repo skill when the methodology changes.

Use this skill to produce a DeepValue Lab quality stock analysis report.

This skill is for analysis quality and execution consistency. It is not a generic stock-summary skill.

## Load The Method First

Before doing substantive company analysis, read these repo documents:

- `/Users/huangchihan/develop/profound-stock/docs/analysis/deepvalue-lab-stock-analysis-standard.md`
- `/Users/huangchihan/develop/profound-stock/docs/analysis/deepvalue-lab-report-contract.md`
- `/Users/huangchihan/develop/profound-stock/docs/analysis/deepvalue-lab-agent-execution-sop.md`

Also read these if persistence or archive behavior is relevant:

- `/Users/huangchihan/develop/profound-stock/docs/research/stock-analysis-persistence.md`
- `/Users/huangchihan/develop/profound-stock/research/templates/stock-analysis-report-template.md`

## Required Workflow

Follow this workflow in order:

1. Query NotebookLM / second brain first.
2. Retrieve the DeepValue Lab framework, report contract, execution SOP, and relevant prior cases.
3. Classify the business before choosing valuation metrics.
4. Verify fresh current facts from official and current sources.
5. Build the economic picture: revenue drivers, margin drivers, cash flow drivers, valuation drivers, and key risks.
6. Translate recent news into model changes.
7. Build bear / base / bull scenarios.
8. Explain what the current price implies.
9. Determine thesis status.
10. Determine technical entry status.
11. Write the report using the required contract.
12. Perform a completion check before finishing.
13. Perform a benchmark quality check before finishing.

## NotebookLM Rule

Use NotebookLM as the methodology and prior-case layer.

Query for:

- DeepValue Lab framework
- report contract
- execution SOP
- valuation-first, technicals-second rule
- news-to-model rule
- relevant prior company cases by business type

Do not use NotebookLM as a substitute for fresh facts.

If NotebookLM and current verified evidence disagree, current verified evidence wins.

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

## Guardrails

Do not:

- write the report from memory without querying second brain
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
