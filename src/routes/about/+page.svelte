<script lang="ts">
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import RichText from '$lib/components/RichText.svelte';
	import { CATEGORIES } from '$lib/config/categories';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';

	let { data } = $props();
	const page = $derived(data.page);
</script>

<div class="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16">
	<SEO title="About" description={page?.seoDescription ?? 'About Michelle Ngo'} />
	<Breadcrumb items={[{ label: 'About' }]} />

	<h1 class="text-2xl font-semibold text-gray-900 mt-4 mb-6">About</h1>

	{#if page}
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
			<!-- Photo column -->
			<ScrollReveal>
				<div class="lg:col-span-2">
					{#if page.photoUrl}
						<img
							src="{page.photoUrl}?w=640&fm=webp&q=80"
							alt="Michelle Ngo"
							class="w-full max-w-[320px] mx-auto lg:max-w-none aspect-[3/4] object-cover rounded-sm"
							loading="lazy"
						/>
					{/if}
				</div>
			</ScrollReveal>

			<!-- Bio column -->
			<ScrollReveal delay={75}>
				<div class="lg:col-span-3">
					<RichText document={page.body} class="text-gray-700 leading-relaxed" />
				</div>
			</ScrollReveal>
		</div>

		<!-- Disciplines grid -->
		<div class="mt-12">
			<h2 class="text-2xl font-semibold text-gray-900 mb-6">Disciplines</h2>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
				{#each CATEGORIES as cat, i}
					<ScrollReveal delay={Math.min(i, 6) * 75}>
						<a
							href={cat.href}
							class="border border-gray-200 rounded-sm px-4 py-6 text-center hover:border-[#4A6FA5] transition-colors duration-200"
						>
							<span class="text-sm font-semibold text-gray-900">{cat.name}</span>
						</a>
					</ScrollReveal>
				{/each}
			</div>
		</div>
	{:else}
		<div class="text-center py-16">
			<h2 class="text-lg font-semibold text-gray-900 mb-2">About content coming soon</h2>
			<p class="text-base text-gray-500">Michelle's bio is being updated. Check back soon.</p>
		</div>
	{/if}
</div>
