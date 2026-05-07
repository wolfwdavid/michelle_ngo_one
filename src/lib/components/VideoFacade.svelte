<script lang="ts">
	import { parseVideoUrl } from '$lib/utils/video';
	import ContentfulImage from './ContentfulImage.svelte';

	let {
		videoUrl,
		thumbnailUrl = null,
		title,
		onclick = undefined,
		inline = false,
	}: {
		videoUrl: string;
		thumbnailUrl?: string | null;
		title: string;
		onclick?: (() => void) | undefined;
		inline?: boolean;
	} = $props();

	let playing = $state(false);
	let videoInfo = $derived(parseVideoUrl(videoUrl));

	function handleClick() {
		if (onclick) {
			onclick();
		} else {
			playing = true;
		}
	}
</script>

<div class="group relative aspect-video overflow-hidden rounded-sm bg-gray-50">
	{#if inline && playing && videoInfo}
		<iframe
			src={videoInfo.embedUrl}
			title={title}
			class="absolute inset-0 h-full w-full"
			allow="autoplay; fullscreen"
			frameborder="0"
		></iframe>
	{:else}
		<button
			type="button"
			class="relative h-full w-full cursor-pointer"
			aria-label="Play {title}"
			onclick={handleClick}
		>
			{#if thumbnailUrl}
				<div class="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
					<ContentfulImage url={thumbnailUrl} alt={title} aspectRatio="16/9" />
				</div>
			{:else}
				<div class="h-full w-full bg-gray-100"></div>
			{/if}
			<!-- Play overlay -->
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-black/50">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="white" aria-hidden="true">
						<polygon points="5,3 17,10 5,17" />
					</svg>
				</div>
			</div>
		</button>
	{/if}
</div>
