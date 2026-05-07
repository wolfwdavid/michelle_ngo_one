import { describe, it, expect, vi } from 'vitest';
import type { Project, ProjectContentTypeId } from '$lib/contentful/types';

vi.mock('$lib/contentful/queries', () => ({
	getProjects: vi.fn().mockResolvedValue([
		{
			title: 'Test Ad Campaign',
			slug: 'test-ad-campaign',
			description: 'A test project',
			thumbnailUrl: 'https://images.ctfassets.net/thumb.jpg',
			videoUrl: 'https://vimeo.com/123456',
			featured: false,
			sortOrder: 0,
			client: 'Test Client',
			agency: 'Test Agency',
			role: 'Producer',
		},
		{
			title: 'Another Project',
			slug: 'another-project',
			description: 'Another test',
			thumbnailUrl: null,
			videoUrl: null,
			featured: true,
			sortOrder: 1,
		},
	] satisfies Project[]),
}));

describe('Category page load function', () => {
	it('getProjects returns array of Project objects for advertisingProject', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('advertisingProject');
		expect(Array.isArray(projects)).toBe(true);
		expect(projects.length).toBeGreaterThan(0);
	});

	it('each Project has required fields: title, slug, thumbnailUrl, videoUrl', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('advertisingProject');
		for (const project of projects) {
			expect(project).toHaveProperty('title');
			expect(project).toHaveProperty('slug');
			expect(project).toHaveProperty('thumbnailUrl');
			expect(project).toHaveProperty('videoUrl');
		}
	});

	it('getProjects accepts each valid contentTypeId', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const contentTypes: ProjectContentTypeId[] = [
			'advertisingProject',
			'filmProject',
			'uxDesignProject',
			'socialTransmediaProject',
			'publishingProject',
			'copywritingProject',
		];
		for (const ct of contentTypes) {
			const result = await getProjects(ct);
			expect(Array.isArray(result)).toBe(true);
		}
	});
});
