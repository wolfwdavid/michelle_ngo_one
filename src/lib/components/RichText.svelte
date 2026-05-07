<script lang="ts">
	import { renderRichText } from '$lib/contentful/richtext';
	import { parseVideoUrl } from '$lib/utils/video';
	import type { Document } from '@contentful/rich-text-types';

	let { document, class: className = '' }: { document: Document | null | undefined; class?: string } = $props();

	const html = $derived(renderRichText(document));

	let containerEl: HTMLDivElement | undefined = $state(undefined);

	$effect(() => {
		if (!containerEl) return;
		// Re-run when html changes
		void html;
		const placeholders = containerEl.querySelectorAll('[data-video-facade]');
		for (const el of placeholders) {
			const url = decodeURIComponent(el.getAttribute('data-video-facade') ?? '');
			const title = decodeURIComponent(el.getAttribute('data-video-title') ?? '');
			const parsed = parseVideoUrl(url);
			if (!parsed) continue;

			// Build thumbnail URL
			const thumbUrl = parsed.platform === 'vimeo'
				? `https://vumbnail.com/${parsed.id}.jpg`
				: `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`;

			// Build iframe src (loaded on click)
			const iframeSrc = parsed.platform === 'vimeo'
				? `https://player.vimeo.com/video/${parsed.id}?autoplay=1`
				: `https://www.youtube.com/embed/${parsed.id}?autoplay=1`;

			// Replace placeholder with facade HTML
			el.innerHTML = `
				<button class="relative w-full h-full group cursor-pointer bg-black" aria-label="Play ${title || 'video'}">
					<img src="${thumbUrl}" alt="${title || 'Video thumbnail'}" class="w-full h-full object-cover" loading="lazy" />
					<div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
						<svg class="w-16 h-16 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
					</div>
				</button>
			`;

			// Add click handler to swap thumbnail for iframe
			const btn = el.querySelector('button');
			btn?.addEventListener('click', () => {
				el.innerHTML = `<iframe src="${iframeSrc}" class="w-full h-full" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${title || 'Embedded video'}"></iframe>`;
			});
		}
	});
</script>

{#if html}
	<div bind:this={containerEl} class="prose max-w-3xl {className}">
		{@html html}
	</div>
{/if}

<style>
	.prose :global(p) {
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.75;
		margin-bottom: 1rem;
		color: #374151; /* gray-700 */
	}
	.prose :global(h2) {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: #111827; /* gray-900 */
	}
	.prose :global(h3) {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.3;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: #111827; /* gray-900 */
	}
	.prose :global(a) {
		color: #4A6FA5;
		text-decoration: none;
	}
	.prose :global(a:hover) {
		text-decoration: underline;
	}
	.prose :global(ul),
	.prose :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
	}
	.prose :global(ul) {
		list-style-type: disc;
	}
	.prose :global(ol) {
		list-style-type: decimal;
	}
	.prose :global(li) {
		margin-bottom: 0.25rem;
	}
	.prose :global(blockquote) {
		border-left: 3px solid #4A6FA5;
		padding-left: 1rem;
		font-style: italic;
		color: #6B7280; /* gray-500 */
	}
	.prose :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.25rem;
		margin: 1.5rem 0;
	}
	.prose :global(strong) {
		font-weight: 600;
	}
	.prose :global(em) {
		font-style: italic;
	}
</style>
