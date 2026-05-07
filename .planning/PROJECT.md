# Michelle Ngo Portfolio

## What This Is

A modern redesign of michellengo.net — a portfolio website for Michelle Ngo, a multi-disciplinary creative (producer, filmmaker, copywriter, UX designer). Built with SvelteKit and Contentful CMS, hosted on GitHub Pages. The site showcases her work across advertising, film/TV, UX design, social/transmedia, and publishing with a clean, minimal aesthetic and subtle animations.

## Core Value

Michelle's diverse creative work speaks for itself — the site must present it beautifully with zero friction, letting visitors explore her portfolio across disciplines and watch her video work directly on the site.

## Requirements

### Validated

- [x] Modern SvelteKit portfolio site replacing current WordPress site — Validated in Phase 01: Foundation & Deployment
- [x] GitHub Pages deployment (static adapter) — Validated in Phase 01: Foundation & Deployment
- [x] Responsive design (mobile, tablet, desktop) — Validated in Phase 01: Foundation & Deployment
- [x] Links to IMDb, LinkedIn, Vimeo, YouTube — Validated in Phase 01: Foundation & Deployment

### Active

- [x] Clean, minimal aesthetic (Isotope Films-inspired) with subtle fade-in animations — Validated in Phase 05: Design Polish & Animations
- [x] All current sections preserved: Advertising (Broadcast & Digital Producing, Copywriting), Film-TV, UX Design, Social & Transmedia, Publishing, About — Validated in Phase 03: Portfolio & Video
- [x] Video integration: featured work embedded (Vimeo/YouTube), rest as clickable thumbnails — Validated in Phase 03: Portfolio & Video
- [x] Contentful headless CMS for content management (projects, videos, press, blog) — Validated in Phase 02: CMS Content Layer
- [x] Contact form for direct outreach — Validated in Phase 04: Content Pages
- [x] Press/News page (Yvonne Russo-inspired) for press mentions, articles, features — Validated in Phase 04: Content Pages
- [x] Resume/CV page (viewable and downloadable) — Validated in Phase 04: Content Pages
- [x] Blog for written content, articles, behind-the-scenes — Validated in Phase 04: Content Pages

### Out of Scope

- Real-time chat or messaging — overkill for a portfolio site
- E-commerce / payments — not a store
- User accounts / authentication — public portfolio, no login needed
- Self-hosted CMS (Strapi) — using Contentful managed service instead
- Dark/cinematic theme — client prefers clean & minimal

## Context

- **Current site:** WordPress at michellengo.net — functional but dated, grid-based layout
- **Client:** Michelle Ngo, multi-layered creative with work spanning advertising, film/TV, UX, digital media, publishing
- **Signature project:** PBS American Portrait — interactive storytelling initiative
- **Video presence:** 147 videos on Vimeo (user2149742), YouTube playlist with additional content
- **GitHub repo:** wolfwdavid/michelle_ngo_one
- **Inspiration sites:**
  - Isotope Films (isotopefilms.com) — clean single-page flow, grayscale, video thumbnails with play overlays, mission-driven
  - Yvonne Russo (yvonnerusso.com) — dark cinematic, press page structure, filmmaker portfolio
  - Sam Hendi (samhendi.com) — animated transitions, grid layouts, polished presentation
- **Design direction:** Clean & minimal (Isotope-style), subtle animations (fade-ins, smooth scrolling), not dark/cinematic

## Constraints

- **Framework**: SvelteKit — client requirement
- **CMS**: Contentful — headless, managed, client can update content independently
- **Hosting**: GitHub Pages — static site generation via SvelteKit static adapter
- **Budget**: Free-tier friendly (GitHub Pages free, Contentful free tier)
- **Content**: Must preserve all existing portfolio sections and categories

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SvelteKit over other frameworks | Client requirement | Validated — Phase 01 |
| Contentful over Sanity/Strapi | Client preference, generous free tier, structured content | Validated — Phase 02 |
| GitHub Pages hosting | Client preference, free, works with static adapter | Validated — Phase 01 |
| Clean/minimal over dark/cinematic | Client preference — let the work speak | Validated — Phase 05 |
| Mix of embedded + thumbnail videos | Featured work plays on-site, rest links out — balance between richness and performance | Validated — Phase 03 |
| Svelte 5 runes over stores | Svelte 5 is current stable; runes are the standard going forward | Validated — Phase 01 |
| Tailwind v4 CSS-first config | No JS config needed, Vite plugin integration | Validated — Phase 01 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-07 after Phase 05 completion — Design Polish & Animations*
