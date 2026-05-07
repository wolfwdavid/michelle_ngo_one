import type { Document } from '@contentful/rich-text-types';
import type { Asset } from 'contentful';

// ── Content Type IDs ──────────────────────────────────────────────────

export type ProjectContentTypeId =
	| 'advertisingProject'
	| 'filmProject'
	| 'uxDesignProject'
	| 'socialTransmediaProject'
	| 'publishingProject'
	| 'copywritingProject';

// ── Raw Contentful Field Interfaces ───────────────────────────────────

export interface BaseProjectFields {
	title: string;
	slug: string;
	description: string;
	thumbnail?: Asset;
	videoUrl?: string;
	featured: boolean;
	sortOrder: number;
}

export interface AdvertisingProjectFields extends BaseProjectFields {
	client: string;
	agency: string;
	role: string;
}

export interface FilmProjectFields extends BaseProjectFields {
	year: number;
	role: string;
	productionType: string;
}

export interface UXDesignProjectFields extends BaseProjectFields {
	client: string;
	role: string;
	platform: string;
}

export interface SocialTransmediaProjectFields extends BaseProjectFields {
	client: string;
	role: string;
	platform: string;
}

export interface PublishingProjectFields extends BaseProjectFields {
	publisher: string;
	role: string;
	year: number;
}

export interface CopywritingProjectFields extends BaseProjectFields {
	client: string;
	agency: string;
	role: string;
}

export interface PressItemFields {
	title: string;
	source: string;
	url: string;
	date: string;
}

export interface BlogPostFields {
	title: string;
	slug: string;
	body: Document;
	publishedDate: string;
	excerpt: string;
	coverImage?: Asset;
}

export interface SiteSettingsFields {
	siteTitle: string;
	tagline: string;
	imdbUrl: string;
	linkedinUrl: string;
	vimeoUrl: string;
	youtubeUrl: string;
	resumePdf?: Asset;
	heroVideoUrl?: string;
	heroThumbnail?: Asset;
}

export interface ResumeFields {
	resumePdf?: Asset;
	experience: Array<{ title: string; company: string; period: string; description: string }>;
	education: Array<{ degree: string; institution: string; year: string }>;
	skills: string[];
}

// ── Normalized Component-Facing Types ─────────────────────────────────

export interface Project {
	title: string;
	slug: string;
	description: string;
	thumbnailUrl: string | null;
	videoUrl: string | null;
	featured: boolean;
	sortOrder: number;
	// Category-specific fields as optional
	client?: string;
	agency?: string;
	role?: string;
	year?: number;
	productionType?: string;
	platform?: string;
	publisher?: string;
}

export interface PressItem {
	title: string;
	source: string;
	url: string;
	date: string;
}

export interface BlogPost {
	title: string;
	slug: string;
	body: Document;
	publishedDate: string;
	excerpt: string;
	coverImageUrl: string | null;
}

export interface SiteSettingsData {
	siteTitle: string;
	tagline: string;
	socialLinks: {
		imdb: string;
		linkedin: string;
		vimeo: string;
		youtube: string;
	};
	resumePdfUrl: string | null;
	heroVideoUrl: string | null;
	heroThumbnailUrl: string | null;
}

export interface ResumeData {
	resumePdfUrl: string | null;
	experience: Array<{ title: string; company: string; period: string; description: string }>;
	education: Array<{ degree: string; institution: string; year: string }>;
	skills: string[];
}
