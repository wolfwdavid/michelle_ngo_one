<script lang="ts">
	import VideoFacade from './VideoFacade.svelte';

	let {
		thumbnailUrl = null,
		title,
		videoUrl,
		onclick,
		href = undefined,
	}: {
		thumbnailUrl?: string | null;
		title: string;
		videoUrl: string;
		onclick: () => void;
		href?: string | undefined;
	} = $props();
</script>

<div class="border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-out overflow-hidden">
	<VideoFacade {videoUrl} {thumbnailUrl} {title} {onclick} />
	{#if href}
		<a {href} class="mt-2 block text-sm font-normal text-gray-900 truncate hover:text-accent px-2 pb-2">
			{title}
		</a>
	{:else}
		<p class="mt-2 text-sm font-normal text-gray-900 truncate px-2 pb-2">{title}</p>
	{/if}
</div>
