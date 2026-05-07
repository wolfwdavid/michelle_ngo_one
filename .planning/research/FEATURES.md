# Feature Landscape

**Domain:** Creative portfolio / filmmaker website (multi-disciplinary: producer, filmmaker, copywriter, UX designer)
**Researched:** 2026-05-07

## Table Stakes

Features visitors expect on a professional creative portfolio. Missing any of these and the site feels amateur or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Responsive design** | Visitors come from all devices; recruiters check on mobile between meetings | Medium | SvelteKit + modern CSS handles this well. Test at mobile, tablet, desktop breakpoints. |
| **Fast page loads** | Portfolio sites are judged in 3 seconds. Slow = gone. | Medium | Static generation via SvelteKit adapter-static. Lazy-load video embeds using facade pattern (thumbnail + play button, load iframe on click). Each Vimeo embed adds ~500KB if not lazy-loaded. |
| **Hero section / showreel** | Filmmaker sites need a visual hook above the fold. No text wall. | Low | Featured video or animated hero with a clear value proposition. Isotope Films does this well. |
| **Project portfolio with categories** | Multi-disciplinary work needs clear organization. Visitors want to filter by discipline. | Medium | Categories: Advertising (Broadcast & Digital Producing, Copywriting), Film-TV, UX Design, Social & Transmedia, Publishing. Filterable grid or tabbed navigation. |
| **Video integration** | This is a filmmaker's site. Video is the primary medium. | Medium | Featured projects: embedded Vimeo/YouTube players. Secondary projects: clickable thumbnails linking to external players. Facade pattern critical for pages with multiple embeds. |
| **About page** | Visitors need to know who Michelle is, her background, what makes her unique | Low | Bio, professional photo, disciplines overview, mission statement. |
| **Contact form** | Clients and collaborators need a way to reach out | Low | Simple form (name, email, message). Use a static-compatible service like Formspree, Getform, or Netlify Forms equivalent for GitHub Pages. |
| **Social links** | Industry expects IMDb, LinkedIn, Vimeo, YouTube presence | Low | Persistent in header/footer. Link to IMDb, LinkedIn, Vimeo, YouTube as specified. |
| **Clean navigation** | Visitors must find any section within one click | Low | Sticky header nav. Keep it flat -- no deep dropdowns. 6-7 top-level items max. |
| **SEO fundamentals** | Discoverability matters for a professional site | Low | Meta tags, Open Graph tags, semantic HTML, structured data (Person schema). SvelteKit handles SSG well for this. |
| **Resume / CV page** | Industry standard for producers and creatives seeking work | Low | Viewable on-page and downloadable as PDF. Keep updated via Contentful. |
| **Image optimization** | High-res portfolio images must not tank performance | Low | Use modern formats (WebP/AVIF with fallbacks), responsive srcset, lazy loading for below-fold images. |

## Differentiators

Features that elevate beyond a standard portfolio. Not expected, but signal professionalism and create memorable experiences.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Project case studies** | Transform portfolio entries from "look at this" to "here's the story behind it" -- shows process, not just output. Especially powerful for UX and producing work. | Medium | Rich content per project: role, challenge, approach, outcome, credits. Contentful content model supports this well with structured fields. |
| **Press / News page** | Builds credibility. Third-party validation (press mentions, articles, features) is more persuasive than self-promotion. Inspired by Yvonne Russo's site. | Low | Chronological feed of press mentions, articles, features. Each entry: title, publication, date, excerpt, link. CMS-managed. |
| **Blog / written content** | Demonstrates thought leadership. Behind-the-scenes content humanizes the brand and aids SEO. | Medium | CMS-managed posts with rich text, images, video embeds. Keep it simple -- no comments section needed. |
| **Subtle page transitions and scroll animations** | Creates a polished, cinematic feel without sacrificing performance. Sam Hendi-inspired. | Medium | Fade-in on scroll, smooth page transitions via SvelteKit transitions API. Keep animations under 300ms. Do NOT overdo -- subtle is the goal per client preference. |
| **Video thumbnail grid with play overlays** | Isotope Films pattern. Visually communicates "click to watch" without embedding heavy players everywhere. | Low | CSS overlay with play icon on hover. Click either embeds inline or opens lightbox/modal player. |
| **Discipline-specific landing pages** | Instead of one flat portfolio, give each discipline (Advertising, Film-TV, UX, etc.) its own curated section with context. | Medium | Each discipline page has an intro paragraph, featured projects, and full project grid. Better storytelling than a single filterable grid. |
| **Lightbox / modal video player** | Watch video without leaving the page. Reduces friction vs. linking to external Vimeo/YouTube pages. | Medium | Click thumbnail, modal opens with embedded player. Close to return. Handles keyboard nav and focus trapping for accessibility. |
| **Filmography / credits list** | Standard in film industry. A structured, scannable list of all productions with role, year, and type. | Low | Table or structured list. Could be separate from the visual portfolio. Think of it as the IMDb-equivalent on her own site. |

## Anti-Features

