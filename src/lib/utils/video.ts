export type VideoPlatform = 'vimeo' | 'youtube' | 'unknown';

export interface VideoInfo {
	platform: VideoPlatform;
	id: string;
	embedUrl: string;
}

export function parseVideoUrl(url: string): VideoInfo | null {
	if (!url) return null;

	// Vimeo: vimeo.com/123456 or player.vimeo.com/video/123456
	const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vimeoMatch) {
		return {
			platform: 'vimeo',
			id: vimeoMatch[1],
			embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
		};
	}

	// YouTube: youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
	const ytMatch = url.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
	);
	if (ytMatch) {
		return {
			platform: 'youtube',
			id: ytMatch[1],
			embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`,
		};
	}

	return null;
}
