import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetBlogPosts = vi.fn();
const mockGetBlogPostBySlug = vi.fn();

vi.mock('$lib/contentful/queries', () => ({
	getBlogPosts: (...args: any[]) => mockGetBlogPosts(...args),
	getBlogPostBySlug: (...args: any[]) => mockGetBlogPostBySlug(...args),
}));

const mockPosts = [
	{ title: 'Post 1', slug: 'post-1', body: null, publishedDate: '2025-01-01', excerpt: 'Excerpt 1', coverImageUrl: null },
	{ title: 'Post 2', slug: 'post-2', body: null, publishedDate: '2025-02-01', excerpt: 'Excerpt 2', coverImageUrl: null },
];

describe('Blog page load functions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('blog index load calls getBlogPosts', async () => {
		mockGetBlogPosts.mockResolvedValue(mockPosts);

		const { load } = await import('./blog/+page.server');
		const result = await load({} as any);

		expect(mockGetBlogPosts).toHaveBeenCalledOnce();
		expect(result.posts).toEqual(mockPosts);
	});

	it('blog detail load calls getBlogPostBySlug with slug param', async () => {
		mockGetBlogPostBySlug.mockResolvedValue(mockPosts[0]);

		const { load } = await import('./blog/[slug]/+page.server');
		const result = await load({ params: { slug: 'post-1' } } as any);

		expect(mockGetBlogPostBySlug).toHaveBeenCalledWith('post-1');
		expect(result.post).toEqual(mockPosts[0]);
	});

	it('blog detail entries() returns slugs from getBlogPosts', async () => {
		mockGetBlogPosts.mockResolvedValue(mockPosts);

		const { entries } = await import('./blog/[slug]/+page.server');
		const result = await entries();

		expect(mockGetBlogPosts).toHaveBeenCalled();
		expect(result).toEqual([{ slug: 'post-1' }, { slug: 'post-2' }]);
	});
});
