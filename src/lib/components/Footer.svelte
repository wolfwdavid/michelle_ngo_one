<script lang="ts">
	import { base } from '$app/paths';
	import SocialLinks from './SocialLinks.svelte';
</script>

<footer class="bg-gray-50 pt-12 pb-8">
	<div class="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center gap-4">
		<!-- Social icons -->
		<div class="flex gap-4">
			<SocialLinks size={20} />
		</div>

		<!-- Copyright -->
		<p class="text-sm text-gray-500">&copy; 2026 Michelle Ngo</p>

		<!-- Contact link -->
		<a
			href="{base}/contact/"
			class="text-sm text-gray-500 hover:text-accent transition-colors duration-200"
		>
			Contact Me
		</a>
	</div>
</footer>
