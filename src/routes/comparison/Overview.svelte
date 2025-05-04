<script lang="ts">
    import { echarts, generateDamageDistributionChart, generateSummaryRadarChart } from "$lib/echarts";
    import type { Player } from "$lib/models";

    interface Props {
        summary1: Player,
        summary2: Player
    }

    let {
        summary1,
        summary2
    }: Props = $props();

    const topSkill1 = summary1.skills.find(pr => pr.id === summary1.stats.topDamageSkill.skillId)!;
    const hyperAwakeningSkill1 = summary1.skills.find(pr => pr.isHyperAwakening)!;
    const topSkill2 = summary2.skills.find(pr => pr.id === summary2.stats.topDamageSkill.skillId)!;
    const hyperAwakeningSkill2 = summary2.skills.find(pr => pr.isHyperAwakening)!;
</script>

<div class="grid grid-cols-2 gap-6 text-sm text-white">
    <div class="ml-4">
        <div class="bg-gray-800 rounded-xl p-6 shadow-sm flex justify-between gap-6 items-start">
            <div class="space-y-3">
                <div class="flex items-center">
                    <img class="w-6 mr-2" src={summary1.classSrc} alt={summary1.className} />
                    <div class="text-lg font-semibold">{summary1.name}</div>
                </div>
                <div class="text-gray-300">
                    Total Damage: <span class="font-medium text-white">{summary1.stats.totalDamage.formatted}</span>
                </div>
                <div class="text-gray-400 text-xs">Duration: {summary1.duration.formatted}</div>
            </div>

            <div class="space-y-4 text-right">
                <div>
                    <div class="text-xs text-gray-400">Top Damage Skill</div>
                    <div class="flex items-center gap-3 justify-end">
                        <img src={topSkill1.iconSrc} alt={topSkill1.name} class="w-8 h-8 rounded" />
                        <div>
                            <div class="text-white font-medium">{topSkill1.name}</div>
                            <div class="text-gray-400 text-xs">{summary1.stats.topDamageSkill.formatted}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="text-xs text-gray-400">Hyper Awakening</div>
                    <div class="flex items-center gap-3 justify-end">
                        <img src={hyperAwakeningSkill1.iconSrc} alt={hyperAwakeningSkill1.name} class="w-8 h-8 rounded" />
                        <div>
                            <div class="text-white font-medium">{hyperAwakeningSkill1.name}</div>
                            <div class="text-gray-400 text-xs">{hyperAwakeningSkill1.stats.totalDamage.formatted}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mr-4">
        <div class="bg-gray-800 rounded-xl p-6 shadow-sm flex justify-between gap-6 items-start">
            <div class="space-y-3">
                <div class="flex items-center">
                    <img class="w-6 mr-2" src={summary2.classSrc} alt={summary2.className} />
                    <div class="text-lg font-semibold">{summary2.name}</div>
                </div>
                <div class="text-gray-300">
                    Total Damage: <span class="font-medium text-white">{summary2.stats.totalDamage.formatted}</span>
                </div>
                <div class="text-gray-400 text-xs">Duration: {summary2.duration.formatted}</div>
            </div>

            <div class="space-y-4 text-right">
                <div>
                    <div class="text-xs text-gray-400">Top Damage Skill</div>
                    <div class="flex items-center gap-3 justify-end">
                        <img src={topSkill2.iconSrc} alt={topSkill2.name} class="w-8 h-8 rounded" />
                        <div>
                            <div class="text-white font-medium">{topSkill2.name}</div>
                            <div class="text-gray-400 text-xs">{summary2.stats.topDamageSkill.formatted}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="text-xs text-gray-400">Hyper Awakening</div>
                    <div class="flex items-center gap-3 justify-end">
                        <img src={hyperAwakeningSkill2.iconSrc} alt={hyperAwakeningSkill2.name} class="w-8 h-8 rounded" />
                        <div>
                            <div class="text-white font-medium">{hyperAwakeningSkill2.name}</div>
                            <div class="text-gray-400 text-xs">{hyperAwakeningSkill2.stats.totalDamage.formatted}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="p-4 flex">
    <div use:echarts={generateDamageDistributionChart(summary1, summary2)} style="width: 100%; height: 300px;"></div>
</div>

<div class="p-4">
    <div use:echarts={generateSummaryRadarChart(summary1, summary2)} style="width: 100%; height: 400px;"></div>
</div>
