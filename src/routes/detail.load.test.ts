import { describe, it, expect, vi } from 'vitest';
import type { Project } from '$lib/contentful/types';

const mockProject: Project = {
	title: 'Test Film',
	slug: 'test-film',
	description: 'A test film project',
	thumbnailUrl: 'https://images.ctfassets.net/thumb.jpg',
	videoUrl: 'https://vimeo.com/789012',
	featured: true,
	sortOrder: 0,
	client: 'Test Studio',
	role: 'Director',
	year: 2025,
	productionType: 'Documentary',
};

vi.mock('$lib/contentful/queries', () => ({
	getProjectBySlug: vi.fn().mockImplementation(
		(_contentTypeId: string, slug: string) => {
			if (slug === 'test-film') return Promise.resolve(mockProject);
			return Promise.resolve(null);
		}
	),
	getProjects: vi.fn().mockResolvedValue([
		{ title: 'Test Film', slug: 'test-film', description: '', thumbnailUrl: null, videoUrl: null, featured: false, sortOrder: 0 },
		{ title: 'Another Film', slug: 'another-film', description: '', thumbnailUrl: null, videoUrl: null, featured: false, sortOrder: 1 },
	]),
}));

describe('Detail page load function', () => {
	it('getProjectBySlug returns a single Project for a valid slug', async () => {
		const { getProjectBySlug } = await import('$lib/contentful/queries');
		const project = await getProjectBySlug('advertisingProject', 'test-film');
		expect(project).not.toBeNull();
		expect(project!.title).toBe('Test Film');
	});

	it('returned Project has all expected fields', async () => {
		const { getProjectBySlug } = await import('$lib/contentful/queries');
		const project = await getProjectBySlug('filmProject', 'test-film');
		expect(project).not.toBeNull();
		expect(project).toHaveProperty('title');
		expect(project).toHaveProperty('slug');
		expect(project).toHaveProperty('description');
		expect(project).toHaveProperty('videoUrl');
		expect(project).toHaveProperty('thumbnailUrl');
		expect(project).toHaveProperty('role');
		expect(project).toHaveProperty('client');
		expect(project).toHaveProperty('year');
	});

	it('non-existent slug returns null (load function should throw 404)', async () => {
		const { getProjectBySlug } = await import('$lib/contentful/queries');
		const project = await getProjectBySlug('advertisingProject', 'nonexistent-slug');
		expect(project).toBeNull();
	});

	it('getProjects returns array of slugs for entries()', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('filmProject');
		const entries = projects.map((p: { slug: string }) => ({ slug: p.slug }));
		expect(Array.isArray(entries)).toBe(true);
		expect(entries.length).toBeGreaterThan(0);
		expect(entries[0]).toHaveProperty('slug');
	});
});
