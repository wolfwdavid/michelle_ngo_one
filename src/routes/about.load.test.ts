import { describe, it, vi } from 'vitest';

vi.mock('$lib/contentful/queries', () => ({
	getPageBySlug: vi.fn(),
}));

describe('About page load function', () => {
	it.todo('load function calls getPageBySlug with "about"');

	it.todo('returns page data with title, body, photoUrl, seoDescription');

	it.todo('returns null gracefully when no page found');
});
