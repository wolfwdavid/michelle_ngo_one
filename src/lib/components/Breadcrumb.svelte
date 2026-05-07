<script lang="ts">
	import { base } from '$app/paths';

	let {
		items,
	}: {
		items: Array<{ label: string; href?: string }>;
	} = $props();
</script>

<nav aria-label="Breadcrumb">
	<ol class="flex items-center gap-2 text-sm text-gray-500">
		<li>
			<a href="{base}/" class="hover:text-[#4A6FA5]">Home</a>
		</li>
		{#each items as item, i}
			<li class="flex items-center gap-2">
				<span aria-hidden="true" class="text-gray-300">/</span>
				{#if item.href}
					<a href={item.href} class="hover:text-[#4A6FA5]">{item.label}</a>
				{:else}
					<span class="text-gray-900">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
