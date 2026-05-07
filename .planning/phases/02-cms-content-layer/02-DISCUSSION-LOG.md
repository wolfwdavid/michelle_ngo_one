# Phase 2: CMS & Content Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-07
**Phase:** 02-cms-content-layer
**Areas discussed:** Content model design, Image optimization, Webhook & rebuild flow, SEO & meta tags

---

## Content Model Design

### Project Organization
| Option | Description | Selected |
|--------|-------------|----------|
| Single Project type + category field | One content type for all portfolio items with a dropdown for category. Simpler to manage. | |
| Separate type per category | Dedicated content types per category. Each has category-specific fields. | ✓ |
| You decide | Claude picks the best approach | |

**User's choice:** Separate type per category
**Notes:** Allows category-specific fields tailored to each discipline

### Description Format
| Option | Description | Selected |
|--------|-------------|----------|
| Rich Text for descriptions | Full formatting with embedded images | |
| Plain text + separate image field | Simple text field, separate media fields | ✓ |
| Rich Text for long-form only | Rich Text for case studies/blog, plain text for short descriptions | |

**User's choice:** Plain text + separate image field

### Featured Projects
| Option | Description | Selected |
|--------|-------------|----------|
| Boolean 'featured' field | Simple toggle per project | ✓ |
| Numeric sort order | Number field for ordering | |
| Both featured flag + sort order | Featured toggle + sort order | |

**User's choice:** Boolean 'featured' field

### Blog Posts
| Option | Description | Selected |
|--------|-------------|----------|
| Rich Text for blog posts | Full formatting: headers, bold, links, embedded images/videos | ✓ |
| Plain text blog posts | Simple text-only | |
| You decide | Claude picks | |

**User's choice:** Rich Text for blog posts

### Press Items
| Option | Description | Selected |
|--------|-------------|----------|
| Title + source + URL + date | Minimal press item fields | ✓ |
| Add excerpt + thumbnail | Richer display with excerpt and image | |
| You decide | Claude picks | |

**User's choice:** Title + source + URL + date

### SiteSettings
| Option | Description | Selected |
|--------|-------------|----------|
| Yes — SiteSettings singleton | Global site data in CMS | ✓ |
| No — hardcode globals | Keep globals in code | |
| You decide | Claude picks | |

**User's choice:** Yes — SiteSettings singleton

### Resume
| Option | Description | Selected |
|--------|-------------|----------|
| PDF upload + structured fields | Downloadable PDF plus on-page structured data | ✓ |
| PDF upload only | Just a downloadable PDF link | |
| Structured fields only | On-page resume from structured data, no PDF | |

**User's choice:** PDF upload + structured fields

---

## Image Optimization

### Optimization Strategy
| Option | Description | Selected |
|--------|-------------|----------|
| Contentful Image API | Transform via URL params, CDN-cached | ✓ |
| Download + build-time optimization | Fetch and process with sharp/enhanced-img | |
| You decide | Claude picks | |

**User's choice:** Contentful Image API (Recommended)

### Responsive Sizes
| Option | Description | Selected |
|--------|-------------|----------|
| 3 sizes (320w, 640w, 1280w) | Covers mobile, tablet, desktop | |
| 4 sizes (320w, 640w, 960w, 1280w) | Adds tablet-landscape breakpoint | ✓ |
| You decide | Claude picks | |

**User's choice:** 4 sizes (more granular)

### Lazy Loading
| Option | Description | Selected |
|--------|-------------|----------|
| Native loading="lazy" | Browser-native, zero JS overhead | |
| Intersection Observer (svelte-inview) | Fade-in animation on viewport entry | ✓ |
| You decide | Claude picks | |

**User's choice:** Intersection Observer (svelte-inview)

---

## Webhook & Rebuild Flow

### Trigger Mechanism
| Option | Description | Selected |
|--------|-------------|----------|
| Contentful webhook → GitHub repository_dispatch | Standard pattern, deploy workflow listens for both push and repository_dispatch | ✓ |
| Contentful webhook → workflow_dispatch | Allows passing inputs, slightly more flexible | |
| You decide | Claude picks | |

**User's choice:** Contentful webhook → GitHub repository_dispatch

### Trigger Events
| Option | Description | Selected |
|--------|-------------|----------|
| Publish only | Rebuild only on publish, not drafts | ✓ |
| All changes | Rebuild on any content change | |

**User's choice:** Publish only (Recommended)

### API Key Storage
| Option | Description | Selected |
|--------|-------------|----------|
| Environment variables only | .env locally, GitHub Secrets for CI | |
| Environment vars + .env.example | Same plus .env.example documenting required vars | ✓ |
| You decide | Claude picks | |

**User's choice:** Environment vars + .env.example

---

## SEO & Meta Tags

### SEO Scope
| Option | Description | Selected |
|--------|-------------|----------|
| Full SEO setup | Per-page meta, OG, Twitter cards, structured data, sitemap | |
| Essential SEO only | Per-page meta, OG basics | |
| You decide | Claude picks practical level | ✓ |

**User's choice:** You decide

### Open Graph Images
| Option | Description | Selected |
|--------|-------------|----------|
| Use project thumbnail as OG image | Auto-use cover image for social sharing | ✓ |
| Separate OG image field | Dedicated field in Contentful | |
| You decide | Claude picks | |

**User's choice:** Use project thumbnail as OG image

---

## Claude's Discretion

- SEO implementation depth
- Contentful field names and validation rules
- TypeScript types for content models
- SDK client setup pattern
- Error handling for missing CMS content

## Deferred Ideas

None
