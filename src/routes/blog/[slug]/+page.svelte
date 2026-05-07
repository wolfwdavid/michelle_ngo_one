<script lang="ts">
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import RichText from '$lib/components/RichText.svelte';

	let { data } = $props();

	const post = $derived(data.post);
</script>

<SEO
	title={post.title}
	description={post.excerpt}
	image={post.coverImageUrl ? 'https:' + post.coverImageUrl : undefined}
/>

<div class="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16">
	<div class="max-w-3xl mx-auto">
		<Breadcrumb
			items={[
				{ label: 'Blog', href: `${base}/blog/` },
				{ label: post.title },
			]}
		/>

		<p class="text-sm text-gray-500 mt-4">
			{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
		</p>

		<h1 class="text-2xl font-semibold text-gray-900 mt-2 mb-6">{post.title}</h1>

		{#if post.coverImageUrl}
			<img
				src="https:{post.coverImageUrl}?w=960&fm=webp&q=80"
				alt={post.title}
				class="aspect-video rounded-sm w-full object-cover mb-8"
				loading="lazy"
			/>
		{/if}

		<RichText document={post.body} class="text-gray-700 leading-relaxed" />
	</div>
</div>
