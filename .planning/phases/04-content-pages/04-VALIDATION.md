---
phase: 4
slug: content-pages
status: draft
nyquist_compliant: true
wave_0_complete: false
wave_0_plan: 04-00-PLAN.md
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
| 04-00-01 | 00 | 0 | ALL | scaffold | `npx vitest run src/routes/about.load.test.ts src/routes/press.load.test.ts src/routes/resume.load.test.ts src/routes/blog.load.test.ts --reporter=verbose` | W0 creates | ⬜ pending |
| 04-00-02 | 00 | 0 | ALL | scaffold | `npx vitest run src/routes/contact.form.test.ts src/lib/__tests__/richtext-video.test.ts --reporter=verbose` | W0 creates | ⬜ pending |
| 04-01-01 | 01 | 1 | CONT-01 | integration | `npx vitest run src/lib/__tests__/contentful-queries.test.ts src/routes/about.load.test.ts src/routes/press.load.test.ts -x` | W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | CONT-01 | integration | `npx vitest run src/routes/about.load.test.ts -x` | W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | CONT-02 | integration | `npx vitest run src/routes/press.load.test.ts -x` | W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | CONT-03 | integration | `npx vitest run src/routes/resume.load.test.ts -x` | W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | CONT-05 | integration | `npx vitest run src/routes/contact.form.test.ts -x` | W0 | ⬜ pending |
| 04-03-01 | 03 | 2 | CONT-04 | integration | `npx vitest run src/lib/__tests__/richtext-video.test.ts -x` | W0 | ⬜ pending |
| 04-03-02 | 03 | 2 | CONT-04 | integration | `npx vitest run src/routes/blog.load.test.ts -x` | W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Plan `04-00-PLAN.md` creates all 6 test stub files:

- [ ] `src/routes/about.load.test.ts` -- mock getPageBySlug, verify load returns page data (CONT-01)
- [ ] `src/routes/press.load.test.ts` -- mock getPressItems, verify year grouping logic (CONT-02)
- [ ] `src/routes/resume.load.test.ts` -- mock getResume, verify structured data shape (CONT-03)
- [ ] `src/routes/blog.load.test.ts` -- mock getBlogPosts/getBlogPostBySlug, verify entries() and load (CONT-04)
- [ ] `src/routes/contact.form.test.ts` -- mock fetch to Web3Forms, verify state transitions (CONT-05)
- [ ] `src/lib/__tests__/richtext-video.test.ts` -- verify INLINES.HYPERLINK renders video placeholder for Vimeo/YouTube URLs

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

- [x] All tasks have `<automated>` verify pointing to specific test files
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 plan (04-00-PLAN.md) covers all test stub creation
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending execution of Wave 0
