---
phase: 03-portfolio-video
plan: 02
subsystem: ui
tags: [svelte, lightbox, video, accessibility, focus-trap, keyboard-navigation]

requires:
  - phase: 03-01
    provides: parseVideoUrl utility and VideoInfo types for embedding Vimeo/YouTube
provides:
  - Accessible VideoLightbox modal component with keyboard navigation and focus trapping
  - Prev/next video browsing within category context
affects: [03-03, 03-04, 03-05]

tech-stack:
  added: []
  patterns: [focus-trap-pattern, iframe-destroy-on-close, body-scroll-lock]

key-files:
  created:
    - src/lib/components/VideoLightbox.svelte
  modified: []

key-decisions:
  - "tabindex=-1 on dialog element for Svelte a11y compliance"
  - "$state() for modalEl binding to satisfy reactivity warning"
  - "Exported openAt() method for parent components to trigger lightbox with focus restoration"

patterns-established:
  - "Focus trap: querySelectorAll for focusable elements, shift+tab wraps to last, tab wraps to first"
  - "Iframe lifecycle: {#if open} block ensures iframe is destroyed (not hidden) on close, stopping playback"
  - "Body scroll lock via $effect with cleanup function"

requirements-completed: [VID-01, VID-02]

duration: 1min
completed: 2026-05-07
---

# Phase 03 Plan 02: VideoLightbox Summary

**Accessible video lightbox modal with focus trap, keyboard navigation, and prev/next browsing for Vimeo/YouTube embeds**

## Performance

- **Duration:** 1 min
- **Started:** 2026-05-07T17:07:52Z
- **Completed:** 2026-05-07T17:09:16Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

### Task 1: Build VideoLightbox with focus trap, keyboard navigation, and prev/next

Built `VideoLightbox.svelte` -- the primary video viewing component for the portfolio. Key features:

- **Modal overlay**: Dark backdrop (85% opacity) with centered 16:9 video iframe
- **Transitions**: fade on backdrop, scale on content wrapper (200ms each)
- **Close mechanisms**: X button, Escape key, backdrop click
- **Navigation**: Prev/next arrows with ArrowLeft/ArrowRight keyboard support
- **Focus trap**: Tab cycles only through close button, prev, next, and iframe
- **Focus restoration**: Returns focus to the thumbnail that triggered the lightbox
- **Iframe lifecycle**: Wrapped in `{#if open}` so iframe is destroyed on close, stopping video playback
- **Body scroll lock**: `document.body.style.overflow = 'hidden'` when open, restored on close
- **Svelte 5**: Uses `$props()`, `$bindable()`, `$state()`, `$derived()`, `$effect()` -- no legacy patterns

**Commit:** 448caa4

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added tabindex="-1" to dialog element**
- **Found during:** Task 1 verification (svelte-check)
- **Issue:** Svelte a11y rule requires interactive role elements to have tabindex
- **Fix:** Added `tabindex="-1"` to the dialog container div
- **Files modified:** src/lib/components/VideoLightbox.svelte
- **Commit:** 448caa4

**2. [Rule 1 - Bug] Made modalEl reactive with $state()**
- **Found during:** Task 1 verification (svelte-check)
- **Issue:** Svelte 5 warns when a variable is updated (via bind:this) but not declared with $state
- **Fix:** Changed `let modalEl: HTMLDivElement` to `let modalEl: HTMLDivElement = $state(...)`
- **Files modified:** src/lib/components/VideoLightbox.svelte
- **Commit:** 448caa4

## Known Stubs

None -- component is fully functional with no placeholder data or TODO items.

## Self-Check: PASSED
