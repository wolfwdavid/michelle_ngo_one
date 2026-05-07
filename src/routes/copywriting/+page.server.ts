import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const projects = await getProjects('copywritingProject');
	return {
		projects,
		categoryName: 'Copywriting',
		categorySlug: 'copywriting',
	};
};
