# DeepValue Lab Agent Execution SOP

## 1. Purpose

This document defines the operating procedure an AI agent must follow when asked to analyze a stock for DeepValue Lab.

Its purpose is to make report quality reproducible across new agents and new sessions.

This SOP assumes the analysis standard and report contract already exist and must be followed.

## 2. Core Rule

Do not begin by writing the report from memory.

The agent must:

1. query second brain first
2. gather fresh current evidence second
3. generate the report using the required contract third
4. check completeness before finishing

## 3. Step-By-Step Workflow

### Step 1: Query Second Brain First

Before substantive analysis, query NotebookLM / second brain for:

- the DeepValue Lab analysis framework
- the report contract
- the valuation-first, technicals-second rule
- the news-to-model rule
- any relevant prior cases by company type

The purpose of this step is to retrieve method, not to copy an old conclusion.

Minimum requirement:

- the agent must refresh itself on the DeepValue Lab framework before forming a company-specific judgment

### Step 2: Identify The Business Type

Classify the company before selecting metrics.

Examples:

- mature compounder
- cyclical
- semicap
- miner
- financial
- pre-commercial

The agent must state internally which business type it is using before choosing valuation method.

### Step 3: Select The Valuation Lens

Choose the valuation framework that matches the business type.

Examples:

- forward P/E or FCF yield for mature compounders
- EV / EBITDA for cyclicals and capital-intensive businesses
- milestone or revenue-scenario logic for pre-commercial companies
- mixed-framework approach when the business is hybrid

The agent must not blindly apply the same metric to every stock.

### Step 4: Gather Fresh Current Evidence

The agent must verify current facts using fresh sources.

Required categories:

- current price
- latest earnings release
- latest annual or quarterly filing when relevant
- latest management guidance
- recent material company or industry news

Second brain is not sufficient for this step.

If current evidence conflicts with second brain, current verified evidence wins.

### Step 5: Build The Economic Picture

The agent must determine:

- what drives revenue
- what drives margins
- what drives cash flow
- what drives valuation multiple
- what key risks could break the thesis

This step turns raw facts into an operating model.

### Step 6: Translate News Into Model Changes

For each important recent update, the agent must explain how it changes one or more of:

- revenue
- margin
- capex
- balance sheet risk
- valuation multiple
- scenario probability
- thesis quality

If a news item does not change the model, it should not be emphasized.

### Step 7: Build Bear / Base / Bull

The agent must produce:

- bear case
- base case
- bull case

Each case must include:

- operating assumptions
- valuation assumptions
- fair value or implied range
- what must be true

### Step 8: Explain What The Current Price Implies

The agent must explain what expectations are already embedded in the stock price.

This step is mandatory because DeepValue Lab is not just judging the company. It is judging price versus expectations.

### Step 9: Determine Thesis Status

The agent must explicitly determine:

- intact
- watch
- broken

The label must be explained.

### Step 10: Determine Technical Entry Status

The agent must explicitly determine:

- favorable
- neutral
- stretched

This step is only for execution timing support.

Current rule:

- technicals are used after valuation and thesis work
- technicals must not be used to prove intrinsic value

### Step 11: Write The Report Using The Contract

The report must follow the DeepValue Lab report contract in the required order.

Do not improvise section order.
Do not omit required sections.

### Step 12: Produce The zh-TW Report

After writing the English report, produce a Traditional Chinese (繁體中文) version of the report.

The zh-TW report is mandatory. An analysis that produces only an English report is incomplete.

Requirements for the zh-TW report:

- Follow the same 15-section structure as the English report, in the same order
- Open every section with a plain-language lead sentence before technical detail
- Explain every acronym on first use (e.g., 每股盈利（EPS）/ 自由現金流（FCF）)
- Retain unavoidable financial jargon — do not replace it with simplified terms
- Keep all numerical data, fair values, multiples, and price targets identical to the English report
- Apply light simplification: clearer sentences and shorter constructions where possible, but do not rewrite the analytical content

For the full set of zh-TW translation rules, see the report contract:
`docs/analysis/deepvalue-lab-report-contract.md` — Section 8.5 zh-TW Report Contract

Save the zh-TW report to:
`research/archive/YYYY/MM/DD/<TICKER>-analysis-zh-TW.md`

This file exists alongside the English report (`<TICKER>-analysis.md`) in the same directory.

### Step 13: Perform A Completion Check

Before treating the task as finished, check that the report includes:

- business classification
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

If any section is missing, the report is incomplete.

### Step 14: Perform A Benchmark Quality Check

Before finishing, check whether the report clears the DeepValue Lab benchmark quality bar.

Minimum benchmark checks:

- does the valuation lens clearly fit the company type
- does the news-to-model section include the main downside variables, not just upside
- are the scenario outputs auditable from the stated assumptions
- if the report uses EV-based multiples, is the bridge to per-share value explicit enough to follow
- are all material claims in the body supported by the listed sources
- does the conclusion clearly separate company quality from price attractiveness

If any of these fail, the report may be complete by section count but is still below standard.

## 4. Output Rules

The final report should:

- sound like a decision memo
- be explicit about assumptions
- be explicit about price versus value
- be explicit about what the market already prices in
- avoid vague praise detached from valuation

The final report should not:

- stop at business quality
- stop at valuation only
- summarize news without translating it
- use technicals as valuation proof

## 5. Writeback Rules

Default behavior:

- save the full report to the archive if the workflow requires persistence
- do not automatically write each report into second brain

Write into second brain only if:

- the user explicitly requests it
- the analysis creates a durable reusable lesson
- the analysis introduces a new company type or valuation method
- the analysis materially changes a standing framework or thesis

## 6. Expected Agent Behavior

A compliant DeepValue Lab agent should:

- use second brain early
- use fresh evidence
- keep the reasoning auditable
- separate business quality from valuation
- separate valuation from timing
- finish with a decision-useful judgment

## 7. Failure Conditions

The agent failed the SOP if it:

- did not query second brain first
- used stale or unsupported facts
- skipped required sections
- selected an obviously mismatched valuation method
- summarized news without model translation
- omitted thesis status
- omitted technical entry status
- gave a conclusion that does not clearly relate to price versus value
- produced only an English report without a zh-TW report

## 8. SOP Summary

DeepValue Lab agent workflow is:

1. method from second brain
2. facts from current sources
3. valuation and scenario reasoning
4. technicals as timing support
5. structured report (English)
6. zh-TW report (same 15-section structure, light simplification)
7. completion check
8. benchmark quality check

This sequence is mandatory for consistent quality.
