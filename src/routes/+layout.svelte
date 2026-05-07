<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data, children } = $props();
</script>

<SEO
	title={data.siteSettings?.siteTitle ?? 'Michelle Ngo'}
	description="Portfolio of Michelle Ngo, a multi-disciplinary creative working across advertising, film, UX design, and publishing."
/>

<Header />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
