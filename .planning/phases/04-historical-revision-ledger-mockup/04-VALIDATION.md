---
phase: 04
slug: historical-revision-ledger-mockup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `pnpm lint` + `pnpm build` + manual runtime review |
| **Config file** | `web/package.json` |
| **Quick run command** | `cd web && pnpm lint` |
| **Full suite command** | `cd web && pnpm lint && pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd web && pnpm lint && pnpm build`
- **After every plan wave:** Run `cd web && pnpm lint && pnpm build`
- **Before visual sign-off:** manual desktop + mobile review of the stock detail page
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | HIST-01, HIST-04 | type/data/build | `cd web && pnpm lint && pnpm build` | ❌ | ⬜ pending |
| 04-01-02 | 01 | 1 | HIST-01, HIST-02 | UI/build | `cd web && pnpm lint && pnpm build` | ❌ | ⬜ pending |
| 04-01-03 | 01 | 1 | HIST-03, HIST-05 | UI/build/manual | `cd web && pnpm lint && pnpm build` | ❌ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing lint/build commands cover compile-time and static regressions. Manual runtime review is required for visual tuning and interaction confirmation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Latest revision auto-opens and feels visually correct | HIST-02 | Build checks cannot evaluate visual hierarchy | Start the web app, open the seeded many-revision stock, and confirm the latest row is selected on first render |
| Compare mode interaction is understandable | HIST-03 | Requires observing UI transitions and layout | Enter compare mode, clear one side, then exit compare mode and confirm the base selection remains stable |
| Empty/single/many states all feel intentional | HIST-04 | Static checks cannot judge clarity | Open the empty-history, single-revision, and many-revision examples and confirm each state reads clearly |
| Keyboard focus states and mobile stacked compare are usable | HIST-05 | Requires runtime interaction | Tab through revision rows and compare controls, then test a narrow viewport and confirm stacked compare layout |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all manual-only interaction checks
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
