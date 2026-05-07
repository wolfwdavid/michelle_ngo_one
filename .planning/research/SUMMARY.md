# Project Research Summary

**Project:** Michelle Ngo Portfolio
**Domain:** Creative portfolio / filmmaker website (static, multi-disciplinary)
**Researched:** 2026-05-07
**Confidence:** HIGH

## Executive Summary

This project is a modern redesign of michellengo.net -- a static portfolio website for a multi-disciplinary creative professional (producer, filmmaker, copywriter, UX designer). The expert-recommended approach is a Jamstack architecture: SvelteKit with adapter-static for prerendered pages, Contentful as a headless CMS for content management, and GitHub Pages for free static hosting. This is a well-trodden path with high-quality documentation and minimal technical risk. The stack choices (SvelteKit 2, Svelte 5, Tailwind CSS v4, Contentful) are all current stable releases with strong ecosystem support.

The recommended build approach is phase-gated: start with the deployment pipeline and global layout shell, then wire up Contentful content models and the data layer, then build portfolio pages with video integration, and finally add polish features (animations, blog, press page). This ordering is driven by two factors: (1) deployment pipeline must be validated early because GitHub Pages has specific gotchas (underscore files, base paths) that break the site silently, and (2) the Contentful data layer is a dependency for all content pages and must be proven before building on top of it.

The primary risks are video embed performance (147+ Vimeo videos demand a facade/lazy-load pattern from day one), Contentful API quota burn during development (free tier limits hit faster than expected with frequent rebuilds), and the GitHub Pages underscore-file gotcha (SvelteKit `_app/` directory is blocked by Jekyll unless `.nojekyll` is present). All three are well-understood problems with documented solutions. The key discipline is implementing these solutions in Phase 1 rather than retrofitting them later.

## Key Findings

### Recommended Stack

The stack is locked by client requirements (SvelteKit, Contentful, GitHub Pages) and research confirms these are excellent choices for this use case. Svelte 5 runes replace the old store pattern. Tailwind CSS v4 uses a CSS-first configuration model via the `@tailwindcss/vite` plugin -- no PostCSS or JS config files. Web3Forms handles the contact form without a backend (250 free submissions/month).

**Core technologies:**
- **SvelteKit 2 + Svelte 5:** Static site framework -- smallest bundle sizes of any major framework, critical for image/video-heavy portfolio
- **Contentful (SaaS):** Headless CMS -- Michelle can update portfolio content independently; structured content models map to portfolio categories
- **Tailwind CSS v4:** Utility-first CSS via Vite plugin -- rapid responsive development, automatic unused CSS purging
- **adapter-static:** Full prerendering to static HTML -- required for GitHub Pages, zero runtime server cost
- **Web3Forms:** Static-compatible contact form service -- no backend, privacy-friendly, generous free tier

**Critical version requirements:** SvelteKit 2 requires Svelte 5 (do not mix with Svelte 4). Tailwind v4 Vite plugin requires Vite 6+ (ships with SvelteKit 2). Contentful SDK v11 requires Node 18+.

### Expected Features

**Must have (table stakes):**
- Responsive design across mobile, tablet, desktop
- Fast page loads with lazy-loaded video embeds (facade pattern)
- Hero section with featured video/showreel
- Project portfolio with category pages (Advertising, Film-TV, UX Design, Social and Transmedia, Publishing)
- Video integration with facade/lazy-loading pattern for performance
- About page with bio and social links
- Contact form (Web3Forms)
- SEO fundamentals (meta tags, Open Graph, semantic HTML)
- Resume/CV page (HTML on-page + PDF download)
- Contentful CMS integration for all content

**Should have (differentiators):**
- Project case studies with rich content (role, challenge, approach, outcome)
- Press/News page (CMS-managed chronological feed)
- Subtle scroll animations and page transitions (under 300ms, respect prefers-reduced-motion)
- Lightbox/modal video player (click thumbnail, watch without leaving page)
- Video thumbnail grid with play overlays (Isotope Films pattern)

**Defer (v2+):**
- Blog (requires content to populate; add when Michelle is ready to write)
- Filmography/credits list (structured IMDb-equivalent)
- Discipline-specific landing pages (start with category tabs, evolve if content warrants)

### Architecture Approach

Pure Jamstack: all content fetched from Contentful at build time via `+page.ts` load functions, prerendered to static HTML by adapter-static, deployed to GitHub Pages via GitHub Actions. Zero runtime API calls, zero server cost. Content updates flow through a Contentful webhook that triggers a GitHub Actions rebuild (2-5 minutes end-to-end). The project structure uses file-based routing with one folder per portfolio section, a centralized `$lib/contentful/` module as the single gateway for all CMS queries, and domain-grouped components (portfolio, media, blog, press, ui).

