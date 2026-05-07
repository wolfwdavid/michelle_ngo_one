# Pitfalls Research

**Domain:** Creative portfolio / filmmaker website (SvelteKit + Contentful + GitHub Pages)
**Researched:** 2026-05-07
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: GitHub Pages Blocks Underscore-Prefixed Files (_app/)

**What goes wrong:**
SvelteKit outputs its built assets to a `_app/` directory. GitHub Pages runs Jekyll by default, which silently ignores all files and directories beginning with an underscore. The site deploys, looks correct at the root URL, but every page is broken because JS/CSS assets fail to load with 404 errors.

**Why it happens:**
Jekyll is GitHub Pages' default static site generator. Developers deploy and see the index page partially render (raw HTML) but none of the interactivity or styling works. The 404s are silent in the browser unless you open DevTools.

**How to avoid:**
Add an empty `.nojekyll` file to the root of the build output. Automate this in the build script so it cannot be forgotten:
```json
"scripts": {
  "build": "vite build && touch build/.nojekyll"
}
```
Or include it in the `static/` directory so SvelteKit copies it automatically.

**Warning signs:**
- Site loads but looks unstyled or has no interactivity
- Network tab shows 404 errors for paths containing `_app/`
- Works perfectly in local `npm run preview` but broken on GitHub Pages

**Phase to address:**
Phase 1 (Project scaffolding / deployment pipeline). This must be solved before any other work is visible.

---

### Pitfall 2: Contentful API Calls Consumed During Every Build, Not Just at Runtime

**What goes wrong:**
With a static site, Contentful API calls happen at build time during prerendering. Each `npm run build` fetches all content entries. During active development with frequent rebuilds, developers burn through the free tier's 100K monthly API call limit without realizing it. Exceeding the limit suspends the API -- the site cannot be rebuilt.

**Why it happens:**
The free tier is generous for a live static site (zero runtime API calls) but developers forget that every local build, every CI build, and every preview deployment consumes API quota. A project with 50 content entries rebuilt 20 times a day during active development = 1,000 calls/day minimum, plus linked assets and pagination.

**How to avoid:**
1. Cache Contentful responses locally during development. Use a simple JSON file cache that persists between builds.
2. Only fetch from Contentful in CI/production builds; use cached data for local dev.
3. Monitor API usage in the Contentful dashboard weekly during active development.
4. If approaching limits, batch content model changes and rebuild less frequently.

**Warning signs:**
- Contentful dashboard shows unexpectedly high API usage
- Builds start failing with 429 (rate limited) or 403 errors
- Free tier usage approaching 80% mid-month

**Phase to address:**
Phase 1-2 (CMS integration setup). Implement caching strategy from the start, not after hitting limits.

---

### Pitfall 3: Vimeo/YouTube Embeds Destroying Page Load Performance

**What goes wrong:**
Michelle has 147+ videos on Vimeo. A portfolio page showing multiple video embeds loads each iframe with its own HTML document, CSS, and 500KB+ of JavaScript per embed. A page with 6 embedded videos can add 3MB+ of JavaScript and dozens of network requests, making the page sluggish and causing poor Core Web Vitals scores.

**Why it happens:**
The naive approach is to drop `<iframe>` embeds directly into the page. Each iframe is a full browser context. Developers test with 1-2 videos and it seems fine, then populate with real content and the page crawls.

**How to avoid:**
Use a "lite embed" / "facade" pattern:
1. Show a static thumbnail image with a play button overlay
2. Only load the actual Vimeo/YouTube iframe when the user clicks play
3. Use `loading="lazy"` on any iframes that must be present
4. Limit embedded (auto-playing) videos to 1-2 per page (featured work)
5. Use thumbnail grids that link to Vimeo/YouTube for the rest of the catalog

Libraries like `lite-youtube-embed` and `lite-vimeo-embed` implement this pattern. For SvelteKit, build a simple `<VideoEmbed>` component that handles the facade.

