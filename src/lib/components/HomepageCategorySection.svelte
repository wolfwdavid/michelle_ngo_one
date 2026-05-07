<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import VideoFacade from './VideoFacade.svelte';
	import VideoThumbnailCard from './VideoThumbnailCard.svelte';
	import type { Project } from '$lib/contentful/types';

	let {
		name,
		slug,
		href,
		featured,
		all,
		expanded,
		onToggle,
		onPlayVideo,
	}: {
		name: string;
		slug: string;
		href: string;
		featured: Project[];
		all: Project[];
		expanded: boolean;
		onToggle: () => void;
		onPlayVideo: (projects: Project[], index: number) => void;
	} = $props();

	const panelId = $derived(`category-panel-${slug}`);

	// Build initial display: up to 4 items, preferring featured
	const initialProjects = $derived.by(() => {
		const initial = [...featured.slice(0, 4)];
		if (initial.length < 4) {
			const remaining = all.filter((p) => !initial.some((f) => f.slug === p.slug));
			initial.push(...remaining.slice(0, 4 - initial.length));
		}
		return initial;
	});

	// Projects to show when expanded (everything not in initial)
	const expandedProjects = $derived(
		all.filter((p) => !initialProjects.some((i) => i.slug === p.slug))
	);

	function findIndexInAll(project: Project): number {
		return all.findIndex((p) => p.slug === project.slug);
	}
</script>

<section class="border-t border-[#E5E7EB] px-4 py-8 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<!-- Header row -->
		<div class="flex items-baseline justify-between">
			<button
				onclick={onToggle}
				class="cursor-pointer border-none bg-transparent p-0 text-2xl font-semibold text-gray-900 hover:text-[#4A6FA5]"
				aria-expanded={expanded}
				aria-controls={panelId}
			>
				{name}
			</button>
			{#if all.length > 4}
				<button
					onclick={onToggle}
					class="cursor-pointer border-none bg-transparent p-0 text-sm text-gray-500 hover:text-[#4A6FA5]"
				>
					See all {all.length} projects
				</button>
			{/if}
		</div>

		<!-- Initial display: up to 4 items -->
		{#if initialProjects.length > 0}
			<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
				<!-- Featured (first item) - larger on desktop -->
				{#if initialProjects[0]}
					<div class="lg:col-span-2 lg:row-span-2">
						<VideoFacade
							videoUrl={initialProjects[0].videoUrl ?? ''}
							thumbnailUrl={initialProjects[0].thumbnailUrl}
							title={initialProjects[0].title}
							onclick={() => onPlayVideo(all, findIndexInAll(initialProjects[0]))}
						/>
						<a
							href="{href}{initialProjects[0].slug}/"
							class="mt-2 block truncate text-sm font-normal text-gray-900 hover:text-[#4A6FA5]"
						>
							{initialProjects[0].title}
						</a>
					</div>
				{/if}

				<!-- Secondary items (2-4) -->
				{#each initialProjects.slice(1) as project}
					<VideoThumbnailCard
						thumbnailUrl={project.thumbnailUrl}
						title={project.title}
						videoUrl={project.videoUrl ?? ''}
						onclick={() => onPlayVideo(all, findIndexInAll(project))}
						href="{href}{project.slug}/"
					/>
				{/each}
			</div>
		{/if}

		<!-- Expanded content (accordion) -->
		{#if expanded && expandedProjects.length > 0}
			<div id={panelId} transition:slide={{ duration: 300, easing: cubicOut }}>
				<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
					{#each expandedProjects as project}
						<VideoThumbnailCard
							thumbnailUrl={project.thumbnailUrl}
							title={project.title}
							videoUrl={project.videoUrl ?? ''}
							onclick={() => onPlayVideo(all, findIndexInAll(project))}
							href="{href}{project.slug}/"
						/>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>
