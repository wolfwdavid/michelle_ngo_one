<!-- GSD:project-start source:PROJECT.md -->
## Project

**Michelle Ngo Portfolio**

A modern redesign of michellengo.net — a portfolio website for Michelle Ngo, a multi-disciplinary creative (producer, filmmaker, copywriter, UX designer). Built with SvelteKit and Contentful CMS, hosted on GitHub Pages. The site showcases her work across advertising, film/TV, UX design, social/transmedia, and publishing with a clean, minimal aesthetic and subtle animations.

**Core Value:** Michelle's diverse creative work speaks for itself — the site must present it beautifully with zero friction, letting visitors explore her portfolio across disciplines and watch her video work directly on the site.

### Constraints

- **Framework**: SvelteKit — client requirement
- **CMS**: Contentful — headless, managed, client can update content independently
- **Hosting**: GitHub Pages — static site generation via SvelteKit static adapter
- **Budget**: Free-tier friendly (GitHub Pages free, Contentful free tier)
- **Content**: Must preserve all existing portfolio sections and categories
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| SvelteKit | ^2.59.0 | Application framework | Client requirement. Excellent for static sites via adapter-static. Svelte 5 runes provide clean reactivity model. Smallest bundle sizes of any major framework -- critical for a visual portfolio where images/video dominate bandwidth. |
| Svelte | ^5.55.0 | UI component framework | Svelte 5 is current stable. Runes ($state, $derived, $effect) replace stores. Built-in transitions (fade, fly, scale) cover all animation needs for subtle fade-ins without external animation libraries. |
| @sveltejs/adapter-static | ^3.0.10 | Static site generation | Prerenders entire site to static HTML/CSS/JS at build time. Required for GitHub Pages deployment. Zero runtime server cost. |
| Contentful (CMS) | N/A (SaaS) | Content management | Client requirement. Free tier includes 1 space, 1M API calls/month, 25K records. Michelle can update portfolio content without developer involvement. Structured content models map cleanly to portfolio categories. |
| contentful | ^11.12.1 | Contentful Delivery SDK | Official JS SDK for fetching content at build time. TypeScript support. Used in SvelteKit load functions during prerendering. |
| Tailwind CSS | ^4.2.4 | Utility-first CSS | v4 is CSS-first (no JS config file). Integrates via @tailwindcss/vite plugin -- no PostCSS config needed. Utility classes enable rapid iteration on layout and responsive design. Purges unused CSS automatically for tiny production bundles. |
| @tailwindcss/vite | ^4.2.4 | Tailwind Vite integration | Official Vite plugin for Tailwind v4. Replaces the old PostCSS + autoprefixer setup. Drop-in for SvelteKit's Vite config. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @contentful/rich-text-html-renderer | ^17.1.6 | Render Contentful Rich Text to HTML | Blog posts, project descriptions, press page content -- any Rich Text field from Contentful. Use {@html} in Svelte to render output. |
| @contentful/rich-text-types | ^17.1.6 | TypeScript types for Rich Text | Type-safe custom node renderers when you need to override how embedded assets or entries render in Rich Text. |
| @sveltejs/enhanced-img | ^0.10.4 | Build-time image optimization | Local/static images only (hero images, UI assets). Generates WebP/AVIF variants and responsive srcsets automatically. Note: experimental, pre-1.0 -- pin exact version. Does NOT work for Contentful-hosted images. |
| svelte-inview | latest | Intersection Observer wrapper | Scroll-triggered fade-in animations. Fires callbacks when elements enter viewport. Lightweight alternative to full animation libraries. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Vite | Build tool / dev server | Ships with SvelteKit. Fast HMR, handles all bundling. No separate config needed. |
| TypeScript | Type safety | SvelteKit scaffolds with TS support. Use for Contentful content types, load functions, component props. |
| Prettier + prettier-plugin-svelte | Code formatting | Standard Svelte ecosystem formatter. Handles .svelte file formatting correctly. |
| ESLint + eslint-plugin-svelte | Linting | Catches common Svelte mistakes. SvelteKit scaffolds this by default. |
| gh-pages or GitHub Actions | Deployment | GitHub Actions workflow preferred -- auto-deploys on push to main. Uses actions/upload-pages-artifact + actions/deploy-pages. |
### Contact Form Service
| Service | Tier | Purpose | Why Recommended |
|---------|------|---------|-----------------|
| Web3Forms | Free | Form-to-email for contact page | No backend needed. Free tier is generous (250 submissions/month). No data storage (privacy-friendly). Simple HTML form with access key -- works perfectly with static sites. Alternative: Formspree (similar, 50 submissions/month free). |
## Installation
# Scaffold project
# Select: SvelteKit minimal, TypeScript, Tailwind CSS, Prettier, ESLint
# Core dependencies
# Image optimization (experimental -- pin version)
# Scroll animations
# Tailwind v4 Vite plugin (if not added by sv create)
## Configuration Essentials
### svelte.config.js
### src/routes/+layout.js
### static/.nojekyll
### vite.config.ts (Tailwind v4)
### src/app.css (Tailwind v4)
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Tailwind CSS v4 | Plain CSS / CSS Modules | If Michelle or a future developer strongly prefers semantic class names. Svelte scoped styles are excellent on their own. Tailwind chosen for rapid prototyping and responsive utilities. |
| Contentful | Sanity | If real-time collaborative editing or GROQ query language is preferred. Sanity has a more generous free tier for datasets. Contentful chosen per client requirement. |
| Contentful | Markdown files (MDsveX) | If CMS cost ever becomes an issue. MDsveX lets you write Svelte in Markdown files. No CMS dependency. But loses non-developer content editing. |
| Web3Forms | Formspree | If you need more integrations (Slack, Google Sheets, Zapier). Formspree has better ecosystem but lower free tier (50/month vs 250/month). |
| @sveltejs/enhanced-img | Contentful Image API | For CMS-hosted images. Contentful's Image API supports transforms via URL params (?w=800&fm=webp). Use enhanced-img for local assets, Contentful Image API for CMS assets. |
| svelte-inview | GSAP | If animations need complex timelines, scroll-scrubbing, or physics. GSAP is overkill for fade-in-on-scroll. Reserve for future enhancement if needed. |
| GitHub Pages | Cloudflare Pages | If you need server-side features later (redirects, functions). Cloudflare Pages has a generous free tier and faster global CDN. GitHub Pages chosen per client constraint. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Svelte stores (writable/readable) | Deprecated pattern in Svelte 5. Still works but runes ($state, $derived) are the standard going forward. Mixing both creates confusion. | Svelte 5 runes ($state, $derived, $effect) |
| tailwindcss v3 / PostCSS config | v4 is current stable. v3 setup requires postcss.config.js + autoprefixer -- unnecessary complexity with v4's Vite plugin. | @tailwindcss/vite plugin (v4) |
| tailwind.config.js | Tailwind v4 is CSS-first. Configuration goes in your CSS file with @theme, not a JS config. The JS config is a v3 pattern. | @theme directive in app.css |
| GSAP (for this project) | Adds 25KB+ for animations that Svelte's built-in transitions handle natively. fade, fly, scale transitions + svelte-inview cover all "subtle fade-in" needs. Overkill for the stated design direction. | svelte/transition (built-in) + svelte-inview |
| svelte-motion | Framer Motion port for Svelte. Hasn't kept pace with Svelte 5. Built-in transitions are more idiomatic and zero-dependency. | svelte/transition (built-in) |
| SPA mode / fallback: '200.html' | GitHub Pages doesn't support SPA routing properly. Fully prerendered static pages work perfectly and are better for SEO. | Full prerendering (prerender = true) |
| @sveltejs/adapter-auto | Auto-detects deployment platform. Unnecessary when we know the target is GitHub Pages. Explicit adapter-static is clearer. | @sveltejs/adapter-static |
| Heavy video players (video.js, plyr) | Vimeo/YouTube embeds handle their own players. Adding a custom player library adds bundle weight for no benefit when content is hosted externally. | Native iframe embeds (Vimeo/YouTube oEmbed) |
## Stack Patterns by Variant
- Set `paths.base` to empty string `''`
- Add CNAME file to `static/` directory
- Configure DNS to point to GitHub Pages
- Set `paths.base` to `'/repo-name'`
- Use `base` from `$app/paths` for all internal links and asset references
- This affects every `<a href>` and image `src` in the app
- Cache API responses aggressively at build time (they're static anyway)
- Consider moving to Markdown files (MDsveX) for blog content
- Keep Contentful for structured portfolio data only
- Use facade/placeholder pattern: show thumbnail + play button, load iframe on click
- This is critical for pages with many videos (advertising section with 147+ works)
- lite-youtube-embed or lite-vimeo-embed patterns work well
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| @sveltejs/kit@2.59.x | svelte@5.55.x | SvelteKit 2 requires Svelte 5. Do not mix with Svelte 4. |
| @sveltejs/adapter-static@3.x | @sveltejs/kit@2.x | Adapter version must match Kit major version era. |
| @tailwindcss/vite@4.2.x | vite@6.x | Tailwind v4 Vite plugin requires Vite 6+. SvelteKit 2 ships with Vite 6. |
| @sveltejs/enhanced-img@0.10.x | @sveltejs/kit@2.x | Experimental. Pin exact version. Check changelog before updating. |
| contentful@11.x | Node 18+ | SDK v11 dropped Node 16 support. |
## Contentful Content Model Recommendations
| Content Type | Fields | Notes |
|--------------|--------|-------|
| Project | title, slug, category, description (Rich Text), thumbnail, videoUrl, featured (boolean), sortOrder | Core portfolio item. Category enum: advertising, film-tv, ux-design, social-transmedia, publishing |
| Category | name, slug, description, sortOrder | Enables CMS-managed category ordering and descriptions |
| PressItem | title, source, url, date, excerpt, thumbnail | For the Press/News page |
| BlogPost | title, slug, body (Rich Text), publishedDate, excerpt, coverImage | For written content |
| Page | title, slug, body (Rich Text), seoDescription | For About, Resume, and other static-ish pages |
| SiteSettings | siteTitle, tagline, socialLinks, resumePdf | Global settings, fetched once |
## Sources
- [SvelteKit npm](https://www.npmjs.com/package/@sveltejs/kit) -- v2.59.0 confirmed (HIGH confidence)
- [Svelte npm](https://www.npmjs.com/package/svelte) -- v5.55.5 confirmed (HIGH confidence)
- [Tailwind CSS npm](https://www.npmjs.com/package/tailwindcss) -- v4.2.4 confirmed (HIGH confidence)
- [Tailwind CSS v4 SvelteKit guide](https://tailwindcss.com/docs/guides/sveltekit) -- official integration docs (HIGH confidence)
- [Tailwind CSS v4 announcement](https://www.infoq.com/news/2026/04/tailwind-css-4-2-webpack/) -- v4.2 features confirmed (HIGH confidence)
- [@sveltejs/adapter-static npm](https://www.npmjs.com/package/@sveltejs/adapter-static) -- v3.0.10 confirmed (HIGH confidence)
- [SvelteKit static adapter docs](https://svelte.dev/docs/kit/adapter-static) -- GitHub Pages config (HIGH confidence)
- [contentful.js GitHub](https://github.com/contentful/contentful.js/) -- v11.12.1 confirmed (HIGH confidence)
- [@contentful/rich-text-html-renderer npm](https://www.npmjs.com/package/@contentful/rich-text-html-renderer) -- v17.1.6 confirmed (HIGH confidence)
- [@sveltejs/enhanced-img npm](https://www.npmjs.com/package/@sveltejs/enhanced-img) -- v0.10.4 experimental (MEDIUM confidence -- pre-1.0)
- [Web3Forms](https://web3forms.com/platforms/svelte-contact-form) -- Svelte contact form guide (HIGH confidence)
- [svelte/transition docs](https://svelte.dev/docs/svelte/svelte-transition) -- built-in fade, fly, scale (HIGH confidence)
- [SvelteKit GitHub Pages deployment guide](https://florinasutanto.com/blog/2026/deploy-sveltekit-to-gh-pages) -- 2026 deployment walkthrough (MEDIUM confidence)
- [SvelteKit images docs](https://svelte.dev/docs/kit/images) -- enhanced-img usage (HIGH confidence)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
