<script lang="ts">
    import { IconAffiliate, IconChartArea, IconChartBar, IconChartLine, IconReportAnalytics } from '@tabler/icons-svelte';
    import Overview from './Overview.svelte';
    import Skills from './Skills.svelte';
    import type { Comparison } from '$lib/models';
    import Rotations from './Rotations.svelte';
    import { ComparisonTab } from './types';
    import SkillCasts from './SkillCasts.svelte';

    interface Props {
        comparison: Comparison
    }

    let {
        comparison
    }: Props = $props();
    let selectedTab: ComparisonTab = $state(ComparisonTab.Overview);

    function onTab(event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        const tab = Number(target.dataset.tab) as ComparisonTab;
        selectedTab = tab;
    }

</script>

<div class="flex h-full">
    <div class="w-48 bg-gray-800 text-white flex flex-col">
        <button
            data-tab={ComparisonTab.Overview}
            class="p-4 cursor-pointer transition-colors"
            class:bg-gray-700={selectedTab === ComparisonTab.Overview}
            onclick={onTab}
        >
            <div class="flex items-center gap-2">
                <IconReportAnalytics class="w-5 h-5" />
                <span>Overview</span>
            </div>
        </button>
        <button
            data-tab={ComparisonTab.Skills}
            class="p-4 cursor-pointer transition-colors"
            class:bg-gray-700={selectedTab === ComparisonTab.Skills}
            onclick={onTab}
        >
            <div class="flex items-center gap-2">
                <IconChartBar class="w-5 h-5" />
                <span>Skills</span>
            </div>
        </button>
        <button
            data-tab={ComparisonTab.Rotations}
            class="p-4 cursor-pointer transition-colors"
            class:bg-gray-700={selectedTab === ComparisonTab.Rotations}
            onclick={onTab}
        >
            <div class="flex items-center gap-2">
                <IconAffiliate class="w-5 h-5" />
                <span>Rotations</span>
            </div>
        </button>
        <button
            data-tab={ComparisonTab.SkillCasts}
            class="p-4 cursor-pointer transition-colors"
            class:bg-gray-700={selectedTab === ComparisonTab.SkillCasts}
            onclick={onTab}
        >
            <div class="flex items-center gap-2">
                <IconChartArea class="w-5 h-5" />
                <span>Cast logs</span>
            </div>
        </button>
    </div>

    <div class="flex-1 bg-gray-900 text-white p-3">
        {#if selectedTab === ComparisonTab.Overview}
            <Overview
                summary1={comparison.player1}
                summary2={comparison.player2}
             />
        {:else if selectedTab === ComparisonTab.Skills}
            <Skills comparison={comparison} />
        {:else if selectedTab === ComparisonTab.Rotations}
            <Rotations comparison={comparison} />
        {:else if selectedTab === ComparisonTab.SkillCasts}
            <SkillCasts comparison={comparison} />
        {/if}
    </div>
</div>