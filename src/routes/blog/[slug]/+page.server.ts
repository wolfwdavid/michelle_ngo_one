import type { PageServerLoad, EntryGenerator } from './$types';
import { getBlogPosts, getBlogPostBySlug } from '$lib/contentful/queries';
import { error } from '@sveltejs/kit';

export const entries: EntryGenerator = async () => {
	const posts = await getBlogPosts();
	return posts.map((p) => ({ slug: p.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const post = await getBlogPostBySlug(params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
};
