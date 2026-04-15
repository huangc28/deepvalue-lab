# DeepValue Lab Stock Analysis Standard

## 1. Purpose

This document defines the quality standard for a DeepValue Lab stock analysis report.

Its purpose is to make a new AI agent capable of producing reports with consistent structure, reasoning quality, and decision usefulness by:

- using the local DeepValue methodology docs as the stable methodology layer
- verifying all current facts with fresh official or current sources
- following a fixed analytical order
- producing a report that is useful for real investment decisions rather than generic summary
- producing a report that a motivated general reader can follow without diluting the analytical standard

This is not a product specification.
This is the analysis quality standard.

## 2. Core Objective

A valid DeepValue Lab report must help answer four questions:

- Is the stock currently cheap, fair, or expensive?
- Has recent news changed the valuation assumptions?
- Is the current market price a good entry zone, not just a good company?
- Is the original thesis still intact, weakening, or broken?

It should also let a motivated general reader answer one more question quickly:

- In plain language, what is the stock price already assuming and why does that matter?

If a report cannot answer these four questions clearly, it does not meet the standard.

## 3. Core Method

DeepValue Lab uses this high-level method:

1. Load local methodology docs for framework and relevant rules.
2. Classify the business correctly.
3. Select the valuation lens based on business type.
4. Gather fresh price, financial, and news data from current sources.
5. Translate recent news into model changes.
6. Build bear / base / bull scenarios.
7. Explain what the current price already implies.
8. Judge whether the thesis is intact, watch, or broken.
9. Use technicals only as entry timing support, not as intrinsic-value proof.
10. End with a decision-useful conclusion and monitoring list.

## 4. Required Analytical Order

The report must follow this logic:

1. Business classification
2. Thesis
3. Variant perception
4. Valuation lens
5. Current valuation snapshot
6. Recent news and news-to-model translation
7. Bear / base / bull valuation
8. What the current price implies
9. Provisional conclusion
10. Thesis status
11. Technical entry status
12. What to monitor next

This order is mandatory.
The report should not jump straight from business quality to valuation conclusion.

Before the numbered sections, the report must include a short `Quick Take For General Readers` block.

That block should orient the reader in plain language before the full memo begins:

- what the company does
- the current valuation call
- what the market is already pricing in
- what would most likely change the conclusion

## 5. Required Sections

### 5.1 Business Classification

The report must identify what kind of business this is.

Examples:

- mature compounder
- cyclical
- semicap
- miner
- financial
- pre-commercial or milestone-driven

The report must explain why this classification matters for valuation.
The report should also say what the company actually does in ordinary language before relying on category labels.

### 5.2 Thesis

The report must clearly state:

- why this company is worth analyzing
- what makes it potentially attractive or unattractive
- what the investor is implicitly betting on

A report without a thesis is incomplete.

### 5.3 Variant Perception

The report must state where the market may be wrong, too optimistic, or too pessimistic.

This does not need to be dramatic.
But the report must explain what mismatch between price and reality is being evaluated.

### 5.4 Valuation Lens

The report must explain which valuation framework fits the business.

Examples:

- forward P/E
- EV / EBITDA
- FCF yield
- EV / sales
- milestone or scenario valuation

The report must explain why this method fits this company better than the obvious alternatives.
The report should make that explanation understandable before the shorthand becomes dense.

### 5.5 Current Valuation Snapshot

The report must include:

- current price
- market cap or enterprise value where relevant
- relevant valuation multiples
- balance sheet context if it matters

This section must describe current valuation, not just list numbers.

### 5.6 Recent News And News-To-Model Translation

The report must not summarize news passively.

For each important recent development, the report must explain how it changes one or more of:

- revenue
- margin
- capex
- balance sheet risk
- valuation multiple
- bear / base / bull probability
- thesis quality

If news is listed without changing the model, the section is incomplete.

### 5.7 Bear / Base / Bull Valuation

The report must include three scenarios unless there is a strong reason not to.

Each scenario must state:

- the key operating assumptions
- the key valuation assumptions
- the fair value or implied range
- what must be true for the scenario to happen

The goal is not false precision.
The goal is to make the main assumptions auditable.

### 5.8 What The Current Price Implies

The report must explain what expectations appear embedded in the current stock price.

This is required because DeepValue Lab evaluates price versus expectations, not business quality in isolation.

### 5.9 Provisional Conclusion

The report must end with a price-versus-value conclusion.

Examples:

- cheap
- fair
- rich
- fair to slightly expensive
- reasonable if base case holds

The conclusion must be tied to a framework, not just a feeling.

### 5.10 Thesis Status

The report must explicitly state one of:

- intact
- watch
- broken

It must explain why.

### 5.11 Technical Entry Status

The report must explicitly state one of:

- favorable
- neutral
- stretched

This section must use the valuation-first, technicals-second rule.

Technicals may support:

- a better entry zone
- a poor entry zone
- a wait-for-confirmation zone

