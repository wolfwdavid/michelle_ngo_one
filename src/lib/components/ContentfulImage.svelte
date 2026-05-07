<script lang="ts">
	import { contentfulSrcset, contentfulSrc } from '$lib/contentful/image';
	import { inview } from 'svelte-inview';

	let {
		url,
		alt = '',
		sizes = '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw',
		class: className = '',
		loading = 'lazy' as 'lazy' | 'eager',
		aspectRatio = '',
	}: {
		url: string;
		alt?: string;
		sizes?: string;
		class?: string;
		loading?: 'lazy' | 'eager';
		aspectRatio?: string;
	} = $props();

	let isInView = $state(false);
	let isLoaded = $state(false);

	function handleEnter() {
		isInView = true;
	}

	function handleLoad() {
		isLoaded = true;
	}
</script>

<div
	use:inview={{ threshold: 0.1 }}
	oninview_enter={handleEnter}
	class="overflow-hidden rounded-sm bg-gray-50 {className}"
	style={aspectRatio ? `aspect-ratio: ${aspectRatio}` : ''}
>
	{#if isInView || loading === 'eager'}
		<picture>
			<source
				srcset={contentfulSrcset(url, 'avif')}
				{sizes}
				type="image/avif"
			/>
			<source
				srcset={contentfulSrcset(url, 'webp')}
				{sizes}
				type="image/webp"
			/>
			<img
				src={contentfulSrc(url)}
				srcset={contentfulSrcset(url, 'webp')}
				{sizes}
				{alt}
				loading={loading}
				onload={handleLoad}
				class="h-full w-full object-cover transition-opacity duration-300 ease-out {isLoaded ? 'opacity-100' : 'opacity-0'}"
			/>
		</picture>
	{/if}
</div>
