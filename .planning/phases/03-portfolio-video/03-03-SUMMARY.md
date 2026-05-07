---
phase: 03-portfolio-video
plan: 03
subsystem: ui
tags: [svelte, sveltekit, homepage, accordion, video-facade, contentful, lightbox]

# Dependency graph
requires:
  - phase: 03-portfolio-video/01
    provides: "VideoFacade, VideoThumbnailCard, VideoLightbox components + category config"
  - phase: 03-portfolio-video/02
    provides: "VideoLightbox with keyboard nav and focus trapping"
  - phase: 02-cms-content
    provides: "Contentful queries (getProjects, getFeaturedProjects, getPressItems, getSiteSettings), types, layout server load"
provides:
  - "Complete homepage with hero, 6 category sections, about snippet, press highlights"
  - "SiteSettingsData heroVideoUrl and heroThumbnailUrl fields"
  - "HomepageCategorySection with accordion expand/collapse"
  - "Homepage server load with parallel category + press data fetching"
affects: [04-content-pages, 05-contact-seo]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Accordion pattern: single expanded state with slug-based toggle"
    - "Parallel data fetching: Promise.all for 6 categories + press items"
    - "Graceful hero degradation: video reel only renders when heroVideoUrl is set"

key-files:
  created:
    - src/routes/+page.server.ts
    - src/lib/components/HomepageHero.svelte
    - src/lib/components/HomepageCategorySection.svelte
    - src/lib/components/HomepageAboutSnippet.svelte
    - src/lib/components/HomepagePressHighlights.svelte
  modified:
    - src/lib/contentful/types.ts
    - src/lib/contentful/queries.ts
    - src/routes/+layout.server.ts
    - src/routes/+page.svelte

key-decisions:
  - "Hero video reel reads from SiteSettings heroVideoUrl, gracefully omitted when null"
  - "Accordion behavior: slug-based state, only one category expanded at a time"
  - "Initial display shows up to 4 projects per category, preferring featured items"

patterns-established:
  - "Homepage section component pattern: each section is a standalone Svelte component with props from page data"
  - "Accordion state management: parent page holds expandedCategory slug, toggleCategory function passed as onToggle callback"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04, HOME-05]

# Metrics
duration: 3min
completed: 2026-05-07
---

# Phase 03 Plan 03: Homepage Summary

**Complete homepage with hero video reel, 6 accordion category sections, about snippet, and press highlights -- all CMS-powered via Contentful**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-07T17:10:47Z
- **Completed:** 2026-05-07T17:13:20Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Hero section with "Michelle Ngo" display heading, tagline from SiteSettings, and conditional video reel via VideoFacade
- 6 stacked category sections with featured project (larger), 3 secondary thumbnails, and slide-animated accordion expand
- About snippet with CTA link to /about/ and 3 press highlights with external links
- Homepage server load fetches all 6 categories' featured + all projects plus 3 press highlights in parallel

## Task Commits

Each task was committed atomically:

1. **Task 1: Add heroVideoUrl to SiteSettings, create homepage server load and hero/about/press components** - `599e426` (feat)
2. **Task 2: Create HomepageCategorySection with accordion expand and wire up homepage** - `2c8c522` (feat)

## Files Created/Modified
- `src/lib/contentful/types.ts` - Added heroVideoUrl/heroThumbnailUrl to SiteSettingsData and SiteSettingsFields
- `src/lib/contentful/queries.ts` - Updated getSiteSettings() to extract hero video fields
- `src/routes/+layout.server.ts` - Added hero fields to fallback defaults
- `src/routes/+page.server.ts` - Homepage data loader with parallel category + press fetching
- `src/routes/+page.svelte` - Full homepage layout composing all section components
- `src/lib/components/HomepageHero.svelte` - Hero with name, tagline, conditional video reel
- `src/lib/components/HomepageCategorySection.svelte` - Category section with accordion expand via slide transition
- `src/lib/components/HomepageAboutSnippet.svelte` - About excerpt with CTA link
- `src/lib/components/HomepagePressHighlights.svelte` - 3 press items with external links

## Decisions Made
- Hero video reel conditionally renders only when heroVideoUrl is set in SiteSettings (graceful degradation until client populates Contentful)
- Accordion state managed at page level with slug-based tracking, one category open at a time
- Initial display shows up to 4 projects per category, preferring featured items, filling with non-featured if fewer than 4 featured

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added heroVideoUrl/heroThumbnailUrl to layout server fallback**
- **Found during:** Task 1
- **Issue:** Layout server fallback object lacked the new hero fields, would cause type errors
- **Fix:** Added heroVideoUrl: null and heroThumbnailUrl: null to fallback in +layout.server.ts
- **Files modified:** src/routes/+layout.server.ts
- **Verification:** svelte-check passes without new errors
- **Committed in:** 599e426 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for type safety. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. Hero video reel will appear automatically when client adds heroVideoUrl field to SiteSettings in Contentful.

## Next Phase Readiness
- Homepage complete, ready for category pages and project detail pages (Plan 04+)
- All homepage section components are reusable
- Lightbox integration tested and wired

## Self-Check: PASSED

- All 9 created/modified files verified present on disk
- Commit 599e426 (Task 1) verified in git log
- Commit 2c8c522 (Task 2) verified in git log

---
*Phase: 03-portfolio-video*
*Completed: 2026-05-07*
