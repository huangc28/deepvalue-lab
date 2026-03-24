---
phase: 7
slug: frontend-api-integration-for-historical-reports
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | ESLint + TypeScript compiler + Vite build (no dedicated frontend behavior test runner installed yet) |
| **Config file** | `web/eslint.config.js`, `web/tsconfig.json`, `web/vite.config.ts` |
| **Quick run command** | `cd web && pnpm lint` |
| **Full suite command** | `cd web && pnpm lint && pnpm build` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd web && pnpm lint`
- **After every plan wave:** Run `cd web && pnpm lint && pnpm build`
- **Before `$gsd-verify-work`:** Full suite must be green, then run a live manual smoke with backend on `localhost:8080`
- **Max feedback latency:** ~20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 7-01-01 | 01 | 1 | INTH-01 | static + compile-time | `cd web && pnpm lint && pnpm build` | ✅ `web/src/lib/api.ts`, `web/src/lib/queries.ts` | ⬜ pending |
| 7-01-02 | 01 | 1 | INTH-01 | static + compile-time | `cd web && pnpm lint && pnpm build` | ✅ `web/src/pages/stock-detail-page.tsx` | ⬜ pending |
| 7-02-01 | 02 | 2 | INTH-01, INTH-02 | static + manual integration | `cd web && pnpm lint && pnpm build` | ✅ `web/src/components/detail/historical-revision-ledger.tsx` | ⬜ pending |
| 7-02-02 | 02 | 2 | INTH-02 | manual-only today | `—` | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `web/src/pages/stock-detail-page.test.tsx` — verify live latest detail does not fall back to mock history when live stock exists
- [ ] `web/src/components/detail/historical-revision-ledger.test.tsx` — verify selected/compare loading, empty, and compare-side error states
- [ ] Vitest + React Testing Library install/config — no frontend behavior test runner exists yet

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Live history list renders from `/v1/stocks/{ticker}/reports` while latest hero/detail still comes from `/v1/stocks/{ticker}` | INTH-01 | Requires backend-backed runtime check; current repo has no component integration test coverage | Run backend on `localhost:8080`, open a stock with historical reports, confirm history section renders live revisions and the rest of the page still shows latest-detail content |
| zh-TW selected revision shows fallback indicator only when that revision fell back to EN | INTH-02 | Visual locale-state behavior | Open a stock with mixed locale availability in zh-TW, select revisions with and without fallback, confirm indicator behavior per card |
| Mixed-locale compare mode labels fallback independently per side | INTH-02 | Visual compare behavior | In zh-TW locale, compare one fully localized revision with one EN-fallback revision and confirm only the fallback side shows the indicator |
| Compare-side detail failure preserves base selection | INTH-01, INTH-02 | Error-state interaction is not automated today | Simulate one failing historical detail request, confirm base selected revision remains visible and compare side shows a local failure state |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