**Warning signs:**
- Lighthouse performance score drops below 50
- Time to Interactive exceeds 5 seconds
- Users on mobile report slow/janky scrolling
- Page size exceeds 2MB on any portfolio page

**Phase to address:**
Phase 2-3 (Video integration). Must be the architecture from day one -- retrofitting facades onto direct embeds is tedious.

---

### Pitfall 4: Dynamic Routes Not Discovered During Prerendering

**What goes wrong:**
SvelteKit's static adapter only prerenders pages it can discover. Dynamic routes like `/projects/[slug]` that are populated from Contentful at build time require either explicit `prerender.entries` configuration or discoverable links from already-prerendered pages. If neither exists, the routes are silently skipped -- no build error, just missing pages that 404 in production.

**Why it happens:**
SvelteKit's prerenderer crawls from the root page following links. If a project page is only reachable via client-side navigation (e.g., JavaScript-driven filtering) and not via an `<a href>` tag in prerendered HTML, the crawler never finds it. Developers test in dev mode (which has a server) and everything works. They deploy the static build and pages are missing.

**How to avoid:**
1. Use `entries` export in `+page.server.ts` to explicitly list all dynamic route values by fetching from Contentful at build time:
   ```typescript
   export const entries = async () => {
     const projects = await fetchAllProjects();
     return projects.map(p => ({ slug: p.slug }));
   };
   ```
2. Or ensure a sitemap/index page has `<a>` links to every project page.
3. Add a build verification step that checks the number of generated HTML files matches expected content count.

**Warning signs:**
- Build output has fewer HTML files than expected content entries
- Some project pages work in dev mode but 404 in production
- SvelteKit build logs show "not prerendered" warnings

**Phase to address:**
Phase 2 (Content model + dynamic routes). Must be verified before first real deployment.

---

### Pitfall 5: Stale Content After Contentful Updates (No Rebuild Trigger)

**What goes wrong:**
Because the site is statically generated, content changes in Contentful are invisible until the site is rebuilt and redeployed. Michelle updates her portfolio in Contentful, expects to see changes on the live site, and nothing happens. She thinks the CMS is broken.

**Why it happens:**
Static sites are snapshots. There is no server re-fetching content on each request. Developers build the pipeline but forget to set up automated rebuilds, or explain the workflow to the content editor.

**How to avoid:**
1. Set up a Contentful webhook that triggers a GitHub Actions workflow on content publish events.
2. Document the "edit -> publish -> wait 2 minutes -> see changes" workflow for Michelle.
3. Add a "Last updated" timestamp in the site footer so it is obvious when the site was last built.
4. Keep the GitHub Actions build under 3 minutes so the feedback loop is tight.

**Warning signs:**
- Client reports "I changed content but nothing updated"
- No webhook configured in Contentful
- No GitHub Actions workflow for automated rebuilds
- Build times creeping above 5 minutes

**Phase to address:**
Phase 3-4 (Deployment automation). Must be in place before handing off to client.

---

### Pitfall 6: Base Path Misconfiguration for GitHub Pages Project Sites

**What goes wrong:**
If deploying to `username.github.io/repo-name` (a project site, not a user site), all asset paths and internal links must be prefixed with `/repo-name`. Without this, assets load from the root domain and 404. With a custom domain, the base path should be empty. Getting this wrong breaks the entire site -- CSS, JS, images, and navigation all fail.

**Why it happens:**
Developers build and test locally where the base path is `/`. They deploy to GitHub Pages and everything breaks. Or they configure the base path for the repo URL, then add a custom domain and forget to remove it.

**How to avoid:**
1. Decide early: custom domain (base = '') vs. project site (base = '/repo-name').
2. Configure in `svelte.config.js`: `kit: { paths: { base: '/repo-name' } }`.
3. Use SvelteKit's `base` import from `$app/paths` for all internal links and asset references -- never hardcode paths.
4. Test the production build locally with `npm run preview` using the same base path.

**Warning signs:**
- Blank page on GitHub Pages with console errors about failed asset loads
- Links navigate to wrong URLs (missing or doubled base path)
- Images and fonts 404 in production but work locally

