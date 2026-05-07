<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data, children } = $props();

	// D-06: Always scroll to top on route change
	afterNavigate(() => {
		window.scrollTo(0, 0);
	});

	// D-09: Respect prefers-reduced-motion
	const reducedMotion = browser
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;
	const transitionDuration = reducedMotion ? 0 : 250;
</script>

<SEO
	title={data.siteSettings?.siteTitle ?? 'Michelle Ngo'}
	description="Portfolio of Michelle Ngo, a multi-disciplinary creative working across advertising, film, UX design, and publishing."
/>

<Header />
<main class="min-h-screen page-transition-container">
	{#key page.url.pathname}
		<div
			class="page-transition-panel"
			in:fade={{ duration: transitionDuration, delay: transitionDuration }}
			out:fade={{ duration: transitionDuration }}
		>
			{@render children()}
		</div>
	{/key}
</main>
<Footer />

<style>
	.page-transition-container {
		display: grid;
	}
	.page-transition-panel {
		grid-column-start: 1;
		grid-row-start: 1;
	}
</style>
