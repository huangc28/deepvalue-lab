---
phase: 01-contracts
plan: "01"
subsystem: documentation
tags: [zh-TW, contracts, skill, report-contract, localization]
dependency_graph:
  requires: []
  provides:
    - zh-TW output contract in SKILL.md
    - zh-TW translation rules in report contract
  affects:
    - Phase 2 analysis skill execution
    - Any executor reading SKILL.md or the report contract
tech_stack:
  added: []
  patterns:
    - zh-TW alongside English in same archive directory
    - Plain-language lead before technical detail
    - Acronyms explained on first use in zh-TW
key_files:
  created: []
  modified:
    - .agents/skills/deepvalue-stock-analysis/SKILL.md
    - docs/analysis/deepvalue-lab-report-contract.md
decisions:
  - "zh-TW report is a separate file (not bilingual single file) — keeps each language independently readable"
  - "Light simplification only — audience includes finance-literate readers; jargon education is a separate future feature"
  - "zh-TW production is mandatory — an analysis without it is explicitly incomplete"
metrics:
  duration: 93s
  completed: "2026-03-20"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 01 Plan 01: zh-TW Output Contract Summary

**One-liner:** Added mandatory zh-TW report output requirements to SKILL.md and a dedicated zh-TW translation rules section (8.5) to the report contract, establishing the full output contract for Phase 2 executors.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add zh-TW output requirements to SKILL.md | 4972cbf | `.agents/skills/deepvalue-stock-analysis/SKILL.md` |
| 2 | Add zh-TW translation rules to the report contract | de5606f | `docs/analysis/deepvalue-lab-report-contract.md` |

## What Was Built

### Task 1: SKILL.md zh-TW additions

Three additions to SKILL.md:

1. **Step 3 in "Save To Research Archive"** — explicit instruction to write `<TICKER>-analysis-zh-TW.md` alongside the English report and StockDetail JSON.

2. **New "zh-TW Report Output" subsection** — states that zh-TW is mandatory, names the archive path convention, references the report contract for translation rules, and declares that an English-only run is incomplete.

3. **Completion Check item** — verifies that the zh-TW report was produced and saved to the correct archive path.

### Task 2: Report contract section 8.5

New section inserted between sections 8 (Minimal Output Skeleton) and 9 (Archive And Writeback Rule):

- **Structure Rule**: same 15-section order, no additions or removals
- **Heading translation table**: all 15 English headings with their Traditional Chinese equivalents
- **6 Translation Rules**: plain-language lead, acronyms on first use (with examples), financial jargon retained, light simplification, numbers unchanged, buy-side tone preserved
- **Archive Naming**: `research/archive/YYYY/MM/DD/<TICKER>-analysis-zh-TW.md`
- **Completion Rule**: 4 conditions that make a zh-TW report incomplete

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `.agents/skills/deepvalue-stock-analysis/SKILL.md` — contains "zh-TW Report Output", "analysis-zh-TW.md", "An analysis run that produces an English report without a zh-TW report is incomplete", "zh-TW markdown report was produced and saved", and "Bull Case" still present
- `docs/analysis/deepvalue-lab-report-contract.md` — contains "## 8.5 zh-TW Report Contract", "Plain-language lead", "Acronyms explained on first use", "Financial jargon retained", "analysis-zh-TW.md", "業務分類", "A zh-TW report is incomplete if", "## 9. Archive And Writeback Rule", "## 8. Minimal Output Skeleton"
- Commits 4972cbf and de5606f verified in git log
