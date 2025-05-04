<script lang="ts">
    import { Progress } from '@skeletonlabs/skeleton-svelte';
    import { onMount } from "svelte";
    import { page } from '$app/state';
    import { getComparison, getLastHashParam } from "$lib/api";
    import Main from './Main.svelte';
    import type { Comparison } from '$lib/models';

    type State = {
        type: "loading",
    } | {
        type: "loaded",
        comparison: Comparison
    } | {
        type: "error"
    }

    let state = $state<State>({
        type: "loading",
    });

    onMount(() => {
        onLoad();
    });

    async function onLoad() {
        const id = getLastHashParam(page.url);

        if(!id) {
            state.type = "error";
            return;
        }

        const comparison = await getComparison(id);

        if(!comparison) {
            state.type = "error";
            return;
        }

        state = {
            type: "loaded",
            comparison
        };
    }

</script>

{#if state.type === 'loading'}
    <div class="flex items-center justify-center h-screen">
        <div class="text-center w-128">
            <Progress value={null} />
            <p class="mt-2 text-gray-300">Loading</p>
        </div>
    </div>
{:else if state.type === 'loaded'}
    <Main comparison={state.comparison} />
{:else}
    <div class="flex items-center justify-center h-screen text-red-400">
        Failed to load comparison.
    </div>
{/if}