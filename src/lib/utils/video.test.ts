import { describe, it, expect } from 'vitest';
import { parseVideoUrl } from './video';
import type { VideoInfo } from './video';

describe('parseVideoUrl', () => {
	it('parses standard Vimeo URL', () => {
		const result = parseVideoUrl('https://vimeo.com/123456');
		expect(result).toEqual({
			platform: 'vimeo',
			id: '123456',
			embedUrl: 'https://player.vimeo.com/video/123456?autoplay=1',
		});
	});

	it('parses Vimeo player embed URL', () => {
		const result = parseVideoUrl('https://player.vimeo.com/video/789');
		expect(result).toEqual({
			platform: 'vimeo',
			id: '789',
			embedUrl: 'https://player.vimeo.com/video/789?autoplay=1',
		});
	});

	it('parses YouTube watch URL', () => {
		const result = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
		expect(result).toEqual({
			platform: 'youtube',
			id: 'dQw4w9WgXcQ',
			embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
		});
	});

	it('parses YouTube short URL', () => {
		const result = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
		expect(result).toEqual({
			platform: 'youtube',
			id: 'dQw4w9WgXcQ',
			embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
		});
	});

	it('returns null for empty string', () => {
		expect(parseVideoUrl('')).toBeNull();
	});

	it('returns null for unknown URL', () => {
		expect(parseVideoUrl('https://example.com')).toBeNull();
	});

	it('parses YouTube embed URL', () => {
		const result = parseVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
		expect(result).toEqual({
			platform: 'youtube',
			id: 'dQw4w9WgXcQ',
			embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
		});
	});
});
