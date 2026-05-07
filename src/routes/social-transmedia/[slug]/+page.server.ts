import type { PageServerLoad, EntryGenerator } from './$types';
import { getProjects, getProjectBySlug } from '$lib/contentful/queries';
import { error } from '@sveltejs/kit';

export const entries: EntryGenerator = async () => {
	const projects = await getProjects('socialTransmediaProject');
	return projects.map((p) => ({ slug: p.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const project = await getProjectBySlug('socialTransmediaProject', params.slug);
	if (!project) throw error(404, 'Project not found');
	return {
		project,
		categoryName: 'Social & Transmedia',
		categorySlug: 'social-transmedia',
	};
};
