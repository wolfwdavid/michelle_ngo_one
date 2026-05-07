<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { navItems } from '$lib/config/navigation';
	import MobileDrawer from './MobileDrawer.svelte';

	let drawerOpen = $state(false);
</script>

<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
	<div class="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
		<!-- Site name -->
		<a href="{base}/" class="text-2xl font-semibold tracking-tight text-gray-900">
			Michelle Ngo
		</a>

		<!-- Desktop nav -->
		<nav class="hidden lg:flex items-center gap-6">
			{#each navItems as item}
				<a
					href={item.href}
					class="text-sm text-gray-800 hover:text-accent transition-colors duration-200 {$page
						.url.pathname === item.href ||
					$page.url.pathname + '/' === item.href
						? 'text-accent'
						: ''}"
					aria-current={$page.url.pathname === item.href ||
					$page.url.pathname + '/' === item.href
						? 'page'
						: undefined}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Hamburger (mobile only) -->
		<button
			class="lg:hidden p-2"
			onclick={() => (drawerOpen = true)}
			aria-label="Open menu"
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
				<line x1="3" y1="6" x2="21" y2="6" />
				<line x1="3" y1="12" x2="21" y2="12" />
				<line x1="3" y1="18" x2="21" y2="18" />
			</svg>
		</button>
	</div>
</header>

<MobileDrawer bind:open={drawerOpen} />
