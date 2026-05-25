---
phase: 260525-jkc
plan: 01
subsystem: build-deploy
tags: [sveltekit, prerender, github-pages, adapter-static, deploy-fix]
type: quick
requirements: [QUICK-JKC-01]

dependency_graph:
  requires:
    - "@sveltejs/adapter-static (already configured)"
    - "src/lib/contentful/client.ts offline stub from 260525-hk0"
  provides:
    - "GitHub Pages deploy succeeds when Contentful entries() returns []"
    - "kit.prerender.handleUnseenRoutes='warn' as a recoverable build mode"
  affects:
    - "All seven [slug] dynamic routes (advertising/blog/copywriting/film-tv/publishing/social-transmedia/ux-design)"
    - ".github/workflows/deploy.yml outcome (build no longer aborts)"

tech_stack:
  added: []
  patterns:
    - "Strict adapter (strict: true) preserved; only prerender crawler check demoted to warning — narrow, targeted relaxation"

key_files:
  created:
    - ".planning/quick/260525-jkc-add-prerender-handleunseenroutes-warn-to/260525-jkc-SUMMARY.md"
  modified:
    - "svelte.config.js (added kit.prerender.handleUnseenRoutes='warn')"
    - ".gitignore (ignore build.log produced by deploy validation)"

decisions:
  - "Used kit.prerender.handleUnseenRoutes='warn' instead of adapter strict:false — narrower fix that preserves adapter-level strictness for genuine errors (broken links, write conflicts, etc.)"
  - "Kept entries() exports in all seven [slug]/+page.server.ts files unchanged — when Contentful is populated they still drive real prerendering; the warn-mode only kicks in when they return []"
  - "Validated with empty-string env vars locally (CONTENTFUL_SPACE_ID='' CONTENTFUL_ACCESS_TOKEN='') to force the offline stub path and exercise the same empty-entries condition CI hits with unset secrets"

metrics:
  duration_seconds: 427
  duration_human: "~7 minutes"
  completed_date: "2026-05-25T18:16:00Z"
  tasks_completed: 2
  files_modified: 2
  files_created: 1
  build_duration_seconds: 7
  deploy_run_duration_seconds: 31
  deploy_retries: 0
---

# Quick Task 260525-jkc: Add prerender.handleUnseenRoutes='warn' Summary

One-line: Demoted SvelteKit's "unseen prerenderable route" build error to a warning so GitHub Pages deploys succeed when Contentful returns zero entries for dynamic `[slug]` routes — unblocking the broken deploy pipeline with a one-key config addition.

## What Was Built

A single additive change to `svelte.config.js` that introduces a `prerender` block in `kit` config setting `handleUnseenRoutes: 'warn'`. This changes SvelteKit's behavior when an `entries()` generator for a prerenderable route returns an empty array — previously this was a fatal build error ("The following routes were marked as prerenderable, but were not prerendered because they were not found while crawling your app"), now it is a non-fatal warning logged in build output.

### Final `svelte.config.js` shape

```js
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
		prerender: {
			handleUnseenRoutes: 'warn'
		}
	}
};

export default config;
```

Adapter `strict: true` and `paths.base` logic preserved verbatim. No changes to `src/routes/`, `.github/workflows/`, or Contentful client code.

## Why It Matters

Quick task 260525-hk0 made `src/lib/contentful/client.ts` resolve to `{items:[]}` when credentials are missing, which unblocked local dev. But the GH Actions build (and any build run against an empty/unconfigured Contentful space) still hit SvelteKit's strict prerender crawler: each of the seven `[slug]/+page.server.ts` files exports `entries()` returning `projects.map(p => ({slug: p.slug}))`. With zero projects, `entries()` returns `[]`, the crawler finds no slugs, and strict mode aborts the build before the static adapter can write `build/`.

`handleUnseenRoutes: 'warn'` targets this exact condition — empty entry generators on declared dynamic routes — without weakening adapter-level strictness for legitimate errors (broken internal links, file write conflicts, missing fallbacks). When Contentful is later populated with real content, `entries()` returns real slugs and prerendering behavior is identical to before.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add prerender.handleUnseenRoutes='warn' to svelte.config.js | ed59392 | svelte.config.js |
| 2 | Validate full deploy chain (local build, push, GH Actions, live curl) | (verification only; gitignore housekeeping committed as 1a857be) | .gitignore |

## Deploy Validation Results

All four sub-steps of Task 2 passed in order on the first attempt.

### Sub-step A — Local build
- Command: `CONTENTFUL_SPACE_ID="" CONTENTFUL_ACCESS_TOKEN="" npm run build`
- Exit code: **0**
- Duration: **7 seconds** (wall clock, including SSR + client + adapter phases)
- Output verification:
  - `build/index.html` exists ✓
  - `build/404.html` exists ✓
  - Prerender message appears once as a warning ("The following routes were marked as prerenderable...") covering all seven slug routes — does NOT abort the build
  - Offline stub log fires three times (one per build environment) as expected: `[contentful] CONTENTFUL_SPACE_ID and/or CONTENTFUL_ACCESS_TOKEN missing — using offline stub.`
