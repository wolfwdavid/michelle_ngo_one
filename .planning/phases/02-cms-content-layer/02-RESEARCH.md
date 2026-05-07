# Phase 2: CMS & Content Layer - Research

**Researched:** 2026-05-07
**Domain:** Contentful CMS integration, Image optimization, SEO meta tags, Webhook-triggered rebuilds
**Confidence:** HIGH

## Summary

Phase 2 connects Contentful CMS to the existing SvelteKit static site. The core work involves: (1) defining content types in Contentful matching the decided-upon separate-type-per-category model, (2) creating a Contentful SDK client and SvelteKit load functions that fetch content at build time, (3) implementing responsive image optimization via Contentful's Image API URL parameters, (4) adding per-page SEO meta tags and Open Graph data via `<svelte:head>`, and (5) configuring a Contentful webhook to trigger GitHub Actions `repository_dispatch` for automatic rebuilds on content publish.

The Contentful JS SDK (v11.12.1) is stable and well-documented. The Image API is CDN-based with URL parameter transforms -- no build-time processing needed. The webhook-to-GitHub-Actions pipeline is a well-established pattern using `repository_dispatch`. Rich Text rendering is only needed for blog posts (D-04), using `@contentful/rich-text-html-renderer`. SEO is straightforward with `<svelte:head>` -- no external library needed for the scope of a portfolio site.

**Primary recommendation:** Use the Contentful Delivery SDK in SvelteKit `+page.js` load functions (runs at build time via prerendering), Contentful Image API for all CMS image optimization, native `<svelte:head>` for SEO (no library), and a `repository_dispatch` webhook for automated rebuilds.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Separate content type per category -- dedicated Contentful content types for each portfolio category (AdvertisingProject, FilmProject, UXDesignProject, SocialTransmediaProject, PublishingProject, CopywritingProject). Each gets category-specific fields.
- **D-02:** Plain text for project descriptions + separate image/media fields. No Rich Text on project entries.
- **D-03:** Boolean 'featured' field on each project type for homepage selection.
- **D-04:** Rich Text for blog posts only. Requires `@contentful/rich-text-html-renderer`.
- **D-05:** Press items: Title + source + URL + date. Minimal -- no excerpt or thumbnail.
- **D-06:** SiteSettings singleton for global data (site title, tagline, social URLs, resume PDF asset).
- **D-07:** Resume: PDF upload + structured fields (experience, education, skills).
- **D-08:** Contentful Image API for all CMS images. Transform via URL params.
- **D-09:** 4 responsive image sizes for srcset: 320w, 640w, 960w, 1280w.
- **D-10:** Intersection Observer (svelte-inview) for lazy loading with fade-in.
- **D-11:** Contentful webhook to GitHub repository_dispatch for automated rebuilds.
- **D-12:** Publish-only webhook trigger (not drafts).
- **D-13:** Environment variables + .env.example for Contentful API keys.
- **D-14:** Claude's Discretion on SEO scope.
- **D-15:** Use project thumbnail as Open Graph image.

### Claude's Discretion
- SEO implementation depth (D-14) -- Claude picks what's practical
- Specific Contentful field names and validation rules per content type
- TypeScript types for Contentful content models
- Contentful SDK client setup pattern (singleton, per-request, etc.)
- Error handling for missing CMS content (fallback UI)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CMS-01 | Contentful headless CMS integration -- all projects, press, blog posts, and resume managed via Contentful | Contentful SDK v11.12.1 client setup, load functions in +page.js for build-time fetching, TypeScript content types |
| CMS-02 | Content model supports: Projects (with category, video URLs, case study fields), Press Items, Blog Posts, Resume, Site Settings | D-01 through D-07 define exact content model; separate content types per category; Rich Text only for blog |
| CMS-03 | Contentful webhook triggers GitHub Actions rebuild for automated content updates | repository_dispatch pattern with webhook URL, PAT auth, publish-only triggers |
| TECH-05 | SEO fundamentals -- meta tags, Open Graph, structured data (Person schema) | Native `<svelte:head>` for title/description/OG; Person JSON-LD schema; project thumbnail as OG image |
| TECH-06 | Image optimization (WebP/AVIF, responsive srcset, lazy loading) | Contentful Image API URL params (?fm=webp&q=80&w=X); 4-size srcset; svelte-inview for lazy load |

