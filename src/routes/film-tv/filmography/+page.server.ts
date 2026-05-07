import type { PageServerLoad } from './$types';
import { getProjects } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const projects = await getProjects('filmProject');
	// Sort by year descending for chronological filmography
	const sorted = [...projects].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
	return { projects: sorted };
};
