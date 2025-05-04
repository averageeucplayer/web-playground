import type { EChartsOption } from "echarts";
import type { Player } from "$lib/models";

export function generateSkillTransitionGraph(player: Player): EChartsOption {
	if (!player) return { series: [] };

	const skillMap = Object.fromEntries(player.skills.map(skill => [skill.id, skill]));

	const nodes = player.skills.map(skill => ({
		id: skill.id.toString(),
		name: skill.name,
		symbol: `image://${skill.iconSrc}`,
		symbolSize: 48,
		label: { show: false }
	}));

	const transitionCounts = new Map<string, number>();

	for (let i = 1; i < player.skillCastLog.length; i++) {
		const from = player.skillCastLog[i - 1].skillId.toString();
		const to = player.skillCastLog[i].skillId.toString();
		const key = `${from}->${to}`;
		transitionCounts.set(key, (transitionCounts.get(key) || 0) + 1);
	}

	const maxCount = Math.max(...transitionCounts.values());

	const links = Array.from(transitionCounts.entries()).map(([key, count]) => {
		const [source, target] = key.split("->");
		return {
			source,
			target,
			value: count,
			lineStyle: {
				width: 1 + (count / maxCount) * 4, // Line width from 1 to 5
				opacity: 0.7
			}
		};
	});

	return {
		backgroundColor: "#111827",
		tooltip: {
			formatter: (params: any) => {
				if (params.dataType === "edge") {
					const source = skillMap[params.data.source]?.name || params.data.source;
					const target = skillMap[params.data.target]?.name || params.data.target;
					return `${source} → ${target}<br>Transitions: ${params.data.value}`;
				} else if (params.dataType === "node") {
					const skill = skillMap[params.data.id];
					if (skill) {
						return `${skill.name}<br>Casts: ${skill.stats.castCount}`;
					}
				}
				return '';
			}
		},
		series: [
			{
				type: "graph",
				layout: "force",
				roam: true,
				force: {
					repulsion: 2000,
				},
				label: { show: false },
				data: nodes,
				links
			}
		]
	};
}
