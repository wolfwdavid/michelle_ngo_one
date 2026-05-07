<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const resume = $derived(data.resume);
	const resumePdfUrl = $derived(resume.resumePdfUrl ?? data.siteSettings?.resumePdfUrl ?? null);
	const hasContent = $derived(
		resume.experience.length > 0 || resume.education.length > 0 || resume.skills.length > 0
	);
</script>

<SEO title="Resume" description="Michelle Ngo's professional resume and CV" />

<div class="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-16">
	<div class="max-w-3xl mx-auto">
		<Breadcrumb items={[{ label: 'Resume' }]} />

		<div class="flex justify-between items-center mt-4 mb-8">
			<h1 class="text-2xl font-semibold text-gray-900">Resume</h1>
			{#if resumePdfUrl}
				<a
					href={resumePdfUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 bg-[#4A6FA5] text-white px-4 py-2.5 rounded-sm text-sm font-semibold hover:bg-[#3B5D8C] transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"
						/>
						<path
							d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"
						/>
					</svg>
					Download PDF
				</a>
			{/if}
		</div>

		{#if hasContent}
			{#if resume.experience.length > 0}
				<div class="border border-gray-200 rounded-sm p-6 mb-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
						Experience
					</h2>
					{#each resume.experience as entry}
						<div class="py-4 border-b border-gray-100 last:border-b-0">
							<p class="text-base font-semibold text-gray-900">{entry.title}</p>
							<p class="text-sm text-gray-500 mt-1">{entry.company} | {entry.period}</p>
							{#if entry.description}
								<p class="text-base text-gray-700 mt-2 leading-relaxed">{entry.description}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			{#if resume.education.length > 0}
				<div class="border border-gray-200 rounded-sm p-6 mb-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
						Education
					</h2>
					{#each resume.education as entry}
						<div class="py-4 border-b border-gray-100 last:border-b-0">
							<p class="text-base font-semibold text-gray-900">{entry.degree}</p>
							<p class="text-sm text-gray-500 mt-1">{entry.institution} | {entry.year}</p>
						</div>
					{/each}
				</div>
			{/if}

			{#if resume.skills.length > 0}
				<div class="border border-gray-200 rounded-sm p-6 mb-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
						Skills
					</h2>
					<div class="flex flex-wrap gap-2">
						{#each resume.skills as skill}
							<span class="inline-flex bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full">
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		{:else}
			<div class="text-center py-12">
				<h2 class="text-lg font-semibold text-gray-900">Resume coming soon</h2>
				<p class="text-base text-gray-500 mt-2">
					Resume content is being prepared. Check back soon.
				</p>
			</div>
		{/if}
	</div>
</div>
