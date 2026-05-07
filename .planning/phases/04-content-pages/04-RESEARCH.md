# Phase 4: Content Pages - Research

**Researched:** 2026-05-07
**Domain:** SvelteKit content pages, Contentful CMS rendering, Web3Forms contact integration
**Confidence:** HIGH

## Summary

Phase 4 builds 5 content pages (About, Press, Resume, Blog, Contact) on top of the existing SvelteKit + Contentful foundation from Phases 1-3. The majority of infrastructure is already in place: Contentful client, query functions, normalized types, Rich Text renderer, ContentfulImage, Breadcrumb, SEO, and VideoFacade components. The primary new work is creating page routes with server load functions, building page-specific UI components, extending the Rich Text renderer for video embeds in blog posts, adding missing Contentful query functions (Page content type for About, resume data), and integrating Web3Forms for the contact form.

The existing codebase follows consistent patterns: `+page.server.ts` with Contentful queries, Svelte 5 runes ($props, $state, $derived), Tailwind utility classes, base path prefix for links, and try/catch fallbacks for CMS data. All 5 route directories already exist with placeholder `+page.svelte` files. Blog needs a `[slug]` dynamic route with `entries()` export for prerendering (same pattern as portfolio detail pages).

**Primary recommendation:** Follow the established Phase 3 patterns exactly -- server load functions fetch CMS data, page components consume normalized types, reuse existing components (RichText, ContentfulImage, Breadcrumb, SEO, VideoFacade). The only genuinely new integration is Web3Forms (client-side fetch POST).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: About page split layout -- photo left (40%), bio right (60%). Mobile: photo stacks above bio.
- D-02: About bio sourced from Contentful `Page` content type (Rich Text body).
- D-03: Discipline cards link to category pages using CATEGORIES config from Phase 3.
- D-04: Blog index card grid -- 3-col desktop, 2-col tablet, 1-col mobile.
- D-05: No blog categories or tags. Flat chronological list.
- D-06: Blog posts support embedded video via custom Rich Text renderer node using VideoFacade.
- D-07: Blog post pages at `/blog/{slug}` with Rich Text body via RichText.svelte.
- D-08: Web3Forms for contact form submission.
- D-09: Minimal contact fields -- name, email, message only.
- D-10: Claude's Discretion on success/error state UI (inline, not redirect).
- D-11: Press page chronological feed using PressItem type. External links open in new tab.
- D-12: Claude's Discretion on press page layout.
- D-13: Resume sectioned cards layout with PDF download button at top.
- D-14: Structured Contentful fields for resume data (per Phase 2 D-07).
- D-15: Claude's Discretion on skills display format.

### Claude's Discretion
- Success/error states for contact form (D-10)
- Press page layout style (D-12) -- UI-SPEC chose year-grouped list
- Skills display format on resume (D-15) -- UI-SPEC chose tag/pill format
- Blog post page layout details (header image treatment, reading time display)
- Empty states for all pages when no CMS content exists

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | About page with full bio, professional photo, disciplines overview | New `Page` content type + `getPage()` query needed. Reuse RichText.svelte, ContentfulImage.svelte, CATEGORIES config. Split layout per D-01. |
| CONT-02 | Press/News page with chronological feed of press mentions | Existing `getPressItems()` query returns data sorted by `-fields.date`. Group by year in component. Reuse PressItem type. |
| CONT-03 | Resume/CV page -- viewable on-page and downloadable as PDF | Existing `getResume()` query and `ResumeData` type already defined. Resume PDF URL from SiteSettings already in layout data. Structured JSON fields for experience/education/skills. |
| CONT-04 | Blog with rich text posts, images, and video embeds | Existing `getBlogPosts()` and `getBlogPostBySlug()` queries ready. Need `[slug]` route with `entries()` export. Extend richtext.ts with INLINES.HYPERLINK video detection for VideoFacade rendering. |
| CONT-05 | Contact form using static-compatible service | Web3Forms POST to `https://api.web3forms.com/submit` with JSON body. Client-side fetch, no server needed. Access key stored as env var or in SiteSettings. Need `contactEmail` field added to SiteSettings for error fallback. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| SvelteKit | ^2.57.0 | Framework | Installed |
| Svelte | ^5.55.2 | UI components | Installed |
| contentful | ^11.12.1 | Contentful SDK | Installed |
| @contentful/rich-text-html-renderer | ^17.2.2 | Rich Text to HTML | Installed |
| @contentful/rich-text-types | ^17.2.7 | Rich Text TS types | Installed |
| Tailwind CSS | ^4.2.2 | Styling | Installed |
| svelte-inview | ^4.0.4 | Lazy loading | Installed |

