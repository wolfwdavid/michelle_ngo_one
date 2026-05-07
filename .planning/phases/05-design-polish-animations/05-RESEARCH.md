# Phase 5: Design Polish & Animations - Research

**Researched:** 2026-05-07
**Domain:** Svelte 5 animations, SvelteKit page transitions, scroll-triggered effects, CSS motion
**Confidence:** HIGH

## Summary

Phase 5 adds three layers of visual polish to an already-complete SvelteKit static portfolio: (1) scroll-triggered fade-up entrance animations on content blocks, (2) crossfade page transitions between routes, and (3) visual refinement including uniform card treatment, hover effects, skeleton loading placeholders, and spacing consistency. All animation needs are covered by existing dependencies -- svelte-inview v4.0.4 for viewport detection and Svelte's built-in `fade`/`fly` transitions. No new npm packages are required.

The implementation follows established codebase patterns: ContentfulImage already uses `svelte-inview` with `oninview_enter`, VideoLightbox uses `fade` + `scale` transitions, and HomepageCategorySection uses `slide` with `cubicOut`. Phase 5 extends these patterns site-wide with a shared animation utility (Svelte action or wrapper component) and a page transition wrapper in `+layout.svelte`.

**Primary recommendation:** Create a reusable `ScrollReveal` wrapper component (or `use:scrollFadeIn` action) that encapsulates the svelte-inview + CSS transition pattern, then apply it to content blocks across all pages. Use the `{#key page.url.pathname}` pattern with `fade` transition in `+layout.svelte` for page transitions. Add `@keyframes shimmer` to `app.css` for skeleton placeholders.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Fade-up entrance -- elements fade in (opacity 0 to 1) while rising 20px (translateY). Duration ~400ms with ease-out easing.
- **D-02:** Subtle stagger for groups -- items in grids/lists delay ~75ms between each other, creating a gentle cascade left-to-right/top-to-bottom.
- **D-03:** Content blocks only -- animate video thumbnail cards/grids, category sections, about photo+bio, press items, blog cards, resume section cards, discipline cards. Do NOT animate headers/titles, nav, footer, breadcrumbs, body text, or form fields.
- **D-04:** Animate once only -- elements animate the first time they enter viewport, then stay visible. No re-triggering on scroll back.
- **D-05:** Crossfade between routes -- old page fades out, new page fades in. Duration ~250ms. Implemented in +layout.svelte using SvelteKit page transition pattern.
- **D-06:** Always scroll to top on route change -- every navigation starts at the top of the new page.
- **D-07:** Targeted fixes pass -- unify hover effects, tighten spacing rhythm, ensure accent color (#4A6FA5) usage consistency, uniform card shadow/border treatment, focus ring styling for accessibility.
- **D-08:** Skeleton placeholders for loading states -- animated shimmer/pulse gray rectangles matching content layout.
- **D-09:** Respect prefers-reduced-motion fully -- disable all scroll animations and page transitions when OS setting is enabled.
- **D-10:** Subtle & restrained intensity -- 200-400ms durations, 10-20px distances, ease-out easing.

### Claude's Discretion
- Specific easing curves (ease-out vs cubic-bezier) -- pick what feels best per element
- Skeleton placeholder design details (pulse speed, gray shade, border radius)
- Whether to create a shared animation utility/action or inline transitions per component
- Exact stagger delay per component type (grids vs lists may differ slightly)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DES-01 | Clean, minimal aesthetic inspired by Isotope Films -- light backgrounds, ample whitespace | Visual refinement pass (D-07): uniform card treatment, spacing rhythm, accent color consistency. Existing color palette and typography are locked from Phase 1. |
| DES-02 | Subtle scroll animations (fade-in on scroll) using Svelte transitions | ScrollReveal utility using svelte-inview v4 + CSS transitions. Fade-up (opacity + translateY) with 400ms ease-out, stagger 75ms, once-only trigger. |
| DES-03 | Animated page transitions between routes | `{#key page.url.pathname}` + `fade` transition in +layout.svelte, 250ms duration. `afterNavigate` for scroll-to-top. Grid overlay pattern for smooth crossfade. |

</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| svelte-inview | 4.0.4 | Intersection Observer wrapper | Already installed and used in ContentfulImage. Provides `use:inview` action with `oninview_enter` callback. Svelte 5 compatible. |
| svelte/transition | (built-in) | fade, fly, scale, slide | Svelte built-in module. Already used in VideoLightbox (fade+scale), HomepageCategorySection (slide), contact page (fade). |
| svelte/easing | (built-in) | cubicOut and other easing functions | Already used in HomepageCategorySection. |
| $app/state | (SvelteKit built-in) | page.url for route-change detection | Svelte 5 replacement for $app/stores. Provides reactive `page` object without store subscription syntax. Available since SvelteKit 2.12. |
| $app/navigation | (SvelteKit built-in) | afterNavigate for scroll reset | Provides lifecycle hooks for navigation events. |

### No New Dependencies Needed
This phase requires zero new npm packages. Everything is covered by svelte-inview (installed), Svelte built-ins, and CSS.

## Architecture Patterns

### Recommended Project Structure (additions for Phase 5)
```
src/
  lib/
    components/
      ScrollReveal.svelte    # NEW: shared scroll animation wrapper
      SkeletonCard.svelte     # NEW: shimmer placeholder component
  routes/
    +layout.svelte            # MODIFIED: add page transition wrapper
  app.css                     # MODIFIED: add shimmer keyframes + reduced-motion
```

### Pattern 1: ScrollReveal Wrapper Component
**What:** A reusable wrapper component that fades elements in when they enter the viewport.
**When to use:** Wrap any content block that should animate on scroll (per D-03 element list).
**Example:**
```svelte
<!-- src/lib/components/ScrollReveal.svelte -->
<script lang="ts">
  import { inview } from 'svelte-inview';

  let {
    children,
    delay = 0,
    class: className = '',
  }: {
    children: import('svelte').Snippet;
    delay?: number;
    class?: string;
  } = $props();

  let isVisible = $state(false);

  function handleEnter() {
    isVisible = true;
  }
</script>

<div
  use:inview={{ threshold: 0.1, unobserveOnEnter: true }}
  oninview_enter={handleEnter}
  class="scroll-reveal {className}"
  class:scroll-reveal--visible={isVisible}
  style:transition-delay="{delay}ms"
>
  {@render children()}
</div>

<style>
  .scroll-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 400ms ease-out, transform 400ms ease-out;
  }
  .scroll-reveal--visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
```
**Usage in pages:**
```svelte
<ScrollReveal>
  <VideoThumbnailCard {project} />
</ScrollReveal>

<!-- With stagger in grid -->
{#each items as item, i}
  <ScrollReveal delay={i * 75}>
    <Card {item} />
  </ScrollReveal>
{/each}
```

**Why a wrapper component over a Svelte action:** A wrapper component is simpler to implement because it owns the DOM element and can use `class:` directives and Svelte scoped styles. A `use:action` would need to manipulate styles imperatively, which is more fragile. The wrapper pattern also clearly shows animation intent in template markup.

### Pattern 2: SvelteKit Page Transition (Svelte 5)
**What:** Crossfade between routes using `{#key}` block in layout.
**When to use:** Applied once in `+layout.svelte`.
**Example:**
```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import SEO from '$lib/components/SEO.svelte';

  let { data, children } = $props();

  afterNavigate(() => {
    window.scrollTo(0, 0);
  });

  // Check reduced motion preference
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const transitionDuration = reducedMotion ? 0 : 250;
</script>

<SEO
  title={data.siteSettings?.siteTitle ?? 'Michelle Ngo'}
  description="Portfolio of Michelle Ngo"
/>

<Header />
<main class="min-h-screen page-transition-container">
  {#key page.url.pathname}
    <div
      class="page-transition-panel"
      in:fade={{ duration: transitionDuration, delay: transitionDuration }}
      out:fade={{ duration: transitionDuration }}
    >
      {@render children()}
    </div>
  {/key}
</main>
<Footer />

<style>
  .page-transition-container {
    display: grid;
  }
  .page-transition-panel {
    grid-column-start: 1;
    grid-row-start: 1;
  }
</style>
```
**Source:** Verified pattern from [refact0r.dev blog post](https://www.refact0r.dev/blog/spatial-page-transitions) and [SvelteKit docs](https://svelte.dev/docs/kit/$app-navigation)

**Critical details:**
- `display: grid` on the container allows old and new pages to overlap during the crossfade (both occupy same grid cell).
- `in:fade` needs a `delay` equal to the `out:fade` duration so the new page doesn't appear until the old one fades out.
- `afterNavigate` is the correct hook for scroll-to-top (fires after navigation is complete).
- `$app/state` provides `page` as a reactive object (Svelte 5 pattern) -- no `$` prefix needed unlike `$app/stores`.

### Pattern 3: Skeleton Shimmer with CSS Keyframes
**What:** Animated loading placeholder with gradient sweep.
**When to use:** Skeleton states for video cards, blog cards, press items, resume sections.
**Example:**
```css
/* In app.css */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
  }
}
```

```svelte
<!-- SkeletonCard.svelte -->
<div
  class="skeleton-shimmer rounded-sm"
  style="aspect-ratio: 16/9; background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%); background-size: 200% 100%; animation: shimmer 1500ms ease-in-out infinite;"
  role="status"
  aria-label="Loading content..."
>
  <span class="sr-only">Loading content...</span>
</div>
```

### Anti-Patterns to Avoid
- **Animating everything:** Only content blocks per D-03. Headers, nav, footer, breadcrumbs, body text, and form fields must NOT animate.
- **Re-triggering animations on scroll-back:** Use `unobserveOnEnter: true` in svelte-inview to fire once only (D-04).
- **Using `$app/stores` instead of `$app/state`:** The project uses Svelte 5 runes. Use `page` from `$app/state` (no `$` prefix), not `$page` from `$app/stores`.
- **Forgetting the grid overlay for page transitions:** Without `display: grid`, old and new pages stack vertically during crossfade, causing a jarring flash.
- **Using `beforeNavigate` for scroll-to-top:** This fires before navigation completes. Use `afterNavigate` instead.
- **Applying `transition:fade` to the `{@render children()}` directly:** Transitions must go on DOM elements, not render tags. Wrap in a `<div>`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Viewport detection | Custom IntersectionObserver wrapper | svelte-inview (already installed) | Already used in ContentfulImage, handles observer lifecycle, Svelte 5 compatible |
| Page transitions | Custom navigation event handling | SvelteKit `{#key}` + `fade` | Standard SvelteKit pattern, handles mount/unmount lifecycle correctly |
| Reduced motion detection | Per-component media query checks | Global CSS `@media (prefers-reduced-motion: reduce)` + one JS check | CSS handles 90% of cases; one `matchMedia` check in layout covers Svelte transitions |
| Scroll-to-top on navigate | Custom scroll handling | `afterNavigate` from `$app/navigation` | Built-in SvelteKit hook, fires at the right lifecycle point |
| Stagger timing | Manual setTimeout chains | CSS `transition-delay` via `style` attribute | Declarative, no JS timing issues, works with CSS transition approach |

## Common Pitfalls

### Pitfall 1: Page Transition Flash / Layout Shift
**What goes wrong:** Old and new pages both render simultaneously during crossfade, causing the page to be twice as tall momentarily.
**Why it happens:** Default block layout stacks both keyed elements vertically.
**How to avoid:** Use `display: grid` on the container with both panels in `grid-column-start: 1; grid-row-start: 1` so they overlap in the same space.
**Warning signs:** Page height doubles briefly during navigation, footer jumps.

### Pitfall 2: Scroll Position Fights with Page Transition
**What goes wrong:** Page scrolls to top mid-transition, causing visual glitch as old content jumps.
**Why it happens:** Using `beforeNavigate` or `onNavigate` to reset scroll, which fires before the transition completes.
**How to avoid:** Use `afterNavigate` for scroll-to-top. This fires after the new page is mounted.
**Warning signs:** Content jumps to top before fade-out completes.

### Pitfall 3: svelte-inview Fires Immediately for Above-the-Fold Elements
**What goes wrong:** Elements visible on page load immediately trigger the animation, causing a flash from invisible to visible.
**Why it happens:** IntersectionObserver fires on initial observe if element is already in viewport.
**How to avoid:** For hero/above-the-fold content, either don't wrap in ScrollReveal (per D-03, hero is excluded), or handle the initial state carefully. The `threshold: 0.1` helps but above-fold elements will still trigger instantly.
**Warning signs:** Flash of invisible content at page top on load.

### Pitfall 4: Stagger Delay Accumulates Too Much in Large Grids
**What goes wrong:** Last items in a 50-item grid have 3750ms delay (50 * 75ms), feeling sluggish.
**Why it happens:** Linear stagger across all items.
**How to avoid:** Cap the maximum delay (e.g., max 6 items worth = 450ms), or only stagger items visible in the first viewport.
**Warning signs:** Bottom-of-grid items take noticeably long to appear.

### Pitfall 5: Reduced Motion Not Applied to Svelte Transitions
**What goes wrong:** CSS `prefers-reduced-motion` rule disables CSS transitions but Svelte's JS-driven `transition:fade` still runs.
**Why it happens:** Svelte transitions use JS animation frames, not CSS transitions.
**How to avoid:** For Svelte `transition:` directives (like page transitions), check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and set `duration: 0`. For CSS class-based transitions (like ScrollReveal), the CSS media query handles it.
**Warning signs:** Page crossfade still animates with reduced motion enabled.

### Pitfall 6: SSR Errors from window/matchMedia Access
**What goes wrong:** `window.matchMedia` throws during server-side rendering.
**Why it happens:** SvelteKit prerenders pages on the server where `window` is undefined.
**How to avoid:** Guard with `typeof window !== 'undefined'` or use `browser` from `$app/environment`. Default to `false` (animations enabled) on server.
**Warning signs:** Build fails with "window is not defined" error.

## Code Examples

### Stagger Pattern for Grids
```svelte
<!-- In a category page grid -->
{#each projects as project, i}
  <ScrollReveal delay={Math.min(i, 6) * 75}>
    <VideoThumbnailCard
      thumbnailUrl={project.thumbnailUrl}
      title={project.title}
      videoUrl={project.videoUrl ?? ''}
      onclick={() => onPlayVideo(projects, i)}
      href="{base}/{category.slug}/{project.slug}/"
    />
  </ScrollReveal>
{/each}
```

### Global Reduced Motion CSS
```css
/* app.css addition */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .skeleton-shimmer {
    animation: none !important;
  }
}
```

### Uniform Card Treatment
```svelte
<!-- Consistent card wrapper pattern for VideoThumbnailCard, blog cards, etc. -->
<div class="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-out overflow-hidden">
  <!-- card content -->
</div>
```

### Focus Ring Pattern
```css
/* app.css addition -- global focus-visible styling */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.5 |
| Config file | vitest.config.ts |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DES-01 | Visual refinement (spacing, hover, card treatment) | manual | Visual inspection in browser | N/A |
| DES-02 | ScrollReveal component renders with correct initial styles; applies visible class | unit | `npx vitest run src/lib/components/scroll-reveal.test.ts -x` | Wave 0 |
| DES-02 | prefers-reduced-motion disables animation (CSS) | manual | Check with OS setting toggled | N/A |
| DES-03 | Page transition layout has grid overlay styles | unit | `npx vitest run src/routes/layout-transition.test.ts -x` | Wave 0 |
| DES-03 | afterNavigate scroll-to-top is wired | unit | `npx vitest run src/routes/layout-transition.test.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green + visual smoke test in browser

### Wave 0 Gaps
- [ ] `src/lib/components/scroll-reveal.test.ts` -- covers ScrollReveal utility logic (CSS class application, delay prop)
- [ ] `src/routes/layout-transition.test.ts` -- covers page transition wiring (grid class exists, afterNavigate imported)

Note: Most DES-01 and DES-02/DES-03 visual correctness is inherently manual (requires browser). Unit tests can verify component structure and props but not visual animation quality. The existing test environment is `node` (no jsdom), so component rendering tests are limited. Tests should focus on exported logic and structural assertions.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `$app/stores` ($page) | `$app/state` (page) | SvelteKit 2.12 | Use `page.url.pathname` directly, no $ prefix |
| `<slot/>` in layouts | `{@render children()}` | Svelte 5 | Snippet-based rendering, changes how {#key} wraps content |
| `on:inview_enter` | `oninview_enter` | svelte-inview v4 | Svelte 5 event syntax (no colon) |
| writable/readable stores | $state/$derived runes | Svelte 5 | All component state uses runes |

## Open Questions

1. **Grid overlay and min-height interaction**
   - What we know: The `main` element has `min-h-screen`. The page transition grid overlay needs both old and new pages in the same grid cell.
   - What's unclear: Whether `min-h-screen` on the grid container causes layout issues during transition.
   - Recommendation: Test during implementation. May need to move `min-h-screen` inside the transition panel div.

2. **Static site and skeleton relevance**
   - What we know: This is a fully prerendered static site. All content is baked at build time.
   - What's unclear: Whether skeleton placeholders will ever actually show (no runtime data fetching).
   - Recommendation: Per D-08, implement them anyway for perceived quality. They may show briefly during hydration or if CMS data is sparse. Keep implementation lightweight.

## Sources

### Primary (HIGH confidence)
- svelte-inview v4.0.4 -- already installed, `oninview_enter` pattern verified from existing ContentfulImage.svelte usage
- Svelte transition module -- verified from existing VideoLightbox.svelte (`fade`, `scale`) and HomepageCategorySection.svelte (`slide`, `cubicOut`)
- [SvelteKit $app/navigation docs](https://svelte.dev/docs/kit/$app-navigation) -- `afterNavigate` API verified
- [SvelteKit $app/state docs](https://svelte.dev/docs/kit/$app-state) -- `page` reactive object (Svelte 5 replacement for $app/stores)

### Secondary (MEDIUM confidence)
- [refact0r.dev spatial page transitions](https://www.refact0r.dev/blog/spatial-page-transitions) -- Svelte 5 `{#key page.url.pathname}` + `{@render children?.()}` pattern with grid overlay (Feb 2025)
- [joyofcode.xyz SvelteKit page transitions](https://joyofcode.xyz/sveltekit-page-transitions) -- `{#key}` + `in:fade`/`out:fade` delay pattern

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies already installed, patterns verified from existing codebase
- Architecture: HIGH -- ScrollReveal pattern follows existing ContentfulImage + svelte-inview pattern; page transition pattern verified from multiple sources
- Pitfalls: HIGH -- common issues well-documented; grid overlay requirement verified from multiple implementations

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (stable -- Svelte 5 and svelte-inview v4 are mature)
