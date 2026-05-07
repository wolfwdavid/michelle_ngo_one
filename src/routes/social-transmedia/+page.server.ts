import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const projects = await getProjects('socialTransmediaProject');
	return {
		projects,
		categoryName: 'Social & Transmedia',
		categorySlug: 'social-transmedia',
	};
};
