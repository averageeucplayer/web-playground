<script lang="ts">
    import type { Snippet } from "svelte";
    import "../app.css";
    import TopBar from "$lib/components/TopBar.svelte";
    
    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

</script>

<div class="flex flex-col size-full">
    <TopBar/>
    <main class="grow-1">
        {@render children?.()}
    </main>
</div>