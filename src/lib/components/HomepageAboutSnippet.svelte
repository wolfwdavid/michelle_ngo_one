<script lang="ts">
	import { base } from '$app/paths';
	import ScrollReveal from './ScrollReveal.svelte';
</script>

<section class="bg-[#F5F5F5] px-4 py-12 lg:px-8">
	<div class="mx-auto max-w-xl text-center">
		<ScrollReveal>
			<h2 class="mb-4 text-2xl font-semibold text-gray-900">About Michelle</h2>
			<p class="text-base leading-relaxed text-gray-700">
				Michelle Ngo is a multi-disciplinary creative working across advertising, film and television,
				UX design, social media, publishing, and copywriting. Her work spans concept to completion.
			</p>
			<a
				href="{base}/about/"
				class="mt-4 inline-block text-sm text-[#4A6FA5] hover:text-[#3B5D8C]"
			>
				Read Michelle's full bio
			</a>
		</ScrollReveal>
	</div>
</section>