**Phase to address:**
Phase 1 (Project scaffolding). Decide deployment strategy before writing any routes.

---

### Pitfall 7: Image-Heavy Portfolio Without Optimization Strategy

**What goes wrong:**
Portfolio sites are image-heavy by nature. Contentful serves images via its Images API with transformation parameters, but developers forget to use them and serve full-resolution images (2MB+ each). A portfolio grid page with 20 project thumbnails loads 40MB+ of images. Mobile users bounce.

**Why it happens:**
During development, images look great at full resolution. No one tests on a throttled connection. Contentful's Images API supports resize, format conversion (WebP/AVIF), and quality parameters, but you must explicitly use them.

**How to avoid:**
1. Build an image component that automatically appends Contentful Image API parameters: `?w=400&fm=webp&q=80` for thumbnails, `?w=1200&fm=webp&q=85` for hero images.
2. Use `srcset` and `sizes` attributes for responsive images.
3. Implement lazy loading (`loading="lazy"`) for below-fold images.
4. Set a performance budget: no page should exceed 3MB total transfer size.
5. Test with Chrome DevTools network throttling set to "Fast 3G."

**Warning signs:**
- Lighthouse flags "Properly size images" or "Serve images in next-gen formats"
- Page weight exceeds 5MB on portfolio grid pages
- Contentful bandwidth usage approaching 50GB free tier limit

**Phase to address:**
Phase 2 (Component library / content rendering). Build the optimized image component before populating content.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding Contentful space/token in source | Quick setup | Tokens exposed in public repo; painful to rotate | Never -- use env variables from day one |
| Skipping TypeScript for Contentful responses | Faster initial coding | Runtime errors when content model changes; no autocomplete | Never -- generate types from Contentful content model |
| Inline styles instead of design tokens | Quick visual tweaks | Inconsistent spacing/colors; redesign requires touching every component | Only for one-off prototyping, refactor before Phase 2 |
| Fetching all content in a single API call | Simple data layer | Hits Contentful response size limits (7MB); slow builds as content grows | Acceptable for MVP with <50 entries, refactor for scale |
| Using SvelteKit dev server as "good enough" testing | No build step needed | Masks prerendering failures, base path issues, missing routes | Never for deployment verification |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Contentful | Exposing Content Delivery API token in client-side code | For static sites, tokens are only used at build time. Ensure they are in environment variables and never shipped to the browser bundle. Use `$env/static/private` not `$env/static/public`. |
| Contentful | Not handling Rich Text field rendering | Contentful Rich Text returns a JSON AST, not HTML. Use `@contentful/rich-text-html-renderer` or build a custom Svelte renderer for the document nodes. |
| Contentful | Ignoring linked/referenced entries (depth) | Contentful API only resolves 1 level of linked entries by default. Use `include` parameter (max 10) or make follow-up requests for deeply nested content. |
| Vimeo | Using default embed parameters | Add `?dnt=1` for privacy compliance, `&background=1` for background videos, `&quality=auto` for adaptive bitrate. Configure in the embed URL, not just Vimeo settings. |
| GitHub Actions | Not caching node_modules between builds | Use `actions/cache` or `actions/setup-node` with cache option. Without caching, every build installs dependencies from scratch (2+ minutes wasted). |
| GitHub Pages | Missing 404.html fallback | Configure adapter-static with `fallback: '404.html'` so client-side routing works for direct URL access. Without it, any direct navigation to a subpage shows GitHub's default 404. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Multiple Vimeo iframes on one page | Janky scrolling, 5+ second load times, high memory usage | Facade pattern: thumbnail + click-to-load | More than 2 embeds per page |
| Unoptimized Contentful images | Slow page loads, high bandwidth, poor Lighthouse scores | Image component with automatic URL params for sizing/format | More than 5 full-res images per page |
| Loading all portfolio entries on one page | Long initial load, browser memory issues | Paginate or use category filtering that loads subsets | More than 30 entries with thumbnails |
| CSS animations on too many elements | Dropped frames, battery drain on mobile | Use `will-change` sparingly, prefer `transform`/`opacity`, reduce simultaneous animations to 3-5 | More than 10 animated elements visible simultaneously |
| Web fonts loading render-blocking | Flash of invisible text (FOIT), delayed content paint | Use `font-display: swap`, preload critical fonts, limit to 2-3 font files | More than 3 font weights/styles |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Contentful API tokens committed to git | Token reuse by scrapers; content manipulation if management token exposed | Use `.env` files (gitignored), inject via GitHub Actions secrets. Audit git history if tokens were ever committed. |
| Contact form without spam protection | Bot submissions flooding inbox; potential abuse | Use a honeypot field + rate limiting. For static sites, use a form backend (Formspree, Netlify Forms equivalent) with built-in spam filtering. |
| Embedding third-party scripts without SRI | Supply chain attacks via compromised CDN | Use Subresource Integrity hashes for any external scripts. Prefer self-hosted assets where possible. |
| No Content Security Policy headers | XSS risk from embedded content (video iframes, CMS rich text) | GitHub Pages supports CSP via `<meta>` tags. Allow-list Vimeo/YouTube iframe sources and Contentful image CDN. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Auto-playing video on page load | Jarring, uses bandwidth, accessibility violation, may cause bounce | Thumbnail with clear play button; let user choose to play |
| Portfolio grid with no filtering/categories | Visitors cannot find relevant work across Michelle's 5+ disciplines | Category tabs or filters (Advertising, Film/TV, UX, etc.) matching her existing site structure |
| Missing project context/descriptions | Video thumbnails without titles or descriptions feel like a random gallery | Every project needs: title, role, client/production, year, 1-2 sentence description |
| No clear call-to-action | Visitors enjoy the work but don't know how to hire/contact Michelle | Persistent but subtle contact CTA; "Available for projects" status indicator |
| Animations that delay content access | Visitors wait for fade-ins to finish before they can see work | Keep animations under 300ms; never block content behind animation sequences; use `prefers-reduced-motion` media query |
| Resume/CV only as PDF download | Recruiters on mobile cannot easily view; not indexable by search engines | HTML version of resume on-page with PDF download as secondary option |

