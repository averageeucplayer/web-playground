<script lang="ts">
    import { echarts, generateSkillTransitionGraph } from "$lib/echarts";
    import type { Comparison, Player } from '$lib/models';
    import { ComparisonTarget } from "./types";

    interface Props {
        comparison: Comparison;
    }

    interface State {
        activeComparison: ComparisonTarget;
        player: Player;
    }

    let { comparison }: Props = $props();
	let state = $state<State>({
        activeComparison: ComparisonTarget.Source,
        player: comparison.player1
    });

    function setActiveComparison(event: Event) {
		const element = event.target as HTMLElement;
		state.activeComparison = Number(element.dataset.direction) as ComparisonTarget;
        
        if(state.activeComparison === ComparisonTarget.Target) {
            state.player = comparison.player2;
        }

        if(state.activeComparison === ComparisonTarget.Source) {
            state.player = comparison.player1;
        }
	}

</script>
<div>
    <button
		onclick={setActiveComparison}
		data-direction={ComparisonTarget.Source}
		class="px-4 py-2 rounded-md border border-gray-500 focus:outline-none {state.activeComparison === ComparisonTarget.Source ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}"
	>
		{state.player.name}
	</button>
	<button
		onclick={setActiveComparison}
		data-direction={ComparisonTarget.Target}
		class="px-4 py-2 rounded-md border border-gray-500 focus:outline-none {state.activeComparison === ComparisonTarget.Target ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}"
	>
		{state.player.name}
	</button>
</div>
<div class="p-4 flex">
    <div use:echarts={generateSkillTransitionGraph(state.player)} style="width: 100%; height: 800px;"></div>
</div>