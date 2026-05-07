<script lang="ts">
	import { socialLinks } from '$lib/config/navigation';

	let { size = 20, showLabels = false }: { size?: number; showLabels?: boolean } = $props();
</script>

{#each socialLinks as link}
	<a
		href={link.href}
		target="_blank"
		rel="noopener noreferrer"
		aria-label={link.label}
		class="text-gray-500 hover:text-accent transition-colors duration-200 inline-flex flex-col items-center"
	>
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			{#if link.icon === 'imdb'}
				<!-- IMDb: letters in rounded rect -->
				<rect x="1" y="4" width="22" height="16" rx="3" fill="currentColor" opacity="0.15" />
				<text
					x="12"
					y="15.5"
					text-anchor="middle"
					font-size="7"
					font-weight="700"
					fill="currentColor"
					font-family="sans-serif">IMDb</text
				>
			{:else if link.icon === 'linkedin'}
				<!-- LinkedIn "in" logo -->
				<path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				/>
			{:else if link.icon === 'vimeo'}
				<!-- Vimeo V play icon -->
				<path
					d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 003.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.48 4.807z"
				/>
			{:else if link.icon === 'youtube'}
				<!-- YouTube play button in rectangle -->
				<path
					d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
				/>
			{/if}
		</svg>
		{#if showLabels}
			<span class="text-xs mt-1">{link.label}</span>
		{/if}
	</a>
{/each}