</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Framework:** SvelteKit with Svelte 5 runes (no stores)
- **Styling:** Tailwind CSS v4 (CSS-first, no JS config)
- **Build:** Static prerendering via adapter-static for GitHub Pages
- **Base path:** `/michelle_ngo_one` -- all internal links use `base` from `$app/paths`
- **Avoid:** Svelte stores, Tailwind v3 patterns, GSAP, adapter-auto, SPA mode, heavy video players
- **CMS:** Contentful (client requirement)
- **Hosting:** GitHub Pages (client requirement)

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| contentful | 11.12.1 | Contentful Delivery SDK | Official JS SDK. Fetches published content. TypeScript support. Used in load functions during prerendering. |
| @contentful/rich-text-html-renderer | 17.2.2 | Rich Text to HTML | Official renderer for Contentful Rich Text fields. Only needed for blog posts (D-04). |
| @contentful/rich-text-types | 17.2.7 | Rich Text TypeScript types | Type-safe node/mark constants (BLOCKS, MARKS, INLINES). Required for custom renderers. |
| svelte-inview | 4.0.4 | Intersection Observer | Already specified in project stack. Scroll-triggered lazy loading + fade-in animations for images. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none additional) | -- | -- | SEO handled by native `<svelte:head>`. Image optimization handled by Contentful Image API URL params. No additional libraries needed. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `<svelte:head>` | svelte-meta-tags (v4.7.0) | Library adds convenience for complex multi-tag scenarios but is overkill for a portfolio site. Native approach keeps zero dependencies and full control. |
| Contentful Image API | @sveltejs/enhanced-img | enhanced-img is for local/static images only. Cannot process Contentful-hosted images. Use enhanced-img for any local assets (hero backgrounds, UI images). |

**Installation:**
```bash
npm install contentful @contentful/rich-text-html-renderer @contentful/rich-text-types
```

Note: `svelte-inview` is already specified in the project stack but may not be installed yet. If missing: `npm install svelte-inview`

## Architecture Patterns

### Recommended Project Structure
```
src/
  lib/
    contentful/
      client.ts           # Contentful SDK singleton client
      types.ts            # TypeScript interfaces for all content types
      queries.ts          # Reusable fetch functions per content type
      image.ts            # Image URL helper (srcset generation)
    components/
      SEO.svelte          # Reusable SEO/OG meta component
      ContentfulImage.svelte  # Responsive image component with lazy loading
      RichText.svelte     # Rich Text renderer wrapper (blog only)
  routes/
    +layout.svelte        # Existing -- add SEO component with defaults
    +layout.js            # Existing -- add SiteSettings load
    +page.svelte          # Homepage -- uses featured projects
    advertising/
      +page.js            # Load AdvertisingProject entries
      +page.svelte        # Render project grid
    (same pattern for film-tv, ux-design, social-transmedia, publishing)
    blog/
      +page.js            # Load BlogPost entries
      +page.svelte        # Blog listing
      [slug]/
        +page.js          # Load single BlogPost by slug
        +page.svelte      # Render with Rich Text
    press/
      +page.js            # Load PressItem entries
    resume/
      +page.js            # Load Resume content
    about/
      +page.js            # Load Page content for "about"
```

### Pattern 1: Contentful Client Singleton
**What:** Single Contentful client instance shared across all load functions.
**When to use:** Always. Client is stateless and reusable.
**Example:**
```typescript
// src/lib/contentful/client.ts
import { createClient } from 'contentful';
import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';

export const contentfulClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});
```

### Pattern 2: Build-Time Data Fetching in Load Functions
**What:** Fetch CMS data in `+page.js` (or `+page.server.js`) load functions. Since `prerender = true`, these run once at build time.
**When to use:** Every route that needs CMS content.
**Example:**
```typescript
// src/routes/advertising/+page.server.ts
import { contentfulClient } from '$lib/contentful/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const entries = await contentfulClient.getEntries({
    content_type: 'advertisingProject',
    order: ['fields.sortOrder'],
  });

  return {
    projects: entries.items.map((item) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      thumbnail: item.fields.thumbnail?.fields?.file?.url,
      videoUrl: item.fields.videoUrl,
      featured: item.fields.featured,
      // ... other fields
    })),
  };
};
```

