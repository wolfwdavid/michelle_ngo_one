import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const projects = await getProjects('filmProject');
	return {
		projects,
		categoryName: 'Film & TV',
		categorySlug: 'film-tv',
	};
};
