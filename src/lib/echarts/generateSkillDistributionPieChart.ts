import type { Skill } from '$lib/models';
import type { EChartsOption } from 'echarts';

export function generateSkillDistributionPieChart(skills: Skill[]): EChartsOption {
	const data = skills
		.filter(skill => skill.stats.totalDamage.raw > 0)
		.map(skill => ({
			name: skill.name,
			value: skill.stats.totalDamage.raw,
			label: {
				rich: {
				
				}
			}
		}))
		.sort((a, b) => a.value - b.value);

	const min = Math.min(...data.map(d => d.value));
	const max = Math.max(...data.map(d => d.value));

	return {
		backgroundColor: '#2c343c',
		title: {
			left: 'center',
			top: 20,
			textStyle: {
				color: '#ccc'
			}
		},
		tooltip: {
			trigger: 'item',
			formatter(data) {
				return "test";
			}
		},
		
		series: [
			{
				name: 'Total Damage',
				type: 'pie',
				radius: '90%',
				center: ['50%', '50%'],
				data,
				label: {
					show: true,
					height: 25,
					position: 'outside',
					// formatter(data) {
					// 	console.log(data);
					// 	return "<b>test</b>";
					// },
					formatter: '{b}',
					backgroundColor: {
						image: "./images/skills/BL_Skill_01_20.webp"
					},
					fontSize: 12
				},
				labelLine: {
					show: false
				},
				itemStyle: {
					color(param) {
						console.log(param);
						return '#555555'
					},
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				},		
				animationType: 'scale',
				animationEasing: 'elasticOut',
				animationDelay: function (idx: number) {
					return Math.random() * 200;
				}
			}
		]
	};
}