**IMPORTANT:** Use `+page.server.ts` (not `+page.ts`) because `$env/static/private` is only available in server-side modules. With `prerender = true`, server load functions still run at build time but keep secrets out of the client bundle.

### Pattern 3: Contentful Image URL Helper
**What:** Generate responsive srcset URLs from Contentful image base URLs.
**When to use:** Every CMS-hosted image.
**Example:**
```typescript
// src/lib/contentful/image.ts
const WIDTHS = [320, 640, 960, 1280];

export function contentfulSrcset(baseUrl: string, format: 'webp' | 'avif' = 'webp', quality = 80): string {
  return WIDTHS
    .map((w) => `https:${baseUrl}?w=${w}&fm=${format}&q=${quality} ${w}w`)
    .join(', ');
}

export function contentfulSrc(baseUrl: string, width = 960, format: 'webp' | 'avif' = 'webp', quality = 80): string {
  return `https:${baseUrl}?w=${width}&fm=${format}&q=${quality}`;
}
```

### Pattern 4: SEO Component with svelte:head
**What:** Reusable component that renders `<title>`, `<meta>` description, Open Graph tags, and optional JSON-LD.
**When to use:** Every page via layout or per-page override.
**Example:**
```svelte
<!-- src/lib/components/SEO.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import { base } from '$app/paths';

  let {
    title = 'Michelle Ngo',
    description = 'Multi-disciplinary creative: producer, filmmaker, copywriter, UX designer.',
    image = '',
    type = 'website',
  } = $props();

  const siteUrl = 'https://wolfwdavid.github.io/michelle_ngo_one';
  const canonicalUrl = `${siteUrl}${page.url.pathname}`;
  const ogImage = image ? `https:${image}?w=1200&fm=jpg&q=80` : '';
</script>

<svelte:head>
  <title>{title} | Michelle Ngo</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content={type} />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
  {/if}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if ogImage}
    <meta name="twitter:image" content={ogImage} />
  {/if}
</svelte:head>
```

### Pattern 5: Global SiteSettings via Layout Load
**What:** Fetch SiteSettings singleton in root layout load, making it available to all pages.
**When to use:** Once, in `+layout.server.ts`.
**Example:**
```typescript
// src/routes/+layout.server.ts
import { contentfulClient } from '$lib/contentful/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const settings = await contentfulClient.getEntries({
    content_type: 'siteSettings',
    limit: 1,
  });

  const fields = settings.items[0]?.fields;

  return {
    siteSettings: {
      siteTitle: fields?.siteTitle ?? 'Michelle Ngo',
      tagline: fields?.tagline ?? '',
      socialLinks: {
        imdb: fields?.imdbUrl ?? '',
        linkedin: fields?.linkedinUrl ?? '',
        vimeo: fields?.vimeoUrl ?? '',
        youtube: fields?.youtubeUrl ?? '',
      },
      resumePdf: fields?.resumePdf?.fields?.file?.url ?? null,
    },
  };
};
```

**Note:** When adding `+layout.server.ts`, the existing `+layout.js` (with `prerender` and `trailingSlash` exports) must remain. SvelteKit merges data from both. The `+layout.js` file handles config exports; `+layout.server.ts` handles data loading.

