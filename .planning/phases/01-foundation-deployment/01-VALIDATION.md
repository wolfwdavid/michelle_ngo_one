---
phase: 1
slug: foundation-deployment
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npx svelte-check` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx svelte-check`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | TECH-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | TECH-02 | build | `npx svelte-check` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | NAV-01 | e2e | browser verify | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | NAV-02 | e2e | browser verify | ❌ W0 | ⬜ pending |
| 1-02-03 | 02 | 1 | NAV-03 | visual | browser verify | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 2 | TECH-03 | deploy | `npm run build` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 2 | TECH-04 | deploy | GitHub Pages check | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` + `@testing-library/svelte` — install test framework
- [ ] `svelte-check` — TypeScript and Svelte component checking
- [ ] Test config (`vitest.config.ts`) — Svelte component test support

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sticky header stays visible on scroll | NAV-01 | Requires scroll interaction | Scroll down on any page, verify header remains fixed at top |
| Mobile menu slide-out animation | NAV-03 | Visual animation quality | Resize to mobile, tap hamburger, verify drawer slides from right |
| Responsive layout across breakpoints | DES-04 | Visual layout check | Test at 375px, 768px, 1024px, 1440px widths |
| Typography hierarchy visual quality | DES-05 | Subjective visual check | Compare headings, body, nav text for consistent hierarchy |
| GitHub Pages live deployment | TECH-04 | External service | Visit wolfwdavid.github.io/michelle_ngo_one after deploy |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
