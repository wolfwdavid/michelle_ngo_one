---
phase: 260525-jkc
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - svelte.config.js
autonomous: true
requirements:
  - QUICK-JKC-01
must_haves:
  truths:
    - "npm run build completes with exit code 0 when Contentful credentials are absent"
    - "Empty [slug] entries() returns no longer fail the strict prerender crawl"
    - "GH Pages deploy workflow on push to main reaches a successful state"
    - "https://wolfwdavid.github.io/michelle_ngo_one/ returns HTTP 200"
    - "When Contentful is populated, [slug] pages still prerender via entries() output (no behavior change)"
  artifacts:
    - path: "svelte.config.js"
      provides: "adapter-static config with prerender.handleUnseenRoutes='warn'"
      contains: "handleUnseenRoutes"
  key_links:
    - from: "svelte.config.js kit.prerender.handleUnseenRoutes"
      to: "SvelteKit prerender crawler"
      via: "kit config option"
      pattern: "handleUnseenRoutes:\\s*['\"]warn['\"]"
---

<objective>
Unblock the GitHub Pages deploy by demoting SvelteKit's "route marked prerenderable but not found while crawling" error to a warning, so the static build succeeds when Contentful is empty and the seven dynamic `[slug]` routes have zero entries to crawl.

Purpose: After quick task 260525-hk0 made `client.ts` return `{items:[]}` offline, local dev works but the GH Actions build still fails at the prerender step because SvelteKit strict mode treats "no entries crawled for a prerenderable route" as an error. All seven `[slug]/+page.server.ts` files already export `entries()` that maps Contentful results — when Contentful returns `[]`, `entries()` returns `[]`, and strict mode rejects the build.

Output: A one-line config addition to `svelte.config.js` that makes empty entry generators a warning instead of an error. When Contentful is populated, `entries()` returns real slugs and the pages prerender normally — behavior unchanged.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@svelte.config.js
@src/routes/+layout.js
@src/routes/advertising/+page.server.ts
@src/routes/advertising/[slug]/+page.server.ts
@src/routes/blog/[slug]/+page.server.ts
@.github/workflows/deploy.yml

<interfaces>
<!-- Current svelte.config.js shape — minimal additive change only -->

```js
// svelte.config.js (current)
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
    }
  }
};
```

```ts
// All seven src/routes/*/[slug]/+page.server.ts already export entries():
export const entries: EntryGenerator = async () => {
  const projects = await getProjects('advertisingProject');
  return projects.map((p) => ({ slug: p.slug }));
};
// → returns [] when Contentful is empty → strict crawler rejects build
```

GH Actions build env passes `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN` from secrets — if both are unset/empty, the 260525-hk0 stub kicks in and returns `{items:[]}`.

</interfaces>

<background>
**Why `prerender.handleUnseenRoutes: 'warn'` is the correct fix:**

The exact error message from the failed run was: *"The following routes were marked as prerenderable, but were not prerendered because they were not found while crawling your app"*. This is governed by SvelteKit's `kit.prerender.handleUnseenRoutes` option (default: `'fail'`). Setting it to `'warn'` lets the build complete while still surfacing the issue in logs.

**Why NOT a different approach:**
- `adapter strict: false` — too broad, affects all adapter-level errors
- Removing `entries()` exports — would break prerendering when Contentful IS populated (regression)
- Hardcoding fake slugs in `entries()` — pollutes the build with phantom pages

**Production safety:** When Contentful has content, `entries()` returns real slugs, the listing pages link to them, the crawler finds them, and they prerender normally. `handleUnseenRoutes: 'warn'` only changes behavior when entries are absent — exactly our offline case.
</background>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add prerender.handleUnseenRoutes='warn' to svelte.config.js</name>
  <files>svelte.config.js</files>
  <action>
    Add a `prerender` block to the `kit` config in `svelte.config.js` with `handleUnseenRoutes: 'warn'`. This goes alongside (not inside) the `adapter` and `paths` keys.

    Final shape:
    ```js
    kit: {
      adapter: adapter({ ... }),  // unchanged
      paths: { ... },             // unchanged
      prerender: {
        handleUnseenRoutes: 'warn'
      }
    }
    ```

    Do NOT touch the `adapter` strict flag (leave `strict: true`). Do NOT modify `paths.base` logic. Do NOT change anything in `src/routes/`, the workflow YAML, or Contentful credentials.

    Rationale (for the commit): The seven `[slug]/+page.server.ts` files already export `entries()` returning Contentful-driven arrays. When Contentful is empty/unconfigured (CI without secrets, or local dev), `entries()` returns `[]` and SvelteKit's strict crawler treats those routes as "unseen" → fatal error. Demoting to `'warn'` lets the static build complete with placeholder content. When Contentful is populated the entries() output is non-empty and prerendering is unchanged.
  </action>
  <verify>
    <automated>node -e "const c = require('./svelte.config.js').default; if (c.kit.prerender?.handleUnseenRoutes !== 'warn') { console.error('FAIL: handleUnseenRoutes not set to warn'); process.exit(1); } console.log('OK');"</automated>
  </verify>
  <done>svelte.config.js contains `prerender: { handleUnseenRoutes: 'warn' }` inside `kit`. adapter `strict: true` and `paths.base` logic are unchanged.</done>
