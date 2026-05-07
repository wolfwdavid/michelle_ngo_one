import type { PageServerLoad } from './$types';
import { getBlogPosts } from '$lib/contentful/queries';

export const load: PageServerLoad = async () => {
	const posts = await getBlogPosts();
	return { posts };
};
