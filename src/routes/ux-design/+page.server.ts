import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const projects = await getProjects('uxDesignProject');
	return {
		projects,
		categoryName: 'UX Design',
		categorySlug: 'ux-design',
	};
};
