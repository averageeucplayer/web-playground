import type { SkillCast } from "$lib/models";
import { formatCompactNumber } from "$lib/utils";
import type { EChartsOption } from "echarts";

export function generateSkillCastAreaChart(castLog: SkillCast[]): EChartsOption {
	const baseLineSeries: [number, number][] = new Array(castLog.length);
	const flagSeriesMap: Record<string, { name: string; color: string; data: [number, number][] }> = {
		crit: { name: 'Critical Hit', color: '#F59E0B', data: [] },
		back: { name: 'Back Attack', color: '#10B981', data: [] },
		brand: { name: 'Brand Debuff', color: '#EF4444', data: [] },
		atkBuff: { name: 'ATK Buff', color: '#8B5CF6', data: [] },
		identity: { name: 'Identity Buff', color: '#3B82F6', data: [] },
		hat: { name: 'Hat Buff', color: '#EC4899', data: [] }
	};

	castLog.reduce((_, cast) => {
		const point: [number, number] = [cast.timestamp, cast.damage];
		baseLineSeries.push(point);

		if (cast.isCritical) flagSeriesMap.crit.data.push(point);
		if (cast.isBackattack) flagSeriesMap.back.data.push(point);
		if (cast.hadBrandDebuff) flagSeriesMap.brand.data.push(point);
		if (cast.hadAttackPowerBuff) flagSeriesMap.atkBuff.data.push(point);
		if (cast.hadIdentityBuff) flagSeriesMap.identity.data.push(point);
		if (cast.hadHatBuff) flagSeriesMap.hat.data.push(point);

		return _;
	}, null);

	return {
		backgroundColor: '#1F2937',
		title: {
			textStyle: { color: '#fff' }
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'cross' },
			formatter: (params: any) => {
				const point = Array.isArray(params) ? params[0] : params;
				const [time, dmg] = point.data;
				return `Time: ${time}<br/>Damage: ${dmg}`;
			}
		},
		xAxis: {
            type: 'time',
			name: 'Timestamp',
			axisLabel: { 
				color: '#ccc',
			},
			splitLine: { show: false }
		},
		yAxis: {
			type: 'value',
			name: 'Damage',
			axisLabel: {
                color: '#fff',
                formatter: (value: number) => formatCompactNumber(value)
            },
			splitLine: { lineStyle: { color: '#444' } },
		},
		legend: {
			top: 30,
			textStyle: { color: '#fff' }
		},
		series: [
			{
				name: 'Damage Over Time',
				type: 'line',
				data: baseLineSeries,
				areaStyle: { color: 'rgba(59, 130, 246, 0.3)' },
				lineStyle: { color: '#3B82F6', width: 2 },
				symbol: 'none',
				emphasis: { disabled: true }
			},
			...Object.values(flagSeriesMap).map(flag => ({
				name: flag.name,
				type: 'scatter' as const,
				data: flag.data,
				symbolSize: 8,
				itemStyle: { color: flag.color },
				emphasis: { scale: 1.5 }
			}))
		]
	};
}
