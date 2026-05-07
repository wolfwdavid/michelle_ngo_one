import { describe, it, expect } from 'vitest';
import { parseVideoUrl } from '$lib/utils/video';

describe('VideoFacade behavior', () => {
	it('returns vimeo embed URL for valid Vimeo video URL', () => {
		const result = parseVideoUrl('https://vimeo.com/456789');
		expect(result).not.toBeNull();
		expect(result!.embedUrl).toMatch(/^https:\/\/player\.vimeo\.com\/video\//);
		expect(result!.platform).toBe('vimeo');
	});

	it('returns youtube embed URL for valid YouTube video URL', () => {
		const result = parseVideoUrl('https://www.youtube.com/watch?v=abc123def45');
		expect(result).not.toBeNull();
		expect(result!.embedUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\//);
		expect(result!.platform).toBe('youtube');
	});

	it('returns null for null/empty videoUrl (facade shows thumbnail only)', () => {
		expect(parseVideoUrl('')).toBeNull();
	});

	it('returns null for undefined-like input (facade shows thumbnail only)', () => {
		expect(parseVideoUrl('')).toBeNull();
	});
});
