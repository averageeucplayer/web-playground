<script lang="ts">
    import { onNewBuffs } from "$lib/module/lib/api";
    import { setBuffs } from "$lib/store";
    import type { Buff } from "$lib/types";
    import { onMount, type Snippet } from "svelte";
    import { writable } from "svelte/store";
    
    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
    let buffs = writable<Buff[]>([]);
    let unSubscribe: () => void;

    onMount(() => {
        onLoad();

        return () => {
            unSubscribe && unSubscribe();
        }
    });

    async function onLoad() {
        unSubscribe = await onNewBuffs((newBuffs) => {
            buffs.set(newBuffs);
        });
    }

    setBuffs(buffs);

</script>

{@render children?.()}