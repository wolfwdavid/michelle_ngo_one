---
phase: 02-cms-content-layer
plan: 01
subsystem: api
tags: [contentful, cms, typescript, vitest, image-optimization]

# Dependency graph
requires:
  - phase: 01-foundation-deployment
    provides: SvelteKit project scaffold with Tailwind, static adapter, base path config
provides:
  - Contentful SDK singleton client importable from $lib/contentful/client
  - TypeScript interfaces for all 10 content type field sets (6 project categories + PressItem + BlogPost + SiteSettings + Resume)
  - Normalized component-facing types (Project, PressItem, BlogPost, SiteSettingsData, ResumeData)
  - 7 query functions (getProjects, getFeaturedProjects, getPressItems, getBlogPosts, getBlogPostBySlug, getSiteSettings, getResume)
  - Image URL helpers (contentfulSrcset, contentfulSrc) for responsive srcset generation
  - Vitest test infrastructure with 10 passing tests
  - .env.example documenting required Contentful credentials
affects: [02-02, 03-portfolio-pages, 04-specialized-pages]

# Tech tracking
tech-stack:
  added: [contentful@11.12.1, "@contentful/rich-text-html-renderer@17.2.2", "@contentful/rich-text-types@17.2.7", svelte-inview@4.0.4, vitest@4.1.5]
  patterns: [contentful-singleton-client, normalized-type-mapping, image-srcset-generation, vitest-with-sveltekit-mocks]

key-files:
  created:
    - src/lib/contentful/client.ts
    - src/lib/contentful/types.ts
    - src/lib/contentful/queries.ts
    - src/lib/contentful/image.ts
    - src/lib/__tests__/contentful-client.test.ts
    - src/lib/__tests__/contentful-image.test.ts
    - src/lib/__tests__/contentful-queries.test.ts
    - vitest.config.ts
    - .env.example
  modified:
    - package.json

key-decisions:
  - "Protocol-relative URLs normalized to https: in image helper for consistent srcset output"
  - "Vitest configured with sveltekit plugin for $lib alias resolution in tests"
  - "Mock pattern for $env/static/private established for all Contentful test files"

patterns-established:
  - "Contentful client singleton: import from $lib/contentful/client"
  - "Normalized types: raw Contentful fields mapped to clean component-facing interfaces in query functions"
  - "Image srcset: 4 widths (320, 640, 960, 1280) with WebP default, AVIF optional"
  - "Test mocking: vi.mock('$env/static/private') + vi.mock('contentful') pattern for all CMS tests"

requirements-completed: [CMS-01, CMS-02]

# Metrics
duration: 5min
completed: 2026-05-07
---

# Phase 02 Plan 01: CMS Content Layer Summary

**Contentful SDK client, 10 TypeScript content types, 7 query functions, and 4-width srcset image helper with full Vitest coverage**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-07T15:23:59Z
- **Completed:** 2026-05-07T15:29:57Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Contentful SDK singleton client configured with SvelteKit private env vars
- All 10 content type interfaces defined with normalized component-facing types for clean data flow
- 7 reusable query functions covering all content types with proper field mapping and sort orders
- Image helper generating 4-width responsive srcset URLs with WebP/AVIF format support
- Vitest test infrastructure established with 10 passing tests using mocked Contentful SDK

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and set up Vitest with test scaffolds** - `181842e` (chore)
2. **Task 2: Create Contentful client, TypeScript content types, and image helper** - `ccacfbf` (feat)
3. **Task 3: Create query functions for all content types** - `7d4baa6` (feat)

## Files Created/Modified
- `src/lib/contentful/client.ts` - Contentful SDK singleton client with env-based config
- `src/lib/contentful/types.ts` - 10 raw field interfaces + 5 normalized component types + ProjectContentTypeId union
- `src/lib/contentful/queries.ts` - 7 async query functions with field normalization
- `src/lib/contentful/image.ts` - contentfulSrc and contentfulSrcset helpers for responsive images
- `src/lib/__tests__/contentful-client.test.ts` - Client export validation test
- `src/lib/__tests__/contentful-image.test.ts` - 6 tests for image URL generation
- `src/lib/__tests__/contentful-queries.test.ts` - 3 tests for query function shape validation
- `vitest.config.ts` - Vitest config with sveltekit plugin and node environment
- `.env.example` - Documents CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN
- `package.json` - Added contentful, rich-text packages, svelte-inview, vitest, test scripts

## Decisions Made
- Protocol-relative URLs (`//images.ctfassets.net/...`) normalized to `https:` in image helper for consistent output
- Vitest uses sveltekit plugin for `$lib` alias resolution rather than manual alias config
- Established `vi.mock('$env/static/private')` pattern for all CMS-related tests
- Added `test` and `test:watch` npm scripts for developer convenience

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed test assertion for protocol-relative URL check**
- **Found during:** Task 2 (image helper tests)
- **Issue:** Test used `not.toContain('//images.ctfassets.net')` which fails because `https://images.ctfassets.net` contains `//images.ctfassets.net` as a substring
- **Fix:** Changed to negative lookbehind regex `not.toMatch(/(?<!https:)\/\/images\.ctfassets\.net/)` to properly check for bare protocol-relative URLs
- **Files modified:** src/lib/__tests__/contentful-image.test.ts
- **Verification:** All 10 tests pass
- **Committed in:** ccacfbf (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Test assertion was logically incorrect. Fix ensures proper validation. No scope creep.

## Issues Encountered
None

## User Setup Required

**External services require manual configuration.** The plan's frontmatter documents:
- `CONTENTFUL_SPACE_ID` - from Contentful Dashboard > Settings > General settings > Space ID
- `CONTENTFUL_ACCESS_TOKEN` - from Contentful Dashboard > Settings > API keys > Content Delivery API access token
- Content types must be created in Contentful matching the TypeScript interfaces

## Known Stubs
None - all functions are fully implemented. They depend on runtime Contentful credentials which are an external configuration concern, not a stub.

## Next Phase Readiness
- CMS data layer complete: client, types, queries, and image helpers ready for page integration
- Plan 02-02 (page data loading) can import from `$lib/contentful/queries` and `$lib/contentful/image`
- Contentful space setup and content type creation required before live data flows

## Self-Check: PASSED

All 9 created files verified present. All 3 task commit hashes verified in git log.

---
*Phase: 02-cms-content-layer*
*Completed: 2026-05-07*
