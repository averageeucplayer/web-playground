<script lang="ts">

  import type { EChartsOption } from "echarts";
  import { onMount } from "svelte";
    import type { SkillComparison, Player } from "$lib/models";

    import Landing from "$lib/components/Landing.svelte";

  let summary1: Player | null = $state(null);
  let summary2: Player | null = $state(null);
  let comparisonRows = $state<SkillComparison[]>([]);
  let showModal = $state(false);

  
  function openModal() {
      showModal = true;
  }

  function closeModal() {
      showModal = false;
  }

  onMount(() => {
      // const { players: [s1, s2] } = load();
      // summary1 = s1;
      // summary2 = s2;
      // comparisonRows = buildComparisonRows(s1, s2);
  });

  // let value = $state([40]);

</script>

<Landing/>
<!-- <Slider name="value" {value} onValueChange={(e) => (value = e.value)} height="h-1" markers={[25, 50, 75]} /> -->
<!-- <button onclick={openModal} class="cursor-pointer absolute m-4 top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4">
  Upload Logs
</button>
{#if showModal}
  <Modal
    showModal={showModal}
    closeModal={closeModal}/>
{/if} -->
<!-- {#if summary1 && summary2}
  <Comparison
    comparisonRows={comparisonRows}
    summary1={summary1}
    summary2={summary2} />
{/if} -->