</task>

<task type="auto">
  <name>Task 2: Validate full deploy chain — local build, push, GH Actions run, live site curl</name>
  <files>(no file changes — verification only)</files>
  <action>
    Run the complete deploy validation chain. ALL FOUR sub-steps must pass before declaring done — if any fails, stop and report the failure.

    **Sub-step A — local build (must exit 0 with no prerender errors):**
    ```
    npm run build
    ```
    Expected: exit code 0. Look in the stdout for any line starting with "The following routes were marked as prerenderable". If present → FAIL. Warnings about unseen routes are acceptable; errors are not. Build should complete and `build/index.html` should exist.

    **Sub-step B — commit and push:**
    Use gsd-tools to commit svelte.config.js with a focused message, then push to origin/main.
    ```
    node "~/.claude/get-shit-done/bin/gsd-tools.cjs" commit "fix(deploy): handleUnseenRoutes='warn' to unblock empty-Contentful prerender" --files svelte.config.js
    git push origin main
    ```
    Capture the new HEAD SHA for the next step (`git rev-parse HEAD`). Previous deploy SHA was `3981638`.

    **Sub-step C — wait for GH Actions to succeed:**
    ```
    gh run list --repo wolfwdavid/michelle_ngo_one --limit 1 --json databaseId,headSha,status,conclusion
    ```
    Confirm the latest run's `headSha` matches the SHA just pushed. Then:
    ```
    gh run watch --repo wolfwdavid/michelle_ngo_one <run-id> --exit-status
    ```
    Expected: exits 0 (success). If non-zero, fetch logs with `gh run view <run-id> --log-failed` and report the failure — do NOT claim done.

    **Sub-step D — confirm live site responds:**
    ```
    curl -s -o /dev/null -w "%{http_code}\n" https://wolfwdavid.github.io/michelle_ngo_one/
    ```
    On Windows PowerShell: `(Invoke-WebRequest -Uri 'https://wolfwdavid.github.io/michelle_ngo_one/' -UseBasicParsing).StatusCode`

    Expected: `200`. GH Pages may take 30-60 seconds after deploy job completes for CDN to serve new content — if first curl returns 404, wait 30s and retry (max 3 attempts).

    Report back with: local build exit code, pushed SHA, GH Actions run ID + conclusion, final HTTP status from the live URL.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tee build.log; if grep -q "marked as prerenderable, but were not prerendered" build.log; then echo "FAIL: prerender error still present"; exit 1; fi; test -f build/index.html && echo "OK: local build clean"</automated>
  </verify>
  <done>
    All four sub-steps pass:
    (a) `npm run build` exits 0 with no "marked as prerenderable but were not prerendered" error in output, and `build/index.html` exists.
    (b) Patch commit pushed to origin/main; new HEAD SHA recorded (different from 3981638).
    (c) `gh run watch --exit-status` for the new run returns 0 (workflow conclusion: success).
    (d) `curl https://wolfwdavid.github.io/michelle_ngo_one/` returns HTTP 200.
  </done>
</task>

</tasks>

<verification>
- `svelte.config.js` parses and exports a config with `kit.prerender.handleUnseenRoutes === 'warn'`
- Local `npm run build` produces a clean `build/` directory with `build/index.html` and `build/404.html`
- No "marked as prerenderable, but were not prerendered" lines in build output (warnings about empty entry generators are acceptable)
- GH Actions workflow run on the new HEAD SHA concludes with `success`
- Live site `https://wolfwdavid.github.io/michelle_ngo_one/` returns HTTP 200 and serves the deployed HTML
- adapter `strict: true` flag is preserved (we did NOT weaken adapter strictness — only the specific prerender crawler check)
- No changes to `src/routes/**`, `.github/workflows/**`, or Contentful client code
</verification>

<success_criteria>
- A visitor loading `https://wolfwdavid.github.io/michelle_ngo_one/` receives HTTP 200 with the rendered home page HTML
- The fix is minimal: exactly one config block added to `svelte.config.js`, no other files touched
- When Contentful is later populated (real `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN` in repo secrets with content), the next build's `entries()` returns real slugs and detail pages prerender — confirming production behavior is unchanged
</success_criteria>

<output>
After completion, create `.planning/quick/260525-jkc-add-prerender-handleunseenroutes-warn-to/260525-jkc-SUMMARY.md` documenting:
- Final patched `svelte.config.js` shape
- Local `npm run build` exit code and any remaining warnings
- Pushed commit SHA
- GH Actions run ID and conclusion
- Final curl HTTP status from `https://wolfwdavid.github.io/michelle_ngo_one/`
</output>
