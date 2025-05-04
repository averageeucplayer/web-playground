<script lang="ts">
	import { IconArrowsHorizontal, IconTrendingDown, IconTrendingUp } from '@tabler/icons-svelte';
	import type { Comparison } from '$lib/models';
	import { ComparisonTarget, prepareCombinedData } from './types';

	interface Props {
		comparison: Comparison;
	}

	let { comparison }: Props = $props();
	let activeComparison: ComparisonTarget = $state(ComparisonTarget.Source);

	const summary = $derived.by(() => {
		return prepareCombinedData(comparison, activeComparison);
	});

	function getComparisonClass(source: number, target: number): string {
		if (target > source) return 'text-green-500';
		if (target < source) return 'text-red-500';
		return 'text-white';
	}

	function setActiveComparison(event: Event) {
		const element = event.target as HTMLElement;
		activeComparison = Number(element.dataset.direction) as ComparisonTarget;
	}
</script>

<div class="flex justify-center items-center gap-4 mb-6">
	<button
		onclick={setActiveComparison}
		data-direction={ComparisonTarget.Source}
		class="px-4 py-2 rounded-md border border-gray-500 focus:outline-none {activeComparison === ComparisonTarget.Source ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}"
	>
		{summary.source}
	</button>
	<IconArrowsHorizontal />
	<button
		onclick={setActiveComparison}
		data-direction={ComparisonTarget.Target}
		class="px-4 py-2 rounded-md border border-gray-500 focus:outline-none {activeComparison === ComparisonTarget.Target ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}"
	>
		{summary.target}
	</button>
</div>

{#snippet trend(name: string, source: number, target: number, formatted: string)}
    <div class="flex items-center gap-2">
        <div class={getComparisonClass(source, target)}>{name}: {formatted}</div>     
        {#if target > source}
            <IconTrendingUp class="text-green-500 w-4 h-4" />
        {:else}
            <IconTrendingDown class="text-red-500 w-4 h-4" />
        {/if}
    </div>
{/snippet}

{#each summary.skills as skill}
	<div class="flex flex-col gap-2 bg-zinc-900 p-4 rounded-xl shadow mb-4">
		<div class="flex items-center gap-3">
			<img src={skill.iconSrc} alt={skill.name} class="w-10 h-10 rounded" />
			<span class="text-white font-semibold text-lg">{skill.name}</span>
		</div>

		{#if skill.source && skill.target}
			<div class="grid grid-cols-2 gap-6 text-sm text-white mt-3">
				<div>
					<div class="text-gray-400 font-medium">{summary.source}</div>
					<div>DPS: {skill.source.dps.formatted}</div>
					<div>Crit: {skill.source.critRate.formatted}</div>
					<div>Back: {skill.source.backAttacks.formatted}</div>
					<div>CPM: {skill.source.castsPerMinute.formatted}</div>
				</div>

				<div>
					<div class="text-gray-400 font-medium">{summary.target}</div>
                    {@render trend("DPS", skill.source.dps.raw, skill.target.dps.raw, skill.target.dps.formatted)}
                    {@render trend("Crit", skill.source.critRate.raw, skill.target.critRate.raw, skill.target.critRate.formatted)}
                    {@render trend("Back", skill.source.backAttacks.raw, skill.target.backAttacks.raw, skill.target.backAttacks.formatted)}
                    {@render trend("CPM", skill.source.castsPerMinute.raw, skill.target.castsPerMinute.raw, skill.target.castsPerMinute.formatted)}
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-6 text-sm text-white mt-3">
				{#if skill.source}
					<div>
						<div class="text-gray-400 font-medium">{summary.source}</div>
						<div>DPS: {skill.source.dps.formatted}</div>
						<div>Crit: {skill.source.critRate.formatted}</div>
						<div>Back: {skill.source.backAttacks.formatted}</div>
						<div>CPM: {skill.source.castsPerMinute.formatted}</div>
					</div>
				{:else}
					<div class="h-full">
						<div class="text-gray-400 font-medium">{summary.target}</div>
						<div>Not used</div>
					</div>
				{/if}
		
				{#if skill.target}
					<div>
						<div class="text-gray-400 font-medium">{summary.target}</div>
						<div>DPS: {skill.target.dps.formatted}</div>
						<div>Crit: {skill.target.critRate.formatted}</div>
						<div>Back: {skill.target.backAttacks.formatted}</div>
						<div>CPM: {skill.target.castsPerMinute.formatted}</div>
					</div>
				{:else}
					<div class="h-full">
						<div class="text-gray-400 font-medium">{summary.target}</div>
						<div>Not used</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/each}
