---
phase: 03
slug: add-zh-tw-stockdetail-json-support-to-backend-api
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | go test |
| **Config file** | none |
| **Quick run command** | `cd be && go test ./...` |
| **Full suite command** | `cd be && go test ./...` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd be && go test ./...`
- **After every plan wave:** Run `cd be && go test ./...`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | API-01 | schema/codegen | `cd be && go test ./...` | ❌ | ⬜ pending |
| 03-01-02 | 01 | 1 | PH3-PUBLISH | handler/unit | `cd be && go test ./...` | ❌ | ⬜ pending |
| 03-02-01 | 02 | 2 | PH3-DETAIL | handler/unit | `cd be && go test ./...` | ❌ | ⬜ pending |
| 03-02-02 | 02 | 2 | PH3-LIST | handler/unit | `cd be && go test ./...` | ❌ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Live publish/read smoke test against real Turso + R2 | API-01, PH3-PUBLISH, PH3-DETAIL, PH3-LIST | Unit tests should cover branching logic, but object-storage wiring and deployed env vars are integration concerns | Start the backend with real credentials, publish one EN-only payload and one bilingual payload, then curl both GET endpoints with and without `?locale=zh-TW` and confirm fallback behavior. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

