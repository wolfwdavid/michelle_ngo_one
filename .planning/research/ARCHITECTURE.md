# Architecture Research

**Domain:** Creative portfolio / filmmaker website (static)
**Researched:** 2026-05-07
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
BUILD TIME (Node.js)                          RUNTIME (Browser)
============================                  ============================

  Contentful CDA                                GitHub Pages CDN
  (Content Delivery API)                        (Static HTML/CSS/JS)
        |                                             |
        v                                             v
  +-----------------+                           +-----------+
  | SvelteKit Build |                           |  Visitor   |
  | (SSG via        |  -----> /build/ ------>   |  Browser   |
  |  adapter-static)|                           +-----------+
  +-----------------+                                 |
        |                                             v
        v                                       Vimeo / YouTube
  +page.ts loaders                              (embedded iframes)
  fetch all content
  at build time
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| SvelteKit (adapter-static) | Route generation, page prerendering, client-side navigation | File-based routing, all pages prerendered at build time |
| Contentful CDA | Content storage and delivery (projects, blog posts, press items) | REST API via `contentful` JS SDK, called in `+page.ts` load functions |
| GitHub Pages | Static file hosting, CDN delivery | GitHub Actions workflow builds and deploys on push |
| Vimeo/YouTube embeds | Video playback for featured work | Lite-embed or iframe with lazy loading |
| Contact form | Visitor outreach | Third-party service (Formspree/Getform) since no server at runtime |

## Recommended Project Structure

```
src/
├── routes/                     # File-based routing (pages)
│   ├── +layout.svelte          # Global shell: nav, footer, transitions
│   ├── +layout.ts              # Global data: site metadata from Contentful
│   ├── +page.svelte            # Homepage: hero, featured work grid
│   ├── +page.ts                # Homepage data loader
│   ├── advertising/
│   │   ├── +page.svelte        # Advertising portfolio grid
│   │   └── +page.ts            # Fetch advertising projects
│   ├── film-tv/
│   │   ├── +page.svelte        # Film/TV portfolio grid
│   │   ├── +page.ts            # Fetch film/TV projects
│   │   └── [slug]/
│   │       ├── +page.svelte    # Individual project detail
│   │       └── +page.ts        # Fetch single project by slug
│   ├── ux-design/
│   │   ├── +page.svelte        # UX Design portfolio grid
│   │   └── +page.ts
│   ├── social-transmedia/
│   │   ├── +page.svelte        # Social & Transmedia grid
│   │   └── +page.ts
│   ├── publishing/
│   │   ├── +page.svelte        # Publishing portfolio grid
│   │   └── +page.ts
│   ├── about/
│   │   ├── +page.svelte        # Bio, photo, social links
│   │   └── +page.ts
│   ├── press/
│   │   ├── +page.svelte        # Press mentions, articles list
│   │   └── +page.ts
│   ├── blog/
│   │   ├── +page.svelte        # Blog listing
│   │   ├── +page.ts
│   │   └── [slug]/
│   │       ├── +page.svelte    # Individual blog post
│   │       └── +page.ts
│   ├── resume/
│   │   ├── +page.svelte        # CV display + download link
│   │   └── +page.ts
│   └── contact/
│       └── +page.svelte        # Contact form (client-side only)
├── lib/
│   ├── contentful/
│   │   ├── client.ts           # Contentful SDK client singleton
│   │   ├── queries.ts          # All content-fetching functions
│   │   └── types.ts            # TypeScript interfaces for content types
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.svelte      # Top navigation bar
│   │   │   ├── Footer.svelte   # Footer with social links
│   │   │   └── PageTransition.svelte  # Fade-in route transitions
│   │   ├── portfolio/
│   │   │   ├── ProjectGrid.svelte     # Reusable grid of project cards
│   │   │   ├── ProjectCard.svelte     # Single project thumbnail + title
│   │   │   └── ProjectDetail.svelte   # Full project view with media
│   │   ├── media/
│   │   │   ├── VideoEmbed.svelte      # Vimeo/YouTube embed wrapper
│   │   │   ├── VideoThumbnail.svelte  # Clickable thumbnail linking out
│   │   │   └── ImageGallery.svelte    # Responsive image grid
│   │   ├── blog/
│   │   │   ├── BlogCard.svelte        # Blog post preview card
│   │   │   └── RichText.svelte        # Contentful rich text renderer
│   │   ├── press/
│   │   │   └── PressItem.svelte       # Single press mention entry
│   │   └── ui/
│   │       ├── FadeIn.svelte          # Intersection observer fade-in
│   │       └── ContactForm.svelte     # Form with validation
│   └── utils/
│       ├── constants.ts        # Site-wide constants (social URLs, etc.)
│       └── richtext.ts         # Contentful rich text to HTML helpers
├── app.html                    # HTML shell
└── app.css                     # Global styles (minimal reset, typography)
static/
├── .nojekyll                   # Required: prevents GitHub Pages Jekyll processing
├── favicon.ico
├── resume.pdf                  # Downloadable CV
└── images/                     # Local fallback images (logo, etc.)
svelte.config.js                # adapter-static config with paths.base
```