### Anti-Patterns to Avoid
- **Fetching Contentful in components:** All CMS data must come through load functions, not component-level fetches. Prerendering requires data to be available during SSR.
- **Using `$env/static/private` in `+page.ts`:** Private env vars are only available in server modules (`+page.server.ts`, `+layout.server.ts`). Using `+page.ts` with private env will fail at build time.
- **Hardcoding Contentful asset URLs:** Always use the Image API helper to generate optimized URLs. Raw URLs serve original (often oversized) images.
- **Storing API keys in code or `.env` committed to git:** Use `.env` locally (gitignored) and GitHub Secrets for CI.
- **Using `contentful-management` SDK:** That's for writing content. Use `contentful` (Delivery SDK) for reading published content.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich Text rendering | Custom AST walker | `@contentful/rich-text-html-renderer` with `documentToHtmlString()` | Rich Text AST has 15+ node types including embedded entries/assets. The official renderer handles all of them correctly. |
| Responsive image srcset | Manual URL string building per-image | Shared `contentfulSrcset()` helper function | Centralizes width breakpoints, format, and quality. One change updates all images. |
| SEO meta tags | Per-page `<svelte:head>` blocks with duplicated tags | Shared `SEO.svelte` component | Ensures consistent OG tags, canonical URLs, Twitter cards across all pages. Single source of truth for defaults. |
| Contentful type definitions | Manual interfaces matching CMS fields | Generated TypeScript types from content model | Use `contentful-typescript-codegen` or manually define interfaces that mirror Contentful field structure. Keeps types in sync with CMS. |

## Common Pitfalls

### Pitfall 1: +page.ts vs +page.server.ts for Private Env Vars
**What goes wrong:** Using `$env/static/private` in `+page.ts` causes build failure because `+page.ts` runs on both server and client.
**Why it happens:** SvelteKit enforces that private env vars cannot leak to client bundles.
**How to avoid:** Always use `+page.server.ts` for load functions that access Contentful credentials.
**Warning signs:** Build error mentioning "Cannot import $env/static/private into client-side code."

