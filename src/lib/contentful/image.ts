const WIDTHS = [320, 640, 960, 1280] as const;

export function contentfulSrcset(
	baseUrl: string,
	format: 'webp' | 'avif' = 'webp',
	quality = 80
): string {
	const normalizedUrl = baseUrl.startsWith('//') ? `https:${baseUrl}` : baseUrl;
	return WIDTHS
		.map((w) => `${normalizedUrl}?w=${w}&fm=${format}&q=${quality} ${w}w`)
		.join(', ');
}

export function contentfulSrc(
	baseUrl: string,
	width = 960,
	format: 'webp' | 'avif' = 'webp',
	quality = 80
): string {
	const normalizedUrl = baseUrl.startsWith('//') ? `https:${baseUrl}` : baseUrl;
	return `${normalizedUrl}?w=${width}&fm=${format}&q=${quality}`;
}
