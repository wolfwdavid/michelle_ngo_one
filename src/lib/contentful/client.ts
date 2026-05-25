import { createClient, type ContentfulClientApi } from 'contentful';
import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';

/**
 * Minimal offline stub matching the subset of ContentfulClientApi that
 * `src/lib/contentful/queries.ts` consumes (only `getEntries`). Every query
 * function downstream resolves to safe defaults when `items` is empty, so this
 * lets the site render locally without Contentful credentials.
 *
 * Production builds (GitHub Actions sets both env vars) use the real SDK
 * client unchanged.
 */
function createOfflineStub(): Pick<ContentfulClientApi<undefined>, 'getEntries'> {
	console.warn(
		'[contentful] CONTENTFUL_SPACE_ID and/or CONTENTFUL_ACCESS_TOKEN missing — ' +
		'using offline stub. All Contentful queries will resolve to empty results.'
	);
	return {
		// Resolve to a shape compatible with `entries.items.map(...)` and
		// `entries.items[0]?.fields` in queries.ts.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getEntries: async () => ({ items: [] }) as any,
	};
}

const hasCredentials = Boolean(CONTENTFUL_SPACE_ID) && Boolean(CONTENTFUL_ACCESS_TOKEN);

export const contentfulClient = hasCredentials
	? createClient({
		space: CONTENTFUL_SPACE_ID,
		accessToken: CONTENTFUL_ACCESS_TOKEN,
	})
	: (createOfflineStub() as unknown as ContentfulClientApi<undefined>);