### Pitfall 2: Missing https: Protocol on Contentful Asset URLs
**What goes wrong:** Contentful returns asset URLs as `//images.ctfassets.net/...` (protocol-relative). Using these directly in `<img src>` or `<meta property="og:image">` can fail in some contexts.
**Why it happens:** Contentful SDK returns URLs without protocol prefix.
**How to avoid:** Always prepend `https:` to asset URLs: `` `https:${asset.fields.file.url}` ``
**Warning signs:** Broken images in local dev (file:// protocol), OG images not showing on social media.

### Pitfall 3: Contentful Rate Limits During Build
**What goes wrong:** Build fails with 429 errors when fetching many entries.
**Why it happens:** Contentful free tier has rate limits (78 requests/second for CDA). A site with many categories and pages can hit this during parallel prerendering.
**How to avoid:** Use `include` parameter to resolve linked entries in a single request. Fetch all projects per content type in one `getEntries()` call (max 1000 per request), not one per project.
**Warning signs:** Intermittent build failures, 429 status codes in build logs.

### Pitfall 4: Layout Load + Page Load Data Merging
**What goes wrong:** Page load function data doesn't include layout load data, or vice versa.
**Why it happens:** Misunderstanding SvelteKit's data loading hierarchy. Layout data and page data are separate but both available via `$page.data` or component `data` prop.
**How to avoid:** Understand that `+layout.server.ts` data is available in all child routes. Access it in components via `data` from the page's load function. In `+layout.svelte`, use `let { data, children } = $props()`.
**Warning signs:** `undefined` when accessing siteSettings in page components.

### Pitfall 5: Forgetting to Add Contentful Env Vars to GitHub Actions
**What goes wrong:** Build succeeds locally but fails in CI. Site deploys with no content.
**Why it happens:** `.env` is gitignored. CI environment doesn't have Contentful credentials.
**How to avoid:** Add `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` as GitHub repository secrets. Reference them in the deploy workflow as environment variables.
**Warning signs:** Empty pages on deployed site, build logs showing "missing environment variable."

### Pitfall 6: Webhook Auth Token Exposure
**What goes wrong:** GitHub Personal Access Token used in Contentful webhook is compromised.
**Why it happens:** PAT has broad repo scope.
**How to avoid:** Use a fine-grained PAT scoped to only the target repository with Contents: write permission. This is the minimum needed for `repository_dispatch`.
**Warning signs:** N/A -- preventive measure.

### Pitfall 7: AVIF Size Limitation
**What goes wrong:** Contentful Image API returns error or original format instead of AVIF.
**Why it happens:** AVIF conversion is limited to source images under 9 megapixels.
**How to avoid:** Use WebP as primary format (`fm=webp`). AVIF as progressive enhancement via `<picture>` element's `<source>` tag -- browser falls back to WebP if AVIF fails.
**Warning signs:** Large images not converting to AVIF format.

## Code Examples

### Contentful Client Setup
```typescript
// src/lib/contentful/client.ts
import { createClient, type EntryCollection } from 'contentful';
import {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN,
} from '$env/static/private';

export const contentfulClient = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});
```

### TypeScript Content Types (Manual Definition)
```typescript
// src/lib/contentful/types.ts
import type { Asset, Entry, EntryFields } from 'contentful';

// Base project fields shared across categories
interface BaseProjectFields {
  title: EntryFields.Text;
  slug: EntryFields.Text;
  description: EntryFields.Text; // Plain text per D-02
  thumbnail: Asset;
  videoUrl?: EntryFields.Text;
  featured: EntryFields.Boolean;
  sortOrder: EntryFields.Integer;
}

// Category-specific project types
export interface AdvertisingProjectFields extends BaseProjectFields {
  client?: EntryFields.Text;
  agency?: EntryFields.Text;
  role?: EntryFields.Text;
}

export interface FilmProjectFields extends BaseProjectFields {
  year?: EntryFields.Integer;
  role?: EntryFields.Text;
  productionType?: EntryFields.Text; // e.g., "Feature", "Short", "Documentary"
}

// ... similar for UXDesign, SocialTransmedia, Publishing, Copywriting

export interface PressItemFields {
  title: EntryFields.Text;
  source: EntryFields.Text;
  url: EntryFields.Text;
  date: EntryFields.Date;
}

export interface BlogPostFields {
  title: EntryFields.Text;
  slug: EntryFields.Text;
  body: EntryFields.RichText; // Only content type using Rich Text (D-04)
  publishedDate: EntryFields.Date;
  excerpt: EntryFields.Text;
  coverImage?: Asset;
}

export interface SiteSettingsFields {
  siteTitle: EntryFields.Text;
  tagline: EntryFields.Text;
  imdbUrl?: EntryFields.Text;
  linkedinUrl?: EntryFields.Text;
  vimeoUrl?: EntryFields.Text;
  youtubeUrl?: EntryFields.Text;
  resumePdf?: Asset;
}

export interface ResumeFields {
  resumePdf: Asset;
  experience: EntryFields.Object; // JSON array of experience entries
  education: EntryFields.Object;  // JSON array of education entries
  skills: EntryFields.Object;     // JSON array or structured skills
}

// Typed entry aliases
export type AdvertisingProject = Entry<AdvertisingProjectFields>;
export type PressItem = Entry<PressItemFields>;
export type BlogPost = Entry<BlogPostFields>;
export type SiteSettings = Entry<SiteSettingsFields>;
```

### Rich Text Rendering (Blog Only)
```typescript
// src/lib/contentful/richtext.ts
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target.fields;
      const url = file.url;
      return `<img src="https:${url}?w=960&fm=webp&q=80" alt="${title || ''}" loading="lazy" />`;
    },
  },
};

export function renderRichText(document: Document): string {
  return documentToHtmlString(document, renderOptions);
}
```

### ContentfulImage Component
```svelte
<!-- src/lib/components/ContentfulImage.svelte -->
<script lang="ts">
  import { contentfulSrcset, contentfulSrc } from '$lib/contentful/image';

  let {
    url,
    alt = '',
    sizes = '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw',
    class: className = '',
    loading = 'lazy' as 'lazy' | 'eager',
  } = $props();
</script>

<picture>
  <source
    srcset={contentfulSrcset(url, 'avif')}
    {sizes}
    type="image/avif"
  />
  <source
    srcset={contentfulSrcset(url, 'webp')}
    {sizes}
    type="image/webp"
  />
  <img
    src={contentfulSrc(url)}
    srcset={contentfulSrcset(url, 'webp')}
    {sizes}
    {alt}
    {loading}
    class={className}
  />
</picture>
```

### GitHub Actions Webhook Trigger Addition
```yaml
# Addition to .github/workflows/deploy.yml
on:
  push:
    branches: ['main']
  repository_dispatch:
    types: [contentful-publish]
  workflow_dispatch:

# Add env vars to build step:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ... existing steps ...
      - name: Build
        run: npm run build
        env:
          CONTENTFUL_SPACE_ID: ${{ secrets.CONTENTFUL_SPACE_ID }}
          CONTENTFUL_ACCESS_TOKEN: ${{ secrets.CONTENTFUL_ACCESS_TOKEN }}
```

### Contentful Webhook Configuration
```
URL: https://api.github.com/repos/{owner}/{repo}/dispatches
Method: POST
Headers:
  Accept: application/vnd.github.v3+json
  Authorization: Bearer {GITHUB_FINE_GRAINED_PAT}
  Content-Type: application/json
Body:
  {"event_type": "contentful-publish"}
Triggers: Entry - Publish only
```

### Person JSON-LD Schema
```svelte
<!-- In SEO.svelte or about page -->
<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Michelle Ngo",
    "url": "https://wolfwdavid.github.io/michelle_ngo_one/",
    "jobTitle": "Producer, Filmmaker, Copywriter, UX Designer",
    "sameAs": [
      "https://www.imdb.com/name/PLACEHOLDER/",
      "https://www.linkedin.com/in/PLACEHOLDER/",
      "https://vimeo.com/user2149742"
    ]
  })}</script>`}
