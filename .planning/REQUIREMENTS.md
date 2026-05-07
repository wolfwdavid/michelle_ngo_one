# Requirements: Michelle Ngo Portfolio

**Defined:** 2026-05-07
**Core Value:** Michelle's diverse creative work speaks for itself — the site must present it beautifully with zero friction, letting visitors explore her portfolio across disciplines and watch her video work directly on the site.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Homepage

- [ ] **HOME-01**: Homepage displays hero section with Michelle's name, tagline, and brief intro
- [ ] **HOME-02**: Homepage shows one featured video per category (6 total: Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, Copywriting)
- [ ] **HOME-03**: Clicking a category on the homepage expands remaining videos from that category inline with animation
- [ ] **HOME-04**: Homepage includes a short about snippet with link to full About page
- [ ] **HOME-05**: Homepage displays recent press highlights

### Navigation

- [x] **NAV-01**: Sticky header navigation with links: Home, Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, About
- [x] **NAV-02**: Navigation is responsive — collapses to mobile menu on small screens
- [x] **NAV-03**: Navigation links scroll to or navigate to corresponding sections/pages

### Portfolio

- [ ] **PORT-01**: Each category (Advertising, Film-TV, UX Design, Social & Transmedia, Publishing, Copywriting) has a dedicated page showing all projects
- [ ] **PORT-02**: Project entries display as video thumbnail grid with play overlay icons (Isotope Films-style)
- [ ] **PORT-03**: Featured projects use embedded Vimeo/YouTube players (facade pattern — thumbnail first, load iframe on click)
- [ ] **PORT-04**: Secondary projects display as clickable thumbnails
- [ ] **PORT-05**: Each project has a detail view with case study content (role, challenge, approach, outcome, credits)
- [ ] **PORT-06**: Video embeds use lazy-loading facade pattern for performance (critical with 147+ videos)

### Video

- [ ] **VID-01**: Lightbox/modal video player — click thumbnail to watch without leaving the page
- [ ] **VID-02**: Modal handles keyboard navigation and focus trapping for accessibility
- [ ] **VID-03**: Videos sourced from Vimeo (user2149742) and YouTube playlist
- [ ] **VID-04**: Filmography/credits list page with structured data (year, role, production type)

### Content Pages

- [ ] **CONT-01**: About page with full bio, professional photo, disciplines overview
- [ ] **CONT-02**: Press/News page with chronological feed of press mentions (title, publication, date, excerpt, link)
- [ ] **CONT-03**: Resume/CV page — viewable on-page and downloadable as PDF
- [ ] **CONT-04**: Blog with rich text posts, images, and video embeds
- [ ] **CONT-05**: Contact form (name, email, message) using static-compatible service (Web3Forms or similar)
- [x] **CONT-06**: Social links in header/footer (IMDb, LinkedIn, Vimeo, YouTube)

### Design

- [ ] **DES-01**: Clean, minimal aesthetic inspired by Isotope Films — light backgrounds, ample whitespace
- [ ] **DES-02**: Subtle scroll animations (fade-in on scroll) using Svelte transitions
- [ ] **DES-03**: Animated page transitions between routes
- [x] **DES-04**: Responsive design — mobile, tablet, desktop breakpoints
- [x] **DES-05**: Modern typography with clear hierarchy

### CMS

- [x] **CMS-01**: Contentful headless CMS integration — all projects, press, blog posts, and resume managed via Contentful
- [x] **CMS-02**: Content model supports: Projects (with category, video URLs, case study fields), Press Items, Blog Posts, Resume, Site Settings
- [ ] **CMS-03**: Contentful webhook triggers GitHub Actions rebuild for automated content updates

### Technical

- [x] **TECH-01**: Built with SvelteKit and Svelte 5 (runes)
- [x] **TECH-02**: Styled with Tailwind CSS v4
- [x] **TECH-03**: Static site generation via adapter-static for GitHub Pages
- [x] **TECH-04**: GitHub Pages deployment with .nojekyll file and correct base path config
- [ ] **TECH-05**: SEO fundamentals — meta tags, Open Graph, structured data (Person schema)
- [ ] **TECH-06**: Image optimization (WebP/AVIF, responsive srcset, lazy loading)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Portfolio

- **EPORT-01**: Discipline-specific landing pages with intro, featured projects, and full grid
- **EPORT-02**: Newsletter signup / email marketing integration

### Advanced Features

- **ADV-01**: Search functionality (if content grows past 100+ items)
- **ADV-02**: Content analytics / view tracking

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark/cinematic theme | Client prefers clean & minimal |
| Background auto-playing video | Performance killer, accessibility issues, eats mobile data |
| User accounts / authentication | Public portfolio, no login needed |
| E-commerce / payments | Not a store |
| Real-time chat / messaging | Contact form is sufficient |
| Comments on blog | Spam magnet, moderation burden, minimal value for portfolio |
| Custom video player | Vimeo/YouTube players are polished and familiar |
| Infinite scroll | Disorienting on portfolios, bad for SEO |
| Self-hosted CMS | Using Contentful managed service |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | Phase 3 | Pending |
| HOME-02 | Phase 3 | Pending |
| HOME-03 | Phase 3 | Pending |
| HOME-04 | Phase 3 | Pending |
| HOME-05 | Phase 3 | Pending |
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| PORT-01 | Phase 3 | Pending |
| PORT-02 | Phase 3 | Pending |
| PORT-03 | Phase 3 | Pending |
| PORT-04 | Phase 3 | Pending |
| PORT-05 | Phase 3 | Pending |
| PORT-06 | Phase 3 | Pending |
| VID-01 | Phase 3 | Pending |
| VID-02 | Phase 3 | Pending |
| VID-03 | Phase 3 | Pending |
| VID-04 | Phase 3 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 4 | Pending |
| CONT-06 | Phase 1 | Complete |
| DES-01 | Phase 5 | Pending |
| DES-02 | Phase 5 | Pending |
| DES-03 | Phase 5 | Pending |
| DES-04 | Phase 1 | Complete |
| DES-05 | Phase 1 | Complete |
| CMS-01 | Phase 2 | Complete |
| CMS-02 | Phase 2 | Complete |
| CMS-03 | Phase 2 | Pending |
| TECH-01 | Phase 1 | Complete |
| TECH-02 | Phase 1 | Complete |
| TECH-03 | Phase 1 | Complete |
| TECH-04 | Phase 1 | Complete |
| TECH-05 | Phase 2 | Pending |
| TECH-06 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0

---
*Requirements defined: 2026-05-07*
*Last updated: 2026-05-07 after roadmap creation*
