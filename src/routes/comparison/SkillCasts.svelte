<script lang="ts">
    import { echarts, generateSkillCastAreaChart } from "$lib/echarts";
    import type { Comparison, Player, SkillCast, SkillComparison } from "$lib/models";
    import type { EChartsOption } from "echarts";
    import { onMount } from "svelte";

    interface Props { 
        comparison: Comparison;
    }

    interface State {
        skills: {
            id: number;
            name: string;
            iconSrc: string;
        }[];
        source: SkillCast[];
        target: SkillCast[];
        selectedSkillId: number;
    }

    let {
        comparison
    }: Props = $props();

    const state = $state<State>(onLoad(comparison));

    function onLoad(comparison: Comparison, selectedSkillId?: number): State {
        const skillMap = new Map<number, { id: number; name: string; iconSrc: string }>();
        const source = comparison.player1;
        const target = comparison.player2;

        for (const skill of source.skills.filter(pr => !pr.isHyperAwakening)) {
            skillMap.set(skill.id, {
                id: skill.id,
                name: skill.name,
                iconSrc: skill.iconSrc
            });
        }

        for (const skill of target.skills.filter(pr => !pr.isHyperAwakening)) {
            if (!skillMap.has(skill.id)) {
                skillMap.set(skill.id, {
                    id: skill.id,
                    name: skill.name,
                    iconSrc: skill.iconSrc
                });
            }
        }

        const skills = Array.from(skillMap.values());

        const selectedSkill = skills.find(skill => skill.id === selectedSkillId) || skills[0];

        const filteredSourceLogs = source.skills
            .find(skill => skill.id === selectedSkill.id)?.castLog || [];

        const filteredTargetLogs = target.skills
            .find(skill => skill.id === selectedSkill.id)?.castLog || [];

        return {
            source: filteredSourceLogs,
            target: filteredTargetLogs,
            selectedSkillId: selectedSkill.id,
            skills,
        };
    }

    function selectCastLog(skillId: number) {
        const source = comparison.player1;
        const target = comparison.player2;

        const filteredSourceLogs = source.skills
            .find(skill => skill.id === skillId)?.castLog || [];

        const filteredTargetLogs = target.skills
            .find(skill => skill.id === skillId)?.castLog || [];

        state.source = filteredSourceLogs;
        state.target = filteredTargetLogs;
    }

    function onSelect(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const button = target.closest('button');

        if (!button) {
            return;
        }

        const skillId = Number(button.dataset.id);
        state.selectedSkillId = skillId;
        selectCastLog(skillId);
    }
 
</script>

<div class="flex p-2">
    {#each state.skills as skill}
        <button
            data-id={skill.id}
            onclick={onSelect}
            class={`flex-1 flex items-center justify-center gap-3 p-2 
                ${skill.id === state.selectedSkillId ? 'bg-[#1F2937] text-white' : 'bg-gray-700 text-gray-300'} 
                hover:bg-[#1F2937] transition duration-200 ease-in-out`}
        >
            <img src={skill.iconSrc} alt={skill.name} class="w-10 h-10 rounded" />
    </button>
    {/each}
</div>

{#if state.source}
    <div class="p-4">
        <div use:echarts={generateSkillCastAreaChart(state.source)} style="width: 100%; height: 400px;"></div>
    </div>
{/if}

{#if state.target}
    <div class="p-4">
        <div use:echarts={generateSkillCastAreaChart(state.target)} style="width: 100%; height: 400px;"></div>
    </div>
{/if}