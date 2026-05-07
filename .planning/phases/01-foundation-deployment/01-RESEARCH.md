# Phase 1: Foundation & Deployment - Research

**Researched:** 2026-05-07
**Domain:** SvelteKit scaffolding, Tailwind CSS v4, GitHub Pages static deployment, responsive navigation
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield scaffold: create the SvelteKit project, configure Tailwind v4 via the Vite plugin, set up all route pages as placeholder shells, build a responsive sticky header with mobile drawer navigation, add a minimal footer with social links, and deploy to GitHub Pages as a project site. The entire tech stack is well-documented with current official guides. The main complexity is getting `paths.base` right for a project site deployment and ensuring all internal links use the `base` import.

The `sv create` CLI handles most scaffolding -- selecting the "minimal" template with TypeScript and the `tailwindcss` add-on gets the project 90% of the way. The remaining work is configuring adapter-static, setting up the GitHub Actions deployment workflow, creating the route structure, and building the layout with navigation components.

**Primary recommendation:** Use `npx sv create` with minimal template + TypeScript + tailwindcss add-on, then manually configure adapter-static, paths.base, and the GitHub Actions workflow. Build layout/nav components using Svelte 5 runes ($state) for mobile menu state and built-in Svelte transitions for drawer animation.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** GitHub Pages **project site** deployment (`wolfwdavid.github.io/michelle_ngo_one`). Set `paths.base = '/michelle_ngo_one'` in svelte.config.js. Use `base` from `$app/paths` for all internal links and asset references.
- **D-02:** May migrate to custom domain later -- keep the code easy to switch (just change `paths.base` to `''` and add CNAME). Do not hardcode the repo name anywhere except the config.
- **D-03:** Hamburger icon + **slide-out drawer** from the right on mobile. Clean, familiar, keeps page content partially visible. Fits the minimal Isotope-inspired aesthetic.
- **D-04:** Mobile drawer includes **both navigation links and social icons** (IMDb, LinkedIn, Vimeo, YouTube) at the bottom of the drawer.
- **D-05:** **Sans-serif throughout** -- clean sans-serif for both headings and body text. Modern, professional, matches the minimal Isotope aesthetic.
- **D-06:** **Monochrome palette + one accent color** -- black/dark gray text on white/light gray backgrounds. Single muted accent for links, hover states, and CTAs.
- **D-09:** **Multi-page routes** -- each nav item is a separate page/route. Better for SEO, deep linking, browser history.
- **D-10:** Create **all route pages as placeholder shells**: `/`, `/advertising`, `/film-tv`, `/ux-design`, `/social-transmedia`, `/publishing`, `/about`, `/press`, `/resume`, `/blog`, `/contact`.
- **D-11:** **Flat navigation bar** -- all items visible in a single row on desktop: Home | Advertising | Film-TV | UX Design | Social & Transmedia | Publishing | About. May need smaller text or abbreviations on tablet breakpoint.
- **D-12:** **Minimal footer** -- social icons (IMDb, LinkedIn, Vimeo, YouTube), copyright line, subtle contact link.

