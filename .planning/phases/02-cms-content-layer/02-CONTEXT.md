# Phase 2: CMS & Content Layer - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Connect Contentful CMS to the SvelteKit site — define content models, integrate the Contentful SDK for build-time data fetching, set up webhook-triggered rebuilds on content publish, implement image optimization via Contentful Image API, and add SEO meta tags with Open Graph support. This phase delivers the full content pipeline so Michelle can manage all site content through Contentful independently.

</domain>

<decisions>
## Implementation Decisions

### Content Model Design
- **D-01:** **Separate content type per category** — dedicated Contentful content types for each portfolio category (AdvertisingProject, FilmProject, UXDesignProject, SocialTransmediaProject, PublishingProject, CopywritingProject). Each gets category-specific fields.
- **D-02:** **Plain text for project descriptions + separate image/media fields.** No Rich Text on project entries. Simpler CMS editing experience, less rendering complexity.
- **D-03:** **Boolean 'featured' field** on each project type. Michelle toggles which projects appear on the homepage. Simple and easy to change.
- **D-04:** **Rich Text for blog posts** — full formatting (headers, bold, links, embedded images/videos). Requires `@contentful/rich-text-html-renderer`. Blog is the only content type using Rich Text.
- **D-05:** **Press items: Title + source + URL + date.** Minimal press entry — publication name, article title, link, and date. No excerpt or thumbnail.
- **D-06:** **SiteSettings singleton** content type for global data — site title, tagline, social URLs (IMDb, LinkedIn, Vimeo, YouTube), resume PDF asset. Michelle can update these without code changes.
- **D-07:** **Resume: PDF upload + structured fields.** Michelle uploads a downloadable PDF, plus structured fields (experience entries, education, skills) for on-page display.

### Image Optimization
- **D-08:** **Contentful Image API** for all CMS-hosted images. Transform via URL params (`?w=800&fm=webp&q=80`). No build-time image processing for CMS assets. CDN-cached by Contentful.
- **D-09:** **4 responsive image sizes** for srcset: 320w, 640w, 960w, 1280w. Covers mobile through desktop with tablet-landscape granularity.
- **D-10:** **Intersection Observer (svelte-inview) for lazy loading.** Fade-in animation when images enter viewport — matches the "subtle fade-in" design direction. svelte-inview already in project dependencies.

### Webhook & Rebuild
- **D-11:** **Contentful webhook → GitHub repository_dispatch** for automated rebuilds. Deploy workflow listens for both `push` (code changes) and `repository_dispatch` (content changes).
- **D-12:** **Publish-only webhook trigger.** Rebuild only on content publish events, not drafts or unpublished edits. Prevents unnecessary builds while Michelle is editing.
- **D-13:** **Environment variables + .env.example.** Contentful API keys (space ID, access token) stored in `.env` locally, GitHub Secrets for CI. `.env.example` documents required variables without values.

### SEO & Meta Tags
- **D-14:** Claude's Discretion on SEO scope — pick the practical level for a portfolio site (likely: per-page title/description, Open Graph basics, maybe Person schema if straightforward).
- **D-15:** **Use project thumbnail as Open Graph image.** Auto-use the project's cover image for social sharing previews. No separate OG image field needed.

### Claude's Discretion
- SEO implementation depth (D-14) — Claude picks what's practical
- Specific Contentful field names and validation rules per content type
- TypeScript types for Contentful content models
- Contentful SDK client setup pattern (singleton, per-request, etc.)
- Error handling for missing CMS content (fallback UI)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definition
- `.planning/PROJECT.md` — Vision, constraints, Contentful requirement, design direction
- `.planning/REQUIREMENTS.md` — CMS-01, CMS-02, CMS-03, TECH-05, TECH-06 requirements
- `.planning/ROADMAP.md` — Phase 2 success criteria and requirement mapping
- `CLAUDE.md` — Technology stack with Contentful SDK versions, content model recommendations, "what NOT to use" guidance

### Phase 1 Foundation
- `.planning/phases/01-foundation-deployment/01-CONTEXT.md` — Phase 1 decisions (base path, deployment, typography)
- `src/lib/config/navigation.ts` — Navigation data contract (navItems, socialLinks) that CMS data must integrate with
- `svelte.config.js` — Base path config (`/michelle_ngo_one`) affecting asset URLs and OG image paths
- `src/routes/+layout.js` — Prerender and trailingSlash settings

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/config/navigation.ts` — NavItem and SocialLink interfaces, could be extended or replaced with CMS-sourced data
- `src/lib/components/SocialLinks.svelte` — Currently uses hardcoded socialLinks array, will need to accept CMS data
- `src/lib/components/Header.svelte` — Imports navItems, may need to support CMS-sourced navigation
- `src/routes/+layout.svelte` — Root layout with Header + Footer, slot for page content

### Established Patterns
- Svelte 5 runes ($state, $props, $bindable) — no stores
- Tailwind v4 CSS-first (no JS config)
- Static prerendering (adapter-static) — all data must be available at build time
- `base` from `$app/paths` for all internal links

### Integration Points
- `src/routes/+layout.js` — Can add load function for global CMS data (SiteSettings)
- Each route's `+page.js` or `+page.server.js` — Load functions for per-page CMS content
- `.github/workflows/deploy.yml` — Needs repository_dispatch trigger and Contentful env vars
- `package.json` — Contentful SDK (contentful@^11.12.1) and Rich Text renderer dependencies

</code_context>

<specifics>
## Specific Ideas

- Contentful free tier: 1 space, 1M API calls/month, 25K records — verify this covers expected content volume
- 147 videos on Vimeo (user2149742) — content migration volume consideration
- Isotope Films-inspired thumbnail grids — CMS images feed into the visual grid layout
- SiteSettings singleton should include resume PDF as a Contentful Asset reference

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-cms-content-layer*
*Context gathered: 2026-05-07*
