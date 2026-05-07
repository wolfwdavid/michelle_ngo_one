import type { PageServerLoad } from './$types';
import { getPageBySlug } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const page = await getPageBySlug('about');
	return { page };
};
