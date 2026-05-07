<script lang="ts">
	import { inview } from 'svelte-inview';
	import type { Snippet } from 'svelte';

	let {
		children,
		delay = 0,
		class: className = '',
	}: {
		children: Snippet;
		delay?: number;
		class?: string;
	} = $props();

	let isVisible = $state(false);

	function handleEnter() {
		isVisible = true;
	}
</script>

<div
	use:inview={{ threshold: 0.1, unobserveOnEnter: true }}
	oninview_enter={handleEnter}
	class="scroll-reveal {className}"
	class:scroll-reveal--visible={isVisible}
	style:transition-delay="{delay}ms"
>
	{@render children()}
</div>

<style>
	.scroll-reveal {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 400ms ease-out, transform 400ms ease-out;
	}
	.scroll-reveal--visible {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
