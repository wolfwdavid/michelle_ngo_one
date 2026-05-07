# Phase 1: Foundation & Deployment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 01-foundation-deployment
**Areas discussed:** Deployment target, Mobile menu style, Typography & color, Page structure

---

## Deployment Target

| Option | Description | Selected |
|--------|-------------|----------|
| Custom domain | michellengo.net pointed at GitHub Pages. paths.base stays empty string. Requires DNS config. | |
| Project site | username.github.io/repo-name. Requires paths.base = '/repo-name'. Works immediately. | ✓ |
| User site | username.github.io (no subpath). Requires repo named username.github.io. | |

**User's choice:** Project site
**Notes:** May add custom domain later — build with base path but keep the code easy to switch.

### Follow-up: Long-term plans

| Option | Description | Selected |
|--------|-------------|----------|
| Project site for now | May add custom domain later. Keep code easy to switch. | ✓ |
| Project site forever | No custom domain planned. Commit fully to base path. | |

**User's choice:** Project site for now

---

## Mobile Menu Style

| Option | Description | Selected |
|--------|-------------|----------|
| Hamburger + slide drawer | Classic hamburger, nav slides from right. Clean, familiar, Isotope-inspired. | ✓ |
| Hamburger + full overlay | Full-screen overlay with large centered nav links. More dramatic. | |
| Hamburger + dropdown | Simple dropdown below header. Least animated, most compact. | |

**User's choice:** Hamburger + slide drawer

### Follow-up: Social links in drawer

| Option | Description | Selected |
|--------|-------------|----------|
| Nav + social icons | Show nav links and social icons at bottom of drawer. | ✓ |
| Nav only | Just page links. Social lives in footer only. | |

**User's choice:** Nav + social icons

---

## Typography & Color

### Font Direction

| Option | Description | Selected |
|--------|-------------|----------|
| Sans-serif throughout | Clean sans-serif for headings and body. Matches minimal Isotope aesthetic. | ✓ |
| Serif headings + sans body | Serif for headings paired with sans body. More editorial/cinematic feel. | |
| System fonts only | No custom fonts. Fastest load, zero layout shift. Less distinctive. | |
| You decide | Claude picks a font pairing. | |

**User's choice:** Sans-serif throughout

### Color Palette

| Option | Description | Selected |
|--------|-------------|----------|
| Monochrome + one accent | Black/gray on white with single accent for links, hovers, CTAs. | ✓ |
| Pure monochrome | Black, white, grays only. Maximum minimalism. | |
| You decide | Claude picks palette. | |

**User's choice:** Monochrome + one accent

### Accent Color

| Option | Description | Selected |
|--------|-------------|----------|
| You decide | Claude picks a tasteful, muted accent color. | ✓ |
| Muted blue/teal | Cool, professional, complements grayscale thumbnails. | |
| Warm gold/amber | Warmth and sophistication against monochrome. | |

**User's choice:** You decide (Claude's discretion)

---

## Page Structure

### Routing Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Multi-page routes | Each nav item is a separate page/route. Better for SEO, deep linking. | ✓ |
| Single page + sections | One long page with scroll sections. Simpler but harder to manage. | |
| Hybrid | Homepage previews + dedicated category pages. Best of both. | |

**User's choice:** Multi-page routes

### Placeholder Pages

| Option | Description | Selected |
|--------|-------------|----------|
| All routes as shells | Create placeholder pages for every nav item. Nav works end-to-end. | ✓ |
| Core routes only | Just /, /about, and one category template. Other routes added later. | |

**User's choice:** All routes as shells

### Header Organization

| Option | Description | Selected |
|--------|-------------|----------|
| Flat nav bar | All items visible in single row. Simple, direct. | ✓ |
| Grouped with dropdown | Categories under 'Work' dropdown. Cleaner header, more complexity. | |
| You decide | Claude picks best nav structure. | |

**User's choice:** Flat nav bar

### Footer

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal footer | Social icons, copyright, subtle contact link. | ✓ |
| Full footer | Social icons, sitemap nav, copyright, tagline. More traditional. | |
| You decide | Claude designs footer. | |

**User's choice:** Minimal footer

---

## Claude's Discretion

- Specific sans-serif font choice (must be clean, professional, legible)
- Accent color (must be muted, complement grayscale thumbnails)

## Deferred Ideas

None — discussion stayed within phase scope
