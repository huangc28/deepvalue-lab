# Stock Analysis Persistence

## Purpose

Use a split persistence model so future agents can reuse the analysis logic without being buried in stale point-in-time reports.

## Layer 1: NotebookLM

NotebookLM is the project's second brain. Store only information that is likely to remain useful across future analysis sessions.

Good candidates:
- reusable valuation frameworks
- reasoning templates
- distilled company case studies
- compact thesis summaries
- important lessons learned
- rules for translating news into model changes

Avoid storing:
- every full report verbatim
- repetitive point-in-time price snapshots
- raw news dumps
- temporary assumptions that were not validated

Rule:
- NotebookLM should contain curated knowledge, not the entire research log.

## Layer 2: Research Archive

The research archive stores full reports and point-in-time context.

Default location:
- `research/archive/`

Recommended path pattern:
- `research/archive/YYYY/MM/DD/<ticker>-analysis.md`

Store in the archive:
- company and ticker
- analysis date
- point-in-time price
- sources used
- current valuation snapshot
- news summary
- bear/base/bull assumptions
- fair value outputs
- conclusion at that moment
- monitoring items

Rule:
- The archive is for reproducibility and historical comparison.

## Default Workflow

For each substantial stock analysis:

1. Build the full report in the research archive.
2. Extract the durable parts into NotebookLM.
3. Keep NotebookLM short, opinionated, and reusable.

## What to Extract Into NotebookLM

After each substantial report, extract only:
- the business classification
- the right valuation lens for that business
- the 3-7 assumptions that matter most
- how recent news changed the model
- the provisional conclusion
- what to monitor next
- any reusable lesson for future stock work

## What Not to Extract Into NotebookLM

Do not extract:
- every numerical detail from the report
- repeated definitions already covered by existing framework notes
- stale price-dependent conclusions without context
- minor daily updates with no effect on the model

## Heuristic

Store to NotebookLM only if at least one of these is true:
- it teaches a reusable analytical pattern
- it changes the standing thesis meaningfully
- it introduces a new company type or valuation method
- it captures a major lesson from a company-specific case

Otherwise, keep it only in the archive.

## Minimum Output Standard

Every substantial report should leave behind:
- one full archive report
- one concise NotebookLM summary or source if the report added durable knowledge

## Goal

Future agents should be able to:
- recover the full historical report from the archive
- recover the reusable reasoning pattern from NotebookLM
- avoid re-learning the same analytical lesson from scratch
