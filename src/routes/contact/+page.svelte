<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	const contactEmail = $derived(data.siteSettings?.contactEmail ?? '');

	let formState: 'idle' | 'submitting' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');
	let formEl: HTMLFormElement | undefined = $state(undefined);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		formState = 'submitting';

		const formData = new FormData(event.target as HTMLFormElement);
		const payload = Object.fromEntries(formData);

		try {
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const result = await response.json();
			if (result.success) {
				formState = 'success';
			} else {
				formState = 'error';
				errorMessage = result.message ?? 'Submission failed. Please try again.';
			}
		} catch {
			formState = 'error';
			errorMessage = 'Network error. Please check your connection and try again.';
		}
	}

	function resetForm() {
		formState = 'idle';
		errorMessage = '';
		formEl?.reset();
	}

	function retryForm() {
		formState = 'idle';
		errorMessage = '';
	}
</script>

<SEO title="Contact" description="Get in touch with Michelle Ngo" />

<div class="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16">
	<div class="max-w-xl mx-auto">
		<Breadcrumb items={[{ label: 'Contact' }]} />

		<h1 class="text-2xl font-semibold text-gray-900 mt-4 mb-2">Contact</h1>
		<p class="text-base text-gray-500 mb-8">Have a project in mind? Get in touch.</p>

		{#if formState === 'success'}
			<div transition:fade={{ duration: 200 }} class="text-center py-12" role="status" aria-live="polite">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6 text-green-600 mx-auto mb-3"
				>
					<path
						fill-rule="evenodd"
						d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
						clip-rule="evenodd"
					/>
				</svg>
				<h2 class="text-lg font-semibold text-gray-900">Message sent</h2>
				<p class="text-base text-gray-500 mt-2">
					Thank you for reaching out. Michelle will get back to you soon.
				</p>
				<button
					onclick={resetForm}
					class="text-sm text-[#4A6FA5] hover:text-[#3B5D8C] mt-4 inline-block"
				>
					Send another message
				</button>
			</div>
		{/if}

		{#if formState === 'error'}
			<div transition:fade={{ duration: 200 }} class="text-center py-8 mb-6" role="status" aria-live="polite">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6 text-red-600 mx-auto mb-3"
				>
					<path
						fill-rule="evenodd"
						d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
						clip-rule="evenodd"
					/>
				</svg>
				<h2 class="text-lg font-semibold text-gray-900">Something went wrong</h2>
				<p class="text-base text-gray-500 mt-2">
					Your message could not be sent. Please try again{contactEmail ? ` or email Michelle at ${contactEmail}` : ''}.
				</p>
				<button
					onclick={retryForm}
					class="text-sm text-[#4A6FA5] hover:text-[#3B5D8C] mt-4 inline-block"
				>
					Try again
				</button>
			</div>
		{/if}

		{#if formState !== 'success'}
			<form bind:this={formEl} onsubmit={handleSubmit} class="flex flex-col gap-4">
				<input
					type="hidden"
					name="access_key"
					value={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? ''}
				/>
				<div class="hidden" aria-hidden="true">
					<input type="text" name="botcheck" tabindex="-1" autocomplete="off" />
				</div>

				<div>
					<label for="name" class="text-sm font-semibold text-gray-700 mb-1 block">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						placeholder="Your name"
						class="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] outline-none transition"
					/>
				</div>

				<div>
					<label for="email" class="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						placeholder="your@email.com"
						class="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] outline-none transition"
					/>
				</div>

				<div>
					<label for="message" class="text-sm font-semibold text-gray-700 mb-1 block"
						>Message</label
					>
					<textarea
						id="message"
						name="message"
						required
						placeholder="Tell Michelle about your project..."
						rows="6"
						class="w-full border border-gray-200 rounded-sm px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] outline-none transition min-h-[160px] resize-y"
					></textarea>
				</div>

				<button
					type="submit"
					disabled={formState === 'submitting'}
					class="w-full bg-[#4A6FA5] text-white py-3 rounded-sm text-base font-semibold hover:bg-[#3B5D8C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					aria-disabled={formState === 'submitting'}
				>
					{formState === 'submitting' ? 'Sending...' : 'Send Message'}
				</button>
			</form>
		{/if}
	</div>
</div>
