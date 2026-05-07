import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const projects = await getProjects('publishingProject');
	return {
		projects,
		categoryName: 'Publishing',
		categorySlug: 'publishing',
	};
};
