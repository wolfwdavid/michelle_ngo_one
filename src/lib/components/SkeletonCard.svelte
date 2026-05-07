<script lang="ts">
	let {
		aspect = '16/9',
		lines = 0,
		class: className = '',
	}: {
		aspect?: string;
		lines?: number;
		class?: string;
	} = $props();
</script>

<div class={className}>
	<div
		class="skeleton-shimmer rounded-sm"
		style:aspect-ratio={aspect}
		role="status"
		aria-label="Loading content..."
	>
		<span class="sr-only">Loading content...</span>
	</div>
	{#if lines > 0}
		<div class="mt-3 space-y-2">
			{#each Array(lines) as _, i}
				<div
					class="skeleton-shimmer rounded-sm h-4"
					style:width="{i === lines - 1 ? '60%' : '100%'}"
				></div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.skeleton-shimmer {
		background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
		background-size: 200% 100%;
		animation: shimmer 1500ms ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-shimmer {
			animation: none;
			background: #F3F4F6;
		}
	}
</style>