**Major components:**
1. **SvelteKit (adapter-static)** -- Route generation, page prerendering, client-side navigation after hydration
2. **Contentful data layer** (`$lib/contentful/`) -- Client singleton, centralized query functions, TypeScript content types
3. **Portfolio components** (ProjectGrid, ProjectCard, ProjectDetail) -- Reusable across all 5+ discipline sections
4. **Media components** (VideoEmbed, VideoThumbnail) -- Facade pattern for video performance; handles both Vimeo and YouTube
5. **GitHub Actions CI/CD** -- Build on push, webhook-triggered rebuilds on Contentful publish

### Critical Pitfalls

1. **GitHub Pages blocks `_app/` directory** -- Jekyll ignores underscore-prefixed files. Fix: add `.nojekyll` to `static/` directory. Must be solved in Phase 1 before anything else is visible.
2. **Video embeds destroy page performance** -- Each Vimeo iframe adds 500KB+ JS. With 147+ videos, this is catastrophic. Fix: facade pattern (thumbnail + click-to-load) from day one. Never use direct iframes.
3. **Contentful API quota burn during development** -- Every local/CI build consumes API calls. Free tier (100K/month) depletes faster than expected. Fix: cache Contentful responses locally during development, only fetch live in CI.
4. **Dynamic routes silently not prerendered** -- `[slug]` routes populated from Contentful need explicit `entries` exports or discoverable links. Missing routes produce no build error, just 404s in production. Fix: add `entries` function to all dynamic routes, verify build output file count.
5. **Base path misconfiguration** -- Project sites at `github.io/repo-name` require `paths.base` config. Wrong config breaks all assets silently. Fix: decide deployment strategy (custom domain vs. project site) in Phase 1, use `$app/paths` base import everywhere.

## Implications for Roadmap

Based on research, the suggested phase structure follows the architecture dependency chain and front-loads deployment validation.

### Phase 1: Foundation and Deployment Pipeline
**Rationale:** GitHub Pages deployment has multiple gotchas (`.nojekyll`, base paths, trailing slashes) that must be validated before any content work. The deployment pipeline is a dependency for everything -- if deployment is broken, no other work is visible.
**Delivers:** Working SvelteKit project deployed to GitHub Pages with global layout (Nav, Footer), basic routing skeleton, Tailwind CSS configured, GitHub Actions CI/CD.
**Addresses:** Responsive design (layout shell), clean navigation, SEO fundamentals (HTML structure).
**Avoids:** Jekyll underscore blocking, base path misconfiguration, API tokens in source code.

### Phase 2: Content Layer and Data Model
**Rationale:** Every content page depends on Contentful. The data layer must be proven end-to-end (content model -> SDK fetch -> prerender -> deploy) before building individual pages. This phase also establishes the image optimization pattern that all subsequent phases use.
**Delivers:** Contentful space with content models (Project, Category, PressItem, BlogPost, Page, SiteSettings), TypeScript types, centralized query module, API response caching for development, optimized image component using Contentful Image API params.
**Addresses:** Contentful CMS integration, image optimization.
**Avoids:** API quota burn, dynamic routes not prerendered, Rich Text rendering failures, unoptimized images.

### Phase 3: Core Portfolio Pages
**Rationale:** The portfolio is the primary value of the site. Once the content layer works, building out all category sections is the highest-impact work. Video integration is bundled here because portfolio pages without video are incomplete for a filmmaker site.
**Delivers:** Homepage with hero/featured work, all 5 category sections (Advertising, Film-TV, UX Design, Social and Transmedia, Publishing) with project grids, individual project detail pages with video embeds, VideoEmbed and VideoThumbnail components with facade pattern.
**Addresses:** Hero section, project portfolio with categories, video integration, video thumbnail grid with play overlays.
**Avoids:** Video embed performance trap, missing prerendered routes, no content filtering.

### Phase 4: Secondary Content Pages
**Rationale:** About, Press, Resume, and Contact are essential but not dependent on complex data relationships. They build on the proven content layer from Phase 2.
**Delivers:** About page, Press/News page, Resume/CV page (HTML + PDF download), Contact form with Web3Forms integration and spam protection.
**Addresses:** About page, press/news page, resume/CV, contact form, social links.
**Avoids:** Contact form without spam protection.

### Phase 5: Polish and Client Handoff
**Rationale:** Animations, transitions, and automated rebuilds are polish that should not be attempted until core functionality is solid. The Contentful webhook is critical for client independence -- Michelle must be able to update content without developer involvement.
**Delivers:** Scroll animations (FadeIn component with svelte-inview), page transitions, SEO meta tags per page (from Contentful), Contentful webhook for automatic rebuilds, custom 404 page, `prefers-reduced-motion` support, responsive design refinement, performance audit.
**Addresses:** Subtle animations, SEO meta tags, content update workflow.
**Avoids:** Stale content (no webhook), excessive/blocking animations, missing 404 page.

