<script lang="ts">
	import { renderRichText } from '$lib/contentful/richtext';
	import type { Document } from '@contentful/rich-text-types';

	let { document, class: className = '' }: { document: Document | null | undefined; class?: string } = $props();

	const html = $derived(renderRichText(document));
</script>

{#if html}
	<div class="prose max-w-3xl {className}">
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
