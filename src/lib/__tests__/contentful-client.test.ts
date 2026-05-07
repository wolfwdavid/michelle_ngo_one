import { describe, it, expect, vi } from 'vitest';

// Mock SvelteKit private env since it's not available in test context
vi.mock('$env/static/private', () => ({
	CONTENTFUL_SPACE_ID: 'test-space-id',
	CONTENTFUL_ACCESS_TOKEN: 'test-access-token',
}));

// Mock contentful SDK
vi.mock('contentful', () => ({
	createClient: vi.fn(() => ({
		getEntries: vi.fn(),
		getEntry: vi.fn(),
	})),
}));

describe('contentfulClient', () => {
	it('exports a contentfulClient object', async () => {
		const { contentfulClient } = await import('$lib/contentful/client');
		expect(contentfulClient).toBeDefined();
		expect(contentfulClient.getEntries).toBeDefined();
	});
});