### Structure Rationale

- **routes/:** One folder per portfolio section maps directly to site navigation. Each section is independent so they can be built/tested in isolation. Dynamic `[slug]` routes enable individual project pages for Film/TV and blog posts.
- **lib/contentful/:** Single place for all CMS interaction. The `client.ts` singleton prevents multiple SDK instances. `queries.ts` centralizes all fetch logic so routes stay thin.
- **lib/components/:** Grouped by domain (portfolio, media, blog, press, ui) not by type. Keeps related components together. The `ui/` folder holds truly generic pieces.
- **static/.nojekyll:** Required for GitHub Pages to serve SvelteKit output correctly.

## Architectural Patterns

### Pattern 1: Build-Time Data Fetching (Jamstack)

**What:** All Contentful data is fetched at build time in `+page.ts` load functions. The deployed site is pure static HTML/CSS/JS with zero runtime API calls.
**When to use:** Always -- this is the core architecture. GitHub Pages cannot run server-side code.
**Trade-offs:** Content updates require a rebuild and redeploy. But for a portfolio that changes infrequently, this is ideal. Webhook-triggered rebuilds via GitHub Actions can automate this.

**Example:**
```typescript
// src/routes/film-tv/+page.ts
import { getProjectsByCategory } from '$lib/contentful/queries';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => {
  const projects = await getProjectsByCategory('film-tv');
  return { projects };
};
```

### Pattern 2: Contentful Client Singleton

**What:** One shared Contentful client instance created at module scope, imported wherever needed.
**When to use:** Always -- avoids creating new SDK instances per request during build.
**Trade-offs:** Simple and effective. No connection pooling needed since it is build-time only.

**Example:**
```typescript
// src/lib/contentful/client.ts
import contentful from 'contentful';

export const client = contentful.createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});
```

### Pattern 3: Component Composition for Portfolio Grids

**What:** A generic `ProjectGrid` component accepts an array of projects and renders `ProjectCard` components. Each section page (advertising, film-tv, etc.) uses the same grid with section-specific data.
**When to use:** When multiple pages share the same visual pattern but different data.
**Trade-offs:** High reuse, consistent UI. Category-specific customization handled via props or slots rather than separate components.

## Data Flow

### Build-Time Content Flow

```
Contentful Space
    |
    | (Content Delivery API - REST)
    v
+page.ts load()          <-- runs at build time only
    |
    | (returns data object)
    v
+page.svelte              <-- receives data as props
    |
    | (renders components)
    v
ProjectGrid / BlogCard / PressItem / etc.
    |
    | (adapter-static prerenders)
    v
/build/                    <-- static HTML files
    |
    | (GitHub Actions deploys)
    v
GitHub Pages CDN           <-- served to visitors
```

### Runtime Interaction Flow (Visitor)

