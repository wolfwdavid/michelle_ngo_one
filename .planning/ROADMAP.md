# Roadmap: Michelle Ngo Portfolio

## Overview

This roadmap delivers a modern SvelteKit portfolio site for Michelle Ngo, a multi-disciplinary creative professional. The build follows the architecture dependency chain: deployment pipeline first (validating GitHub Pages gotchas early), then Contentful CMS integration (the data layer everything depends on), then the core portfolio pages with video (the primary value), then secondary content pages, and finally design polish and animations. Each phase delivers a coherent, verifiable capability that builds on the previous.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Deployment** - SvelteKit project with routing, navigation, Tailwind styling, and working GitHub Pages deployment (completed 2026-05-07)
- [x] **Phase 2: CMS & Content Layer** - Contentful integration with content models, data fetching, image optimization, and automated rebuilds (completed 2026-05-07)
- [ ] **Phase 3: Portfolio & Video** - Homepage, all portfolio category pages, project details, and video playback with facade pattern
- [ ] **Phase 4: Content Pages** - About, Press/News, Resume/CV, Blog, and Contact form
- [ ] **Phase 5: Design Polish & Animations** - Scroll animations, page transitions, and visual refinement across all pages

## Phase Details

### Phase 1: Foundation & Deployment
**Goal**: Visitors can navigate a deployed site with working routing and responsive layout
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, TECH-02, TECH-03, TECH-04, NAV-01, NAV-02, NAV-03, DES-04, DES-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. Site is live on GitHub Pages with correct asset loading (no broken paths or blocked files)
  2. Visitor sees a sticky header with navigation links that route to correct pages/sections
  3. Navigation collapses to a mobile menu on small screens and works across mobile, tablet, and desktop
  4. Social links (IMDb, LinkedIn, Vimeo, YouTube) are visible in header/footer
  5. Pages use consistent typography hierarchy and Tailwind-based styling
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold SvelteKit project, configure Tailwind v4, adapter-static, GitHub Actions workflow
- [x] 01-02-PLAN.md — Build responsive navigation, layout components, and all placeholder route pages
- [x] 01-03-PLAN.md — Deploy to GitHub Pages and verify site works end-to-end
**UI hint**: yes

### Phase 2: CMS & Content Layer
**Goal**: All site content is managed through Contentful and rendered correctly on the deployed site
**Depends on**: Phase 1
**Requirements**: CMS-01, CMS-02, CMS-03, TECH-05, TECH-06
**Success Criteria** (what must be TRUE):
  1. Content created in Contentful (projects, press items, blog posts, resume) appears on the deployed site after rebuild
  2. Publishing content in Contentful triggers an automatic GitHub Actions rebuild and deployment
  3. Images served from Contentful are optimized (WebP/AVIF, responsive srcset, lazy loaded)
  4. Pages have correct SEO meta tags and Open Graph data sourced from CMS content
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Contentful SDK client, TypeScript content types, query functions, image helper, Vitest setup
- [x] 02-02-PLAN.md — SEO component, ContentfulImage component, Rich Text renderer, SiteSettings layout load, deploy webhook
**UI hint**: yes

### Phase 3: Portfolio & Video
**Goal**: Visitors can explore Michelle's full portfolio across all disciplines and watch video work directly on the site
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06, VID-01, VID-02, VID-03, VID-04
**Success Criteria** (what must be TRUE):
  1. Homepage displays hero section, one featured video per category, about snippet, and recent press highlights
  2. Clicking a category on the homepage expands remaining videos inline with animation
  3. Each portfolio category has a dedicated page with a video thumbnail grid showing play overlay icons
  4. Clicking a video thumbnail opens a lightbox/modal player (keyboard-navigable, focus-trapped) without leaving the page
  5. Each project has a detail view with case study content (role, challenge, approach, outcome, credits)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
**UI hint**: yes

### Phase 4: Content Pages
**Goal**: Visitors can learn about Michelle, read press coverage, view her resume, read blog posts, and contact her
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. About page displays full bio, professional photo, and disciplines overview
  2. Press/News page shows chronological feed of press mentions with title, publication, date, excerpt, and external link
  3. Resume/CV page is viewable on-page and downloadable as PDF
  4. Blog displays rich text posts with images and embedded video
  5. Contact form (name, email, message) submits successfully via static-compatible service
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
**UI hint**: yes

### Phase 5: Design Polish & Animations
**Goal**: The site feels polished and professional with smooth animations that enhance (not distract from) the content
**Depends on**: Phase 3, Phase 4
**Requirements**: DES-01, DES-02, DES-03
**Success Criteria** (what must be TRUE):
  1. Elements fade in on scroll with subtle animation as visitor scrolls through pages
  2. Route changes use animated page transitions
  3. Site maintains clean, minimal Isotope Films-inspired aesthetic with light backgrounds and ample whitespace across all pages
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
Note: Phase 3 and Phase 4 both depend on Phase 2 and could theoretically run in parallel.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Deployment | 3/3 | Complete   | 2026-05-07 |
| 2. CMS & Content Layer | 2/2 | Complete   | 2026-05-07 |
| 3. Portfolio & Video | 0/0 | Not started | - |
| 4. Content Pages | 0/0 | Not started | - |
| 5. Design Polish & Animations | 0/0 | Not started | - |
