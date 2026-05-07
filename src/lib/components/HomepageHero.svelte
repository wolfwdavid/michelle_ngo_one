<script lang="ts">
	import VideoFacade from './VideoFacade.svelte';

	let {
		tagline,
		heroVideoUrl = null,
		heroThumbnailUrl = null,
	}: {
		tagline: string;
		heroVideoUrl?: string | null;
		heroThumbnailUrl?: string | null;
	} = $props();
</script>

<section class="px-4 py-16 lg:px-8">
	<div class="mx-auto max-w-7xl text-center">
		<h1 class="text-3xl font-semibold text-gray-900 lg:text-4xl">Michelle Ngo</h1>
		<p class="mt-2 text-base text-gray-500">{tagline || 'Producer. Filmmaker. Creative.'}</p>

		{#if heroVideoUrl}
			<div class="mx-auto mt-8 max-w-[800px]">
				<VideoFacade videoUrl={heroVideoUrl} thumbnailUrl={heroThumbnailUrl} title="Michelle Ngo Showreel" inline={true} />
			</div>
		{/if}
	</div>
</section>
