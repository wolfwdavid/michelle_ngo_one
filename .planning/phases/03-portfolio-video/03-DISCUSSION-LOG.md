# Phase 3: Portfolio & Video - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 03-portfolio-video
**Areas discussed:** Homepage layout, Category expand behavior, Video lightbox/modal, Project detail view

---

## Homepage Layout

### Hero Section

| Option | Description | Selected |
|--------|-------------|----------|
| Name + tagline + reel | Michelle's name, tagline, and a single featured video reel as the visual centerpiece. Clean, immediate impact. | Yes |
| Name + tagline only | Minimal text hero, no video. Categories start immediately below. | |
| Full-bleed image hero | Large background image with name overlay. More cinematic. | |

**User's choice:** Name + tagline + reel
**Notes:** Recommended option chosen. Isotope Films-inspired clean presentation.

### Category Sections

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked sections | Each category gets a labeled section with 1 featured video + row of thumbnails. Scroll through all categories. | Yes |
| Grid of category cards | 6 equal-sized cards in a grid, each with 1 featured thumbnail. | |
| Single mixed grid | All featured projects in one masonry grid, tagged by category. | |

**User's choice:** Stacked sections
**Notes:** Clear hierarchy, easy to scan.

### Thumbnail Count

| Option | Description | Selected |
|--------|-------------|----------|
| 1 featured + 3 thumbs | Larger featured video left, 3 smaller thumbnails right. "See all" links to full category page. | Yes |
| 1 featured only | Single featured video per category. Ultra-minimal. | |
| 1 featured + 5 thumbs | More content upfront, may get long with 6 categories. | |

**User's choice:** 1 featured + 3 thumbnails
**Notes:** Good balance of showing range without overwhelming.

### About/Press Placement

| Option | Description | Selected |
|--------|-------------|----------|
| After all categories | Hero > 6 categories > About snippet > Press highlights > Footer | Yes |
| Between categories | Interleaved with category sections | |
| Sidebar | Categories main column, about/press in sidebar | |

**User's choice:** After all categories
**Notes:** Portfolio is the star, about/press secondary.

---

## Category Expand Behavior

### Expand Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Slide-down grid | Click "See all" expands remaining thumbnails below with animation. Click to collapse. | Yes |
| Navigate to category page | "See all" goes to full category page. No inline expansion. | |
| Modal overlay grid | Full-screen overlay showing all videos in category. | |

**User's choice:** Slide-down grid
**Notes:** Satisfies HOME-03 requirement for inline expand with animation.

### Accordion Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| One at a time | Expanding collapses previously open category. | Yes |
| Multiple open | Each category expands/collapses independently. | |

**User's choice:** One at a time (accordion)
**Notes:** Keeps page manageable with 6 categories.

---

## Video Lightbox/Modal

### Lightbox Design

| Option | Description | Selected |
|--------|-------------|----------|
| Dark overlay + centered player | Semi-transparent dark backdrop, large 16:9 iframe, title below, X button + Escape. | Yes |
| Side panel player | Video slides in from the right as a panel. | |
| Inline expand | Thumbnail expands in-place to become the player. | |

**User's choice:** Dark overlay + centered player
**Notes:** Clean, focused viewing experience.

### Navigation Arrows

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, prev/next arrows | Left/right arrows + keyboard arrows to browse videos in category. | Yes |
| No navigation | One video at a time, close to switch. | |
| You decide | Claude picks based on complexity. | |

**User's choice:** Prev/next navigation arrows
**Notes:** Natural browsing flow for a video portfolio.

---

## Project Detail View

### Access Method

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated page | Each project gets own route (/{category}/{slug}). SEO-friendly, shareable. | Yes |
| Expand below thumbnail | Detail panel slides down in grid. | |
| Lightbox with detail tab | Video + case study in one modal. | |

**User's choice:** Dedicated page
**Notes:** Best for SEO, deep linking, sharing.

### Grid Columns

| Option | Description | Selected |
|--------|-------------|----------|
| 3 col / 2 col / 1 col | 3 columns desktop, 2 tablet, 1 mobile. Good thumbnail size. | Yes |
| 4 col / 2 col / 1 col | Denser grid, smaller thumbnails. | |
| You decide | Claude picks responsive breakpoints. | |

**User's choice:** 3/2/1 responsive columns
**Notes:** Standard responsive grid with play overlay icons.

---

## Claude's Discretion

- Filmography page format (table, cards, or timeline)
- Animation timing/easing for expand/collapse
- Empty state design for categories without CMS content
- Thumbnail aspect ratio
- Number of press highlights on homepage
- About snippet length and layout

## Deferred Ideas

None — discussion stayed within phase scope