</svelte:head>
```

### .env.example
```bash
# Contentful Delivery API
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_access_token_here
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentful SDK v10 (callback-based) | SDK v11 (Promise-based, TypeScript) | 2024 | Cleaner async/await in load functions |
| Classic PAT (repo scope) | Fine-grained PAT (scoped permissions) | 2023 | Webhook auth token has minimal scope -- Contents:write only |
| `+page.ts` for all loads | `+page.server.ts` for private env | SvelteKit 1.x+ | Prevents env var leakage to client bundle |
| Tailwind purge config | Tailwind v4 automatic tree-shaking | 2025 | No manual purge configuration needed |
| `$page.data` store access | `$props()` data access in Svelte 5 | 2024 | Load function data accessed via `let { data } = $props()` in page components |
| `page` store from `$app/stores` | `page` from `$app/state` | Svelte 5 / SvelteKit 2 | Use `import { page } from '$app/state'` not `$app/stores` |

## SEO Recommendation (D-14: Claude's Discretion)

For a portfolio site, the practical SEO scope is:

1. **Per-page `<title>` and `<meta description>`** -- essential, sourced from CMS
2. **Open Graph tags** (og:title, og:description, og:image, og:url, og:type) -- essential for social sharing. Use project thumbnail as og:image (D-15)
3. **Twitter Card tags** (summary_large_image) -- mirrors OG data, minimal extra effort
4. **Canonical URLs** -- prevents duplicate content issues with trailing slashes
5. **Person JSON-LD** on the About page -- gives search engines structured data about Michelle. Straightforward to implement.

**Not recommended for v1:** Sitemap.xml generation (low ROI for a small static site), complex breadcrumb schema, article schema for blog posts (save for v2 if blog grows).

## Open Questions

1. **Contentful Space Setup**
   - What we know: Free tier supports 1 space, 25K records, 1M API calls/month
   - What's unclear: Whether the Contentful space is already created or needs to be set up from scratch
   - Recommendation: Plan should include content model creation steps (can be done via Contentful web UI or migration scripts)

2. **Content Migration Volume**
   - What we know: 147 videos on Vimeo, multiple portfolio categories
   - What's unclear: How many total entries need to be created in Contentful initially
   - Recommendation: Phase 2 should set up the infrastructure. Actual content population could be a separate effort or included as a final task.

3. **Resume Structured Fields**
   - What we know: D-07 specifies structured fields for experience, education, skills
   - What's unclear: Exact field structure (JSON object fields? Linked entries?)
   - Recommendation: Use JSON Object fields in Contentful for experience/education/skills arrays. Simpler than linked entries for a single resume page.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build + SDK | Yes | 22.13.0 | -- |
