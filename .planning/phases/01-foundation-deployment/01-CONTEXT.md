# Phase 1: Foundation & Deployment - Context

**Gathered:** 2026-05-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold a SvelteKit project with Svelte 5, Tailwind CSS v4, full route structure, responsive navigation with sticky header, and a working GitHub Pages deployment as a project site. This phase delivers the visual skeleton and deployment pipeline — no CMS data, no real content, just placeholder pages and working navigation.

</domain>

<decisions>
## Implementation Decisions

### Deployment
- **D-01:** GitHub Pages **project site** deployment (`wolfwdavid.github.io/michelle_ngo_one`). Set `paths.base = '/michelle_ngo_one'` in svelte.config.js. Use `base` from `$app/paths` for all internal links and asset references.
- **D-02:** May migrate to custom domain later — keep the code easy to switch (just change `paths.base` to `''` and add CNAME). Do not hardcode the repo name anywhere except the config.

### Mobile Menu
- **D-03:** Hamburger icon + **slide-out drawer** from the right on mobile. Clean, familiar, keeps page content partially visible. Fits the minimal Isotope-inspired aesthetic.
- **D-04:** Mobile drawer includes **both navigation links and social icons** (IMDb, LinkedIn, Vimeo, YouTube) at the bottom of the drawer.

### Typography & Color
- **D-05:** **Sans-serif throughout** — clean sans-serif for both headings and body text. Modern, professional, matches the minimal Isotope aesthetic.
- **D-06:** **Monochrome palette + one accent color** — black/dark gray text on white/light gray backgrounds. Single muted accent for links, hover states, and CTAs.

### Claude's Discretion
- **D-07:** Claude picks the specific sans-serif font (e.g., Inter, DM Sans, or similar) — must be clean, professional, and highly legible.
- **D-08:** Claude picks the accent color — should be muted, complement grayscale video thumbnails, and not overpower the minimal aesthetic.

### Page Structure
- **D-09:** **Multi-page routes** — each nav item is a separate page/route. Better for SEO, deep linking, browser history.
- **D-10:** Create **all route pages as placeholder shells** in Phase 1: `/`, `/advertising`, `/film-tv`, `/ux-design`, `/social-transmedia`, `/publishing`, `/about`, `/press`, `/resume`, `/blog`, `/contact`. Navigation works end-to-end from day one.
- **D-11:** **Flat navigation bar** — all items visible in a single row on desktop: Home | Advertising | Film-TV | UX Design | Social & Transmedia | Publishing | About. May need smaller text or abbreviations on tablet breakpoint.
- **D-12:** **Minimal footer** — social icons (IMDb, LinkedIn, Vimeo, YouTube), copyright line, subtle contact link.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in these project files:

### Project Definition
- `.planning/PROJECT.md` — Vision, constraints, design direction (Isotope Films-inspired minimal aesthetic)
- `.planning/REQUIREMENTS.md` — Full v1 requirements with traceability to phases
- `.planning/ROADMAP.md` — Phase 1 success criteria and requirement mapping

### Framework & Stack
- `CLAUDE.md` — Technology stack with version pins, configuration essentials, and "what NOT to use" guidance

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — Phase 1 establishes the patterns all subsequent phases follow

### Integration Points
- GitHub repo: `wolfwdavid/michelle_ngo_one` — deployment target
- SvelteKit adapter-static — prerendering pipeline for GitHub Pages
- `.nojekyll` file required in static/ directory

</code_context>

<specifics>
## Specific Ideas

- Isotope Films (isotopefilms.com) is the primary design inspiration — clean single-page flow, grayscale, video thumbnails with play overlays
- Light backgrounds, ample whitespace throughout
- Social links must include all four: IMDb, LinkedIn, Vimeo, YouTube

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-deployment*
*Context gathered: 2026-05-07*