```
Visitor loads page
    |
    v
Static HTML served (fast, CDN-cached)
    |
    v
SvelteKit hydrates (client-side navigation enabled)
    |
    ├── Click project card --> client-side route to /film-tv/[slug]
    |   (no server round-trip, prerendered HTML loaded)
    |
    ├── Click video thumbnail --> Vimeo/YouTube embed loads (iframe)
    |   (third-party, lazy-loaded for performance)
    |
    └── Submit contact form --> POST to Formspree/Getform
        (third-party service, no backend needed)
```

### Content Update Flow

```
Michelle edits content in Contentful UI
    |
    v
Contentful webhook fires
    |
    v
GitHub Actions workflow triggered (repository_dispatch)
    |
    v
SvelteKit rebuild (npm run build)
    |
    v
New static files deployed to GitHub Pages
    |
    v
Site updated (typically 2-5 minutes end-to-end)
```

### Key Data Flows

1. **Portfolio content:** Contentful --> build-time fetch --> static HTML. Each category section queries its own content type or filters by category field.
2. **Video playback:** Static page contains embed markup --> browser loads Vimeo/YouTube iframe on demand. Featured videos embed directly; others show as clickable thumbnails linking to external player.
3. **Blog/Press rich text:** Contentful rich text field --> `@contentful/rich-text-html-renderer` transforms to HTML at build time --> rendered in RichText component.
4. **Contact form:** Visitor fills form --> client-side validation --> POST to external form service --> confirmation displayed.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (portfolio site) | Pure static, no scaling concerns. GitHub Pages handles CDN. Free tier Contentful (25K records, 2M API calls/mo) is more than sufficient. |
| High traffic event (viral post) | Static site scales infinitely on GitHub Pages CDN. No server to overload. Video load is on Vimeo/YouTube's CDN. |
| Content growth (500+ projects) | Build time increases. Consider incremental builds or splitting content fetches. Contentful free tier may need upgrade at 25K+ records. |

### Scaling Priorities

1. **First bottleneck:** Build time. If the site grows to hundreds of pages with large images, builds will slow. Mitigation: optimize images at build time (sharp/vite-imagetools), limit Contentful queries.
2. **Second bottleneck:** Contentful free tier API rate limits during build. Mitigation: cache Contentful responses during build, batch queries.

## Anti-Patterns

### Anti-Pattern 1: Client-Side Contentful Fetching

**What people do:** Call the Contentful API from the browser at runtime instead of at build time.
**Why it's wrong:** Exposes API tokens in client bundle. Adds latency on every page load. Defeats the purpose of static generation. Cannot work on GitHub Pages without CORS issues.
**Do this instead:** Fetch everything in `+page.ts` load functions. The static adapter prerenders all pages at build time.

### Anti-Pattern 2: One Giant Content Type in Contentful

**What people do:** Create a single "Project" content type with dozens of optional fields to cover advertising, film, UX, publishing, etc.
**Why it's wrong:** Contentful UI becomes unwieldy. Validation is impossible (which fields are required for which category?). Content editors make mistakes.
**Do this instead:** Use a base "Project" content type with common fields (title, slug, thumbnail, description, category) and linked content types for category-specific data (e.g., "VideoDetails" with embed URL, runtime, credits).

### Anti-Pattern 3: Skipping the .nojekyll File

**What people do:** Deploy to GitHub Pages without a `.nojekyll` file in the static directory.
**Why it's wrong:** GitHub Pages runs Jekyll by default, which ignores files/folders starting with underscore. SvelteKit generates `_app/` directory. The site breaks silently -- some assets 404.
**Do this instead:** Always include an empty `.nojekyll` file in `static/`.

### Anti-Pattern 4: Hardcoding paths.base

