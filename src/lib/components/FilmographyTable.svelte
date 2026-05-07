<script lang="ts">
	import { base } from '$app/paths';
	import type { Project } from '$lib/contentful/types';

	let { projects }: { projects: Project[] } = $props();
</script>

<!-- Desktop table (lg+) -->
<div class="hidden lg:block overflow-x-auto">
	<table class="w-full text-left">
		<thead>
			<tr class="border-b-2 border-[#E5E7EB]">
				<th class="py-3 pr-4 text-sm font-semibold uppercase tracking-wider text-gray-500 w-20">Year</th>
				<th class="py-3 pr-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Title</th>
				<th class="py-3 pr-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Role</th>
				<th class="py-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Production Type</th>
			</tr>
		</thead>
		<tbody>
			{#each projects as project, i}
				<tr class="border-b border-[#E5E7EB] {i % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-gray-100 transition-colors">
					<td class="py-3 pr-4 text-sm font-semibold text-gray-900">{project.year ?? '---'}</td>
					<td class="py-3 pr-4">
						<a href="{base}/film-tv/{project.slug}/" class="text-base text-gray-900 hover:text-[#4A6FA5]">{project.title}</a>
					</td>
					<td class="py-3 pr-4 text-sm text-gray-500">{project.role ?? '---'}</td>
					<td class="py-3 text-sm text-gray-500">{project.productionType ?? '---'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Mobile card layout (< lg) -->
<div class="lg:hidden space-y-4">
	{#each projects as project}
		<div class="rounded border border-[#E5E7EB] p-4">
			<a href="{base}/film-tv/{project.slug}/" class="text-base font-semibold text-gray-900 hover:text-[#4A6FA5]">{project.title}</a>
			<div class="mt-2 grid grid-cols-2 gap-2 text-sm">
				<div><span class="font-semibold text-gray-500">Year:</span> <span class="text-gray-900">{project.year ?? '---'}</span></div>
				<div><span class="font-semibold text-gray-500">Role:</span> <span class="text-gray-900">{project.role ?? '---'}</span></div>
				<div class="col-span-2"><span class="font-semibold text-gray-500">Type:</span> <span class="text-gray-900">{project.productionType ?? '---'}</span></div>
			</div>
		</div>
	{/each}
</div>