### Claude's Discretion
- **D-07:** Claude picks the specific sans-serif font (e.g., Inter, DM Sans, or similar) -- must be clean, professional, and highly legible.
- **D-08:** Claude picks the accent color -- should be muted, complement grayscale video thumbnails, and not overpower the minimal aesthetic.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TECH-01 | Built with SvelteKit and Svelte 5 (runes) | `sv create` minimal template scaffolds SvelteKit 2 + Svelte 5. Use $state rune for mobile menu toggle. |
| TECH-02 | Styled with Tailwind CSS v4 | `sv create --add tailwindcss` or manual setup via @tailwindcss/vite plugin. CSS-first config, no JS config file. |
| TECH-03 | Static site generation via adapter-static for GitHub Pages | Install @sveltejs/adapter-static, set prerender=true in root +layout.js, configure fallback='404.html'. |
| TECH-04 | GitHub Pages deployment with .nojekyll file and correct base path config | paths.base='/michelle_ngo_one', .nojekyll in static/, GitHub Actions workflow with configure-pages + deploy-pages actions. |
| NAV-01 | Sticky header navigation with links: Home, Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, About | Tailwind `sticky top-0` + `z-50` on header. Flat nav bar with all items on desktop. |
| NAV-02 | Navigation is responsive -- collapses to mobile menu on small screens | Tailwind responsive breakpoints (`hidden md:flex` / `md:hidden`). Hamburger toggles slide-out drawer. |
| NAV-03 | Navigation links scroll to or navigate to corresponding sections/pages | Multi-page routes with `<a href="{base}/route">`. Each nav item is a separate route. |
| DES-04 | Responsive design -- mobile, tablet, desktop breakpoints | Tailwind v4 default breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px). |
| DES-05 | Modern typography with clear hierarchy | Sans-serif font via Google Fonts. Tailwind typography scale for headings/body. |
| CONT-06 | Social links in header/footer (IMDb, LinkedIn, Vimeo, YouTube) | SVG icons or simple text links. Present in footer always, in mobile drawer, optional in desktop header. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sveltejs/kit | ^2.59.1 | Application framework | Current stable. Svelte 5 required. Scaffolded by `sv create`. |
| svelte | ^5.55.5 | UI component framework | Current stable. Runes ($state, $derived) for reactivity. Built-in transitions for drawer animation. |
| @sveltejs/adapter-static | ^3.0.10 | Static site generation | Prerenders all pages to static HTML for GitHub Pages. |
| tailwindcss | ^4.2.4 | Utility-first CSS | v4 is CSS-first. No JS config file. @theme directive in CSS. |
| @tailwindcss/vite | ^4.2.4 | Tailwind Vite plugin | Official v4 integration. Replaces PostCSS setup entirely. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Inter (Google Fonts) | Variable | Primary typeface | All text -- headings and body. Clean, highly legible, optimized for screens. |

