import { describe, it, vi } from 'vitest';

vi.mock('$lib/contentful/queries', () => ({
	getPressItems: vi.fn(),
}));

describe('Press page load function', () => {
	it.todo('load function calls getPressItems');

	it.todo('returns press items sorted by date descending');
});
