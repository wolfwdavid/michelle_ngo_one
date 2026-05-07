import { base } from '$app/paths';
import type { ProjectContentTypeId } from '$lib/contentful/types';

export interface CategoryConfig {
	name: string;
	slug: string;
	href: string;
	contentTypeId: ProjectContentTypeId;
}

export const CATEGORIES: CategoryConfig[] = [
	{ name: 'Advertising', slug: 'advertising', contentTypeId: 'advertisingProject', href: `${base}/advertising/` },
	{ name: 'Film & TV', slug: 'film-tv', contentTypeId: 'filmProject', href: `${base}/film-tv/` },
	{ name: 'UX Design', slug: 'ux-design', contentTypeId: 'uxDesignProject', href: `${base}/ux-design/` },
	{ name: 'Social & Transmedia', slug: 'social-transmedia', contentTypeId: 'socialTransmediaProject', href: `${base}/social-transmedia/` },
	{ name: 'Publishing', slug: 'publishing', contentTypeId: 'publishingProject', href: `${base}/publishing/` },
	{ name: 'Copywriting', slug: 'copywriting', contentTypeId: 'copywritingProject', href: `${base}/copywriting/` },
];
