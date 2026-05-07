import type { PageServerLoad } from './$types';
import { getProjects, getFeaturedProjects, getPressItems } from '$lib/contentful/queries';
import { CATEGORIES } from '$lib/config/categories';

export const load: PageServerLoad = async () => {
	try {
		const [categoryData, pressItems] = await Promise.all([
			Promise.all(
				CATEGORIES.map(async (cat) => ({
					name: cat.name,
					slug: cat.slug,
					href: cat.href,
					contentTypeId: cat.contentTypeId,
					featured: await getFeaturedProjects(cat.contentTypeId),
					all: await getProjects(cat.contentTypeId),
				}))
			),
			getPressItems(),
		]);

		return {
			categories: categoryData,
			pressHighlights: pressItems.slice(0, 3),
		};
	} catch (error) {
		console.error('Failed to load homepage data:', error);
		return {
			categories: CATEGORIES.map((cat) => ({
				name: cat.name,
				slug: cat.slug,
				href: cat.href,
				contentTypeId: cat.contentTypeId,
				featured: [],
				all: [],
			})),
			pressHighlights: [],
		};
	}
};
