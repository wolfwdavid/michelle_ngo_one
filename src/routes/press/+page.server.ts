import type { PageServerLoad } from './$types';
import { getPressItems } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const pressItems = await getPressItems();
	return { pressItems };
};
