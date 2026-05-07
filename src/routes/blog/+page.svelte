<script lang="ts">
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	let { data } = $props();

	const posts = $derived(data.posts);
</script>

<SEO title="Blog" description="Blog posts from Michelle Ngo" />

<div class="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16">
	<Breadcrumb items={[{ label: 'Blog' }]} />

	<h1 class="text-2xl font-semibold text-gray-900 mt-4 mb-8">Blog</h1>

	{#if posts.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
			{#each posts as post, i}
				<ScrollReveal delay={Math.min(i, 6) * 75}>
				<a
					href="{base}/blog/{post.slug}/"
					class="border border-gray-200 rounded-sm overflow-hidden hover:shadow-sm transition-shadow duration-200 block"
				>
					{#if post.coverImageUrl}
						<img
							src="https:{post.coverImageUrl}?w=640&fm=webp&q=80"
							alt={post.title}
							class="aspect-video object-cover w-full"
							loading="lazy"
						/>
					{/if}
					<div class="p-4">
						<p class="text-sm text-gray-500">
							{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
						</p>
						<h2 class="text-base font-semibold text-gray-900 mt-1 line-clamp-2">{post.title}</h2>
						<p class="text-sm text-gray-500 mt-2 line-clamp-3">{post.excerpt}</p>
					</div>
				</a>
				</ScrollReveal>
			{/each}
		</div>
	{:else}
		<div class="text-center py-16">
			<h2 class="text-lg font-semibold text-gray-900">No posts yet</h2>
			<p class="text-base text-gray-500 mt-2">Blog posts are on the way. Check back soon.</p>
		</div>
	{/if}
</div>
