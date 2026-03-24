---
phase: 5
slug: interaction-contract-and-frontend-history-data-model
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler + Vite build (no dedicated test runner in web/) |
| **Config file** | `web/tsconfig.json`, `web/vite.config.ts` |
| **Quick run command** | `cd web && pnpm build` |
| **Full suite command** | `cd web && pnpm lint && pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd web && pnpm build`
- **After every plan wave:** Run `cd web && pnpm lint && pnpm build`
- **Before `/gsd:verify-work`:** Full suite must be green + manual visual review of locale fallback indicator in both locales
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 1 | FEH-01 | compile-time | `cd web && pnpm build` | ✅ types/stocks.ts | ⬜ pending |
| 5-01-02 | 01 | 1 | FEH-01 | compile-time | `cd web && pnpm build` | ✅ mock-stocks.ts | ⬜ pending |
| 5-01-03 | 01 | 1 | FEH-01, FEH-02 | compile-time + manual | `cd web && pnpm build` | ✅ historical-revision-ledger.tsx | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. TypeScript compilation is the primary gate for FEH-01. No new test files need to be created.

*FEH-02 visual behavior requires manual browser review — see Manual-Only Verifications below.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fallback indicator shows in SelectedRevisionCard when locale = zh-TW and `localeHasFallback: true` | FEH-02 | Visual render — no test runner in project | Open ADBE detail page, switch to zh-TW locale, confirm indicator appears at card top |
| Fallback indicator hidden when locale = EN | FEH-02 | Visual render | Open ADBE detail page in EN locale, confirm no indicator shown |
| Fallback indicator shows in CompareRevisionCard | FEH-02 | Visual render | Enter compare mode with ADBE as one side in zh-TW locale |
| Delta signs: positive means newer > older | FEH-01 | Visual render — delta direction must be human-verified | Compare two TSM revisions; confirm a rising fair value shows positive delta |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
