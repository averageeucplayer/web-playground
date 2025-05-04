import type { Comparison, Player, SkillStats } from "$lib/models";

export enum ComparisonTab {
    Overview,
    Skills,
    Rotations,
	SkillCasts
}

export enum ComparisonTarget {
    Source,
    Target
}

export interface SkillComparisonSummary {
    source: string;
    target: string;
    skills: SkillComparison[];
}

export interface SkillComparison {
    id: number;
    name: string;
    iconSrc: string;
    source: SkillStats | null;
    target: SkillStats | null;
}

export function prepareCombinedData(
	comparison: Comparison,
	comparisonTarget: ComparisonTarget
): SkillComparisonSummary {
	const sourcePlayer = comparisonTarget === ComparisonTarget.Source ? comparison.player1 : comparison.player2;
	const targetPlayer = comparisonTarget === ComparisonTarget.Source ? comparison.player2 : comparison.player1;

	const sourceSkillMap = new Map(sourcePlayer.skills.map(skill => [skill.id, skill]));
	const targetSkillMap = new Map(targetPlayer.skills.map(skill => [skill.id, skill]));

	const allSkillIds = new Set<number>([
		...sourceSkillMap.keys(),
		...targetSkillMap.keys()
	]);

	const skills: SkillComparison[] = [];

	for (const skillId of allSkillIds) {
		const sourceSkill = sourceSkillMap.get(skillId) ?? null;
		const targetSkill = targetSkillMap.get(skillId) ?? null;

		skills.push({
			id: skillId,
			name: sourceSkill?.name ?? targetSkill!.name,
			iconSrc: sourceSkill?.iconSrc ?? targetSkill!.iconSrc,
			source: sourceSkill?.stats ?? null,
			target: targetSkill?.stats ?? null
		});
	}

	return {
		source: sourcePlayer.name,
		target: targetPlayer.name,
		skills
	};
}