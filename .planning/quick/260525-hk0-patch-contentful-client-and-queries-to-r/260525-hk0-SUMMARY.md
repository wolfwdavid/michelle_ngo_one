---
phase: 260525-hk0
plan: 01
subsystem: contentful-client
tags: [contentful, dev-experience, fallback, sveltekit]
type: quick
requirements: [QUICK-01]
dependency_graph:
  requires:
    - src/lib/contentful/queries.ts (consumer contract — getEntries returning { items: [...] })
    - $env/static/private bindings (CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN)
  provides:
    - contentfulClient: real SDK client when creds present, offline stub otherwise
  affects:
    - src/routes/+layout.server.ts (now works with no creds without relying on try/catch alone)
    - src/routes/+page.server.ts (same)
    - src/routes/advertising/+page.server.ts (now works without try/catch wrapper)
    - all other route .server.ts loaders that call query functions
tech_stack:
  added: []
  patterns:
    - "Conditional module export: real client vs. duck-typed stub based on runtime env presence"
    - "Stub satisfies only the consumed subset of the SDK surface (getEntries) — type-cast through `unknown` to preserve the public type"
key_files:
  created: []
  modified:
    - src/lib/contentful/client.ts
decisions:
  - "Patch is one-file. Every downstream layer (query mappers, route loaders) already tolerates `items: []` via `?? ''`/`?? null` coercions and try/catch wrappers. No need to touch queries.ts or any route."
  - "Guard uses `Boolean(SPACE_ID) && Boolean(ACCESS_TOKEN)` so empty-string env values also trigger the stub (defensive against `.env` with blank values)."
  - "One `console.warn` at module init, not per-query — avoids log spam during prerender of many routes."
  - "Production behavior is byte-identical: when both env vars are truthy, `createClient({ space, accessToken })` is called with the same arguments as before. No caching, retries, or options added."
metrics:
  duration_sec: 243
  duration_min: 4
  tasks_completed: 2
  files_modified: 1
  completed: "2026-05-25T16:46:31Z"
---

# Quick Task 260525-hk0 Plan 01: Patch Contentful Client for Offline Dev Summary

**One-liner:** Contentful client now returns an empty-result stub when `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN` are missing, so `npm run dev` boots and renders without a `.env`.

## Goal Achieved

`npm run dev` no longer throws `TypeError: Expected parameter accessToken` at module import. The homepage and the unguarded `/advertising` route both render HTTP 200 with no Contentful credentials configured. Production builds (GitHub Actions sets both env vars) execute the original `createClient({ space, accessToken })` path unchanged.

## Tasks Completed

| Task | Name                                                | Commit  | Files                          |
| ---- | --------------------------------------------------- | ------- | ------------------------------ |
| 1    | Add offline stub fallback to contentful client      | 2b111e3 | src/lib/contentful/client.ts   |
| 2    | Verify dev server boots and serves 200 (auto-run)   | n/a     | (verification only, no files)  |

## Diff Applied

```diff
diff --git a/src/lib/contentful/client.ts b/src/lib/contentful/client.ts
-import { createClient } from 'contentful';
+import { createClient, type ContentfulClientApi } from 'contentful';
 import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';

-export const contentfulClient = createClient({
-	space: CONTENTFUL_SPACE_ID,
-	accessToken: CONTENTFUL_ACCESS_TOKEN,
-});
+/**
+ * Minimal offline stub matching the subset of ContentfulClientApi that
+ * `src/lib/contentful/queries.ts` consumes (only `getEntries`). Every query
+ * function downstream resolves to safe defaults when `items` is empty, so this
+ * lets the site render locally without Contentful credentials.
+ *
+ * Production builds (GitHub Actions sets both env vars) use the real SDK
+ * client unchanged.
+ */
+function createOfflineStub(): Pick<ContentfulClientApi<undefined>, 'getEntries'> {
+	console.warn(
+		'[contentful] CONTENTFUL_SPACE_ID and/or CONTENTFUL_ACCESS_TOKEN missing — ' +
+		'using offline stub. All Contentful queries will resolve to empty results.'
+	);
+	return {
+		// eslint-disable-next-line @typescript-eslint/no-explicit-any
+		getEntries: async () => ({ items: [] }) as any,
+	};
+}
+
+const hasCredentials = Boolean(CONTENTFUL_SPACE_ID) && Boolean(CONTENTFUL_ACCESS_TOKEN);
+
+export const contentfulClient = hasCredentials
+	? createClient({
+		space: CONTENTFUL_SPACE_ID,
+		accessToken: CONTENTFUL_ACCESS_TOKEN,
+	})
+	: (createOfflineStub() as unknown as ContentfulClientApi<undefined>);
```

## Verification Evidence

### Runtime smoke test (Bash + curl, no `.env` present)

Background `npm run dev` started; ports 5173/5174/5175 were already in use, Vite selected **5176**.

**Time to ready (Vite "ready in"):** 1.422s

**Dev server log (relevant excerpt):**

