# Phase 4: Content Pages - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the 5 secondary content pages: About (bio, photo, disciplines), Press/News (chronological feed), Resume/CV (on-page structured view + PDF download), Blog (Rich Text posts with images and embedded video), and Contact form (static-compatible submission). These pages complement the portfolio (Phase 3) with biographical, editorial, professional, and outreach content.

</domain>

<decisions>
## Implementation Decisions

### About Page
- **D-01:** Split layout — professional photo on one side, bio text on the other. Disciplines grid below as linked cards. On mobile, photo stacks above bio.
- **D-02:** Bio content sourced from Contentful `Page` content type (Rich Text body). Michelle can update bio and photo without code changes.
- **D-03:** Each discipline card links to its portfolio category page (e.g., Advertising card -> /advertising/). Uses CATEGORIES config from Phase 3.

### Blog
- **D-04:** Blog index uses card grid layout — cover image, title, date, excerpt per card. Responsive grid: 3-col desktop, 2-col tablet, 1-col mobile. Matches portfolio grid pattern.
- **D-05:** No categories or tags. Flat chronological list of posts. Simple CMS model, appropriate for portfolio blog volume.
- **D-06:** Blog posts support embedded video via custom Rich Text renderer node that renders VideoFacade for video URLs. Consistent with portfolio video facade pattern.
- **D-07:** Individual blog post pages at `/blog/{slug}` with Rich Text body rendered via existing RichText.svelte component.

### Contact Form
- **D-08:** Web3Forms for form submission — 250 submissions/month free, no data storage, privacy-friendly. Simple HTML form with access key.
- **D-09:** Minimal fields only — name, email, message. No subject dropdown or category selector. Minimal friction, clean aesthetic.
- **D-10:** Claude's Discretion on success/error state UI — should be clear, minimal, and inline (not a separate page redirect).

### Press/News Page
- **D-11:** Chronological feed of press mentions using PressItem type from Phase 2 (title, source, URL, date). No excerpt or thumbnail per Phase 2 decision D-05. External links open in new tab.
- **D-12:** Claude's Discretion on press page layout — list or cards, grouping by year or flat.

### Resume/CV Page
- **D-13:** Sectioned cards layout — distinct sections (Experience, Education, Skills) each as a bordered card/block. Download PDF button prominently placed at top of page.
- **D-14:** Structured Contentful fields for resume data — separate entries for each experience/education item with typed fields (title, company, dates, description). Aligns with Phase 2 decision D-07.
- **D-15:** Claude's Discretion on skills display format (tags, list, or grouped categories).

### Claude's Discretion
- Success/error states for contact form (D-10)
- Press page layout style (D-12)
- Skills display format on resume (D-15)
- Blog post page layout details (header image treatment, reading time display)
- Empty states for all pages when no CMS content exists

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definition
- `.planning/PROJECT.md` — Vision, constraints, Isotope Films design inspiration
- `.planning/REQUIREMENTS.md` — CONT-01 through CONT-05 acceptance criteria
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria

### Prior Phase Context
- `.planning/phases/01-foundation-deployment/01-CONTEXT.md` — Deployment config (base path), typography (sans-serif), color (monochrome + steel blue #4A6FA5), mobile drawer pattern
- `.planning/phases/02-cms-content-layer/02-CONTEXT.md` — Content model decisions (D-01 through D-15), Rich Text for blog, press item fields, resume PDF + structured fields, image optimization, SEO
- `.planning/phases/03-portfolio-video/03-CONTEXT.md` — Homepage layout, category pages, video facade pattern, breadcrumb navigation

### Existing Components
- `src/lib/components/RichText.svelte` — Rich Text renderer component (Phase 2)
- `src/lib/contentful/richtext.ts` — Rich Text to HTML conversion with custom renderers
- `src/lib/components/ContentfulImage.svelte` — CMS image with lazy loading and srcset
- `src/lib/components/SEO.svelte` — Per-page meta tags and Open Graph
- `src/lib/components/Breadcrumb.svelte` — Accessible breadcrumb navigation
- `src/lib/components/VideoFacade.svelte` — Video embed with facade pattern (reuse in blog)
- `src/lib/config/categories.ts` — CATEGORIES array for discipline card links

### CMS Types and Queries
- `src/lib/contentful/types.ts` — PressItem, SiteSettingsData, Project interfaces
- `src/lib/contentful/queries.ts` — getPressItems, getSiteSettings, getProjects, getProjectBySlug

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `RichText.svelte` + `richtext.ts`: Ready for blog post rendering. May need custom node renderer for embedded video (D-06).
- `ContentfulImage.svelte`: Reuse for about page photo, blog post cover images.
- `SEO.svelte`: Already used on all pages — add to each content page.
- `Breadcrumb.svelte`: Reuse for all 5 content pages.
- `VideoFacade.svelte`: Reuse in blog Rich Text renderer for embedded videos.
- `CATEGORIES` config: Maps discipline names to category page hrefs for about page discipline cards.

### Established Patterns
- Page server load: `+page.server.ts` with Contentful query + error handling (see Phase 3 category pages)
- Component structure: Svelte 5 runes ($props, $state, $derived), Tailwind utility classes
- Responsive grids: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern used throughout
- Base path: All internal links use `{base}/` prefix from `$app/paths`
- Empty states: "No content yet" message pattern established in category pages

### Integration Points
- All 5 route placeholders exist (`/about`, `/press`, `/resume`, `/blog`, `/contact`) — replace placeholder content
- Blog needs `[slug]` dynamic route with `entries()` export for prerendering (same pattern as portfolio detail pages)
- Contact form needs Web3Forms access key — stored as environment variable or in SiteSettings
- Resume needs new Contentful content types (ResumeExperience, ResumeEducation, ResumeSkill) or structured JSON field
- Press page reuses existing `getPressItems()` query — no new query needed

</code_context>

<specifics>
## Specific Ideas

- About page discipline cards should visually match the clean card pattern — not heavy or decorative
- Blog video embeds should feel identical to portfolio video playback (facade pattern, same play overlay)
- Contact form should feel effortless — no CAPTCHA visible (Web3Forms handles spam via honeypot)
- Resume download button should be prominent but not dominate the page

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-content-pages*
*Context gathered: 2026-05-07*