**What people do:** Hardcode the repo name in links and asset paths throughout components.
**Why it's wrong:** Breaks when switching between local dev (no base path) and production (repo subpath). Duplicated strings everywhere.
**Do this instead:** Configure `kit.paths.base` in `svelte.config.js`. Use `base` from `$app/paths` in components. All links and assets automatically resolve correctly in both environments.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Contentful CDA | REST API via `contentful` npm package, called at build time in load functions | Space ID + Delivery API token stored as env vars. Use `VITE_` prefix for build-time access. |
| Vimeo | iframe embed via `VideoEmbed` component | Use lite-vimeo-embed or native iframe with `loading="lazy"`. Store embed URLs in Contentful. |
| YouTube | iframe embed via `VideoEmbed` component | Use lite-youtube-embed for performance. Store video IDs in Contentful. |
| Formspree / Getform | HTML form POST to external endpoint | No backend needed. Free tier supports contact form volume. |
| GitHub Actions | CI/CD: build on push, optional webhook-triggered rebuild | Workflow: checkout --> install --> build --> deploy to gh-pages branch. |
| Contentful Webhooks | Triggers GitHub Actions `repository_dispatch` on content publish | Enables automatic rebuilds when Michelle updates content. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Routes <--> Contentful lib | Import functions from `$lib/contentful/queries.ts` | Routes never import the client directly. Queries module is the single gateway. |
| Routes <--> Components | Props and slots | Components are pure/presentational. Data fetching stays in load functions. |
| Components <--> Styles | Scoped styles within each `.svelte` file + global `app.css` | Global styles for typography/reset only. Component styles scoped by default in Svelte. |
| Static assets <--> Build | Vite processes and fingerprints assets | Images in `static/` served as-is. Images imported in components get optimized. |

## Build Order (Suggested Implementation Sequence)

Dependencies between components dictate build order:

1. **Foundation** (no dependencies)
   - SvelteKit project scaffold with adapter-static
   - Global layout shell (Nav, Footer)
   - GitHub Pages deployment pipeline (GitHub Actions)
   - Basic routing structure (empty pages)

2. **Content Layer** (depends on: Foundation)
   - Contentful space setup with content models
   - `$lib/contentful/client.ts` and `queries.ts`
   - TypeScript types for content models
   - Verify build-time fetching works end-to-end

3. **Core Portfolio Pages** (depends on: Content Layer)
   - ProjectGrid and ProjectCard components
   - Homepage with featured work
   - One portfolio section fully wired (e.g., Film/TV with [slug] detail pages)
   - Roll out remaining sections (Advertising, UX, Social, Publishing)

4. **Media Components** (depends on: Core Portfolio)
   - VideoEmbed component (Vimeo + YouTube)
   - VideoThumbnail for non-featured work
   - ImageGallery for project detail pages
   - Lazy loading and performance optimization

5. **Content Pages** (depends on: Content Layer)
   - About page
   - Press/News page with PressItem component
   - Blog with listing and [slug] detail pages
   - RichText renderer for Contentful rich text fields
   - Resume/CV page

6. **Polish** (depends on: all above)
   - Contact form with external service integration
   - FadeIn animations (intersection observer)
   - Page transitions
   - SEO metadata, Open Graph tags
   - Contentful webhook for automatic rebuilds
   - Responsive design refinement

## Sources

- [SvelteKit Static Site Generation docs](https://svelte.dev/docs/kit/adapter-static)
- [SvelteKit Project Structure docs](https://svelte.dev/docs/kit/project-structure)
- [sveltekit-gh-pages reference repo](https://github.com/metonym/sveltekit-gh-pages)
- [Contentful JavaScript SDK docs](https://www.contentful.com/developers/docs/javascript/sdks/)
- [Contentful Content Delivery API reference](https://www.contentful.com/developers/docs/references/content-delivery-api/)
- [Contentful SvelteKit Starter Guide](https://www.contentful.com/sveltekit-starter-guide/)
- [SvelteKit larger app structure discussion](https://github.com/sveltejs/kit/discussions/7579)
- [SvelteKit GitHub Pages deployment guide](https://florinasutanto.com/blog/2026/deploy-sveltekit-to-gh-pages)

---
*Architecture research for: Creative portfolio / filmmaker website (SvelteKit + Contentful + GitHub Pages)*
*Researched: 2026-05-07*
