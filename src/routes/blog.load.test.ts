import { describe, it, vi } from 'vitest';

vi.mock('$lib/contentful/queries', () => ({
	getBlogPosts: vi.fn(),
	getBlogPostBySlug: vi.fn(),
}));

describe('Blog page load functions', () => {
	it.todo('blog index load calls getBlogPosts');

	it.todo('blog detail load calls getBlogPostBySlug with slug param');

	it.todo('blog detail entries() returns slugs from getBlogPosts');
});
