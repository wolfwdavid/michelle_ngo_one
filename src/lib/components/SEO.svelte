<script lang="ts">
	import { page } from '$app/state';

	let {
		title = 'Michelle Ngo',
		description = 'Portfolio of Michelle Ngo, a multi-disciplinary creative working across advertising, film, UX design, and publishing.',
		image = '',
		type = 'website',
	} = $props();

	const siteUrl = 'https://wolfwdavid.github.io/michelle_ngo_one';
	const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`);
	const ogImage = $derived(image ? `https:${image}?w=1200&fm=jpg&q=80` : '');
	const fullTitle = $derived(title === 'Michelle Ngo' ? title : `${title} | Michelle Ngo`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content={type} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}
</svelte:head>
