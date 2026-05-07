import { describe, it, expect, vi } from 'vitest';
import { INLINES, BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import { renderRichText } from '$lib/contentful/richtext';

function makeDocWithLink(url: string, text: string): Document {
	return {
		nodeType: BLOCKS.DOCUMENT,
		data: {},
		content: [
			{
				nodeType: BLOCKS.PARAGRAPH,
				data: {},
				content: [
					{
						nodeType: INLINES.HYPERLINK,
						data: { uri: url },
						content: [
							{
								nodeType: 'text',
								value: text,
								marks: [],
								data: {},
							},
						],
					},
				],
			},
		],
	};
}

describe('Rich Text video URL rendering', () => {
	it('renders Vimeo URL as data-video-facade placeholder', () => {
		const doc = makeDocWithLink('https://vimeo.com/123456', 'Watch on Vimeo');
		const html = renderRichText(doc);
		expect(html).toContain('data-video-facade');
	});

	it('renders YouTube URL as data-video-facade placeholder', () => {
		const doc = makeDocWithLink('https://www.youtube.com/watch?v=abc123def45', 'Watch on YouTube');
		const html = renderRichText(doc);
		expect(html).toContain('data-video-facade');
	});

	it('renders regular hyperlink as normal anchor tag', () => {
		const doc = makeDocWithLink('https://example.com', 'Example');
		const html = renderRichText(doc);
		expect(html).toContain('<a href=');
		expect(html).toContain('https://example.com');
		expect(html).not.toContain('data-video-facade');
	});
});