Features to explicitly NOT build. Each one has been considered and rejected for good reason.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Dark/cinematic theme** | Client explicitly prefers clean and minimal. Dark themes are common in filmmaker sites but not the direction here. | Clean, light aesthetic with subtle grayscale elements. Let the work provide the visual richness. |
| **Background auto-playing video** | Performance killer, accessibility nightmare, annoying on mobile, eats data. Many filmmaker sites do this and it hurts them. | Static hero image or short animated loop (CSS/lightweight) with clear CTA to watch the showreel. |
| **User accounts / authentication** | This is a public portfolio, not a platform. No one needs to log in. | Keep everything public. Contact form for outreach. |
| **E-commerce / payments** | Not a store. Adding commerce complexity distracts from the portfolio purpose. | Link to external platforms if selling ever becomes relevant. |
| **Comments on blog posts** | Spam magnet, moderation burden, adds complexity for minimal value on a portfolio site. | Social sharing links instead. Let engagement happen on social platforms. |
| **Real-time chat / messaging** | Overkill for a portfolio. Contact form is sufficient. | Simple contact form with clear response time expectation. |
| **Complex filtering / search** | With 6-7 categories and maybe 30-50 projects, a search engine is over-engineering. | Category-based navigation is sufficient. Add search only if content grows past 100+ items. |
| **Infinite scroll** | Disorienting on portfolio sites. Visitors lose their place. Bad for SEO. | Paginated or "load more" pattern if needed. For most portfolio sizes, show all items in the category. |
| **Custom video player** | Massive engineering effort for marginal benefit. Vimeo/YouTube players are polished and familiar. | Embed Vimeo/YouTube with facade pattern. Style the thumbnail overlay to match the site aesthetic. |
| **Newsletter signup / email marketing** | Premature optimization. Build the portfolio first. Add if the blog gains traction. | Can be added later as a Contentful-managed CTA block if needed. |

## Feature Dependencies

```
Responsive Design ──────────────────────> All other features (foundation)
                                          
Contentful CMS Setup ──────────────────> Project Portfolio
                      ──────────────────> Press/News Page
                      ──────────────────> Blog
                      ──────────────────> Resume/CV (if CMS-managed)
                      ──────────────────> Case Studies

Project Portfolio ─────────────────────> Category Filtering
                  ─────────────────────> Discipline Landing Pages
                  ─────────────────────> Case Studies
                  ─────────────────────> Filmography

Video Integration (facade pattern) ────> Video Thumbnail Grid
                                   ────> Lightbox/Modal Player

Static Site Generation ────────────────> SEO Fundamentals
                       ────────────────> Fast Page Loads
                       ────────────────> GitHub Pages Deployment

Contact Form ──────────────────────────> Third-party form service integration
```

## MVP Recommendation

**Prioritize (Phase 1 -- functional portfolio):**
1. Responsive layout with clean navigation
2. Hero section with featured video
3. Project portfolio with category pages (all 6 disciplines)
4. Video integration with facade/lazy-loading pattern
5. About page
6. Contact form
7. Social links (IMDb, LinkedIn, Vimeo, YouTube)
8. SEO fundamentals
9. Contentful CMS integration for projects

**Phase 2 -- depth and credibility:**
1. Project case studies (rich content per project)
2. Press/News page
3. Resume/CV page
4. Scroll animations and page transitions
5. Lightbox/modal video player

**Defer (Phase 3 -- content growth):**
1. Blog
2. Filmography/credits list
3. Discipline-specific landing pages (start with category tabs, evolve to dedicated pages if content warrants it)

**Rationale:** Launch with a complete, fast, beautiful portfolio that shows all work categories. Add depth (case studies, press) once the foundation is solid. Defer content-heavy features (blog) until there is content to populate them.

## Sources

- [Filmmaker Portfolios: 15+ Well-Designed Examples (2026)](https://www.sitebuilderreport.com/inspiration/filmmaker-portfolios)
- [Filmmakers on Fabrik: A Deep Dive into 120 Portfolio Websites](https://fabrik.io/blog/filmmakers-on-fabrik-a-deep-dive-into-120-portfolio-websites)
- [The 2026 Website Playbook for Creative Service Brands](https://creative7designs.com/2026-website-playbook-for-creative-service-brands/)
- [What format should your portfolio be in 2026?](https://creativelivesinprogress.com/articles/portfolio-format-2026)
- [Video performance (web.dev)](https://web.dev/learn/performance/video-performance)
- [Optimize Video Embedding Without Affecting Site Speed](https://www.vidjet.com/blog/embedding-videos-on-your-site-without-affecting-site-speed-and-load-time)
- [Content modeling basics (Contentful)](https://www.contentful.com/help/content-models/content-modelling-basics/)
- [20 Best Filmmaker Website Examples (HubSpot)](https://blog.hubspot.com/website/filmmaker-website-examples)
- [Creative Director Portfolio Websites: 15+ Examples](https://www.sitebuilderreport.com/inspiration/creative-director-portfolios)
- Isotope Films (isotopefilms.com) -- direct analysis of inspiration site
