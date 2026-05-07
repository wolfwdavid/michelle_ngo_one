---
phase: 5
slug: design-polish-animations
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-07
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vite.config.ts |
| **Quick run command** | `npm run check` |
| **Full suite command** | `npm run check && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run check`
- **After every plan wave:** Run `npm run check && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | DES-01 | build + manual | `npm run build` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | DES-02 | build + manual | `npm run build` | ✅ | ⬜ pending |
| 05-01-03 | 01 | 1 | DES-03 | build + manual | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll fade-in animations trigger on viewport entry | DES-01 | Visual behavior requires browser viewport | Open any page with content blocks, scroll slowly, verify elements fade in with upward motion |
| Page crossfade transitions between routes | DES-02 | Navigation animation requires browser interaction | Click between pages, verify old page fades out and new page fades in smoothly |
| prefers-reduced-motion disables all animations | DES-01, DES-02 | OS-level setting requires browser emulation | Enable reduced motion in browser DevTools, navigate and scroll, verify no animations fire |
| Stagger effect on grid items | DES-01 | Visual timing requires observation | Open portfolio page, scroll to video grid, verify items cascade in with slight delay between each |
| Skeleton shimmer placeholders | DES-03 | Visual placeholder appearance | Check loading states or sparse content pages for animated gray placeholders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
