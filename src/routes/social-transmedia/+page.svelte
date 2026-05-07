<script lang="ts">
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import VideoThumbnailCard from '$lib/components/VideoThumbnailCard.svelte';
	import VideoLightbox from '$lib/components/VideoLightbox.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	let { data } = $props();
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	function openLightbox(index: number) {
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<SEO
	title="{data.categoryName} | Michelle Ngo"
	description="Michelle Ngo's {data.categoryName.toLowerCase()} portfolio"
/>

<div class="mx-auto max-w-7xl px-4 py-8 lg:px-8">
	<Breadcrumb items={[
		{ label: 'Home', href: `${base}/` },
		{ label: data.categoryName },
	]} />

	<h1 class="mt-4 text-2xl font-semibold text-gray-900 mb-6">{data.categoryName}</h1>

	{#if data.projects.length === 0}
		<div class="py-16 text-center">
			<h2 class="text-xl font-semibold text-gray-900">No projects yet</h2>
			<p class="mt-2 text-base text-gray-500">Projects for this category are being added. Check back soon.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
			{#each data.projects as project, i}
				<ScrollReveal delay={Math.min(i, 6) * 75}>
					<VideoThumbnailCard
						thumbnailUrl={project.thumbnailUrl}
						title={project.title}
						videoUrl={project.videoUrl ?? ''}
						onclick={() => openLightbox(i)}
						href="{base}/{data.categorySlug}/{project.slug}/"
					/>
				</ScrollReveal>
			{/each}
		</div>
	{/if}
</div>

<VideoLightbox
	projects={data.projects}
	bind:currentIndex={lightboxIndex}
	bind:open={lightboxOpen}
/>
