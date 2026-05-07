<script lang="ts">
	import type { PressItem } from '$lib/contentful/types';

	let { items }: { items: PressItem[] } = $props();
</script>

{#if items.length > 0}
	<section class="px-4 py-8 pb-12 lg:px-8">
		<div class="mx-auto max-w-7xl">
			<h2 class="mb-6 text-2xl font-semibold text-gray-900">Recent Press</h2>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
				{#each items as item}
					<article>
						<p class="text-sm font-semibold uppercase tracking-wider text-gray-500">
							{item.source}
						</p>
						<a
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							class="mt-1 block text-base font-semibold text-gray-900 hover:text-[#4A6FA5]"
						>
							{item.title}
						</a>
						<p class="mt-1 text-sm text-gray-500">
							{new Date(item.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}
