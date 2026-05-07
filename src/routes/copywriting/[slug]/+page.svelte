<script lang="ts">
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import VideoFacade from '$lib/components/VideoFacade.svelte';

	let { data } = $props();
	const p = $derived(data.project);
</script>

<SEO
	title="{p.title} | Michelle Ngo"
	description={p.description || `${p.title} - Michelle Ngo's ${data.categoryName.toLowerCase()} work`}
	image={p.thumbnailUrl ?? ''}
/>

<div class="mx-auto max-w-7xl px-4 py-8 lg:px-8">
	<Breadcrumb items={[
		{ label: 'Home', href: `${base}/` },
		{ label: data.categoryName, href: `${base}/${data.categorySlug}/` },
		{ label: p.title },
	]} />

	<div class="mx-auto max-w-[800px]">
		<h1 class="mt-4 text-2xl font-semibold text-gray-900 mb-4">{p.title}</h1>

		{#if p.videoUrl}
			<VideoFacade
				videoUrl={p.videoUrl}
				thumbnailUrl={p.thumbnailUrl}
				title={p.title}
				inline={true}
			/>
		{/if}

		<dl class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
			{#if p.role}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Role</dt>
					<dd class="text-base text-gray-900">{p.role}</dd>
				</div>
			{/if}
			{#if p.client}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Client</dt>
					<dd class="text-base text-gray-900">{p.client}</dd>
				</div>
			{/if}
			{#if p.agency}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Agency</dt>
					<dd class="text-base text-gray-900">{p.agency}</dd>
				</div>
			{/if}
			{#if p.year}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Year</dt>
					<dd class="text-base text-gray-900">{p.year}</dd>
				</div>
			{/if}
			{#if p.productionType}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Production Type</dt>
					<dd class="text-base text-gray-900">{p.productionType}</dd>
				</div>
			{/if}
			{#if p.platform}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Platform</dt>
					<dd class="text-base text-gray-900">{p.platform}</dd>
				</div>
			{/if}
			{#if p.publisher}
				<div>
					<dt class="text-sm font-semibold uppercase text-gray-500">Publisher</dt>
					<dd class="text-base text-gray-900">{p.publisher}</dd>
				</div>
			{/if}
		</dl>

		{#if p.description}
			<p class="mt-6 text-base leading-relaxed text-gray-700">{p.description}</p>
		{/if}
	</div>
</div>
