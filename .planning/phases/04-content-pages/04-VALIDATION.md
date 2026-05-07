---
phase: 4
slug: content-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (already installed from Phase 1) |
| **Config file** | `vite.config.ts` (vitest integrated) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | CONT-01 | integration | `npx vitest run src/routes/about` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | CONT-02 | integration | `npx vitest run src/routes/press` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | CONT-03 | integration | `npx vitest run src/routes/resume` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 1 | CONT-04 | integration | `npx vitest run src/routes/blog` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 2 | CONT-05 | integration | `npx vitest run src/routes/contact` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for About page server load and rendering (CONT-01)
- [ ] Test stubs for Press page query and chronological ordering (CONT-02)
- [ ] Test stubs for Resume page structured data and PDF link (CONT-03)
- [ ] Test stubs for Blog index and blog post detail pages (CONT-04)
- [ ] Test stubs for Contact form submission via Web3Forms (CONT-05)

*Existing vitest infrastructure covers framework needs. Only test files need to be created.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Contact form submits to Web3Forms | CONT-05 | Requires live API key and email delivery | Fill form in browser, verify email received |
| Resume PDF download | CONT-03 | Requires actual PDF asset in Contentful | Click download button, verify PDF opens |
| Blog embedded video plays | CONT-04 | Requires video facade click and iframe load | Click play on embedded video in blog post |
| About discipline cards navigate | CONT-01 | Requires browser navigation verification | Click each discipline card, verify category page loads |
| Press external links open | CONT-02 | Requires browser new-tab behavior | Click press title, verify new tab with external URL |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