## "Looks Done But Isn't" Checklist

- [ ] **Video embeds:** Often missing facade/lazy-load pattern -- verify no iframe loads until user interaction or scroll-into-view
- [ ] **404 page:** Often missing custom 404.html -- verify direct URL access to `/nonexistent-page` shows a branded 404, not GitHub's default
- [ ] **Mobile navigation:** Often missing hamburger/mobile menu -- verify all sections are accessible on 320px viewport
- [ ] **SEO meta tags:** Often missing per-page titles, descriptions, Open Graph images -- verify each project page has unique meta tags populated from Contentful
- [ ] **Contentful webhook:** Often missing rebuild trigger -- verify editing content in Contentful triggers a new GitHub Actions build
- [ ] **Image alt text:** Often missing from CMS-driven images -- verify Contentful content model has alt text field and it renders in HTML
- [ ] **Contact form:** Often missing validation and success/error states -- verify form handles empty fields, invalid email, submission failure, and success confirmation
- [ ] **Trailing slashes:** Often inconsistent -- verify internal links work with SvelteKit's `trailingSlash` setting and don't 404 on GitHub Pages
- [ ] **Prerendered route count:** Often missing pages -- verify build output HTML file count matches expected content entries in Contentful

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Underscore files blocked by Jekyll | LOW | Add `.nojekyll` to `static/`, redeploy. 5-minute fix. |
| Contentful API limit exceeded | MEDIUM | Wait for monthly reset or upgrade plan. Implement local caching to prevent recurrence. |
| Video embeds tanking performance | MEDIUM | Replace iframes with facade components one page at a time. 1-2 day refactor. |
| Missing prerendered routes | LOW | Add `entries` export to dynamic route files, rebuild. 1-hour fix per route. |
| Stale content (no webhook) | LOW | Set up Contentful webhook + GitHub Actions workflow. 2-hour setup. |
| Base path wrong | LOW | Update `svelte.config.js`, rebuild, redeploy. But may need to fix hardcoded paths throughout codebase (MEDIUM if paths were hardcoded). |
| Full-res images everywhere | MEDIUM | Build image utility component, update all image references. 1-day refactor depending on component count. |
| API tokens in git history | HIGH | Rotate all Contentful tokens immediately. If management API token was exposed, audit for unauthorized content changes. Use `git filter-branch` or BFG to purge history. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Jekyll blocking _app/ files | Phase 1: Scaffolding | `.nojekyll` in static/, deployed site loads CSS/JS |
| Base path misconfiguration | Phase 1: Scaffolding | Production URL loads correctly, all assets resolve |
| API tokens in source code | Phase 1: Scaffolding | `.env` in `.gitignore`, tokens in GitHub Actions secrets |
| Contentful API limit burn | Phase 2: CMS Integration | Local dev uses cached responses, API usage <50% at mid-month |
| Dynamic routes not prerendered | Phase 2: CMS Integration | Build output file count matches Contentful entry count |
| Contentful Rich Text not rendered | Phase 2: CMS Integration | Blog/press pages render formatted text, not JSON |
| Unoptimized images | Phase 2: Component Library | Image component uses Contentful Image API params, Lighthouse passes |
| Video embed performance | Phase 3: Video Integration | Facade pattern in place, no page exceeds 3MB, Lighthouse perf >80 |
| No content filtering/categories | Phase 3: Portfolio Pages | Category tabs functional, each discipline filterable |
| Missing SEO meta tags | Phase 3: Content Pages | Each page has unique title/description/OG image |
| Stale content (no webhook) | Phase 4: Deployment Automation | Contentful publish triggers GitHub Actions build within 5 minutes |
| Contact form without spam protection | Phase 4: Forms/Integration | Honeypot field active, test submissions received, spam filtered |
| Excessive/blocking animations | Phase 4: Polish | `prefers-reduced-motion` respected, no animation >300ms blocking content |

