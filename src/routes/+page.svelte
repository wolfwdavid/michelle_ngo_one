<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import HomepageHero from '$lib/components/HomepageHero.svelte';
	import HomepageCategorySection from '$lib/components/HomepageCategorySection.svelte';
	import HomepageAboutSnippet from '$lib/components/HomepageAboutSnippet.svelte';
	import HomepagePressHighlights from '$lib/components/HomepagePressHighlights.svelte';
	import VideoLightbox from '$lib/components/VideoLightbox.svelte';
	import type { Project } from '$lib/contentful/types';

	let { data } = $props();

	// Accordion state: only one category expanded at a time (D-06)
	let expandedCategory = $state<string | null>(null);

	function toggleCategory(slug: string) {
		expandedCategory = expandedCategory === slug ? null : slug;
	}

	// Lightbox state
	let lightboxOpen = $state(false);
	let lightboxProjects = $state<Project[]>([]);
	let lightboxIndex = $state(0);

	function openLightbox(projects: Project[], index: number) {
		lightboxProjects = projects;
		lightboxIndex = index;
		lightboxOpen = true;
	}
</script>

<SEO
	title="Michelle Ngo"
	description="Portfolio of Michelle Ngo, a multi-disciplinary creative working across advertising, film, UX design, and publishing."
/>

<HomepageHero
	tagline={data.siteSettings?.tagline ?? 'Producer. Filmmaker. Creative.'}
	heroVideoUrl={data.siteSettings?.heroVideoUrl ?? null}
	heroThumbnailUrl={data.siteSettings?.heroThumbnailUrl ?? null}
/>

{#each data.categories as cat}
	<HomepageCategorySection
		name={cat.name}
		slug={cat.slug}
		href={cat.href}
		featured={cat.featured}
		all={cat.all}
		expanded={expandedCategory === cat.slug}
		onToggle={() => toggleCategory(cat.slug)}
		onPlayVideo={openLightbox}
	/>
{/each}

<HomepageAboutSnippet />

{#if data.pressHighlights.length > 0}
	<HomepagePressHighlights items={data.pressHighlights} />
{/if}

<VideoLightbox
	projects={lightboxProjects}
	bind:currentIndex={lightboxIndex}
	bind:open={lightboxOpen}
/>
