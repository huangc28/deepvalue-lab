---
phase: 6
slug: historical-report-read-model-and-backend-apis
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-24
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `go test` |
| **Config file** | `be/go.mod`, `be/sqlc.yaml` |
| **Quick run command** | `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1` |
| **Full suite command** | `cd /Users/huangchihan/develop/deep-value/be && go test ./...` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1`
- **After every plan wave:** Run `cd /Users/huangchihan/develop/deep-value/be && go test ./...`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | APIH-01 | schema/query | `cd /Users/huangchihan/develop/deep-value/be && make gen/sqlc && go test ./lib/app/stocks -count=1` | ✅ migration + sqlc | ✅ green |
| 6-01-02 | 01 | 1 | APIH-01 | handler unit | `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1` | ✅ publish_handler.go | ✅ green |
| 6-02-01 | 02 | 2 | APIH-02 | handler unit | `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1` | ✅ reports_list_handler.go | ✅ green |
| 6-03-01 | 03 | 3 | APIH-03 | handler unit | `cd /Users/huangchihan/develop/deep-value/be && go test ./lib/app/stocks -count=1` | ✅ report detail handler | ✅ green |
| 6-03-02 | 03 | 3 | APIH-03 | regression | `cd /Users/huangchihan/develop/deep-value/be && go test ./...` | ✅ router + handlers | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

- [x] `go test` is already configured via `be/Makefile`
- [x] handler test pattern already exists in `be/lib/app/stocks/*_test.go`
- [x] sqlc regeneration path already exists via `make gen/sqlc`

---

## Manual-Only Verifications

All phase behaviors are expected to be covered by automated Go tests.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** passed