## Sources

- [SvelteKit Static Adapter Docs](https://svelte.dev/docs/kit/adapter-static) -- official prerendering and fallback configuration
- [SvelteKit GitHub Pages Issue #1553](https://github.com/sveltejs/kit/issues/1553) -- underscore file and .nojekyll discussion
- [Contentful Technical Limits](https://www.contentful.com/developers/docs/technical-limits/) -- API rate limits and response size constraints
- [Contentful Usage Limits](https://www.contentful.com/help/admin/usage/usage-limit/) -- free tier API call and bandwidth caps
- [Contentful Free Plan Changes](https://wmkagency.com/blog/contentful-free-plan-changes-what-they-mean-for-your-website-and-how-to) -- free tier restrictions and commercial use policy
- [WP Speed Matters: Optimize Video Embeds](https://wpspeedmatters.com/optimize-youtube-vimeo-videos-in-wordpress/) -- facade/lite-embed performance data
- [Does Embedding Videos Affect Website Speed](https://www.beknown.nyc/insights/does-embedding-videos-affect-website-speed) -- iframe performance impact analysis
- [SvelteKit Dynamic Routes Discussion #11977](https://github.com/sveltejs/kit/discussions/11977) -- prerendering dynamic routes with adapter-static
- [GitHub Pages Underscore Files Discussion](https://github.com/orgs/community/discussions/23166) -- Jekyll ignoring underscore-prefixed directories
- [Khromov: Missing Guide to adapter-static](https://khromov.se/the-missing-guide-to-understanding-adapter-static-in-sveltekit/) -- comprehensive static adapter guide
- [UX Playbook: Portfolio Homepage Mistakes 2025](https://uxplaybook.org/articles/6-ux-portfolio-homepage-mistakes-2025) -- portfolio UX anti-patterns

---
*Pitfalls research for: Creative portfolio / filmmaker website (SvelteKit + Contentful + GitHub Pages)*
*Researched: 2026-05-07*
