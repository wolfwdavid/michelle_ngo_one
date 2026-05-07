# Phase 3: Portfolio & Video - Research

**Researched:** 2026-05-07
**Domain:** SvelteKit pages, video embed facade pattern, accessible lightbox modal, Contentful CMS data fetching
**Confidence:** HIGH

## Summary

Phase 3 is the centerpiece of the site -- building the homepage, category pages, project detail pages, video lightbox, and filmography. The existing codebase provides a solid foundation: Contentful query functions (`getProjects`, `getFeaturedProjects`, `getPressItems`), `ContentfulImage` component with lazy-load, `SEO` component, and route placeholders for all 6 categories plus homepage.

The primary technical challenges are: (1) building an accessible lightbox/modal with focus trapping and keyboard navigation, (2) implementing the video facade pattern to avoid loading 147+ iframes, (3) creating dynamic `[slug]` routes for project detail pages that prerender correctly with adapter-static, and (4) wiring up homepage accordion expand/collapse with Svelte 5 transitions.

**Primary recommendation:** Build a reusable `VideoLightbox.svelte` component with hand-rolled focus trapping (no library needed -- 5 focusable elements max), a `VideoFacade.svelte` component wrapping thumbnails with play overlay, and use SvelteKit's `entries` export for prerendering dynamic project detail routes. All transitions use Svelte's built-in `slide`, `fade`, and `scale` from `svelte/transition`.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Hero section: Michelle's name, tagline, and a single featured video reel as the visual centerpiece
- D-02: Below the hero, stacked category sections -- each category gets a labeled section. Scroll down through: Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, Copywriting
- D-03: Each category section shows 1 featured video (larger, left) + 3 thumbnails (smaller, right) with a "See all" link to the full category page
- D-04: About snippet and press highlights sit after all 6 category sections at the bottom of the homepage
- D-05: Slide-down grid expansion -- clicking "See all" or category heading expands remaining thumbnails below the initial row with smooth Svelte animation. Click again to collapse
- D-06: Accordion behavior -- only one category expandable at a time
- D-07: Dark semi-transparent overlay with large centered Vimeo/YouTube iframe (16:9). Project title below player. X button top-right, Escape to close
- D-08: Prev/next navigation arrows inside lightbox. Arrow keys also work
- D-09: Focus trapping inside modal for accessibility
- D-10: Facade pattern for all video embeds -- thumbnail + play overlay shown first, iframe loads only on click
- D-11: Each project gets a dedicated route: /{category}/{project-slug}
- D-12: Detail page layout: project title, video player (16:9 facade), role/client metadata, description, credits
- D-13: Thumbnail grid: 3 columns desktop, 2 tablet, 1 mobile
- D-14: Each thumbnail card: video thumbnail image, play overlay icon, project title below
- D-15: Category page header with category name and optional description. "Back to Home" breadcrumb
- D-16: Filmography page: table format (Claude's Discretion chosen table for structured data scannability)

### Claude's Discretion
- Filmography page format (D-16) -- table chosen per UI-SPEC
- Specific animation timing/easing for slide-down expand -- 300ms cubicOut per UI-SPEC
- Empty state design for categories with no CMS content yet
- Thumbnail aspect ratio -- 16:9 per UI-SPEC
- How many press highlights on homepage -- 3 per UI-SPEC
- About snippet length and layout

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Homepage hero section with name, tagline, brief intro | SiteSettings already loaded in layout; hero video facade pattern documented |
| HOME-02 | Homepage shows one featured video per category (6 total) | `getFeaturedProjects()` exists per category; homepage load function fetches all 6 |
| HOME-03 | Clicking category expands remaining videos inline with animation | Svelte `slide` transition with accordion state pattern documented |
| HOME-04 | Homepage includes short about snippet with link to About page | Static content + SiteSettings tagline; simple component |
| HOME-05 | Homepage displays recent press highlights | `getPressItems()` exists; limit to 3 in load function |
| PORT-01 | Each category has a dedicated page showing all projects | Route placeholders exist; add `+page.server.ts` load functions calling `getProjects()` |
| PORT-02 | Video thumbnail grid with play overlay icons | VideoThumbnailCard component spec documented |
| PORT-03 | Featured projects use embedded Vimeo/YouTube facade players | VideoFacade component pattern documented |
| PORT-04 | Secondary projects display as clickable thumbnails | Same VideoThumbnailCard component, click opens lightbox |
| PORT-05 | Each project has detail view with case study content | Dynamic `[slug]` route with `entries` export for prerendering |
| PORT-06 | Video embeds use lazy-loading facade pattern | VideoFacade component -- thumbnail only, iframe on click |
| VID-01 | Lightbox/modal video player | VideoLightbox component with overlay, iframe loading, prev/next |
| VID-02 | Modal handles keyboard navigation and focus trapping | Hand-rolled focus trap (5 elements), Escape close, arrow key nav |
| VID-03 | Videos sourced from Vimeo and YouTube | URL parser utility to extract video ID and platform from videoUrl field |
| VID-04 | Filmography/credits list page | `/film-tv/filmography` route with table layout |

</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Framework:** SvelteKit with Svelte 5 runes ($state, $derived, $effect) -- NO stores
- **Styling:** Tailwind CSS v4 (CSS-first, no JS config, @tailwindcss/vite plugin)
- **Deployment:** GitHub Pages via adapter-static, base path `/michelle_ngo_one`
- **CMS:** Contentful (free tier)
- **Forbidden:** GSAP, svelte-motion, heavy video players (video.js/plyr), SPA mode, Svelte stores, tailwind.config.js
- **Required patterns:** Facade pattern for video embeds, `base` from `$app/paths` for all internal links, full prerendering
- **Image handling:** Contentful Image API for CMS images (not @sveltejs/enhanced-img)

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| @sveltejs/kit | ^2.57.0 | Application framework | Installed |
| svelte | ^5.55.2 | UI framework with runes | Installed |
| @sveltejs/adapter-static | ^3.0.10 | Static site generation | Installed |
| contentful | ^11.12.1 | Contentful Delivery SDK | Installed |
| @tailwindcss/vite | ^4.2.2 | Tailwind v4 Vite plugin | Installed |
| tailwindcss | ^4.2.2 | CSS utility framework | Installed |
| svelte-inview | ^4.0.4 | Intersection Observer for scroll triggers | Installed |

### No New Dependencies Needed

This phase requires ZERO new npm packages. Everything is built with:
- Svelte 5 built-in transitions (`svelte/transition`: fade, slide, scale)
- Svelte 5 runes for state management ($state, $derived)
- Hand-rolled focus trap (5 focusable elements max in lightbox)
- Native `<iframe>` for Vimeo/YouTube embeds
- Existing `ContentfulImage` component for thumbnails
- Existing Contentful query functions

**Do NOT install:** focus-trap, a11y-dialog, lite-youtube-embed, lite-vimeo-embed, or any video player library.

## Architecture Patterns

### Route Structure (New Routes)

```
src/routes/
├── +page.svelte                    # Homepage (REPLACE placeholder)
├── +page.server.ts                 # Homepage load: all 6 category featured + press
├── advertising/
│   ├── +page.svelte                # Category page (REPLACE placeholder)
│   ├── +page.server.ts             # Load: getProjects('advertisingProject')
│   └── [slug]/
│       ├── +page.svelte            # Project detail page (NEW)
│       └── +page.server.ts         # Load: getProjectBySlug + entries()
├── film-tv/
│   ├── +page.svelte                # Category page (REPLACE)
│   ├── +page.server.ts             # Load: getProjects('filmProject')
│   ├── [slug]/
│   │   ├── +page.svelte            # Project detail (NEW)
│   │   └── +page.server.ts         # Load + entries()
│   └── filmography/
│       ├── +page.svelte            # Filmography table (NEW)
│       └── +page.server.ts         # Load: getProjects('filmProject')
├── ux-design/
│   ├── +page.svelte                # (REPLACE)
│   ├── +page.server.ts             # Load
│   └── [slug]/                     # (NEW)
├── social-transmedia/              # Same pattern
├── publishing/                     # Same pattern
└── copywriting/                    # NOTE: No route exists yet -- must create
    ├── +page.svelte
    ├── +page.server.ts
    └── [slug]/
```

**Critical discovery:** The `copywriting` route does NOT exist yet. It must be created. The nav config also does not include Copywriting. However, CONTEXT.md D-02 specifies all 6 categories including Copywriting on the homepage.

### Component Structure (New Components)

```
src/lib/components/
├── VideoFacade.svelte              # Thumbnail + play overlay, click loads iframe
├── VideoLightbox.svelte            # Modal with iframe, prev/next, focus trap
├── VideoThumbnailCard.svelte       # Grid card: thumbnail + play overlay + title
├── HomepageHero.svelte             # Hero section with featured reel
├── HomepageCategorySection.svelte  # Single category row on homepage
├── HomepageAboutSnippet.svelte     # About excerpt + CTA
├── HomepagePressHighlights.svelte  # 3 press items row
├── Breadcrumb.svelte               # Reusable breadcrumb nav
├── FilmographyTable.svelte         # Table with year/title/role/type
└── (existing components unchanged)
```

### Pattern 1: Video URL Parser Utility

**What:** Parse Vimeo/YouTube URLs to extract video ID and platform, then generate embed URLs.
**When to use:** Whenever rendering a video facade or loading an iframe.

```typescript
// src/lib/utils/video.ts

export type VideoPlatform = 'vimeo' | 'youtube' | 'unknown';

export interface VideoInfo {
  platform: VideoPlatform;
  id: string;
  embedUrl: string;
}

export function parseVideoUrl(url: string): VideoInfo | null {
  if (!url) return null;

  // Vimeo: vimeo.com/123456 or player.vimeo.com/video/123456
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      platform: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    };
  }

  // YouTube: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      platform: 'youtube',
      id: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    };
  }

  return null;
}
```

Source: Standard URL patterns from [YouTube](https://developers.google.com/youtube/player_parameters) and [Vimeo](https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-Parameters) documentation.

### Pattern 2: Focus Trap for Lightbox

**What:** Hand-rolled focus trap cycling through close button, prev arrow, next arrow, and iframe.
**When to use:** VideoLightbox component.

```typescript
// Inside VideoLightbox.svelte
function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return;

  const focusable = modal.querySelectorAll<HTMLElement>(
    'button:not([disabled]), iframe'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
```

Source: [Hidde de Vries -- Using JavaScript to trap focus](https://hidde.blog/using-javascript-to-trap-focus-in-an-element/), [UXPin Focus Trap Guide](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/).

### Pattern 3: SvelteKit Dynamic Route with entries() for Static Prerendering

**What:** The `entries` export tells adapter-static which dynamic routes to prerender.
**When to use:** Every `[slug]/+page.server.ts` file.

```typescript
// src/routes/advertising/[slug]/+page.server.ts
import type { PageServerLoad, EntryGenerator } from './$types';
import { getProjects } from '$lib/contentful/queries';
import { error } from '@sveltejs/kit';

export const entries: EntryGenerator = async () => {
  const projects = await getProjects('advertisingProject');
  return projects.map((p) => ({ slug: p.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
  const projects = await getProjects('advertisingProject');
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) throw error(404, 'Project not found');
  return { project, category: 'Advertising', categorySlug: 'advertising' };
};
```

Source: [SvelteKit adapter-static docs](https://svelte.dev/docs/kit/adapter-static), [SvelteKit routing docs](https://svelte.dev/docs/kit/routing).

### Pattern 4: Accordion State with Svelte 5 Runes

**What:** Only one category expanded at a time on homepage.
**When to use:** Homepage category sections.

```svelte
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let expandedCategory = $state<string | null>(null);

  function toggleCategory(slug: string) {
    expandedCategory = expandedCategory === slug ? null : slug;
  }
</script>

{#each categories as cat}
  <section>
    <button onclick={() => toggleCategory(cat.slug)}
      aria-expanded={expandedCategory === cat.slug}>
      {cat.name}
    </button>

    {#if expandedCategory === cat.slug}
      <div transition:slide={{ duration: 300, easing: cubicOut }}>
        <!-- expanded thumbnail grid -->
      </div>
    {/if}
  </section>
{/each}
```

Source: [Svelte transition docs](https://svelte.dev/docs/svelte/svelte-transition), [Svelte transition directive](https://svelte.dev/docs/svelte/transition).

### Pattern 5: VideoFacade Component

**What:** Shows thumbnail + play overlay; clicking replaces with live iframe.
**When to use:** All video embeds on category pages, homepage, and detail pages.

```svelte
<script lang="ts">
  import ContentfulImage from './ContentfulImage.svelte';
  import { parseVideoUrl } from '$lib/utils/video';

  let {
    videoUrl,
    thumbnailUrl,
    title,
    onclick,
    inline = false,
  }: {
    videoUrl: string;
    thumbnailUrl: string | null;
    title: string;
    onclick?: () => void;
    inline?: boolean;
  } = $props();

  let playing = $state(false);
  const videoInfo = $derived(parseVideoUrl(videoUrl));
</script>

<div class="relative aspect-video overflow-hidden rounded-sm bg-gray-50">
  {#if inline && playing && videoInfo}
    <iframe
      src={videoInfo.embedUrl}
      title={title}
      class="absolute inset-0 h-full w-full"
      allow="autoplay; fullscreen"
      frameborder="0"
    ></iframe>
  {:else}
    <button
      class="absolute inset-0 h-full w-full cursor-pointer"
      aria-label="Play {title}"
      onclick={() => { if (onclick) onclick(); else playing = true; }}
    >
      {#if thumbnailUrl}
        <ContentfulImage url={thumbnailUrl} alt={title} aspectRatio="16/9" />
      {/if}
      <!-- Play overlay icon -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-black/50">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white" aria-hidden="true">
            <polygon points="5,3 17,10 5,17" />
          </svg>
        </div>
      </div>
    </button>
  {/if}
</div>
```

### Pattern 6: Homepage Load Function

**What:** Fetch all data needed for homepage in a single server load.
**When to use:** `src/routes/+page.server.ts`.

```typescript
// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { getProjects, getFeaturedProjects, getPressItems } from '$lib/contentful/queries';
import type { ProjectContentTypeId } from '$lib/contentful/types';

const CATEGORIES: { name: string; slug: string; contentTypeId: ProjectContentTypeId }[] = [
  { name: 'Advertising', slug: 'advertising', contentTypeId: 'advertisingProject' },
  { name: 'Film & TV', slug: 'film-tv', contentTypeId: 'filmProject' },
  { name: 'UX Design', slug: 'ux-design', contentTypeId: 'uxDesignProject' },
  { name: 'Social & Transmedia', slug: 'social-transmedia', contentTypeId: 'socialTransmediaProject' },
  { name: 'Publishing', slug: 'publishing', contentTypeId: 'publishingProject' },
  { name: 'Copywriting', slug: 'copywriting', contentTypeId: 'copywritingProject' },
];

export const load: PageServerLoad = async () => {
  const [categoryData, pressItems] = await Promise.all([
    Promise.all(
      CATEGORIES.map(async (cat) => ({
        ...cat,
        featured: await getFeaturedProjects(cat.contentTypeId),
        all: await getProjects(cat.contentTypeId),
      }))
    ),
    getPressItems(),
  ]);

  return {
    categories: categoryData,
    pressHighlights: pressItems.slice(0, 3),
  };
};
```

### Anti-Patterns to Avoid

- **Loading iframes eagerly:** Never render `<iframe>` until user explicitly clicks play. With 147+ videos this would destroy performance.
- **Using `on:click` syntax:** Svelte 5 uses `onclick` (no colon). The colon syntax is Svelte 4.
- **Using writable/readable stores:** Use `$state` and `$derived` runes instead.
- **Fetching data in `+page.svelte`:** All CMS data must be fetched in `+page.server.ts` load functions for prerendering.
- **Missing `entries` export:** Dynamic `[slug]` routes WILL FAIL to prerender without the `entries` function. Adapter-static cannot discover dynamic routes automatically.
- **Hardcoding base path:** Always use `base` from `$app/paths` for internal links. The site deploys to `/michelle_ngo_one`.
- **Using `<dialog>` element:** While modern, the `<dialog>` element with `showModal()` has inconsistent styling across browsers for the backdrop. A custom div-based modal with manual focus trapping gives more control and matches the UI-SPEC exactly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom srcset generation | `ContentfulImage.svelte` + `contentfulSrcset()` | Already built in Phase 2, handles AVIF/WebP/lazy-load |
| SEO meta tags | Manual `<head>` tags | `SEO.svelte` component | Already built in Phase 2, handles OG/Twitter/canonical |
| Scroll-triggered visibility | Manual IntersectionObserver | `svelte-inview` (installed) | Already used by ContentfulImage, consistent API |
| CSS transitions | Manual keyframe animations | Svelte `transition:slide`, `transition:fade`, `transition:scale` | Built-in, handles mount/unmount, SSR-safe |
| Easing functions | Custom bezier curves | `svelte/easing` (cubicOut, etc.) | Built-in, mathematically correct |

**Key insight:** The only truly new UI pattern in this phase is the lightbox/modal. Everything else composes existing primitives (ContentfulImage, Contentful queries, Svelte transitions, Tailwind utilities).

## Common Pitfalls

### Pitfall 1: Dynamic Routes Failing to Prerender
**What goes wrong:** `adapter-static` throws "404 not found" errors during build for `[slug]` routes.
**Why it happens:** The adapter cannot discover dynamic routes by crawling alone -- it doesn't know what slug values exist.
**How to avoid:** Export `entries` function from every `[slug]/+page.server.ts` that returns all valid slugs from Contentful.
**Warning signs:** Build warnings about "entries returned from prerender" or 404s in build output.

### Pitfall 2: Lightbox Focus Escape
**What goes wrong:** Tab key moves focus to elements behind the modal overlay.
**Why it happens:** Focus trap not implemented or not accounting for shift+tab on first element.
**How to avoid:** Query all focusable elements inside modal, trap tab at boundaries, restore focus on close.
**Warning signs:** Test with keyboard-only navigation: can you tab out of the modal while it's open?

### Pitfall 3: Iframe Never Destroyed on Lightbox Close
**What goes wrong:** Video keeps playing audio after lightbox closes.
**Why it happens:** The iframe is hidden but not removed from DOM.
**How to avoid:** Use Svelte's `{#if}` block so the iframe is destroyed (unmounted) when lightbox closes, not just hidden with CSS.
**Warning signs:** Audio continues after closing the lightbox.

### Pitfall 4: Missing Copywriting Route
**What goes wrong:** Homepage links to `/copywriting/` but the route doesn't exist.
**Why it happens:** Phase 1 created routes for 5 categories but omitted Copywriting (not in nav).
**How to avoid:** Create `src/routes/copywriting/` with `+page.svelte` and `+page.server.ts`. Also create `copywriting/[slug]/` for detail pages.
**Warning signs:** Build error or 404 for the copywriting category.

### Pitfall 5: Base Path Missing on Dynamic Links
**What goes wrong:** Links to `/{category}/{slug}/` break on GitHub Pages because base path `/michelle_ngo_one` is missing.
**Why it happens:** Forgetting to use `base` from `$app/paths` in dynamically constructed hrefs.
**How to avoid:** All `href` values must use `{base}/{category}/{slug}/` pattern.
**Warning signs:** 404s on deployed site for project detail pages.

### Pitfall 6: Video Autoplay Blocked by Browser
**What goes wrong:** Iframe loads but video doesn't start playing when lightbox opens.
**Why it happens:** Browsers require the iframe to have `allow="autoplay"` attribute and the embed URL to include `?autoplay=1`.
**How to avoid:** Always include both `allow="autoplay; fullscreen"` on iframe AND `?autoplay=1` in embed URL.
**Warning signs:** User clicks play, sees the player but must click play again inside the iframe.

### Pitfall 7: Contentful API Rate Limits During Build
**What goes wrong:** Build fails sporadically with Contentful API errors.
**Why it happens:** Homepage load function makes 12+ API calls (6 featured + 6 all projects + press items). If category detail pages also fetch, build can hit rate limits.
**How to avoid:** Use `Promise.all` for parallel fetches within a single load function. Consider caching strategy if builds become unreliable. Contentful free tier allows 78 requests/second.
**Warning signs:** Intermittent build failures with 429 status codes.

## Code Examples

### Lightbox with Focus Trap and Keyboard Navigation

```svelte
<!-- src/lib/components/VideoLightbox.svelte -->
<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { parseVideoUrl } from '$lib/utils/video';
  import type { Project } from '$lib/contentful/types';

  let {
    projects,
    currentIndex = $bindable(0),
    open = $bindable(false),
  }: {
    projects: Project[];
    currentIndex: number;
    open: boolean;
  } = $props();

  let modalEl: HTMLDivElement;
  let triggerEl: HTMLElement | null = null;
  let current = $derived(projects[currentIndex]);
  let videoInfo = $derived(current ? parseVideoUrl(current.videoUrl ?? '') : null);
  let hasPrev = $derived(currentIndex > 0);
  let hasNext = $derived(currentIndex < projects.length - 1);

  function openLightbox(index: number, trigger: HTMLElement) {
    triggerEl = trigger;
    currentIndex = index;
    open = true;
  }

  function closeLightbox() {
    open = false;
    triggerEl?.focus();
    triggerEl = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft' && hasPrev) currentIndex--;
    if (event.key === 'ArrowRight' && hasNext) currentIndex++;
    if (event.key === 'Tab') trapFocus(event);
  }

  function trapFocus(event: KeyboardEvent) {
    const focusable = modalEl?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), iframe'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  $effect(() => {
    if (open && modalEl) {
      const closeBtn = modalEl.querySelector<HTMLElement>('button');
      closeBtn?.focus();
    }
  });
</script>

{#if open && current && videoInfo}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-60 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    aria-label="Video player"
    bind:this={modalEl}
    onkeydown={handleKeydown}
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/85"
      transition:fade={{ duration: 200 }}
      onclick={closeLightbox}
    ></div>

    <!-- Content -->
    <div class="relative z-10 w-[90vw] max-w-[960px]" transition:scale={{ start: 0.95, duration: 200 }}>
      <!-- Close button -->
      <button
        class="absolute -top-12 right-0 flex h-11 w-11 items-center justify-center text-white hover:opacity-80"
        aria-label="Close video player"
        onclick={closeLightbox}
      >
        <!-- X icon SVG -->
      </button>

      <!-- Iframe -->
      <div class="aspect-video">
        <iframe
          src={videoInfo.embedUrl}
          title={current.title}
          class="h-full w-full"
          allow="autoplay; fullscreen"
          frameborder="0"
        ></iframe>
      </div>

      <!-- Title -->
      <p class="mt-3 text-center text-base font-semibold text-white">{current.title}</p>

      <!-- Prev/Next -->
      {#if hasPrev}
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-white hover:opacity-80"
          aria-label="Previous video"
          onclick={() => currentIndex--}
        ><!-- left chevron SVG --></button>
      {/if}
      {#if hasNext}
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-white hover:opacity-80"
          aria-label="Next video"
          onclick={() => currentIndex++}
        ><!-- right chevron SVG --></button>
      {/if}
    </div>
  </div>
{/if}
```

### Category Config Map (Reusable)

```typescript
// src/lib/config/categories.ts
import { base } from '$app/paths';
import type { ProjectContentTypeId } from '$lib/contentful/types';

export interface CategoryConfig {
  name: string;
  slug: string;
  href: string;
  contentTypeId: ProjectContentTypeId;
}

export const CATEGORIES: CategoryConfig[] = [
  { name: 'Advertising', slug: 'advertising', contentTypeId: 'advertisingProject', href: `${base}/advertising/` },
  { name: 'Film & TV', slug: 'film-tv', contentTypeId: 'filmProject', href: `${base}/film-tv/` },
  { name: 'UX Design', slug: 'ux-design', contentTypeId: 'uxDesignProject', href: `${base}/ux-design/` },
  { name: 'Social & Transmedia', slug: 'social-transmedia', contentTypeId: 'socialTransmediaProject', href: `${base}/social-transmedia/` },
  { name: 'Publishing', slug: 'publishing', contentTypeId: 'publishingProject', href: `${base}/publishing/` },
  { name: 'Copywriting', slug: 'copywriting', contentTypeId: 'copywritingProject', href: `${base}/copywriting/` },
];
```

### New Query Function Needed

```typescript
// Add to src/lib/contentful/queries.ts

export async function getProjectBySlug(
  contentTypeId: ProjectContentTypeId,
  slug: string
): Promise<Project | null> {
  const entries = await contentfulClient.getEntries({
    content_type: contentTypeId,
    'fields.slug': slug,
    limit: 1,
  });

  const item = entries.items[0];
  if (!item) return null;

  return {
    title: item.fields.title as string ?? '',
    slug: item.fields.slug as string ?? '',
    description: item.fields.description as string ?? '',
    thumbnailUrl: (item.fields.thumbnail as any)?.fields?.file?.url ?? null,
    videoUrl: item.fields.videoUrl as string ?? null,
    featured: item.fields.featured as boolean ?? false,
    sortOrder: item.fields.sortOrder as number ?? 0,
    client: item.fields.client as string | undefined,
    agency: item.fields.agency as string | undefined,
    role: item.fields.role as string | undefined,
    year: item.fields.year as number | undefined,
    productionType: item.fields.productionType as string | undefined,
    platform: item.fields.platform as string | undefined,
    publisher: item.fields.publisher as string | undefined,
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `on:click` event syntax | `onclick` attribute syntax | Svelte 5 (Oct 2024) | All event handlers use lowercase `on` prefix without colon |
| `writable()` stores | `$state()` runes | Svelte 5 (Oct 2024) | All reactive state uses runes, not stores |
| `$:` reactive declarations | `$derived()` rune | Svelte 5 (Oct 2024) | Computed values use $derived instead of $: |
| `export let` props | `$props()` destructuring | Svelte 5 (Oct 2024) | Component props declared with let { ... } = $props() |
| `<slot>` | `{@render children()}` | Svelte 5 (Oct 2024) | Slot content uses snippet/render pattern |
| PostCSS + tailwind.config.js | @tailwindcss/vite + @theme in CSS | Tailwind v4 (Jan 2025) | Config is CSS-first, no JS config file |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 |
| Config file | vitest.config.ts |
| Quick run command | `npm run test` |
| Full suite command | `npm run test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero section renders with title + tagline | unit | `npx vitest run src/lib/components/HomepageHero.test.ts` | Wave 0 |
| HOME-02 | Homepage load returns featured projects for 6 categories | unit | `npx vitest run src/routes/homepage.load.test.ts` | Wave 0 |
| HOME-03 | Accordion expands/collapses one category at a time | manual-only | Manual (requires DOM + transitions) | N/A |
| HOME-04 | About snippet renders with link to /about/ | unit | `npx vitest run src/lib/components/HomepageAboutSnippet.test.ts` | Wave 0 |
| HOME-05 | Press highlights limited to 3 items | unit | `npx vitest run src/routes/homepage.load.test.ts` | Wave 0 |
| PORT-01 | Category page load returns all projects | unit | `npx vitest run src/routes/category.load.test.ts` | Wave 0 |
| PORT-02 | Thumbnail card renders with play overlay | unit | `npx vitest run src/lib/components/VideoThumbnailCard.test.ts` | Wave 0 |
| PORT-05 | Detail page load fetches project by slug | unit | `npx vitest run src/routes/detail.load.test.ts` | Wave 0 |
| PORT-06 | Facade renders thumbnail, not iframe, by default | unit | `npx vitest run src/lib/components/VideoFacade.test.ts` | Wave 0 |
| VID-01 | Lightbox opens/closes, renders iframe when open | manual-only | Manual (requires DOM + focus) | N/A |
| VID-02 | Focus trap cycles through lightbox controls | manual-only | Manual (requires real keyboard events) | N/A |
| VID-03 | Video URL parser extracts Vimeo/YouTube IDs | unit | `npx vitest run src/lib/utils/video.test.ts` | Wave 0 |
| VID-04 | Filmography load returns film projects | unit | `npx vitest run src/routes/filmography.load.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test && npm run check`
- **Phase gate:** Full suite green + `npm run build` succeeds

### Wave 0 Gaps
- [ ] `src/lib/utils/video.test.ts` -- parseVideoUrl unit tests (Vimeo, YouTube, edge cases)
- [ ] `tests/` directory does not exist -- must create
- [ ] Vitest environment may need `jsdom` for component tests (currently `node`)

## Open Questions

1. **Hero video reel source**
   - What we know: D-01 specifies a single featured video reel as the hero centerpiece
   - What's unclear: Is this a dedicated SiteSettings field (heroVideoUrl) or a specially tagged project? Current SiteSettings type has no videoUrl field
   - Recommendation: Add a `heroVideoUrl` and `heroThumbnailUrl` field to SiteSettings in Contentful, OR use a hardcoded Vimeo URL initially and migrate to CMS later

2. **Contentful content availability**
   - What we know: Content types are defined, query functions exist
   - What's unclear: Are there actual entries in Contentful yet? Empty categories will show empty states
   - Recommendation: Build with empty state support from the start (already specified in UI-SPEC copywriting contract)

3. **Copywriting route and nav**
   - What we know: D-02 lists Copywriting as a homepage category, but no route or nav item exists
   - What's unclear: Whether Copywriting should appear in the main nav or just on the homepage
   - Recommendation: Create the route; add to nav only if client confirms (the current 7-item nav is already dense)

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/lib/contentful/queries.ts`, `types.ts`, `image.ts` -- all query patterns and types
- Existing codebase: `src/lib/components/ContentfulImage.svelte` -- established image pattern
- [SvelteKit routing docs](https://svelte.dev/docs/kit/routing) -- dynamic route parameters
- [SvelteKit adapter-static docs](https://svelte.dev/docs/kit/adapter-static) -- entries function for prerendering
- [Svelte transition docs](https://svelte.dev/docs/svelte/svelte-transition) -- fade, slide, scale built-ins
- [Svelte transition directive](https://svelte.dev/docs/svelte/transition) -- usage syntax

### Secondary (MEDIUM confidence)
- [Vimeo embed parameters](https://help.vimeo.com/hc/en-us/articles/12426260232977-About-Player-Parameters) -- autoplay, embed URL format
- [Hidde de Vries -- Focus trapping](https://hidde.blog/using-javascript-to-trap-focus-in-an-element/) -- vanilla JS focus trap pattern
- [UXPin Focus Trap Guide 2026](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/) -- ARIA attributes for modals
- Phase 3 UI-SPEC (.planning/phases/03-portfolio-video/03-UI-SPEC.md) -- all visual specs and interaction contracts

### Tertiary (LOW confidence)
- None -- all findings verified with primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages already installed, no new dependencies
- Architecture: HIGH -- builds on established Phase 1/2 patterns, SvelteKit routing well-documented
- Pitfalls: HIGH -- derived from actual codebase analysis (missing copywriting route, base path requirements)
- Video embed: HIGH -- standard iframe embed patterns, well-documented APIs
- Focus trap: MEDIUM -- hand-rolled implementation, needs thorough keyboard testing

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (stable technologies, no fast-moving dependencies)
