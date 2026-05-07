---
phase: 3
slug: portfolio-video
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vite.config.ts (vitest inline config or vitest.config.ts) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | HOME-01 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | HOME-02 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | PORT-01 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | VID-01 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 2 | VID-02 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` — install if not present
- [ ] `src/lib/utils/__tests__/video.test.ts` — video URL parser tests
- [ ] `src/routes/__tests__/` — route load function tests

*Test stubs will be refined once plans define exact task breakdown.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Focus trap in video lightbox | VID-02 | Keyboard interaction requires browser | Open lightbox, Tab through elements, verify focus cycles within modal |
| Slide-down expand animation | HOME-02 | Visual animation timing | Click category "See all", verify smooth expand/collapse |
| Video facade loads iframe on click | VID-01 | Requires browser iframe loading | Click play overlay, verify Vimeo/YouTube iframe appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
