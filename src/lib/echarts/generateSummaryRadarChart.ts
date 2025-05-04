import type { Player } from "$lib/models";
import { formatDecimal, formatPercent } from "$lib/utils";
import type { EChartsOption } from "echarts";

export function generateSummaryRadarChart(player1: Player, player2: Player): EChartsOption {
    const metrics = [
        {
            key: 'backAttacks',
            label: 'Back attacks',
            max: 1,
            get: (p: Player) => p.stats.backAttacks.raw,
            getFormatted: (p: Player) => p.stats.backAttacks.formatted,
        },
        {
            key: 'brandDebuff',
            label: 'Brand',
            max: 1,
            get: (p: Player) => p.stats.buffUptimes.brandDebuff.raw,
            getFormatted: (p: Player) => p.stats.buffUptimes.brandDebuff.formatted,
        },
        {
            key: 'attackPowerBuff',
            label: 'Atk Buff',
            max: 1,
            get: (p: Player) => p.stats.buffUptimes.attackPowerBuff.raw,
            getFormatted: (p: Player) => p.stats.buffUptimes.attackPowerBuff.formatted,
        },
        {
            key: 'identityBuff',
            label: 'Identity',
            max: 1,
            get: (p: Player) => p.stats.buffUptimes.identityBuff.raw,
            getFormatted: (p: Player) => p.stats.buffUptimes.identityBuff.formatted,
        },
        {
            key: 'dps',
            label: 'DPS',
            get: (p: Player) => p.stats.dps.raw,
            getFormatted: (p: Player) => p.stats.dps.formatted,
        },
        {
            key: 'castsPerMinute',
            label: 'Casts/min',
            get: (p: Player) => p.stats.castsPerMinute,
            getFormatted: (p: Player) => formatDecimal(p.stats.castsPerMinute),
        },
        {
            key: 'critRate',
            label: 'Crit Rate',
            max: 1,
            get: (p: Player) => p.stats.critRate,
            getFormatted: (p: Player) => formatPercent(p.stats.critRate),
        },
    ];

    const normalized = (val: number, max: number) => (max === 0 ? 0 : (val / max));

    const player1Values = metrics.map((m) => {
        const max = ['dps', 'castsPerMinute'].includes(m.key)
            ? Math.max(m.get(player1), m.get(player2))
            : m.max;
        return normalized(m.get(player1), max!);
    });
    
    const player2Values = metrics.map((m) => {
        const max = ['dps', 'castsPerMinute'].includes(m.key)
            ? Math.max(m.get(player1), m.get(player2))
            : m.max;
        return normalized(m.get(player2), max!);
    });

    return {
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const player = params.data.name === player1.name ? player1 : player2;
                return `<strong>${params.data.name}</strong><br/>` +
                    params.value
                        .map((_: any, i: number) => {
                            return `${metrics[i].label}: ${metrics[i].getFormatted(player)}`;
                        })
                        .join('<br/>');
            },
        },
        legend: {
            data: [player1.name, player2.name],
            textStyle: {
                color: '#fff',
            },
        },
        radar: {
            indicator: metrics.map((m) => ({
                name: m.label,
                max: 1,
            })),
            
            axisName: {
                color: '#fff',
            },
            splitLine: {
                lineStyle: {
                    color: '#374151',
                },
            },
            splitArea: {
                areaStyle: {
                    color: ['#1F2937'],
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#4B5563',
                },
            },
        },
        series: [
            {
                name: 'Comparison',
                type: 'radar',
                data: [
                    {
                        value: player1Values,
                        name: player1.name,
                        itemStyle: { color: '#1E40AF' },
                    },
                    {
                        value: player2Values,
                        name: player2.name,
                        itemStyle: { color: '#065F46' },
                    },
                ],
                lineStyle: {
                    width: 4,
                }
            },
        ],
        backgroundColor: '#1F2937',
    };
}