### Phase 6: Content Growth (v2)
**Rationale:** Blog, filmography, and discipline-specific landing pages require content that may not exist at launch. Defer until the portfolio is live and Michelle is producing content for these sections.
**Delivers:** Blog with listing and detail pages, filmography/credits list, discipline-specific landing pages (if content warrants).
**Addresses:** Blog, filmography, discipline landing pages.

### Phase Ordering Rationale

- Deployment pipeline first because GitHub Pages gotchas are invisible until you deploy -- catching them early saves hours of debugging later.
- Content layer second because every content page depends on it, and the Contentful caching strategy must be in place before heavy development begins.
- Portfolio pages third because they are the core value proposition and the most complex (video integration, multiple categories, dynamic routes).
- Secondary pages fourth because they are simpler pages that reuse patterns established in Phase 3.
- Polish last because animations and transitions applied to incomplete pages waste effort on components that may change.
- Blog/filmography deferred because they require content that does not yet exist.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Content Layer):** Contentful content modeling decisions have long-term consequences. Research the exact field structure for Project entries, especially how to handle category-specific fields (video details vs. UX case study details). Also research the caching strategy implementation.
- **Phase 3 (Core Portfolio):** The facade pattern for video embeds needs implementation research -- whether to use lite-vimeo-embed / lite-youtube-embed libraries or build a custom Svelte component. Also research the entries export pattern for dynamic route prerendering.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Well-documented SvelteKit + adapter-static + GitHub Pages setup. Multiple reference repos and official docs cover this thoroughly.
- **Phase 4 (Secondary Pages):** Standard content pages using patterns established in earlier phases.
- **Phase 5 (Polish):** Svelte built-in transitions and svelte-inview are well-documented. Contentful webhook setup has official guides.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registries and official docs. Client requirements lock major choices. |
| Features | HIGH | Feature landscape well-mapped from competitor analysis, client requirements, and industry standards. |
| Architecture | HIGH | Jamstack with SvelteKit static adapter is a documented, proven pattern. Multiple reference implementations exist. |
| Pitfalls | HIGH | All critical pitfalls sourced from official issue trackers, documentation, and community discussions with multiple corroborating sources. |

**Overall confidence:** HIGH

### Gaps to Address

- **Contentful content model field details:** Research identified the content types needed (Project, Category, PressItem, etc.) but the exact field structure for category-specific data (e.g., should video details be a linked content type or fields on Project?) needs decision during Phase 2 planning.
- **Custom domain vs. project site deployment:** The base path configuration depends on whether Michelle will use a custom domain (michellengo.net) or deploy to github.io/repo-name. This must be decided before Phase 1 implementation.
- **@sveltejs/enhanced-img stability:** This package is pre-1.0 and experimental. It handles local/static images well but does not work for Contentful-hosted images. Monitor for breaking changes. For CMS images, use Contentful Image API URL parameters instead.
- **Contentful free tier commercial use:** Contentful free tier has restrictions on commercial use. If this is a commercial site, verify that the Community (free) plan is appropriate or budget for a paid plan.

## Sources

### Primary (HIGH confidence)
- SvelteKit npm (npmjs.com/package/@sveltejs/kit) -- v2.59.0 confirmed
- Svelte npm (npmjs.com/package/svelte) -- v5.55.5 confirmed
- Tailwind CSS npm (npmjs.com/package/tailwindcss) -- v4.2.4 confirmed
- SvelteKit Static Adapter Docs (svelte.dev/docs/kit/adapter-static) -- prerendering and deployment
- SvelteKit Project Structure Docs (svelte.dev/docs/kit/project-structure) -- file-based routing
- Contentful JavaScript SDK Docs (contentful.com/developers/docs/javascript/sdks/) -- SDK v11.12.1
- Contentful Technical Limits (contentful.com/developers/docs/technical-limits/) -- API rate limits
- Tailwind CSS v4 SvelteKit Guide (tailwindcss.com/docs/guides/sveltekit) -- official integration

### Secondary (MEDIUM confidence)
- SvelteKit GitHub Pages deployment guide (florinasutanto.com/blog/2026/deploy-sveltekit-to-gh-pages)
- Khromov: Missing Guide to adapter-static (khromov.se)
- Filmmaker Portfolios: 15+ Examples 2026 (sitebuilderreport.com)
- Filmmakers on Fabrik: 120 Portfolio Websites (fabrik.io)
- Video performance (web.dev/learn/performance/video-performance)

### Tertiary (LOW confidence)
- @sveltejs/enhanced-img npm -- v0.10.4 experimental, pre-1.0
- Contentful Free Plan Changes (wmkagency.com) -- free tier commercial use policy

---
*Research completed: 2026-05-07*
*Ready for roadmap: yes*
