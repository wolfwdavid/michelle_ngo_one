<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { PressItem } from '$lib/contentful/types';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	let { data } = $props();
	const pressItems = $derived(data.pressItems);

	const groupedByYear = $derived.by(() => {
		const groups = new Map<number, PressItem[]>();
		for (const item of pressItems) {
			const year = new Date(item.date).getFullYear();
			if (!groups.has(year)) groups.set(year, []);
			groups.get(year)!.push(item);
		}
		return [...groups.entries()].sort((a, b) => b[0] - a[0]);
	});

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});
	}
</script>

<div class="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16">
	<SEO title="Press" description="Press coverage and media mentions for Michelle Ngo" />
	<Breadcrumb items={[{ label: 'Press' }]} />

	<h1 class="text-2xl font-semibold text-gray-900 mt-4 mb-8">Press</h1>

	{#if pressItems.length > 0}
		{#each groupedByYear as [year, items], i}
			<h2 class="text-lg font-semibold text-gray-900 {i === 0 ? 'mt-0' : 'mt-8'} mb-4">{year}</h2>
			{#each items as item, j}
				<ScrollReveal delay={Math.min(j, 6) * 75}>
				<div class="py-4 border-b border-gray-200 last:border-b-0">
					<p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.source}</p>
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-base font-semibold text-gray-900 mt-1 hover:text-accent transition-colors inline-flex items-center gap-1"
					>
						{item.title}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-gray-400 inline-block">
							<path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
						</svg>
						<span class="sr-only">(opens in new tab)</span>
					</a>
					<p class="text-sm text-gray-500 mt-1">{formatDate(item.date)}</p>
				</div>
				</ScrollReveal>
			{/each}
		{/each}
	{:else}
		<div class="text-center py-16">
			<h2 class="text-lg font-semibold text-gray-900 mb-2">No press mentions yet</h2>
			<p class="text-base text-gray-500">Press coverage is being added. Check back soon.</p>
		</div>
	{/if}
</div>
