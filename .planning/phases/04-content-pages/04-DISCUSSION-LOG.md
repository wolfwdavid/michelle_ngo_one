# Phase 4: Content Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 04-content-pages
**Areas discussed:** About page layout, Blog structure, Contact form setup, Resume page display

---

## About Page Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Split layout | Photo on one side, bio text on the other. Disciplines listed below as linked cards. | Yes |
| Single column narrative | Full-width flowing narrative — photo at top, bio below, disciplines woven into text. | |
| You decide | Claude picks the layout that best fits the minimal aesthetic. | |

**User's choice:** Split layout
**Notes:** None

### About — Bio Source

| Option | Description | Selected |
|--------|-------------|----------|
| Contentful Page type | Bio text as Rich Text in Contentful 'Page' content type. Michelle can update independently. | Yes |
| Hardcoded in component | Bio text written directly in Svelte component. Simpler but requires code deploy. | |
| You decide | Claude picks based on CMS layer setup. | |

**User's choice:** Contentful Page type
**Notes:** None

### About — Discipline Cards

| Option | Description | Selected |
|--------|-------------|----------|
| Link to category page | Each discipline card links to its portfolio category page. Natural discovery path. | Yes |
| Static labels only | Display-only cards with name and brief description, no links. | |
| You decide | Claude picks what fits the user flow best. | |

**User's choice:** Link to category page
**Notes:** None

---

## Blog Structure

### Blog Index Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Card grid | Cover image, title, date, excerpt in responsive grid. Matches portfolio grid pattern. | Yes |
| Simple list | Title + date + excerpt in vertical list. Minimal, text-focused. | |
| You decide | Claude picks approach matching existing visual patterns. | |

**User's choice:** Card grid
**Notes:** None

### Blog Categories/Tags

| Option | Description | Selected |
|--------|-------------|----------|
| No categories/tags | Flat chronological list. Simpler CMS model, appropriate for portfolio blog volume. | Yes |
| Simple tags | Freeform tags with filter UI. More discoverable but adds complexity. | |
| You decide | Claude picks based on content volume tradeoff. | |

**User's choice:** No categories/tags
**Notes:** None

### Blog Video Embeds

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, reuse VideoFacade | Custom Rich Text renderer node for embedded video using VideoFacade component. | Yes |
| Plain iframe only | Standard iframe embed. No facade pattern — video loads immediately. | |
| No video in blog | Blog is text + images only. Links out to videos. | |

**User's choice:** Yes, reuse VideoFacade
**Notes:** None

---

## Contact Form Setup

### Form Service

| Option | Description | Selected |
|--------|-------------|----------|
| Web3Forms | 250 submissions/month free. No data storage. Simple HTML form with access key. | Yes |
| Formspree | 50 submissions/month free, better integrations. | |
| You decide | Claude picks based on static site setup and free-tier constraints. | |

**User's choice:** Web3Forms
**Notes:** None

### Form Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Just the basics | Name, email, message only. Minimal friction. | Yes |
| Add subject/category | Name, email, subject dropdown, message. Helps triage but adds friction. | |
| You decide | Claude picks based on portfolio contact form best practices. | |

**User's choice:** Just the basics
**Notes:** None

---

## Resume Page Display

### Resume Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Sectioned cards | Distinct sections (Experience, Education, Skills) each as a bordered card. Download PDF at top. | Yes |
| Timeline | Vertical timeline with dots/lines connecting entries chronologically. | |
| PDF-only | Just download button and embedded PDF viewer. No structured data on-page. | |

**User's choice:** Sectioned cards
**Notes:** None

### Resume Data Source

| Option | Description | Selected |
|--------|-------------|----------|
| Structured fields | Separate Contentful entries per experience/education item with typed fields. | Yes |
| Single Rich Text field | One Rich Text body for entire resume. Flexible but layout depends on formatting. | |
| You decide | Claude picks based on Phase 2 content model decisions. | |

**User's choice:** Structured fields
**Notes:** None

---

## Claude's Discretion

- Contact form success/error state UI (D-10)
- Press page layout style — list vs. cards, year grouping (D-12)
- Skills display format on resume (D-15)
- Blog post page layout details
- Empty states for all 5 pages

## Deferred Ideas

None — discussion stayed within phase scope
