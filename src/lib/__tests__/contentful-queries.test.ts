import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$env/static/private', () => ({
	CONTENTFUL_SPACE_ID: 'test-space-id',
	CONTENTFUL_ACCESS_TOKEN: 'test-access-token',
}));

const mockGetEntries = vi.fn();

vi.mock('contentful', () => ({
	createClient: vi.fn(() => ({
		getEntries: mockGetEntries,
	})),
}));

describe('getProjects', () => {
	beforeEach(() => {
		mockGetEntries.mockReset();
	});

	it('fetches entries by content type with sort order', async () => {
		mockGetEntries.mockResolvedValue({
			items: [{
				fields: {
					title: 'Test Project',
					slug: 'test-project',
					description: 'A test',
					thumbnail: { fields: { file: { url: '//images.ctfassets.net/test.jpg' } } },
					videoUrl: 'https://vimeo.com/123',
					featured: true,
					sortOrder: 1,
				},
			}],
		});

		const { getProjects } = await import('$lib/contentful/queries');
		const projects = await getProjects('advertisingProject');
		expect(mockGetEntries).toHaveBeenCalledWith(expect.objectContaining({
			content_type: 'advertisingProject',
		}));
		expect(projects[0]).toHaveProperty('title', 'Test Project');
		expect(projects[0]).toHaveProperty('slug', 'test-project');
		expect(projects[0]).toHaveProperty('thumbnailUrl');
		expect(projects[0]).toHaveProperty('featured', true);
	});
});

describe('getPressItems', () => {
	beforeEach(() => {
		mockGetEntries.mockReset();
	});

	it('fetches press items ordered by date descending', async () => {
		mockGetEntries.mockResolvedValue({
			items: [{
				fields: {
					title: 'Press Title',
					source: 'NYT',
					url: 'https://nyt.com/article',
					date: '2025-01-15',
				},
			}],
		});

		const { getPressItems } = await import('$lib/contentful/queries');
		const items = await getPressItems();
		expect(mockGetEntries).toHaveBeenCalledWith(expect.objectContaining({
			content_type: 'pressItem',
		}));
		expect(items[0]).toHaveProperty('title', 'Press Title');
		expect(items[0]).toHaveProperty('source', 'NYT');
	});
});

describe('getSiteSettings', () => {
	beforeEach(() => {
		mockGetEntries.mockReset();
	});

	it('fetches singleton site settings', async () => {
		mockGetEntries.mockResolvedValue({
			items: [{
				fields: {
					siteTitle: 'Michelle Ngo',
					tagline: 'Creative Producer',
					imdbUrl: 'https://imdb.com/name/123',
					linkedinUrl: 'https://linkedin.com/in/test',
					vimeoUrl: 'https://vimeo.com/user2149742',
					youtubeUrl: 'https://youtube.com/test',
					resumePdf: { fields: { file: { url: '//assets.ctfassets.net/resume.pdf' } } },
				},
			}],
		});

		const { getSiteSettings } = await import('$lib/contentful/queries');
		const settings = await getSiteSettings();
		expect(settings).toHaveProperty('siteTitle', 'Michelle Ngo');
		expect(settings).toHaveProperty('socialLinks');
		expect(settings.socialLinks).toHaveProperty('imdb', 'https://imdb.com/name/123');
		expect(settings).toHaveProperty('resumePdfUrl');
	});
});
