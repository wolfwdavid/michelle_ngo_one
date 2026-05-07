# Phase 5: Design Polish & Animations - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Scroll animations, page transitions, and visual refinement across all existing pages. No new features, no layout restructuring, no new components beyond animation utilities. The content is the star — motion enhances without drawing attention.

</domain>

<decisions>
## Implementation Decisions

### Scroll Animations
- **D-01:** Fade-up entrance — elements fade in (opacity 0→1) while rising 20px (translateY). Duration ~400ms with ease-out easing.
- **D-02:** Subtle stagger for groups — items in grids/lists delay ~75ms between each other, creating a gentle cascade left-to-right/top-to-bottom.
- **D-03:** Content blocks only — animate video thumbnail cards/grids, category sections, about photo+bio, press items, blog cards, resume section cards, discipline cards. Do NOT animate headers/titles, nav, footer, breadcrumbs, body text, or form fields.
- **D-04:** Animate once only — elements animate the first time they enter viewport, then stay visible. No re-triggering on scroll back.

### Page Transitions
- **D-05:** Crossfade between routes — old page fades out, new page fades in. Duration ~250ms. Implemented in +layout.svelte using SvelteKit page transition pattern.
- **D-06:** Always scroll to top on route change — every navigation starts at the top of the new page.

### Visual Refinement
- **D-07:** Targeted fixes pass — unify hover effects, tighten spacing rhythm, ensure accent color (#4A6FA5) usage consistency, uniform card shadow/border treatment, focus ring styling for accessibility.
- **D-08:** Skeleton placeholders for loading states — animated shimmer/pulse gray rectangles matching content layout. Even though pages are pre-rendered (static site), skeleton states improve perceived quality when CMS data is sparse or during hydration.

### Motion Philosophy
- **D-09:** Respect prefers-reduced-motion fully — disable all scroll animations and page transitions when OS setting is enabled. Hover effects kept (no motion involved). Skeleton shimmer becomes static gray.
- **D-10:** Subtle & restrained intensity — 200-400ms durations, 10-20px distances, ease-out easing. Professional, polished, invisible. Consistent with existing codebase timing (200-300ms for micro-interactions).

### Claude's Discretion
- Specific easing curves (ease-out vs cubic-bezier) — pick what feels best per element
- Skeleton placeholder design details (pulse speed, gray shade, border radius)
- Whether to create a shared animation utility/action or inline transitions per component
- Exact stagger delay per component type (grids vs lists may differ slightly)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Direction
- `.planning/phases/01-foundation-deployment/01-CONTEXT.md` — D-05/D-06: sans-serif (Inter), monochrome + steel blue accent #4A6FA5
- `.planning/phases/03-portfolio-video/03-CONTEXT.md` — D-07/D-08/D-09/D-10: video lightbox animation patterns (fade+scale)
- `.planning/REQUIREMENTS.md` — DES-01, DES-02, DES-03 requirements

### Existing Animation Patterns
- `src/lib/components/VideoLightbox.svelte` — fade backdrop + scale content pattern
- `src/lib/components/HomepageCategorySection.svelte` — slide accordion with cubicOut
- `src/lib/components/ContentfulImage.svelte` — svelte-inview usage pattern (threshold 0.1)
- `src/routes/contact/+page.svelte` — fade transition on form state changes

### Framework References
- `src/routes/+layout.svelte` — where page transitions will be added
- `src/app.css` — where @theme or @keyframes additions go (Tailwind v4 CSS-first)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **svelte-inview v4.0.4**: Already installed, used in ContentfulImage. Provides `inview` directive with `oninview_enter` callback. Ready for scroll-triggered animations across all pages.
- **Svelte transitions**: `fade`, `fly`, `slide`, `scale` already imported in various components. No new dependencies needed.
- **Tailwind transition utilities**: `transition-colors`, `transition-opacity`, `transition-transform` with `duration-200`/`duration-300` used consistently.

### Established Patterns
- **Timing**: 200ms for micro-interactions (hover, focus), 300ms for larger transitions (drawer, accordion). Phase 5 extends to 400ms for scroll animations.
- **Easing**: `cubicOut` used for accordion expansion. `ease-out` for hover transitions.
- **Animation approach**: Svelte built-in transitions for mount/unmount, Tailwind utilities for hover/focus. No custom @keyframes yet.

### Integration Points
- `+layout.svelte` — page transition wrapper goes here (currently no transition)
- `app.css` — custom @keyframes for skeleton shimmer animation
- Every page component — scroll animation wrappers around content blocks
- `prefers-reduced-motion` — media query in app.css or per-component checks

</code_context>

<specifics>
## Specific Ideas

- Isotope Films-inspired: animations should be invisible — you notice the content, not the motion
- Skeleton placeholders even on a static site signal quality and attention to detail
- Stagger effect on video thumbnail grids creates the portfolio "reveal" moment

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-design-polish-animations*
*Context gathered: 2026-05-07*
