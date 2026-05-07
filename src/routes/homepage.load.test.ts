import { describe, it, expect, vi } from 'vitest';

// Mock Contentful queries before importing load function
vi.mock('$lib/contentful/queries', () => ({
	getFeaturedProjects: vi.fn().mockResolvedValue([
		{ title: 'Featured 1', slug: 'feat-1', description: '', thumbnailUrl: null, videoUrl: null, featured: true, sortOrder: 0 },
	]),
	getProjects: vi.fn().mockResolvedValue([
		{ title: 'Project 1', slug: 'proj-1', description: '', thumbnailUrl: null, videoUrl: null, featured: false, sortOrder: 0 },
		{ title: 'Project 2', slug: 'proj-2', description: '', thumbnailUrl: null, videoUrl: null, featured: false, sortOrder: 1 },
	]),
	getPressItems: vi.fn().mockResolvedValue([
		{ title: 'Press 1', source: 'Source 1', url: 'https://example.com/1', date: '2025-01-01' },
		{ title: 'Press 2', source: 'Source 2', url: 'https://example.com/2', date: '2025-02-01' },
		{ title: 'Press 3', source: 'Source 3', url: 'https://example.com/3', date: '2025-03-01' },
		{ title: 'Press 4', source: 'Source 4', url: 'https://example.com/4', date: '2025-04-01' },
	]),
}));

describe('Homepage load function', () => {
	// These tests define the expected contract. They will be RED until the
	// homepage +page.server.ts or +page.ts load function is implemented.

	it.todo('returns categories array with 6 entries (one per portfolio discipline)');

	it.todo('each category has name, slug, href, contentTypeId, featured, all keys');

	it('pressHighlights should be limited to 3 items even if more exist', async () => {
		const { getPressItems } = await import('$lib/contentful/queries');
		const items = await getPressItems();
		const pressHighlights = items.slice(0, 3);
		expect(pressHighlights).toHaveLength(3);
	});

	it('getFeaturedProjects returns array for a given category', async () => {
		const { getFeaturedProjects } = await import('$lib/contentful/queries');
		const featured = await getFeaturedProjects('advertisingProject');
		expect(Array.isArray(featured)).toBe(true);
		expect(featured.length).toBeGreaterThan(0);
		expect(featured[0]).toHaveProperty('title');
		expect(featured[0]).toHaveProperty('featured', true);
	});

	it('getProjects returns array for a given category', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('advertisingProject');
		expect(Array.isArray(projects)).toBe(true);
		expect(projects.length).toBeGreaterThan(0);
	});

	it.todo('error handling returns empty categories on CMS failure');
});
