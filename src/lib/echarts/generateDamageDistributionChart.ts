import type { Player } from "$lib/models";
import { formatCompactNumber, formatDecimal } from "$lib/utils";
import type { EChartsOption } from "echarts";

export function generateDamageDistributionChart(player1: Player | undefined, player2: Player): EChartsOption | undefined {
	if (!player1) return;

	const sourceSkills = player1.skills.filter(pr => !pr.isHyperAwakening);
	const targetSkills = player2.skills.filter(pr => !pr.isHyperAwakening);
	const skillIconMap: Record<string, string> = {};
	const allSkillNames = Array.from(new Set([
		...sourceSkills.map(s => s.name),
		...targetSkills.map(s => s.name)
	]));
	for (const skill of [...sourceSkills, ...targetSkills]) {
		if (!skillIconMap[skill.name]) {
			skillIconMap[skill.name] = skill.iconSrc;
		}
	}
	const skillIcons = allSkillNames.map(name => skillIconMap[name]);

	player1.skills.filter(pr => pr.isHyperAwakeningTechnique)
	player2.skills.filter(pr => pr.isHyperAwakeningTechnique)

	const player1DamageData = allSkillNames.map(name =>
		sourceSkills.find(s => s.name === name)?.stats.totalDamage.raw ?? 0
	);
	const player2DamageData = allSkillNames.map(name =>
		targetSkills.find(s => s.name === name)?.stats.totalDamage.raw ?? 0
	);
	const player1CPMData = allSkillNames.map(name =>
		sourceSkills.find(s => s.name === name)?.stats.castsPerMinute.raw ?? 0
	);
	const player2CPMData = allSkillNames.map(name =>
		targetSkills.find(s => s.name === name)?.stats.castsPerMinute.raw ?? 0
	);

	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
			formatter: (params: any) => {
				if (!params.length) return '';

				const skillIndex = params[0].dataIndex;
				const skillName = allSkillNames[skillIndex];		

				const seriesInfo = params.map((p: any) => {
					const isCPM = p.seriesName.includes('CPM');
					const value = isCPM ? formatDecimal(p.value) : formatCompactNumber(p.value);
					return `<strong>${p.seriesName}</strong>: ${value}`;
				}).join('<br/>');
		
				return `<div><strong>${skillName}</strong></div>${seriesInfo}`;
            }
		},
        height: 150,
		legend: {
            bottom: 10,
            data: [`${player1.name} Damage`, `${player2.name} Damage`, `${player1.name} CPM`, `${player2.name} CPM`],
            textStyle: {
                color: '#fff',
            },
            orient: 'horizontal',
            align: 'auto'
        },
		xAxis: {
			type: 'category',
			data: skillIcons.map((_, i) => `icon${i}`),
			axisLabel: {
				interval: 0,
				formatter: (value: string) => `{${value}| }`,
				rich: skillIcons.reduce((acc, icon, i) => {
					acc[`icon${i}`] = {
						height: 32,
						width: 32,
						align: 'center',
						backgroundColor: {
							image: icon
						}
					};
					return acc;
				}, {} as Record<string, any>)
			},
			axisTick: { show: false },
			axisLine: { show: false }
		},
		yAxis: [
			{
				type: 'value',
				name: 'Damage',
				position: 'left',
				splitNumber: 4,
				axisLabel: {
					color: '#fff',
					formatter: (value: number) => formatCompactNumber(value)
				}
			},
			{
				type: 'value',
				name: 'CPM',
				position: 'right',
				splitLine: { show: false },
				axisLabel: {
					color: '#fff'
				}
			}
		],
		series: [
			{
				name: `${player1.name} Damage`,
				type: 'bar',
				yAxisIndex: 0,
				data: player1DamageData,
				itemStyle: { color: '#1E40AF' }
			},
            {
                name: `${player1.name} CPM`,
                type: 'bar',
                yAxisIndex: 1,
                data: player1CPMData,
                itemStyle: { color: '#1E3A8A' },
                barGap: 0,
            },
			{
				name: `${player2.name} Damage`,
				type: 'bar',
				yAxisIndex: 0,
				data: player2DamageData,
				itemStyle: { color: '#065F46' }
			},
            {
                name: `${player2.name} CPM`,
                type: 'bar',
                yAxisIndex: 1,
                data: player2CPMData,
                itemStyle: { color: '#064E3B' }, 
                barGap: 0,
                
            }
		],
		backgroundColor: '#1F2937',
		grid: {
			left: '10%',
			right: '10%',
			top: '20%',
			bottom: '15%'
		}
	};
}
