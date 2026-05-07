import { contentfulClient } from './client';
import type {
	Project,
	PressItem,
	BlogPost,
	SiteSettingsData,
	ResumeData,
	PageData,
	ProjectContentTypeId,
} from './types';
import type { Document } from '@contentful/rich-text-types';

export async function getProjects(contentTypeId: ProjectContentTypeId): Promise<Project[]> {
	const entries = await contentfulClient.getEntries({
		content_type: contentTypeId,
		order: ['fields.sortOrder'],
	});

	return entries.items.map((item: any) => ({
		title: item.fields.title ?? '',
		slug: item.fields.slug ?? '',
		description: item.fields.description ?? '',
		thumbnailUrl: item.fields.thumbnail?.fields?.file?.url ?? null,
		videoUrl: item.fields.videoUrl ?? null,
		featured: item.fields.featured ?? false,
		sortOrder: item.fields.sortOrder ?? 0,
		client: item.fields.client,
		agency: item.fields.agency,
		role: item.fields.role,
		year: item.fields.year,
		productionType: item.fields.productionType,
		platform: item.fields.platform,
		publisher: item.fields.publisher,
	}));
}

export async function getFeaturedProjects(contentTypeId: ProjectContentTypeId): Promise<Project[]> {
	const entries = await contentfulClient.getEntries({
		content_type: contentTypeId,
		'fields.featured': true,
		order: ['fields.sortOrder'],
	});

	return entries.items.map((item: any) => ({
		title: item.fields.title ?? '',
		slug: item.fields.slug ?? '',
		description: item.fields.description ?? '',
		thumbnailUrl: item.fields.thumbnail?.fields?.file?.url ?? null,
		videoUrl: item.fields.videoUrl ?? null,
		featured: true,
		sortOrder: item.fields.sortOrder ?? 0,
		client: item.fields.client,
		agency: item.fields.agency,
		role: item.fields.role,
		year: item.fields.year,
		productionType: item.fields.productionType,
		platform: item.fields.platform,
		publisher: item.fields.publisher,
	}));
}

export async function getPressItems(): Promise<PressItem[]> {
	const entries = await contentfulClient.getEntries({
		content_type: 'pressItem',
		order: ['-fields.date'],
	});

	return entries.items.map((item: any) => ({
		title: item.fields.title ?? '',
		source: item.fields.source ?? '',
		url: item.fields.url ?? '',
		date: item.fields.date ?? '',
	}));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
	const entries = await contentfulClient.getEntries({
		content_type: 'blogPost',
		order: ['-fields.publishedDate'],
	});

	return entries.items.map((item: any) => ({
		title: item.fields.title ?? '',
		slug: item.fields.slug ?? '',
		body: item.fields.body as Document,
		publishedDate: item.fields.publishedDate ?? '',
		excerpt: item.fields.excerpt ?? '',
		coverImageUrl: item.fields.coverImage?.fields?.file?.url ?? null,
	}));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
	const entries = await contentfulClient.getEntries({
		content_type: 'blogPost',
		'fields.slug': slug,
		limit: 1,
	});

	const item = entries.items[0];
	if (!item) return null;

	return {
		title: (item.fields.title as string) ?? '',
		slug: (item.fields.slug as string) ?? '',
		body: item.fields.body as Document,
		publishedDate: (item.fields.publishedDate as string) ?? '',
		excerpt: (item.fields.excerpt as string) ?? '',
		coverImageUrl: (item.fields.coverImage as any)?.fields?.file?.url ?? null,
	};
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
	const entries = await contentfulClient.getEntries({
		content_type: 'siteSettings',
		limit: 1,
	});

	const fields: any = entries.items[0]?.fields ?? {};

	return {
		siteTitle: fields.siteTitle ?? 'Michelle Ngo',
		tagline: fields.tagline ?? '',
		socialLinks: {
			imdb: fields.imdbUrl ?? '',
			linkedin: fields.linkedinUrl ?? '',
			vimeo: fields.vimeoUrl ?? '',
			youtube: fields.youtubeUrl ?? '',
		},
		resumePdfUrl: fields.resumePdf?.fields?.file?.url
			? `https:${fields.resumePdf.fields.file.url}`
			: null,
		heroVideoUrl: (fields.heroVideoUrl as string) ?? null,
		heroThumbnailUrl: fields.heroThumbnail?.fields?.file?.url
			? `https:${fields.heroThumbnail.fields.file.url}`
			: null,
		contactEmail: (fields.contactEmail as string) ?? '',
	};
}

export async function getResume(): Promise<ResumeData> {
	const entries = await contentfulClient.getEntries({
		content_type: 'resume',
		limit: 1,
	});

	const fields: any = entries.items[0]?.fields ?? {};

	return {
		resumePdfUrl: fields.resumePdf?.fields?.file?.url
			? `https:${fields.resumePdf.fields.file.url}`
			: null,
		experience: fields.experience ?? [],
		education: fields.education ?? [],
		skills: fields.skills ?? [],
	};
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
	const entries = await contentfulClient.getEntries({
		content_type: 'page',
		'fields.slug': slug,
		limit: 1,
	});

	const item = entries.items[0];
	if (!item) return null;

	return {
		title: (item.fields.title as string) ?? '',
		slug: (item.fields.slug as string) ?? '',
		body: (item.fields.body as Document) ?? null,
		photoUrl: (item.fields.photo as any)?.fields?.file?.url
			? `https:${(item.fields.photo as any).fields.file.url}`
			: null,
		seoDescription: (item.fields.seoDescription as string) ?? '',
	};
}

export async function getProjectBySlug(
	contentTypeId: ProjectContentTypeId,
	slug: string
): Promise<Project | null> {
	const entries = await contentfulClient.getEntries({
		content_type: contentTypeId,
		'fields.slug': slug,
		limit: 1,
	});

	const item = entries.items[0];
	if (!item) return null;

	return {
		title: (item.fields.title as string) ?? '',
		slug: (item.fields.slug as string) ?? '',
		description: (item.fields.description as string) ?? '',
		thumbnailUrl: (item.fields.thumbnail as any)?.fields?.file?.url ?? null,
		videoUrl: (item.fields.videoUrl as string) ?? null,
		featured: (item.fields.featured as boolean) ?? false,
		sortOrder: (item.fields.sortOrder as number) ?? 0,
		client: item.fields.client as string | undefined,
		agency: item.fields.agency as string | undefined,
		role: item.fields.role as string | undefined,
		year: item.fields.year as number | undefined,
		productionType: item.fields.productionType as string | undefined,
		platform: item.fields.platform as string | undefined,
		publisher: item.fields.publisher as string | undefined,
	};
}
