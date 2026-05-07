<script lang="ts">
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import FilmographyTable from '$lib/components/FilmographyTable.svelte';

	let { data } = $props();
</script>

<SEO
	title="Filmography | Michelle Ngo"
	description="Michelle Ngo's filmography - a complete list of film and television credits including role, year, and production type."
/>

<div class="mx-auto max-w-7xl px-4 py-8 lg:px-8">
	<Breadcrumb items={[
		{ label: 'Home', href: `${base}/` },
		{ label: 'Film & TV', href: `${base}/film-tv/` },
		{ label: 'Filmography' },
	]} />

	<h1 class="mt-4 text-2xl font-semibold text-gray-900 mb-6">Filmography</h1>

	{#if data.projects.length === 0}
		<div class="py-16 text-center">
			<h2 class="text-xl font-semibold text-gray-900">No credits yet</h2>
			<p class="mt-2 text-base text-gray-500">Filmography entries are being added. Check back soon.</p>
		</div>
	{:else}
		<FilmographyTable projects={data.projects} />
	{/if}
</div>
