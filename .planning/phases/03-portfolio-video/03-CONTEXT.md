# Phase 3: Portfolio & Video - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the homepage (hero, category sections, about snippet, press highlights), all portfolio category pages with video thumbnail grids, a video lightbox/modal player, and project detail pages with case study content. This phase delivers the primary value of the site — exploring Michelle's portfolio across all 6 disciplines and watching video work directly.

</domain>

<decisions>
## Implementation Decisions

### Homepage Layout
- **D-01:** Hero section: Michelle's name, tagline, and a single featured video reel as the visual centerpiece. Clean, immediate impact — Isotope Films-inspired.
- **D-02:** Below the hero, stacked category sections — each category gets a labeled section. Scroll down through: Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, Copywriting.
- **D-03:** Each category section shows 1 featured video (larger, left) + 3 thumbnails (smaller, right) with a "See all" link to the full category page.
- **D-04:** About snippet and press highlights sit after all 6 category sections at the bottom of the homepage. Portfolio is the star; about/press are secondary context.

### Category Expand Behavior
- **D-05:** Slide-down grid expansion — clicking "See all" or the category heading expands remaining thumbnails below the initial row with a smooth Svelte animation. Click again to collapse.
- **D-06:** Accordion behavior — only one category expandable at a time. Expanding a new category collapses the previously open one. Keeps page length manageable.

### Video Lightbox/Modal
- **D-07:** Dark semi-transparent overlay with a large centered Vimeo/YouTube iframe (16:9 aspect ratio). Project title displayed below the player. X button top-right, Escape key to close.
- **D-08:** Prev/next navigation arrows inside the lightbox to browse through videos in the category without closing. Arrow keys also work for keyboard navigation.
- **D-09:** Focus trapping inside the modal for accessibility (VID-02). Tab cycles through close button, prev/next arrows, and the iframe.
- **D-10:** Facade pattern for all video embeds — thumbnail + play overlay icon shown first, Vimeo/YouTube iframe loads only on click. Critical for performance with 147+ videos (PORT-06).

### Project Detail Pages
- **D-11:** Each project gets a dedicated route page: `/{category}/{project-slug}`. SEO-friendly, shareable URLs, deep-linkable.
- **D-12:** Detail page layout: project title, video player (16:9 with facade), role/client metadata, description text, credits list. Clean single-column layout.

### Category Pages
- **D-13:** Thumbnail grid: 3 columns on desktop, 2 on tablet, 1 on mobile. Play overlay icon on each video thumbnail.
- **D-14:** Each thumbnail card shows: video thumbnail image (from Contentful), play overlay icon, project title below. Click opens the lightbox.
- **D-15:** Category page header with category name and optional description. "Back to Home" breadcrumb or link.

### Filmography Page
- **D-16:** VID-04 filmography/credits list — Claude's Discretion on format (table vs cards vs timeline). Should show year, role, production type as structured data from Film-TV projects.

### Claude's Discretion
- Filmography page format (D-16) — table, cards, or timeline
- Specific animation timing/easing for slide-down expand
- Empty state design for categories with no CMS content yet
- Thumbnail aspect ratio (16:9 matching video, or square crops)
- How many press highlights to show on homepage (2-4)
- About snippet length and layout

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definition
- `.planning/PROJECT.md` — Vision, constraints, Isotope Films design inspiration, content categories
- `.planning/REQUIREMENTS.md` — HOME-01 through HOME-05, PORT-01 through PORT-06, VID-01 through VID-04
- `.planning/ROADMAP.md` — Phase 3 success criteria and requirement mapping
- `CLAUDE.md` — Technology stack, Svelte 5 runes, Tailwind v4, "what NOT to use" (no GSAP, no heavy video players)

### Phase 1 Foundation
- `.planning/phases/01-foundation-deployment/01-CONTEXT.md` — Base path `/michelle_ngo_one`, project site deployment, typography (sans-serif), accent color #4A6FA5, multi-page routes, flat nav bar

### Phase 2 CMS Layer
- `.planning/phases/02-cms-content-layer/02-CONTEXT.md` — Content model decisions: separate type per category, boolean featured field, plain text descriptions, Rich Text blog only, Contentful Image API, 4-width srcset
- `src/lib/contentful/types.ts` — All content type interfaces and normalized component-facing types (Project, PressItem, SiteSettingsData)
- `src/lib/contentful/queries.ts` — getProjects(), getFeaturedProjects(), getPressItems(), getSiteSettings() functions
- `src/lib/contentful/image.ts` — contentfulSrcset(), contentfulSrc() helpers
- `src/lib/components/ContentfulImage.svelte` — Responsive image component with lazy-load fade-in
- `src/lib/components/SEO.svelte` — SEO meta component for per-page title/description/OG

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ContentfulImage.svelte` — Responsive CMS image with AVIF/WebP srcset, lazy-load fade-in. Use for all video thumbnails.
- `SEO.svelte` — Per-page meta tags. Use on homepage, category pages, and project detail pages with project-specific OG images.
- `getProjects(contentTypeId)` — Fetches all projects for a category. Powers category page grids.
- `getFeaturedProjects(contentTypeId)` — Fetches featured-only projects. Powers homepage category sections.
- `getPressItems()` — For homepage press highlights section.
- `getSiteSettings()` — Already loaded in root layout via +layout.server.ts. Available to all pages.

### Established Patterns
- Svelte 5 runes ($state, $props, $derived, $effect) — no stores
- Tailwind v4 utility classes (CSS-first, no JS config)
- Static prerendering via adapter-static — all data fetched at build time in load functions
- `base` from `$app/paths` for all internal links
- `$bindable()` for shared component state (used in Header/MobileDrawer)

### Integration Points
- Route placeholders exist at: `/`, `/advertising`, `/film-tv`, `/ux-design`, `/social-transmedia`, `/publishing` — replace placeholder content with real CMS-powered pages
- Need dynamic routes: `/advertising/[slug]`, `/film-tv/[slug]`, etc. for project detail pages
- `+layout.server.ts` already provides `data.siteSettings` to all pages
- Category page load functions use `getProjects('advertisingProject')` etc.

</code_context>

<specifics>
## Specific Ideas

- Isotope Films (isotopefilms.com) — primary visual inspiration for thumbnail grids with play overlays, clean whitespace
- 147 videos on Vimeo (user2149742) — facade pattern is non-negotiable for performance
- Hero featured reel should be a single SiteSettings-level or dedicated "hero video" entry from Contentful
- Category order on homepage matches nav: Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, Copywriting

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-portfolio-video*
*Context gathered: 2026-05-07*