```
> one@0.0.1 dev
> vite dev

Port 5173 is in use, trying another one...
Port 5174 is in use, trying another one...
Port 5175 is in use, trying another one...

  VITE v8.0.11  ready in 1422 ms

  ➜  Local:   http://localhost:5176/
  ➜  Network: use --host to expose
[contentful] CONTENTFUL_SPACE_ID and/or CONTENTFUL_ACCESS_TOKEN missing — using offline stub. All Contentful queries will resolve to empty results.
```

- `grep -c "Expected parameter accessToken" /tmp/mn-dev.log` → **0** (good — original bug is gone)
- `grep -c "offline stub" /tmp/mn-dev.log` → **1** (good — fallback path engaged)

**HTTP smoke tests:**

| Route          | Request                                          | Result                                                    |
| -------------- | ------------------------------------------------ | --------------------------------------------------------- |
| `/`            | `curl -s -o /tmp/home.html -w "%{http_code}" /`  | **HTTP 200**, 51,859 bytes of rendered HTML               |
| `/advertising` | `curl -s -w "%{http_code}" /advertising`         | HTTP 308 → `/advertising/` (SvelteKit trailing-slash normalize) |
| `/advertising` | `curl -sL ... /advertising` (follow redirect)    | **FINAL HTTP 200** → `http://localhost:5176/advertising/` |
| `/advertising/`| `curl -s ... /advertising/` (direct)             | **HTTP 200**                                              |

The 308 is SvelteKit's canonical `trailingSlash: 'always'` normalization (set in `src/routes/+layout.js` since Phase 01), not a failure — the final response is 200 either way.

**Rendered content sanity check** (proves the stub path returns valid Svelte output, not a 500 page):

```
$ grep -oE "<h1[^>]*>[^<]*</h1>" /tmp/adv.html
<h1 class="mt-4 text-2xl font-semibold text-gray-900 mb-6">Advertising</h1>

$ grep -oE "<title>[^<]*</title>" /tmp/adv.html
<title>Michelle Ngo</title>
```

The Advertising category heading is present; the page rendered cleanly with an empty project list (no `getProjects('advertisingProject')` failure even though `+page.server.ts` for that route has no try/catch — proving the stub path works through an unguarded call site).

### Pass criteria (all four met)

- [x] No `Expected parameter accessToken` in the dev log.
- [x] `[contentful] ... offline stub` warning printed once at startup.
- [x] `GET /` returns HTTP 200.
- [x] `GET /advertising` returns HTTP 200 (after canonical trailing-slash redirect).

### Type check

`npx svelte-check` reports two errors on the patched file:

```
ERROR "src\lib\contentful\client.ts" 2:10 "Module '"$env/static/private"' has no exported member 'CONTENTFUL_SPACE_ID'."
ERROR "src\lib\contentful\client.ts" 2:31 "Module '"$env/static/private"' has no exported member 'CONTENTFUL_ACCESS_TOKEN'."
```

These are **the exact bug this patch works around at runtime** — when no `.env` exists, SvelteKit's `$env/static/private` virtual module doesn't generate the symbol exports. They were present in the pre-patch state of the file too (the original `import` line is identical). At runtime SvelteKit binds them as `undefined`, which is what the new `hasCredentials` guard handles. Resolving them in the type system would require either (a) a `.env` file (out of scope per plan — "Do NOT add any environment files") or (b) switching to `$env/dynamic/private`, which would defeat static-adapter prerender. Pre-existing errors in `deploy-workflow.test.ts` and `blog.load.test.ts` are unrelated to this file and were not touched.

### Git status (post-commit, pre-summary)

```
$ git status --short
?? .planning/quick/
```

Only the untracked planning directory remains — confirming **only `src/lib/contentful/client.ts` was modified** in source.

## Files Modified

- `src/lib/contentful/client.ts` (+31, -5)

## Deviations from Plan

None. Plan executed exactly as written. The `/advertising` 308→200 redirect is SvelteKit-canonical behavior and matches the plan's success criterion ("Browser GET `/advertising` returns 200"). The svelte-check errors on the patched import line are inherent to the no-`.env` repro condition the plan targets, not a deviation.

## Authentication Gates

None.

## Known Stubs

The patched file intentionally exposes an offline stub when credentials are missing. This is the documented, intended behavior — surfaced via `console.warn` at server startup so developers see why pages render with empty content. Will resolve automatically the moment a `.env` with valid Contentful creds is added (or in production via GitHub Actions secrets). No follow-up plan needed.

## Self-Check: PASSED

- File `src/lib/contentful/client.ts` exists and contains `createOfflineStub` (verified by Read after Write).
- Commit `2b111e3` exists: `git log --oneline | grep 2b111e3` → `fix(260525-hk0-01): add offline stub fallback to contentful client`.
- SUMMARY.md path: `.planning/quick/260525-hk0-patch-contentful-client-and-queries-to-r/260525-hk0-SUMMARY.md`.