Technicals must not be used to claim intrinsic value.
The section should end with a plain-language execution takeaway, not just indicator recitation.

### 5.12 What To Monitor Next

The report must identify the next few facts that would most likely change the thesis, valuation, or scenario probabilities.

This section should be concrete and forward-looking.

## 6. Technicals Rule

DeepValue Lab uses technicals only as an execution layer.

Current default technical framework:

- RSI plus EMA for momentum and momentum-turn confirmation
- MRC-compatible channel for price stretch versus mean

Technicals should be used only after business quality, thesis, and valuation have been established.

Valid use:

- valuation cheap plus favorable technical state supports accumulation

Invalid use:

- RSI or MRC alone used as proof that a stock is fundamentally cheap

## 7. Local-First Method Rule

The agent must use the local methodology docs before beginning substantive analysis.

The local docs should be used to retrieve:

- analysis framework
- valuation rules
- news-to-model rules
- technical entry rules

The agent must still verify:

- current price
- latest financials
- latest guidance
- recent material news

If archived notes and current evidence disagree, current verified evidence wins.

## 8. Report Must Feel Decision-Useful

A valid DeepValue Lab report should help a real investor decide:

- whether this is worth owning
- whether this is worth watching
- whether this is an attractive or unattractive entry zone
- what would change the conclusion

It should also help a motivated general reader understand:

- what the company actually does
- why this stock is cheap / fair / rich
- what the current price is already assuming
- what could change the call next

The report should not feel like:

- a generic company summary
- a news recap
- an analyst memo that only specialists can decode

## 9. Benchmark Quality Rule

The target quality bar is the internal DeepValue Lab benchmark represented by the earlier AMAT-style analysis.

That benchmark is not defined by tone.
It is defined by analytical properties:

- the business is classified correctly and the valuation lens clearly matches that business type
- the current valuation snapshot uses the metrics that matter for that business, not generic ratios
- recent news is translated into both upside and downside model changes
- the report includes the main counterweights that cap the valuation multiple
- the scenario worksheet is auditable rather than hand-wavy
- the conclusion explains what the market already prices in and whether there is real safety margin
- the top of the report gives a non-specialist reader a truthful orientation before the denser technical discussion begins

In practice, this means a report is below standard if it:

- is directionally right but not numerically auditable
- includes upside drivers but does not model the main negative variables
- gives per-share fair values without showing the bridge assumptions that produce them
- uses claims in the body that are not supported by listed current sources

## 10. Auditable Scenario Rule

Bear, base, and bull cases must be traceable.

If a scenario uses:

- `EPS x P/E`, the report must make the EPS and multiple assumptions explicit
- `EV / sales`, `EV / EBITDA`, or similar enterprise multiples, the report must make the enterprise-value-to-equity bridge explicit enough to audit
- milestone or pre-revenue logic, the report must make the path from milestone assumptions to fair value explicit

The goal is not spreadsheet perfection.
The goal is that another agent or human can reproduce the direction and arithmetic of the scenario without guessing hidden assumptions.

## 11. Source Discipline Rule

Every material claim used in thesis, news-to-model, or scenario support must be backed by a source listed in the report.

If the report uses a partnership, customer, guidance, regulatory, or technical claim to support valuation or thesis quality, that source must appear in `Sources Used`.

Unsupported helpful color is acceptable in conversation.
Unsupported evidence is not acceptable in a DeepValue Lab report.
- a valuation-only memo
- a technical chart summary detached from business analysis

## 9. Common Failure Modes

The following are failures against the standard:

- no thesis
- no variant perception
- wrong valuation method for business type
- news summarized without model translation
- only one valuation scenario
- no explanation of what current price implies
- conclusion based on business quality rather than price versus value
- no thesis status
- no technical entry status
- technicals used as a substitute for valuation
- no monitoring section

## 10. Minimum Completion Standard

A report is complete only if it includes:

- all required sections
- current verified data
- explicit scenario analysis
- explicit thesis status
- explicit technical entry status
- a conclusion tied to price versus value

If one or more of these are missing, the report is incomplete.

## 11. Quality Bar

A report meets DeepValue Lab quality when it is:

- structurally complete
- analytically coherent
- explicit about assumptions
- clear about what the market already prices in
- readable without sacrificing rigor
- clear about what would prove the thesis wrong
- useful for actual decision-making

## 12. Writeback Rule

Producing a valid report does not automatically mean it should be written into second brain.

Default behavior:

- full report goes to archive
- only durable methodology, representative lessons, or explicitly requested summaries should be promoted into reusable notes

## 13. Standard Summary

DeepValue Lab quality means:

- correct business classification
- correct valuation lens
- explicit thesis
- explicit news-to-model reasoning
- explicit bear / base / bull scenarios
- explicit price-implied expectations
- explicit thesis state
- explicit technical entry state
- decision-useful conclusion

Anything less is not yet a DeepValue Lab report.
