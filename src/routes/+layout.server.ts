import { getSiteSettings } from '$lib/contentful/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const siteSettings = await getSiteSettings();
		return { siteSettings };
	} catch (error) {
		console.error('Failed to load site settings from Contentful:', error);
		// Fallback defaults so the site still builds without CMS
		return {
			siteSettings: {
				siteTitle: 'Michelle Ngo',
				tagline: 'Producer, Filmmaker, Copywriter, UX Designer',
				socialLinks: {
					imdb: '',
					linkedin: '',
					vimeo: 'https://vimeo.com/user2149742',
					youtube: '',
				},
				resumePdfUrl: null,
				heroVideoUrl: null,
				heroThumbnailUrl: null,
				contactEmail: '',
			},
		};
	}
};
