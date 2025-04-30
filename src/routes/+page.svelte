<script lang="ts">
    import { buildComparisonRows, echarts, generateDamageDistributionChart, load, type Player, type Skill, type SkillComparison } from "$lib/data";
    import type { EChartsOption } from "echarts";
    import { onMount } from "svelte";

    let summary1: Player | null = $state(null);
    let summary2: Player | null = $state(null);
    let comparisonRows = $state<SkillComparison[]>([]);

    onMount(() => {
        const { summary1: s1, summary2: s2 } = load();
        summary1 = s1;
        summary2 = s2;
        comparisonRows = buildComparisonRows(s1, s2);
    });
</script>

{#if summary1 && summary2}
    <div class="grid grid-cols-2 gap-6 text-sm text-white mt-4">
    <div class="ml-2">
      <div class="bg-gray-800 rounded-xl p-4 shadow-sm">
        <div class="text-lg font-semibold mb-1">{summary1.name}</div>
        <div class="text-gray-300">Total Damage: <span class="font-medium text-white">{summary1.totalDamage.formatted}</span></div>
        <div class="text-gray-400 text-xs mt-1">Duration: {summary1.duration.formatted}</div>
      </div>
    </div>

    <div class="mr-4">
      <div class="bg-gray-800 rounded-xl p-4 shadow-sm">
        <div class="text-lg font-semibold mb-1">{summary2.name}</div>
        <div class="text-gray-300">Total Damage: <span class="font-medium text-white">{summary2.totalDamage.formatted}</span></div>
        <div class="text-gray-400 text-xs mt-1">Duration: {summary2.duration.formatted}</div>
      </div>
    </div>
  </div>
  <div use:echarts={generateDamageDistributionChart(summary1, summary2)} class="p-[12px]" style="width: 100%; height: 200px;"></div>
  <div class="overflow-auto mt-4">
    <table class="table-auto border-collapse border border-gray-900 w-full text-sm">
      <thead class="bg-gray-700">
        <tr>
          <th class="border px-2 py-1 text-left">Skill</th>
          <th class="border px-2 py-1">{summary1.name}</th>
          <th class="border px-2 py-1">{summary2.name}</th>
        </tr>
      </thead>
      <tbody>
        {#each comparisonRows as row}
          <tr>
            <td class="border px-2 py-1 font-medium">
                <div class="flex items-center gap-2">
                  {#if row.icon}
                    <img src={row.icon} alt={row.name} class="w-10 h-10" />
                  {/if}
                  <span>{row.name}</span>
                </div>
              </td>

              <td class="border px-2 py-1 align-top w-[40%]">
                {#if row.skill1}
                  <div class="my-2">
                    <div class="relative h-5 bg-gray-600 rounded">
                      <div
                        class="absolute left-0 top-0 h-full bg-blue-800 rounded"
                        style="width: {row.skill1.damagePercentage.raw * 100}%"
                      ></div>
                      <div class="relative text-xs text-white font-bold text-center leading-5 z-10">
                        {row.skill1.damagePercentage.formatted}
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-4 text-md text-gray-100 mt-1 leading-tight font-bold">
                    <div>DPS: {row.skill1.dps.formatted}</div>
                    <div>Crit: {row.skill1.critRate.formatted}</div>
                    <div>Back: {row.skill1.backAttacks.formatted}</div>
                  </div>
                {:else}
                  <span class="text-gray-100 italic">N/A</span>
                {/if}
              </td>

              <td class="border px-2 py-1 align-top w-[40%]">
                {#if row.skill2}
                  <div class="my-2">
                    <div class="relative h-5 bg-gray-600 rounded">
                      <div
                        class="absolute left-0 top-0 h-full bg-green-800 rounded"
                        style="width: {row.skill2.damagePercentage.raw * 100}%"
                      ></div>
                      <div class="relative text-xs text-white font-bold text-center leading-5 z-10">
                        {row.skill2.damagePercentage.formatted}
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-4 text-md text-gray-100 mt-1 leading-tight font-bold">
                    <div>DPS: {row.skill2.dps.formatted}</div>
                    <div>Crit: {row.skill2.critRate.formatted}</div>
                    <div>Back: {row.skill2.backAttacks.formatted}</div>
                  </div>
                {:else}
                  <span class="text-gray-100 italic">N/A</span>
                {/if}
              </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
