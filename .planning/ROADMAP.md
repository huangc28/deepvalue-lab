# Roadmap: DeepValue Lab — Analysis Localization & Simplification

## Overview

Two phases deliver zh-TW analysis output for Traditional Chinese readers. Phase 1 defines the contracts — what the skill must produce, how translation rules work, and how the archive naming convention changes. Phase 2 executes against those contracts: the analysis skill gains zh-TW report output and bilingual StockDetail JSON, and both are saved to the research archive.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Contracts** - Define skill output contract, translation rules, and SOP update (completed 2026-03-20)
- [x] **Phase 2: Skill Output** - Produce zh-TW reports and bilingual StockDetail JSON with archive persistence (completed 2026-03-20)
- [x] **Phase 3: Add zh-TW StockDetail JSON support to backend API** - Accept, persist, and serve zh-TW StockDetail JSON from the backend API (completed 2026-03-20)

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
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Update SKILL.md to mandate bilingual LocalizedText for all StockDetail fields, remove English-only default, and document bilingual publish payload (SKILL-01, SKILL-02, SKILL-03, SKILL-04, ARCH-01, ARCH-02)

### Phase 3: Add zh-TW StockDetail JSON support to backend API
**Goal**: The backend API accepts optional zh-TW StockDetail JSON on publish, stores zh-TW summary/detail metadata, and serves locale-aware zh-TW detail/summary responses with EN fallback
**Depends on**: Phase 2
**Requirements**: API-01, PH3-STORAGE, PH3-PUBLISH, PH3-DETAIL, PH3-LIST, PH3-BACKCOMPAT
**Success Criteria** (what must be TRUE):
  1. `POST /v1/stocks/{ticker}/reports` accepts optional `stockDetailZhTW` without breaking EN-only callers
  2. `published_stock_details` stores `r2_detail_zh_tw_key` and `summary_json_zh_tw` with safe defaults for existing rows
  3. zh-TW detail artifacts are stored in R2 with `.zh-TW.json` suffix
  4. `GET /v1/stocks/{ticker}?locale=zh-TW` prefers zh-TW detail, then zh-TW summary, then EN fallback
  5. `GET /v1/stocks?locale=zh-TW` returns zh-TW summaries per row where available and EN summaries otherwise
  6. `cd be && go test ./...` passes with automated publish/detail/list handler coverage
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Add zh-TW persistence columns, regenerate sqlc, and extend the publish path for optional zh-TW StockDetail JSON
- [x] 03-02-PLAN.md — Add locale-aware zh-TW detail/list responses with EN fallback and automated handler tests

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Contracts | 2/2 | Complete   | 2026-03-20 |
| 2. Skill Output | 1/1 | Complete | 2026-03-20 |
| 3. Backend zh-TW StockDetail API | 2/2 | Complete | 2026-03-20 |
