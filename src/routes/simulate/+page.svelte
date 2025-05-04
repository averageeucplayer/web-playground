<script lang="ts">
    import { goto } from '$app/navigation';
    import { createComparison, defaultConfig } from '$lib/api';
    import type { Comparison, SimulationConfig } from '$lib/models';
    import { IconDatabase } from '@tabler/icons-svelte';
	import Form from './Form.svelte';
    import { exportToEncountersDb } from '$lib/utils';
    import { simulateRaid } from '$lib/simulator';
	import { v7 as v7uuid } from 'uuid';
	
	interface State {
		player1: SimulationConfig;
		player2: SimulationConfig;
	}

	let state = $state<State>({
		player1: defaultConfig(),
		player2: defaultConfig(),
	});

	function onFirstConfigChange<T extends keyof SimulationConfig>(
        key: T,
        value: SimulationConfig[T]
    ): void {
        state.player1[key] = value;
    }

	function onSecondConfigChange<T extends keyof SimulationConfig>(
        key: T,
        value: SimulationConfig[T]
    ): void {
        state.player2[key] = value;
    }

	function onSubmit() {
		const id = createComparison([state.player1, state.player2]);
		goto(`#/comparison/#/${id}`);
	}

	function onExport() {
		const id = v7uuid();
		const createdOn = new Date().toISOString();
        const player1 = simulateRaid(state.player1);
        const player2 = simulateRaid(state.player2);
        
        const comparison: Comparison = {
            id,
            createdOn,
            player1,
            player2
        };

		exportToEncountersDb(comparison);
	}

	const isInvalid = state.player1.name == ""
		|| state.player2.name == "";

</script>
  
  <div class="px-6">
	<h1 class="text-3xl font-bold text-center mb-4">Simulate</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<Form config={state.player1} onChange={onFirstConfigChange} />
		<Form config={state.player2} onChange={onSecondConfigChange} />
	</div>
	<div class="text-center">
		<button
			disabled={isInvalid}
			onclick={onSubmit}
			type="button"
			class="btn btn-lg preset-filled mt-4">Submit</button>
		<button
			disabled={isInvalid}
			onclick={onExport}
			type="button"
			class="btn btn-lg preset-filled mt-4">Export to Encounters DB <IconDatabase/></button>
	</div>
</div>