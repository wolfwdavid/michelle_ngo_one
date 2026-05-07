import { describe, it, expect } from 'vitest';
import { contentfulSrcset, contentfulSrc } from '$lib/contentful/image';

describe('contentfulSrc', () => {
	it('generates a URL with default width, format, and quality', () => {
		const url = contentfulSrc('//images.ctfassets.net/space/abc123/photo.jpg');
		expect(url).toBe('https://images.ctfassets.net/space/abc123/photo.jpg?w=960&fm=webp&q=80');
	});

	it('accepts custom width, format, and quality', () => {
		const url = contentfulSrc('//images.ctfassets.net/space/abc123/photo.jpg', 640, 'avif', 70);
		expect(url).toBe('https://images.ctfassets.net/space/abc123/photo.jpg?w=640&fm=avif&q=70');
	});
});

describe('contentfulSrcset', () => {
	it('generates srcset with 4 widths (320, 640, 960, 1280)', () => {
		const srcset = contentfulSrcset('//images.ctfassets.net/space/abc123/photo.jpg');
		expect(srcset).toContain('320w');
		expect(srcset).toContain('640w');
		expect(srcset).toContain('960w');
		expect(srcset).toContain('1280w');
	});

	it('uses webp format by default', () => {
		const srcset = contentfulSrcset('//images.ctfassets.net/space/abc123/photo.jpg');
		expect(srcset).toContain('fm=webp');
		expect(srcset).not.toContain('fm=avif');
	});

	it('accepts avif format', () => {
		const srcset = contentfulSrcset('//images.ctfassets.net/space/abc123/photo.jpg', 'avif');
		expect(srcset).toContain('fm=avif');
	});

	it('prepends https: to protocol-relative URLs', () => {
		const srcset = contentfulSrcset('//images.ctfassets.net/space/abc123/photo.jpg');
		expect(srcset).toContain('https://images.ctfassets.net');
		// Ensure no bare protocol-relative URL (without https: prefix)
		expect(srcset).not.toMatch(/(?<!https:)\/\/images\.ctfassets\.net/);
	});
});