| npm | Package install | Yes | 10.9.2 | -- |
| Contentful SDK | CMS integration | Not installed | 11.12.1 (registry) | -- (must install) |
| Rich Text Renderer | Blog posts | Not installed | 17.2.2 (registry) | -- (must install) |
| svelte-inview | Lazy loading | Not installed | 4.0.4 (registry) | -- (must install) |
| GitHub Actions | CI/CD | Yes (existing workflow) | -- | -- |
| Contentful Space | CMS | Unknown | -- | Must be created if not exists |

**Missing dependencies with no fallback:**
- npm packages (contentful, rich-text-renderer, svelte-inview) must be installed
- Contentful space must exist with API credentials

**Missing dependencies with fallback:**
- None

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (4.1.5 available on registry, not yet installed) |
| Config file | None -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CMS-01 | Contentful client connects and fetches entries | unit (mock SDK) | `npx vitest run tests/contentful/client.test.ts -t "fetches entries"` | No -- Wave 0 |
| CMS-02 | Content type queries return correctly shaped data | unit (mock SDK) | `npx vitest run tests/contentful/queries.test.ts` | No -- Wave 0 |
| CMS-03 | Deploy workflow includes repository_dispatch trigger | smoke (YAML parse) | `npx vitest run tests/deploy-workflow.test.ts` | No -- Wave 0 |
| TECH-05 | SEO component renders correct meta tags | unit (component) | `npx vitest run tests/components/seo.test.ts` | No -- Wave 0 |
| TECH-06 | Image helper generates correct srcset URLs | unit | `npx vitest run tests/contentful/image.test.ts` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Install vitest: `npm install -D vitest`
- [ ] `vitest.config.ts` -- Vitest configuration for SvelteKit
- [ ] `tests/contentful/client.test.ts` -- Contentful client mock tests
- [ ] `tests/contentful/queries.test.ts` -- Content type query shape tests
- [ ] `tests/contentful/image.test.ts` -- Image URL helper unit tests
- [ ] `tests/components/seo.test.ts` -- SEO component meta tag rendering
- [ ] `tests/deploy-workflow.test.ts` -- Verify YAML has repository_dispatch

## Sources

### Primary (HIGH confidence)
- [Contentful Images API official docs](https://www.contentful.com/developers/docs/references/images-api/) -- URL params: fm, q, w, h, fit, focus, r, bg; AVIF limit 9MP; max 4000px
- [Contentful blog: Static builds with GitHub Actions](https://www.contentful.com/blog/running-static-site-builds-with-github-actions-and-contentful/) -- repository_dispatch webhook pattern, headers, payload format
- [@contentful/rich-text-html-renderer npm](https://www.npmjs.com/package/@contentful/rich-text-html-renderer) -- documentToHtmlString API, custom renderNode/renderMark options
- [GitHub Docs: Fine-grained PAT permissions](https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens) -- Contents:write required for repository_dispatch
- npm registry -- verified versions: contentful@11.12.1, @contentful/rich-text-html-renderer@17.2.2, @contentful/rich-text-types@17.2.7, svelte-inview@4.0.4, vitest@4.1.5

### Secondary (MEDIUM confidence)
- [Contentful blog: WebP, source sets, Images API](https://www.contentful.com/blog/always-look-your-best-webp-source-sets-and-the-contentful-images-api/) -- srcset pattern with Contentful Image API
- [SvelteKit SEO patterns](https://maier.tech/posts/how-to-add-a-basic-seo-component-to-sveltekit) -- svelte:head SEO component pattern
- [Elio Struyf: Fine-grained PAT dispatch](https://www.eliostruyf.com/dispatch-github-action-fine-grained-personal-access-token/) -- Fine-grained PAT for repository_dispatch

### Tertiary (LOW confidence)
- None -- all findings verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified on npm registry with current versions
- Architecture: HIGH -- patterns follow SvelteKit documentation and Contentful official guides
- Pitfalls: HIGH -- documented from official SvelteKit and Contentful sources, cross-verified
- SEO: HIGH -- native `<svelte:head>` is documented SvelteKit pattern; OG tags are standard HTML
- Webhook: HIGH -- repository_dispatch is documented GitHub API; Contentful webhook setup is official

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (stable ecosystem, 30-day validity)
