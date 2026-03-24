---
phase: 07-frontend-api-integration-for-historical-reports
plan: 01
subsystem: ui
tags: [react, history, i18n, async-state, stocks]

# Dependency graph
requires:
  - phase: 04-historical-revision-ledger-mockup
    provides: revision ledger interaction model and compare behavior
  - phase: 05-interaction-contract-and-frontend-history-data-model
    provides: localeHasFallback semantics and historical summary/detail types
provides:
  - live-vs-legacy ledger mode contract
  - controlled selected and compare revision props with local fallback state
  - localized history loading and error surfaces for list, selected detail, and compare detail
affects:
  - 07-02
  - frontend-api-integration

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "HistoricalRevisionLedger stays presentation-first and receives async state from the page"
    - "Fallback badges continue to rely on localeHasFallback per card in zh-TW"

key-files:
  created: []
  modified:
    - web/src/components/detail/historical-revision-ledger.tsx
    - web/src/i18n/messages.ts

key-decisions:
  - "Treat the existing repo implementation as the source of truth when plan artifacts lag behind code"
  - "Keep history loading and error copy localized inside the ledger state helpers rather than at page scope"

patterns-established:
  - "Live history failures degrade locally without replacing the stock detail page"
  - "Selected and compare cards preserve fallback signaling independently"

requirements-completed: [INTH-02]

# Metrics
completed: 2026-03-24
---

# Phase 07 Plan 01: Frontend API Integration For Historical Reports Summary

**The repo already contained the live-ready historical revision ledger contract, including controlled selection props and localized async history states.**

## Accomplishments

- Verified that `HistoricalRevisionLedger` already supports `legacy` and `live` modes plus controlled `selectedId` and `compareId` props
- Verified dedicated loading and error render states for history list, selected revision detail, and compare detail
- Verified both locales include the exact live-history copy required by the plan and that `localeHasFallback` still drives per-card fallback badges

## Validation

- `cd /Users/huangchihan/develop/deep-value/web && pnpm lint && pnpm build`

## Notes

- No new code changes were required during this execution pass because the repository already satisfied the plan requirements before execution started.
