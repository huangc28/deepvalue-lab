# DeepValue Lab Report Contract

## 1. Purpose

This document defines the required output contract for a DeepValue Lab stock analysis report.

It converts the analysis standard into a repeatable structure that an AI agent can follow consistently.

The goal is not stylistic beauty.
The goal is consistent analytical completeness and decision usefulness.

## 2. Contract Rule

A report is not complete unless it includes every required section in the required order.

An agent may write concise or detailed content depending on the company and available data, but it may not skip required sections.

## 3. Required Output Order

Every report must use this section order:

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

No sections may be merged in a way that hides whether a required topic was covered.

## 4. Section Requirements

### 4.1 Business Classification

Required content:

- what type of business this is
- why that business type matters for valuation

Minimum acceptable output:

- a correct classification
- one clear explanation of why this changes the valuation approach

### 4.2 Thesis

Required content:

- why this company is interesting
- what makes it attractive or unattractive at current conditions
- what the investor is really betting on

Minimum acceptable output:

- one explicit thesis statement

### 4.3 Variant Perception

Required content:

- where the market may be too optimistic or too pessimistic
- what mismatch between expectation and reality is being evaluated

Minimum acceptable output:

- one explicit statement of possible market mispricing

### 4.4 Valuation Lens

Required content:

- valuation method used
- why that method fits this company
- why more obvious alternatives are less appropriate if relevant

Minimum acceptable output:

- one clearly named valuation method
- one sentence explaining why it fits

### 4.5 Current Valuation Snapshot

Required content:

- current price
- market cap and/or enterprise value if relevant
- key valuation multiples
- balance sheet context if relevant

Minimum acceptable output:

- enough current numbers to anchor the later valuation conclusion

### 4.6 Recent News And News-To-Model Translation

Required content:

- recent material updates
- how each update affects at least one model variable

Allowed model variables:

- revenue
- margin
- capex
- balance sheet risk
- multiple
- scenario probability
- thesis quality

Minimum acceptable output:

- at least two material updates for a mature company when available
- at least one explicit model impact per update

### 4.7 Bear Case

Required content:

- operating assumptions
- valuation assumptions
- fair value or range
- what must be true

### 4.8 Base Case

Required content:

- operating assumptions
- valuation assumptions
- fair value or range
- what must be true

### 4.9 Bull Case

Required content:

- operating assumptions
- valuation assumptions
- fair value or range
- what must be true

Scenario minimum rule:

- all three scenarios are required unless the user explicitly asks for a shorter format
- each scenario must be auditable from the stated assumptions

Scenario audit rule:

- if the report uses `EPS x P/E`, the earnings and multiple assumptions must be explicit
- if the report uses `EV / sales`, `EV / EBITDA`, or similar, the report must make the EV-to-equity-to-per-share bridge explicit enough to follow
- if the report uses milestone logic, the path from milestone assumptions to fair value must be explicit enough to follow

### 4.10 What The Current Price Implies

Required content:

- what expectations appear priced into the stock today

Minimum acceptable output:

- one paragraph or bullet set explaining what the market is underwriting

### 4.11 Provisional Conclusion

Required content:

- cheap / fair / rich style judgment
- tied to a framework
- explanation of why

Minimum acceptable output:

- explicit price-versus-value conclusion

### 4.12 Thesis Status

Required content:

- intact / watch / broken
- explanation

Minimum acceptable output:

- explicit thesis status label

### 4.13 Technical Entry Status

Required content:

- favorable / neutral / stretched
- explanation
- technicals must be framed as execution support only

Minimum acceptable output:

- explicit technical entry label

### 4.14 What To Monitor Next

Required content:

- the next few facts that would most likely change the thesis, valuation, or scenario probabilities

Minimum acceptable output:

- at least three concrete monitoring items

### 4.15 Sources Used

Required content:

- current sources used for the analysis
- sources should be relevant to the company and current analysis

Minimum acceptable output:

- at least one current official source
- enough sources to support the report's key claims
- every material claim used in thesis support, news-to-model, or scenario support must be backed by a listed source

## 5. Technicals Rule In The Contract

The report must follow this rule:

- technicals are allowed only after the valuation conclusion is established
- technicals may improve or worsen entry timing
- technicals may not override an unattractive thesis or valuation

Current default technical language:

- favorable
- neutral
- stretched

The report should not claim that RSI or MRC proves intrinsic value.

## 6.5 Benchmark Quality Rule

Completeness alone is not sufficient.

A report that includes every section but fails one of the following is still below DeepValue Lab standard:

- valuation method does not clearly fit the company type
- news-to-model includes only upside and omits the main downside variables
- scenario fair values are not auditable from the stated assumptions
- material claims in the body are not backed by the listed sources
- conclusion praises company quality without clearly stating price-versus-value judgment

## 6. Conclusion Style Rule

The report should sound like a decision memo, not a marketing document.

Preferred style:

- direct
- conditional
- explicit about assumptions
- explicit about what is priced in

Avoid:

- vague praise of management without valuation context
- generic language like "great company, strong growth" without price framing
- unsupported confidence

## 7. Completion Rules

A report is incomplete if any of the following are missing:

- thesis
- variant perception
- valuation lens
- news-to-model translation
- any of bear / base / bull
- current price implication
- thesis status
- technical entry status
- monitoring section
- sources

## 8. Minimal Output Skeleton

Use this exact section skeleton:

```md
# <Ticker> Analysis

Date:
Company:
Ticker:
Point-in-time price:

## 1. Business Classification

## 2. Thesis

## 3. Variant Perception

## 4. Valuation Lens

## 5. Current Valuation Snapshot

## 6. Recent News And News-To-Model Translation

## 7. Bear Case

## 8. Base Case

## 9. Bull Case

## 10. What The Current Price Implies

## 11. Provisional Conclusion

## 12. Thesis Status

## 13. Technical Entry Status

## 14. What To Monitor Next

## 15. Sources Used
```

## 9. Archive And Writeback Rule

Default behavior:

- a full report should be saved in the archive
- second brain writeback is selective, not automatic

The report contract defines the output structure.
It does not decide whether the result should be written into second brain.
