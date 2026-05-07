---
phase: 2
slug: cms-content-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts or "none — Wave 0 installs" |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CMS-01 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CMS-02 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CMS-03 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | TECH-05 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 1 | TECH-06 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` — install if not present
- [ ] `src/lib/__tests__/contentful-client.test.ts` — stubs for CMS-01 (content model types)
- [ ] `src/lib/__tests__/contentful-image.test.ts` — stubs for CMS-03 (image optimization)
- [ ] `src/lib/__tests__/seo.test.ts` — stubs for TECH-05, TECH-06 (SEO meta tags)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Contentful webhook triggers rebuild | CMS-02 | Requires live Contentful space + GitHub Actions | Publish content in Contentful, verify GitHub Actions workflow starts |
| Images render with correct srcset in browser | CMS-03 | Visual verification of responsive images | Open dev tools, check `<img>` srcset attributes and network requests |
| OG meta tags render correctly for social sharing | TECH-06 | Requires checking rendered HTML head | View page source, verify og:title, og:description, og:image tags |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