**Font Recommendation (D-07 -- Claude's Discretion):** Use **Inter** via Google Fonts. Rationale: Inter is the standard choice for clean, minimal portfolio sites. It was designed specifically for computer screens with excellent legibility at all sizes (12-72px). Its neutral character lets portfolio content take center stage without competing for attention. Variable font support means a single file covers all weights. DM Sans is a close alternative but Inter has wider adoption, better small-size rendering, and more extensive OpenType features.

**Accent Color Recommendation (D-08 -- Claude's Discretion):** Use a muted steel blue: `#4A6FA5` (or Tailwind custom `--color-accent`). Rationale: Steel blue complements grayscale video thumbnails without overpowering them. It reads as professional and creative without being flashy. Works well against both white backgrounds and dark text. Accessible contrast ratios on white backgrounds. Alternative: muted teal `#3D8B8B` if a warmer feel is preferred.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inter | DM Sans | Warmer, more humanist feel but slightly less crisp at small sizes. Good alternative if Inter feels too clinical. |
| Inter | system-ui stack | Zero network requests, but inconsistent cross-platform appearance. |

**Installation:**
```bash
# Scaffold project (interactive)
npx sv create .
# Select: minimal template, TypeScript, add tailwindcss

# Then manually install adapter-static
npm install -D @sveltejs/adapter-static
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app.css                    # Tailwind imports + @theme customization (font, accent color)
├── app.html                   # HTML shell with Google Fonts link
├── lib/
│   ├── components/
│   │   ├── Header.svelte      # Sticky header + desktop nav + hamburger button
│   │   ├── MobileDrawer.svelte # Slide-out drawer for mobile nav
│   │   ├── Footer.svelte      # Social icons + copyright
│   │   └── SocialLinks.svelte  # Reusable social icon links (shared by header, footer, drawer)
│   └── config/
│       └── navigation.ts      # Nav items array + social links data (single source of truth)
├── routes/
│   ├── +layout.svelte         # Imports app.css, renders Header + Footer + slot
│   ├── +layout.js             # export const prerender = true
│   ├── +page.svelte           # Homepage placeholder
│   ├── advertising/
│   │   └── +page.svelte       # Placeholder
│   ├── film-tv/
│   │   └── +page.svelte
│   ├── ux-design/
│   │   └── +page.svelte
│   ├── social-transmedia/
│   │   └── +page.svelte
│   ├── publishing/
│   │   └── +page.svelte
│   ├── about/
│   │   └── +page.svelte
│   ├── press/
│   │   └── +page.svelte
│   ├── resume/
│   │   └── +page.svelte
│   ├── blog/
│   │   └── +page.svelte
│   └── contact/
│       └── +page.svelte
└── static/
    └── .nojekyll              # Required for GitHub Pages
```

### Pattern 1: Navigation Data as Single Source of Truth
**What:** Define nav items and social links in one TypeScript file, consumed by Header, MobileDrawer, and Footer.
**When to use:** Always -- prevents nav link drift between components.
**Example:**
```typescript
// src/lib/config/navigation.ts
import { base } from '$app/paths';

export const navItems = [
  { label: 'Home', href: `${base}/` },
  { label: 'Advertising', href: `${base}/advertising` },
  { label: 'Film-TV', href: `${base}/film-tv` },
  { label: 'UX Design', href: `${base}/ux-design` },
  { label: 'Social & Transmedia', href: `${base}/social-transmedia` },
  { label: 'Publishing', href: `${base}/publishing` },
  { label: 'About', href: `${base}/about` },
];

export const socialLinks = [
  { label: 'IMDb', href: 'https://www.imdb.com/name/PLACEHOLDER/', icon: 'imdb' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/PLACEHOLDER/', icon: 'linkedin' },
  { label: 'Vimeo', href: 'https://vimeo.com/user2149742', icon: 'vimeo' },
  { label: 'YouTube', href: 'https://www.youtube.com/PLACEHOLDER', icon: 'youtube' },
];
```

### Pattern 2: Mobile Drawer with Svelte 5 Runes + Transitions
**What:** Use `$state` for open/close toggle, Svelte `fly` transition for slide-in animation.
**When to use:** Mobile menu implementation (D-03).
**Example:**
```svelte
<!-- Header.svelte -->
<script lang="ts">
  import { fly } from 'svelte/transition';
  import { navItems, socialLinks } from '$lib/config/navigation';

  let drawerOpen = $state(false);
</script>

{#if drawerOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/30 z-40"
    onclick={() => drawerOpen = false}
    role="presentation"
  ></div>
  <!-- Drawer -->
  <nav
    transition:fly={{ x: 300, duration: 300 }}
    class="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-lg p-6 flex flex-col"
  >
    <!-- Nav links -->
    {#each navItems as item}
      <a href={item.href} class="py-3 text-lg" onclick={() => drawerOpen = false}>
        {item.label}
      </a>
    {/each}
    <!-- Social links at bottom -->
    <div class="mt-auto flex gap-4">
      {#each socialLinks as link}
        <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
      {/each}
    </div>
  </nav>
{/if}
```

### Pattern 3: Sticky Header with Responsive Nav
**What:** Desktop shows all nav items inline; mobile shows hamburger only. `sticky top-0` keeps header visible.
**When to use:** Layout component.
**Example:**
```svelte
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <!-- Logo/Name -->
    <a href="{base}/" class="text-xl font-semibold tracking-tight">Michelle Ngo</a>

    <!-- Desktop nav -->
    <nav class="hidden lg:flex items-center gap-6 text-sm">
      {#each navItems as item}
        <a href={item.href} class="hover:text-accent transition-colors">{item.label}</a>
      {/each}
    </nav>

    <!-- Hamburger (mobile only) -->
    <button class="lg:hidden" onclick={() => drawerOpen = true} aria-label="Open menu">
      <!-- hamburger SVG icon -->
    </button>
  </div>
</header>
```

### Pattern 4: Base Path Usage
**What:** All internal links and assets MUST use `base` from `$app/paths`.
**When to use:** Every `<a href>`, every image `src` that references local assets.
**Critical for:** D-01 (project site deployment) and D-02 (future custom domain migration).
**Example:**
```svelte
<script>
  import { base } from '$app/paths';
</script>
<a href="{base}/about">About</a>
<img src="{base}/images/logo.svg" alt="Logo" />
```

### Anti-Patterns to Avoid
- **Hardcoding `/michelle_ngo_one`:** Never embed the repo name in component code. Use `base` import exclusively. Only `svelte.config.js` should reference it.
- **Using Svelte stores for simple state:** Mobile menu open/close is a $state rune, not a writable store. Stores are deprecated in Svelte 5.
- **Using `tailwind.config.js`:** Tailwind v4 is CSS-first. Use `@theme` directive in `app.css` for customization.
- **SPA fallback mode:** Don't use `fallback: '200.html'`. GitHub Pages doesn't support SPA routing. Use full prerendering with `fallback: '404.html'`.
- **Missing `trailingSlash: 'always'`:** GitHub Pages serves `/about/index.html` but not `/about.html`. Must set trailingSlash to avoid 404s.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive breakpoints | Custom media queries | Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) | Consistent, well-tested breakpoints. Everyone on the team reads them the same way. |
| Slide animation | CSS keyframes + JS toggle | Svelte `fly` transition | Built-in, declarative, handles mount/unmount automatically. Zero dependencies. |
| Sticky header | IntersectionObserver scroll logic | CSS `sticky top-0` | Pure CSS solution. No JS needed. Works everywhere. |
| Icon system | Custom SVG sprite system | Inline SVGs in components | Only 4-5 social icons needed. No build tool required. Copy SVG paths directly. |
| GitHub Pages deployment | Manual build + push | GitHub Actions workflow | Automated on every push to main. Uses official actions. |

**Key insight:** This phase has zero need for external libraries beyond the core stack. Svelte's built-in transitions, Tailwind's utilities, and CSS sticky positioning handle every UI requirement.

## Common Pitfalls

### Pitfall 1: Broken Asset Paths on GitHub Pages
**What goes wrong:** Site works locally but images, CSS, and JS fail to load on GitHub Pages because paths don't include the repo name prefix.
**Why it happens:** Local dev serves from root `/`, but GitHub Pages project sites serve from `/repo-name/`.
**How to avoid:** Set `paths.base` in `svelte.config.js`. Use `import { base } from '$app/paths'` in every component. Never use bare `/` paths for internal links or assets.
**Warning signs:** 404 errors in browser console on the deployed site. Broken images. Unstyled pages.

### Pitfall 2: Missing .nojekyll File
**What goes wrong:** GitHub Pages ignores files/folders starting with underscore (like `_app/` which SvelteKit generates).
**Why it happens:** GitHub Pages uses Jekyll by default, which skips `_` prefixed paths.
**How to avoid:** Add an empty `.nojekyll` file to `static/` directory. It gets copied to the build output root.
**Warning signs:** CSS and JS bundles return 404 on the deployed site even though HTML loads.

### Pitfall 3: 404s on Direct Page Navigation
**What goes wrong:** Navigating directly to `/about` returns 404, but clicking links within the app works.
**Why it happens:** GitHub Pages looks for `/about.html` or `/about/index.html`. Without `trailingSlash: 'always'`, SvelteKit generates `/about.html` which GitHub Pages doesn't serve for the `/about` URL.
**How to avoid:** Set `trailingSlash: 'always'` in `svelte.config.js` so SvelteKit generates `/about/index.html` instead.
**Warning signs:** Links work when navigating within the app (client-side routing) but fail on page refresh or direct URL access.

### Pitfall 4: Missing prerender Export
**What goes wrong:** Build fails with "prerender is not set" errors.
**Why it happens:** adapter-static requires all pages to be prerenderable. The root `+layout.js` must export `prerender = true`.
**How to avoid:** Create `src/routes/+layout.js` with `export const prerender = true;`. This applies to all pages.
**Warning signs:** Build error: "The following routes were marked as prerenderable, but were not prerendered..."

### Pitfall 5: Tailwind v4 Config Confusion
**What goes wrong:** Creating `tailwind.config.js` or using `@tailwind base/components/utilities` directives.
**Why it happens:** Outdated tutorials and muscle memory from Tailwind v3.
**How to avoid:** Use `@import "tailwindcss"` in `app.css`. Use `@theme` directive for customization. Use `@tailwindcss/vite` plugin in vite.config.ts. No JS config file.
**Warning signs:** "tailwind.config.js is not supported" warnings. Styles not applying.

### Pitfall 6: Flat Nav Bar Overflow on Tablet
**What goes wrong:** 7 nav items ("Home | Advertising | Film-TV | UX Design | Social & Transmedia | Publishing | About") overflow on tablet screens (768-1024px).
**Why it happens:** That's a lot of items for a horizontal bar. "Social & Transmedia" alone is 20 characters.
**How to avoid:** Use `lg:` breakpoint (1024px) instead of `md:` (768px) for showing the full nav bar. Consider abbreviating "Social & Transmedia" to "Social" on tablet. Test at 1024px width specifically.
**Warning signs:** Nav items wrapping to second line, overlapping, or getting cut off.

## Code Examples

### svelte.config.js (Complete)
```javascript
// Source: SvelteKit adapter-static docs + GitHub Pages guide
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.argv.includes('dev') ? '' : '/michelle_ngo_one'
    },
    trailingSlash: 'always'
  }
};

export default config;
```

### vite.config.ts (Tailwind v4)
```typescript
// Source: Tailwind CSS official SvelteKit guide
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit()
  ]
});
```

### src/routes/+layout.js
```javascript
// Required for adapter-static: prerender all pages
export const prerender = true;
```

### src/routes/+layout.svelte
```svelte
<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<Header />
<main class="min-h-screen">
  {@render children()}
</main>
<Footer />
```

### src/app.css (Tailwind v4 + Custom Theme)
```css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --color-accent: #4A6FA5;
  --color-accent-hover: #3B5D8C;
}
```

### app.html (Google Fonts)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap" rel="stylesheet" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

### GitHub Actions Workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'build/'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Svelte stores (writable) | Svelte 5 runes ($state, $derived) | Svelte 5 (late 2024) | All component state uses runes. Do not use writable/readable/derived stores. |
| tailwind.config.js | @theme in CSS file | Tailwind v4 (early 2025) | CSS-first configuration. No JS config file needed. |
| PostCSS + autoprefixer | @tailwindcss/vite plugin | Tailwind v4 (early 2025) | Single Vite plugin replaces PostCSS chain. |
| @tailwind base/components/utilities | @import "tailwindcss" | Tailwind v4 (early 2025) | Single import replaces three directives. |
| gh-pages npm package | GitHub Actions (deploy-pages) | 2023+ | No deploy key management. Built into GitHub. Official actions. |
| adapter-auto | adapter-static (explicit) | N/A (always preferred for known targets) | Explicit target is clearer and avoids auto-detection issues. |

**Deprecated/outdated:**
- `{#slot}` syntax replaced by `{@render children()}` in Svelte 5
- `export let` props replaced by `let { prop } = $props()` in Svelte 5
- `$:` reactive statements replaced by `$derived` and `$effect` in Svelte 5

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build + dev server | Yes | 22.13.0 | -- |
| npm | Package management | Yes | 10.9.2 | -- |
| git | Version control + deployment | Yes | 2.46.0 | -- |
| gh CLI | GitHub Pages setup | No | -- | Configure Pages settings via GitHub web UI |

**Missing dependencies with no fallback:**
- None -- all critical tools are available.

**Missing dependencies with fallback:**
- `gh` CLI not installed. GitHub repo creation and Pages configuration can be done via the GitHub web UI instead.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (scaffolded by sv create if selected) + Playwright |
| Config file | None -- Wave 0 setup needed |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npm run build && npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TECH-01 | SvelteKit + Svelte 5 scaffolded | smoke | `npm run build` (build succeeds) | N/A -- build command |
| TECH-02 | Tailwind CSS v4 active | smoke | `npm run build` (no Tailwind errors) | N/A -- build command |
| TECH-03 | Static generation works | smoke | `npm run build && ls build/index.html` | N/A -- build output check |
| TECH-04 | .nojekyll exists, base path correct | unit | `npx vitest run tests/config.test.ts -x` | No -- Wave 0 |
| NAV-01 | Sticky header with correct links | e2e | `npx playwright test tests/navigation.spec.ts` | No -- Wave 0 |
| NAV-02 | Mobile menu collapses/expands | e2e | `npx playwright test tests/navigation.spec.ts` | No -- Wave 0 |
| NAV-03 | Links navigate to correct routes | e2e | `npx playwright test tests/navigation.spec.ts` | No -- Wave 0 |
| DES-04 | Responsive at 3 breakpoints | e2e/manual | `npx playwright test tests/responsive.spec.ts` | No -- Wave 0 |
| DES-05 | Typography hierarchy visible | manual-only | Visual inspection | N/A |
| CONT-06 | Social links present in header/footer | e2e | `npx playwright test tests/navigation.spec.ts` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (ensures static generation works)
- **Per wave merge:** `npm run build && npx vitest run && npx playwright test`
- **Phase gate:** Full suite green + deployed site accessible at GitHub Pages URL

### Wave 0 Gaps
- [ ] `vitest` + `@testing-library/svelte` -- install if not selected during sv create
- [ ] `playwright` -- install if not selected during sv create (`npx sv add playwright`)
- [ ] `tests/config.test.ts` -- verify .nojekyll, base path config
- [ ] `tests/navigation.spec.ts` -- e2e nav tests (links, mobile drawer, social icons)
- [ ] `tests/responsive.spec.ts` -- viewport tests at 375px, 768px, 1280px

## Open Questions

1. **Michelle's actual social URLs**
   - What we know: Vimeo is vimeo.com/user2149742. IMDb, LinkedIn, YouTube URLs are unknown.
   - What's unclear: Exact profile URLs for all four social platforms.
   - Recommendation: Use placeholder URLs in Phase 1 (e.g., `https://www.imdb.com/name/PLACEHOLDER/`). Replace with real URLs when known. The SocialLinks component should pull from a config file for easy updating.

2. **GitHub repo existence**
   - What we know: Decision D-01 references `wolfwdavid/michelle_ngo_one` as the deployment target.
   - What's unclear: Whether the repo already exists or needs to be created. Whether GitHub Pages is already enabled.
   - Recommendation: Planner should include a task to verify/create the repo and enable GitHub Pages (Settings > Pages > Source: GitHub Actions).

3. **Tablet nav bar fit**
   - What we know: 7 nav items may not fit at 768-1024px widths (Pitfall 6).
   - What's unclear: Exact text width at chosen font size.
   - Recommendation: Use `lg:` (1024px) as the desktop breakpoint. Between 768-1024px, consider either showing hamburger or abbreviating long labels.

## Sources

### Primary (HIGH confidence)
- [SvelteKit adapter-static docs](https://svelte.dev/docs/kit/adapter-static) -- GitHub Pages config, fallback, trailingSlash
- [Tailwind CSS SvelteKit installation guide](https://tailwindcss.com/docs/guides/sveltekit) -- Official v4 setup with @tailwindcss/vite
- [sv create docs](https://svelte.dev/docs/cli/sv-create) -- CLI options, templates, add-ons
- npm registry -- verified versions: @sveltejs/kit@2.59.1, svelte@5.55.5, tailwindcss@4.2.4, @tailwindcss/vite@4.2.4, @sveltejs/adapter-static@3.0.10

### Secondary (MEDIUM confidence)
- [GitHub Actions SvelteKit workflow gist](https://gist.github.com/CarlosGDCJ/747032bea4f8506faeca1cffc926abaf) -- Workflow structure verified against official GitHub Actions docs
- [SvelteKit GitHub Pages deployment guide (2026)](https://florinasutanto.com/blog/2026/deploy-sveltekit-to-gh-pages) -- paths.base pattern confirmed
- [FontFYI best sans-serif fonts 2026](https://fontfyi.com/blog/best-sans-serif-fonts-2026/) -- Inter recommendation
- [Figma best fonts for websites 2026](https://www.figma.com/resource-library/best-fonts-for-websites/) -- Inter as standard choice

### Tertiary (LOW confidence)
- None -- all findings verified with official or multiple sources.

## Project Constraints (from CLAUDE.md)

- **Framework**: SvelteKit (client requirement)
- **CMS**: Contentful (not needed in Phase 1, but architecture should not conflict)
- **Hosting**: GitHub Pages with adapter-static
- **Svelte 5 runes only**: Do not use writable/readable stores. Use $state, $derived, $effect.
- **Tailwind v4 only**: No tailwind.config.js, no PostCSS config. Use @tailwindcss/vite plugin and @theme in CSS.
- **No GSAP, svelte-motion**: Use built-in Svelte transitions (fade, fly, scale)
- **No adapter-auto**: Use adapter-static explicitly
- **No SPA mode**: Full prerendering, no fallback: '200.html'
- **No heavy video players**: Not relevant to Phase 1, but noted
- **paths.base required**: Use `base` from `$app/paths` for all internal links

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified on npm, official docs consulted
- Architecture: HIGH -- standard SvelteKit patterns, well-documented
- Pitfalls: HIGH -- GitHub Pages deployment is well-known, pitfalls documented across multiple sources

**Research date:** 2026-05-07
**Valid until:** 2026-06-07 (stable stack, 30-day validity)
