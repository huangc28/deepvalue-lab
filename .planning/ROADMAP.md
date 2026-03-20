# Roadmap: DeepValue Lab — Analysis Localization & Simplification

## Overview

Two phases deliver zh-TW analysis output for Traditional Chinese readers. Phase 1 defines the contracts — what the skill must produce, how translation rules work, and how the archive naming convention changes. Phase 2 executes against those contracts: the analysis skill gains zh-TW report output and bilingual StockDetail JSON, and both are saved to the research archive.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Contracts** - Define skill output contract, translation rules, and SOP update
- [ ] **Phase 2: Skill Output** - Produce zh-TW reports and bilingual StockDetail JSON with archive persistence

## Phase Details

### Phase 1: Contracts
**Goal**: The skill's output contract, translation rules, and execution SOP fully specify zh-TW requirements before any implementation begins
**Depends on**: Nothing (first phase)
**Requirements**: DOC-01, DOC-02, DOC-03
**Success Criteria** (what must be TRUE):
  1. SKILL.md states that every analysis run must produce a zh-TW markdown report alongside the English one, with archive naming convention `-zh-TW.md`
  2. Report contract specifies zh-TW translation rules: plain-language leads, acronyms explained on first use, financial jargon retained
  3. Agent execution SOP contains an explicit translation step that appears in the workflow sequence
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Update SKILL.md with zh-TW output requirements and archive naming convention (DOC-01), and add zh-TW translation rules section to report contract (DOC-02)
- [ ] 01-02-PLAN.md — Insert zh-TW translation step into agent execution SOP workflow sequence (DOC-03)

### Phase 2: Skill Output
**Goal**: Running the analysis skill on any ticker produces a zh-TW markdown report and a bilingual StockDetail JSON, both saved correctly to the research archive
**Depends on**: Phase 1
**Requirements**: SKILL-01, SKILL-02, SKILL-03, SKILL-04, ARCH-01, ARCH-02
**Success Criteria** (what must be TRUE):
  1. Running the analysis skill on a ticker produces two markdown files in the archive: `<TICKER>-analysis.md` and `<TICKER>-analysis-zh-TW.md`
  2. The zh-TW report follows the same 15-section structure as the English report with no missing sections
  3. zh-TW report uses plain-language leads before technical detail and explains acronyms on first use, while retaining financial jargon
  4. StockDetail JSON contains `LocalizedText` objects (`{ en, zh-TW }`) for all user-facing display fields (summary, thesis, scenarios)
  5. Archive JSON file contains bilingual LocalizedText fields matching the live StockDetail structure
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Contracts | 0/2 | Not started | - |
| 2. Skill Output | 0/TBD | Not started | - |
