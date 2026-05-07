import { describe, it, vi } from 'vitest';

vi.mock('$lib/contentful/queries', () => ({
	getResume: vi.fn(),
}));

describe('Resume page load function', () => {
	it.todo('load function calls getResume');

	it.todo('returns resume with experience, education, skills arrays');

	it.todo('includes resumePdfUrl');
});
