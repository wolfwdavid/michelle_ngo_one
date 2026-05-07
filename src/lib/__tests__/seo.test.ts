import { describe, it, expect } from 'vitest';

describe('renderRichText', () => {
	it('returns empty string for null input', async () => {
		const { renderRichText } = await import('$lib/contentful/richtext');
		expect(renderRichText(null)).toBe('');
	});

	it('returns empty string for undefined input', async () => {
		const { renderRichText } = await import('$lib/contentful/richtext');
		expect(renderRichText(undefined)).toBe('');
	});

	it('renders a simple paragraph', async () => {
		const { renderRichText } = await import('$lib/contentful/richtext');
		const doc = {
			nodeType: 'document' as const,
			data: {},
			content: [
				{
					nodeType: 'paragraph' as const,
					data: {},
					content: [
						{ nodeType: 'text' as const, value: 'Hello world', marks: [], data: {} },
					],
				},
			],
		};
		const html = renderRichText(doc as any);
		expect(html).toContain('Hello world');
		expect(html).toContain('<p>');
	});
});
