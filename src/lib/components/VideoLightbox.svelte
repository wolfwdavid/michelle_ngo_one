<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { parseVideoUrl } from '$lib/utils/video';
	import type { Project } from '$lib/contentful/types';

	let {
		projects,
		currentIndex = $bindable(0),
		open = $bindable(false),
	}: {
		projects: Project[];
		currentIndex: number;
		open: boolean;
	} = $props();

	let modalEl: HTMLDivElement = $state(undefined as unknown as HTMLDivElement);
	let triggerEl: HTMLElement | null = $state(null);

	const current = $derived(projects[currentIndex]);
	const videoInfo = $derived(current ? parseVideoUrl(current.videoUrl ?? '') : null);
	const hasPrev = $derived(currentIndex > 0);
	const hasNext = $derived(currentIndex < projects.length - 1);

	export function openAt(index: number, trigger?: HTMLElement) {
		currentIndex = index;
		triggerEl = trigger ?? null;
		open = true;
	}

	function closeLightbox() {
		open = false;
		triggerEl?.focus();
		triggerEl = null;
	}

	function trapFocus(event: KeyboardEvent) {
		if (!modalEl) return;
		const focusable = modalEl.querySelectorAll<HTMLElement>('button:not([disabled]), iframe');
		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeLightbox();
		} else if (event.key === 'ArrowLeft') {
			if (hasPrev) currentIndex--;
		} else if (event.key === 'ArrowRight') {
			if (hasNext) currentIndex++;
		} else if (event.key === 'Tab') {
			trapFocus(event);
		}
	}

	$effect(() => {
		if (open && modalEl) {
			const closeBtn = modalEl.querySelector<HTMLElement>('button');
			closeBtn?.focus();
		}
	});

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if open && current && videoInfo}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-60 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
		aria-label="Video player"
		tabindex="-1"
		bind:this={modalEl}
		onkeydown={handleKeydown}
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/85"
			transition:fade={{ duration: 200 }}
			onclick={closeLightbox}
			role="presentation"
		></div>

		<!-- Content wrapper -->
		<div class="relative z-10 w-[90vw] max-w-[960px]" transition:scale={{ start: 0.95, duration: 200 }}>
			<!-- Close button -->
			<button
				class="absolute -top-12 right-0 flex h-11 w-11 items-center justify-center text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] focus:ring-offset-2 focus:ring-offset-black rounded"
				aria-label="Close video player"
				onclick={closeLightbox}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>

			<!-- Iframe container -->
			<div class="aspect-video bg-black">
				<iframe
					src={videoInfo.embedUrl}
					title={current.title}
					class="h-full w-full"
					allow="autoplay; fullscreen"
					frameborder="0"
				></iframe>
			</div>

			<!-- Title -->
			<p class="mt-3 text-center text-base font-semibold text-white">{current.title}</p>
		</div>

		<!-- Prev arrow -->
		{#if hasPrev}
			<button
				class="absolute left-0 top-1/2 -translate-x-14 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] rounded"
				aria-label="Previous video"
				onclick={() => currentIndex--}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
			</button>
		{/if}

		<!-- Next arrow -->
		{#if hasNext}
			<button
				class="absolute right-0 top-1/2 translate-x-14 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] rounded"
				aria-label="Next video"
				onclick={() => currentIndex++}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polyline points="9 6 15 12 9 18" />
				</svg>
			</button>
		{/if}
	</div>
{/if}
