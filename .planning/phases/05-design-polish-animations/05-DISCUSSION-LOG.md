# Phase 5: Design Polish & Animations - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 05-design-polish-animations
**Areas discussed:** Scroll Animations, Page Transitions, Visual Refinement, Motion Philosophy

---

## Scroll Animations

### Q1: How should elements animate into view?

| Option | Description | Selected |
|--------|-------------|----------|
| Fade up | Elements fade in + slide up 10-20px. Subtle, professional, Isotope-inspired. | ✓ |
| Fade only | Pure opacity transition, no movement. | |
| Mixed directions | Different elements from different directions. More dynamic but busier. | |

**User's choice:** Fade up
**Notes:** Most common approach for portfolio sites. Matches the clean/minimal aesthetic.

### Q2: Should group elements stagger?

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle stagger | Each item delays ~75-100ms. Gentle cascade effect. | ✓ |
| All at once | All items animate simultaneously. | |
| You decide | Claude picks per component. | |

**User's choice:** Subtle stagger
**Notes:** ~75ms delay between items in grids.

### Q3: Which elements should animate?

| Option | Description | Selected |
|--------|-------------|----------|
| Content blocks only | Cards, images, sections, grids animate. Headers/nav/footer/text stay static. | ✓ |
| Everything animates | All content fades in on scroll. | |
| Minimal — hero + grids only | Only homepage hero and card grids. | |

**User's choice:** Content blocks only
**Notes:** Purposeful animation — cards, photos, press items, blog cards, discipline cards animate. Headers, nav, footer, breadcrumbs, text, forms stay static.

### Q4: Should elements re-animate on scroll back?

| Option | Description | Selected |
|--------|-------------|----------|
| Animate once only | First time only, then stay visible. | ✓ |
| Re-animate every time | Fade out and re-animate when scrolled back. | |
| You decide | Claude picks per component. | |

**User's choice:** Animate once only

---

## Page Transitions

### Q1: What style of transition between routes?

| Option | Description | Selected |
|--------|-------------|----------|
| Crossfade | Old page fades out, new fades in. 200-300ms. | ✓ |
| Slide | Pages slide left/right based on direction. | |
| Fade to white | Fade through white background. | |
| No page transition | Instant page swap. | |

**User's choice:** Crossfade
**Notes:** Clean, no directionality implied. Standard portfolio approach.

### Q2: Scroll behavior on route change?

| Option | Description | Selected |
|--------|-------------|----------|
| Always scroll to top | Every route change starts at top. | ✓ |
| Preserve position | Maintain position on back navigation. | |
| You decide | Claude picks per navigation type. | |

**User's choice:** Always scroll to top

---

## Visual Refinement

### Q1: What level of polish pass?

| Option | Description | Selected |
|--------|-------------|----------|
| Targeted fixes | Consistency: hover effects, spacing, accent color, card treatment, focus rings. | ✓ |
| Comprehensive audit | Full visual audit of every page. | |
| You decide | Claude identifies and fixes. | |

**User's choice:** Targeted fixes
**Notes:** No layout restructuring, no new components, no color palette changes.

### Q2: Loading/empty states?

| Option | Description | Selected |
|--------|-------------|----------|
| Skeleton placeholders | Animated shimmer/pulse matching content layout. | ✓ |
| Simple loading text | "Loading..." or spinner. | |
| Not needed | Static site, no loading states needed. | |

**User's choice:** Skeleton placeholders
**Notes:** Even on static site, signals quality and attention to detail.

---

## Motion Philosophy

### Q1: Reduced motion handling?

| Option | Description | Selected |
|--------|-------------|----------|
| Respect fully | Disable all scroll animations and page transitions. Keep hover effects. | ✓ |
| Reduce but keep some | Disable scroll anims, keep shorter page crossfade. | |
| You decide | Claude implements best a11y approach. | |

**User's choice:** Respect fully
**Notes:** prefers-reduced-motion disables everything motion-related. Skeleton shimmer becomes static gray.

### Q2: Overall motion intensity?

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle & restrained | 200-400ms, 10-20px, ease-out. Professional, invisible. | ✓ |
| Noticeable & expressive | 400-600ms, 30-50px, spring easing. | |
| Barely there | 150-200ms, 5-10px. Almost imperceptible. | |

**User's choice:** Subtle & restrained
**Notes:** Content is the star, not the motion.

---

## Claude's Discretion

- Specific easing curves per element
- Skeleton placeholder design details
- Shared animation utility vs inline transitions
- Exact stagger delay per component type

## Deferred Ideas

None — discussion stayed within phase scope
