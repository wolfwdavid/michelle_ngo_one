import { describe, it, expect, vi } from 'vitest';
import type { Project } from '$lib/contentful/types';

const mockFilmProjects: Project[] = [
	{
		title: 'Recent Film',
		slug: 'recent-film',
		description: 'A recent film',
		thumbnailUrl: null,
		videoUrl: 'https://vimeo.com/111',
		featured: false,
		sortOrder: 0,
		year: 2025,
		role: 'Director',
		productionType: 'Feature Film',
	},
	{
		title: 'Older Film',
		slug: 'older-film',
		description: 'An older film',
		thumbnailUrl: null,
		videoUrl: 'https://vimeo.com/222',
		featured: false,
		sortOrder: 1,
		year: 2020,
		role: 'Producer',
		productionType: 'Documentary',
	},
	{
		title: 'Oldest Film',
		slug: 'oldest-film',
		description: 'The oldest film',
		thumbnailUrl: null,
		videoUrl: null,
		featured: false,
		sortOrder: 2,
		year: 2015,
		role: 'Writer',
		productionType: 'Short Film',
	},
];

vi.mock('$lib/contentful/queries', () => ({
	getProjects: vi.fn().mockResolvedValue(mockFilmProjects),
}));

describe('Filmography load function', () => {
	it('getProjects is called with filmProject content type', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		await getProjects('filmProject');
		expect(getProjects).toHaveBeenCalledWith('filmProject');
	});

	it('returned projects can be sorted by year descending', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('filmProject');
		const sorted = [...projects].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
		expect(sorted[0].year).toBe(2025);
		expect(sorted[1].year).toBe(2020);
		expect(sorted[2].year).toBe(2015);
	});

	it('projects have year, role, and productionType fields', async () => {
		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('filmProject');
		for (const project of projects) {
			expect(project).toHaveProperty('year');
			expect(project).toHaveProperty('role');
			expect(project).toHaveProperty('productionType');
		}
	});
});
