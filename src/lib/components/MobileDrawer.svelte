<script lang="ts">
	import { fly } from 'svelte/transition';
	import { navItems } from '$lib/config/navigation';
	import { page } from '$app/stores';
	import SocialLinks from './SocialLinks.svelte';

	let { open = $bindable(false) }: { open: boolean } = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false;
		}
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/30 z-40"
		onclick={() => (open = false)}
		role="presentation"
	></div>

	<!-- Drawer panel -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<nav
		transition:fly={{ x: 300, duration: 300 }}
		class="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-lg flex flex-col"
		onkeydown={handleKeydown}
	>
		<!-- Close button -->
		<button
			class="self-end p-4"
			onclick={() => (open = false)}
			aria-label="Close menu"
		>
			<svg
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

		<!-- Nav links -->
		<div class="flex flex-col px-6">
			{#each navItems as item}
				<a
					href={item.href}
					class="py-3 text-base text-gray-800 hover:text-accent transition-colors duration-200 {$page
						.url.pathname === item.href ||
					$page.url.pathname + '/' === item.href
						? 'text-accent'
						: ''}"
					aria-current={$page.url.pathname === item.href ||
					$page.url.pathname + '/' === item.href
						? 'page'
						: undefined}
					onclick={() => (open = false)}
				>
					{item.label}
				</a>
			{/each}
		</div>

		<!-- Social icons at bottom -->
		<div class="mt-auto border-t border-gray-200 px-6 py-6">
			<div class="flex gap-6 justify-center">
				<SocialLinks size={24} />
			</div>
		</div>
	</nav>
{/if}