- Note: had to supply empty-string env vars; `$env/static/private` rejects truly-missing imports with a MISSING_EXPORT compile error from rolldown (separate concern out of scope for this task — CI passes the secrets so this never triggers in production)

### Sub-step B — Commit & push
- Local HEAD before fix: `3981638` (previous failed deploy)
- New commit: **ed59392** (`fix(deploy): handleUnseenRoutes='warn' to unblock empty-Contentful prerender`)
- Pushed to: `origin/main`
- Push result: `3981638..ed59392  main -> main` ✓

### Sub-step C — GitHub Actions deploy
- Run ID: **26413938625**
- URL: https://github.com/wolfwdavid/michelle_ngo_one/actions/runs/26413938625
- headSha: `ed593922d2c0047dc329ea07a4fa38018e32e7fe` (matches pushed HEAD) ✓
- Conclusion: **success** ✓
- Build job: 18:13:24Z → 18:13:41Z (**17s**)
- Deploy job: 18:13:44Z → 18:13:53Z (**9s**)
- Total run wall-clock: 18:13:22Z → 18:13:53Z (**31 seconds end-to-end**)
- `gh run watch --exit-status` returned 0

### Sub-step D — Live site
- URL: https://wolfwdavid.github.io/michelle_ngo_one/
- HTTP status: **200** on attempt 1 (no retries needed) ✓
- Response body: Valid HTML5 document with `<!doctype html>`, Inter font preconnect, viewport meta — matches expected SvelteKit prerendered output
- CDN propagation: instantaneous (no 30s wait required)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Local build env vars required for `$env/static/private` resolution**
- **Found during:** Task 2 sub-step A
- **Issue:** Initial `npm run build` failed with `[MISSING_EXPORT] Error: "CONTENTFUL_SPACE_ID" is not exported by "\0virtual:env/static/private"` — rolldown's stricter handling of `$env/static/private` rejects imports of vars that aren't defined at all (vs. defined-but-empty)
- **Fix:** Ran the local build with `CONTENTFUL_SPACE_ID="" CONTENTFUL_ACCESS_TOKEN=""` to provide empty-but-defined env vars. This satisfies the import resolver and lets the 260525-hk0 offline stub kick in via its `Boolean(value)` truthiness check
- **Files modified:** None (verification-only workaround)
- **Out of scope:** No code change for this. GitHub Actions passes the secrets explicitly via the workflow `env:` block, so CI is never affected. If client wants offline-without-env-vars support in the future, that's a separate quick task (would need to switch from `$env/static/private` to `$env/dynamic/private` or a try/catch import shim)

**2. [Rule 2 — Critical hygiene] `build.log` artifact left untracked**
- **Found during:** Task 2 sub-step A (tee output)
- **Issue:** Per task_commit_protocol, generated runtime output must not be left as untracked files; would risk later `git add .` accidentally committing build noise
- **Fix:** Added `build.log` to `.gitignore`
- **Commit:** `1a857be` (`chore(260525-jkc): gitignore build.log produced by deploy validation`)

### Authentication Gates
None. `gh` CLI was pre-authenticated as `wolfwdavid` per prompt constraints.

## Known Stubs

None introduced by this task. The pre-existing Contentful offline stub from 260525-hk0 remains intact and is now the supported empty-content path: `entries()` returns `[]` → warn-mode prerender skips the seven `[slug]` routes → build completes → live home page serves from prerendered `build/index.html`. Detail pages will 404 until Contentful is populated, which is the correct behavior for an unconfigured CMS.

## Verification Checklist

- [x] `svelte.config.js` parses with `kit.prerender.handleUnseenRoutes === 'warn'` (validated via node import)
- [x] Local `npm run build` produces clean `build/` with `index.html` and `404.html` (exit 0)
- [x] No "marked as prerenderable, but were not prerendered" *errors* in build output (warnings acceptable)
- [x] GH Actions run 26413938625 on new HEAD `ed59392` concludes `success`
- [x] `https://wolfwdavid.github.io/michelle_ngo_one/` returns HTTP 200
- [x] Adapter `strict: true` flag preserved
- [x] No changes to `src/routes/**`, `.github/workflows/**`, or Contentful client code
- [x] When Contentful is later populated, the unchanged `entries()` exports will return real slugs and detail pages will prerender normally — production behavior path is preserved

## Self-Check: PASSED

- FOUND: svelte.config.js (verified `kit.prerender.handleUnseenRoutes === 'warn'` via node import)
- FOUND: .gitignore (contains `build.log`)
- FOUND: build/index.html, build/404.html
- FOUND: commit ed59392 (Task 1 fix)
- FOUND: commit 1a857be (gitignore housekeeping)
- FOUND: GH Actions run 26413938625 with conclusion=success on headSha=ed59392
- FOUND: live URL https://wolfwdavid.github.io/michelle_ngo_one/ returns HTTP 200
