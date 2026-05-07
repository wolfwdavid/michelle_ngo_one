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

<div>
	<VideoFacade {videoUrl} {thumbnailUrl} {title} {onclick} />
	{#if href}
		<a {href} class="mt-2 block text-sm font-normal text-gray-900 truncate hover:text-[#4A6FA5]">
			{title}
		</a>
	{:else}
		<p class="mt-2 text-sm font-normal text-gray-900 truncate">{title}</p>
	{/if}
</div>