### New Dependencies
None required. All needed libraries are already installed.

### External Services
| Service | Purpose | Free Tier | Integration |
|---------|---------|-----------|-------------|
| Web3Forms | Contact form submission | 250 submissions/month | Client-side fetch POST to `https://api.web3forms.com/submit` |

**Installation:** No new packages needed.

## Architecture Patterns

### Existing Patterns to Follow

All 5 pages follow the exact same architecture pattern already established in Phase 3:

```
src/routes/{page}/
  +page.server.ts    -- Contentful query in load function
  +page.svelte       -- Page component consuming data via $props or data
```

Blog additionally needs:
```
src/routes/blog/
  +page.server.ts    -- getBlogPosts()
  +page.svelte       -- Blog index with card grid
  [slug]/
    +page.server.ts  -- getBlogPostBySlug() + entries() for prerendering
    +page.svelte     -- Blog post detail with RichText
```

### Pattern: Page Server Load (established)
```typescript
// src/routes/about/+page.server.ts
import type { PageServerLoad } from './$types';
import { getPage } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
  const page = await getPage('about');
  return { page };
};
```

### Pattern: Dynamic Route with entries() (established in Phase 3)
```typescript
// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad, EntryGenerator } from './$types';
import { getBlogPosts, getBlogPostBySlug } from '$lib/contentful/queries';
import { error } from '@sveltejs/kit';

export const entries: EntryGenerator = async () => {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) throw error(404, 'Post not found');
  return { post };
};
```

