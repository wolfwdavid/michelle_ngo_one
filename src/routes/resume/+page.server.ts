import type { PageServerLoad } from './$types';
import { getResume } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const resume = await getResume();
	return { resume };
};