### Pattern: Web3Forms Contact Submission (new)
```typescript
// Client-side fetch in contact page component
async function handleSubmit() {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: 'YOUR_ACCESS_KEY',
      name: formData.name,
      email: formData.email,
      message: formData.message,
      botcheck: '', // honeypot -- must be empty
    }),
  });
  const result = await response.json();
  // result.success === true on success
}
```
Source: [Web3Forms API Reference](https://docs.web3forms.com/getting-started/api-reference)

### Pattern: Rich Text Video Embed (extending existing)
```typescript
// Extend richtext.ts renderOptions to detect video URLs in hyperlinks
import { INLINES } from '@contentful/rich-text-types';

const renderOptions = {
  renderNode: {
    // ... existing BLOCKS.EMBEDDED_ASSET handler ...
    [INLINES.HYPERLINK]: (node: any) => {
      const url = node.data.uri;
      // Check if URL is a Vimeo/YouTube video
      if (isVideoUrl(url)) {
        return `<div class="my-6 aspect-video" data-video-url="${url}"></div>`;
      }
      // Regular hyperlink
      return `<a href="${url}">${node.content.map((c: any) => c.value).join('')}</a>`;
    },
  },
};
```
Note: Since `renderRichText()` produces HTML strings and VideoFacade is a Svelte component, the Rich Text renderer must output a placeholder that the RichText.svelte component processes. Alternative: use `{@html}` with a post-processing step, or handle video URLs as a special case in the component.

Source: [Contentful Rich Text Rendering](https://www.contentful.com/developers/docs/concepts/rich-text/)

### Anti-Patterns to Avoid
- **Don't create separate Contentful clients per page.** Use the existing singleton from `$lib/contentful/client.ts`.
- **Don't use Svelte stores.** Project uses Svelte 5 runes exclusively ($state, $derived, $props).
- **Don't use form libraries (Superforms, etc.).** HTML5 native validation + simple fetch is sufficient for 3 fields.
- **Don't redirect after form submission.** Use inline state changes (idle/submitting/success/error) per D-10.
- **Don't use CAPTCHA.** Web3Forms uses honeypot (hidden `botcheck` field) for spam prevention.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich Text rendering | Custom Markdown/HTML parser | `@contentful/rich-text-html-renderer` | Already integrated. Handles all Contentful Rich Text node types. |
| Image optimization | Manual srcset generation | `ContentfulImage.svelte` + Contentful Image API | Already built with 4 widths, WebP/AVIF, lazy loading. |
| Form submission backend | Express/serverless endpoint | Web3Forms API | Static site, no server. Free tier, no data storage, spam protection. |
| Breadcrumb navigation | Custom breadcrumb markup | `Breadcrumb.svelte` | Already built with accessible `<nav aria-label>` and `<ol>` structure. |
| SEO meta tags | Manual `<svelte:head>` per page | `SEO.svelte` | Already built with title, description, OG tags, canonical URL. |
| Video embeds | Custom video player | `VideoFacade.svelte` | Already built with facade pattern, thumbnail+play overlay. |

## Common Pitfalls

### Pitfall 1: Missing Page Content Type and Query
**What goes wrong:** About page needs a `Page` content type in Contentful and a `getPage()` query function, neither of which exist yet in the codebase.
**Why it happens:** Phase 2 defined types for projects, press, blog, resume, and site settings but did not implement a generic `Page` content type.
**How to avoid:** Add `PageFields` interface to types.ts, `PageData` normalized type, and `getPageBySlug()` to queries.ts. Create the `page` content type in Contentful with fields: title, slug, body (Rich Text), photo (Asset).
**Warning signs:** About page renders empty despite CMS having content.

### Pitfall 2: Missing contactEmail in SiteSettings
**What goes wrong:** Contact form error state references `{contactEmail}` but SiteSettingsFields has no contactEmail field.
**Why it happens:** UI-SPEC specifies error state copy: "email Michelle at {contactEmail}" but the field wasn't part of the original Phase 2 content model.
**How to avoid:** Add `contactEmail` field to SiteSettingsFields interface, SiteSettingsData normalized type, and getSiteSettings() query. Also add it to the Contentful SiteSettings content type.
**Warning signs:** Error state shows undefined or empty email address.

### Pitfall 3: Resume Data Structure Mismatch
**What goes wrong:** ResumeFields uses `Array<{...}>` for experience/education but Contentful JSON fields may not match the expected structure.
**Why it happens:** Contentful supports JSON Object fields, but the nested array structure must be carefully defined in the CMS to match the TypeScript interface.
**How to avoid:** The `getResume()` query already maps fields with `?? []` fallbacks. Ensure Contentful JSON field validation matches the expected structure. Consider using linked entries (separate ResumeExperience, ResumeEducation content types) instead of a single JSON blob if the CMS editing experience matters.
**Warning signs:** Resume sections render empty arrays; skills don't appear.

### Pitfall 4: Blog Video Embed in Rich Text
**What goes wrong:** Video URLs pasted into Rich Text body don't render as VideoFacade components.
**Why it happens:** `renderRichText()` returns an HTML string. You can't embed a Svelte component inside `{@html}`. The current INLINES handler is not implemented.
**How to avoid:** Two approaches: (1) Render video URLs as data-attribute placeholder divs in the HTML string, then use a post-render step in RichText.svelte to mount VideoFacade components into those placeholders. (2) Use Svelte's `{@html}` for the text and handle video URLs separately by splitting the Rich Text document into segments. Approach (1) is simpler -- output `<div data-video-facade="URL"></div>` from the renderer, then in RichText.svelte use `$effect` to find and hydrate those placeholders.
**Warning signs:** Video URLs render as plain text links in blog posts.

### Pitfall 5: Web3Forms Access Key Storage
**What goes wrong:** Access key is hardcoded in source code or not available at build time.
**Why it happens:** Static site has no runtime environment variables. Web3Forms key must be available client-side.
**How to avoid:** Web3Forms access key is NOT secret (it's designed to be in client-side HTML). It can be: (a) stored in Contentful SiteSettings as a field, (b) hardcoded in the component (acceptable per Web3Forms docs), or (c) stored as a Vite public env var (`VITE_WEB3FORMS_KEY`). Option (c) is cleanest -- it keeps configuration external but available in client-side code.
**Warning signs:** Form submissions fail with 403/authentication errors.

### Pitfall 6: Prerendering Blog Slug Routes
**What goes wrong:** Blog post pages 404 after build.
**Why it happens:** Static adapter needs `entries()` export to know which dynamic routes to prerender. Without it, `/blog/[slug]/` routes are not generated at build time.
**How to avoid:** Export `entries` function in `+page.server.ts` that calls `getBlogPosts()` and returns `[{ slug: 'post-1' }, { slug: 'post-2' }]`. This is the exact same pattern used in `advertising/[slug]/+page.server.ts`.
**Warning signs:** Blog index links work but clicking a post gives 404.

### Pitfall 7: base Path in Internal Links
**What goes wrong:** Links to blog posts, category pages, or other internal pages break on GitHub Pages.
**Why it happens:** Project is deployed at `/michelle_ngo_one/` sub-path. All internal `href` values must use `{base}/path/`.
**How to avoid:** Import `base` from `$app/paths` and prefix all `href` values. This is already the established pattern throughout the codebase.
**Warning signs:** Links work in dev but 404 on production.

## Code Examples

### New Query: getPageBySlug (for About page)
```typescript
// Addition to src/lib/contentful/queries.ts
export interface PageData {
  title: string;
  slug: string;
  body: Document | null;
  photoUrl: string | null;
  seoDescription: string;
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const entries = await contentfulClient.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    limit: 1,
  });

  const item = entries.items[0];
  if (!item) return null;

  return {
    title: (item.fields.title as string) ?? '',
    slug: (item.fields.slug as string) ?? '',
    body: item.fields.body as Document ?? null,
    photoUrl: (item.fields.photo as any)?.fields?.file?.url ?? null,
    seoDescription: (item.fields.seoDescription as string) ?? '',
  };
}
```

### Web3Forms Contact Form Component Pattern
```svelte
<script lang="ts">
  let formState: 'idle' | 'submitting' | 'success' | 'error' = $state('idle');
  let errorMessage = $state('');

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    formState = 'submitting';
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      formState = result.success ? 'success' : 'error';
      if (!result.success) errorMessage = result.message ?? 'Unknown error';
    } catch {
      formState = 'error';
      errorMessage = 'Network error';
    }
  }
</script>
```
Source: [Web3Forms API Reference](https://docs.web3forms.com/getting-started/api-reference)

### Press Items Year Grouping
```typescript
// Group press items by year for display
function groupByYear(items: PressItem[]): Map<number, PressItem[]> {
  const groups = new Map<number, PressItem[]>();
  for (const item of items) {
    const year = new Date(item.date).getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(item);
  }
  return groups;
}
```

### Blog Rich Text with Video Placeholder
```typescript
// Extended renderOptions in richtext.ts
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

[INLINES.HYPERLINK]: (node: any) => {
  const url: string = node.data.uri;
  const text = node.content
    .filter((c: any) => c.nodeType === 'text')
    .map((c: any) => c.value)
    .join('');
  
  // Detect Vimeo/YouTube URLs
  if (/vimeo\.com\/\d+|youtube\.com\/watch|youtu\.be\//.test(url)) {
    return `<div class="my-6" data-video-facade="${encodeURIComponent(url)}" data-video-title="${encodeURIComponent(text)}"></div>`;
  }
  return `<a href="${url}">${text}</a>`;
},
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Svelte stores (writable/readable) | Svelte 5 runes ($state, $derived, $effect) | Svelte 5 (2024) | All new components use runes exclusively |
| PostCSS + tailwind.config.js | @tailwindcss/vite plugin + CSS-first config | Tailwind v4 (2025) | No JS config file, @theme in CSS |
| Form libraries (Superforms) | Native HTML5 validation + fetch | Always valid for simple forms | No extra dependency for 3-field form |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 |
| Config file | vite.config.ts (Vitest uses Vite config) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | About page loads bio, photo, and disciplines from CMS | unit | `npx vitest run src/routes/about.load.test.ts -x` | No -- Wave 0 |
| CONT-02 | Press page loads and groups items by year | unit | `npx vitest run src/routes/press.load.test.ts -x` | No -- Wave 0 |
| CONT-03 | Resume page loads structured data and PDF URL | unit | `npx vitest run src/routes/resume.load.test.ts -x` | No -- Wave 0 |
| CONT-04 | Blog index loads posts; detail loads by slug; video URLs detected in Rich Text | unit | `npx vitest run src/routes/blog.load.test.ts -x` | No -- Wave 0 |
| CONT-05 | Contact form submits to Web3Forms, handles success/error states | unit | `npx vitest run src/routes/contact.form.test.ts -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/routes/about.load.test.ts` -- mock getPageBySlug, verify load returns page data
- [ ] `src/routes/press.load.test.ts` -- mock getPressItems, verify year grouping logic
- [ ] `src/routes/resume.load.test.ts` -- mock getResume, verify structured data shape
- [ ] `src/routes/blog.load.test.ts` -- mock getBlogPosts/getBlogPostBySlug, verify entries() and load
- [ ] `src/routes/contact.form.test.ts` -- mock fetch to Web3Forms, verify state transitions
- [ ] `src/lib/__tests__/richtext-video.test.ts` -- verify INLINES.HYPERLINK renders video placeholder for Vimeo/YouTube URLs

### Existing Test Patterns
Tests follow the mocking pattern established in Phase 2-3:
- Mock `$lib/contentful/queries` at module level with `vi.mock()`
- Mock `$env/static/private` for Contentful credentials
- Use `satisfies Type` for type-safe mock data
- Test load function return shapes and query parameters

## Open Questions

1. **Web3Forms access key delivery method**
   - What we know: Key is not secret (safe for client-side). Can be env var, CMS field, or hardcoded.
   - What's unclear: Whether to use `VITE_WEB3FORMS_KEY` env var or add to SiteSettings in Contentful.
   - Recommendation: Use `import.meta.env.VITE_WEB3FORMS_ACCESS_KEY` (Vite public env var). This keeps it out of CMS (it's configuration, not content) but external to source code. Fallback: hardcode in component if env var approach adds friction.

2. **Rich Text video embed hydration strategy**
   - What we know: `renderRichText()` returns HTML string. Svelte components cannot be embedded in `{@html}`.
   - What's unclear: Best approach for hydrating video placeholders into interactive VideoFacade components.
   - Recommendation: Output data-attribute divs from renderer, use `$effect` in RichText.svelte to find `[data-video-facade]` elements and replace with iframe-based embed markup (not full Svelte component mount -- just the same HTML structure VideoFacade produces). Simpler than dynamic component mounting.

3. **Contentful Page content type for About**
   - What we know: The `Page` content type is referenced in CLAUDE.md content model recommendations and CONTEXT D-02 but no PageFields or getPage query exists.
   - What's unclear: Whether to create a generic `Page` type (reusable for About and potentially other pages) or an About-specific approach.
   - Recommendation: Create a generic `Page` content type with: title, slug, body (Rich Text), photo (Asset), seoDescription. The About page fetches by slug='about'. This matches the CLAUDE.md content model recommendation and is reusable.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/lib/contentful/queries.ts` -- all existing query patterns
- Existing codebase: `src/lib/contentful/types.ts` -- all existing type definitions
- Existing codebase: `src/lib/contentful/richtext.ts` -- current Rich Text renderer
- Existing codebase: `src/lib/components/` -- all reusable components
- Existing codebase: `src/routes/advertising/[slug]/+page.server.ts` -- dynamic route pattern with entries()
- [Web3Forms API Reference](https://docs.web3forms.com/getting-started/api-reference) -- POST endpoint, response format, fields

### Secondary (MEDIUM confidence)
- [Contentful Rich Text concepts](https://www.contentful.com/developers/docs/concepts/rich-text/) -- INLINES node types
- [Contentful Rich Text video rendering](https://miguelcrespo.co/posts/rendering-youtube-videos-using-rich-text-contentful/) -- custom INLINES.HYPERLINK renderer pattern
- [Web3Forms Svelte guide](https://web3forms.com/platforms/svelte-contact-form) -- Svelte-specific integration (403 on fetch, but search results confirmed pattern)

## Project Constraints (from CLAUDE.md)

- **Framework:** SvelteKit with Svelte 5 runes -- no stores
- **Styling:** Tailwind CSS v4 (CSS-first, no JS config)
- **CMS:** Contentful with contentful SDK v11
- **Hosting:** GitHub Pages via adapter-static (full prerendering)
- **Base path:** `/michelle_ngo_one` -- all links must use `{base}/` prefix
- **No GSAP or animation libraries** -- use Svelte built-in transitions (fade, fly, scale)
- **No heavy video players** -- use native iframe embeds via VideoFacade
- **No SPA mode** -- full prerendering with `prerender = true`
- **No Svelte stores** -- Svelte 5 runes only ($state, $derived, $effect, $props)
- **No tailwind.config.js** -- Tailwind v4 uses @theme in CSS

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed, no new dependencies
- Architecture: HIGH -- exact patterns already established in Phases 1-3
- Pitfalls: HIGH -- based on direct codebase analysis, known gaps identified
- Web3Forms integration: HIGH -- official API docs confirm endpoint and response format
- Rich Text video embed: MEDIUM -- hydration strategy needs implementation validation

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (stable stack, no fast-moving dependencies)
